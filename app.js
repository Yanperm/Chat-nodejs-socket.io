const app = require('express');
const server = require('http').Server(app);
const io = require('socket.io')(server);

var client_user = {};
var client_log = [];
io.on('connection', socket => {

    console.log('A user connected');
    socket.emit('clientOnline', client_log);

    socket.on('joinClient', client => {
        socket.broadcast.emit('newClient', client);
        client_user = client;
        client_log.push(client);
        socket.broadcast.emit('clientOnline', client_log);
        console.log(`Client ID: ${client.id}\tClient Name: ${client.name}`);
    })
    
    socket.on('sendMessage', msg => {
        socket.broadcast.emit('responseMessage', msg);
        console.log(`ID: ${msg.id}\tName: ${msg.name}\tMessage: ${msg.message}`);
    });

    socket.on('disconnect', () => {
        // client_log.push(client);
        let removeClient = client_log.map((client) => {
            return client.id
        }).indexOf(client_user['id']);
        client_log.splice(removeClient, 1);
        socket.broadcast.emit('clientOnline', client_log);
        console.log(client_log);
    });
    
});

server.listen(3000, () => {
    console.log('Socket.io Server is listening on port 3000');
});