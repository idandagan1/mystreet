import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as postActions from 'actions/post-action-creators';
import * as myStreetsActions from 'actions/my-streets-action-creators';
import MyStreets from './components/my-streets';

function select(state) {
    return {
        ...state.myStreets,
        isAuthenticated: state.app.isAuthenticated,
        activeUser: state.user,
    };
}

function MyStreetsConnector(props) {
    const { dispatch } = props;

    return (
        <MyStreets
            {...props}
            {...bindActionCreators(postActions, dispatch)}
            {...bindActionCreators(myStreetsActions, dispatch)}
        />
    );
}

export default connect(select)(MyStreetsConnector);
