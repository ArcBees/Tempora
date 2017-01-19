import React, {Component} from 'react';

import Login from '../components/login/Login';
import * as AuthService from '../services/AuthService';

export default class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: ''
        };
    }

    submitCredentials(form) {
        AuthService.loginWithCredentials(form.instanceURL, form.username, form.password)
                .then(user => this.props.onLogin())
                .catch(errorMessage => this.setState({errorMessage}));
    }

    render() {
        return <Login onFormSubmit={form => this.submitCredentials(form)} errorMessage={this.state.errorMessage} />;
    }
}
