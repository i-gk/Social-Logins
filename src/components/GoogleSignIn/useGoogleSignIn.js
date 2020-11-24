import { useState } from 'react';
import useLoadScript from '../../hooks/useLoadScript';

const SCRIPT_URL = 'https://apis.google.com/js/api.js';
/**
 * 
 * @param {{
 *  clientId: string,
 *  scopes: string,
 *  permissions: string  
 *  onLoginFail: (errorResponse: {error: string, errorDetail: string}) => void, 
 *  onLogoutFail: () => void
 * }} params  
 */
const useGoogleSignIn = (props) => {
    const { 
        clientId, 
        scopes, 
        permissions, 
        onLoginSuccess, 
        onLoginFail, 
        onLogoutSuccess, 
        onLogoutFail 
    } = props;
    // Indicates the Google Auth initialization state
    const [isInitializing, setIsInitializing] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profileData, setProfileData] = useState();

    /**
     * Initialize google script with required scope and auth credentials
     */
    const initGoogleAPIs = () => {
        const params = {
            clientId: clientId,
            scope: scopes
        }
        window.gapi.load(permissions, () => {
            const GoogleAuth = window.gapi.auth2.getAuthInstance();
            if (!GoogleAuth) {
                window.gapi.auth2.init(params).then(() => {
                    setIsInitializing(false);
                })
            }
        })
    }

    const initGoogleAPIsFailed = () => {
        setIsInitializing(true);
        console.error('Failed to initialize google auth client');
    }

    const { isScriptLoaded, removeScript } = useLoadScript({
        id: 'google-script',
        scriptUrl: SCRIPT_URL,
        onLoadSuccess: initGoogleAPIs,
        onLoadFail: initGoogleAPIsFailed
    });

    const onGoogleLoginSuccess = (successResponse) => {
        const basicProf = successResponse.getBasicProfile();
        const userData = {
            id: basicProf.getId(),
            email: basicProf.getEmail(),
            name: basicProf.getName(),
            imageUrl: basicProf.getImageUrl()
        }
        setProfileData(userData);
        setIsLoggedIn(true);
        onLoginSuccess(userData);
    }

    /**
     * This will be triggered when user decides not to proceed with Google login
     * @param {string} errorResponse indicates the reason for fail
     */
    const onGoogleLoginFail = (errorResponse) => {
        let errorMsg = null;
        if (errorResponse === 'popup_closed_by_user') errorMsg = 'Popup closed by user';
        if (errorResponse === 'access_denied') errorMsg = 'User refused to share information';

        setIsLoggedIn(false);
        onLoginFail && onLoginFail({
            error: errorResponse,
            errorDetail: errorMsg
        })
    }

    /**
     * Login via Google Auth2 instnce
     */
    const loginWithGoogle = () => {
        // Google API object is not available yet.
        if (isInitializing) {
            console.error('Google APIs not available yet')
            return;
        }

        window.gapi.auth2.getAuthInstance().signIn()
            .then(onGoogleLoginSuccess, onGoogleLoginFail);
    }

    /**
     * Logout via Google Auth2 instnce
     */
    const logoutFromGoogle = () => {
        if (!isLoggedIn) return;

        window.gapi.auth2.getAuthInstance().signOut().then(res => {
            setIsLoggedIn(false);
            setProfileData();
            onLogoutSuccess();
        }, () => {
            onLogoutFail && onLogoutFail();
        });
    }

    return {
        isScriptLoaded,
        isInitializing,
        isLoggedIn,
        profileData,
        removeScript,
        doLogin: loginWithGoogle,
        doLogout: logoutFromGoogle
    }
}

export default useGoogleSignIn;