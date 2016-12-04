import React, { Component } from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { AppLayout, TestView } from './views';
import MyStreets from './components/my-streets/mystreets';

export default class AppRouter extends Component {
    render() {
        return (
            <Router history={browserHistory}>
                <Route path='/' component={AppLayout}>
                    <Route path='/mystreets' component={MyStreets}/>
                </Route>
            </Router>
        );
    }
}