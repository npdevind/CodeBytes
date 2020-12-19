const express = require('express');
var app = express();
var bodyParser = require('body-parser');
var models = require('../../models');

exports.home = async function(req,res){
    await res.render("codebytes/home/index");
}