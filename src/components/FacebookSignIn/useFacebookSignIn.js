import { useState } from 'react'
import useLoadScript from '../../hooks/useLoadScript';

const SCRIPT_URL = 'https://connect.facebook.net/en_US/sdk.js';
/**
 * 
 * @param {{
 *  appId: string, 
 *  apiVersion: string, 
 *  scopes: string, 
 *  onLoginFail: () => void, 
 *  onLogoutFail: () => void
 * }} params 
 */
const useFacebookSignin = (params) => {
    const { 
        appId, 
        apiVersion, 
        scopes, 
        onLoginSuccess, 
        onLoginFail, 
        onLogoutFail } = params;
    /** Indicates if Facebook script is loading */
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profileData, setProfileData] = useState();

    /**
     * Initialize facebook Auth client
     */
    const initFacebookAuth = async () => {
        await window.FB.init({
            appId,
            cookie: true,
            xfbml: true,
            version: apiVersion
        });

        // Facebook auth client is now ready to be consumed
        setIsLoading(false);
        window.FB.getLoginStatus(console.log)
    }

    const onScriptLoadFail = () => {
        setIsLoading(true);
        console.error('Failed to initialize facebook auth client');
    }

    /**
     * Loading facebook OAuth script
     */
    const { isScriptLoaded, removeScript } = useLoadScript({
        id: 'facebook-script',
        scriptUrl: SCRIPT_URL,
        onLoadSuccess: initFacebookAuth,
        onLoadFail: onScriptLoadFail
    });

    /**
     * Once user is authenticated via facebook, 
     * we do a /me api call to capture user details
     */
    const onFacebookLoginSuccess = () => {
        setIsLoggedIn(true);
        window.FB.api('/me', { fields: 'name, email, picture.width(200).height(200)' }, function (response) {
            const userData = {
                id: response.id,
                name: response.name,
                email: response.email,
                imageUrl: response.picture.data.url
            }
            setProfileData(userData);
            onLoginSuccess(userData);
        });
    };

    /**
     * This will be triggered when user decides not to proceed with Facebook login
     * @param {object} errorResponse indicates the reason for fail
     */
    const onFacebookLoginFail = (response) => {
        let errorMsg = null;
        const err = response.status;
        if (err === "not_authorized") errorMsg = 'Popup closed by user';
        if (err === "unknown") errorMsg = 'User refused to share information';

        setIsLoggedIn(false);
        onLoginFail && onLoginFail({
            error: err,
            errorDetail: errorMsg
        });
    };

    /**
     * Prompts a login via facebook account. 
     * If login successful response will include the auth-response
     * Function will handle both success and failure scenarios
     */
    const loginWithFacebook = () => {
        window.FB.login(function (response) {
            if (response.authResponse) {
                onFacebookLoginSuccess(response);
            } else {
                onFacebookLoginFail(response)
            }
        }, { scope: scopes });
    }

    /**
     * Logout via Facebook Auth instnce
     */
    const logoutFromFacebook = () => {
        if (!isLoggedIn) return;
        
        window.FB.logout(function (response) {
            setIsLoggedIn(false);
        });
    }

    return {
        isLoading,
        profileData,
        isLoggedIn,
        isScriptLoaded,
        removeScript,
        doLogin: loginWithFacebook,
        doLogout: logoutFromFacebook
    }
}

export default useFacebookSignin;