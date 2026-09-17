import { setResponseStatus } from "h3";

export default defineEventHandler(async (event) => {
  // Parse and validate body
  const body = await readBody<{
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  }>(event);

  const errors: string[] = [];
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
  const text = `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\n\nMessage:\n${message}`;

  try {
    const result = await useResend().emails.send({
      from: "New Haven Ministries <hello@formworkstudios.xyz>",
      to: ["Janellejairam@gmail.com"],
      cc: ["Kathysingh30@gmail.com"],
      bcc: ["mikesynan@gmail.com"],
      subject,
      html,
      text,
    });

    return { status: "sent", result };
  } catch (err: unknown) {
    setResponseStatus(event, 500);
    const message = err instanceof Error ? err.message : "Failed to send email";
    return { status: "error", message };
  }
});

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
