import * as _ from 'lodash';

import * as Http from './AtlassianHttp';
import * as StorageService from './../StorageService';
import * as WorklogService from './../WorklogService';

const URL = Http.API_TYPE + '/api/2';
const PROJECT_ENDPOINT = '/project';
const ISSUE_ENDPOINT = '/issue';
const USER_ENDPOINT = '/myself';

export function loginWithCredentials(instanceURL, username, password) {
    const apiKey = Http.createApiKeyFromCredentials(username, password);
    const options = Http.buildHeadersWithApiKey(apiKey);

    return Http.get(instanceURL + URL + USER_ENDPOINT, options)
        .then(response => {
            StorageService.setApiKey(apiKey);
            StorageService.setInstanceURL(instanceURL);
            return response.json();
        })
        .catch(() => Promise.reject({
            message: 'Login failed'
        }));
}

export function isAuth() {
    return !_.isEmpty(StorageService.getApiKey() && StorageService.getUser());
}

export function getProjects() {
    return Http.get(StorageService.getInstanceURL() + URL + PROJECT_ENDPOINT, Http.buildOptions())
        .then(response => response.json());
}

export function getLatestProjects() {
    const latestProjects = [];
    const latestProjectsIds = [];
    return WorklogService.getLatestWorklogs().then(worklogs => {
        worklogs.forEach(worklog => {
            if (!latestProjectsIds.includes(worklog.issue.projectId)) {
                const project = this.getProject(worklog.issue.projectId).then(p => p);
                latestProjectsIds.push(worklog.issue.projectId);
                latestProjects.push(project);
            }
        });
        return Promise.all(latestProjects);
    });
}

export function getProject(projectId) {
    const projectEndpoint = '/' + projectId;
    return Http.get(StorageService.getInstanceURL() + URL + PROJECT_ENDPOINT + projectEndpoint, Http.buildOptions())
        .then(response => response.json());
}

export function getIssues(projectId) {
    const searchQuery = '/search?jql=project=' + projectId + '&maxResults=1000';
    return Http.get(StorageService.getInstanceURL() + URL + searchQuery, Http.buildOptions())
        .then(response => response.json());
}

export function getIssue(issueId) {
    const issueEndpoint = '/' + issueId;
    return Http.get(StorageService.getInstanceURL() + URL + ISSUE_ENDPOINT + issueEndpoint, Http.buildOptions())
        .then(response => response.json());
}
