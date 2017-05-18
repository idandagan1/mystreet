import React from 'react';
import { Strings } from 'resources';
import './profile.scss';

class Profile extends React.Component {


    render(){
        return (
            <div className="row">
                <div className="panel-content">">
                    <form className="col-md-offset-4 n-profile-wrapper">
                        <div className="col-md-4 ">
                            <div className="n-profile-photo">
                                img
                            </div>
                        </div>
                        <div className="col-md-6 n-profile-user-details">
                            <div className="n-profile-item">
                                <div className="n-profile-label"> First name:</div>
                                <textarea className="n-profile-text" rows="1"></textarea>
                            </div>
                            <div className="n-profile-item">
                                <div className="n-profile-label"> Last name:</div>
                                <textarea className="n-profile-text" rows="1"></textarea>
                            </div>
                        </div>

                    </form>

                </div>
            </div>
        )
    }

}

export default Profile;
