'use strict';
const mqtt = require('mqtt');
const WebSocket = require('ws');

let subscriber = {};
// const htpp = require('http');
// const io require('socket.io');


var express = require('express'), http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(1884);

io.on('connection', function (socket) {
    socket.on('message', function (msg) {console.log(msg)});
    socket.on('disconnect', function () { });


    var client = mqtt.connect('mqtt://localhost:1883');
    
    client.on('connect', () => {
        client.subscribe("tojs")
    });
    
    client.on('message', (topic, message) => {
        var m = message.toString('ascii');
        var parsedJSON = JSON.parse(m);
        socket.send(parsedJSON['value']);
    });
});


// app.get('/', function(req, res){
//   res.send('<h1>Hello world</h1>');
// });
// 
// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });


var client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
    client.subscribe("tojs")
});

client.on('message', (topic, message) => {
    var m = message.toString('ascii');
    var parsedJSON = JSON.parse(m);
    console.log(parsedJSON['value']);
});


module.exports = subscriber;

