/* eslint-disable no-undef */
import React, { PropTypes } from 'react';
import { objectToParams } from 'util/utils';
import './facebook-button.scss';

const getIsMobile = () => {
    let isMobile = false;

    try {
        isMobile = !!((window.navigator && window.navigator.standalone) || navigator.userAgent.match('CriOS') || navigator.userAgent.match(/mobile/i));
    } catch (ex) {
        // continue regardless of error
    }

    return isMobile;
};

export default class FacebookLogin extends React.Component {

    static propTypes = {
        isLoggedIn: PropTypes.bool,
        callback: PropTypes.func.isRequired,
        appId: PropTypes.string.isRequired,
        disableMobileRedirect: PropTypes.bool,
        xfbml: PropTypes.bool,
        cookie: PropTypes.bool,
        reAuthenticate: PropTypes.bool,
        scope: PropTypes.string,
        redirectUri: PropTypes.string,
        isMobile: PropTypes.bool,
        autoLoad: PropTypes.bool,
        fields: PropTypes.string,
        version: PropTypes.string,
        language: PropTypes.string,
        onClick: PropTypes.func,
        children: PropTypes.node,
    };

    static defaultProps = {
        redirectUri: `${process.env.SERVER_URL}/user/login/facebook/callback`,
        scope: 'user_friends,public_profile,email,user_about_me',
        xfbml: false,
        cookie: true,
        reAuthenticate: false,
        isMobile: getIsMobile(),
        fields: 'name',
        version: '2.3',
        language: 'en_US',
        disableMobileRedirect: false,
    };

    state = {
        isSdkLoaded: false,
        isProcessing: false,
    };

    componentDidMount() {
        this._isMounted = true;
        if (document.getElementById('facebook-jssdk')) {
            this.sdkLoaded();
            return;
        }
        this.setFbAsyncInit();
        this.loadSdkAsynchronously();
        let fbRoot = document.getElementById('fb-root');
        if (!fbRoot) {
            fbRoot = document.createElement('div');
            fbRoot.id = 'fb-root';
            document.body.appendChild(fbRoot);
        }
        this.setFbAsyncInit();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    setStateIfMounted(state) {
        if (this._isMounted) {
            this.setState(state);
        }
    }

    onLoginClick = () => {
        const { isSdkLoaded, isProcessing } = this.state;
        const { isMobile, disableMobileRedirect } = this.props;
        if (!isSdkLoaded || isProcessing) {
            return;
        }
        document.body.classList.add('loading');
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

        if (isMobile && !disableMobileRedirect) {
            window.location.href = `//www.facebook.com/dialog/oauth?${objectToParams(params)}`;
        } else {
            window.FB.login(this.checkLoginState, { scope, auth_type: params.auth_type });
        }
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
            this.setStateIfMounted({ isSdkLoaded: true });
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
            document.body.classList.remove('loading');
            callback(me);
        });
    };

    checkLoginState = (response) => {
        const { callback } = this.props;

        if (response.authResponse) {
            this.responseApi(response.authResponse);
        } else if (callback) {
            document.body.classList.remove('loading');
            callback({ status: response.status });
        }
    };

    checkLoginAfterRefresh = (response) => {
        if (response.status === 'connected') {
            this.checkLoginState(response);
        } else {
            window.FB.login(loginResponse => this.checkLoginState(loginResponse), true);
        }
    };

    sdkLoaded() {
        this.setState({ isSdkLoaded: true });
    }

    render() {
        const { children } = this.props;

        return (
            <li><a className='n-facebook-login-button' onClick={this.onLoginClick}>{children}</a></li>
        );
    }

}
