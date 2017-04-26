import * as JiraApi from './apis/JiraApi';
import * as StorageService from './StorageService';

export function isAuth() {
    return JiraApi.isAuth();
}

export function loginWithCredentials(instanceURL, username, password) {
    return JiraApi.loginWithCredentials(instanceURL, username, password)
        .then(response => {
            StorageService.setUser(response);
            window.eventEmitter.emitEvent('userHasLogged', [response]);
        });
}
