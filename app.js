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

app.get('/messages/:id', function (req, res) {
   var id = parseInt(req.params.id, 10);
   var flag = false;

   for(var i = 0 ; i < message.length ; i++) {
       if(message[i].id === id) {
           res.json(message[i]);
           flag = true;
           break;
       }
   }

   if(!flag) {
       res.send("Can not find any message with this ID...");
   }
});

// app.listen(3000);
app.listen(3000, function () {
    var port = 3000;
   console.log('Server running on port ' + port + 'http://localhost:3000');
});
