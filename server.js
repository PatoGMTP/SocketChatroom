"use strict";
exports.__esModule = true;
// const app = require('express')();
var test = require("express");
var app = test();
var test2 = require("http");
var http = test2.createServer(app);
var socket_io_1 = require("socket.io");
var sock = new socket_io_1.Server();
sock.attach(http);
var messages = [];
app.get('/', function (req, res) {
    //   res.send('<h1>Hey Socket.io</h1>');
    res.sendFile(__dirname + "/index.html");
});
sock.on('connection', function (socket) {
    messages.forEach(function (element) {
        sock.emit('my broadcast', "server: ".concat(element));
    });
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on('my message', function (msg) {
        var message = '';
        message += "From: " + socket.conn.remoteAddress + " ; ";
        message += "To: " + socket.handshake.headers.host + " ; ";
        message += msg;
        messages.push(message);
        sock.emit('my broadcast', "".concat(message));
        sock.to("Room1").emit("my broadcast", "Welcome to Room1");
        console.log(sock.sockets.sockets);
        console.log(socket.rooms);
        socket.join("Room1");
        console.log(socket.rooms);
        // console.log("test");
        // console.log(socket.conn.remoteAddress)
        // console.log(socket.handshake.address)
    });
});
http.listen(3000, function () {
    console.log('listening on *:3000');
});
