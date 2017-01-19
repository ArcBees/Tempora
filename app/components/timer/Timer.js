import moment from 'moment';
import React, { Component } from 'react';
import ReactTimeout from 'react-timeout';
import DatePicker from 'react-datepicker';
import TimePicker from 'rc-time-picker';
import { Link } from 'react-router';

import * as StorageService from '../../services/StorageService';
import * as WorklogService from '../../services/WorklogService';
import * as ProjectService from '../../services/ProjectService';
import * as IssueService from '../../services/IssueService';
import * as DateUtils from '../../utils/DateUtils';

import './Timer.scss';

const STATE = {
    time: "0:00",
    timeSeconds: "00",
    projectId: StorageService.getActiveProjectId(),
    projectName: StorageService.getActiveProjectName(),
    issueId: StorageService.getActiveIssueId(),
    issueKey: StorageService.getActiveIssueKey(),
    date: StorageService.getActiveDate() ? StorageService.getActiveDate() : moment(),
    comment: StorageService.getActiveComment() ? StorageService.getActiveComment() : "",
    selectedWorklogId: null,
    viewType: StorageService.getViewType() ? StorageService.getViewType() : "timer"
};

export default class Timer extends Component {
    static contextTypes = {
        settings: React.PropTypes.object,
        user: React.PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = STATE;
        this.time = 0;
        this.showTimer();

        window.eventEmitter.addListener('selectWorklog', this.setSelectedWorklog.bind(this));
        window.eventEmitter.addListener('projectChange', this.fetchProject.bind(this));
        window.eventEmitter.addListener('issueChange', this.fetchIssue.bind(this));
    }

    // Timer states

    startTimer() {
        StorageService.setDateStartMoment(moment().toISOString());
        StorageService.startTimer();
        this.tick();
    }

    showTimer() {
        window.eventEmitter.emitEvent('unselectActiveWorklog');

        this.setState({
            time: "0:00",
            timeSeconds: "00",
            projectName: StorageService.getActiveProjectName(),
            projectId: StorageService.getActiveProjectId(),
            issueId: StorageService.getActiveIssueId(),
            issueKey: StorageService.getActiveIssueKey(),
            comment: StorageService.getActiveComment() ? StorageService.getActiveComment() : "",
            date: StorageService.getActiveDate() ? StorageService.getActiveDate() : moment(),
            selectedWorklogId: null,
            viewType: 'timer'
        });
        StorageService.setViewType('timer');

        if (StorageService.isTimerStarted() === 'true') {
            if (StorageService.isTimerPaused() === 'false') {
                this.tick();
            } else {
                const startTime = StorageService.getDateStartMoment();
                const endTime = StorageService.getDatePauseMoment();
                this.time = this.getDurationBetweenDates(moment(endTime), moment(startTime));
                this.setState({
                    time: this.getTimeFromMilliseconds(),
                    timeSeconds: this.getSecondsFromDuration()
                });
            }
        }
    }

    pauseTimer() {
        StorageService.setDatePauseMoment(moment().toISOString());
        StorageService.pauseTimer();
    }

    unpauseTimer() {
        const startedAt = moment(StorageService.getDateStartMoment());
        const pausedAt = moment(StorageService.getDatePauseMoment());
        const timeElapsed = pausedAt.diff(startedAt);

        StorageService.setDateStartMoment(moment().subtract(moment.duration(timeElapsed)).toISOString());
        StorageService.unpauseTimer();
        this.tick();
    }

    stopTimer() {
        if (!StorageService.getActiveProjectId()) {
            window.eventEmitter.emitEvent('requestModal', ["Oups!", "You need to select a project."]);
        } else if (!StorageService.getActiveIssueKey()) {
            window.eventEmitter.emitEvent('requestModal', ["Oups!", "You need to select a task."]);
        } else {
            StorageService.stopTimer();
            StorageService.setTimeSpentInSeconds(Math.round(moment.duration(this.time).asSeconds()));

            let worklog = this.buildWorklog();

            WorklogService.createWorklog(worklog)
                .then(() => {
                    window.eventEmitter.emitEvent('refreshWorklogsAndTime');
                    this.setState({
                        time: '0:00',
                        timeSeconds: '00'
                    });
                    this.clearData();
                })
                .catch(error => window.eventEmitter.emitEvent('requestModal', ["Oups!", error]));
        }
    }

    // Worklogs

    setSelectedWorklog(worklog) {
        this.setState({
            selectedWorklogId: worklog.id,
            projectId: worklog.issue.projectId,
            issueId: worklog.issue.id,
            issueKey: worklog.issue.key,
            viewType: 'worklog'
        });
        StorageService.setWorklogProjectId(worklog.issue.projectId);
        StorageService.setViewType('worklog');

        // TODO: Find a lighter way to get the project name than fetching the entire project
        ProjectService.getProject(worklog.issue.projectId)
            .then(project => {
                this.setState({
                    projectName: project.name,
                    duration: worklog.timeSpentSeconds,
                    time: WorklogService.getTimeSpentInHours(worklog.timeSpentSeconds),
                    timeSeconds: "00",
                    issue: worklog.issue.key,
                    date: worklog.dateStarted,
                    comment: worklog.comment
                });
                StorageService.setWorklogProjectName(project.name);
            });
    }

    saveSelectedWorklog() {
        let worklog = this.buildWorklogForUpdate();

        WorklogService.updateWorklog(this.state.selectedWorklogId, worklog)
            .then(() => {
                window.eventEmitter.emitEvent('refreshWorklogsAndTime');
                this.showTimer();
            })
            .catch(error => window.eventEmitter.emitEvent('requestModal', ["Oups!", error]));
    }

    deleteSelectedWorklog() {
        if (confirm("Are you sure you want to delete this entry?")) {
            WorklogService.deleteWorklog(this.state.selectedWorklogId)
                .then(() => {
                    window.eventEmitter.emitEvent('refreshWorklogsAndTime');
                    this.showTimer();
                })
                .catch(error => window.eventEmitter.emitEvent('requestModal', ["Oups!", error]));
        }
    }

    // Functions and helpers

    tick() {
        let startTime = StorageService.getDateStartMoment();

        this.time = this.getDurationBetweenDates(moment(), moment(startTime));
        this.setState({
            time: this.getTimeFromMilliseconds(),
            timeSeconds: this.getSecondsFromDuration()
        });

        if (StorageService.isTimerStarted() === 'true' && StorageService.isTimerPaused() === 'false') {
            // The tick will be called multiple times per second but it will result
            // in a quicker response when clicking on the play/stop button
            let timeout = setTimeout(() => this.tick(), 500);
        }
    }

    buildWorklog() {
        return {
            author: {
                name: this.context.user.name
            },
            issue: {
                projectId: StorageService.getActiveProjectId(),
                key: StorageService.getActiveIssueKey()
            },
            timeSpentSeconds: this.getRoundedTime(),
            dateStarted: StorageService.getDateStartMoment(),
            comment: this.state.comment
        };
    }

    buildWorklogForUpdate() {
        return {
            timeSpentSeconds: this.state.duration > 0 ? this.state.duration : 60,
            dateStarted: moment(this.state.date).toISOString(),
            comment: this.state.comment,
            issue: {
                projectId: this.state.projectId,
                key: this.state.issueKey
            }
        };
    }

    getTimeFromMilliseconds() {
        return moment.duration(this.time, 'milliseconds').format(DateUtils.DateFormat.TIME, { trim: false });
    }

    getDurationBetweenDates(now, then) {
        return now.diff(then);
    }

    getSecondsFromDuration() {
        let seconds = moment.duration(this.time, 'milliseconds').seconds()
        return seconds <= 9 ? "0" + seconds : seconds;
    }

    getRoundedTime() {
        const round = this.context.settings.timeRound * 60;
        const seconds = StorageService.getTimeSpentInSeconds();
        if(round > 0) {
            if(seconds < round) {
                return round;
            }
            const rounded = (seconds % round) >= round / 2 ? parseInt(seconds / round) * round + round : parseInt(seconds / round) * round;
            StorageService.setTimeSpentInSeconds(rounded);
            return rounded;
        } else {
            return seconds;
        }
    }

    fetchProject() {
        if (this.state.viewType === 'timer') {
            StorageService.setActiveIssueId("");
            StorageService.setActiveIssueKey("");
        } else {
            StorageService.setWorklogIssueId("");
            StorageService.setWorklogIssueKey("");
        }

        ProjectService.getProject(this.state.viewType === 'timer' ? StorageService.getActiveProjectId() : StorageService.getWorklogProjectId())
            .then(project => {
                this.setState({
                    projectId: project.id,
                    projectName: project.name,
                    time: "0:00",
                    timeSeconds: "00",
                    issueId: "",
                    issueKey: "-",
                    date: moment(),
                    comment: ""
                });
                if (this.state.viewType === 'timer') {
                    StorageService.setActiveProjectId(project.id);
                    StorageService.setActiveProjectName(project.name);
                    if (StorageService.isTimerStarted() === 'true' && StorageService.isTimerPaused() === 'false') {
                        this.tick();
                    }
                } else {
                    StorageService.setWorklogProjectId(project.id);
                    StorageService.setWorklogProjectName(project.name);
                }
            });
    }

    fetchIssue() {
        IssueService.getIssue(this.state.viewType === 'timer' ? StorageService.getActiveIssueId() : StorageService.getWorklogIssueId())
            .then(issue => this.setState({
                issueId: issue.id,
                issueKey: issue.key
             }));
    }

    clearData() {
        StorageService.clearActiveTimer();
        StorageService.stopTimer();
        this.setState(STATE);
    }

    clearDataConfirm() {
        if (confirm("Are you sure you want to delete this?")) {
            this.clearData();
        }
    }

    // Handling components change

    timeChange(time) {
        this.setState({ duration: ((time.minutes() * 60) + (time.hours() * 3600)) });
    }

    dateChange(date) {
        this.setState({
            date: date
        });

        if (this.state.viewType === 'timer') {
            StorageService.setActiveDate(moment(date).toISOString());
        }
    }

    commentChange(event) {
        this.setState({
            comment: event.target.value
        });

        if (this.state.viewType === 'timer') {
            StorageService.setActiveComment(this.state.comment);
        }
    }

    // Template rendering

    renderSeconds() {
        if (this.state.timeSeconds) {
            return (<span className="timer__clock__time__seconds">.{this.state.timeSeconds}</span>);
        }
    }

    renderTime() {
        if (this.state.viewType === 'timer') {
            return (<span className="timer__clock__time">{this.state.time}{this.renderSeconds()}</span>);
        } else {
            return (
                <TimePicker
                    showSecond={false}
                    value={moment().set({hour:0,minute:0,second:0,millisecond:0}).add(this.state.duration, 'seconds')}
                    onChange={this.timeChange.bind(this)}
                    className="timer__clock__time"
                />
            )
        }
    }

    renderButtons() {
        let buttons = [];
        if (this.state.viewType === 'timer') {
            if (StorageService.isTimerStarted() === 'true') {
                if (StorageService.isTimerPaused() === 'true') {
                    buttons.push(<i key="btn-timer-play" className="fa fa-play-circle" aria-hidden="true" onClick={() => this.unpauseTimer()}></i>);
                } else {
                    buttons.push(<i key="btn-timer-pause" className="fa fa-pause" aria-hidden="true" onClick={() => this.pauseTimer()}></i>);
                }
                buttons.push(<i key="btn-timer-stop" className="fa fa-floppy-o" aria-hidden="true" onClick={() => this.stopTimer()}></i>);
                buttons.push(<i key="btn-timer-clear" className="fa fa-trash-o" aria-hidden="true" onClick={() => this.clearDataConfirm()}></i>);
            } else {
                buttons.push(<i key="btn-timer-start" className="fa fa-play-circle" aria-hidden="true" onClick={() => this.startTimer()}></i>);
            }
        } else if (this.state.viewType === 'worklog') {
            buttons.push(<i key="btn-timer-save" className="fa fa-floppy-o" aria-hidden="true" onClick={() => this.saveSelectedWorklog()}></i>);
            buttons.push(<i key="btn-timer-delete" className="fa fa-trash-o" aria-hidden="true" onClick={() => this.deleteSelectedWorklog()}></i>);
            buttons.push(<i key="btn-timer-show" className="fa fa-times-circle" aria-hidden="true" onClick={() => this.showTimer()}></i>);
        }
        return (
            <span className="timer__clock__buttons">
                {buttons}
            </span>
        );
    }

    render() {
        return (
            <div className="timer">
                <div className="timer__clock">
                    {this.renderTime()}
                    {this.renderButtons()}
                </div>
                <div className="timer__datas">
                    <Link to="/projects" className="timer__data">
                        <h2 className="timer__data__title">Project</h2>
                        <p className="timer__data__label">{this.state.projectName}</p>
                    </Link>
                    <Link to="/issues" className="timer__data">
                        <h2 className="timer__data__title">Task</h2>
                        <p className="timer__data__label">{this.state.issueKey}</p>
                    </Link>
                    <div className="timer__data timer__data--no-highlight">
                        <h2 className="timer__data__title">Date</h2>
                        <DatePicker className="timer__data__date" onChange={this.dateChange.bind(this)} selected={moment(this.state.date)} />
                    </div>
                    <div className="timer__data timer__data--no-highlight">
                        <h2 className="timer__data__title">Comment</h2>
                        <textarea className="timer__data__textarea" rows="2" cols="10" onChange={this.commentChange.bind(this)} value={this.state.comment} />
                    </div>
                </div>
            </div>
        );
    }
}
