'use strict';

const exec = require('child_process').exec;
const fs = require('fs');
var socketIO = require('socket.io');
var ot = require('ot');
var roomList = {};

module.exports = function (server) {
    var str = 'console.log("InterCode is working");';

    var io = socketIO(server);

    io.on('connection', function (socket) {
        socket.on('joinRoom', function (data) {
            if (!roomList[data.room]) {
                var socketIOServer = new ot.EditorSocketIOServer(str, [], data.room, function (socket, cb) {

                    // Fetching the code editor data
                    var self = this;
                    Task.findByIdAndUpdate(data.room, {content: self.document}, function (err) {
                        if (err) return cb(false);
                        cb(true);
                    });

                });
                roomList[data.room] = socketIOServer;
            }
            roomList[data.room].addClient(socket);
            roomList[data.room].setName(socket, data.username);

            socket.room = data.room;
            socket.join(data.room);
        });

        socket.on('chatMessage', function (data) {
            console.log("This chat data is send: " + data);
            io.to(socket.room).emit('chatMessage', data);
        });

        // Receive the editor message from task.hbs and save the code in file
        socket.on('editorMessage', function (data) {
            if(data.lang === "nodeJS") {
                // Save the code in a js file
                fs.writeFile("./test.js", data.message, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                });

                // Now execute the saved file
                const child = exec('node test.js', (error, stdout, stderr) => {
                    console.log(`stdout: ${stdout}`);
                    console.log(`stderr: ${stderr}`);
                    if (error !== null) {
                        console.log(`exec error: ${error}`);
                    }

                    // Send back the compile output to task.hbs page
                    io.to(socket.room).emit('editorMessage', stdout);
                    console.log("// Send back the compile output to task.hbs page");
                });
            }
            else {
                // Save the code in a cpp file
                fs.writeFile("./test.cpp", data.message, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                });

                // Now execute the saved file
                const child = exec('g++ test.cpp', (error, stdout, stderr) => {
                    console.log(`stdout: ${stdout}`);
                    console.log(`stderr: ${stderr}`);
                    if (error !== null) {
                        console.log(`exec error: ${error}`);
                    }
                });
                // Now execute the saved file
                const child1 = exec('a.exe', (error, stdout, stderr) => {
                    console.log(`stdout: ${stdout}`);
                    console.log(`stderr: ${stderr}`);
                    if (error !== null) {
                        console.log(`exec error: ${error}`);
                    }

                    // Send back the compile output to task.hbs page
                    io.to(socket.room).emit('editorMessage', stdout);
                    console.log("// Send back the compile output to task.hbs page");
                });
            }

        });


        socket.on('disconnect', function () {
            socket.leave(socket.room);
        });
    })
}
