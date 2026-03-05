const nodemailer = require("nodemailer");
const { Resend } = require("resend");
const dns = require("dns").promises;

const resend = new Resend(process.env.RESEND_API_KEY);

async function makeTransporter() {
  const host = process.env.MAIL_HOST;
  const port = Number(process.env.MAIL_PORT || 587);

  // 465 => secure true, sinon false
  const secure = port === 465;

  console.log(
    "[MAIL] using SMTP host:",
    host,
    "port:",
    port,
    "secure:",
    secure,
  );

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    requireTLS: port === 587,
  });
}

async function sendInviteEmail({ to, inviteLink, teacherLabel }) {
  console.log("[MAIL] sending to:", to);

  const transporter = await makeTransporter();

  const subject = "Invitation MyTeacher";
  const text =
    `Bonjour,\n\n` +
    `${teacherLabel || "Un professeur"} t'invite à rejoindre MyTeacher.\n` +
    `Pour créer ton compte élève, clique ici :\n${inviteLink}\n\n` +
    `À bientôt !\n`;

  return transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    text,
  });
}

async function verifyMailer() {
  const transporter = await makeTransporter();
  await transporter.verify();
  console.log("[MAIL] transporter verified OK");
}

module.exports = { sendInviteEmail, verifyMailer };
