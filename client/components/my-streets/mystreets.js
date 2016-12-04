import React from 'react';
import { Link } from 'react-router';
import Search from '../search/search';
import { searchStreet } from '../../actions/searchActions';
import { connect } from 'react-redux';
import './mystreets.scss';

class MyStreets extends React.Component {

    render() {
        const { searchStreet } = this.props;

        return (
            <div>
                <Search searchStreet={searchStreet}/>
                <div id="streetResult" className="container">
                </div>
            </div>

        )

    }
}

MyStreets.propTypes = {
    searchStreet: React.PropTypes.func.isRequired
}

export default connect(null,{searchStreet})(MyStreets);