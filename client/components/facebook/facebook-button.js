import React, { PropTypes } from 'react';
import { login } from 'actions/user-action-creators';

export default class FacebookLogin extends React.Component {

    static propTypes = {

        callback: PropTypes.func.isRequired,
        appId: PropTypes.string.isRequired,
        xfbml: PropTypes.bool,
        cookie: PropTypes.bool,
        scope: PropTypes.string,
        isMobile: PropTypes.bool,
        autoLoad: PropTypes.bool,
        fields: PropTypes.string,
        version: PropTypes.string,
        language: PropTypes.string,
        onClick: PropTypes.func,
        children: PropTypes.node,
        className: PropTypes.string,
        buttonText: PropTypes.string,
    };

    componentDidMount() {
        document.body.classList.add('loading');
        const { autoLoad, callback } = this.props;
        (function (d, s, id) {
            const element = d.getElementsByTagName(s)[0];
            const fjs = element;
            let js = element;
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = '//connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        window.fbAsyncInit = () => {
            FB.init({
                appId: this.props.appId,
                xfbml: this.props.xfbml,
                cookie: this.props.cookie,
                version: this.props.version,
            });

            if (autoLoad || window.location.search.includes('facebookdirect')) {
                FB.getLoginStatus((response) => this.responseApi(response.authResponse));
            } else {
                document.body.classList.remove('loading');
            }
        };
    }

    responseApi = (authResponse) => {
        if (!authResponse) {
            document.body.classList.remove('loading');
            return;
        }
        const { callback } = this.props;
        FB.api('/me', { fields: this.props.fields }, (me) => {
            me.accessToken = authResponse.accessToken;
            document.body.classList.remove('loading');
            callback(me);
        });
    }

    checkLoginState = (response) => {
        const { callback } = this.props;
        if (response.authResponse) {
            this.responseApi(response.authResponse);
        } else {
            document.body.classList.remove('loading');
            callback({ status: response.status });
        }
    }

    onLoginClick = () => {
        document.body.classList.add('loading');
        FB.getLoginStatus((response) => {
            if (response.status !== 'connected') {
                 window.location = process.env.NODE_ENV === 'production' ?
                     'https://mystreet.herokuapp.com/user/auth/facebook/callback'
                     : 'http://localhost:8001/user/auth/facebook';
            } else {
                this.checkLoginState(response);
            }
        });
    };

    render() {
        const { buttonText, className } = this.props;

        return (
            <a
                className={className}
                onClick={this.onLoginClick}
            >{buttonText}</a>
        );
    }
}
