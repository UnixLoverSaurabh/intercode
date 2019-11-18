const express = require('express');
const app = express();
const port = process.env.PORT || 9000;

const fs = require('fs');
const path = require('path');
const httpsOptions = {
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt')),
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key'))
}
const https = require('https').Server(httpsOptions, app);
const io = require('socket.io')(https);


app.use(express.static(__dirname + "/public"));
let clients = 0;

io.on('connection', function (socket) {
    socket.on("NewClient", function () {
        if (clients < 2) {
            if (clients == 1) {
                this.emit('CreatePeer')
            }
        }
        else
            this.emit('SessionActive');
        clients++;
    });
    socket.on('Offer', SendOffer);
    socket.on('Answer', SendAnswer);
    socket.on('disconnect', Disconnect)
});

function Disconnect() {
    if (clients > 0) {
        if (clients <= 2)
            this.broadcast.emit("Disconnect");
        clients--
    }
}

function SendOffer(offer) {
    this.broadcast.emit("BackOffer", offer)
}

function SendAnswer(data) {
    this.broadcast.emit("BackAnswer", data)
}



https.listen(port, () => console.log(`Active on ${port} port`));



