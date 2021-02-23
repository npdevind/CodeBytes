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


exports.list = async function(req,res){
    var cat_id = req.params.cat_id;
    if(cat_id !='' && cat_id != undefined){
        var contactTableDetails = await models.ContactUs.findOne({where:{status:'Yes'}});
        var blogTableDetails = await models.Blog.findAll({where:{category_id:cat_id}});
        return res.render("codebytes/blog/list",{
            contactTableDetails :contactTableDetails ? contactTableDetails :'',        
            arrBlogData : blogTableDetails ? blogTableDetails: '',
            arrBlogCatData : '',
            helper : helper
        });
    }else{
        var contactTableDetails = await models.ContactUs.findOne({where:{status:'Yes'}});
        var blogcatTableDetails = await models.BlogCategory.findAll({where:{status:'Yes'}});
        return res.render("codebytes/blog/list",{
            contactTableDetails :contactTableDetails ? contactTableDetails :'',        
            arrBlogCatData : blogcatTableDetails ? blogcatTableDetails: '',
            arrBlogData : '',
            helper : helper
        });
    }
    
}