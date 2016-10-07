import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ContentPage.scss';

const title = 'About Us';

class ContentPage extends Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.context.onSetTitle(title);
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{title}</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean consequat
            tortor fermentum mi fermentum dignissim. Nullam vel ipsum ut ligula elementum
            lobortis. Maecenas aliquam, massa laoreet lacinia pretium, nisi urna venenatis
            tortor, nec imperdiet tellus libero efficitur metus. Fusce semper posuere
            ligula, et facilisis metus bibendum interdum. Mauris at mauris sit amet sem
            pharetra commodo a eu leo. Nam at est non risus cursus maximus. Nam feugiat
            augue libero, id consectetur tortor bibendum non. Quisque nec fringilla lorem.
            Nullam efficitur vulputate mauris, nec maximus leo dignissim id.
          </p>
        </div>
      </div>
    );
  }

}

export default withStyles(ContentPage, s);
