import React, { PropTypes } from 'react';
import { PostForm, Post, GoogleSearch, Map } from 'components';
import { Strings } from 'resources';
import usericon from 'resources/images/profile.png';
import './my-streets.scss';


export default class MyStreets extends React.Component {

    static propTypes = {
        selectedStreet: PropTypes.shape({
            streetName: PropTypes.string,
            placeId: PropTypes.string,
            location: PropTypes.shape({
                lng: PropTypes.number,
                lat: PropTypes.number,
            }),
        }),
        isAuthenticated: PropTypes.bool.isRequired,
        createPost: PropTypes.func.isRequired,
        searchStreetSubmitted: PropTypes.func.isRequired,
        addStreetSubmitted: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            isMember: false,
            postfeed: [],
            currentWriter: '',
            members: ['Idan', 'Michael', 'Daniel'],
        };

        this.onJoinClick = this.onJoinClick.bind(this);
    }

    updatePostFeed(newPost) {
        const { postfeed } = this.state;

        postfeed.unshift(newPost);
        this.setState({ postfeed });
    }

    eachMember(member, i) {
        return (
            <div className='n-mystreet-member' key={i}>
                <img alt='user-icon' src={usericon} className='n-comment-user-icon' />
                <div className='n-member-name'>{member}</div>
            </div>
        );
    }

    onJoinClick() {
        const { addStreetSubmitted, selectedStreet } = this.props;

        addStreetSubmitted({ selectedStreet });
        this.setState({ isMember: true });
    }

    handleAddStreet = e => {
        const { addStreetSubmitted, selectedStreet } = this.props;
        addStreetSubmitted(selectedStreet);
    };

    handleSearchStreet = street => {
        const { searchStreetSubmitted } = this.props;
        searchStreetSubmitted(street);
    };

    render() {
        const { currentWriter, postfeed, members, isMember } = this.state;
        const { createPost, isAuthenticated, selectedStreet: { placeId, streetName, location: { lat, lng } } } = this.props;

        return (
            <div className='n-mystreet'>
                <div className='n-mystreet-page-header'>{ streetName }</div>
                <div className='n-mystreet__add-street'>
                    {
                        isMember ?
                            null :
                            <button
                                type='submit'
                                className='n-mystreet__add-street-btn btn btn-sm n-btn-post'
                                onClick={this.onJoinClick}
                                disabled={!isAuthenticated}
                                title='You must sign in'
                            >
                                { Strings.join }
                            </button>
                    }
                </div>
                <ol className='list-inline'>
                    <li className='n-mystreet-leftCol col-md-3'>
                        <Map lat={lat} lng={lng} />
                    </li>
                    <li className='n-mystreet-content col-md-4'>
                        <div>
                            <div>
                                <div id='streetResult' className='container' />
                                {
                                    isMember ?
                                        <PostForm updatePostFeed={this.updatePostFeed} createPost={createPost} /> :
                                        null
                                }
                                <div>{currentWriter}</div>
                                <div> {postfeed.map((post, i) => <Post key={i} content={post} />)} </div>
                            </div>
                        </div>
                    </li>
                    <li className='col-md-2'>
                        <div className='panel n-mystreet-group-details'>
                            <div>{Strings.memberstitle}</div>
                            <div className='n-mystreet-members-panel'>
                                {members.map(this.eachMember)}
                            </div>
                        </div>
                    </li>
                </ol>
            </div>
        );
    }
}
