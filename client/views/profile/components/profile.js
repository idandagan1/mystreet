import React, { PropTypes } from 'react';
import { Strings } from 'resources';
import facebookicon from 'resources/images/facebook-icon.ico';
import { Map } from 'components';
import './profile.scss';


const initialState = {
    firstName: '',
    lastName: '',
    address: '',
    gender: '',
    location: [34.7818, 32.0853],
    placeId: '',
    id: '',
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
        this.state = {
            ...initialState,
        };
    }

    changeState = (state) => {
        const {
            activeUser: {
                local: { primaryStreet },
                facebook: { id, first_name: firstName, last_name: lastName, gender },
            },
        } = state;
        const { location, address, placeId } = primaryStreet || initialState;

        this.setState({
            location,
            address,
            id,
            firstName,
            lastName,
            gender,
            placeId,
        });
    }

    componentDidMount() {
        this.changeState(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.changeState(nextProps);
    }

    handleChange = (e, name) => {
        this.setState({ [name]: e.target.value });
    }

    render() {
        const { id, firstName, lastName, gender, address, location, placeId } = this.state;
        const picturePath = `http://graph.facebook.com/${id}/picture?type=normal`;
        const linkToUserFacebook = `https://www.facebook.com/app_scoped_user_id/${id}`;

        return (
            <div className='n-profile globalContainer col-xs-8 col-md-8 col-lg-6'>
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
                        <div style={{ height: 10 }} />
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
                                        value={firstName}
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
                                        value={lastName}
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
                            <div className='form-group'>
                                <div className='col-sm-12'>
                                    <button type='submit' className='n-mystreet__add-street-btn btn btn-default'>Save
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className='col-md-12'>
                    <Map lat={location[1]} lng={location[0]} placeId={placeId} />
                </div>
            </div>
        );
    }
}
