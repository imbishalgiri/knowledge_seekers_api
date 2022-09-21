import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const hostname = "smtp.cloudmta.net";
const username = "jack9626495@gmail.com";
const password = "urncnfyaevmxpfsg";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: username,
    pass: password,
  },
  logger: true,
});

export default transporter;
