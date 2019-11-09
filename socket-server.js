'use strict';

var socketIO = require('socket.io');

module.exports = function (server) {
    var io = socketIO(server);

    // Chat room for only for user with same url
    io.on('connection', function (socket) {
        socket.on('joinRoom', function (data) {
            // Dynamic property of socket that we can name whatever may be socket.saurabh
            socket.room = data.room;
            socket.join(data.room);
        });

        socket.on('chatMessage', function (data) {
            io.to(socket.room).emit('chatMessage', data);
        });

        socket.on('disconnect', function () {
            socket.leave(socket.room);
        });
    })
}
