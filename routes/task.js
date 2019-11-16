var express = require('express');
var router = express.Router();

var formidable = require('formidable');
var fs = require('fs');

router.get('/createTask', function (req, res) {
    var newTask = new Task();

    newTask.save(function (err, data) {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/task/' + data._id);
        }
    })
});

router.get('/task/:id', function (req, res) {
    if (req.params.id) {
        Task.findOne({_id: req.params.id}, function (err, data) {
            if (err) {
                console.log(err);
                res.render('error');
            }

            if (data) {
                // console.log(data.content + "        " + data.id);
                res.render('task', {content: data.content, roomId: data.id});
            } else {
                res.render('error');
            }
        })
    } else {
        res.render('error');
    }
});

/* POST files/resume . */
router.post('/task/fileupload', function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.filetoupload.path;
        var newpath = 'C:/Users/astar/' + files.filetoupload.name;
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            res.write('File uploaded and moved!');
            res.end(" File end");
        });
    });
});

module.exports = router;
