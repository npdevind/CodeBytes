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
    var devDetails = await models.Developer.findAll({ where: { status: 'Yes' } });
    if (devDetails) {
        return res.render('admin/developer/list', {
            title: 'Developer List',
            arrdevDetails: devDetails,
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
        });
    } else {
        return res.render('admin/faq/list', {
            title: 'Developer List',
            arrdevDetails: '',
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
        });
    }
}

exports.load = async function (req, res) {
    var dev_id = req.params.dev_id;
    var devTableDetails = '';
    if (dev_id && dev_id != undefined) {
        devTableDetails = await models.Developer.findOne({ where: { dev_id: dev_id } });
        return res.render('admin/developer/addedit', {
            title: 'Edit FAQ',
            arrDevData: devTableDetails,
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
        });
    } else {
        return res.render('admin/developer/addedit', {
            title: 'Add FAQ',
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
        var faq_id = fields.form_faq_id[0];

        if (!faq_id) {

            models.Faq.create({
                question: fields.question[0],
                answer: fields.answer[0],
                status: fields.status[0]
            }).then(function (faq_crt) {
                if (faq_crt) {
                    req.flash('info', 'Successfully Created');
                    return res.redirect('/admin/faq/' + faq_crt.faq_id);
                } else {
                    req.flash('errors', 'Something Worng! Please try again.');
                    return res.redirect('back');
                }
            })

        } else {
            models.Faq.update({
                question: fields.question[0],
                answer: fields.answer[0],
                status: fields.status[0]

            }, { where: { faq_id: faq_id } }).then(function (faq_upd) {
                if (faq_upd) {
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

    models.Faq.destroy({
        where: {
            faq_id: req.params.faq_id //this will be your id that you want to delete
        }
    }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
            req.flash('info', "FAQ successfully deleted");
        } else {
            req.flash('err', "Failed to delete FAQ. Please try again");
        }
        return res.redirect('/admin/faq/list');
    }, function (err) {
        req.flash('err', "Failed to delete FAQ. Please try again");
        return res.redirect('/admin/faq/list');
    });
}