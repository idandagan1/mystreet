import React, { PropTypes } from 'react';
import $ from 'jquery';
import './my-streets.scss';

export default class Report extends React.Component {

    static propTypes = {
        Strings: PropTypes.shape({
            search: PropTypes.string,
        }),
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedOption: 'option1',
            isOtherDisabled: true,
        };
    }

    onSubmit = e => {
        e.preventDefault();
        const { Strings } = this.props;
        $('#msg-report').text(Strings.reportFormMsg);
        $('#msg-report').fadeIn('slow');
        setTimeout(() => {
            $('#msg-report').fadeOut();
        }, 4000);
    };

    onRadioChange = e => {
        this.setState({
            isOtherDisabled: e.target.value !== 'option3',
            selectedOption: e.target.value,
        });
    };

    render() {
        const { selectedOption, isOtherDisabled } = this.state;
        return (
            <div className='modal fade' id='myModal' role='dialog'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <button type='button' className='close' data-dismiss='modal'>&times;</button>
                            <h4 className='modal-title'>Report a member</h4>
                        </div>
                        <div className='modal-body'>
                            <h5>Please choose the reason for the report:</h5>
                            <form>
                                <div className='radio'>
                                    <label>
                                        <input
                                            type='radio'
                                            value='option1'
                                            checked={selectedOption === 'option1'}
                                            onChange={this.onRadioChange}
                                        />
                                        This member doesn't live here
                                    </label>
                                </div>
                                <div className='radio'>
                                    <label>
                                        <input
                                            type='radio'
                                            value='option2'
                                            checked={selectedOption === 'option2'}
                                            onChange={this.onRadioChange}
                                        />
                                        This member is not acting by the street rules
                                    </label>
                                </div>
                                <div className='radio'>
                                    <label>
                                        <input
                                            type='radio'
                                            value='option3'
                                            checked={selectedOption === 'option3'}
                                            onChange={this.onRadioChange}
                                        />
                                        Other
                                    </label>
                                </div>
                                <textarea
                                    className='form-control'
                                    id='exampleFormControlTextarea1'
                                    rows='3'
                                    disabled={isOtherDisabled}
                                    required={!isOtherDisabled}
                                ></textarea>
                            </form>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' className='btn btn-danger' data-dismiss='modal' onClick={this.onSubmit}>Report</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
