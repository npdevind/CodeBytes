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
    var blogcatTableDetails = await models.BlogCategory.findAll({ where: { status: 'Yes' } });
    var adminTableDetails = await models.Admin.findOne({ where: { status: 'Yes' } });
    if (blogcatTableDetails) {
        return res.render('admin/blog_category/list', {
            adminTableDetails: adminTableDetails,
            title: 'BlogCat List',
            arrBlogCatData: blogcatTableDetails,
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')

        });

    } else {
        return res.render('admin/blog_category/list', {
            adminTableDetails: adminTableDetails,
            title: 'BlogCat List',
            arrBlogCatData: '',
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')

        });
    }
}

exports.load = async function (req, res) {
    var blg_cat_id = req.params.blg_cat_id;
    var blogcatTableDetails = '';
    var adminTableDetails = await models.Admin.findOne({ where: { status: 'Yes' } });
    if (blg_cat_id && blg_cat_id != undefined) {
        blogcatTableDetails = await models.BlogCategory.findOne({ where: { blg_cat_id: blg_cat_id } });
        return res.render('admin/blog_category/addedit', {
            adminTableDetails: adminTableDetails,
            title: 'Edit BlogCat',
            arrBlogCatData: blogcatTableDetails,
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
        });
    } else {
        return res.render('admin/blog_category/addedit', {
            adminTableDetails: adminTableDetails,
            title: 'Add BlogCat',
            arrBlogCatData: '',
            helper: helper,
            messages: req.flash('info'),
            errors: req.flash('errors')
        });
    }

}

exports.saveOrUpdate = async function (req, res) {
    var form = new multiparty.Form();
    form.parse(req, async function (err, fields, files) {
        var blg_cat_id = fields.form_blg_cat_id[0];
        var formImage = files.image[0].originalFilename;
        if (formImage != '') {
            var ImageExt = formImage.split('.').pop();
            var adminImagewithEXT = Date.now() + files.image[0] + "." + ImageExt;
            var userFinalImage = adminImagewithEXT.replace("[object Object]", "");
        }

        if (!blg_cat_id) {

            models.BlogCategory.create({
                title: fields.title[0],
                status: fields.status[0],
                image: userFinalImage
            }).then(function (blgcat_crt) {
                if (blgcat_crt) {
                    if (files.image[0] != '' && files.image[0] != null) {
                        helper.createDirectory('public/admin/web-contents/catgory_blog/' + blgcat_crt.blg_cat_id + '/');
                        var temp_path = files.image[0].path;
                        var target_path = 'catgory_blog/' +blgcat_crt.blg_cat_id + '/' + userFinalImage;
                        helper.uploadFiles(temp_path, target_path);
                    }
                    req.flash('info', 'Successfully Created');
                    return res.redirect('/admin/blog_category/' + blgcat_crt.blg_cat_id);
                } else {
                    req.flash('errors', 'Something Worng! Please try again.');
                    return res.redirect('back');
                }
            })

        } else {
            var blogcatTableDetails = await models.BlogCategory.findOne({ where: { blg_cat_id: blg_cat_id } });
            var blogcatOldImage = blogcatTableDetails.image;

            models.BlogCategory.update({
                title: fields.title[0],
                status: fields.status[0],
                image: userFinalImage ? userFinalImage : blogcatOldImage

            }, { where: { blg_cat_id: blg_cat_id } }).then(function (blogcat_upd) {
                if (blogcat_upd) {
                    if (files.image[0] != '' && files.image[0] != null) {
                        helper.createDirectory('public/admin/web-contents/catgory_blog/' + blogcat_upd.blg_cat_id + '/');
                        var temp_path = files.image[0].path;
                        var target_path = 'catgory_blog/' + blg_cat_id + '/' + userFinalImage;
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

    models.BlogCategory.destroy({
        where: {
            blg_cat_id: req.params.blg_cat_id //this will be your id that you want to delete
        }
    }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
            req.flash('info', "Blog Category successfully deleted");
        } else {
            req.flash('err', "Failed to delete Blog Category. Please try again");
        }
        return res.redirect('/admin/blog_category/list');
    }, function (err) {
        req.flash('err', "Failed to delete Blog Category. Please try again");
        return res.redirect('/admin/blog_category/list');
    });
}