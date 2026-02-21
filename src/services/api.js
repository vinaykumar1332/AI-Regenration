/**
 * API Utility Service
 * Handles all API calls with proper base URL configuration
 * 
 * Environment Variables:
 * - VITE_API_BASE_URL: Base URL for API calls (defaults to relative path)
 */

export const getApiBaseUrl = () => {
    // For development with Vite proxy (configured in vite.config.ts)
    // or for production with Vercel (same origin), use relative paths
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
 * @param {Object} payload - { inputImages, referenceImages, prompt, userId }
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
 * @param {Object} payload - { baseImages, avatarImageUrl, gender, origin }
 * @param {AbortSignal} signal - Abort signal for cancellation
 * @returns {Promise<Object>}
 */
export const virtualReshootApi = async (payload, signal = null) => {
    return apiCall('/api/virtual-reshoot', {
        method: 'POST',
        body: JSON.stringify(payload),
        ...(signal && { signal }),
    });
};
