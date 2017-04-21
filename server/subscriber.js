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

// var train1Blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
// var train2Blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var train1SprogSpeeds = [];
var train2SprogSpeeds = []; 

var train1ActualSpeeds = [];
var train2ActualSpeeds = [];

var temperature = [];
var pressure = [];
var altitude = [];

io.on('connection', function (socket) {
    // read for the messages being sent over MQTT on the localhost 1883

    socket.on('message', function (msg) {
        // only do calculations and send message if the user is on the certain page
        location = msg;
    });
    socket.on('disconnect', function () { });


    var client = mqtt.connect('mqtt://localhost:1883');
    
    client.on('connect', () => {
        client.subscribe("tojs")
    });
    
    client.on('message', (topic, message) => {
        var m = message.toString('ascii');
        var js = JSON.parse(m);
        
        if (js['name'] == "sprogPower" && js['value'] == "ON") {
            // refresh graphs on start up
            train1SprogSpeeds = [];
            train2SprogSpeeds = [];
            train1ActualSpeeds = [];
            train2ActualSpeeds = [];
        } else if (js['name'] == "train1Block" || js['name'] == "train2Block") {
            // send trainID, block, distance in block to train layout
            // set up functionality to send to dashboard as well

            var id = 0;
            var value = parseFloat(js['value']);
            var block = Math.floor(value / 100);
            var dist = value - block * 100.0;
            
            if (js['name'] == "train1Block") { 
                id = 0;
                // train1Blocks[value - 1] += 1;
            } else if (js['name'] == "train2Block") {
                id = 1;
                // train2Blocks[value - 1] += 1;
            }

            if (location == "train-layout") {
                var obj = JSON.parse(JSON.stringify({ 'id' : "updateTrain", 'trainID' : id, 'block' : block, 'dist' : dist }));
                socket.send(obj);
            }
            // } else if (location == "dashboard") {
            //     if (id == 0) {
            //          
            //         var obj = JSON.parse(JSON.stringify({ 'id' : "train1Blocks", 'value' : train1Blocks }));
            //         socket.send(obj);
            //     } else if (id == 1) {
            //         var obj = JSON.parse(JSON.stringify({ 'id' : "train2Blocks", 'train' : id, 'block' : value }));
            //         socket.send(obj);
            //     }
            // }
        } else if (js['name'] == "message") {
            // turn alert messages on and off in the train layout
            if (location == "train-layout") {
                var obj = JSON.parse(JSON.stringify({ 'id' : js['name'], 'value' : js['value']}));
                socket.send(obj);
            }
        } else if (js['name'] == "train1ActualSpeed") {
            // send the last 100 train 1 actual speeds to the dashboard
            // we are using the beam breakers to calculate the velocity
            // also, we are calculating the mean in here
            // we are keeping track of all velocities that we gathered, but only displaying last 100

            var value = parseFloat(js['value']);
            train1ActualSpeeds.push(value);
            if (location == "dashboard") {
                var len = train1ActualSpeeds.length;
                var start = len - 100;
                if (start < 0) {start = 0;}

                var f = [];
                var j = 0.0;
                var sum = 0.0;
                for (var i=start; i<len; i++) {
                    sum += train1ActualSpeeds[i];
                    f.push([j, train1ActualSpeeds[i]]);
                    j += 20.0/100.0;
                }
                var length = len - start;
                var mean = sum * 1.0 / length;
                mean = Math.round(mean * 100) / 100;
                var obj = JSON.parse(JSON.stringify({ 'id' : "train1ActualSpeeds", 'value' : f, 'mean' : mean }));
                socket.send(obj);
            } 
        } else if (js['name'] == "train2ActualSpeed") {
            // send the last 100 train 2 actual speeds to the dashboard
            // we are using the beam breakers to calculate the velocity
            // also, we are calculating the mean in here
            // we are keeping track of all velocities that we gathered, but only displaying last 100

            var value = parseFloat(js['value']);
            train2ActualSpeeds.push(value);
            if (location == "dashboard") {
                var len = train2ActualSpeeds.length;
                var start = len - 80;
                if (start < 0) {start = 0;}

                var f = [];
                var j = 0.0;
                var sum = 0.0;
                for (var i=start; i<len; i++) {
                    sum += train2ActualSpeeds[i];
                    f.push([j, train2ActualSpeeds[i]]);
                    j += 0.25;
                }
                var length = len - start;
                var mean = sum * 1.0 / length;
                mean = Math.round(mean * 100) / 100;
                var obj = JSON.parse(JSON.stringify({ 'id' : "train2ActualSpeeds", 'value' : f, 'mean' : mean }));
                socket.send(obj);
            }
        } else if (js['name'] == "train1SprogSpeed") {
            // send the last 100 train 1 sprog speeds to the dashboard
            // the sprog speed is a float from 0.0 to 1.0 (IE not moving - max speed)
            // we are keeping track of all sppeds that we gathered, but only displaying last 100

            var value = parseFloat(js['value']);
            train1SprogSpeeds.push(value);
            if (location == "dashboard") {
                var len = train1SprogSpeeds.length;
                var start = len - 80;
                if (start < 0) {start = 0;}

                var f = [];
                var j = 0.0;
                var sum = 0.0;
                for (var i=start; i<len; i++) {
                    sum += train1SprogSpeeds[i];
                    f.push([j, train1SprogSpeeds[i]]);
                    j += 0.25;
                }
                var length = len - start;
                var mean = sum * 1.0 / length;
                mean = Math.round(mean * 100) / 100;
                var obj = JSON.parse(JSON.stringify({ 'id' : "train1SprogSpeeds", 'value' : f, 'mean' : mean }));
                socket.send(obj);
            }
        } else if (js['name'] == "train2SprogSpeed") {
            // send the last 100 train 1 sprog speeds to the dashboard
            // the sprog speed is a float from 0.0 to 1.0 (IE not moving - max speed)
            // we are keeping track of all sppeds that we gathered, but only displaying last 100

            var value = parseFloat(js['value']);
            train2SprogSpeeds.push(value);
            if (location == "dashboard") {
                var len = train2SprogSpeeds.length;
                var start = len - 80;
                if (start < 0) {start = 0;}

                var f = [];
                var j = 0;
                var sum = 0.0;
                for (var i=start; i<len; i++) {
                    sum += train2SprogSpeeds[i];
                    f.push([j, train2SprogSpeeds[i]]);
                    j += 0.25;

                }
                var length = len - start;
                var mean = sum * 1.0 / length;
                mean = Math.round(mean * 100) / 100;
                var obj = JSON.parse(JSON.stringify({ 'id' : "train2SprogSpeeds", 'value' : f, 'mean' : mean }));
                socket.send(obj);
            }
        } else if (js['name'] == "temperature") {
            // send the last 10 calculation of the temperature to the multisensor view
            // also calculating the mean

            var value = parseFloat(js['value']);
            temperature.push(value);
            if (location == "multisensor") {
                var len = temperature.length;
                var start = len - 10;
                if (start < 0) {start = 0;}

                var f = [];
                var j = 0;
                var sum = 0.0;
                for (var i=start; i<len; i++) {
                    sum += temperature[i];
                    f.push([j, temperature[i]]);
                    j += 2;

                }
                var length = len - start;
                var mean = sum * 1.0 / length;
                mean = Math.round(mean * 100) / 100;
                var obj = JSON.parse(JSON.stringify({ 'id' : "temperature", 'value' : f, 'mean' : mean }));
                socket.send(obj);
            } 
        } else if (js['name'] == "pressure") {
            // send the last 10 calculation of the pressure to the multisensor view
            // also calculating the mean

            var value = parseInt(js['value']);   
            pressure.push(value);
            if (location == "multisensor") {
                var len = pressure.length;
                var start = len - 10;
                if (start < 0) {start = 0;}

                var f = [];
                var j = 0;
                var sum = 0.0;
                for (var i=start; i<len; i++) {
                    sum += pressure[i];
                    f.push([j, pressure[i]]);
                    j += 2;

                }
                var length = len - start;
                var mean = sum * 1.0 / length;
                mean = Math.round(mean * 100) / 100;
                var obj = JSON.parse(JSON.stringify({ 'id' : "pressure", 'value' : f, 'mean' : mean }));
                socket.send(obj);
            }
        } else if (js['name'] == "altitude") {
            // send the last 10 calculation of the altitude  to the multisensor view
            // also calculating the mean

            var value = parseFloat(js['value']);
            altitude.push(value);
            if (location == "multisensor") {
                var len = altitude.length;
                var start = len - 10;
                if (start < 0) {start = 0;}

                var f = [];
                var j = 0;
                var sum = 0.0;
                for (var i=start; i<len; i++) {
                    sum += altitude[i];
                    f.push([j, altitude[i]]);
                    j += 2;

                }
                var length = len - start;
                var mean = sum * 1.0 / length;
                mean = Math.round(mean * 100) / 100;
                var obj = JSON.parse(JSON.stringify({ 'id' : "altitude", 'value' : f, 'mean' : mean }));
                socket.send(obj);
            }
        }
        
    });
});


module.exports = subscriber;

