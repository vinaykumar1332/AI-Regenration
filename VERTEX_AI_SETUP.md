# Vertex AI & Gemini Integration Guide

## Setup Steps

### 1. Install Vertex AI Package
```bash
npm install @google-cloud/vertexai
```

### 2. Get Google Cloud Credentials

#### Option A: Download Service Account JSON (Recommended for local development)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project (or create one)
3. Go to **IAM & Admin** → **Service Accounts**
4. Create a new service account or select existing
5. Click **Keys** → **Create New Key** → **JSON**
6. Save the JSON file to your project root: `google-credentials.json`

#### Option B: Use Base64 Credentials (For Vercel production)

```bash
# Encode your service account JSON as base64
cat google-credentials.json | base64 -w 0

# Add to Vercel Environment Variables:
VERTEX_AI_CREDENTIALS_BASE64=<base64-string>
```

### 3. Configure Environment Variables

Create `.env.local` in project root:

```env
# Google Cloud Project
VERTEX_AI_PROJECT_ID=your-google-cloud-project-id
VERTEX_AI_LOCATION=us-central1

# Local Development (if using JSON file)
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json

# Production (Vercel) - Use base64 encoded credentials
```

For **Vercel**, add to Project Settings → Environment Variables:
- `VERTEX_AI_PROJECT_ID`
- `VERTEX_AI_LOCATION`
- `VERTEX_AI_CREDENTIALS_BASE64`

### 4. Update vercel.json (if using base64 credentials)

Add this code to decode credentials before API calls:

```javascript
// In api/swap-face.js or before Vertex AI initialization
if (process.env.VERTEX_AI_CREDENTIALS_BASE64) {
    const credentialsJson = Buffer.from(
        process.env.VERTEX_AI_CREDENTIALS_BASE64,
        'base64'
    ).toString('utf-8');
    process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON = credentialsJson;
}
```

## Available Gemini Models

| Model | Best For | Input Types |
|-------|----------|-------------|
| `gemini-2.0-flash` | Fast responses, image analysis | Text + Images |
| `gemini-1.5-pro` | Complex reasoning, detailed analysis | Text + Images |
| `gemini-1.5-flash` | Quick tasks, cost-effective | Text + Images |
| `gemini-exp-1114` | Experimental, latest features | Text + Images |

## ⚠️ Important: Face Swapping Limitation

**Gemini models provide image analysis and guidance, but NOT actual face swapping.**

For real face swapping, use one of these dedicated services:

### Option 1: Replicate API (Recommended)
```javascript
// npm install replicate
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

const output = await replicate.run(
    "grayson/face_swap:51ae4a9a4bad2c6c30236e55c02d344c5d56e0f9a5baaf16c4eee0ed1e72d3ef",
    {
        inputs: {
            swap_image: inputImage, // Person's face to swap FROM
            target_image: targetImage, // Image to swap TO
        },
    }
);
```

### Option 2: RunwayML
```javascript
// Documentation: https://docs.runwayml.com/
// Supports real-time face swapping with great quality
```

### Option 3: Custom ML Model
Deploy your own face-swapping model using:
- Python + TensorFlow
- PyTorch + insightface
- OpenCV

## Updated Flow

Currently, the `/api/swap-face` endpoint:
1. ✅ Accepts input and reference images
2. ✅ Connects to Vertex AI
3. ⚠️ Returns analysis instead of swapped images

To make it work end-to-end:

```javascript
// In api/swap-face.js - add alongside Vertex AI
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

// Use Vertex AI for analysis
const analysis = await generativeModel.generateContent(...);

// Use Replicate for actual face swapping
const outputs = [];
for (let i = 0; i < inputImages.length; i++) {
    const swapped = await replicate.run(
        "grayson/face_swap:...",
        {
            inputs: {
                swap_image: referenceImages[0],
                target_image: inputImages[i],
            },
        }
    );
    outputs.push(swapped);
}
```

## Testing Locally

```bash
# 1. Install dependencies
npm install @google-cloud/vertexai

# 2. Set environment variables
export VERTEX_AI_PROJECT_ID="your-project"
export VERTEX_AI_LOCATION="us-central1"
export GOOGLE_APPLICATION_CREDENTIALS="./google-credentials.json"

# 3. Run Vercel locally
vercel dev

# 4. Test the API
curl -X POST http://localhost:3000/api/swap-face \
  -H "Content-Type: application/json" \
  -d '{
    "inputImages": ["data:image/jpeg;base64,..."],
    "referenceImages": ["data:image/jpeg;base64,..."],
    "prompt": "Swap the face from reference to target image",
    "userId": "user123"
  }'
```

## Production Deployment (Vercel)

1. Add environment variables to Vercel project
2. Ensure service account has Vertex AI permissions
3. Deploy: `vercel deploy`

## Troubleshooting

### "GOOGLE_APPLICATION_CREDENTIALS not set"
- Set `GOOGLE_APPLICATION_CREDENTIALS` environment variable
- Or use `VERTEX_AI_CREDENTIALS_BASE64` for Vercel

### "Permission denied" errors
- Ensure service account has `Vertex AI User` role
- Go to IAM & Admin → grant role to service account

### Quota exceeded
- Check project quota in Google Cloud Console
- Increase quota if needed

## Cost Considerations

- **Vertex AI API calls**: ~$0.0025 per request
- **Replicate API** (face swap): ~$0.1 per image
- **Gemini analysis**: Included in Vertex AI

For production, set up billing and monitor usage.
