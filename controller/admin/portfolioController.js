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
    var portfolioTableDetails = await models.Portfolio.findAll({ where: { status: 'Yes' } });
    var adminTableDetails = await models.Admin.findOne({ where: { status: 'Yes' } });
    if (portfolioTableDetails) {
        return res.render('admin/portfolio/list', {
            adminTableDetails: adminTableDetails,
            title: 'Portfolio List',
            arrPortfolioData: portfolioTableDetails,
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')

        });

    } else {
        return res.render('admin/portfolio/list', {
            adminTableDetails: adminTableDetails,
            title: 'Portfolio List',
            arrPortfolioData: '',
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')

        });
    }
}

exports.load = async function (req, res) {
    var portfolio_id = req.params.portfolio_id;
    var portfolioTableDetails = '';
    var adminTableDetails = await models.Admin.findOne({ where: { status: 'Yes' } });
    if (portfolio_id && portfolio_id != undefined) {
        portfolioTableDetails = await models.Portfolio.findOne({ where: { portfolio_id: portfolio_id } });
        return res.render('admin/portfolio/addedit', {
            adminTableDetails: adminTableDetails,
            title: 'Edit Portfolio',
            arrPortfolioData: portfolioTableDetails,
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
        });
    } else {
        return res.render('admin/portfolio/addedit', {
            adminTableDetails: adminTableDetails,
            title: 'Add Portfolio',
            arrPortfolioData: '',
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
        });
    }

}

exports.saveOrUpdate = async function (req, res) {
    var form = new multiparty.Form();
    form.parse(req, async function (err, fields, files) {
        var portfolio_id = fields.form_portfolio_id[0];
        var formImage = files.screen_shot[0].originalFilename;
        if (formImage != '') {
            var ImageExt = formImage.split('.').pop();
            var adminImagewithEXT = Date.now() + files.screen_shot[0] + "." + ImageExt;
            var userFinalImage = adminImagewithEXT.replace("[object Object]", "");
        }

        if (!portfolio_id) {

            models.Portfolio.create({
                name: fields.name[0],
                status: fields.status[0],
                screen_shot: userFinalImage,
                url: fields.url[0],
                type: fields.type[0]
            }).then(function (port_crt) {
                if (port_crt) {
                    if (files.screen_shot[0] != '' && files.screen_shot[0] != null) {
                        helper.createDirectory('public/admin/web-contents/Portfolio/' + port_crt.portfolio_id + '/');
                        var temp_path = files.screen_shot[0].path;
                        var target_path = 'Portfolio/' + port_crt.portfolio_id + '/' + userFinalImage;
                        helper.uploadFiles(temp_path, target_path);
                    }
                    req.flash('info', 'Successfully Created');
                    return res.redirect('/admin/portfolio/' + port_crt.portfolio_id);
                } else {
                    req.flash('errors', 'Something Worng! Please try again.');
                    return res.redirect('back');
                }
            })

        } else {
            var portfolioTableDetails = await models.Portfolio.findOne({ where: { portfolio_id: portfolio_id } });
            var adminOldImage = portfolioTableDetails.screen_shot;
            models.Portfolio.update({
                name: fields.name[0],
                status: fields.status[0],
                url: fields.url[0],
                type: fields.type[0],
                screen_shot: userFinalImage ? userFinalImage : adminOldImage

            }, { where: { portfolio_id: portfolio_id } }).then(function (port_upd) {
                if (port_upd) {
                    if (files.screen_shot[0] != '' && files.screen_shot[0] != null) {
                        helper.createDirectory('public/admin/web-contents/Portfolio/' + portfolio_id + '/');
                        var temp_path = files.screen_shot[0].path;
                        var target_path = 'Portfolio/' + portfolio_id + '/' + userFinalImage;
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

    models.Portfolio.destroy({
        where: {
            portfolio_id: req.params.portfolio_id //this will be your id that you want to delete
        }
    }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
            req.flash('info', "Portfolio successfully deleted");
        } else {
            req.flash('err', "Failed to delete Portfolio. Please try again");
        }
        return res.redirect('/admin/portfolio/list');
    }, function (err) {
        req.flash('err', "Failed to delete Portfolio. Please try again");
        return res.redirect('/admin/portfolio/list');
    });
}