import React from 'react';
import { Route, Switch } from 'react-router';

import App from './containers/App';
import DashboardPage from './containers/DashboardPage';
import IssuesPage from './containers/IssuesPage';
import ProjectsPage from './containers/ProjectsPage';
import SettingsPage from './containers/SettingsPage';

export default class Routes extends React.Component {
    render() {
        return (
            <App>
                <Switch>
                    <Route path="/dashboard" component={DashboardPage} />
                    <Route path="/issues" component={IssuesPage} />
                    <Route path="/projects" component={ProjectsPage} />
                    <Route path="/settings" component={SettingsPage} />
                    <Route component={DashboardPage} />
                </Switch>
            </App>
        );
    }
}
