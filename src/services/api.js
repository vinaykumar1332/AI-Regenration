

export const getApiBaseUrl = () => {

    return import.meta.env.VITE_API_BASE_URL || '';
};

export const apiCall = async (endpoint, options = {}) => {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}${endpoint}`;

    try {
        const headers = {
            ...(options.headers || {}),
        };

        // If we're sending FormData, the browser must set the multipart boundary.
        const isFormDataBody =
            typeof FormData !== 'undefined' && options.body instanceof FormData;

        if (!isFormDataBody) {
            const hasContentType =
                Object.keys(headers).some((k) => k.toLowerCase() === 'content-type');
            if (!hasContentType) {
                headers['Content-Type'] = 'application/json';
            }
        }

        const response = await fetch(url, {
            headers,
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `API Error: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`API call failed for ${endpoint}:`, error);
        throw error;
    }
};

/**
 * Swap Face Image Generation API
 * @param {Object} payload - { inputImages, referenceImages }
 * @param {AbortSignal} signal - Abort signal for cancellation
 * @returns {Promise<Object>} - { success, generationId, outputs, ... }
 */
export const swapFaceApi = async (payload, signal = null) => {
    return apiCall('/api/swap-face', {
        method: 'POST',
        body: JSON.stringify(payload),
        ...(signal && { signal }),
    });
};

/**
 * Virtual Reshoot API (Avatar-based identity anchor)
 * @param {Object} payload - { baseImages, avatarImageUrl }
 * @param {AbortSignal} signal - Abort signal for cancellation
 * @returns {Promise<Object>}
 */
export const virtualReshootApi = async (payload, signal = null) => {
    // Use proxy in development to bypass CORS, direct URL in production
    const isDev = import.meta.env.DEV;
    // Preferred: call our own backend/proxy route so CORS is never a browser concern.
    // - Dev: Vite proxies this to the upstream service.
    // - Prod (Vercel): implement api/external-faceswap.js to forward server-side.
    const apiUrl =
        import.meta.env.VITE_VIRTUAL_RESHOOT_API_URL ||
        (isDev ? '/api/external-faceswap' : '/api/external-faceswap');

    const { modelImageFile, avatarImageFile } = payload || {};

    if (!modelImageFile || !avatarImageFile) {
        throw new Error("Missing modelImageFile or avatarImageFile");
    }

    const formData = new FormData();
    formData.append("model_image", modelImageFile);
    formData.append("avatar_image", avatarImageFile);

    if (isDev) {
        console.log("=== virtualReshootApi Debug ===");
        console.log("API URL:", apiUrl);
        console.log("model_image:", {
            name: modelImageFile?.name,
            size: modelImageFile?.size,
            type: modelImageFile?.type,
            isFile: modelImageFile instanceof File,
        });
        console.log("avatar_image:", {
            name: avatarImageFile?.name,
            size: avatarImageFile?.size,
            type: avatarImageFile?.type,
            isFile: avatarImageFile instanceof File,
        });
    }

    const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
        ...(signal && { signal }),
    });

    if (!response.ok) {
        const contentType = response.headers.get("content-type") || "";
        const errText = await response.text();

        // If the upstream returns an HTML error page (common for 502/504), keep the message short.
        if (contentType.includes("text/html")) {
            throw new Error(
                `API Error: ${response.status} (${response.statusText || "Bad Gateway"}). ` +
                    `The faceswap service is failing upstream. Try again later or check the upstream service logs.`
            );
        }

        throw new Error(`API Error: ${response.status} - ${errText}`);
    }

    const result = await response.json();

    // Handle the backend response format: { status: "success", data: { mimeType, bytesBase64Encoded } }
    if (result.status === "success" && result.data?.bytesBase64Encoded) {
        const imageUrl = `data:${result.data.mimeType};base64,${result.data.bytesBase64Encoded}`;
        return {
            success: true,
            imageUrl,
            outputs: [imageUrl],
        };
    }

    // Fallback for other response formats
    if (result.imageUrl || result.image) {
        return {
            success: true,
            imageUrl: result.imageUrl || result.image,
            outputs: [result.imageUrl || result.image],
        };
    }

    throw new Error(result.message || result.error || "Face swap failed - no image returned");
};
