export default {

    getToken () {
        return localStorage.token;
    },
    loggedIn() {
        return !!localStorage.token;
    },
    login(token) {
        localStorage.token = token;
    },
    logout() {
        delete localStorage.token;
    }
}