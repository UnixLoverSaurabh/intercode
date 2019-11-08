var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'InterCode' });
});

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'InterCode' });
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'InterCode' });
});


module.exports = router;
