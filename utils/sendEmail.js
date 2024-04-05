const nodeMailer=require('nodemailer')
require('dotenv').config({path:"backend/config/.env"})

exports.sendEmail=async (options)=>{
    const transporter=nodeMailer.createTransport({
        service:process.env.MAIL_SERVICE,
        auth:{
            user:process.env.MAIL,
            pass:process.env.MAIL_PASS
        }
    })
    const mailOptions={
        from:process.env.MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
    }

    await transporter.sendMail(mailOptions);
}