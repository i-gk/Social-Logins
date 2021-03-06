import { useState } from 'react'
import GoogleSignIn from '../GoogleSignIn';
import useGoogleSignout from '../GoogleSignIn/useGoogleSignout'
import useFacebookSignout from '../FacebookSignIn/useFacebookSignout'
import FacebookSignin from '../FacebookSignIn';

import './index.css';

const App = () => {
    const [loginInfo, setloginInfo] = useState();

    const onLoginSuccess = (loginData) => {
        if (loginData) setloginInfo(loginData);
    };
    const onLogoutSuccess = () => {
        setloginInfo();
    };

    const logoutGoogle = useGoogleSignout(onLogoutSuccess);
    const logoutFacebook = useFacebookSignout(onLogoutSuccess);

    const logoutAll = () => {
        logoutGoogle();
        logoutFacebook();
    }

    return (<div style={{ textAlign: "center" }}>
        <h2>Social Logins</h2>
        <GoogleSignIn onLoginSuccess={onLoginSuccess} />
        <FacebookSignin onLoginSuccess={onLoginSuccess}  />

        {loginInfo && (
            <>
                <h3 style={{ marginTop: '3rem' }}>Login information</h3>
                <div className='login-info-container'>
                    <div className='info'>
                        <div>Name: <b>{loginInfo.name}</b></div>
                        <div>email: <b>{loginInfo.email}</b></div>
                        <div>id: <b>{loginInfo.id}</b></div>
                    </div>
                    <img src={loginInfo.imageUrl} />
                </div>
                <button className='logout-btn' onClick={logoutAll}>Logout</button>
            </>)}
    </div>)
}

export default App;