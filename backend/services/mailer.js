const nodemailer = require("nodemailer");
const dns = require("dns").promises;

async function resolveIPv4(host) {
  // Prend la première IPv4
  const res = await dns.lookup(host, { family: 4 });
  return res.address;
}

async function makeTransporter() {
  const port = Number(process.env.MAIL_PORT || 587);
  const secure = String(process.env.MAIL_SECURE) === "true"; // false pour 587

  const host = process.env.MAIL_HOST;
  const ipv4 = await resolveIPv4(host);

  console.log("[MAIL] using SMTP host:", host, "=> IPv4:", ipv4);

  return nodemailer.createTransport({
    host: ipv4,
    port,
    secure,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },

    localAddress: "0.0.0.0",

    requireTLS: port === 587,
    tls: {
      rejectUnauthorized: true,
      servername: host,
    },
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
