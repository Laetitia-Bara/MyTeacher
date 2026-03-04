const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT || 587),
  secure: process.env.MAIL_SECURE === "true",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    // DEV ONLY: autoriser le certificat “self-signed”
    rejectUnauthorized: process.env.NODE_ENV === "production",
  },
});

async function sendInviteEmail({ to, inviteLink, teacherLabel }) {
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

module.exports = { sendInviteEmail };
