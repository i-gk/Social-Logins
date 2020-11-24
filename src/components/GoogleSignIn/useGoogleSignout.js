/**
 * Logout user if Google auth instance is already available 
 * @param {Function} logoutSuccess 
 * @param {Function} logoutFail 
 */
const useGoogleSignout = (logoutSuccess, logoutFail) => {
    const onLogoutSuccess = logoutSuccess;
    const onLogoutFail = logoutFail;

    const doGoogleSignout = () => {
        try {
            window.gapi.auth2.getAuthInstance().signOut().then(onLogoutSuccess);
        } catch(e) {
            onLogoutFail && onLogoutFail();
        }
    };

    return doGoogleSignout;
}

export default useGoogleSignout;