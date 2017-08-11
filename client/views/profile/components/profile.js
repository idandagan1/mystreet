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
            _id: PropTypes.string,
            name: PropTypes.string,
            local: PropTypes.shape({
                isPremium: PropTypes.bool,
                lastLogged: PropTypes.string,
                streets: PropTypes.array,
            }),
        }),
        selectedUser: PropTypes.shape({
            _id: PropTypes.string,
            name: PropTypes.string,
            local: PropTypes.shape({
                isPremium: PropTypes.bool,
                lastLogged: PropTypes.string,
                streets: PropTypes.array,
            }),
        }),
        editable: PropTypes.bool,
        params: PropTypes.shape({
            id: PropTypes.string,
        }),
    }

    constructor(props) {
        super(props);
        const { activeUser } = props;
        this.state = {
            user: activeUser,
            editable: false,
            first_name: '',
            last_name: '',
            gender: '',
            job: '',
            college: '',
            id: '',
            friends: [],
            ...initialState.activeUser.primaryStreet,
        };
    }

    updateState = () => {
        const { activeUser, selectedUser, params: { id: selectedId } } = this.props;
        const editable = activeUser.facebook.id === selectedId;
        const { facebook: { first_name, last_name, gender, id, friends }, job, college, local: { primaryStreet: { address, location, placeId } } } = editable ? activeUser : selectedUser;
        this.setState({ editable, first_name, last_name, gender, friends, id, job, college, location, address, placeId });
    }

    componentDidMount() {
        this.updateState();
    }

    componentWillReceiveProps(nextProps) {
        this.updateState(nextProps);
    }

    handleChange = (e, name) => {
        this.setState({ [name]: e.target.value });
    }

    render() {
        const { user, first_name, last_name, friends, gender, id, job, college, address, location, placeId, editable } = this.state;

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
                                    {
                                        editable ?
                                            <textarea
                                                className='form-control'
                                                rows='1'
                                                onChange={(e) => this.handleChange(e, 'first_name')}
                                                value={first_name}
                                                required='true'
                                            /> :
                                            <label className='col-sm-3 control-label slabel'>
                                                {first_name}
                                            </label>
                                    }
                                </div>
                            </div>
                            <div className='form-group'>
                                <label
                                    htmlFor='inputPassword3'
                                    className='col-sm-3 control-label'
                                >{Strings.lastName}</label>
                                <div className='col-sm-6'>
                                    {
                                        editable ?
                                            <textarea
                                                className='form-control'
                                                rows='1'
                                                onChange={(e) => this.handleChange(e, 'last_name')}
                                                value={last_name}
                                                required='true'
                                            /> :
                                            <label className='col-sm-3 control-label slabel'>
                                                {last_name}
                                            </label>
                                    }
                                </div>
                            </div>
                            <div className='form-group'>
                                <label
                                    htmlFor='inputPassword3'
                                    className='col-sm-3 control-label'
                                >{Strings.address}</label>
                                <div className='col-sm-6'>
                                    {
                                        editable ?
                                            <textarea
                                                className='form-control'
                                                rows='1'
                                                placeholder={Strings.noAddress}
                                                onChange={(e) => this.handleChange(e, 'address')}
                                                value={address}
                                                required='true'
                                            /> :
                                            <label className='col-sm-3 control-label slabel'>
                                                {address}
                                            </label>
                                    }
                                </div>
                            </div>
                            <div className='form-group'>
                                <label
                                    htmlFor='inputPassword3'
                                    className='col-sm-3 control-label'
                                >{Strings.gender}</label>
                                {
                                    editable ?
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
                                        ><input
                                            type='radio'
                                            name='gender'
                                            value='female'
                                            checked={gender === 'female'}
                                            onChange={(e) => this.handleChange(e, 'gender')}
                                        />
                                            Female
                                        </label>
                                    </div> :
                                    <div className='col-sm-6'>
                                        <label className='col-sm-3 control-label slabel'>
                                            {gender}
                                        </label>
                                    </div>
                                }
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
                                    {
                                        editable ?
                                            <textarea
                                                className='form-control'
                                                rows='1'
                                                placeholder={Strings.jobPlaceHolder}
                                                onChange={(e) => this.handleChange(e, 'job')}
                                                value={job}
                                                required='true'
                                            /> :
                                            <label className='col-sm-3 control-label slabel'>
                                                {job}
                                            </label>
                                    }
                                </div>
                            </div>
                            <div className='form-group'>
                                <label
                                    htmlFor='inputPassword3'
                                    className='col-sm-3 control-label'
                                >{Strings.collegeTitle}</label>
                                <div className='col-sm-6'>
                                    {
                                        editable ?
                                            <textarea
                                                className='form-control'
                                                rows='1'
                                                placeholder={Strings.collegePlaceHolder}
                                                onChange={(e) => this.handleChange(e, 'college')}
                                                value={college}
                                                required='true'
                                            /> :
                                            <label className='col-sm-3 control-label slabel'>
                                                {college}
                                            </label>
                                    }
                                </div>
                            </div>
                            <div className='form-group'>
                                {
                                    editable ?
                                        <div className='col-sm-12'>
                                            <button
                                                type='submit'
                                                className='n-mystreet__add-street-btn btn btn-default'
                                            >
                                                Save
                                            </button>
                                        </div> : null
                                }
                            </div>
                        </form>
                    </div>
                </div>
                <div className='page-header'>
                    {
                        editable ? <h2>Your Friends</h2> : <h2>{first_name+"'s"} Friends</h2>
                    }
                </div>
                <div className='col-md-12'>
                    <Map selectedUser={user} lat={location[1]} lng={location[0]} placeId={placeId} friends={friends} />
                </div>
            </div>
        );
    }
}
