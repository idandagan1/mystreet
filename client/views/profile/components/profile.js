import React, { PropTypes } from 'react';
import { Strings } from 'resources';
import facebookicon from 'resources/images/facebook-icon.ico';
import { Map } from 'components';
import './profile.scss';

const initialState = {
    activeUser: {
        facebook: {
            first_name: '',
            last_name: '',
        },
        gender: '',
        friends: [],
        id: '',
        primaryStreet: {
            address: '',
            location: [34.7818, 32.0853],
            placeId: '',
        },
    },
}

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

    constructor(props) {
        super(props);
        const { activeUser } = props;
        activeUser.job = '';
        activeUser.college = '';
        this.state = {
            activeUser,
        };
    }

    updateState = (state) => {
        const { activeUser } = state;
        this.setState({ activeUser });
    }

    componentDidMount() {
        this.updateState(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.updateState(nextProps);
    }

    handleChange = (e, name) => {
        this.setState({ [name]: e.target.value });
    }

    render() {
        const { activeUser } = this.state;
        const {
            local: { primaryStreet },
            facebook: { first_name, last_name, gender, id, friends },
        } = activeUser;
        const { address, location, placeId } = primaryStreet || initialState.activeUser.primaryStreet;
        const picturePath = `http://graph.facebook.com/${id}/picture?type=normal`;
        const linkToUserFacebook = `https://www.facebook.com/app_scoped_user_id/${id}`;

        return (
            <div className='n-profile globalContainer col-xs-10 col-md-10 col-lg-10'>
                <div className='col-md-12'>
                    <div className='panel n-profile-wrapper center-block'>
                        <div className='n-profile-photo'>
                            <img className='img-rounded img-responsive' alt='user-icon' src={picturePath} role='img' />
                        </div>
                        <div>
                            <a
                                href={linkToUserFacebook}
                                rel='noopener noreferrer'
                                target='_blank'
                            ><img className='n-profile-facebook-icon' alt='facebook' src={facebookicon} role='img' /></a>
                        </div>
                        <div className='page-header'>
                            <h2>About</h2>
                        </div>
                        <form className='form-horizontal'>
                            <div className='form-group'>
                                <label
                                    htmlFor='inputEmail3'
                                    className='col-sm-3 control-label'
                                >{Strings.firstName}</label>
                                <div className='col-sm-6'>
                                    <textarea
                                        className='form-control'
                                        rows='1'
                                        onChange={(e) => this.handleChange(e, 'firstName')}
                                        value={first_name}
                                        required='true'
                                    />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label
                                    htmlFor='inputPassword3'
                                    className='col-sm-3 control-label'
                                >{Strings.lastName}</label>
                                <div className='col-sm-6'>
                                    <textarea
                                        className='form-control'
                                        rows='1'
                                        onChange={(e) => this.handleChange(e, 'lastName')}
                                        value={last_name}
                                        required='true'
                                    />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label
                                    htmlFor='inputPassword3'
                                    className='col-sm-3 control-label'
                                >{Strings.address}</label>
                                <div className='col-sm-6'>
                                    <textarea
                                        className='form-control'
                                        rows='1'
                                        placeholder={Strings.noAddress}
                                        onChange={(e) => this.handleChange(e, 'address')}
                                        value={address}
                                        required='true'
                                    />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label
                                    htmlFor='inputPassword3'
                                    className='col-sm-3 control-label'
                                >{Strings.gender}</label>
                                <div className='col-sm-6'>
                                    <label
                                        htmlFor='inputPassword3'
                                        className='radio-inline'
                                    ><input
                                        type='radio'
                                        name='gender'
                                        value='male'
                                        checked={gender === 'male'}
                                        onChange={(e) => this.handleChange(e, 'gender')}
                                    />
                                        Male
                                    </label>
                                    <label
                                        htmlFor='inputPassword3'
                                        className='radio-inline'
                                        onClick={(e) => this.handleChange(e, 'gender')}
                                    ><input
                                        type='radio'
                                        name='gender'
                                        value='female'
                                        checked={gender === 'female'}
                                    />
                                        Female
                                    </label>
                                </div>
                            </div>
                            <div className='page-header'>
                                <h2>Work and Education</h2>
                            </div>
                            <div className='form-group'>
                                <label
                                    htmlFor='inputPassword3'
                                    className='col-sm-3 control-label'
                                >{Strings.jobTitle}</label>
                                <div className='col-sm-6'>
                                <textarea
                                    className='form-control'
                                    rows='1'
                                    placeholder={Strings.noAddress}
                                    onChange={(e) => this.handleChange(e, 'job')}
                                    value='Web Developer'
                                    required='true'
                                />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label
                                    htmlFor='inputPassword3'
                                    className='col-sm-3 control-label'
                                >{Strings.collegeTitle}</label>
                                <div className='col-sm-6'>
                                <textarea
                                    className='form-control'
                                    rows='1'
                                    placeholder={Strings.noAddress}
                                    onChange={(e) => this.handleChange(e, 'college')}
                                    value='Academic College of Tel-Aviv Yaffo'
                                    required='true'
                                />
                                </div>
                            </div>
                            <div className='form-group'>
                                <div className='col-sm-12'>
                                    <button type='submit' className='n-mystreet__add-street-btn btn btn-default'>Save
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className='page-header'>
                    <h2>Your Friends</h2>
                </div>
                <div className='col-md-12'>
                    <Map activeUser={activeUser} lat={location[1]} lng={location[0]} placeId={placeId} friends={friends} />
                </div>
            </div>
        );
    }
}
