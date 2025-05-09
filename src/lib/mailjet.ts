import { Client } from "node-mailjet";

let mailjetClientInstance: Client | null = null;

/**
 * Returns a singleton instance of the Mailjet client.
 * Retrieves API key and secret from environment variables.
 * Throws an error if credentials are not found.
 */
export const getMailjetClient = (): Client => {
  if (!mailjetClientInstance) {
    const apiKey = process.env.MAILJET_API_KEY;
    const apiSecret = process.env.MAILJET_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error(
        "Mailjet API key or secret not found in environment variables."
      );
    }

    mailjetClientInstance = new Client({
      apiKey: apiKey,
      apiSecret: apiSecret,
    });
  }
  return mailjetClientInstance;
};
