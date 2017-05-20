import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Business from './components/business';

function select(state) {
    return {
        ...state.myStreets,
        isAuthenticated: state.app.isAuthenticated,
        activeUser: state.user,
    };
}

function BusinessConnector(props) {
    const { dispatch } = props;

    return (
        <Business
            {...props}
        />
    );
}

export default connect(select)(BusinessConnector);
