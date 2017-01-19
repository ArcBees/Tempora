import React, {Component, PropTypes} from "react";
import StatsRecap from "../stats-recap/StatsRecap";

import * as WorklogService from "../../services/WorklogService";

import "./Dashboard.scss";

export default class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedWorklog: ""
        }

        window.eventEmitter.addListener('unselectActiveWorklog', () => this.setState({ selectedWorklog: "" }));
    }

    selectWorklog(entry) {
        window.eventEmitter.emitEvent('selectWorklog', [entry]);

        this.setState({
            selectedWorklog: entry.id
        });
    }

    showTimeframe(entries, entriesTitle) {
        if (entries.length > 0) {
            return (
                <tbody>
                    <tr className="dashboard__content__sep">
                        <td colSpan="2">{entriesTitle}</td>
                        <td>
                            <a href="#" onClick={() => this.props.orderByTime(entries)}>
                                <i className="fa fa-sort-numeric-asc" aria-hidden="true"></i>
                            </a>
                            <a href="#" onClick={() => this.props.orderByName(entries)}>
                                <i className="fa fa-sort-alpha-asc" aria-hidden="true"></i>
                            </a>
                        </td>
                    </tr>
                    {this.showEntries(entries)}
                </tbody>
            );
        }
    }

    showEntries(entries) {
        return entries.map((entry: Worklog) => (
            <tr key={entry.id} onClick={() => this.selectWorklog(entry)} className={this.state.selectedWorklog == entry.id ? "is-active" : ""}>
                <td><strong>{WorklogService.getTimeSpentInHours(entry.timeSpentSeconds)}</strong></td>
                <td>[{entry.issue.key}]</td>
                <td><p className="dashboard__content__truncated">{entry.comment}</p></td>
            </tr>
        ));
    }

    render() {
        return (
            <div className="dashboard">
                <div className="dashboard__content">
                    <table>
                        <thead>
                            <tr>
                                <th colSpan="2">Last entries</th>
                                <th className="is-right">
                                    <a href="#" className="dashboard__content__refresh" onClick={() => this.props.refresh()}>
                                        <i className="fa fa-refresh" aria-hidden="true"></i>
                                    </a>
                                </th>
                            </tr>
                        </thead>

                        {this.showTimeframe(this.props.worklogs.today, "Today")}

                        {this.showTimeframe(this.props.worklogs.yesterday, "Yesterday")}

                        {this.showTimeframe(this.props.worklogs.remainingWeek, "This week")}

                        {this.showTimeframe(this.props.worklogs.lastWeek, "Last week")}
                    </table>
                </div>

                <div className="dashboard__stats-recap">
                    <StatsRecap stats={this.props.stats} />
                </div>
            </div>
        );
    }
}
