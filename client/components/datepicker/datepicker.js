import React, { PropTypes } from 'react';
import { datepicker } from 'jquery-ui';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import './datepicker.scss';

export default class Datepicker extends React.Component{

    static propTypes = {
        onDateChange: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props)
        this.state = {
            startDate: moment(),
        };
    }

    handleChange = (date) => {
        const { onDateChange } = this.props;
        this.setState({
            startDate: date,
        });
        onDateChange(date);
    }

    render() {
        return (
            <div className='n-datepicker-wrapper'>
                <DatePicker
                    selected={this.state.startDate}
                    onChange={this.handleChange}
                />
            </div>
        );
    }
}
