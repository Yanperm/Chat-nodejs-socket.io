const app = require('express');
const server = require('http').Server(app);
const io = require('socket.io')(server);

var client_log = [];
var message_log = [];

io.on('connection', (socket) => {
    let client_user = {};
    socket.join('room-1');
    console.log('A user connected');
    socket.emit('clientOnline', client_log);
    
    socket.on('joinClient', (client) => {
        client_user = client;
        client_log.push(client);
        socket.broadcast.emit('clientOnline', client_log);
    });
    socket.on('sendMessage', (msg) => {
        socket.broadcast.emit('responseMessage', msg);
    });
    socket.on('changeClient', (name) => {
        let removeClient = client_log.map((client) => {
            return client.id
        }).indexOf(client_user['id']);
        client_log.splice(removeClient, 1);
        client_user.name = name;
        client_log.push(client_user);
        socket.emit('clientOnline', client_log);
        socket.broadcast.emit('changeName', client_log);
    });
    socket.on('disconnect', () => {
        let removeClient = client_log.map((client) => {
            return client.id
        }).indexOf(client_user['id']);
        client_log.splice(removeClient, 1);
        socket.broadcast.emit('clientOnline', client_log);
    });
});

server.listen(3000, () => {
    console.log('Socket.io Server is listening on port 3000');
});