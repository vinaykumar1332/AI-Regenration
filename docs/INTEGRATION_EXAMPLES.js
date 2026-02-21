// =============================================================================
// Complete Vertex AI + Face Swapping Integration Examples
// =============================================================================

/**
 * APPROACH 1: Vertex AI + Replicate (Best for Production)
 * 
 * This combines:
 * - Vertex AI Gemini: For analyzing swapping instructions & validation
 * - Replicate API: For actual face swapping
 * 
 * Pros: Accurate face swapping, good quality
 * Cons: Higher cost (~$0.1 per image for Replicate)
 */

// api/swap-face.js - Full Production Implementation
import { VertexAI } from "@google-cloud/vertexai";
import Replicate from "replicate";

const vertexAI = new VertexAI({
    project: process.env.VERTEX_AI_PROJECT_ID,
    location: process.env.VERTEX_AI_LOCATION || "us-central1",
});

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { inputImages, referenceImages, prompt, userId } = req.body;

        // Validate inputs
        if (!inputImages?.length || !referenceImages?.length || !prompt) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Step 1: Use Gemini to validate and enhance the prompt
        const generativeModel = vertexAI.getGenerativeModel({
            model: "gemini-2.0-flash",
        });

        const validationPrompt = `
Validate this face-swapping request. Respond with JSON:
{
  "isValid": boolean,
  "feedback": "string",
  "enhancedPrompt": "improved prompt string"
}

Original prompt: ${prompt}
`;

        const validationResponse = await generativeModel.generateContent({
            contents: [{ parts: [{ text: validationPrompt }] }],
        });

        const validation = JSON.parse(
            validationResponse.response.candidates[0].content.parts[0].text
        );

        if (!validation.isValid) {
            return res.status(400).json({
                error: "Invalid swap request",
                feedback: validation.feedback,
            });
        }

        // Step 2: Use Replicate for actual face swapping
        const generationId = `swap_${Date.now()}`;
        const outputs = [];

        for (let i = 0; i < inputImages.length; i++) {
            try {
                const swapResult = await replicate.run(
                    "grayson/face_swap:51ae4a9a4bad2c6c30236e55c02d344c5d56e0f9a5baaf16c4eee0ed1e72d3ef",
                    {
                        inputs: {
                            swap_image: referenceImages[0].replace(
                                /^data:image\/[a-z]+;base64,/,
                                ""
                            ),
                            target_image: inputImages[i].replace(
                                /^data:image\/[a-z]+;base64,/,
                                ""
                            ),
                        },
                    }
                );

                outputs.push({
                    id: `${generationId}_${i}`,
                    image: swapResult[0], // Replicate returns array of URLs
                    source: "replicate",
                    timestamp: new Date().toISOString(),
                });
            } catch (error) {
                console.error(`Failed to swap image ${i}:`, error);
                outputs.push({
                    id: `${generationId}_${i}`,
                    error: error.message,
                    source: "replicate",
                });
            }
        }

        return res.status(200).json({
            success: outputs.some((o) => !o.error),
            generationId,
            outputs,
            inputCount: inputImages.length,
            referenceCount: referenceImages.length,
            userId: userId || null,
            promptUsed: validation.enhancedPrompt,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Swap face error:", error);
        return res
            .status(500)
            .json({ error: "Swap face generation failed", message: error.message });
    }
}

// =============================================================================

/**
 * APPROACH 2: Vertex AI Only (Budget Option)
 * 
 * Uses only Gemini for guidance on face swapping
 * The frontend can then use this guidance to show to the user
 * And optionally call a different service for actual image generation
 * 
 * Pros: Very cheap, fast
 * Cons: No actual face swapping, just analysis
 */

export async function swapFaceWithGeminiOnly(req, res) {
    const { inputImages, referenceImages, prompt, userId } = req.body;

    const vertexAI = new VertexAI({
        project: process.env.VERTEX_AI_PROJECT_ID,
        location: process.env.VERTEX_AI_LOCATION,
    });

    const model = vertexAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Prepare request with images
    const imagePartsInput = inputImages.map((img) => ({
        inlineData: {
            mimeType: "image/jpeg",
            data: img.replace(/^data:image\/[a-z]+;base64,/, ""),
        },
    }));

    const imagePartsReference = referenceImages.map((img) => ({
        inlineData: {
            mimeType: "image/jpeg",
            data: img.replace(/^data:image\/[a-z]+;base64,/, ""),
        },
    }));

    const response = await model.generateContent({
        contents: [
            {
                parts: [
                    ...imagePartsReference,
                    ...imagePartsInput,
                    {
                        text: `${prompt}

Return your analysis in this JSON format:
{
  "swapAnalysis": "detailed description of what the swap would look like",
  "identityPreservation": "how well identity is preserved",
  "estimatedQuality": "high/medium/low",
  "recommendations": ["list", "of", "improvements"]
}`,
                    },
                ],
            },
        ],
    });

    const analysis = JSON.parse(response.response.candidates[0].content.parts[0].text);

    return res.status(200).json({
        success: true,
        generationId: `swap_${Date.now()}`,
        analysis,
        inputCount: inputImages.length,
        referenceCount: referenceImages.length,
        note: "Using Gemini analysis. For actual face swapping, integrate Replicate or similar service.",
    });
}

// =============================================================================

/**
 * APPROACH 3: Custom Model Deployment (Advanced)
 *
 * Deploy your own face-swapping model using:
 * - Python + insightface/FaceForensics++
 * - FastAPI for serving
 * - Docker for containerization
 *
 * Example using FastAPI backend:
 */

export async function swapFaceWithCustomModel(req, res) {
    const { inputImages, referenceImages, prompt, userId } = req.body;

    const customModelUrl = process.env.CUSTOM_SWAP_FACE_API ||
        "http://localhost:8000/swap-face";

    const payloads = inputImages.map((img) => ({
        reference_image: referenceImages[0], // Use first reference for all
        target_image: img,
        prompt,
    }));

    const outputs = [];

    for (const payload of payloads) {
        const response = await fetch(customModelUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        outputs.push(result);
    }

    return res.status(200).json({
        success: true,
        generationId: `swap_${Date.now()}`,
        outputs,
        model: "custom",
    });
}

// =============================================================================

/**
 * FRONTEND - How to call the API
 * src/services/api.js - Update swapFaceApi to handle different model types
 */

export const swapFaceApi = async (
    payload,
    signal = null,
    modelType = "replicate"
) => {
    return apiCall("/api/swap-face", {
        method: "POST",
        body: JSON.stringify({
            ...payload,
            modelType, // "replicate", "gemini-only", or "custom"
        }),
        ...(signal && { signal }),
    });
};

/**
 * Frontend Usage:
 * 
 * const response = await swapFaceApi({
 *     inputImages: [...],
 *     referenceImages: [...],
 *     prompt: "...",
 *     userId: "user123",
 * }, signal, "replicate");
 * 
 * if (response.success) {
 *     // Display outputs (URLs from Replicate)
 *     response.outputs.forEach(output => {
 *         console.log("Swapped image:", output.image);
 *     });
 * }
 */

// =============================================================================

/**
 * COST COMPARISON
 *
 * Approach 1 (Vertex AI + Replicate):
 * - Per swap: $0.001 (Vertex) + $0.1 (Replicate) = ~$0.10
 * - Quality: Excellent
 *
 * Approach 2 (Gemini only):
 * - Per swap: $0.001
 * - Quality: Analysis only, no actual swapping
 *
 * Approach 3 (Custom Model):
 * - Per swap: $0 (after initial deployment cost)
 * - Quality: Depends on model
 * - Complexity: High
 */

// =============================================================================

/**
 * ENVIRONMENT VARIABLES NEEDED
 */

/*
For Approach 1 (Recommended):
VERTEX_AI_PROJECT_ID=your-gcp-project
VERTEX_AI_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
REPLICATE_API_TOKEN=your-replicate-token

For Approach 2:
VERTEX_AI_PROJECT_ID=your-gcp-project
VERTEX_AI_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json

For Approach 3:
CUSTOM_SWAP_FACE_API=http://your-custom-api:port/swap-face
*/

// =============================================================================
