import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Header from '../../components/header/header';
import { Link } from 'react-router';
import './app-layout.scss';

function select(state) {
    return {

    };
}

class AppConnector extends Component {

    render() {
        return (
            <div className='wrapper'>
                <Header />
                {this.props.children}
            </div>
        );
    }
}

export default connect(select)(AppConnector);
