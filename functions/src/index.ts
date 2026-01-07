// functions/src/index.ts
import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import axios from "axios";
import {defineSecret} from "firebase-functions/params";

// Define secret key
const openaiKey = defineSecret("OPENAI_KEY");

// Export function with secret bound
export const generateDescription = onCall(
  {
    cors: true,
    secrets: [openaiKey],
  },
  async (request) => {
    logger.info("Generating description for image:", request.data.imageUrl);

    const {imageUrl} = request.data;

    if (!imageUrl || typeof imageUrl !== "string") {
      throw new Error("Missing or invalid 'imageUrl'");
    }

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Describe this artwork in one vivid, clear sentence.",
                },
                {
                  type: "image_url",
                  image_url: {url: imageUrl},
                },
              ],
            },
          ],
          max_tokens: 100,
          temperature: 0.7,
        },
        {
          headers: {
            "Authorization": `Bearer ${openaiKey.value()}`,
            "Content-Type": "application/json",
          },
        }
      );

      const description = response.data.choices[0].message.content.trim();
      logger.info("Generated description:", description);
      return {description};
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      logger.error("OpenAI error:", message);
      throw new Error("Failed to generate description");
    }
  }
);
