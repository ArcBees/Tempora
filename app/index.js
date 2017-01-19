import React from "react";
import {render} from "react-dom";
import {Router, hashHistory} from "react-router";

import routes from "./routes";
import "./style.scss";

import EventEmitter from "wolfy87-eventemitter";
window.eventEmitter = new EventEmitter();

render(
    <Router routes={routes} history={hashHistory}/>,
    document.getElementById('root')
);
