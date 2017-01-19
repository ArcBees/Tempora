import React, {Component} from 'react';

import * as StorageService from '../../services/StorageService';

import './Login.scss';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            instanceURL: StorageService.getInstanceURL()
        }
    }

    submitForm(event) {
        event.preventDefault();

        const instanceURL = this.state.instanceURL.trim();
        const username = this.state.username.trim();
        const password = this.state.password.trim();
        if (!username || !password || !instanceURL) {
            return;
        }

        this.props.onFormSubmit({instanceURL, username, password});
    }

    handleInstanceUrlChange(event) {
        this.setState({instanceURL: event.target.value});
    }

    handleUsernameChange(event) {
        this.setState({username: event.target.value});
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    render() {
        return (
            <div className="login">
                <img src="assets/images/logo.png" alt="Tempora" className="login__logo" />
                {/*<form>
                    <button className="login__google" type="submit">
                        <i className="fa fa-google" aria-hidden="true"></i> Log in with Google
                    </button>
                </form>

                <p className="login__sep">or</p>
                */}
                <form onSubmit={e => this.submitForm(e)}>
                    <p>
                        <input className="login__input" placeholder="http://instance-name.atlassian.net/"
                                value={this.state.instanceURL}
                                onChange={e => this.handleInstanceUrlChange(e)} />
                    </p>
                    <p>
                        <input className="login__input" placeholder="Username"
                               onChange={e => this.handleUsernameChange(e)} />
                    </p>
                    <p>
                        <input type="password" className="login__input" placeholder="Password"
                               onChange={e => this.handlePasswordChange(e)} />
                    </p>
                    <p>
                        <button className="login__btn">Log in</button>
                    </p>
                </form>
            </div>
        );
    }
}
