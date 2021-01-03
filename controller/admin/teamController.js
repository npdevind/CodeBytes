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
    var teamTableDetails = await models.Team.findAll({ where: { status: 'Yes' } });
    var adminTableDetails = await models.Admin.findOne({ where: { status: 'Yes' } });
    if (teamTableDetails) {
        return res.render('admin/team/list', {
            adminTableDetails: adminTableDetails,
            title: 'Team List',
            arrTeamData: teamTableDetails,
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')

        });

    } else {
        return res.render('admin/team/list', {
            adminTableDetails: adminTableDetails,
            title: 'Team List',
            arrTeamData: '',
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')

        });
    }
}

exports.load = async function (req, res) {
    var team_id = req.params.team_id;
    var teamTableDetails = '';
    var adminTableDetails = await models.Admin.findOne({where:{status:'Yes'}});
    if (team_id && team_id != undefined) {
        teamTableDetails = await models.Team.findOne({ where: { team_id: team_id } });
        return res.render('admin/team/addedit', {
            adminTableDetails:adminTableDetails,
            title: 'Edit Team',
            arrTeamData: teamTableDetails ? teamTableDetails : '',
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
        });
    } else {
        return res.render('admin/team/addedit', {
            adminTableDetails:adminTableDetails,
            title: 'Add Team',
            arrTeamData: '',
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
        });
    }
}

exports.saveOrUpdate = async function (req, res) {
    var form = new multiparty.Form();
    form.parse(req, async function (err, fields, files) {
        var team_id = fields.form_team_id[0];
        var formImage = files.dp[0].originalFilename;
        if (formImage != '') {
            var ImageExt = formImage.split('.').pop();
            var adminImagewithEXT = Date.now() + files.dp[0] + "." + ImageExt;
            var userFinalImage = adminImagewithEXT.replace("[object Object]", "");
        }

        if (!team_id) {
          
                models.Team.create({
                    team_title: fields.team_title[0],
                    name: fields.name[0],
                    position: fields.position[0],
                    status: fields.status[0],
                    fb_id: fields.fb_id[0],
                    insta_id: fields.insta_id[0],
                    twitter_id: fields.twitter_id[0],
                    linkdin_id: fields.linkdin_id[0],
                    dp: userFinalImage
                }).then(function (team_crt) {
                    if (team_crt) {
                        if (files.dp[0] != '' && files.dp[0] != null) {
                            helper.createDirectory('public/admin/web-contents/Team/' + team_crt.team_id + '/');
                            var temp_path = files.dp[0].path;
                            var target_path = 'Team/' + team_crt.team_id + '/' + userFinalImage;
                            helper.uploadFiles(temp_path, target_path);
                        }
                        req.flash('info', 'Successfully Created');
                        return res.redirect('/admin/team/' + team_crt.team_id);
                    } else {
                        req.flash('errors', 'Something Worng! Please try again.');
                        return res.redirect('back');
                    }
                })
           
        } else {
            var teamTableDetails = await models.Team.findOne({ where: { team_id: team_id } });
            var adminOldImage = teamTableDetails.dp;
            models.Team.update({
                    team_title: fields.team_title[0],
                    name: fields.name[0],
                    position: fields.position[0],
                    status: fields.status[0],
                    fb_id: fields.fb_id[0],
                    insta_id: fields.insta_id[0],
                    twitter_id: fields.twitter_id[0],
                    linkdin_id: fields.linkdin_id[0],
                    dp : userFinalImage ? userFinalImage : adminOldImage,
            }, { where: { team_id: team_id } }).then(function (team_upd) {
                if (team_upd) {
                    if (files.dp[0] != '' && files.dp[0] != null) {
                        helper.createDirectory('public/admin/web-contents/Team/' + team_id + '/');
                        var temp_path = files.dp[0].path;
                        var target_path = 'Team/' + team_id + '/' + userFinalImage;
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

    models.Team.destroy({
        where: {
            team_id: req.params.team_id //this will be your id that you want to delete
        }
    }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
            req.flash('info', "Team successfully deleted");
        } else {
            req.flash('err', "Failed to delete Team. Please try again");
        }
        return res.redirect('/admin/team/list');
    }, function (err) {
        req.flash('err', "Failed to delete Team. Please try again");
        return res.redirect('/admin/team/list');
    });
}