"use strict";
// import * as 
exports.__esModule = true;
var test = require("express");
var app = test();
var test2 = require("http");
var http = test2.createServer(app);
var socket_io_1 = require("socket.io");
var sock = new socket_io_1.Server();
sock.attach(http);
var port = process.env.PORT || 3000;
var messages = [];
var users = {};
app.get('/', function (req, res) {
    //   res.send('<h1>Hey Socket.io</h1>');
    res.sendFile(__dirname + "/index.html");
});
sock.on('connection', function (socket) {
    messages.forEach(function (element) {
        sock.emit('chat message', "".concat(element));
    });
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on('chat message', function (obj) {
        console.log(obj);
        users[socket.conn.remoteAddress] = obj.name;
        var msg = obj.message;
        var time = new Date().toLocaleString();
        var message = '';
        message += "Time: " + time + " ; ";
        message += "From: " + users[socket.conn.remoteAddress] + " ; ";
        // message += "To: " + socket.handshake.headers.host + " ; ";
        message += msg;
        messages.push(message);
        sock.emit('chat message', "".concat(message));
    });
});
http.listen(port, function () {
    console.log("listening on http://localhost:".concat(port));
});
