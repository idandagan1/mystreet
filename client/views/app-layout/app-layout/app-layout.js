import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Header } from 'views';
import './app-layout.scss';

function select(state) {
    return {

    };
}

function AppLayout(props) {
    const { children } = props;

    return (
        <div className='wrapper'>
            <Header />
            {children}
        </div>
    );
}

AppLayout.propTypes = {
    children: PropTypes.node,
};

export default connect(select)(AppLayout);
