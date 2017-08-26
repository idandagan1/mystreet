import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as headerActions from './state/header-action-creators';
import * as appActions from '../../actions/app-action-creators';
import Header from './components/header';

const select = state => ({
    user: state.user.activeUser,
    Strings: state.user.Strings,
    isAuthenticated: state.app.isAuthenticated,
    street: state.myStreets,
    country: state.user.country,
});

function HeaderConnector(props) {
    const { dispatch } = props;

    return (
        <Header
            {...props}
            {...bindActionCreators(headerActions, dispatch)}
            {...bindActionCreators(appActions, dispatch)}
        />
    );
}

export default connect(select)(HeaderConnector);
