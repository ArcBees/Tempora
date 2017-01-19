import moment from 'moment';

import * as Http from './AtlassianHttp';
import * as DateUtils from '../../utils/DateUtils';
import * as StorageService from './../StorageService';

const BASE_URL = StorageService.getInstanceURL() + Http.API_TYPE + '/tempo-timesheets/3';
const WORKLOGS_ENDPOINT = '/worklogs';

export function createWorklog(worklog): Promise<any> {
    let url = BASE_URL + WORKLOGS_ENDPOINT;
    return Http.requestMethod('POST', url, worklog);
}

export function updateWorklog(worklogId, worklog): Promise<any> {
    let url = BASE_URL + WORKLOGS_ENDPOINT + '/' + worklogId;
    return Http.requestMethod('PUT', url, worklog);
}

export function deleteWorklog(worklogId): Promise<any> {
    let url = BASE_URL + WORKLOGS_ENDPOINT + '/' + worklogId;
    return Http.requestMethod('DELETE', url);
}

export function getWorklogs(dateFrom, dateTo): Promise<Worklog[]> {
    let queryObject = {
        dateFrom: dateFrom ? formatDate(dateFrom) : undefined,
        dateTo: dateTo ? formatDate(dateTo) : undefined,
    };
    let queryString = Http.buildUrlQuery(queryObject);

    let url = BASE_URL + WORKLOGS_ENDPOINT + queryString;
    return Http.get(url, Http.buildOptions()).then(response => response.json());
}

function formatDate(date) {
    return DateUtils.formatDate(date, DateUtils.DateFormat.SHORT_DATE);
}

export type Worklog = {
    id: number,
    comment: string,
    self: string, // url
    issue: {
        key: string,
        id: number,
        self: string,
        remainingEstimateSeconds: number,
        summary: string,
        issueType: {
            name: string,
            iconUrl: string
        },
        projectId: number
    },
    timeSpentSeconds: number,
    billedSeconds: number,
    dateStarted: string,
    author: {
        name: string,
        displayName: string,
        avatar: string, // url
        self: string // url
    },
    workAttributeValues: [{
        value: string,
        id: number,
        workAttribute: {
            name: string,
            key: string,
            id: number,
            type: {
                name: string,
                value: any,
                systemType: boolean
            },
            required: boolean,
            sequence: number,
            externalUrl: string,
        },
        worklogId: number
    }],
    meta: any
}
