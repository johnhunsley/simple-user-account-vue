<template>
    <div id="pager" class="generic-container">
        <b>Login</b>
        <div class="section">
            <table>
                <tr>
                    <td>Username:</td><td><input id="username" class="loginText" type="text"  v-model.trim="username"/></td>
                </tr>
                    <td>Password:</td><td><input id="password" class="loginText" type="password" v-model.trim="password"/></td>
            </table>
            <button style="float: left" id="login" value="Login" @click="login">Login</button>
            <!-- todo - login error message -->
        </div>
    </div>
</template>

<script>
import auth from './../auth.js'
export default {
    data() {
        return {
            username: '',
            password: ''
        }
    },
    methods : {
        //todo - This needs refactoring so the server performs the auth and returns a session object/token
        login : function() {
            this.$http.post('http://localhost:8080/auth/login',
                {'username': this.username, 'password': this.password},
                {headers: {'X-Requested-With':'XMLHttpRequest', 'Content-Type':'application/json', 'Cache-Control':'no-cache'}}).then(function(data) {
                console.log(data.body.token);
                //if good set the token on the auth object
                auth.login(data.body.token);
                //redirect to pager vue
                this.$router.push('/users');
            })
        }
    }
}
</script>

<style>
 .loginText {
    max-width:300px
}
</style>