import { GoogleGenAI, Modality } from "@google/genai";
import { ImageFile } from '../types';

export const generateFittingImage = async (
  personImage: ImageFile,
  topImage: ImageFile,
  bottomImage: ImageFile
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const personImagePart = {
    inlineData: {
      data: personImage.base64,
      mimeType: personImage.mimeType,
    },
  };

  const topImagePart = {
    inlineData: {
      data: topImage.base64,
      mimeType: topImage.mimeType,
    },
  };

  const bottomImagePart = {
    inlineData: {
      data: bottomImage.base64,
      mimeType: bottomImage.mimeType,
    },
  };

  const textPart = {
    text: `Take the top from the second image and the bottom from the third image and place them on the person in the first image. The output should be a photorealistic image of the person wearing both the top and the bottom. The background should be clean and simple.`,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [personImagePart, topImagePart, bottomImagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    throw new Error("No image data found in the API response.");
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    throw new Error("Failed to generate the try-on image. Please try again.");
  }
};
