import React, { PropTypes } from 'react';
import facebookicon from 'resources/images/facebook-icon.ico';
import { Map, Datepicker } from 'components';
import $ from 'jquery';
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
        Strings: PropTypes.shape({
            search: PropTypes.string,
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
        updatedProfileSubmitted: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        const { activeUser } = props;
        this.state = {
            user: activeUser,
            editable: false,
            first_name: '',
            last_name: '',
            address: '',
            newAddress: '',
            dateOfBirth: '',
            gender: '',
            job: '',
            college: '',
            id: '',
            empty: 'empty',
            friends: [],
            ...initialState.activeUser.primaryStreet,
        };
    }

    updateState = (props) => {
        const { activeUser, selectedUser, params: { id: selectedId } } = props;
        const editable = activeUser.facebook.id === selectedId;
        const { facebook: { first_name, last_name, gender, id, friends }, local: { primaryStreet, job, college } } = editable ? activeUser : selectedUser;
        const { address, location, placeId } = primaryStreet || initialState.activeUser.primaryStreet;
        this.setState({ editable, first_name, last_name, gender, friends, id, job, college, location, address, placeId, newAddress: address });
    }

    componentDidMount() {
        this.updateState(this.props);
    }

    createUsersStreet() {
        const { activeUser: { local: { primaryStreet, streets } } } = this.props;
        const placeId = primaryStreet ? primaryStreet.placeId : '';
        return (
            <select defaultValue={placeId} className='col-sm-12 custom-select' onChange={(e) => this.handleChange(e, 'newAddress')}>
                {
                    streets.map((street, i) => <option key={i} value={street.placeId}>{street.address}</option>)
                }
            </select>
        );
    }

    onDateChange = (date) => {
        this.setState({ dateOfBirth: date });
    }

    componentWillReceiveProps(nextProps) {
        this.updateState(nextProps);
    }

    handleChange = (e, name) => {
        this.setState({ [name]: e.target.value });
    }

    onSaveClick = (e) => {
        e.preventDefault();
        const { Strings } = this.props;
        $('#msg-report').text(Strings.profileChangeMsg);
        $('#msg-report').fadeIn('slow');
        setTimeout(() => {
            $('#msg-report').fadeOut();
        }, 4000);
        const { updatedProfileSubmitted, activeUser: { _id } } = this.props;
        const { first_name, last_name, gender, job, college, newAddress, dateOfBirth } = this.state;
        updatedProfileSubmitted({ first_name, dateOfBirth, last_name, gender, job, college, newAddress, _id });
        $('html, body').animate({scrollTop: '0px'}, 300);
    }

    render() {
        const { user, dateOfBirth, first_name, last_name, friends, gender, id, job, college, address, location, placeId, editable, empty } = this.state;
        const { Strings } = this.props;

        const picturePath = `https://graph.facebook.com/${id}/picture?type=normal`;
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
                            <h2>{Strings.aboutTitle}</h2>
                        </div>
                        <form className='form-horizontal'>
                            <div className='form-group'>
                                <label
                                    htmlFor='inputEmail3'
                                    className='col-sm-5 control-label'
                                >{Strings.firstName}</label>
                                <div className='col-sm-3'>
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
                                    className='col-sm-5 control-label'
                                >{Strings.lastName}</label>
                                <div className='col-sm-3'>
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
                                    className='col-sm-5 control-label'
                                >{Strings.address}</label>
                                <div className='col-sm-3'>
                                    {
                                        editable ?
                                            this.createUsersStreet() :
                                            <label className='col-sm-7 control-label slabel'>
                                                {address}
                                            </label>
                                    }
                                </div>
                            </div>
                            {/*<div className='form-group'>*/}
                                {/*<label*/}
                                    {/*htmlFor='inputPassword3'*/}
                                    {/*className='col-sm-5 control-label'*/}
                                {/*>{Strings.dateOfBirthTitle}</label>*/}
                                {/*<div className='col-sm-3'>*/}
                                    {/*{*/}
                                        {/*editable ?*/}
                                            {/*<Datepicker onDateChange={this.onDateChange} /> :*/}
                                            {/*<label className='col-sm-7 control-label slabel'>*/}
                                                {/*20/03/89*/}
                                            {/*</label>*/}
                                    {/*}*/}
                                {/*</div>*/}
                            {/*</div>*/}
                            <div className='form-group'>
                                <label
                                    htmlFor='inputPassword3'
                                    className='col-sm-5 control-label'
                                >{Strings.gender}</label>
                                {
                                    editable ?
                                        <div className='col-sm-4 txtleft'>
                                            <div>
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
                                                    {Strings.male}
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
                                                    {Strings.female}
                                                </label>
                                            </div>
                                        </div> :
                                        <div className='col-sm-5'>
                                            <label className='col-sm-7 control-label slabel'>
                                                {gender}
                                            </label>
                                        </div>
                                }
                            </div>
                            <div className='page-header'>
                                <h2>{Strings.workAndEducationTitle}</h2>
                            </div>
                            <div className='form-group'>
                                <label
                                    htmlFor='inputPassword3'
                                    className='col-sm-5 control-label'
                                >{Strings.jobTitle}</label>
                                <div className='col-sm-3'>
                                    {
                                        editable ?
                                            <textarea
                                                className='form-control'
                                                rows='1'
                                                placeholder={Strings.jobPlaceHolder}
                                                onChange={(e) => this.handleChange(e, 'job')}
                                                value={job}
                                            /> :
                                            <label className='col-sm-7 control-label slabel'>
                                                {job || empty}
                                            </label>
                                    }
                                </div>
                            </div>
                            <div className='form-group'>
                                <label
                                    htmlFor='inputPassword3'
                                    className='col-sm-5 control-label'
                                >{Strings.collegeTitle}</label>
                                <div className='col-sm-3'>
                                    {
                                        editable ?
                                            <textarea
                                                className='form-control'
                                                rows='1'
                                                placeholder={Strings.collegePlaceHolder}
                                                onChange={(e) => this.handleChange(e, 'college')}
                                                value={college}
                                            /> :
                                            <label className='col-sm-7 control-label slabel'>
                                                {college || empty}
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
                                                onClick={this.onSaveClick}
                                            >
                                                {Strings.saveBtn}
                                            </button>
                                        </div> : null
                                }
                            </div>
                        </form>
                    </div>
                </div>
                <div className='page-header'>
                    {
                        editable ? <h2>{Strings.yourFriendsTitle}</h2> : <h2>{first_name+"'s"} Friends</h2>
                    }
                </div>
                <div className='col-md-12'>
                    <Map selectedUser={user} lat={location[1]} lng={location[0]} placeId={placeId} friends={friends} />
                </div>
            </div>
        );
    }
}
