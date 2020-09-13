const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

module.exports = {
  transporter: function createTransporter() {
    var transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true, // upgrade later with STARTTLS
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
    });
    transporter.use(
      "compile",
      hbs({
        viewEngine: "express-handlebars",
        viewPath: process.cwd() + "/email_templates/",
        // layout: false
      })
    );

    return transporter;
  },
};