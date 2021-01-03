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
    var clientTableDetails = await models.Client.findAll({ where: { status: 'Yes' } });
    var adminTableDetails = await models.Admin.findOne({ where: { status: 'Yes' } });
    if (clientTableDetails) {
        return res.render('admin/client/list', {
            adminTableDetails:adminTableDetails,
            title: 'Client List',
            arrClientData: clientTableDetails,
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
           
        });
        
    } else {
        return res.render('admin/client/list', {
            adminTableDetails:adminTableDetails,
            title: 'Client List',
            arrClientData: '',
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
           
        });
    }
}

exports.load = async function (req, res) {
    var client_id = req.params.client_id;
    var clientTableDetails = '';
    var adminTableDetails = await models.Admin.findOne({ where: { status: 'Yes' } });
    if (client_id && client_id != undefined) {
        clientTableDetails = await models.Client.findOne({ where: { client_id: client_id } });
        return res.render('admin/client/addedit', {
            adminTableDetails:adminTableDetails,
            title: 'Edit client',
            arrClientData: clientTableDetails,
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
        });
    } else {
        return res.render('admin/client/addedit', {
            adminTableDetails:adminTableDetails,
            title: 'Add client',
            arrClientData: '',
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
        });
    }

}

exports.saveOrUpdate = async function (req, res) {
    var form = new multiparty.Form();
    form.parse(req, async function (err, fields, files) {
        var client_id = fields.form_client_id[0];
        var formImage = files.logo[0].originalFilename;
        if (formImage != '') {
            var ImageExt = formImage.split('.').pop();
            var adminImagewithEXT = Date.now() + files.logo[0] + "." + ImageExt;
            var userFinalImage = adminImagewithEXT.replace("[object Object]", "");
        }

        if (!client_id) {
           
                models.Client.create({
                    name: fields.name[0],
                    status: fields.status[0],
                    logo: userFinalImage

                }).then(function (clnt_crt) {
                    if (clnt_crt) {
                        if (files.logo[0] != '' && files.logo[0] != null) {
                            helper.createDirectory('public/admin/web-contents/Client/' + clnt_crt.client_id + '/');
                            var temp_path = files.logo[0].path;
                            var target_path = 'Client/' + clnt_crt.client_id + '/' + userFinalImage;
                            helper.uploadFiles(temp_path, target_path);
                        }
                        req.flash('info', 'Successfully Created');
                        return res.redirect('/admin/client/' + clnt_crt.client_id);
                    } else {
                        req.flash('errors', 'Something Worng! Please try again.');
                        return res.redirect('back');
                    }
                })
            
        } else {
            var clientTableDetails = await models.Client.findOne({ where: { client_id: client_id } });
            var adminOldImage = clientTableDetails.image;
            models.Client.update({
                name: fields.name[0],
                status: fields.status[0],
                logo: userFinalImage ? userFinalImage : adminOldImage
            }, { where: { client_id: client_id } }).then(function (clnt_upd) {
                if (clnt_upd) {
                    if (files.logo[0] != '' && files.logo[0] != null) {
                        helper.createDirectory('public/admin/web-contents/Client/' + client_id + '/');
                        var temp_path = files.logo[0].path;
                        var target_path = 'Client/' + client_id + '/' + userFinalImage;
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

    models.Client.destroy({
        where: {
            client_id: req.params.client_id //this will be your id that you want to delete
        }
    }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
            req.flash('info', "Client successfully deleted");
        } else {
            req.flash('err', "Failed to delete Client. Please try again");
        }
        return res.redirect('/admin/client/list');
    }, function (err) {
        req.flash('err', "Failed to delete Client. Please try again");
        return res.redirect('/admin/client/list');
    });
}