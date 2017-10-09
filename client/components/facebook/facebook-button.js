import React, { PropTypes } from 'react';

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
        buttonText: PropTypes.string,
    };

    componentDidMount() {
        (function (d, s, id) {
            const element = d.getElementsByTagName(s)[0];
            const fjs = element;
            let js = element;
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = '//connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        window.fbAsyncInit = () => {
            FB.init({
                appId: this.props.socialId,
                xfbml: this.props.xfbml,
                cookie: this.props.cookie,
                version: this.props.version,
            });
        };
    }

    responseApi = (authResponse) => {
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
            if (callback) {
                document.body.classList.remove('loading');
                callback({ status: response.status });
            }
        }
    }

    onLoginClick = () => {
        document.body.classList.add('loading');
        FB.getLoginStatus((response) => {
            if (response.status !== 'connected') {
                FB.login(this.checkLoginState, { scope: this.props.scope });
            } else {
                this.checkLoginState(response);
            }
        });
    };

    render() {
        const {
            appId, xfbml, cookie, version, language, fields, onClick,
            children, buttonText, ...props
        } = this.props;

        return (
            <li>
                <a
                    className='btn n-google-search-btn-search n-ch'
                    onClick={this.onLoginClick}
                >{buttonText}</a>
            </li>
        );
    }
}
