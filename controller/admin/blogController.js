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
    var blogTableDetails = await models.Blog.findAll();
    var adminTableDetails = await models.Admin.findOne({ where: { status: 'Yes' } });
    if (blogTableDetails) {
        return res.render('admin/blog/list', {
            adminTableDetails: adminTableDetails,
            title: 'Blog List',
            arrBlogData: blogTableDetails,
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')

        });

    } else {
        return res.render('admin/blog/list', {
            adminTableDetails: adminTableDetails,
            title: 'Blog List',
            arrBlogData: '',
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')

        });
    }
}

exports.load = async function (req, res) {
    var blog_id = req.params.blog_id;
    var blogTableDetails = '';
    var adminTableDetails = await models.Admin.findOne({ where: { status: 'Yes' } });
    if (blog_id && blog_id != undefined) {
        blogTableDetails = await models.Blog.findOne({ where: { blog_id: blog_id } });
        return res.render('admin/blog/addedit', {
            adminTableDetails: adminTableDetails,
            title: 'Edit Blog',
            arrBlogData: blogTableDetails,
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
        });
    } else {
        return res.render('admin/blog/addedit', {
            adminTableDetails: adminTableDetails,
            title: 'Add Blog',
            arrBlogData: '',
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
        });
    }

}

exports.saveOrUpdate = async function (req, res) {
    var form = new multiparty.Form();
    form.parse(req, async function (err, fields, files) {
        var blog_id = fields.form_blog_id[0];

        if (!blog_id) {

            models.Blog.create({
                category_id: fields.category_id[0],
                title: fields.title[0],
                description: fields.description[0],
                content: fields.content[0],
                status: fields.status[0]
            }).then(function (blog_crt) {
                if (blog_crt) {
                    req.flash('info', 'Successfully Created');
                    return res.redirect('/admin/blog/' + blog_crt.blog_id);
                } else {
                    req.flash('errors', 'Something Worng! Please try again.');
                    return res.redirect('back');
                }
            })

        } else {
            models.Blog.update({
                category_id: fields.category_id[0],
                title: fields.title[0],
                description: fields.description[0],
                content: fields.content[0],
                status: fields.status[0]

            }, { where: { blog_id: blog_id } }).then(function (blog_upd) {
                if (blog_upd) {
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

    models.Blog.destroy({
        where: {
            blog_id: req.params.blog_id //this will be your id that you want to delete
        }
    }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
            req.flash('info', "Blog successfully deleted");
        } else {
            req.flash('err', "Failed to delete Blog. Please try again");
        }
        return res.redirect('/admin/blog/list');
    }, function (err) {
        req.flash('err', "Failed to delete Blog. Please try again");
        return res.redirect('/admin/blog/list');
    });
}