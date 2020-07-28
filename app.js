const app = require('express');
const server = require('http').Server(app);
const io = require('socket.io')(server);

var online = 0;
var member_log = [];
io.on('connection', (socket) => {

    console.log('A user connected');
    socket.emit('userOnline', online);
    socket.on('addNickname', (member) => {
        console.log(`ID: ${member.id}\tName: ${member.name}`);
        online++;
        socket.emit('userOnline', online);
        socket.broadcast.emit('userOnline', online);
        socket.broadcast.emit('newMember', member);
    });
    
    socket.on('sendMessage', (msg) => {
        console.log(`ID: ${msg.id}\tName: ${msg.name}\tMessage: ${msg.message}`);
        socket.broadcast.emit('listMessage', msg);
    });

    socket.on('disconnect', () => {
        if (online > 0) {
            online--;
        }
        socket.broadcast.emit('userOnline', online);
    });
    
});

server.listen(3000, () => {
    console.log('Socket.io Server is listening on port 3000');
});