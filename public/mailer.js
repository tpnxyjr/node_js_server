var myConfig = require('../config.js');
var fs = require('fs');
'use strict';
const nodemailer = require("nodemailer");


function mail(file, custid){

    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: myConfig.mail_user,
            pass: myConfig.mail_password
        },
        tls:{
            rejectUnauthorized: false
        }
    });

    var mailOptions = {
        from: "CBC - Auto Email", // sender address
        to: "CBC.PAULH@gmail.com", // list of receivers
        subject: "ORDER FROM "+ custid, // Subject line
        text: 'New Order From '+custid, // plain text body
        //html: buffer, // html body
        attachments: [{
            filename: 'automated order',
            path: file,
            contentType: 'application/pdf'
        }]
    };


    transporter.sendMail(mailOptions, function(error, response){
        if(error){
            console.log("send mail error");
            console.log(error);
        }else{
            //console.log("Message sent");
            fs.unlinkSync(file);
        }

    });
}

module.exports.mail = mail;