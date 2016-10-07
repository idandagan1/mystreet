import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TextBox.scss';

@withStyles(s)
class TextBox extends Component {

  static propTypes = {
    maxLines: PropTypes.number,
  };

  static defaultProps = {
    maxLines: 1,
  };

  render() {
    return (
      <div className={s.root}>
        {
          this.props.maxLines > 1 ?
            <textarea
              {...this.props}
              className={s.input}
              ref="input"
              key="input"
              rows={this.props.maxLines}
            /> :
            <input
              {...this.props}
              className={s.input}
              ref="input"
              key="input"
            />
        }
      </div>
    );
  }

}

export default TextBox;
