var express = require('express');
var app = express();

var message = [
    {
        id: 1,
        name: "saurabh",
        read: false
    },
    {
        id: 2,
        name: "sunil",
        read: true
    },
    {
        id: 3,
        name: "mojo",
        read: false
    }
];

app.get('/', function (req, res) {
    res.send('Message from app.js');
});

app.get('/messages', function (req, res) {
   res.json(message);
});

// app.listen(3000);
app.listen(3000, function () {
    var port = 3000;
   console.log('Server running on port ' + port + 'http://localhost:3000');
});
