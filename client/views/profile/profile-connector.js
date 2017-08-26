import React from 'react';
import { bindActionCreators } from 'redux';
import * as userActions from 'actions/user-action-creators';
import { connect } from 'react-redux';
import Profile from './components/profile';

function select(state) {
    const { app, user: { activeUser, selectedUser }, myStreets } = state;
    return {
        ...myStreets,
        isAuthenticated: app.isAuthenticated,
        activeUser,
        selectedUser,
    };
}

function ProfileConnector(props) {
    const { dispatch } = props;

    return (
        <Profile
            {...props}
            {...bindActionCreators(userActions, dispatch)}
        />
    );
}

export default connect(select)(ProfileConnector);
