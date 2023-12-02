const nodemailer = require('nodemailer');
const {  response } = require('express');


const setPassword = async(email_id, link) => {
    try{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_user,
              pass: process.env.EMAIL_PASS
            }
          });
          
          let mailOptions = {
            from: 'lizipersia11@gmail.com',
            to: email_id,
            subject: 'FxRetail Password change',
            text: `Click the link to reset your password \n ${link}`
          };
          
          return transporter.sendMail(mailOptions);
           
        
    }catch(e){
         return console.log("Error at sending email",e);
        
    }
}

const changePassword_Success = async(email_id) => {
  // console.log("email_id",email_id)
    try{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_user,
              pass: process.env.EMAIL_PASS
            }
          });
          
          let mailOptions = {
            from: 'lizipersia11@gmail.com',
            to: email_id,
            subject: 'Your account was recovered successfully',
            text: 'Welcome back to your account. \n If you suspect you were locked out of your account because of changes made by someone else, you should'
          };
          
          return transporter.sendMail(mailOptions);
           
        
    }catch(e){
         return console.log("Error at sending email",e);
        
    }
}


module.exports = setPassword;

