var express = require('express');
var router = express.Router();

const email = require('../controller/codebytes/contactusemailController'); 
router.post('/send',email.email);

module.exports = router;