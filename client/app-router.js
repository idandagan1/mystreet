import React, { Component, PropTypes } from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { AppLayout, Dashboard, MyStreets } from 'views';
import { Profile } from 'components';
import { syncHistoryWithStore } from 'react-router-redux';
import * as appActions from 'actions/app-action-creators';

export default class AppRouter extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    }

    componentDidMount() {
        const { store } = this.props;
        const { dispatch } = store;
        dispatch(appActions.appLoaded());
    }

    render() {
        const { store } = this.props;

        // Create an enhanced history that syncs navigation events with the store
        const history = syncHistoryWithStore(browserHistory, store);

        return (
            <Router history={history}>
                <Route path='/' component={AppLayout}>
                    <IndexRoute component={Dashboard} />
                    <Route path='mystreets' component={MyStreets} />
                    <Route path='user' component={Profile} />
                </Route>
            </Router>
        );
    }
}
