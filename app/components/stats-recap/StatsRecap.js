import React, {Component} from 'react';
import {Link} from 'react-router';
import * as WorklogService from '../../services/WorklogService';
import './StatsRecap.scss';

export default class StatsRecap extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="stats-recap">
                <div className="stats-recap__stat">
                    <div className="stats-recap__stat__data">{this.props.stats.lastWeekTime}</div>
                    <div className="stats-recap__stat__label">Last week</div>
                </div>
                <div className="stats-recap__stat">
                    <div className="stats-recap__stat__data">{this.props.stats.weekTime}</div>
                    <div className="stats-recap__stat__label">This week</div>
                </div>
                <div className="stats-recap__stat">
                    <div className="stats-recap__stat__data">{this.props.stats.todayTime}</div>
                    <div className="stats-recap__stat__label">Today</div>
                </div>
            </div>
        );
    }
}
