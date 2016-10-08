import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import './app-layout.scss';

function select(state) {
    return {

    };
}

class AppConnector extends Component {
    static propTypes = {
        children: PropTypes.node,
    };

    render() {
        const { children } = this.props;

        return (
            <div className='wrapper'>
                AppLayout
                {children}
            </div>
        );
    }
}

export default connect(select)(AppConnector);
