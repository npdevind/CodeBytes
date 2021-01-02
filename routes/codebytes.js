var express = require('express');
var router = express.Router();

const home = require('../controller/codebytes/homeController'); 
router.get('/home',home.home);

const email = require('../controller/codebytes/contactusemailController'); 
router.post('/send',email.email);

module.exports = router;