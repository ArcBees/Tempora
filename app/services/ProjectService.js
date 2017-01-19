import * as JiraApi from './apis/JiraApi';

export function getProjects(): Promise<any> {
    return JiraApi.getProjects();
}

export function getLatestProjects(): Promise<any> {
    return JiraApi.getLatestProjects();
}

export function getProject(projectId): Promise<any> {
    return JiraApi.getProject(projectId);
}
