import React, { Component } from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { AppLayout, TestView } from './views';

export default class AppRouter extends Component {
    render() {
        return (
            <Router history={browserHistory}>
                <Route path='/' component={AppLayout}>
                    <Route path='hello' component={TestView} />
                </Route>
            </Router>
        );
    }
}
