'use strict';
const mqtt = require('mqtt');
const WebSocket = require('ws');

let subscriber = {};

var express = require('express'), http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(1884);

var location = "";
io.on('connection', function (socket) {
    socket.on('message', function (msg) {
        console.log("|" + msg + "|")
        location = msg;
    });
    socket.on('disconnect', function () { });


    var client = mqtt.connect('mqtt://localhost:1883');
    
    client.on('connect', () => {
        client.subscribe("tojs")
    });
    
    client.on('message', (topic, message) => {
        var m = message.toString('ascii');
        var parsedJSON = JSON.parse(m);
        if (location == "train-layout") {
            if (parsedJSON['name'] == "train1Block" ||
                parsedJSON['name'] == "train2Block" ||
                parsedJSON['name'] == "sprogSpeed"  ||
                parsedJSON['name'] == "sprogPower"  ||
                parsedJSON['name'] == "trainSpeed") {
                socket.send(parsedJSON);
            }
        } else if (location == "dashboard") {
            socket.send(parsedJSON);
        }
    });
});


module.exports = subscriber;

