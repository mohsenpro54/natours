/*eslint-disable*/
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
// const { convert } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Bedhief Mohsen <${process.env.EMAIL_FROM}>`;
  }
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      /// sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  // send the actuel email
  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) defind the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };
    /// 3) create a transport and email
    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send('Welcome', 'Welcome to the Natours family!');
  }
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      ' your password reset token (valid for 10 minutes !)'
    );
  }
};
