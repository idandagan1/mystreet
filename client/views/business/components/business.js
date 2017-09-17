import React, { PropTypes } from 'react';
import { Map } from 'components';
import './business.scss';

export default class Business extends React.Component {

    static propTypes = {
        getUsersByRadius: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            radius: 3,
            numOfNeighbors: 0,
            users: [],
        };
    }

    onPostClick = () => {

    }

    groupByUsers(xs) {
        if (Object.keys(xs).length === 0 && xs.constructor === Object) {
            return;
        }
        return xs.reduce((rv, x) => {
            if (rv[x.facebook.id]) {
                return rv;
            } else {
                rv[x.facebook.id] = x;
            }
            return rv;
        }, []);
    }

    componentWillReceiveProps(nextProps) {
        const { users } = this.props;
        const arr = [];
        for (const user of users) {
            arr.push(...user);
        }
        this.setState({ numOfNeighbors: arr.length, users: this.groupByUsers(arr) });
    }

    handleChange = e => {
        const { getUsersByRadius, activeUser: { activeUser: { local: { primaryStreet: { location } } } } } = this.props;
        getUsersByRadius(this.radius.value, location);
        this.setState({ radius: this.radius.value });
    }

    render() {
        const { radius, numOfNeighbors, users } = this.state;
        const { activeUser: { activeUser: { local: { primaryStreet: { location, placeId } } } } } = this.props;
        return (
            <div className='n-business'>
                <h1>Invite your neighbors</h1>
                <div>
                    <label
                        htmlFor='inputPassword3'
                        className='control-label'
                    >Enter your message:</label>
                    <textarea
                        className='form-control'
                        id='exampleFormControlTextarea1'
                        rows='3'
                    ></textarea>
                </div>
                <div id='n-radius'>
                    <label
                        htmlFor='inputPassword3'
                        className='control-label'
                    >Choose a radius:</label>
                    <input
                        type='range'
                        min='0'
                        max='10'
                        step='1'
                        ref={setRadius => { this.radius = setRadius; }}
                        defaultValue='0'
                        onMouseUp={this.handleChange}
                    />
                </div>
                <Map users={users} radius={Number(radius)} lat={location[1]} lng={location[0]} placeId={placeId} />
                <div id='postBtn'>
                    <button
                        type='submit'
                        className='n-mystreet__add-street-btn btn btn-default'
                        onClick={this.onPostClick}
                    >
                        Post
                    </button>
                </div>
            </div>
        );
    }
}
