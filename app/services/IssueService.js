import * as JiraApi from './apis/JiraApi';

export function getIssue(issueId): Promise<any> {
    return JiraApi.getIssue(issueId);
}

export function getIssues(projectId): Promise<any> {
    return JiraApi.getIssues(projectId);
}
