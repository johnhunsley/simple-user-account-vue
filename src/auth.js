export default {

    getToken () {
        return localStorage.token;
    },
    loggedIn() {
        return true;//!!localStorage.token;
    },
    login() {

    },
    logout() {
        delete localStorage.token;
    }
}