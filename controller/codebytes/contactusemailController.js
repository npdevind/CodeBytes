const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

var name;
var to;
var subject;
var message;



exports.email = async function (req, res) {

    name = req.body.name;
    to = req.body.to;
    subject = req.body.subject;
    message = req.body.message;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'swarupdey163@gmail.com',
            pass: 'Tinni@74320'
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
        } else {
            console.log('Email sent: ' + info.response);
        }
    });


}
