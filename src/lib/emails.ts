import { sendEmail } from "@/services/EmailService";

export async function sendWelcomeEmail(
  email: string,
  username: string
): Promise<void> {
  const subject = "Welcome to Our Service!";
  const templateName = "welcome";
  const context = { username: username };

  try {
    const emailSent = await sendEmail(email, subject, templateName, context);
    if (!emailSent) {
      console.error(`Failed to send welcome email to ${email}`);
    } else {
      console.log(`Welcome email sent successfully to ${email}`);
    }
  } catch (emailError) {
    // Correctly define emailError here
    console.error(`Error sending welcome email to ${email}:`, emailError);
  }
}
