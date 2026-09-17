import { d as defineEventHandler, r as readBody, s as setResponseStatus, u as useResend } from '../../nitro/nitro.mjs';
import 'resend';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue';
import 'consola';
import '@iconify/utils';
import 'better-sqlite3';
import 'node:url';
import 'ipx';

const contact_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const errors = [];
  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();
  const message = (body.message || "").trim();
  if (!name || name.length < 2) errors.push("Please provide your name.");
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRe.test(email))
    errors.push("Please provide a valid email address.");
  if (!message || message.length < 10)
    errors.push("Please include a brief message (at least 10 characters).");
  if (errors.length) {
    setResponseStatus(event, 400);
    return { status: "validation_error", errors };
  }
  const subject = `New Inquiry from ${name}`;
  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${phone ? escapeHtml(phone) : "Not provided"}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
  `;
  const text = `New Contact Form Submission

Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}

Message:
${message}`;
  try {
    const result = await useResend().emails.send({
      from: "New Haven Ministries <hello@formworkstudios.xyz>",
      to: ["Janellejairam@gmail.com"],
      cc: ["Kathysingh30@gmail.com"],
      bcc: ["mikesynan@gmail.com"],
      subject,
      html,
      text
    });
    return { status: "sent", result };
  } catch (err) {
    setResponseStatus(event, 500);
    const message2 = err instanceof Error ? err.message : "Failed to send email";
    return { status: "error", message: message2 };
  }
});
function escapeHtml(input) {
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
}

export { contact_post as default };
//# sourceMappingURL=contact.post.mjs.map
