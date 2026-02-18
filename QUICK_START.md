# Vertex AI + Gemini Integration - Quick Start

## ✅ What's Been Done

1. ✅ **Updated `/api/swap-face.js`** - Now uses Vertex AI with Gemini models
2. ✅ **Added `@google-cloud/vertexai` to package.json** - Ready to install
3. ✅ **Created setup guides** - VERTEX_AI_SETUP.md and INTEGRATION_EXAMPLES.js
4. ✅ **Created API service layer** - `src/services/api.js` for proper API calls

## 🚀 Next Steps (In Order)

### Step 1: Get Vertex AI Credentials
```bash
1. Go to https://console.cloud.google.com
2. Select your Google Cloud project
3. Go to "IAM & Admin" → "Service Accounts"
4. Create a new service account or use existing
5. Click "Keys" → "Create New Key" → "JSON"
6. Save the JSON file to your project root as: google-credentials.json
```

### Step 2: Create `.env.local` in project root

```env
# Vertex AI Configuration
VERTEX_AI_PROJECT_ID=your-google-cloud-project-id
VERTEX_AI_LOCATION=us-central1

# For local development (if using JSON credentials file)
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json

# For production (Vercel) - convert JSON to base64
# cat google-credentials.json | base64 -w 0
VERTEX_AI_CREDENTIALS_BASE64=<paste-base64-string-here>
```

### Step 3: Install Dependencies

```bash
npm install
# This installs @google-cloud/vertexai
```

### Step 4: Update Vercel Environment (for production)

Go to **Vercel Project Settings** → **Environment Variables** and add:

```
VERTEX_AI_PROJECT_ID = your-project-id
VERTEX_AI_LOCATION = us-central1
```

For credentials, if you can't upload JSON file, use base64 format (see docs).

### Step 5: Test Locally

```bash
# Terminal 1: Start Vite dev server
npm run dev

# Terminal 2: Start Vercel local backend
vercel dev

# Terminal 3: Test the API
curl -X POST http://localhost:3000/api/swap-face \
  -H "Content-Type: application/json" \
  -d '{
    "inputImages": ["data:image/jpeg;base64,/9j/..."],
    "referenceImages": ["data:image/jpeg;base64,/9j/..."],
    "prompt": "Swap face from reference to target",
    "userId": "test-user"
  }'
```

## 📊 Choose Your Approach

### Option A: Gemini Only (Current Setup) ✅ Ready
- **Cost**: ~$0.001 per request
- **Output**: Analysis and guidance (no actual image swapping)
- **Use Case**: Testing, analysis, guidance
- Currently implemented in `/api/swap-face.js`

### Option B: Vertex AI + Replicate (Recommended for Production)
- **Cost**: ~$0.10 per image swap
- **Output**: Actual face-swapped images
- **Quality**: Excellent
- **Setup**: Add REPLICATE_API_TOKEN to .env

To switch to this approach:

```bash
# 1. Install Replicate
npm install replicate

# 2. Get API token from https://replicate.com/account/api-tokens

# 3. Add to .env.local
REPLICATE_API_TOKEN=your-replicate-token

# 4. Update api/swap-face.js with code from INTEGRATION_EXAMPLES.js (APPROACH 1)
```

### Option C: Custom Model (Advanced)
Host your own face-swapping model using Python + FastAPI.
See INTEGRATION_EXAMPLES.js for code structure.

## 📁 Files Modified/Created

- `api/swap-face.js` - Updated with Vertex AI integration
- `package.json` - Added @google-cloud/vertexai
- `VERTEX_AI_SETUP.md` - Complete setup documentation
- `INTEGRATION_EXAMPLES.js` - Code examples for all approaches
- `API_CONFIG.md` - API configuration reference

## 🔧 Troubleshooting

### "VERTEX_AI_PROJECT_ID not set"
```
Make sure your .env.local has VERTEX_AI_PROJECT_ID=your-actual-project-id
Not a placeholder, but your real Google Cloud project ID
```

### "Permission denied" when calling Vertex AI
```
Ensure your service account has these roles:
- Vertex AI User
- Vertex AI Service Agent

Add the role in Google Cloud Console → IAM & Admin
```

### "Module not found: @google-cloud/vertexai"
```bash
# Run again
npm install

# If still failing, manually add:
npm install @google-cloud/vertexai
```

### Credentials not working locally
```
Ensure the JSON file exists at:
./google-credentials.json (from project root)

Or set GOOGLE_APPLICATION_CREDENTIALS environment variable:
export GOOGLE_APPLICATION_CREDENTIALS=$(pwd)/google-credentials.json
```

## 📝 Current API Behavior

**Endpoint**: `POST /api/swap-face`

**Request Body**:
```json
{
  "inputImages": ["data:image/jpeg;base64,..."],
  "referenceImages": ["data:image/jpeg;base64,..."],
  "prompt": "Swap face from reference to target image",
  "userId": "optional-user-id",
  "model": "gemini-2.0-flash"
}
```

**Current Response** (Gemini analysis):
```json
{
  "success": true,
  "generationId": "swap_1708235682",
  "analysisResponse": "Detailed analysis from Gemini...",
  "inputCount": 2,
  "referenceCount": 1,
  "promptUsed": "Your prompt here",
  "timestamp": "2025-02-18T...",
  "note": "Gemini model provides analysis/guidance. For actual image generation, integrate with Imagen API or alternative service.",
  "recommendation": "For production face swapping, consider using: 1) Replicate API, 2) FAI API, 3) Custom ML model, or 4) Runway ML"
}
```

**To Get Actual Face Swaps**: 
Follow "Option B" above (add Replicate integration).

## 🎯 Available Gemini Models

| Model | Speed | Quality | Cost | Best For |
|-------|-------|---------|------|----------|
| `gemini-2.0-flash` | Very Fast | Good | Low | Real-time, fast responses |
| `gemini-1.5-pro` | Medium | Excellent | Medium | Complex reasoning |
| `gemini-1.5-flash` | Fast | Good | Low | Quick tasks |
| `gemini-exp-1114` | Fast | Experimental | Low | Latest features |

Change model in API call:
```javascript
await swapFaceApi({
  inputImages: [...],
  referenceImages: [...],
  prompt: "...",
  model: "gemini-1.5-pro" // or gemini-1.5-flash
}, signal);
```

## 💡 Pro Tips

1. **For Development**: Use `vercel dev` to run Vercel functions locally
2. **For Production**: Store credentials as base64 in Vercel environment variables (not JSON file)
3. **Monitor Costs**: Check Google Cloud Console for Vertex AI usage and billing
4. **Cache Results**: Store generated images/results to reduce API calls

## 📚 Additional Resources

- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Gemini API Docs](https://ai.google.dev)
- [Replicate Face Swap Model](https://replicate.com/grayson/face_swap)
- [RunwayML Docs](https://docs.runwayml.com)

## ❓ Questions?

1. Check VERTEX_AI_SETUP.md for detailed setup
2. Check INTEGRATION_EXAMPLES.js for code patterns
3. Check troubleshooting section above
4. Enable debug logging in terminal to see API responses
