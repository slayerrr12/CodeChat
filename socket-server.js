'use strict';

const socketIO = require('socket.io');

module.exports = function(server) {
  const io = socketIO(server);
  io.on('connection', function(socket) {

    socket.on('joinRoom', function(data) {
      if (data && data.room) {
        console.log(data.room)
        socket.room = data.room;
        socket.join(data.room);
      } else {
        console.error('Error: Invalid room data');
      }
    });

    socket.on('chatMessage', function(data) {
      if (socket.room) {
        io.to(socket.room).emit('chatMessage', data);
      } else {
        console.error('Error: Client not in a room');
      }
    });

    socket.on('disconnect', function() {
      if (socket.room) {
        socket.leave(socket.room);
      }
    });
  })
}
