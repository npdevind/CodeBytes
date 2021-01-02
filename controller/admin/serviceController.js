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


exports.list = async function (req, res) {
    var serviceTableDetails = await models.Service.findAll({ where: { status: 'Yes' } });
    var adminTableDetails = await models.Admin.findOne({ where: { status: 'Yes' } });
    if (serviceTableDetails) {
        return res.render('admin/service/list', {
            adminTableDetails: adminTableDetails,
            title: 'Service List',
            arrServiceData: serviceTableDetails,
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')

        });

    } else {
        return res.render('admin/service/list', {
            adminTableDetails: adminTableDetails,
            title: 'Service List',
            arrServiceData: '',
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')

        });
    }
}

exports.load = async function (req, res) {
    var service_id = req.params.service_id;
    var serviceTableDetails = '';
    var adminTableDetails = await models.Admin.findOne({ where: { status: 'Yes' } });
    if (service_id && service_id != undefined) {
        serviceTableDetails = await models.Service.findOne({ where: { service_id: service_id } });
        return res.render('admin/service/addedit', {
            adminTableDetails: adminTableDetails,
            title: 'Edit Service',
            arrServiceData: serviceTableDetails,
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
        });
    } else {
        return res.render('admin/service/addedit', {
            adminTableDetails: adminTableDetails,
            title: 'Add Service',
            arrServiceData: '',
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
        });
    }

}

exports.saveOrUpdate = async function (req, res) {
    var form = new multiparty.Form();
    form.parse(req, async function (err, fields, files) {
        var service_id = fields.form_service_id[0];
        var formImage = files.logo[0].originalFilename;
        if (formImage != '') {
            var ImageExt = formImage.split('.').pop();
            var adminImagewithEXT = Date.now() + files.logo[0] + "." + ImageExt;
            var userFinalImage = adminImagewithEXT.replace("[object Object]", "");
        }

        if (!service_id) {

            models.Service.create({
                name: fields.name[0],
                status: fields.status[0],
                logo: userFinalImage,
                service_title: fields.service_title[0],
                description: fields.description[0],
            }).then(function (service_crt) {
                if (service_crt) {
                    if (files.logo[0] != '' && files.logo[0] != null) {
                        helper.createDirectory('public/web-contents/Service/' + service_crt.service_id + '/');
                        var temp_path = files.logo[0].path;
                        var target_path = 'Service/' + service_crt.service_id+ '/' + userFinalImage;
                        helper.uploadFiles(temp_path, target_path);
                    }
                    req.flash('info', 'Successfully Created');
                    return res.redirect('/admin/service/' + service_crt.service_id);
                } else {
                    req.flash('errors', 'Something Worng! Please try again.');
                    return res.redirect('back');
                }
            })

        } else {
            var serviceTableDetails = await models.Service.findOne({ where: { service_id: service_id } });
            var adminOldImage = serviceTableDetails.logo;
            models.Service.update({
                name: fields.name[0],
                status: fields.status[0],
                service_title: fields.service_title[0],
                description: fields.description[0],
                logo: userFinalImage ? userFinalImage : adminOldImage
            }, { where: { service_id: service_id } }).then(function (service_upd) {
                if (service_upd) {
                    if (files.logo[0] != '' && files.logo[0] != null) {
                        helper.createDirectory('public/web-contents/Service/' + service_id + '/');
                        var temp_path = files.logo[0].path;
                        var target_path = 'Service/' + service_id + '/' + userFinalImage;
                        helper.uploadFiles(temp_path, target_path);
                    }
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

    models.Service.destroy({
        where: {
            service_id: req.params.service_id //this will be your id that you want to delete
        }
    }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
            req.flash('info', "Service successfully deleted");
        } else {
            req.flash('err', "Failed to delete Service. Please try again");
        }
        return res.redirect('/admin/service/list');
    }, function (err) {
        req.flash('err', "Failed to delete Service. Please try again");
        return res.redirect('/admin/service/list');
    });
}