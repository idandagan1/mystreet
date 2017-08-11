import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as userActions from 'actions/user-action-creators';
import * as myStreetsActions from 'actions/my-streets-action-creators';
import MyStreets from './components/my-streets';

function select(state) {
    const { app, user: { activeUser }, myStreets } = state;
    return {
        ...myStreets,
        isAuthenticated: app.isAuthenticated,
        activeUser,
    };
}

function MyStreetsConnector(props) {
    const { dispatch } = props;

    return (
        <MyStreets
            {...props}
            {...bindActionCreators(userActions, dispatch)}
            {...bindActionCreators(myStreetsActions, dispatch)}
        />
    );
}

export default connect(select)(MyStreetsConnector);
