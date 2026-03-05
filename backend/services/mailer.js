const nodemailer = require("nodemailer");

function makeTransporter() {
  const port = Number(process.env.MAIL_PORT || 587);
  const secure = String(process.env.MAIL_SECURE) === "true"; // false pour 587

  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port,
    secure,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS, // app password
    },
    requireTLS: !secure, // important avec 587
    tls: {
      // en prod on refuse les certifs douteux
      rejectUnauthorized: true,
      servername: process.env.MAIL_HOST,
    },
  });
}

async function sendInviteEmail({ to, inviteLink, teacherLabel }) {
  const transporter = makeTransporter();

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
