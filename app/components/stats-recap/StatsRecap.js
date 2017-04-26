import React from 'react';
import './StatsRecap.scss';

export default function StatsRecap({ stats }) {
    const { lastWeekTime, weekTime, todayTime } = stats;
    return (
        <div className="stats-recap">
            <div className="stats-recap__stat">
                <div className="stats-recap__stat__data">{lastWeekTime}</div>
                <div className="stats-recap__stat__label">Last week</div>
            </div>
            <div className="stats-recap__stat">
                <div className="stats-recap__stat__data">{weekTime}</div>
                <div className="stats-recap__stat__label">This week</div>
            </div>
            <div className="stats-recap__stat">
                <div className="stats-recap__stat__data">{todayTime}</div>
                <div className="stats-recap__stat__label">Today</div>
            </div>
        </div>
    );
}
