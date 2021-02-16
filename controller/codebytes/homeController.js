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

    var portTypeCount = await sequelize.query("SELECT COUNT(type),type FROM portfolio GROUP BY type",{ type: sequelize.QueryTypes.SELECT });
    var ARR_PortTypeCount = [];
    for(var i=0; i < portTypeCount.length; i++){
        var getProtValues = await models.Portfolio.findAll({where:{type:portTypeCount[i].type}});
        for(var j=0; j < getProtValues.length; j++){
            ARR_PortTypeCount.push({
                "portfolio_id" : getProtValues[j].portfolio_id,
                "screen_shot" : getProtValues[j].screen_shot,
                "name" : getProtValues[j].name,
                "type" : getProtValues[j].type
            })
        }
        
    }

    var featureTableDetails = await models.Feature.findAll();
    var serviceTableDetails = await models.Service.findAll();
    var aboutusTableDetails = await models.AboutUs.findAll();
    var testimonialTableDetails = await models.Testimonial.findAll();
    var faqTableDetails = await models.Faq.findAll();

    return res.render("codebytes/home/index",{
        contactTableDetails :contactTableDetails ? contactTableDetails :'',
        arrTeamData: teamTableDetails ? teamTableDetails : '',
        arrtypeCount :portTypeCount ? portTypeCount : '',
        ARR_PortTypeCount : ARR_PortTypeCount ? ARR_PortTypeCount : '',
        arrFeatureData : featureTableDetails ? featureTableDetails : '',
        arrServiceData : serviceTableDetails ? serviceTableDetails : '',
        arrAboutUsData : aboutusTableDetails ? aboutusTableDetails : '',
        arrTestimonialData : testimonialTableDetails ? testimonialTableDetails : '',
        arrFaqlData : faqTableDetails ? faqTableDetails : '',
        helper: helper
    });

    
}