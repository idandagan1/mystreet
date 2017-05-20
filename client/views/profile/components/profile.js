import React, { PropTypes } from 'react';
import { Strings } from 'resources';
import './profile.scss';

export default class Profile extends React.Component {

    static propTypes = {
        activeUser: PropTypes.shape({
            userId: PropTypes.string,
            name: PropTypes.string,
            local: PropTypes.shape({
                isPremium: PropTypes.bool,
                lastLogged: PropTypes.string,
                streets: PropTypes.array,
            }),
        }),
    }
    render() {
        const { activeUser: { facebook: { id, first_name, last_name }, name } } = this.props;
        const picturePath = `http://graph.facebook.com/${id}/picture?type=normal`;
        const linkToUserFacebook = `https://www.facebook.com/app_scoped_user_id/${id}`;

        return (
            <div className='n-profile row'>
                <div className='col-md-5 col-md-offset-3 col-sm-8 col-sm-offset-2'>
                    <div className='panel n-profile-wrapper center-block'>
                        <div className='n-profile-photo'>
                            <img className='img-rounded img-responsive' alt='user-icon' src={picturePath} role='img' />
                        </div>
                        <form className='form-horizontal'>
                            <div className='form-group'>
                                <label htmlFor='inputEmail3' className='col-sm-3 control-label'>First Name</label>
                                <div className='col-sm-6'>
                                    <textarea
                                        className='form-control'
                                        rows='1'
                                        defaultValue={first_name}
                                        required='true'
                                    />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label htmlFor='inputPassword3' className='col-sm-3 control-label'>Last Name</label>
                                <div className='col-sm-6'>
                                    <textarea
                                        className='form-control'
                                        rows='1'
                                        defaultValue={last_name}
                                        required='true'
                                    />
                                </div>
                            </div>
                            <div className='form-group'>
                                <div className='col-sm-12'>
                                    <button type='submit' className='n-mystreet__add-street-btn btn btn-default'>Save</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

}
