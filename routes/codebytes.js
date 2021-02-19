var express = require('express');
var router = express.Router();

const home = require('../controller/codebytes/homeController'); 
router.get('/home',home.home);

const email = require('../controller/codebytes/contactusemailController'); 
router.post('/send',email.email);

const blog = require('../controller/codebytes/blogController'); 
router.get('/blog',blog.list);

const blogs = require('../controller/codebytes/blogcatController'); 
router.get('/blogs',blogs.list);

module.exports = router;