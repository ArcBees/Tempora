import moment from 'moment';
import 'moment-duration-format';

import * as TempoApi from './apis/TempoApi';
import * as DateUtils from '../utils/DateUtils';

export function createWorklog(worklog): Promise<any> {
    return TempoApi.createWorklog(worklog);
}

export function updateWorklog(worklogId, worklog): Promise<any> {
    return TempoApi.updateWorklog(worklogId, worklog);
}

export function deleteWorklog(worklogId): Promise<any> {
    return TempoApi.deleteWorklog(worklogId);
}

export function getLatestWorklogs(): Promise<TempoApi.Worklog[]> {
    return TempoApi.getWorklogs(getTwoWeeksAgo(), getToday());
}

export function getTodayWorklogs(): Promise<TempoApi.Worklog[]> {
    return TempoApi.getWorklogs(getToday(), getToday());
}

export function getYesterdayWorklogs() {
    return TempoApi.getWorklogs(getYesterday(), getYesterday());
}

export function getRemainingWeekWorklogs() {
    if (getTodayWeekday() <= 1) {
        return Promise.resolve([]);
    }
    return TempoApi.getWorklogs(getStartOfWeek(), getTwoDaysAgo());
}

export function getLastWeekWorklogs() {
    return TempoApi.getWorklogs(getLastWeekStartOfWeek(), getLastWeekEndOfWeek());
}

export function getTimeSpentInHours(timeSpentSeconds) {
    return moment.duration(timeSpentSeconds, 'seconds').format(DateUtils.DateFormat.TIME, { trim: false });
}

export function getTodayTotalTime() {
    return TempoApi.getWorklogs(getToday(), getToday()).then(worklogs => calculateTotalTime(worklogs));
}

export function getWeekTotalTime() {
    return TempoApi.getWorklogs(getStartOfWeek(), getEndOfWeek()).then(worklogs => calculateTotalTime(worklogs));
}

export function getLastWeekTotalTime() {
    return getLastWeekWorklogs().then(worklogs => calculateTotalTime(worklogs));
}

function calculateTotalTime(worklogs) {
    let totalTime = 0;

    worklogs.map((entry: TempoApi.Worklog) => (
        totalTime += entry.timeSpentSeconds
    ));

    return getTimeSpentInHours(totalTime);
}

function getToday() {
    return moment();
}

function getTodayWeekday() {
    return moment().weekday();
}

function getYesterday() {
    return moment().subtract(1, 'day');
}

function getTwoDaysAgo() {
    return moment().subtract(2, 'days');
}

function getStartOfWeek() {
    return moment().startOf('week');
}

function getEndOfWeek() {
    return moment().endOf('week');
}

function getLastWeek() {
    return moment().subtract(1, 'week');
}

function getLastWeekStartOfWeek() {
    return moment().subtract(1, 'week').weekday(0);
}

function getLastWeekEndOfWeek() {
    return moment().subtract(1, 'week').weekday(6);
}

function getTwoWeeksAgo() {
    return moment().subtract(2, 'weeks');
}
