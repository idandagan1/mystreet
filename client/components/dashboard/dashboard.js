import React from 'react';
import { connect } from 'react-redux';
import SearchStreet from 'components/search-street/search-street';
import { searchStreet } from 'actions/searchActions';
import streetimage from 'resources/images/street.jpg';
import './dashboard.scss';


class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        }

    render() {
        const {searchStreet} = this.props;

        return (
            <div className="n-dashboard-wrapper">
                <SearchStreet  searchStreet={searchStreet}/>
            </div>

        )
    }
}

export default connect(null, {searchStreet})(Dashboard);
