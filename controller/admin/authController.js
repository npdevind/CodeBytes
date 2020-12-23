let models = require("../../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");



exports.loadLoginPage = async function(req, res, next) {
    res.render('admin/auth/login', {
        title:"Admin Login | CodesByte",
        s_msg: req.flash('info'),
        e_msg: req.flash('err')
    }); 
}


/**
 * Check login of the admin/operator users
 */
exports.checkLogin = async function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    if(username != '' && password != '') {
        var admin = await models.Admin.findOne({where:{[Op.or]: [{ email: username }, { username: username }],active:"Yes"}});
        if(admin) {
            bcrypt.compare(password, admin.password, function(err, result) {
                if(err) {
                    req.flash('err',"Invalid username and password!");
                    return res.redirect("login");
                } 
                
                if(result) {
                    req.session.admin = admin; 
                    console.log("--->--->---->"+req.session.admin);
                    return res.redirect('dashboard');
                } else {
                    req.flash('err',"Invalid username and password!");
                    return res.redirect("login");
                }
            });
        } else {
            req.flash('err',"Invalid username and password!");
            return res.redirect("login");
        }
    } else {
        req.flash('err',"All fields are mandatory");
        return res.redirect("login");
    }
}



/**
 * Logout admin from the system and destroy session
 */
exports.logout = function(req, res, next) {
    //sess = req.session;
    
    req.session.destroy(function(err) {
        if(err){
            msg = 'Error destroying session';
            res.json(msg);
        }else{
            msg = 'Session destroy successfully';
            console.log(msg)
            return res.redirect('/admin/login');
        }
    });
}
