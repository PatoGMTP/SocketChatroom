
import * as test from 'express'
let app = test();
app.use(test.static(__dirname));

import * as test2 from "http"
const http = test2.createServer(app)

import {Server, Socket} from "socket.io"
const sock = new Server();
sock.attach(http);
const port = process.env.PORT || 3000;

let messages: {content: string, from: string, dms: string}[] = [];
let chats = {};
chats["global"] = messages;
let users = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

sock.on('connection', (socket) => {
    messages.forEach(element => {
        sock.to(Array.from(socket.rooms)[0]).emit('chat message', element);
    });

    Array.from(socket.rooms).forEach((room, i) => {
        let hotline = Array.from(socket.rooms)[0];
        if (i != 0)
        {
            sock.to(hotline).emit("refresh", {messages: chats[room], room: room});
        }
    });

    console.log('a user connected');
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on("join room", room => 
    {
        socket.join(room);
    });

    socket.on("new dm", obj => {
        chats[obj.room] = [];

        socket.join(obj.room);

        socket.to(obj.other).emit("new roommate", {room: obj.room});
    });

    socket.on('chat message', obj => {
        users[socket.conn.remoteAddress] = obj.name;
        let msg = obj.message;
        let time = new Date().toLocaleString();
        let message = '';
        message += msg;

        let msg_obj = {time: time,content: message, from: users[socket.conn.remoteAddress], dms: Array.from(socket.rooms)[0], room: obj.room}

        if (chats[obj.room])
        {
            chats[obj.room].push(msg_obj);
        }
        else
        {
            chats[obj.room] = [msg_obj];
        }

        if (obj.room == "global")
        {
            sock.emit('chat message', msg_obj);
        }
        else
        {
            sock.to(obj.room).emit('chat message', msg_obj);
        }
    });
});

http.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});