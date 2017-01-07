import React, { Component } from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { AppLayout, TestView, Dashboard } from 'views';
import { MyStreets, SearchStreet, Profile } from 'components';

export default class AppRouter extends Component {
    render() {
        return (
            <Router history={browserHistory}>
                <Route path='/' component={AppLayout}>
                    <IndexRoute component={Dashboard} />
                    <Route path='/mystreets' component={MyStreets}/>
                    <Route path='/user' component={Profile}/>
                </Route>
            </Router>
        );
    }
}
