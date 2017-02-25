import React, { PropTypes } from 'react';
import { PostForm, Post, Map } from 'components';
import { Strings } from 'resources';
import usericon from 'resources/images/profile.png';
import './my-streets.scss';


export default class MyStreets extends React.Component {

    static propTypes = {
        selectedStreet: PropTypes.shape({
            streetName: PropTypes.string,
            place_id: PropTypes.string,
            location: PropTypes.array,
            members: PropTypes.array,
        }),
        members: PropTypes.array,
        activeUser: PropTypes.shape({
            userId: PropTypes.string,
            name: PropTypes.string,
            local: PropTypes.shape({
                isPremium: PropTypes.bool,
                lastLogged: PropTypes.string,
                streets: PropTypes.array,
            }),
        }),
        isAuthenticated: PropTypes.bool.isRequired,
        createPost: PropTypes.func.isRequired,
        //searchStreetSubmitted: PropTypes.func.isRequired,
        addStreetSubmitted: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            postfeed: [],
            members: [],
            currentWriter: '',
        };
    }

    updatePostFeed(newPost) {
        const { postfeed } = this.state;

        postfeed.unshift(newPost);
        this.setState({ postfeed });
    }

    eachMember(member, i, userId) {

        if (member._id === userId) {
            member = this.props.activeUser;
        }
        return (
            <div className='n-mystreet-member' key={i}>
                <img alt='user-icon' src={usericon} className='n-comment-user-icon' />
                <span className='n-member-name'>{member.name}</span>
            </div>
        );
    }

    componentWillReceiveProps = (nextProps) => {
        const members = nextProps.selectedStreet.members || [];
        this.setState({ members });
    }

    onJoinClick = () => {
        const { addStreetSubmitted, selectedStreet } = this.props;
        addStreetSubmitted(selectedStreet);
    }

    createMembersList = (members) => {
        const { activeUser: { userId } } = this.props;
        return members.map((member, i) => this.eachMember(member, i, userId));
    }

    isMember = () => {
        const { members } = this.state;
        const { activeUser: { userId } } = this.props;
        return members.find(x => x._id === userId) !== undefined;
    }

    handleAddStreet = e => {
        const { addStreetSubmitted, selectedStreet } = this.props;
        addStreetSubmitted(selectedStreet);
    };

    /*handleSearchStreet = street => {
        const { searchStreetSubmitted } = this.props;
        searchStreetSubmitted(street);
    };*/

    render() {
        const { currentWriter, postfeed, members, isLogged } = this.state;
        const { createPost, isAuthenticated, selectedStreet: { streetName, location } } = this.props;

        return (
            <div className='n-mystreet'>
                <div className='n-mystreet-page-header'>{ streetName }</div>
                <div className='n-mystreet__add-street'>
                    {
                        this.isMember() !== true ?
                            <button
                                type='submit'
                                className='n-mystreet__add-street-btn btn btn-sm n-btn-post'
                                onClick={this.onJoinClick}
                                disabled={!isAuthenticated}
                                title='You must sign in'
                            >
                                { Strings.join }
                            </button> : null
                    }
                </div>
                <ol className='list-inline'>
                    <li className='n-mystreet-leftCol col-md-3'>
                        <Map lng={location[0]} lat={location[1]} />
                    </li>
                    <li className='n-mystreet-content col-md-4'>
                        <div>
                            <div>
                                <div id='streetResult' className='container' />
                                {
                                    this.isMember() !== true ?
                                        null : <PostForm updatePostFeed={this.updatePostFeed} createPost={createPost} />
                                }
                                <div>{currentWriter}</div>
                                <div> {postfeed.map((post, i) => <Post key={i} content={post} />)} </div>
                            </div>
                        </div>
                    </li>
                    <li className='col-md-2'>
                        <div className='panel n-mystreet-group-details'>
                            <div><b>{Strings.memberstitle}</b></div>
                            <div className='n-mystreet-members-panel'>
                                {members.length > 0 ? this.createMembersList(members) : 'Be the first to join the street'}
                            </div>
                        </div>
                    </li>
                </ol>
            </div>
        );
    }
}
