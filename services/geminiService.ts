
import { GoogleGenAI, Modality } from "@google/genai";
import type { ViewType } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateView(base64ImageData: string, mimeType: string, viewType: ViewType): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64ImageData,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: `Generate a clean, orthographic ${viewType} view technical drawing of the object in the image. The background must be pure white. The lines should be black. Do not include any text or dimensions.`,
                    },
                ],
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

        throw new Error(`Failed to generate ${viewType} view. No image data in response.`);

    } catch (error) {
        console.error(`Error generating ${viewType} view:`, error);
        throw new Error(`Could not generate the ${viewType} view. The model may have had an issue with the request.`);
    }
}
