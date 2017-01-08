import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as postActions from 'actions/post-action-creators';
import MyStreets from './components/my-streets';

function select(state) {
    return {

    };
}

function MyStreetsConnector(props) {
    const { dispatch } = props;

    return (
        <MyStreets
            {...props}
            {...bindActionCreators(postActions, dispatch)}
        />
    );
}

export default connect(select)(MyStreetsConnector);
