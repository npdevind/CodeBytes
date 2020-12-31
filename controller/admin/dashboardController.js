let models = require("../../models");
const { Op } = require("sequelize");
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


exports.loadDashboardPage = async function(req,res){
    console.log("Successfully enter dashboard");
    var adminTableDetails = await models.Admin.findOne({where:{status:'Yes'}});
    return res.render('admin/dashboard/page', {
        adminTableDetails:adminTableDetails,
        title:'Dashboard',
        s_msg: req.flash('info'),
        e_msg: req.flash('err'),
        helper: helper
    });
}



