import React from 'react';
import { Link } from 'react-router-dom';
import Timer from '../timer/Timer';
import './Sidebar.scss';

export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebar__timer">
                <Timer />
            </div>
            <div className="sidebar__options">
                <Link to="/settings"><i className="fa fa-cog" aria-hidden="true" /></Link>
            </div>
        </div>
    );
}
