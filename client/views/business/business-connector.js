import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as businessActions from '../../actions/business-action-creators';
import Business from './components/business';

function select(state) {
    return {
        ...state.myStreets,
        isAuthenticated: state.app.isAuthenticated,
        activeUser: state.user,
        ...state.business,
    };
}

function BusinessConnector(props) {
    const { dispatch } = props;

    return (
        <Business
            {...props}
            {...bindActionCreators(businessActions, dispatch)}
        />
    );
}

export default connect(select)(BusinessConnector);
