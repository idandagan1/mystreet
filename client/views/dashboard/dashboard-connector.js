import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as dashboardActions from 'actions/dashboard-action-creators';
import { Dashboard } from 'components';

const select = state => ({
    ...state.dashboard,
});

function DashboardConnector(props) {
    const { dispatch } = props;

    return (
        <Dashboard
            {...props}
            {...bindActionCreators(dashboardActions, dispatch)}
        />
    );
}

export default connect(select)(DashboardConnector);
