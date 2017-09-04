import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import './app-layout.scss';

function select(state) {
    return {

    };
}

function AppLayout(props) {
}

AppLayout.propTypes = {
    children: PropTypes.node,
};

export default connect(select)(AppLayout);
