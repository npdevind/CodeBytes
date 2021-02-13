const express = require('express');
var app = express();
var bodyParser = require('body-parser');
var models = require('../../models');
var helper = require('../../helpers/helper_function');

var config = require('../../config/config.json');
const Sequelize = require("sequelize");
var sequelize = new Sequelize(
    config.development.database, 
    config.development.username,
    config.development.password, {
        host: 'localhost',
        dialect: 'mysql',
        logging: true,
        pool: {
            max: 5,
            min: 0,
            idle: 10000
    }
});

exports.home = async function(req,res){
    var contactTableDetails = await models.ContactUs.findOne({where:{status:'Yes'}});
    var teamTableDetails = await models.Team.findAll();
    var portappTableDetails = await models.Portfolio.findAll({where:{type:'APP'}});
    var portcardTableDetails = await models.Portfolio.findAll({where:{type:'CARD'}});
    var portwebTableDetails = await models.Portfolio.findAll({where:{type:'WEB'}});
    var typeCount = await sequelize.query("SELECT COUNT(type),type FROM portfolio GROUP BY type",{ type: sequelize.QueryTypes.SELECT });
    var featureTableDetails = await models.Feature.findAll();
    var serviceTableDetails = await models.Service.findAll();
    var aboutusTableDetails = await models.AboutUs.findAll();
    var testimonialTableDetails = await models.Testimonial.findAll();
    var faqTableDetails = await models.Faq.findAll();

    return res.render("codebytes/home/index",{
        contactTableDetails :contactTableDetails ? contactTableDetails :'',
        arrTeamData: teamTableDetails ? teamTableDetails : '',
        arrPortappData: portappTableDetails ? portappTableDetails : '',
        arrPortcardData: portcardTableDetails ? portcardTableDetails : '',
        arrPortwebData: portwebTableDetails ? portwebTableDetails : '',
        arrtypeCount :typeCount ? typeCount : '',
        arrFeatureData : featureTableDetails ? featureTableDetails : '',
        arrServiceData : serviceTableDetails ? serviceTableDetails : '',
        arrAboutUsData : aboutusTableDetails ? aboutusTableDetails : '',
        arrTestimonialData : testimonialTableDetails ? testimonialTableDetails : '',
        arrFaqlData : faqTableDetails ? faqTableDetails : '',
        helper: helper
    });

    
}