"use strict";
exports.__esModule = true;
var test = require("express");
var app = test();
app.use(test.static(__dirname));
var test2 = require("http");
var http = test2.createServer(app);
var socket_io_1 = require("socket.io");
var sock = new socket_io_1.Server();
sock.attach(http);
var port = process.env.PORT || 3000;
var messages = [];
var chats = {};
chats["global"] = messages;
var users = {};
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
sock.on('connection', function (socket) {
    messages.forEach(function (element) {
        sock.to(Array.from(socket.rooms)[0]).emit('chat message', element);
    });
    Array.from(socket.rooms).forEach(function (room, i) {
        var hotline = Array.from(socket.rooms)[0];
        if (i != 0) {
            sock.to(hotline).emit("refresh", { messages: chats[room], room: room });
        }
    });
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on("join room", function (room) {
        socket.join(room);
    });
    socket.on("new dm", function (obj) {
        chats[obj.room] = [];
        socket.join(obj.room);
        socket.to(obj.other).emit("new roommate", { room: obj.room });
    });
    socket.on('chat message', function (obj) {
        users[socket.conn.remoteAddress] = obj.name;
        var msg = obj.message;
        var time = new Date().toLocaleString();
        var message = '';
        message += msg;
        var msg_obj = { time: time, content: message, from: users[socket.conn.remoteAddress], dms: Array.from(socket.rooms)[0], room: obj.room };
        if (chats[obj.room]) {
            chats[obj.room].push(msg_obj);
        }
        else {
            chats[obj.room] = [msg_obj];
        }
        if (obj.room == "global") {
            sock.emit('chat message', msg_obj);
        }
        else {
            sock.to(obj.room).emit('chat message', msg_obj);
        }
    });
});
http.listen(port, function () {
    console.log("listening on http://localhost:".concat(port));
});
