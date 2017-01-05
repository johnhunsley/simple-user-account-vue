<template>
    <div id="pager" class="generic-container">
        <b>System Users</b>
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
                <tr v-for="user in items">
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
            <button style="float: right" id="new" value="New" @click="showModal = true">New</button>
        </div>
        <modal v-show="showModal" v-on:resetShowModal="showModal = false"></modal>
    </div>
</template>

<script>
import modal from './Modal.vue';

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
            nextPageNumber: 1,
            hasNext:true,
            previousPageNumber: 1,
            hasPrevious: false,
            filter:""
        }
    },
    mounted: function() {
        this.searchItems(10,1);
    },
    methods:{
        addUser: function() {

        },

        getItems: function(pageSize, pageNumber) {
            this.$http.get('http://localhost:8080/user/page/'+pageSize+"/"+pageNumber)
                .then(function(data){
                    this.calculatePage(data, pageNumber);
                });
        },

        searchItems: function(pageSize, pageNumber) {
            this.$http.get('http://localhost:8080/user/search/'+pageSize+"/"+pageNumber+"?query="+this.filter)
                .then(function(data){
                    this.calculatePage(data, pageNumber);
                });
        },

        calculatePage: function(data, pageNumber) {
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
        }
    },
    events: {
        resetShowModal : function(data) {
            this.showModal = data;
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
    </style>
