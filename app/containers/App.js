import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AppModal from '../components/app-modal/AppModal';
import Sidebar from '../components/sidebar/Sidebar';
import LoginPage from './LoginPage';
import * as authService from '../services/AuthService';
import * as StorageService from '../services/StorageService';

const DEFAULT_SETTINGS = {
    timeRound: 10,
    inactivity: 60,
};

export default class App extends Component {
    static propTypes = {
        children: PropTypes.element.isRequired
    };

    static childContextTypes = {
        settings: PropTypes.object.isRequired,
        user: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            isAuth: false,
            settings: StorageService.getSettings() ? StorageService.getSettings() : DEFAULT_SETTINGS,
            user: StorageService.getUser() ? StorageService.getUser() : {}
        };

        window.eventEmitter.addListener('userHasLogged', this.updateUser.bind(this));
        window.eventEmitter.addListener('settingsHasChanged', this.updateSettings.bind(this));
    }

    getChildContext() {
        return {
            settings: this.state.settings,
            user: this.state.user
        };
    }

    componentWillMount() {
        this.setState({ isAuth: authService.isAuth() });
    }

    showLayout() {
        this.setState({ isAuth: true });
    }

    updateUser(user) {
        this.setState({ user });
    }

    updateSettings(key, newValue) {
        const newSettings = { ...this.state.settings, [key]: newValue.value };
        this.setState({ settings: newSettings });
        StorageService.setSettings(newSettings);
    }

    render() {
        const appLayout = (
            <div className="layout">
                <aside className="layout__aside">
                    <Sidebar />
                </aside>
                <div className="layout__content">
                    {this.props.children}
                </div>

                <AppModal />
            </div>
        );

        return this.state.isAuth ? appLayout : <LoginPage onLogin={() => this.showLayout()} />;
    }
}
