import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import EventEmitter from 'wolfy87-eventemitter';
import Routes from './routes';
import './style.scss';

window.eventEmitter = new EventEmitter();

const history = createBrowserHistory();

render(
    <Router history={history}>
        <Routes />
    </Router>,
    document.getElementById('root')
);
