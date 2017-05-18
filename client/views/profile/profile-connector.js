import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Profile from './components/profile';

function select(state) {
    return {
        ...state.myStreets,
        isAuthenticated: state.app.isAuthenticated,
        activeUser: state.user,
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
