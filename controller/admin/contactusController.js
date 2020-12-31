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
    var contact_id = req.params.contact_id;
    var contactTableDetails = '';
    var adminTableDetails = await models.Admin.findOne({where:{status:'Yes'}});

    if (contact_id && contact_id != undefined) {
        contactTableDetails = await models.ContactUs.findOne({ where: { contact_id: contact_id } });
        return res.render('admin/contactus/addedit', {
            adminTableDetails:adminTableDetails,
            title: 'Edit contact',
            arrContactData: contactTableDetails,
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
        });
    } else {
        return res.render('admin/contactus/addedit', {
            adminTableDetails:adminTableDetails,
            title: 'Add contact',
            arrContactData: '',
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
        });
    }
}

exports.saveOrUpdate = async function (req, res) {
    var form = new multiparty.Form();
    form.parse(req, async function (err, fields, files) {
        var contact_id = fields.form_contact_id[0];
        var formImage = files.image[0].originalFilename;
        if (formImage != '') {
            var ImageExt = formImage.split('.').pop();
            var adminImagewithEXT = Date.now() + files.image[0] + "." + ImageExt;
            var userFinalImage = adminImagewithEXT.replace("[object Object]", "");
        }

        if (!contact_id) {
            var checkContactEmail = await models.ContactUs.findAll({ where: { email: fields.email[0] } });
            if (checkContactEmail.length == 0) {
                models.ContactUs.create({
                    description: fields.description[0],
                    location: fields.location[0],
                    email: fields.email[0],
                    fb_id: fields.fb_id[0],
                    insta_id: fields.insta_id[0],
                    twitter_id: fields.twitter_id[0],
                    linkdin_id: fields.linkdin_id[0],
                    image: userFinalImage,
                    status: fields.status[0],
                    mobile: fields.mobile[0]
                }).then(function (contct_crt) {
                    if (contct_crt) {
                        if (files.image[0] != '' && files.image[0] != null) {
                            helper.createDirectory('public/web-contents/ContactUs/' + contct_crt.contact_id + '/');
                            var temp_path = files.image[0].path;
                            var target_path = 'ContactUs/' + contct_crt.contact_id + '/' + userFinalImage;
                            helper.uploadFiles(temp_path, target_path);
                        }
                        req.flash('info', 'Successfully Created');
                        return res.redirect('/admin/contactus/' + contct_crt.contact_id);
                    } else {
                        req.flash('errors', 'Something Worng! Please try again.');
                        return res.redirect('back');
                    }
                })
            } else {
                req.flash('errors', 'This email already exist.');
                return res.redirect('back');
            }
        } else {
            var contactTableDetails = await models.ContactUs.findOne({ where: { contact_id: contact_id } });
            var adminOldImage = contactTableDetails.image;
            models.ContactUs.update({
                description: fields.description[0],
                location: fields.location[0],
                email: fields.email[0],
                fb_id: fields.fb_id[0],
                insta_id: fields.insta_id[0],
                twitter_id: fields.twitter_id[0],
                linkdin_id: fields.linkdin_id[0],
                image : userFinalImage ? userFinalImage : adminOldImage,
                status: fields.status[0],
                mobile: fields.mobile[0]
            }, { where: { contact_id: contact_id } }).then(function (contct_upd) {
                if (contct_upd) {
                    if (files.image[0] != '' && files.image[0] != null) {
                        helper.createDirectory('public/web-contents/ContactUs/' + contact_id + '/');
                        var temp_path = files.image[0].path;
                        var target_path = 'ContactUs/' + contact_id + '/' + userFinalImage;
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

    models.ContactUs.destroy({
        where: {
            contact_id: req.params.contact_id //this will be your id that you want to delete
        }
    }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
            req.flash('info', "contact successfully deleted");
        } else {
            req.flash('err', "Failed to delete contact. Please try again");
        }
        return res.redirect('/admin/contactus/addedit');
    }, function (err) {
        req.flash('err', "Failed to delete Admin. Please try again");
        return res.redirect('/admin/contactus/addedit');
    });
}