import React, {Component} from 'react';
import {Link} from 'react-router';
import Timer from '../timer/Timer';
import './Sidebar.scss';

export default class Sidebar extends Component {
    render() {
        return (
            <div className="sidebar">
                <div className="sidebar__timer">
                    <Timer />
                </div>
                <div className="sidebar__options">
                    <Link to="/settings"><i className="fa fa-cog" aria-hidden="true"></i></Link>
                </div>
            </div>
        );
    }
}
