import React, { Component } from 'react';
import _ from 'lodash';
import { shell } from 'electron';
import { Link } from 'react-router-dom';

import * as StorageService from '../../services/StorageService';
import * as IssueService from '../../services/IssueService';

export default class Issues extends Component {
    constructor(props) {
        super(props);

        this.state = {
            issues: [],
            filteredIssues: [],
            sortedIssues: [],
            searchQuery: '',
            viewType: StorageService.getViewType(),
            issuesStatusSortingOrder: [3, 10601, 10400, 10600, 10100]
        };
    }

    componentDidMount() {
        this.fetchIssues();
    }

    fetchIssues() {
        const projectId = this.state.viewType === 'timer'
            ? StorageService.getActiveProjectId()
            : StorageService.getWorklogProjectId();
        IssueService.getIssues(projectId).then(issues => {
            this.setState({ issues: issues.issues, filteredIssues: issues.issues });
            this.sortIssuesByStatus(this.state.filteredIssues);
        });
    }

    sortIssuesByStatus(issues) {
        const sortedIssues = [];
        this.state.issuesStatusSortingOrder.forEach((issueStatus, key) => {
            sortedIssues[key] = issues.filter(issue => issue && issue.fields.status.id === issueStatus);
        });
        sortedIssues[sortedIssues.length] = issues.filter(
            issue => issue && !_.includes(this.state.issuesStatusSortingOrder, parseInt(issue.fields.status.id, 10)));
        this.setState({ sortedIssues });
    }

    issueSelected(issueId, issueKey) {
        if (this.state.viewType === 'timer') {
            StorageService.setActiveIssueId(issueId);
            StorageService.setActiveIssueKey(issueKey);
        } else {
            StorageService.setWorklogIssueId(issueId);
            StorageService.setWorklogIssueKey(issueKey);
        }
        window.eventEmitter.emitEvent('issueChange');
    }

    searchChange(event) {
        const searchQuery = event.target.value;
        this.setState({
            searchQuery,
            filteredIssues: this.filterIssues(searchQuery.toLowerCase())
        });
    }

    filterIssues(searchQuery) {
        const filteredIssues = this.state.issues.filter(
            issue => issue && (issue.key.toLowerCase().indexOf(searchQuery) >= 0
            || issue.fields.summary.toLowerCase().indexOf(searchQuery) >= 0));

        this.sortIssuesByStatus(filteredIssues);
        return filteredIssues;
    }

    showIssues() {
        return this.state.sortedIssues.map((issues, key) => {
            if (issues.length > 0) {
                return (
                    <div key={`status-${key}`}>
                        <h2 className="page__subtitle">{issues[0].fields.status.name}</h2>
                        <ul className="page__items">
                            {this.renderIssues(issues)}
                        </ul>
                    </div>
                );
            }
            return false;
        });
    }

    renderIssues(issues) {
        return issues.map(issue => (
            <li key={issue.id} className="page__item">
                <Link
                    to="/"
                    onClick={() => this.issueSelected(issue.id, issue.key)
                    }
                    className="page__item__link page__item__link--with-icon"
                >{issue.key}<span className="page__item__link__desc">{issue.fields.summary}</span>
                </Link>
                <a
                    href="javascript:;"
                    className="page__item__link-icon"
                    onClick={() => shell.openExternal(StorageService.getInstanceURL() + '/browse/' + issue.key)}
                >
                    <i className="fa fa-external-link" aria-hidden="true" />
                </a>
            </li>
        ));
    }

    render() {
        return (
            <div className="page">
                <header className="page__header">
                    <h1 className="page__title">Tasks</h1>
                    <input
                        className="page__search"
                        placeholder="search"
                        onChange={this.searchChange.bind(this)}
                        value={this.state.searchQuery}
                    />
                    <Link to="/" className="page__close">
                        <i className="fa fa-times" aria-hidden="true" />
                    </Link>
                </header>
                {this.showIssues()}
            </div>
        );
    }
}
