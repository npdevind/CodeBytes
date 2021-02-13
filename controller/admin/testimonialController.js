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
    var testimonialTableDetails = await models.Testimonial.findAll();
    var adminTableDetails = await models.Admin.findOne({ where: { status: 'Yes' } });
    if (testimonialTableDetails) {
        return res.render('admin/testimonial/list', {
            adminTableDetails: adminTableDetails,
            title: 'Testimonial List',
            arrTestimonialData: testimonialTableDetails,
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')

        });

    } else {
        return res.render('admin/testimonial/list', {
            adminTableDetails: adminTableDetails,
            title: 'Testimonial List',
            arrTestimonialData: '',
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')

        });
    }
}

exports.load = async function (req, res) {
    var testimonial_id = req.params.testimonial_id;
    var testimonialTableDetails = '';
    var adminTableDetails = await models.Admin.findOne({ where: { status: 'Yes' } });
    if (testimonial_id && testimonial_id != undefined) {
        testimonialTableDetails = await models.Testimonial.findOne({ where: { testimonial_id: testimonial_id } });
        return res.render('admin/testimonial/addedit', {
            adminTableDetails: adminTableDetails,
            title: 'Edit Testimonial',
            arrTestimonialData: testimonialTableDetails,
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
        });
    } else {
        return res.render('admin/testimonial/addedit', {
            adminTableDetails: adminTableDetails,
            title: 'Add Testimonial',
            arrTestimonialData: '',
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
        });
    }

}

exports.saveOrUpdate = async function (req, res) {
    var form = new multiparty.Form();
    form.parse(req, async function (err, fields, files) {
        var testimonial_id = fields.form_testimonial_id[0];
        var formImage = files.dp[0].originalFilename;
        if (formImage != '') {
            var ImageExt = formImage.split('.').pop();
            var adminImagewithEXT = Date.now() + files.dp[0] + "." + ImageExt;
            var userFinalImage = adminImagewithEXT.replace("[object Object]", "");
        }

        if (!testimonial_id) {

            models.Testimonial.create({
                name: fields.name[0],
                profession: fields.profession[0],
                dp: userFinalImage,
                intro: fields.intro[0]
            }).then(function (testi_crt) {
                if (testi_crt) {
                    if (files.dp[0] != '' && files.dp[0] != null) {
                        helper.createDirectory('public/admin/web-contents/Testimonial/' + testi_crt.testimonial_id + '/');
                        var temp_path = files.dp[0].path;
                        var target_path = 'Testimonial/' + testi_crt.testimonial_id + '/' + userFinalImage;
                        helper.uploadFiles(temp_path, target_path);
                    }
                    req.flash('info', 'Successfully Created');
                    return res.redirect('/admin/testimonial/' + testi_crt.testimonial_id);
                } else {
                    req.flash('errors', 'Something Worng! Please try again.');
                    return res.redirect('back');
                }
            })

        } else {
            var testimonialTableDetails = await models.Testimonial.findOne({ where: { testimonial_id: testimonial_id } });
            var adminOldImage = testimonialTableDetails.dp;
            models.Testimonial.update({
                name: fields.name[0],
                profession: fields.profession[0],
                intro: fields.intro[0],
                dp: userFinalImage ? userFinalImage : adminOldImage

            }, { where: { testimonial_id: testimonial_id } }).then(function (testi_upd) {
                if (testi_upd) {
                    if (files.dp[0] != '' && files.dp[0] != null) {
                        helper.createDirectory('public/admin/web-contents/Testimonial/' + testimonial_id + '/');
                        var temp_path = files.dp[0].path;
                        var target_path = 'Testimonial/' + testimonial_id + '/' + userFinalImage;
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

    models.Testimonial.destroy({
        where: {
            testimonial_id: req.params.testimonial_id //this will be your id that you want to delete
        }
    }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
            req.flash('info', "Testimonial successfully deleted");
        } else {
            req.flash('err', "Failed to delete Testimonial. Please try again");
        }
        return res.redirect('/admin/testimonial/list');
    }, function (err) {
        req.flash('err', "Failed to delete Testimonial. Please try again");
        return res.redirect('/admin/testimonial/list');
    });
}