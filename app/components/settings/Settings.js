import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import PropTypes from 'prop-types';

import * as StorageService from '../../services/StorageService';

import './Settings.scss';

export default class Settings extends Component {
    static contextTypes = {
        settings: PropTypes.object,
        user: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            clearable: false
        };
    }

    updateStateValue(key, newValue) {
        window.eventEmitter.emitEvent('settingsHasChanged', [key, newValue]);
    }

    logout() {
        StorageService.logout();
    }

    render() {
        const timeRoundOptions = [
            { value: 0, label: 'Never' },
            { value: 5, label: 'Nearest 5mn' },
            { value: 10, label: 'Nearest 10mn' },
            { value: 15, label: 'Nearest 15mn' },
            { value: 20, label: 'Nearest 20mn' },
            { value: 30, label: 'Nearest 30mn' },
            { value: 60, label: 'Nearest 1h' }
        ];
        const inactivityOptions = [
            { value: 0, label: 'Never' },
            { value: 5, label: 'After 5mn' },
            { value: 15, label: 'After 15mn' },
            { value: 60, label: 'After 1h' }
        ];

        return (
            <div className="page settings">
                <header className="page__header">
                    <h1 className="page__title">Settings</h1>
                    <Link to="/" className="page__close">
                        <i className="fa fa-times" aria-hidden="true" />
                    </Link>
                </header>
                <h2 className="page__subtitle">Profil</h2>
                <div className="col col--middle col--1-3 settings__label">User</div>
                <div className="col col--middle col--2-3">
                    <img src={this.context.user.avatarUrls['48x48']} alt="" className="settings__avatar" />
                    <p>
                        {this.context.user.displayName}<br />
                        <em>{this.context.user.emailAddress}</em><br />
                    </p>
                    <p>
                        <a href="javascript:;" className="settings__link" onClick={() => this.logout()}>Logout</a>
                    </p>
                </div>
                <hr className="page__sep" />
                <h2 className="page__subtitle">Options</h2>
                <form>
                    <div className="row">
                        <label className="col col--middle col--1-3 settings__label">Time rounding</label>
                        <div className="col col--middle col--2-3">
                            <Select
                                name="input-idle"
                                options={timeRoundOptions}
                                onChange={newValue => this.updateStateValue('timeRound', newValue)}
                                value={this.context.settings.timeRound}
                                clearable={false}
                            />
                        </div>
                    </div>
                    {/*<div className="row">
                        <label className="col col--middle col--1-3 settings__label">Détection de l'inactivité</label>
                        <div className="col col--middle col--2-3">
                            <Select
                                name="input-idle"
                                options={inactivityOptions}
                                onChange={newValue => this.updateStateValue('inactivity', newValue)}
                                value={this.context.settings.inactivity}
                                clearable={false}
                            />
                        </div>
                    </div>*/}
                </form>
            </div>
        );
    }
}
