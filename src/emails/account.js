const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'velimir.patrnogic@gmail.com',
        subject: 'Thanks for joining',
        text: `Welcome to the app ${name}. Let me know how you get along with the app.`
    })  
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'velimir.patrnogic@gmail.com',
        subject: 'We are sorry to se you leave :(',
        text: `Goodbye, ${name}. Tell us what went wrong so we can make things better. We will be glad to see you again.`
    })
}


module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}