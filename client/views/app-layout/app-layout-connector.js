import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Header } from 'views';
import './app-layout.scss';

function select(state) {
    return {

    };
}

function AppConnector(props) {
    const { children } = props;

    return (
        <div className='wrapper'>
            <Header />
            <div className='loadingImg' />
            <div className='n-msg-wrapper'>
                <div id='msg-report'>
                    Thanks for your report!
                    Out team will handle this.
                </div>
            </div>
            {children}
        </div>
    );
}

AppConnector.propTypes = {
    children: PropTypes.node,
};

export default connect(select)(AppConnector);
