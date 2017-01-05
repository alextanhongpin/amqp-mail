// email-factory.js
const path = require('path');
const nodemail = require('email-transporter')({
    agent: require('nodemailer'),
    config: require('../config/_main.js').smtp,
    template: require('email-templates').EmailTemplate
});

const EmailTemplate = require('email-templates').EmailTemplate;

function sendInvitationEmail(options, body) {
    const templateDir = path.join(__dirname, '..', 'template', 'invite')
    return nodemail.template({
        dir: templateDir,
        // The data that will be populated in the template
        data: {
            name: body.name,
            surname: body.surname,
            id: body.id,
        },
        from: options.from,
        to: options.to, 
        subject: options.subject,
    });
}


module.exports = {
    send: sendInvitationEmail
}