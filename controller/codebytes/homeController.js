const express = require('express');
var app = express();
var bodyParser = require('body-parser');
var models = require('../../models');
var helper = require('../../helpers/helper_function');


exports.home = async function(req,res){
    var contactTableDetails = await models.ContactUs.findOne({where:{status:'Yes'}});
    var teamTableDetails = await models.Team.findAll();
    var portappTableDetails = await models.Portfolio.findAll({where:{type:'APP'}});
    var portcardTableDetails = await models.Portfolio.findAll({where:{type:'CARD'}});
    var portwebTableDetails = await models.Portfolio.findAll({where:{type:'WEB'}});
    return res.render("codebytes/home/index",{
        contactTableDetails :contactTableDetails ? contactTableDetails :'',
        arrTeamData: teamTableDetails ? teamTableDetails : '',
        arrPortappData: portappTableDetails ? portappTableDetails : '',
        arrPortcardData: portcardTableDetails ? portcardTableDetails : '',
        arrPortwebData: portwebTableDetails ? portwebTableDetails : '',
        helper: helper
    });
}