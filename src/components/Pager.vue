<template>
    <div id="pager" class="generic-container">
        <b>System Users</b><button style="float: right" id="logout" value="Log Out" @click="logout">Logout</button>
        <div class="section">
            <input id="filterUsers" class="filter" type="text" @keyup="searchItems(10,1)" v-model.trim="filter"/>
        </div>
        <div class="section fixed-height">
            <table >
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Enabled</th>
                </tr>
                <tr v-for="user in items" @click="edit(user.id)">
                    <td>{{user.id}}</td>
                    <td>{{user.username}}</td>
                    <td>{{user.firstName}}</td>
                    <td>{{user.lastName}}</td>
                    <td>{{user.email}}</td>
                    <td>{{user.active}}</td>
                </tr>
            </table>
        </div>
        <div class="section">
            <button id="prev" v-bind:disabled="!hasPrevious" value="Prev" @click="searchItems(10,previousPageNumber)">Prev</button>
                    <span v-for="n in totalPages">
                        &nbsp;&nbsp;<span @click="searchItems(10,n)"><b>{{n}}</b></span>
                    </span>
            <button id="next" v-bind:disabled="!hasNext" value="Next" @click="searchItems(10,nextPageNumber)">Next</button>
            <button style="float: right" id="new" value="New" @click="showModal = true ;modalTitle = 'New User'">New</button>
        </div>
        <modal v-show="showModal" v-on:resetShowModal="resetForm()" v-on:saveUser="saveUser()">
            <h3 slot="header">{{modalTitle}}</h3>
            <div slot="body" class="formbody">
                <form name="userForm">
                    <div class="row">
                        <label class="left" for="selectedID">ID:</label>
                        <input type="text" disabled class="formText, right" id="selectedID" v-model.trim="user.id"/><br/>
                    </div>
                    <div class="row">
                        <label class="left" for="selectedUsername">Username:</label>
                        <input type="text" class="formText, right" id="selectedUsername" v-model.trim="user.username"/>
                    </div>
                    <div class="row">
                        <label class="left" for="selectedFirstName">First Name:</label>
                        <input type="text" class="formText, right" id="selectedFirstName" v-model.trim="user.firstName"/>
                    </div>
                    <div class="row">
                        <label class="left" for="selectedLastName">Last Name:</label>
                        <input type="text" class="formText, right" id="selectedLastName" v-model.trim="user.lastName"/>
                    </div>
                    <div class="row">
                        <label class="left" for="selectedEmail">Email:</label>
                        <input type="text" class="formText, right" id="selectedEmail" v-model.trim="user.email"/>
                    </div>
                </form>
            </div>
        </modal>
    </div>
</template>

<script>
import modal from './Modal.vue';
import auth from './../auth.js';

export default {
    name: 'pager',
    components: {
        modal
    },
    data () {
        return {
            showModal: false,
            items: [],
            totalPages: 0,
            totalItems: 0,
            currentPage: 1,
            nextPageNumber: 1,
            hasNext:true,
            previousPageNumber: 1,
            hasPrevious: false,
            filter:"",
            modalTitle:"",
            user: {
            }
        }
    },
    mounted: function() {
        this.searchItems(10,1);
    },
    methods:{
        edit: function(userId) {
            this.$http.get('http://localhost:8080/user/id/'+userId,
                {headers:{'Cache-Control':'no-cache', 'X-Authorization':'Bearer '+auth.getToken()}}).then(function successCallback(response) {
                    console.log(response.body);
                    this.modalTitle="Edit User";
                    this.user = response.body;
                    this.showModal = true;
                }, function errorCallback(response) {
                    console.log('Token expired, forcing client to re-authenitcate');
                    this.$router.push('/login');
                })
        },
        resetForm : function() {
            console.log('resetForm');
            this.showModal = false;
            this.user={};
        },
        saveUser : function() {
            console.log(JSON.stringify(this.user));
            //get form data and persist
            this.$http.put('http://localhost:8080/user',
                JSON.stringify(this.user),
                {headers:{'Cache-Control':'no-cache', 'X-Authorization':'Bearer '+auth.getToken()}}).then(function successCallback(response){
                    this.showModal = false;
                    this.user={};
                    console.log('....data saved successfully');
                    this.searchItems(10, this.currentPage);
                },function errorCallback(response) {
                    console.log('Error, forcing client to re-authenitcate');
                    this.showModal = false;
                    this.$router.push('/login');
                });
        },
        getItems: function(pageSize, pageNumber) {
            this.$http.get('http://localhost:8080/user/page/'+pageSize+"/"+pageNumber,
                {headers:{'Cache-Control':'no-cache', 'X-Authorization':'Bearer '+auth.getToken()}})
                .then(function successCallback(response){
                    this.calculatePage(response, pageNumber);
                },function errorCallback(response) {
                    console.log('Token expired, forcing client to re-authenitcate');
                    this.$router.push('/login');
                });
        },
        searchItems: function(pageSize, pageNumber) {
            this.$http.get('http://localhost:8080/user/search/'+pageSize+"/"+pageNumber+"?query="+this.filter,
                {headers:{'Cache-Control':'no-cache', 'X-Authorization':'Bearer '+auth.getToken()}})
                .then(function successCallback(response) {
                    this.calculatePage(response, pageNumber);
                },function errorCallback(response) {
                    console.log('Token expired, forcing client to re-authenitcate');
                    this.$router.push('/login');
                });
        },
        calculatePage: function(data, pageNumber) {
            this.currentPage = pageNumber;
            this.items = data.body.pagedItems;
            this.totalItems = data.body.totalItems;
            this.totalPages = data.body.totalPages;

            if(pageNumber < this.totalPages) {
                this.nextPageNumber = pageNumber +1;
                this.hasNext = true;
            } else {
                this.hasNext = false;
            }

            if(pageNumber > 1) {
                this.previousPageNumber = pageNumber -1;
                this.hasPrevious = true;
            } else {
                this.hasPrevious = false;
            }
        },
        logout : function() {
            auth.logout();
            this.$router.push('/login');
        }
    },
    events: {

    }
}
</script>

    <style>
        .generic-container {
        width:80%;
        margin-left: 20px;
        margin-top: 20px;
        margin-bottom: 20px;
        padding: 20px;
        background-color: rgba(170, 204, 170, 0.33);
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 0 30px #3e4d3e;
        font-family:Arial, sans-serif;
        font-size:14px;
        color: #3e4d3e;
    }

        .section {
        margin-left: auto;
        margin-top: 20px;
        margin-bottom: 20px;
        padding: 20px;
        background-color: rgba(170, 204, 170, 0.33);
        /*box-shadow: 0 0 10px #86a186;*/
    }

        .fixed-height {
        min-height: 420px;
    }

        .filter {
        width: auto;
        min-width: 600px;
    }

        table {
        margin-right: auto;
        table-layout: auto;
        min-width: 600px;
        float: none;
        border-collapse:collapse;
        border-spacing:0;
        border-color:#aaa;
    }

        tr {

    }

        tr:nth-child(even) {
        background-color:#FCFBE3;
        vertical-align:top
    }

        tr:nth-child(odd) {
        vertical-align:top
    }

        tr:hover {
        background-color: aqua;
    }

        td {
        font-family:Arial, sans-serif;
        font-size:14px;
        padding:10px 5px;
        border-style:solid;
        border-width:1px;
        overflow:hidden;
        word-break:normal;
        border-color:#aca;
        color:#333;
        background-color:#fff;
    }

        th {
        font-family:Arial, sans-serif;
        font-size:14px;
        font-weight:normal;
        padding:10px 5px;
        border-style:solid;
        border-width:1px;
        overflow:hidden;
        word-break:normal;
        border-color:#aaa;
        color:#fff;
        background-color:#aca;
    }

        .main {
        font-family:Arial, sans-serif;
        font-size:14px;
        padding:10px 5px;
    }
        .formbody {
        display:table;
    }

        .row {
        font-family: Helvetica;
        display:table-row;
    }
        .left {
        display:table-cell;
    }
        .right {
        display:table-cell;
    }
    </style>
