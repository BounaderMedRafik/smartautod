import { Client, SendEmailV3_1, LibraryResponse } from "node-mailjet";
import { getMailjetClient } from "@/lib/mailjet";
import fs from "fs/promises"; // Use promises API for async file reading
import path from "path";

// Read sender details from environment variables
const SENDER_EMAIL = process.env.MAILJET_SENDER_EMAIL;
const SENDER_NAME = process.env.MAILJET_SENDER_NAME;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"; // Fallback URL

/**
 * Reads an email template, interpolates context data, and returns the HTML content.
 * @param templateName - The name of the template file (without extension) in src/templates/email.
 * @param context - An object containing data to replace placeholders in the template.
 * @returns A promise that resolves to the interpolated HTML string.
 */
const readAndInterpolateTemplate = async (
  templateName: string,
  context: Record<string, string>
): Promise<string> => {
  const filePath = path.join(
    process.cwd(),
    "src",
    "templates",
    "email",
    `${templateName}.html`
  );

  try {
    let htmlContent = await fs.readFile(filePath, "utf-8");

    // Add common context variables
    const fullContext = {
      ...context,
      appUrl: APP_URL,
      year: new Date().getFullYear().toString(),
    };

    // Replaces template {{var}} with context value
    Object.entries(fullContext).forEach(([key, value]) => {
      const regex = new RegExp(`{{\s*${key}\s*}}`, "g");
      htmlContent = htmlContent.replace(regex, value);
    });

    return htmlContent;
  } catch (error) {
    console.error(
      `Error reading or interpolating email template ${templateName}:`,
      error
    );
    throw new Error(`Failed to process email template: ${templateName}`);
  }
};

/**
 * Sends an email using a template and context data via the Mailjet client.
 *
 * @param toEmail - The recipient's email address.
 * @param subject - The subject line of the email.
 * @param templateName - The name of the HTML template file (without extension) in src/templates/email.
 * @param context - Data to be injected into the template placeholders.
 * @returns A promise that resolves to true if the email was sent successfully, false otherwise.
 */
export const sendEmail = async (
  toEmail: string,
  subject: string,
  templateName: string,
  context: Record<string, string> // Changed from htmlMessage
): Promise<boolean> => {
  if (!SENDER_EMAIL || !SENDER_NAME) {
    console.error(
      "Mailjet sender email or name not configured in environment variables."
    );
    return false;
  }

  try {
    // Get the HTML content from the template
    const htmlMessage = await readAndInterpolateTemplate(templateName, context);

    const mailjet: Client = getMailjetClient();

    const data: SendEmailV3_1.Body = {
      Messages: [
        {
          From: {
            Email: SENDER_EMAIL,
            Name: SENDER_NAME,
          },
          To: [{ Email: toEmail }],
          Subject: subject,
          HTMLPart: htmlMessage,
          // You might want a plain text version too for clients that don't render HTML
          // TextPart: generateTextPartFromHtml(htmlMessage) // Implement this if needed
        },
      ],
    };

    const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
      .post("send", { version: "v3.1" })
      .request(data);

    console.log("Mailjet send result status:", result.body.Messages[0]?.Status); // Log status

    const messageResult = result.body.Messages[0];
    if (messageResult?.Status !== "success") {
      console.error("Mailjet sending error details:", messageResult?.Errors);
    }
    return messageResult?.Status === "success";
  } catch (err) {
    console.error(
      `Error sending email template ${templateName} via Mailjet:`,
      err
    );
    return false;
  }
};
