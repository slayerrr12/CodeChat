const socketIO = require("socket.io");

module.exports = function (server) {
    const io = socketIO(server);
    io.on("connection", function (socket) {
        socket.on("joinRoom", function (data) {
            socket.room = data.room;
            socket.join(data.room);
        });

        socket.on("chatMessage", function (data) {
            io.emit("chatMessage", data);
        });
    });
};
