const cron = require('node-cron')
const express = require('express')
const nodeMailer = require('nodemailer')
require('dotenv').config()
const app = express()


async function main() {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodeMailer.createTransport({
  	service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" asylturatbek@gmail.com', // sender address
    to: "abubakrsalahuddin@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>" // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodeMailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// main().catch(console.error);

cron.schedule('* * * * *', () => {
  console.log('send email already, the next email is after a minute');
  main().catch(console.error);
});

app.listen(8000, ()=> {
	console.log('listening to port 8000..')
})
