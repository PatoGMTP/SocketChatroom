// const app = require('express')();
import * as test from 'express'
let app = test();

import * as test2 from "http"
const http = test2.createServer(app)

import {Server, Socket} from "socket.io"

const sock = new Server();

sock.attach(http);

let messages: string[] = [];

app.get('/', (req, res) => {
//   res.send('<h1>Hey Socket.io</h1>');
  res.send(__dirname + "/index.html/");
});

sock.on('connection', (socket) => {
    messages.forEach(element => {
        sock.emit('my broadcast', `server: ${element}`);
    });

    console.log('a user connected');
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('my message', (msg) => {
        let message = '';
        message += "From: " + socket.conn.remoteAddress + " ; "
        message += "To: " + socket.handshake.headers.host + " ; "
        message += msg;
        messages.push(message);
        sock.emit('my broadcast', `${message}`);
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

http.listen(3000, () => {
  console.log('listening on *:3000');
});