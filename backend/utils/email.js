const nodemailer = require("nodemailer");

const createTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error("Le service e-mail n'est pas configuré. Renseignez SMTP_HOST, SMTP_USER et SMTP_PASS dans le fichier .env.");
  }

  const port = Number(SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
};

const escapeHtml = (value = "") => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

const sendProjectInvitation = async ({ to, projectName, invitationUrl, role }) => {
  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || `Task Management <${process.env.SMTP_USER}>`;
  const safeProjectName = escapeHtml(projectName);
  const safeUrl = escapeHtml(invitationUrl);
  const roleLabel = role === "modification" ? "modification" : "lecture";

  return transporter.sendMail({
    from,
    to,
    subject: `Invitation au projet ${projectName}`,
    text: `Vous êtes invité(e) à rejoindre le projet « ${projectName} » avec un accès en ${roleLabel}. Créez votre compte ou connectez-vous avec cette adresse e-mail pour accepter l'invitation : ${invitationUrl}\n\nCe lien expire dans 7 jours.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1f2937"><h1 style="color:#0f766e">Vous êtes invité(e) !</h1><p>Vous êtes invité(e) à rejoindre le projet <strong>${safeProjectName}</strong> avec un accès en ${roleLabel}.</p><p>Créez votre compte ou connectez-vous avec cette adresse e-mail pour rejoindre le projet :</p><p><a href="${safeUrl}" style="display:inline-block;background:#0f766e;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px">Rejoindre le projet</a></p><p style="font-size:13px;color:#6b7280">Ce lien expire dans 7 jours. Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>${safeUrl}</p></div>`,
  });
};

module.exports = { sendProjectInvitation };
