var express = require('express');
var router = express.Router();

const home = require('../controller/codebytes/homeController'); 
router.get('/home',home.home);


module.exports = router;