import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Profile from './components/profile';

function select(state) {
    const { app, user, myStreets } = state;
    return {
        ...myStreets,
        isAuthenticated: app.isAuthenticated,
        activeUser: user,
    };
}

function ProfileConnector(props) {
    const { dispatch } = props;

    return (
        <Profile
            {...props}
        />
    );
}

export default connect(select)(ProfileConnector);
