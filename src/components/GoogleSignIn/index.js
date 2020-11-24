import { useEffect } from 'react'
import GoogleIcon from '../Icons/googleIcon';
import useGoogleSignIn from './useGoogleSignIn';

const CLIENT_ID = '';
const SCOPES = 'profile https://www.googleapis.com/auth/user.birthday.read';
const GOOGLE_PERMISION_SCOPES = 'client:auth2';

const GoogleLogin = ({ onLoginSuccess, onLogoutSuccess }) => {
    const onLoginFail = (err) => { console.log('Login Failed', err) };
    const onLogoutFail = () => { console.log('Logout Failed') };
    const {
        isScriptLoaded,
        isLoading,
        doLogin,
        removeScript
    } = useGoogleSignIn({
        clientId: CLIENT_ID,
        scopes: SCOPES,
        permissions: GOOGLE_PERMISION_SCOPES,
        onLoginSuccess,
        onLoginFail,
        onLogoutSuccess,
        onLogoutFail
    });

    /**
     * Detach the script at unmount
     */
    useEffect(() => {
        return () => {
            removeScript();
        }
    }, [removeScript]);

    const LoginWithGoogleComponent = (props) => {
        if (isLoading) return null;
        return (
            <div className='social-login-button' {...props}>
                <div className='icon'>
                    <GoogleIcon />
                </div>
                <p>Google</p>
            </div>
        );
    }

    return (
        <div className='login-container'>
            {isScriptLoaded && <LoginWithGoogleComponent onClick={doLogin} />}
        </div>
    )
}

export default GoogleLogin