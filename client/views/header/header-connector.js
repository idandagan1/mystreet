import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as headerActions from './state/header-action-creators';
import Header from './components/header';

const select = state => ({
    user: state.user,
    isAuthenticated: state.app.isAuthenticated,
    street: state.myStreets,
});

function HeaderConnector(props) {
    const { dispatch } = props;

    return (
        <Header
            {...props}
            {...bindActionCreators(headerActions, dispatch)}
        />
    );
}

export default connect(select)(HeaderConnector);
