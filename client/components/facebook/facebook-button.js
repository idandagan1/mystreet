/* eslint-disable no-undef */
import React, { PropTypes } from 'react';
import './facebook-button.scss';

export default class FacebookLogin extends React.Component {

    static propTypes = {
        isLoggedIn: PropTypes.bool,
        callback: PropTypes.func.isRequired,
        appId: PropTypes.string.isRequired,
        xfbml: PropTypes.bool,
        cookie: PropTypes.bool,
        reAuthenticate: PropTypes.bool,
        scope: PropTypes.string,
        redirectUri: PropTypes.string,
        autoLoad: PropTypes.bool,
        fields: PropTypes.string,
        version: PropTypes.string,
        language: PropTypes.string,
        onClick: PropTypes.func,
        children: PropTypes.node,
    };

    static defaultProps = {
        redirectUri: 'http://localhost:8001/user/login/facebook/callback',
        scope: 'user_friends,public_profile,email,user_about_me',
        xfbml: false,
        cookie: false,
        reAuthenticate: false,
        fields: 'name',
        version: '2.3',
        language: 'en_US',
        disableMobileRedirect: false,
    };

    state = {
        isProcessing: false,
    };

    componentDidMount() {
        if (document.getElementById('facebook-jssdk')) {
            this.sdkLoaded();
            return;
        }
        this.loadSdkAsynchronously();
        let fbRoot = document.getElementById('fb-root');
        if (!fbRoot) {
            fbRoot = document.createElement('div');
            fbRoot.id = 'fb-root';
            document.body.appendChild(fbRoot);
        }
        this.setFbAsyncInit();
    }

    onLoginClick = () => {
        const { isProcessing } = this.state;
        const {
            scope,
            appId,
            onClick,
            reAuthenticate,
            redirectUri,
            isLoggedIn,
        } = this.props;

        if (isProcessing || isLoggedIn) {
            return;
        }

        this.setState({ isProcessing: true });

        if (typeof onClick === 'function') {
            onClick();
        }

        const params = {
            client_id: appId,
            redirect_uri: redirectUri,
            state: 'facebookdirect',
            scope,
        };

        if (reAuthenticate) {
            params.auth_type = 'reauthenticate';
        }

        window.FB.login(this.checkLoginState, { scope, auth_type: params.auth_type });
    };

    setFbAsyncInit() {
        const { appId, xfbml, cookie, version, autoLoad } = this.props;
        window.fbAsyncInit = () => {
            window.FB.init({
                version: `v${version}`,
                appId,
                xfbml,
                cookie,
            });
            if (autoLoad || window.location.search.includes('facebookdirect')) {
                window.FB.getLoginStatus(this.checkLoginAfterRefresh);
            }
        };
    }

    loadSdkAsynchronously() {
        const { language } = this.props;
        ((d, s, id) => {
            const element = d.getElementsByTagName(s)[0];
            const fjs = element;
            let js = element;
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = `//connect.facebook.net/${language}/all.js`;
            fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');
    }

    responseApi = (authResponse) => {
        const { fields, callback } = this.props;

        window.FB.api('/me', { fields }, (me) => {
            Object.assign(me, authResponse);
            callback(me);
        });
    };

    checkLoginState = (response) => {
        const { callback } = this.props;

        //this.setState({ isProcessing: false });

        if (response.authResponse) {
            this.responseApi(response.authResponse);
        } else if (callback) {
            callback({ status: response.status });
        }
    };

    checkLoginAfterRefresh = (response) => {
        if (response.status === 'unknown') {
            window.FB.login(loginResponse => this.checkLoginState(loginResponse), true);
        } else {
            this.checkLoginState(response);
        }
    };

    render() {
        const { children } = this.props;

        return (
            <li><a className='n-facebook-login-button' onClick={this.onLoginClick}>{children}</a></li>
        );
    }

}
