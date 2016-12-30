import React from 'react';
import { Strings } from 'resources';
import usericon from 'resources/images/profile.png';
import './comment.scss';

class Comment extends React.Component {

    constructor(props) {
        super(props);

    }

    render(){
        if(this.props.comment){
            return (
                <div>
                    <img src={usericon} className="n-comment-user-icon"/>
                    <div className="n-comment-body">
                        <div>
                            <div className="n-comment-username">
                                {this.props.comment.username}
                            </div>
                            <div className="n-comment-wrapper">
                                {this.props.comment.content}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default Comment;
