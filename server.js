var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);

const firebase = require('firebase');
var config = {
    apiKey: "AIzaSyD_2Ut2DIaVldIJGIBcAoYmH9D0HKxmoP8",
    authDomain: "greenandeasy-2d010.firebaseapp.com",
    databaseURL: "https://greenandeasy-2d010.firebaseio.com",
    projectId: "greenandeasy-2d010",
    storageBucket: "greenandeasy-2d010.appspot.com",
    messagingSenderId: "548071697484"
};
firebase.initializeApp(config);

let data;

app.get('/api/currentUser', (req, res) => {
    let starCountRef = firebase.database().ref('/currentBackendUsers/');
starCountRef.once('value', function(snapshot) {
    data = snapshot.val()
}).then(
    (data)=>{
    res.json(data);
}
)
});

app.get('/api/users', (req, res) => {
    let starCountRef = firebase.database().ref('/users/');
    starCountRef.once('value', function(snapshot) {
        data = snapshot.val()
    }).then(
        (data)=>{
            res.json(data);
        }
    )
});

app.get('/api/tippcards', (req, res) => {
    let starCountRef = firebase.database().ref('/tippcards/');
    starCountRef.once('value', function(snapshot) {
        data = snapshot.val()
    }).then(
        (data)=>{
            res.json(data);
        }
    )
});

app.get('/api/usertippcards', (req, res) => {
    let starCountRef = firebase.database().ref('/userTippcards/');
    starCountRef.once('value', function(snapshot) {
        data = snapshot.val()
    }).then(
        (data)=>{
            res.json(data);
        }
    )
});

app.get('/api/categories', (req, res) => {
    let starCountRef = firebase.database().ref('/categories/');
    starCountRef.once('value', function(snapshot) {
        data = snapshot.val()
    }).then(
        (data)=>{
            res.json(data);
        }
    )
});

app.get('/api/interactions', (req, res) => {
    let starCountRef = firebase.database().ref('/interactions/');
    starCountRef.once('value', function(snapshot) {
        data = snapshot.val()
    }).then(
        (data)=>{
            res.json(data);
        }
    )
});

app.get('/api/kinds', (req, res) => {
    let starCountRef = firebase.database().ref('/kinds/');
    starCountRef.once('value', function(snapshot) {
        data = snapshot.val()
    }).then(
        (data)=>{
            res.json(data);
        }
    )
});
server.listen(5000, '85.214.93.81');

