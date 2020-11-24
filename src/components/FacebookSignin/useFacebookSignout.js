/**
 * Logout user if Facebook auth instance is already available 
 * @param {Function} logoutSuccess 
 * @param {Function} logoutFail 
 */
const useFacebookSignout = (logoutSuccess, logoutFail)=> {
    const onLogoutSuccess = logoutSuccess;
    const onLogoutFail = logoutFail;

    const doFacebookSignout = () => {
        try {
            window.FB.logout(onLogoutSuccess);
        } catch(e) {
            onLogoutFail && onLogoutFail();
        }
    };

    return doFacebookSignout;
}

export default useFacebookSignout;