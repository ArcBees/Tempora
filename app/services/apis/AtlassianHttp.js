import * as _ from 'lodash';
import request from 'request';
import * as StorageService from './../StorageService';

export const API_TYPE = 'rest';

// TODO: Use Request-Promise library instead to return a legit Promise
export function requestMethod(method, url, body): Promise<any> {
    const options = {
        method,
        url,
        headers: {
            'cache-control': 'no-cache',
            origin: StorageService.getInstanceURL(),
            authorization: `Basic ${StorageService.getApiKey()}`,
            'x-atlassian-token': 'nocheck',
            accept: 'application/json',
            'content-type': 'application/json'
        },
        body,
        json: true
    };

    request(options, (error, response, body) => {
        if (error) throw new Error(error);

        console.log(body);
    });

    return Promise.resolve({});
}

// TODO: Use Request for fetch requests as well
export function get(url, options): Promise<any> {
    options = {
        method: 'GET',
        headers: options.headers,
        mode: options.mode,
        cache: options.cache
    };
    return fetch(url, options);
}

export function buildOptions() {
    return buildHeadersWithApiKey(StorageService.getApiKey());
}

export function buildHeadersWithApiKey(apiKey) {
    const headers = {
        Authorization: `Basic ${apiKey}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
    };

    return {
        headers,
        mode: 'cors',
        cache: 'default'
    };
}

export function createApiKeyFromCredentials(username, password) {
    return window.btoa(`${username}:${password}`);
}

export function buildUrlQuery(queryObject) {
    const parts = [];

    Object.keys(queryObject).forEach(query => {
        if (Object.prototype.hasOwnProperty.call(queryObject, query) && !_.isEmpty(queryObject[query])) {
            parts.push(encodeURIComponent(query) + '=' + encodeURIComponent(queryObject[query]));
        }
    });

    const queryString = parts.join('&');

    return queryString ? '?' + queryString : '';
}
