var express = require('express');
var router = express.Router();
let models = require("../models");
var config = require('../config/config.json');
var passport = require('passport');
const Sequelize = require("sequelize");
var sequelize = new Sequelize(
    config.development.database, 
    config.development.username,
    config.development.password, {
        host: 'localhost',
        dialect: 'mysql',
        logging: false,
        pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});
/**
 * If not logged in then it will redirects every page to the admin login page
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function checkAdminLogin(req, res, next) {
    var sess = req.session.admin;
    try {
        if(!sess.username) {
            res.redirect("/admin/login");
        }
    } catch(err) {
        res.redirect("/admin/login");
    }
    next();
}



/**
 * This function checks whether any admin is logged in or not
 * If logged in then it will redirects login page to the dashboard
 */
function checkLoggedInAdmin(req, res, next) {
    try {
        if(req.session.admin) {
            res.redirect("/admin/dashboard");
        }
    } catch(err) {
        res.redirect("/admin/logout");
    }
    next();
}

var expressValidator = require('express-validator');
router.use(expressValidator())


async function middleHandler(req, res, next) {
    models.Admin.findOne({ where: { username: (req.session.admin.username) } }).then(async function (user) {
        if (user) {
            res.locals.sessionAdminFullName = user.name;
            res.locals.sessionAdminImage = user.image;
            res.locals.sessionAdminPh = user.mobile;
            res.locals.sessionAdminId = user.admin_id;
        } else {
            //req.session.destroy();
            //res.redirect("/auth/signin");
            //req.logout();
            res.redirect('/auth/signin');
        }

    });
    next();
}

router.get('/', function (req, res) {
    res.redirect('login');
});

const auth = require('../controller/admin/authController');
router.get('/login', checkLoggedInAdmin, auth.loadLoginPage);
router.post('/login', checkLoggedInAdmin, auth.checkLogin);
router.get('/logout', checkAdminLogin, middleHandler, auth.logout);

const dashboard = require('../controller/admin/dashboardController');
router.get('/dashboard', checkAdminLogin, middleHandler, dashboard.loadDashboardPage);


//////////////////////////////////// Admin Start ////////////////////////////////////////////////////////
const adminController = require('../controller/admin/adminController');
router.get('/admin-user/list', checkAdminLogin, middleHandler, adminController.list);
router.get('/admin-user/:admin_user_id?', checkAdminLogin, middleHandler, adminController.load);
router.post('/admin-user', checkAdminLogin, middleHandler, adminController.saveOrUpdate);
router.get('/admin-user/delete/:admin_user_id?', checkAdminLogin, middleHandler, adminController.delete);
router.post('/admin-user/admin-set-password', checkAdminLogin, middleHandler, adminController.setPassword);
//////////////////////////////////// Admin ends ////////////////////////////////////////////////////////

//////////////////////////////////// AboutUs Start ////////////////////////////////////////////////////////
const aboutusController = require('../controller/admin/aboutusController');
router.get('/aboutus/:aboutus_id?', checkAdminLogin, middleHandler, aboutusController.load);
router.post('/aboutus', checkAdminLogin, middleHandler, aboutusController.saveOrUpdate);
router.get('/aboutus/delete/:aboutus_id?', checkAdminLogin, middleHandler, aboutusController.delete);
//////////////////////////////////// AboutUs ends ////////////////////////////////////////////////////////

//////////////////////////////////// Contact Start ////////////////////////////////////////////////////////
const contactController = require('../controller/admin/contactusController');
router.get('/contactus/:contact_id?', checkAdminLogin, middleHandler, contactController.load);
router.post('/contactus', checkAdminLogin, middleHandler, contactController.saveOrUpdate);
router.get('/contactus/delete/:contact_id?', checkAdminLogin, middleHandler, contactController.delete);
//////////////////////////////////// Contact ends ////////////////////////////////////////////////////////

//////////////////////////////////// CLient Start ////////////////////////////////////////////////////////
const clientController = require('../controller/admin/clientController');
router.get('/client/list', checkAdminLogin, middleHandler, clientController.list);
router.get('/client/:client_id?', checkAdminLogin, middleHandler, clientController.load);
router.post('/client', checkAdminLogin, middleHandler, clientController.saveOrUpdate);
router.get('/client/delete/:client_id?', checkAdminLogin, middleHandler, clientController.delete);
//////////////////////////////////// Client ends ////////////////////////////////////////////////////////

//////////////////////////////////// Feature Start ////////////////////////////////////////////////////////
const featureController = require('../controller/admin/featureController');
router.get('/feature/list', checkAdminLogin, middleHandler, featureController.list);
router.get('/feature/:feature_id?', checkAdminLogin, middleHandler, featureController.load);
router.post('/feature', checkAdminLogin, middleHandler, featureController.saveOrUpdate);
router.get('/feature/delete/:feature_id?', checkAdminLogin, middleHandler, featureController.delete);
//////////////////////////////////// Feature ends ////////////////////////////////////////////////////////


//////////////////////////////////// Portfolio Start ////////////////////////////////////////////////////////
const portfolioController = require('../controller/admin/portfolioController');
router.get('/portfolio/list', checkAdminLogin, middleHandler, portfolioController.list);
router.get('/portfolio/:portfolio_id?', checkAdminLogin, middleHandler, portfolioController.load);
router.post('/portfolio', checkAdminLogin, middleHandler, portfolioController.saveOrUpdate);
router.get('/portfolio/delete/:portfolio_id?', checkAdminLogin, middleHandler, portfolioController.delete);
//////////////////////////////////// Portfolio ends ////////////////////////////////////////////////////////

//////////////////////////////////// Team Start ////////////////////////////////////////////////////////
const teamController = require('../controller/admin/teamController');
router.get('/team/list', checkAdminLogin, middleHandler, teamController.list);
router.get('/team/:team_id?', checkAdminLogin, middleHandler, teamController.load);
router.post('/team', checkAdminLogin, middleHandler, teamController.saveOrUpdate);
router.get('/team/delete/:team_id?', checkAdminLogin, middleHandler, teamController.delete);
//////////////////////////////////// Team ends ////////////////////////////////////////////////////////

//////////////////////////////////// Service Start ////////////////////////////////////////////////////////
const serviceController = require('../controller/admin/serviceController');
router.get('/service/list', checkAdminLogin, middleHandler, serviceController.list);
router.get('/service/:service_id?', checkAdminLogin, middleHandler, serviceController.load);
router.post('/service', checkAdminLogin, middleHandler, serviceController.saveOrUpdate);
router.get('/service/delete/:service_id?', checkAdminLogin, middleHandler, serviceController.delete);
//////////////////////////////////// Service ends ////////////////////////////////////////////////////////

//////////////////////////////////// Testimonial Start ////////////////////////////////////////////////////////
const testimonialController = require('../controller/admin/testimonialController');
router.get('/testimonial/list', checkAdminLogin, middleHandler, testimonialController.list);
router.get('/testimonial/:testimonial_id?', checkAdminLogin, middleHandler, testimonialController.load);
router.post('/testimonial', checkAdminLogin, middleHandler, testimonialController.saveOrUpdate);
router.get('/testimonial/delete/:testimonial_id?', checkAdminLogin, middleHandler, testimonialController.delete);
//////////////////////////////////// Testimonial ends ////////////////////////////////////////////////////////


//////////////////////////////////// FAQ Start ////////////////////////////////////////////////////////
const faqController = require('../controller/admin/faqController');
router.get('/faq/list', checkAdminLogin, middleHandler, faqController.list);
router.get('/faq/:faq_id?', checkAdminLogin, middleHandler, faqController.load);
router.post('/faq', checkAdminLogin, middleHandler, faqController.saveOrUpdate);
router.get('/faq/delete/:faq_id?', checkAdminLogin, middleHandler, faqController.delete);
//////////////////////////////////// FAQ ends ////////////////////////////////////////////////////////

//////////////////////////////////// FAQ Start ////////////////////////////////////////////////////////
const devController = require('../controller/admin/developerController');
router.get('/dev/list', checkAdminLogin, middleHandler, devController.list);
router.get('/dev/:dev_id?', checkAdminLogin, middleHandler, devController.load);
router.post('/dev', checkAdminLogin, middleHandler, devController.saveOrUpdate);
router.get('/dev/delete/:faq_id?', checkAdminLogin, middleHandler, devController.delete);
//////////////////////////////////// FAQ ends ////////////////////////////////////////////////////////

module.exports = router;
