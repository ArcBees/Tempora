import React, {Component} from 'react';

import Dashboard from '../components/dashboard/Dashboard';
import * as WorklogService from '../services/WorklogService';

export default class DashboardPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            worklogs: {
                today: [],
                yesterday: [],
                remainingWeek: [],
                lastWeek: []
            },
            stats: {
                todayTime: "-",
                weekTime: "-",
                lastWeekTime: "-"
            }
        };

        window.eventEmitter.addListener('refreshWorklogsAndTime', this.getWorklogsAndTime.bind(this));
    }

    componentDidMount() {
        this.getWorklogsAndTime();
    }

    getWorklogsAndTime() {
        WorklogService.getTodayWorklogs()
                .then(worklogs => this.setState({worklogs: {...this.state.worklogs, today: worklogs}}));

        WorklogService.getYesterdayWorklogs()
                .then(worklogs => this.setState({worklogs: {...this.state.worklogs, yesterday: worklogs}}));

        WorklogService.getRemainingWeekWorklogs()
                .then(worklogs => this.setState({worklogs: {...this.state.worklogs, remainingWeek: worklogs}}));

        WorklogService.getLastWeekWorklogs()
                .then(worklogs => this.setState({worklogs: {...this.state.worklogs, lastWeek: worklogs}}));

        WorklogService.getTodayTotalTime()
                .then(totalTime => this.setState({stats: {...this.state.stats, todayTime: totalTime}}));

        WorklogService.getWeekTotalTime()
                .then(totalTime => this.setState({stats: {...this.state.stats, weekTime: totalTime}}));

        WorklogService.getLastWeekTotalTime()
                .then(totalTime => this.setState({stats: {...this.state.stats, lastWeekTime: totalTime}}));
    }

    orderWorklogsByName(entries) {
        entries.sort(function (entry1, entry2) {
            if (entry1.issue.key < entry2.issue.key) return -1;
            if (entry1.issue.key > entry2.issue.key) return 1;
            return 0;
        });
    }

    orderWorklogsByTime(entries) {
        entries.sort(function (entry1, entry2) {
            return entry1.timeSpentSeconds - entry2.timeSpentSeconds;
        });
    }

    render() {
        return <Dashboard worklogs={this.state.worklogs}
                    stats={this.state.stats}
                    refresh={this.getWorklogsAndTime.bind(this)}
                    orderByName={this.orderWorklogsByName.bind(this)}
                    orderByTime={this.orderWorklogsByTime.bind(this)} />;
    }
}
