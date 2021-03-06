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
    var developerTableDetails = await models.Developer.findAll({ where: { status: 'Yes' } });
    var adminTableDetails = await models.Admin.findOne({ where: { status: 'Yes' } });
    if (developerTableDetails) {
        return res.render('admin/developer/list', {
            adminTableDetails: adminTableDetails,
            title: 'Developer List',
            arrDevData: developerTableDetails,
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')

        });

    } else {
        return res.render('admin/developer/list', {
            adminTableDetails: adminTableDetails,
            title: 'Developer List',
            arrDevData: '',
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')

        });
    }
}

exports.load = async function (req, res) {
    var dev_id = req.params.dev_id;
    var developerTableDetails = '';
    var adminTableDetails = await models.Admin.findOne({ where: { status: 'Yes' } });
    if (dev_id && dev_id != undefined) {
        developerTableDetails = await models.Developer.findOne({ where: { dev_id: dev_id } });
        return res.render('admin/developer/addedit', {
            adminTableDetails: adminTableDetails,
            title: 'Edit Developer',
            arrDevData: developerTableDetails,
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
        });
    } else {
        return res.render('admin/developer/addedit', {
            adminTableDetails: adminTableDetails,
            title: 'Add Developer',
            arrDevData: '',
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
        });
    }

}

exports.saveOrUpdate = async function (req, res) {
    var form = new multiparty.Form();
    form.parse(req, async function (err, fields, files) {
        var dev_id = fields.form_dev_id[0];
        var formImage = files.image[0].originalFilename;
        if (formImage != '') {
            var ImageExt = formImage.split('.').pop();
            var adminImagewithEXT = Date.now() + files.image[0] + "." + ImageExt;
            var userFinalImage = adminImagewithEXT.replace("[object Object]", "");
        }

        if (!dev_id) {

            models.Developer.create({
                name: fields.name[0],
                position: fields.position[0],
                image: userFinalImage,
                status: fields.status[0]
            }).then(function (dev_crt) {
                if (dev_crt) {
                    if (files.image[0] != '' && files.image[0] != null) {
                        helper.createDirectory('public/admin/web-contents/Developer/' + dev_crt.dev_id + '/');
                        var temp_path = files.image[0].path;
                        var target_path = 'Developer/' + dev_crt.dev_id + '/' + userFinalImage;
                        helper.uploadFiles(temp_path, target_path);
                    }
                    req.flash('info', 'Successfully Created');
                    return res.redirect('/admin/developer/' +dev_crt.dev_id);
                } else {
                    req.flash('errors', 'Something Worng! Please try again.');
                    return res.redirect('back');
                }
            })

        } else {
            var developerTableDetails = await models.Developer.findOne({ where: { dev_id: dev_id } });
            var devOldImage = developerTableDetails.image;

            models.Developer.update({
                name: fields.name[0],
                position: fields.position[0],
                status: fields.status[0],
                image: userFinalImage ? userFinalImage : devOldImage

            }, { where: { dev_id: dev_id } }).then(function (dev_upd) {
                if (dev_upd) {
                    if (files.image[0] != '' && files.image[0] != null) {
                        helper.createDirectory('public/admin/web-contents/Developer/' + dev_upd.dev_id + '/');
                        var temp_path = files.image[0].path;
                        var target_path = 'Developer/' + dev_id + '/' + userFinalImage;
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

    models.Developer.destroy({
        where: {
            dev_id: req.params.dev_id //this will be your id that you want to delete
        }
    }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
            req.flash('info', "Developer successfully deleted");
        } else {
            req.flash('err', "Failed to delete Developer. Please try again");
        }
        return res.redirect('/admin/developer/list');
    }, function (err) {
        req.flash('err', "Failed to delete Developer. Please try again");
        return res.redirect('/admin/developer/list');
    });
}