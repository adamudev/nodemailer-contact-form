const express = require("express");
const nodemailer = require("nodemailer");
const port = 8000;

const app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/assets"));

// Root Route with main profiule
app.get("/", (req, res) => {
  res.render("home", { msg: "Message Sent" });
});

app.post("/send", (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${req.body.fullname}</li>
      <li>Email: ${req.body.email}</li>
      <li>Subject: ${req.body.subject}</li>
    </ul>
    <h3>Message:</h3>
    <p>${req.body.message}</p>
  `;

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "<mail@your-domain.tld>", // incoming/outgoing server name
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "<your-email@your-domain.tld>", // your email
        pass: "<password>!!", // your password
      },
      // Add this line if you are running this from a localhost
      tls: {
        rejectUnauthorized: false,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Nodemailer Contact" <hi@adamu.me>', // sender address
      to: `adamudev@gmail.com, ${req.body.email}`, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: output, // html body
    });

    res.render("home", { msg: "Message Sent" });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }

  main().catch(console.error);
});

app.listen(port, () => {
  console.log(`Server is running on port no: ${port}`);
});
