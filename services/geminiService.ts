
import { GoogleGenAI, Type } from '@google/genai';
import type { GeneratedPrompt, Settings } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const promptSchema = {
  type: Type.OBJECT,
  properties: {
    category: {
      type: Type.STRING,
      description: 'The category of the prompt. Must be one of: Strategy, Creative Copy, Technical Spec, Social Hooks, Image Prompt.',
    },
    purpose: {
      type: Type.STRING,
      description: 'A brief, one-sentence explanation of what this specific prompt is designed to achieve.',
    },
    tokensHint: {
      type: Type.STRING,
      description: 'A technical hint for the model about the desired token count for the *input* prompt itself, e.g., "Tokens: ~150".',
    },
    expectedOutputSize: {
      type: Type.STRING,
      description: 'A hint about the expected size of the *output* from GPT-5, e.g., "Output: Medium (2-3 paragraphs)".',
    },
    prompt: {
      type: Type.STRING,
      description: 'The full, meticulously crafted prompt text for GPT-5, formatted within a code block.',
    },
  },
  required: ['category', 'purpose', 'tokensHint', 'expectedOutputSize', 'prompt'],
};

export const generateMarketingPrompts = async (idea: string, settings: Settings): Promise<GeneratedPrompt[]> => {
  const { temperature, selectedCategories } = settings;

  const categoryList = selectedCategories.join(', ');
  const instructionVerb = selectedCategories.length === 1 ? 'a single, highly-optimized prompt' : `${selectedCategories.length} distinct, highly-optimized prompts`;

  // FIX: Escaped backticks inside template literal to avoid parsing errors.
  const systemInstruction = `
You are a 'Marketerz Prompt Engineer', an expert in crafting meticulous and effective prompts for advanced AI models like GPT-5.
Your goal is to transform a user's raw marketing idea into ${instructionVerb}.
Each prompt must target a different output category from the following list: ${categoryList}.

The available categories are:
1.  **Strategy:** For generating a high-level marketing plan or strategic document.
2.  **Creative Copy:** For generating advertising copy, headlines, or brand messaging.
3.  **Technical Spec:** For outlining the technical requirements of a digital asset, like a landing page or app feature.
4.  **Social Hooks:** For creating short, engaging social media posts or video hooks.
5.  **Image Prompt:** For generating a detailed prompt for an image generation model (e.g., Midjourney, DALL-E).

For each of the requested prompts, you MUST provide:
- The \`category\` of the prompt.
- A \`purpose\` statement.
- A \`tokensHint\` for the input prompt's length.
- An \`expectedOutputSize\` for the generated content.
- The final \`prompt\` itself, which should be detailed, clear, and structured for optimal AI performance.

The tone of your output must be meticulous and technical. You must adhere strictly to the provided JSON schema.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Here is the user's idea: [[${idea}]]`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema:  selectedCategories.length === 1 ? promptSchema : {
          type: Type.ARRAY,
          items: promptSchema,
        },
        temperature: temperature,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("Received an empty response from the API.");
    }
    let parsedResponse = JSON.parse(jsonText);

    // If a single object is returned (as expected when one category is selected), wrap it in an array for consistent handling.
    if (selectedCategories.length === 1 && !Array.isArray(parsedResponse)) {
        parsedResponse = [parsedResponse];
    }

    // Basic validation
    if (!Array.isArray(parsedResponse)) {
      throw new Error("API response is not a valid array of prompts.");
    }
    
    return parsedResponse as GeneratedPrompt[];

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the generative AI model. Please check your connection or API key.");
  }
};

export const generateSinglePrompt = async (idea: string, category: string): Promise<GeneratedPrompt> => {
  const systemInstruction = `
You are a 'Marketerz Prompt Engineer', an expert in crafting meticulous and effective prompts for advanced AI models like GPT-5.
Your goal is to transform a user's raw marketing idea into a SINGLE, highly-optimized prompt for the specified category: "${category}".

The prompt must target the output category: **${category}**
- **Strategy:** For generating a high-level marketing plan or strategic document.
- **Creative Copy:** For generating advertising copy, headlines, or brand messaging.
- **Technical Spec:** For outlining the technical requirements of a digital asset, like a landing page or app feature.
- **Social Hooks:** For creating short, engaging social media posts or video hooks.
- **Image Prompt:** For generating a detailed prompt for an image generation model (e.g., Midjourney, DALL-E).

You MUST provide:
- The \`category\` of the prompt, which must be "${category}".
- A \`purpose\` statement.
- A \`tokensHint\` for the input prompt's length.
- An \`expectedOutputSize\` for the generated content.
- The final \`prompt\` itself, which should be detailed, clear, and structured for optimal AI performance.

The tone of your output must be meticulous and technical. You must adhere strictly to the provided JSON schema for a single prompt object.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Here is the user's idea: [[${idea}]]`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: promptSchema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("Received an empty response from the API for single prompt regeneration.");
    }
    const parsedResponse = JSON.parse(jsonText);
    
    if (!parsedResponse || typeof parsedResponse !== 'object' || !parsedResponse.category) {
        throw new Error("API response is not a valid prompt object.");
    }
    
    return parsedResponse as GeneratedPrompt;

  } catch (error) {
    console.error(`Error regenerating prompt for category ${category}:`, error);
    throw new Error(`Failed to regenerate prompt for ${category}. Please try again.`);
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image?.imageBytes) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return base64ImageBytes;
    } else {
      throw new Error("No image was generated by the API.");
    }
  } catch (error) {
    console.error("Error calling Gemini Image API:", error);
    throw new Error("Failed to communicate with the image generation model.");
  }
};
