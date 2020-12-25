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


exports.list = async function(req,res){
    var adminTableDetails = await models.Admin.findAll({where:{status:'Yes'}});
    if(adminTableDetails){
        return res.render('admin/admin_user/list', {
            title:'Admin List',
            arrAdminData : adminTableDetails,
            helper:helper,
            messages: req.flash('info'),
            errors: req.flash('errors')	
        });
    }else{
        return res.render('admin/admin_user/list', {
            title:'Admin List',
            arrAdminData : '',
            helper:helper,
            messages: req.flash('info'),
            errors: req.flash('errors')	
        });
    }    
}

exports.load = async function(req,res){
    var admin_id = req.params.admin_user_id;
    var adminTableDetails ='';
    if(admin_id && admin_id != undefined){
        adminTableDetails = await models.Admin.findOne({where:{admin_id:admin_id}});
        return res.render('admin/admin_user/addedit', {
            title:'Edit admin',
            arrAdminData : adminTableDetails,
            helper:helper,
            messages: req.flash('info'),
            errors: req.flash('errors')	
        });
    }else{        
        return res.render('admin/admin_user/addedit', {
            title:'Add admin',
            arrAdminData : '',
            helper:helper,
            messages: req.flash('info'),
            errors: req.flash('errors')	
        });
    }
    
}

exports.saveOrUpdate = async function(req,res){
    var form = new multiparty.Form();
    form.parse(req,async function(err, fields, files) { 
        var admin_user_id = fields.form_admin_id[0];
        var password = fields.password;
        var hash = bcrypt.hashSync(password);
        var formImage = files.image[0].originalFilename;
        if(formImage !=''){
            var ImageExt = formImage.split('.').pop();
            var adminImagewithEXT = Date.now()+files.image[0]+"."+ImageExt;
            var userFinalImage = adminImagewithEXT.replace("[object Object]", "");
        }
        if(!admin_user_id){
            var checkAdminEmail = await models.Admin.findAll({where:{email:fields.email[0]}});
            if(checkAdminEmail.length == 0){
                models.Admin.create({
                    name : fields.name[0],
                    email : fields.email[0],
                    password : hash,
                    image : userFinalImage,
                    status : fields.status[0]
                }).then(function(admin_crt){
                    if(admin_crt){
                        if(files.image[0] !='' && files.image[0]!=null){
                            helper.createDirectory('public/web-contents/Admin/'+admin_crt.admin_id+'/');
                            var temp_path = files.image[0].path;
                            var target_path = 'Admin/'+admin_crt.admin_id +'/'+ userFinalImage;
                            helper.uploadFiles(temp_path, target_path);
                        }
                        req.flash('info','Successfully Created');
                        return res.redirect('/admin/admin-user/'+admin_crt.admin_id);
                    }else{
                        req.flash('errors','Something Worng! Please try again.');
                        return res.redirect('back');
                    }
                })
            }else{
                req.flash('errors','This email already exist.');
                return res.redirect('back');
            }
        }else{
            var adminTableDetails = await models.Admin.findOne({where:{admin_id:admin_user_id}});
            var adminOldImage = adminTableDetails.image;
            models.Admin.update({
                name : fields.name[0],
                email : fields.email[0],
                // password : hash,
                image : userFinalImage ? userFinalImage : adminOldImage,
                status : fields.status[0]
            },{where:{admin_id:admin_user_id}}).then(function(admin_upd){
                if(admin_upd){
                    if(files.image[0] !='' && files.image[0]!=null){
                        helper.createDirectory('public/web-contents/Admin/'+admin_user_id+'/');
                        var temp_path = files.image[0].path;
                        var target_path = 'Admin/'+admin_user_id +'/'+ userFinalImage;
                        helper.uploadFiles(temp_path, target_path);
                    }
                    req.flash('info','Successfully Updated');
                    return res.redirect('back');
                }else{
                    req.flash('errors','Something Worng! Please try again.');
                    return res.redirect('back');
                }
            })
        }
    })
}


exports.setPassword =  function(req, res, next){
  
    var form = new multiparty.Form();
    var logDetails = req.session.userDetails;
    form.parse(req, async function(err, fields, files) { 
        req.body = fields; 
        var old_password= fields.old_password[0];
        var new_password= fields.new_password[0];
        if(old_password != '' && new_password != '') {
            var user = await models.Admin.findOne({ where: {admin_id:logDetails.admin_id} });
            if(user) {
                if(!bcrypt.compareSync(old_password, user.password)) {
                    req.flash('errors','Old password wrong');	  
                    res.redirect('/admin/dashboard');
                } else {
                    if(old_password == new_password){
                        req.flash('errors','New password can not be the old one');	  
                        res.redirect('/admin/dashboard');
                    } else {
                        var hash = bcrypt.hashSync(fields.new_password);
                        models.Admin.update({ 
                            password: hash,
                            createdBy : logDetails ? logDetails.admin_id : ''     
                        },{where:{admin_id:logDetails.admin_id}}).then(function(no_affected_rows) {
                            if(no_affected_rows > 0) {
                                req.flash('info','Password changed successfully');                                
                                setTimeout(function () {
                                    req.session.destroy();
                                }, 3000);                                
                            } else {
                                req.flash('info','Failed to update password! Please try again.');
                            }
                            res.redirect('/admin/dashboard');
                        }).catch(function(error) {
                            return res.send(error);                            
                        });
                    }
                }
            } else {
                req.flash('errors','Something wrong! Please try again.');	  
                res.redirect('/admin/dashboard');
            }
        } else {
            req.flash('errors','All fields are mendatory!');	  
            res.redirect('back');
        }
    })
            
}

    exports.delete= async function (req, res, next) {
    
        models.Admin.destroy({
            where: {
                admin_id:req.params.admin_user_id //this will be your id that you want to delete
            }
        }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
            if (rowDeleted === 1) {
                req.flash('info', "Admin successfully deleted");
            } else {
                req.flash('err', "Failed to delete Admin. Please try again");
            }
            return res.redirect('/admin/admin-user/list');
        }, function (err) {
            req.flash('err', "Failed to delete Admin. Please try again");
            return res.redirect('/admin/admin-user/list');
        });
    }