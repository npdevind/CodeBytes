/**
 * Required External Modules
 */
const express = require("express");
const session = require('express-session');
const flash = require('connect-flash');
const path = require("path");
const cors = require('cors');
const bodyParser = require("body-parser");
const moment = require('moment');
const routes = require("./routes");
var partials  = require('express-partials');
var favicon = require('static-favicon');







/**
 * Required internal Modules
 */
var models = require("./models");





/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "4200";







/**
 *  App Configuration
 */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(partials());
app.use(favicon());
app.use(session({secret: 'asdf4321',saveUninitialized: true,resave: true}));
app.use(express.static(path.join(__dirname, "public")));
app.use('/favicon.ico', express.static(path.join(__dirname,'favicon.ico')));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(flash());




/**
 * Routes Definitions
 */
app.use('/', routes);
var codebytes = require('./routes/codebytes');
app.use('/', codebytes);

var admin = require('./routes/admin');
app.use('/admin', admin);










/**
 * Server Activation
 */
var server = app.listen(port, () => {
	models.sequelize.sync({logging: console.log}).then(() => {
        console.log("████████████████████████████████████████████████████████████████████████████");
        console.log('Website is ready to launch. URL - http://localhost:' + port);
        console.log("████████████████████████████████████████████████████████████████████████████");
    }).catch(function (e) {
        throw new Error(e);
    });
});





app.locals.baseurl='http://localhost:'+server.address().port+'/';
var shortDateFormat = "DD-MM-YYYY"; // this is just an example of storing a date format once so you can change it in one place and have it propagate
app.locals.moment = moment; // this makes moment available as a variable in every EJS page
app.locals.shortDateFormat = shortDateFormat;
var dateFormatWithTime = "DD-MM-YYYY h:m:s";
app.locals.dateFormatWithTime = dateFormatWithTime;




module.exports = app;
