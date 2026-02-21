

export const getApiBaseUrl = () => {

    return import.meta.env.VITE_API_BASE_URL || '';
};

export const apiCall = async (endpoint, options = {}) => {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}${endpoint}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
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
    const apiUrl =
        import.meta.env.VITE_VIRTUAL_RESHOOT_API_URL ||
        "https://model-osprey-487816-m4.uc.r.appspot.com/api/v1/faceswap";

    const { modelImageFile, avatarImageFile } = payload || {};

    if (!modelImageFile || !avatarImageFile) {
        throw new Error("Missing modelImageFile or avatarImageFile");
    }

    const formData = new FormData();
    formData.append("model_image", modelImageFile);
    formData.append("avatar_image", avatarImageFile);

    const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
        ...(signal && { signal }),
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errText}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        return response.json();
    }

    const imageBlob = await response.blob();
    const imageUrl = URL.createObjectURL(imageBlob);
    return {
        success: true,
        imageUrl,
    };
};
