

export const getApiBaseUrl = () => {

    return import.meta.env.VITE_API_BASE_URL || '';
};

const bytesToBase64 = (bytes) => {
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize);
        binary += String.fromCharCode(...chunk);
    }
    return btoa(binary);
};

const inferMimeTypeFromBytes = (bytes, fallback = 'image/jpeg') => {
    if (!bytes || bytes.length < 4) return fallback;

    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
        return 'image/jpeg';
    }

    if (
        bytes[0] === 0x89 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x4e &&
        bytes[3] === 0x47
    ) {
        return 'image/png';
    }

    if (
        bytes[0] === 0x47 &&
        bytes[1] === 0x49 &&
        bytes[2] === 0x46
    ) {
        return 'image/gif';
    }

    if (
        bytes[0] === 0x52 &&
        bytes[1] === 0x49 &&
        bytes[2] === 0x46 &&
        bytes[3] === 0x46
    ) {
        return 'image/webp';
    }

    return fallback;
};

const buildDataUrlFromBytes = (bytes, mimeType = 'image/jpeg') => {
    const base64 = bytesToBase64(bytes);
    return `data:${mimeType};base64,${base64}`;
};

const parseJsonSafely = (text) => {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
};

const extractImageUrlFromResult = (result) => {
    if (!result || typeof result !== 'object') return null;

    if (result.status === 'success' && result.data?.bytesBase64Encoded) {
        const mimeType = result.data.mimeType || 'image/jpeg';
        return `data:${mimeType};base64,${result.data.bytesBase64Encoded}`;
    }

    if (result.imageUrl || result.image) {
        return result.imageUrl || result.image;
    }

    const candidateBytes =
        result.data?.bytes ||
        result.data?.imageBytes ||
        result.bytes ||
        result.imageBytes;

    if (Array.isArray(candidateBytes) && candidateBytes.length > 0) {
        const bytes = Uint8Array.from(candidateBytes);
        const fallbackMime =
            result.data?.mimeType ||
            result.mimeType ||
            inferMimeTypeFromBytes(bytes, 'image/jpeg');
        return buildDataUrlFromBytes(bytes, fallbackMime);
    }

    const candidateBase64 =
        result.data?.base64 ||
        result.data?.imageBase64 ||
        result.base64 ||
        result.imageBase64;

    if (typeof candidateBase64 === 'string' && candidateBase64.trim()) {
        const mimeType = result.data?.mimeType || result.mimeType || 'image/jpeg';
        return `data:${mimeType};base64,${candidateBase64}`;
    }

    return null;
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

        const contentType = (response.headers.get('content-type') || '').toLowerCase();
        const rawText = await response.text();
        const data = contentType.includes('application/json')
            ? parseJsonSafely(rawText)
            : parseJsonSafely(rawText) || { raw: rawText };

        if (!response.ok) {
            throw new Error(data?.error || data?.message || `API Error: ${response.status}`);
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

    const contentType = (response.headers.get('content-type') || '').toLowerCase();

    if (contentType.startsWith('image/') || contentType.includes('application/octet-stream')) {
        const bytes = new Uint8Array(await response.arrayBuffer());
        const mimeType = inferMimeTypeFromBytes(bytes, contentType.split(';')[0] || 'image/jpeg');
        const imageUrl = buildDataUrlFromBytes(bytes, mimeType);
        return {
            success: true,
            imageUrl,
            outputs: [imageUrl],
        };
    }

    const rawText = await response.text();
    const result = parseJsonSafely(rawText);

    if (!result) {
        throw new Error('Unexpected non-JSON response from face swap service');
    }

    const extractedImageUrl = extractImageUrlFromResult(result);
    if (extractedImageUrl) {
        return {
            success: true,
            imageUrl: extractedImageUrl,
            outputs: [extractedImageUrl],
        };
    }

    throw new Error(result.message || result.error || "Face swap failed - no image returned");
};
