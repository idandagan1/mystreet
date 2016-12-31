import React from 'react';
import { connect } from 'react-redux';
import SearchStreet from 'components/search-street/search-street';
import { searchStreet } from 'actions/searchActions';
import './dashboard.scss';


class Dashboard extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        const {searchStreet} = this.props;

        return (
            <div>
                <div className="n-dashboard-wrapper"></div>
                <div className="n-dashboard-search">
                    <SearchStreet searchStreet={searchStreet}/>
                </div>
            </div>
        )
    }
}

export default connect(null, {searchStreet})(Dashboard);
