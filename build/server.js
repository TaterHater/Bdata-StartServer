"use strict";
/* app/server.ts */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import everything from express and assign it to the express variable
// import * as express from 'express';
var express = require('express');
var passport_local_1 = __importDefault(require("passport-local"));
var graphqlHTTP = require('express-graphql');
var _a = require('graphql'), buildSchema = _a.buildSchema, graphql = _a.graphql;
var bodyParser = require('body-parser');
var http = require('http');
var fetch = require('fetch');
var axios = require('axios');
// Import WelcomeController from controllers entry point
var controllers_1 = require("./controllers");
var LocalStrategy = passport_local_1.default.Strategy;
// Create a new express application instance
var app = express();
var schema = buildSchema("\n  type Query {\n    hello: String,\n    cat: String\n  }\n");
var root = {
    hello: function () { return 'Hello world!'; }, cat: function () { return axios.get("https://cat-fact.herokuapp.com/facts/random").then(function (res) {
        console.log(res.data.text);
        return res.data.text;
    }).catch(function (error) {
        console.log(error);
    }); }
};
// The port the express app will listen on
var port = 3000;
// app.set('host', '73.34.8.37')
console.log('test2');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/welcome', controllers_1.WelcomeController);
app.use('/login', controllers_1.LoginController);
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.get('/', function (req, res) {
    res.send('hello assholes');
});
app.get('/gt', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: false,
}));
app.on('listening', function () {
    console.log('ok, server is running');
});
app.listen(port, function () { console.log("Started listening on port 3000"); });
