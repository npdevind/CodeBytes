const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

var name;
var to;
var subject;
var message;



exports.email = async function (req, res) {

    name = req.body.sender_name;
    to = req.body.sender_to;
    subject = req.body.sender_subject;
    message = req.body.sender_message;
    //return console.log("name : "+name +","+"to :"+to+","+"subject :"+subject+","+"message :"+message);

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'npdevind@gmail.com',
            pass: '#archana123'
        }
    });

    var mailOptions = {
        from: 'bapandey185@gmail.com',
        to: to,
        subject: "#" + name + " - " + subject,
        text: message,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.send({
                success: true,
                msg : "Something worng! Please try again."
            })
        } else {
            console.log('Email sent: ' + info.response);
            res.send({
                success: true,
                msg : "Email send successfully."
            })
        }
    });


}
