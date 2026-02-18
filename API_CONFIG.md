# API Configuration for Local Development

## For Vercel Serverless Functions

### Option 1: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Run Vercel locally (this starts API functions on localhost:3000)
vercel dev
```

Then the Vite proxy will automatically forward requests to `http://localhost:3000`.

### Option 2: Using Environment Variable
If your backend is running on a different port or URL:

```bash
# In .env.local file:
VITE_API_PROXY=http://localhost:5000
```

Then restart the Vite dev server.

### Option 3: For Production (Vercel Hosting)
- Deploy the entire project to Vercel
- API calls will use relative paths `/api/*` which Vercel resolves automatically

## API Endpoints

### Swap Face Generation
- **URL**: `/api/swap-face`
- **Method**: POST
- **Body**:
```json
{
  "inputImages": ["data:image/jpeg;base64,..."],
  "referenceImages": ["data:image/jpeg;base64,..."],
  "prompt": "string",
  "userId": "optional-user-id"
}
```
- **Response**:
```json
{
  "success": true,
  "generationId": "swap_1708235682",
  "outputs": [...],
  "inputCount": 2,
  "referenceCount": 1,
  "timestamp": "ISO-8601-date"
}
```

## Troubleshooting

### "Failed to fetch /api/swap-face"
1. Check if backend is running (see Option 1 or 2 above)
2. Check Vite proxy configuration in `vite.config.ts`
3. Check browser's Network tab for actual request URL and error details

### API returns 404
- Ensure the API function file exists: `api/swap-face.js`
- Ensure correct HTTP method: POST only

### CORS errors
- Proxy should handle this automatically via `changeOrigin: true`
- If still occurring, check backend CORS configuration
