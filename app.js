const express = require("express");
const { Router } = require("express");
const cors = require('cors')
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const transporter = require("./config/mailer");
require("dotenv").config();
const { PORT, EMAIL } = process.env;
const app = express();

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// Error catching endware.
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

const router = Router();
router.use(cors())
app.use(express.json());
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))



app.post("/send", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    await transporter.sendMail({
      from: `"${name}" <${EMAIL}>`,
      to: EMAIL,
      subject: `${subject}📋`,
      html: `
        <h3>Message from ${email}</h3>
        <p>${message}</p>
      `,
    });
    res.status(200).send("Email sent");
  } catch (error) {
    res.status(500).send("Error sending email");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
