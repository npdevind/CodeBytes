const express = require('express');
var app = express();
var bodyParser = require('body-parser');
var models = require('../../models');
var helper = require('../../helpers/helper_function');
exports.home = async function(req,res){
    var adminTableDetails = await models.Admin.findOne({where:{status:'Yes'}});
    var contactTableDetails = await models.ContactUs.findOne({where:{status:'Yes'}});
    return res.render("codebytes/home/index",{
        adminTableDetails : adminTableDetails,
        contactTableDetails :contactTableDetails,
        helper: helper
    });
}