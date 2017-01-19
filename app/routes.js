import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './containers/App';
import DashboardPage from './containers/DashboardPage';
import IssuesPage from './containers/IssuesPage';
import ProjectsPage from './containers/ProjectsPage';
import SettingsPage from './containers/SettingsPage';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={DashboardPage}/>
        <Route path="/dashboard" component={DashboardPage}/>
        <Route path="/issues" component={IssuesPage}/>
        <Route path="/projects" component={ProjectsPage}/>
        <Route path="/settings" component={SettingsPage}/>
    </Route>
);
