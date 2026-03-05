const nodemailer = require("nodemailer");
const { Resend } = require("resend");
const dns = require("dns").promises;

const resend = new Resend(process.env.RESEND_API_KEY);

async function makeTransporter() {
  const host = process.env.MAIL_HOST; // smtp.gmail.com
  const port = Number(process.env.MAIL_PORT || 587);
  const secure = port === 465;

  // Force IPv4 (évite que Render prenne l’IPv6 de Gmail)
  const { address: ipv4 } = await dns.lookup(host, { family: 4 });

  console.log(
    "[MAIL] SMTP host:",
    host,
    "-> ipv4:",
    ipv4,
    "port:",
    port,
    "secure:",
    secure,
  );

  return nodemailer.createTransport({
    host: ipv4, // connexion en IPv4
    port,
    secure,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },

    // TLS correct même si on se connecte à l’IP
    tls: {
      servername: host,
      rejectUnauthorized: true,
    },

    // stop le “moulinage 2 minutes”
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 10_000,
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
