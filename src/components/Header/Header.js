import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.scss';
import Link from '../Link';
import Navigation from '../Navigation';

class Header extends Component {

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Navigation className={s.nav} />
          <Link className={s.brand} to="/">
            <img src={require('./street.jpeg')} width="38" height="38" alt="React" />
            <span className={s.brandTxt}>My Street</span>
          </Link>
          <div className={s.banner}>
            <h1 className={s.bannerTitle}>My Street</h1>
            <p className={s.bannerDesc}>For better neighborhood</p>
          </div>
        </div>
      </div>
    );
  }

}

export default withStyles(Header, s);
