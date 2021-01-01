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
    var featureTableDetails = await models.Feature.findAll({ where: { status: 'Yes' } });
    var adminTableDetails = await models.Admin.findOne({ where: { status: 'Yes' } });
    if (featureTableDetails) {
        return res.render('admin/feature/list', {
            adminTableDetails: adminTableDetails,
            title: 'Feature List',
            arrFeatureData: featureTableDetails,
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')

        });

    } else {
        return res.render('admin/feature/list', {
            adminTableDetails: adminTableDetails,
            title: 'Client List',
            arrFeatureData: '',
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')

        });
    }
}

exports.load = async function (req, res) {
    var feature_id = req.params.feature_id;
    var featureTableDetails = '';
    var adminTableDetails = await models.Admin.findOne({ where: { status: 'Yes' } });
    if (feature_id && feature_id != undefined) {
        featureTableDetails = await models.Feature.findOne({ where: { feature_id: feature_id } });
        return res.render('admin/feature/addedit', {
            adminTableDetails: adminTableDetails,
            title: 'Edit Feature',
            arrFeatureData: featureTableDetails,
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
        });
    } else {
        return res.render('admin/feature/addedit', {
            adminTableDetails: adminTableDetails,
            title: 'Add Feature',
            arrFeatureData: '',
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
        });
    }

}

exports.saveOrUpdate = async function (req, res) {
    var form = new multiparty.Form();
    form.parse(req, async function (err, fields, files) {
        var feature_id = fields.form_feature_id[0];
        var formImage = files.image[0].originalFilename;
        if (formImage != '') {
            var ImageExt = formImage.split('.').pop();
            var adminImagewithEXT = Date.now() + files.image[0] + "." + ImageExt;
            var userFinalImage = adminImagewithEXT.replace("[object Object]", "");
        }

        if (!feature_id) {

            models.Feature.create({
                name: fields.name[0],
                status: fields.status[0],
                image: userFinalImage,
                feature_title: fields.feature_title[0]

            }).then(function (ftr_crt) {
                if (ftr_crt) {
                    if (files.image[0] != '' && files.image[0] != null) {
                        helper.createDirectory('public/web-contents/Feature/' + ftr_crt.feature_id + '/');
                        var temp_path = files.image[0].path;
                        var target_path = 'Feature/' + ftr_crt.feature_id + '/' + userFinalImage;
                        helper.uploadFiles(temp_path, target_path);
                    }
                    req.flash('info', 'Successfully Created');
                    return res.redirect('/admin/feature/' + ftr_crt.feature_id);
                } else {
                    req.flash('errors', 'Something Worng! Please try again.');
                    return res.redirect('back');
                }
            })

        } else {
            var featureTableDetails = await models.Feature.findOne({ where: { feature_id: feature_id } });
            var adminOldImage = featureTableDetails.image;
            models.Feature.update({
                name: fields.name[0],
                status: fields.status[0],
                feature_title: fields.feature_title[0],
                image: userFinalImage ? userFinalImage : adminOldImage
            }, { where: { feature_id: feature_id } }).then(function (ftr_upd) {
                if (ftr_upd) {
                    if (files.image[0] != '' && files.image[0] != null) {
                        helper.createDirectory('public/web-contents/Feature/' + feature_id + '/');
                        var temp_path = files.image[0].path;
                        var target_path = 'Feature/' + feature_id + '/' + userFinalImage;
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

    models.Feature.destroy({
        where: {
            feature_id: req.params.feature_id //this will be your id that you want to delete
        }
    }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
            req.flash('info', "Feature successfully deleted");
        } else {
            req.flash('err', "Failed to delete Feature. Please try again");
        }
        return res.redirect('/admin/feature/list');
    }, function (err) {
        req.flash('err', "Failed to delete Feature. Please try again");
        return res.redirect('/admin/feature/list');
    });
}