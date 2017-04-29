import React, { PropTypes, Component } from 'react';
import { GoogleSearch } from 'components';
import tipsIcon from 'resources/images/tip-icon.png';
import './search-street.scss';

export default function SearchStreet(props) {

    function handleSubmit(street) {
        const { searchStreet } = props;
        searchStreet(street);
    }

    return (
        <div >
            <GoogleSearch onSubmit={handleSubmit} />
            <div className='n-search-tips-container dropdown'>
                <img
                    src={tipsIcon}
                    data-toggle='dropdown'
                    className='n-search-tip-icon dropdown-toggle'
                    alt='Search tips'
                    title='Search tips'
                    role='button'
                    aria-haspopup='true'
                    aria-expanded='false'
                />
                <ul className='n-search-tips-content dropdown-menu'>
                    <li><p>For large streets, you should add the street number.</p></li>
                    <li><p>Otherwise, only type the street name.</p></li>
                </ul>
            </div>
        </div>
    );
}

SearchStreet.propTypes = {
    searchStreet: PropTypes.func.isRequired,
};
