import React from 'react';
import { Link } from 'react-router';
import Search from '../search/search';
import PostForm from '../postform/postform';
import { searchStreet } from '../../actions/searchActions';
import { connect } from 'react-redux';
import './mystreets.scss';

class MyStreets extends React.Component {

    render() {
        const { searchStreet } = this.props;

        return (
            <div className="col-md-4 col-md-offset-4">
                <Search searchStreet={searchStreet}/>
                <div id="streetResult" className="container">
                </div>
                <PostForm/>

            </div>

        )

    }
}

MyStreets.propTypes = {
    searchStreet: React.PropTypes.func.isRequired
}

export default connect(null,{searchStreet})(MyStreets);
