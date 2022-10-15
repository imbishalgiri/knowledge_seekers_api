import nodemailer from "nodemailer";

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

transporter.verify((error) => {
  if (error) {
    console.log("error with email connection");
  }
});

export default transporter;
