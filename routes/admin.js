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



module.exports = router;
