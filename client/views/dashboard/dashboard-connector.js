import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as searchActions from 'actions/searchActions';
import { Dashboard } from 'components';

const select = state => ({
    street: state.street,
});

function DashboardConnector(props) {
    const { dispatch } = props;

    return (
        <Dashboard
            {...props}
            {...bindActionCreators(searchActions, dispatch)}
        />
    );
}

export default connect(select)(DashboardConnector);
