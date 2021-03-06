import React, { useEffect } from 'react'
import FacebookIcon from '../Icons/facebookIcon';
import useFacebookSignin from './useFacebookSignIn';

const APP_ID = '';
const API_VERSION = 'v9.0';
const FB_SCOPES = 'public_profile,email';

const FacebookSignIn = ({ onLoginSuccess }) => {
    const onLoginFail = (err) => { console.log('Login Failed', err) };
    const onLogoutFail = (err) => { console.log('Logout Failed', err) };

    const {
        isScriptLoaded,
        doLogin,
        removeScript } = useFacebookSignin({
            appId: APP_ID,
            apiVersion: API_VERSION,
            scopes: FB_SCOPES,
            onLoginSuccess,
            onLoginFail,
            onLogoutFail
        });

    useEffect(() => {
        return () => {
            removeScript();
        }
    }, [removeScript]);

    return isScriptLoaded ? (
        <div className='social-login-button' onClick={doLogin}>
            <div className='icon'>
                <FacebookIcon />
            </div>
            <p>Facebook</p>
        </div>
    ) : null;
}

export default FacebookSignIn;