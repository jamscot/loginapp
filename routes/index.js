var express = require('express');
var router = express.Router();


// Homepage, wen user hits / render a view called index
router.get('/', function(req, res){
	res.render('index');

});

module.exports = router;