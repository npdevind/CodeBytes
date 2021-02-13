var models = require('../../models');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var formidable = require('formidable');
var multiparty = require('multiparty');
var bodyParser = require('body-parser');
var helper = require('../../helpers/helper_function');
var config = require('../../config/config.json');
var Sequelize = require("sequelize");
var sequelize = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password, {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});



exports.load = async function (req, res) {
    var aboutus_id = req.params.aboutus_id;
    var aboutusTableDetails = await models.AboutUs.findOne();
    if(aboutusTableDetails){
        return res.render('admin/aboutus/addedit', {
            title: 'Edit aboutus',
            arrAboutUsData: aboutusTableDetails ? aboutusTableDetails : '',
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
        });
    }else{
        return res.render('admin/aboutus/addedit', {
            title: 'Add aboutus',
            arrAboutUsData: '',
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
        });
    }
   
}

exports.saveOrUpdate = async function (req, res) {
    var form = new multiparty.Form();
    form.parse(req, async function (err, fields, files) {
        var aboutus_id = fields.form_aboutus_id[0];
        if (!aboutus_id) {
                models.AboutUs.create({
                    introduction: fields.introduction[0]
                }).then(function (about_crt) {
                    if (about_crt) {
                        req.flash('info', 'Successfully Created');
                        return res.redirect('/admin/aboutus/' + about_crt.aboutus_id);
                    } else {
                        req.flash('errors', 'Something Worng! Please try again.');
                        return res.redirect('back');
                    }
                })
        } else {
            models.AboutUs.update({
                introduction: fields.introduction[0]
            }, { where: { aboutus_id: aboutus_id } }).then(function (about_upd) {
                if (about_upd) {
                    req.flash('info', 'Successfully Updated');
                    return res.redirect('back');
                } else {
                    req.flash('errors', 'Something Worng! Please try again.');
                    return res.redirect('back');
                }
            })
        }
    })
}



exports.delete = async function (req, res, next) {

    models.AboutUs.destroy({
        where: {
            aboutus_id: req.params.aboutus_id //this will be your id that you want to delete
        }
    }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
            req.flash('info', "aboutus successfully deleted");
        } else {
            req.flash('err', "Failed to delete aboutus. Please try again");
        }
        return res.redirect('/admin/aboutus/addedit');
    }, function (err) {
        req.flash('err', "Failed to delete aboutus. Please try again");
        return res.redirect('/admin/aboutus/addedit');
    });
}