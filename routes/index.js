var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');
var config = require('../config');
var transporter = nodemailer.createTransport(config.mailer);

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'InterCode'});
});

/* GET about page. */
router.get('/about', function (req, res, next) {
    res.render('about', {title: 'InterCode'});
});

/* GET Login and register page. */
router.get('/login', function (req, res, next) {
    res.render('login', {title: 'InterCode'});
});
router.get('/register', function (req, res, next) {
    res.render('register', {title: 'InterCode'});
});

/* Post contact page. */
router.route('/contact').get(function (req, res, next) {
    res.render('contact', {title: 'InterCode'});
}).post(function(req, res, next) {
    // Form validation of data received from contact.hbs
    req.checkBody('name', 'Empty name').notEmpty();
    req.checkBody('email', 'Invalid email').isEmail();
    req.checkBody('message', 'Empty message').notEmpty();
    var errors = req.validationErrors();

    if(errors) {
        res.render('contact', {
            title: 'InterCode',
            name: req.body.name,
            email: req.body.email,
            message: req.body.message,
            errorMessages: errors
        });
    } else {
        // Send mail
        var mailOptions = {
            from: 'InterCode <no-reply@intercode.com>',
            to: 'suhas.dakshana16@gmail.com',
            subject: 'New message from interviewer',
            text: req.body.message
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            // Redirect to thank.hbs after submitting contact form
            res.render('thank', {title: 'InterCode'});
        })
    }
});


module.exports = router;
