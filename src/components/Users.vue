<template>
    <div>
        <pager :on-search='searchItems' :on-select='edit' :col-names='colNames' :items='items' :total-pages="totalPages" :total-items="totalItems" :no-items-label='noUsers' :filter-placeholder="filterUsers" :select-id='selectedId'>
            <div slot="additionalButtons">
                <button style="float: right" id="new" value="New" @click="showModalForm(); modalTitle = 'New User'">New</button>
            </div>
        </pager>

        <modal v-show="showModal" v-on:resetShowModal="resetForm()" v-on:saveUser="saveUser()">
            <h3 slot="header">{{modalTitle}}</h3>
            <div slot="body" class="formbody">
                <form name="userForm">
                    <div class="row">
                        <label class="left" for="selectedID">ID:</label>
                        <span id="selectedID" />{{user.id}}<span/>
                    </div>
                    <div class="row">
                        <label class="left" for="selectedEnabled">Enabled:</label>
                        <input type="checkbox" class="right" id="selectedEnabled" v-model.trim="user.active"/>
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
                    <div class="row">
                        <label class="left" for="selectedRoles">Roles :</label>
                        <div v-for="role in roles">
                            <input type="checkbox" class="right" :id="role.id" :value="role" v-model="user.roles"/>&nbsp;{{role.authority}}
                        </div>

                    </div>
                </form>
            </div>
        </modal>
    </div>
</template>

<script>
import pager from 'vue-pager';
import modal from './Modal.vue';
import auth from './../auth.js';

export default {
    components: {
        pager,
        modal
    },
    data () {
        return {
            showModal: false,
            items: [],
            roles:[],
            totalPages: 0,
            totalItems: 0,
            colNames: [
                {'label': 'ID', 'value': 'id'},
                {'label': 'User Name', 'value': 'username'},
                {'label': 'First Name', 'value': 'firstName'},
                {'label': 'Last Name', 'value': 'lastName'},
                {'label': 'Email', 'value': 'email'},
                {'label': 'Enabled?', 'value': 'enabled'}
            ],
            noUsers: 'No Users',
            filterUsers: 'Filter Users',
            selectedId: 'id',
            modalTitle:"",
            user: {
                class:"User",
                accountId:1
            }
        }
    },
    methods:{
        edit: function(userId) {
            this.$http.get('http://localhost:8080/user/id/'+userId,
                {headers:{'Cache-Control':'no-cache', 'X-Authorization':'Bearer '+auth.getToken()}}).then(function successCallback(response) {
                    console.log(response.body);
                    this.modalTitle="Edit User";
                    this.user = response.body;
                    this.showModalForm();
                }, function errorCallback(response) {
                    console.log('Token expired, forcing client to re-authenitcate');
                    this.$router.push('/login');
                })
        },
        showModalForm: function() {
            this.getAllRoles();
            this.showModal = true;
        },
        getAllRoles: function() {
            this.$http.get('http://localhost:8080/role',
                {headers:{'Cache-Control':'no-cache', 'X-Authorization':'Bearer '+auth.getToken()}}).then(function successCallback(response) {
                    console.log(response.body);
                    this.roles = response.body;
                }, function errorCallback(response) {
                    console.log('Token expired, forcing client to re-authenitcate');
                    this.$router.push('/login');
                })
        },
        resetForm : function() {
            console.log('resetForm');
            this.showModal = false;
            this.user={
                class:"User",
                accountId:1
            };
        },
        saveUser : function() {
            console.log(JSON.stringify(this.user));
            //get form data and persist
            this.$http.put('http://localhost:8080/user',
                JSON.stringify(this.user),
                {headers:{'Cache-Control':'no-cache', 'X-Authorization':'Bearer '+auth.getToken()}}).then(function successCallback(response){
                    this.resetForm();
                    console.log('....data saved successfully');
                    this.searchItems(this.pageSize, this.currentPage);
                },function errorCallback(response) {
                    console.log('Error, forcing client to re-authenitcate');
                    this.resetForm();
                    this.$router.push('/login');
                });
        },
        searchItems: function(pageSize, pageNumber, filter) {
            this.$http.get('http://localhost:8080/user/search/'+pageSize+"/"+pageNumber+"?query="+filter,
                {headers:{'Cache-Control':'no-cache', 'X-Authorization':'Bearer '+auth.getToken()}})
                .then(function successCallback(response) {
                    this.items = response.body.pagedItems
                    this.totalItems = response.body.totalItems
                    this.totalPages = response.body.totalPages
                },function errorCallback(response) {
                    console.log('Token expired, forcing client to re-authenitcate');
                    this.$router.push('/login');
                });
        },
        logout : function() {
            auth.logout();
            this.$router.push('/login');
        }
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
        min-width: 100%;
    }

        table {
        margin-right: auto;
        table-layout: auto;
        min-width: 100%;
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
        .highlighted {
        color:#00b300;
    }

    </style>
