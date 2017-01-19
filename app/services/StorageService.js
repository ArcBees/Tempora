export function getActiveProjectId() {
    return localStorage.getItem('activeProjectId');
}

export function setActiveProjectId(id) {
    localStorage.setItem('activeProjectId', id);
}

export function getActiveProjectName() {
    return localStorage.getItem('activeProjectName');
}

export function setActiveProjectName(name) {
    localStorage.setItem('activeProjectName', name);
}

export function getActiveIssueId() {
    return localStorage.getItem('activeIssueId');
}

export function setActiveIssueId(id) {
    localStorage.setItem('activeIssueId', id);
}

export function getActiveIssueKey() {
    return localStorage.getItem('activeIssueKey');
}

export function setActiveIssueKey(key) {
    localStorage.setItem('activeIssueKey', key);
}

export function getActiveDate() {
    return localStorage.getItem('activeDate');
}

export function setActiveDate(date) {
    localStorage.setItem('activeDate', date);
}

export function getActiveComment() {
    return localStorage.getItem('activeComment');
}

export function setActiveComment(comment) {
    localStorage.setItem('activeComment', comment);
}

export function clearActiveTimer() {
    localStorage.removeItem('activeProjectId');
    localStorage.removeItem('activeProjectName');
    localStorage.removeItem('worklogProjectId');
    localStorage.removeItem('worklogProjectName');
    localStorage.removeItem('activeIssueId');
    localStorage.removeItem('activeIssueKey');
    localStorage.removeItem('activeComment');
    localStorage.removeItem('activeDate');
    localStorage.removeItem('dateStartMoment');
    localStorage.removeItem('datePauseMoment');
    localStorage.setItem('viewType', 'timer');
}

export function getWorklogProjectId() {
    return localStorage.getItem('worklogProjectId');
}

export function setWorklogProjectId(id) {
    localStorage.setItem('worklogProjectId', id);
}

export function getWorklogProjectName() {
    return localStorage.getItem('worklogProjectName');
}

export function setWorklogProjectName(name) {
    localStorage.setItem('worklogProjectName', name);
}

export function getWorklogIssueId() {
    return localStorage.getItem('worklogIssueId');
}

export function setWorklogIssueId(id) {
    localStorage.setItem('worklogIssueId', id);
}

export function getWorklogIssueKey() {
    return localStorage.getItem('worklogIssueKey');
}

export function setWorklogIssueKey(key) {
    localStorage.setItem('worklogIssueKey', key);
}

export function getDateStartMoment() {
    return localStorage.getItem('dateStartMoment');
}

export function setDateStartMoment(moment) {
    localStorage.removeItem('datePauseMoment');
    localStorage.setItem('dateStartMoment', moment);
}

export function getDatePauseMoment() {
    return localStorage.getItem('datePauseMoment');
}

export function setDatePauseMoment(moment) {
    localStorage.setItem('datePauseMoment', moment);
}

export function setTimeSpentInSeconds(timeSpentInSeconds) {
    localStorage.setItem('timeSpentInSeconds', timeSpentInSeconds);
}

export function getTimeSpentInSeconds() {
    return localStorage.getItem('timeSpentInSeconds');
}

export function getApiKey() {
    return localStorage.getItem('apiKey');
}

export function setApiKey(apiKey) {
    localStorage.setItem('apiKey', apiKey);
}

export function getInstanceURL() {
    return localStorage.getItem('instanceURL');
}

export function setInstanceURL(instanceURL) {
    localStorage.setItem('instanceURL', instanceURL);
}

export function getUser() {
    return JSON.parse(localStorage.getItem('user'));
}

export function setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

export function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('apiKey');
    localStorage.removeItem('worklogProjectId');
    localStorage.removeItem('worklogProjectName');
    localStorage.removeItem('worklogIssueId');
    localStorage.removeItem('worklogIssueKey');
    localStorage.removeItem('viewType');
    location.reload();
}

export function getSettings() {
    return JSON.parse(localStorage.getItem('settings'));
}

export function setSettings(settings) {
    localStorage.setItem('settings', JSON.stringify(settings));
}

// TODO: Make a Singleton for the timer
export function startTimer() {
    unpauseTimer();
    localStorage.setItem('isTimerStarted', true);
}

export function stopTimer() {
    localStorage.setItem('isTimerStarted', false);
    localStorage.setItem('isTimerPaused', false);
}

export function pauseTimer() {
    localStorage.setItem('isTimerPaused', true);
}

export function unpauseTimer() {
    localStorage.setItem('isTimerPaused', false);
}

export function isTimerStarted(): boolean {
    return localStorage.getItem('isTimerStarted');
}

export function isTimerPaused(): boolean {
    return localStorage.getItem('isTimerPaused');
}

export function getViewType() {
    return localStorage.getItem('viewType');
}

export function setViewType(viewType) {
    localStorage.setItem('viewType', viewType);
}
