import React, {Component} from 'react';
import {shell} from 'electron';
import {Link} from 'react-router';

import * as StorageService from '../../services/StorageService';
import * as ProjectService from '../../services/ProjectService';

const PROJECT_BASE_URL = "https://arcbees.atlassian.net/projects";

export default class Projects extends Component {
    constructor(props) {
        super(props);

        this.state = {
            projects: [],
            filteredProjects: [],
            latestProjects: [],
            searchQuery: "",
            viewType: StorageService.getViewType()
        };
    }

    componentDidMount() {
        this.fetchProjects();
        this.fetchLatestProjects();
    }

    fetchProjects() {
        ProjectService.getProjects().then(projects => this.setState({projects: projects, filteredProjects: projects}));
    }

    fetchLatestProjects() {
        ProjectService.getLatestProjects().then(latestProjects => this.setState({latestProjects: latestProjects, filteredLatestProjects: latestProjects}));
    }

    showLatestProjects() {
        return this.renderProjects(this.state.filteredLatestProjects);
    }

    showProjects() {
        return this.renderProjects(this.state.filteredProjects);
    }

    projectSelected(projectId) {
        if (this.state.viewType === 'timer') {
            StorageService.setActiveProjectId(projectId);
        } else {
            StorageService.setWorklogProjectId(projectId);
        }
        window.eventEmitter.emitEvent('projectChange');
    }

    searchChange(event) {
        const searchQuery = event.target.value;
        this.setState({
            searchQuery: searchQuery,
            filteredProjects: this.filterProjects(this.state.projects, searchQuery),
            filteredLatestProjects: this.filterProjects(this.state.latestProjects, searchQuery)
        });
    }

    filterProjects(projects, searchQuery) {
        return projects.filter(key => {
            return key && key.name.toLowerCase().indexOf(searchQuery) >= 0;
        });
    }

    renderProjects(projects) {
        if (projects) {
            return projects.map((project) => (
                <li key={project.id} className="page__item">
                    <Link to="/issues" onClick={() => this.projectSelected(project.id)} className="page__item__link page__item__link--with-icon">{project.name}</Link>
                    <a href="#" className="page__item__link-icon" onClick={() => shell.openExternal(PROJECT_BASE_URL + "/" + project.key)}>
                        <i className="fa fa-external-link" aria-hidden="true"></i>
                    </a>
                </li>
            ));
        } else {
            return <p className="page__notfound">No projects found</p>;
        }
    }

    render() {
        return (
            <div className="page">
                <header className="page__header">
                    <h1 className="page__title">Projects</h1>
                    <input className="page__search" placeholder="search" onChange={this.searchChange.bind(this)} value={this.state.searchQuery} />
                    <Link to="/" className="page__close">
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </Link>
                </header>
                <h2 className="page__subtitle">Most recents</h2>
                <ul className="page__items">
                    {this.showLatestProjects()}
                </ul>
                <h2 className="page__subtitle">All projects</h2>
                <ul className="page__items">
                    {this.showProjects()}
                </ul>
            </div>
        );
    }
}
