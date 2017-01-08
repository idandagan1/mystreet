import React, { PropTypes } from 'react';
import { PostForm, Post, GoogleSearch, Map } from 'components';
import { Strings } from 'resources';
import usericon from 'resources/images/profile.png';
import './my-streets.scss';


export default class MyStreets extends React.Component {

    static propTypes = {
        createPost: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            postfeed: [],
            currentWriter: '',
            members: ['Idan', 'Michael', 'Daniel'],
        };
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

    render() {
        const { currentWriter, postfeed, members } = this.state;
        const { createPost } = this.props;

        return (
            <div className='n-mystreet'>
                <div className='n-mystreet__add-street'>
                    <GoogleSearch onSubmit={this.onSubmit} />
                    <button
                        type='submit'
                        className='n-mystreet__add-street-btn btn btn-sm n-btn-post'
                    >
                        Add Street
                    </button>
                </div>
                <ol className='list-inline'>
                    <li className='n-mystreet-leftCol col-md-3'>
                        <Map />
                    </li>
                    <li className='n-mystreet-content col-md-4'>
                        <div>
                            <div>
                                <div id='streetResult' className='container'></div>
                                <PostForm updatePostFeed={this.updatePostFeed} createPost={createPost} />
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
