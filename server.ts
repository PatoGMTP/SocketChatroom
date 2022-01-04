
// import * as 

import * as test from 'express'
let app = test();

import * as test2 from "http"
const http = test2.createServer(app)

import {Server, Socket} from "socket.io"

const sock = new Server();

sock.attach(http);

const port = process.env.PORT || 3000;

let messages: string[] = [];

app.get('/', (req, res) => {
//   res.send('<h1>Hey Socket.io</h1>');
  res.sendFile(__dirname + "/index.html");
});

sock.on('connection', (socket) => {
    messages.forEach(element => {
        sock.emit('chat message', `${element}`);
    });

    console.log('a user connected');
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', obj => {
        console.log(obj);
        let msg = obj.message
        let time = new Date();
        let message = '';
        message += "From: " + socket.conn.remoteAddress + " ; "
        message += "To: " + socket.handshake.headers.host + " ; "
        message += msg;
        messages.push(message);
        sock.emit('chat message', `${message}`);
    });
});

http.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});