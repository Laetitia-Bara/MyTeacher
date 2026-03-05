const nodemailer = require("nodemailer");
const dns = require("dns").promises;
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function makeTransporter() {
  const host = process.env.MAIL_HOST;
  const port = Number(process.env.MAIL_PORT || 587);
  const secure = port === 465;

  const { address: ipv4 } = await dns.lookup(host, { family: 4 });

  return nodemailer.createTransport({
    host: ipv4,
    port,
    secure,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
    tls: { servername: host, rejectUnauthorized: true },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
  });
}

async function sendInviteEmail({ to, inviteLink, teacherLabel }) {
  const subject = "Invitation MyTeacher";
  const text =
    `Bonjour,\n\n` +
    `${teacherLabel || "Un professeur"} t'invite à rejoindre MyTeacher.\n` +
    `Pour créer ton compte élève, clique ici :\n${inviteLink}\n\n` +
    `À bientôt !\n`;

  // 1) SMTP (best effort)
  try {
    const transporter = await makeTransporter();
    await transporter.verify();
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      text,
    });
    return { provider: "smtp", info };
  } catch (e) {
    console.error("[MAIL] SMTP failed -> fallback Resend:", e?.message || e);
  }

  // 2) Resend fallback
  const from =
    process.env.MAIL_FROM_RESEND || "MyTeacher <onboarding@resend.dev>";
  const r = await resend.emails.send({ from, to, subject, text });
  return { provider: "resend", info: r };
}

module.exports = { sendInviteEmail };
