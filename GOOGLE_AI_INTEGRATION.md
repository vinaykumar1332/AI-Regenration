# Google Generative AI Integration Guide

## 🚀 Quick Start

### Step 1: Get Your Google API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key" button
3. Copy your API key
4. Keep it safe! Don't share it publicly

### Step 2: Setup Local Environment

Create a `.env.local` file in the root directory:

```bash
GOOGLE_API_KEY=your_api_key_here
```

### Step 3: Test Locally

```bash
npm run dev
```

Visit `http://localhost:5173/image-generation` or `/video-generation`

### Step 4: Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Create new project from your GitHub repo
4. Go to **Settings > Environment Variables**
5. Add: `GOOGLE_API_KEY` with your API key value
6. Redeploy

---

## 📡 API Architecture

### Frontend (React)
```
Image/Video Generation Page
         ↓ (POST request)
    /api/generateImage or /api/generateVideo
         ↓
   Vercel Serverless Function
         ↓ (API call with key)
   Google Generative AI
         ↓ (Response)
   Return to Frontend
```

### Why This Architecture?

✅ **Secure**: API key never exposed to client
✅ **Scalable**: Uses Vercel serverless functions
✅ **Fast**: Minimal latency
✅ **Free Tier**: Google offers free tier for API calls

---

## 🛠 What Each Endpoint Does

### POST /api/generateImage

**Input:**
```javascript
{
  prompt: "Describe the image you want",
  identity: "photorealistic", // or "artistic", "minimalist", "default"
  characterName: "Alex" // optional
}
```

**Output:**
```javascript
{
  generationId: "gen_1234567890",
  prompt: "...",
  description: "Detailed image description from AI",
  timestamp: "2026-01-25T...",
  model: "gemini-2.0-flash"
}
```

**Current Behavior:**
- Uses Gemini AI to create detailed image descriptions
- Can be extended to use Google's Imagen API for actual image generation
- Shows generated description to user

---

### POST /api/generateVideo

**Input:**
```javascript
{
  prompt: "Describe the video content",
  characterName: "Alex",
  origin: "Asian", // Character origin for context
  duration: 10, // seconds
  motionPreset: "runway-walk",
  resolution: "1080p"
}
```

**Output:**
```javascript
{
  generationId: "vid_1234567890",
  prompt: "...",
  storyboard: "Scene-by-scene breakdown",
  characterName: "Alex",
  duration: 10,
  timestamp: "2026-01-25T...",
  status: "storyboard_generated"
}
```

**Current Behavior:**
- Uses Gemini AI to create video storyboards and scripts
- Generates detailed scene breakdowns for animation
- Can be extended to use Google's Video AI API

---

## 📝 Implementation Details

### Image Generation Page

**New Features:**
- ✅ Real API integration (not mock data)
- ✅ File upload for reference images
- ✅ Async generation with error handling
- ✅ Toast notifications for feedback
- ✅ New generations appear at top of grid
- ✅ Can regenerate by clicking refresh button

**Code Changes:**
```javascript
// Before: setTimeout with mock
setTimeout(() => {
  setIsGenerating(false);
}, 3000);

// After: Real API call
const response = await fetch("/api/generateImage", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt, identity, characterName })
});
const data = await response.json();
setImages([newGeneration, ...images]);
```

### Video Generation Page

**New Features:**
- ✅ Real API integration
- ✅ Character name input
- ✅ Character origin selector
- ✅ Storyboard generation
- ✅ Form reset after generation
- ✅ Error handling

**Code Changes:**
```javascript
// Added character fields
const [characterName, setCharacterName] = useState("");
const [origin, setOrigin] = useState("Asian");

// Real API call
const response = await fetch("/api/generateVideo", {
  method: "POST",
  body: JSON.stringify({
    prompt, characterName, origin, duration, motionPreset, resolution
  })
});
```

---

## 🔐 Security Best Practices

### ✅ DO:
- Store API keys in environment variables
- Use serverless functions for API calls
- Never commit `.env.local` to Git
- Rotate API keys regularly
- Use `.env.local` for development only

### ❌ DON'T:
- Expose API key in frontend code
- Commit API keys to Git repository
- Share API keys in public channels
- Use same key for testing and production

### .gitignore (Already set up)
```
.env.local
.env.*.local
```

---

## 📊 Free Tier Limits

Google's free tier includes:
- ✅ 60 API calls per minute
- ✅ 1,000 requests per day
- ✅ All models available
- ✅ No credit card required

Paid tier:
- Upgrade anytime in Google AI Studio
- $0.075 per 1M input tokens (Gemini 2.0 Flash)
- Very affordable for demos

---

## 🚢 Deployment to Vercel

### Step-by-Step:

1. **Push to GitHub:**
```bash
git add .
git commit -m "Add Google AI integration"
git push origin main
```

2. **Import Project in Vercel:**
   - Go to https://vercel.com/new
   - Import from GitHub
   - Select your repository

3. **Configure Environment Variables:**
   - Project Settings → Environment Variables
   - Add: `GOOGLE_API_KEY` = `your_api_key_here`
   - Select which environments (Production, Preview, Development)

4. **Deploy:**
   - Click "Deploy"
   - Vercel automatically builds and deploys
   - Your API endpoints work automatically at: `https://your-domain.vercel.app/api/generateImage`

5. **Verify:**
   - Test image generation on deployed site
   - Check error logs in Vercel dashboard
   - Monitor API usage

---

## 🐛 Troubleshooting

### Error: "API key not configured"
**Solution:** Make sure `.env.local` exists with `GOOGLE_API_KEY` value

### Error: "Method not allowed"
**Solution:** POST request to `/api/generateImage` or `/api/generateVideo` endpoint

### Error: "Failed to generate..."
**Solution:** Check browser console for detailed error message

### Slow Responses
**Solution:** Gemini API takes 2-5 seconds. Normal behavior.

### No Images in Grid
**Solution:** Check if API call succeeded (check Network tab in DevTools)

---

## 📚 Next Steps (Optional Enhancements)

### Upgrade to Actual Image Generation

Replace the image description with actual image generation:

```javascript
// Current: Uses Gemini for descriptions
// Future: Use Google's Imagen API

// Requires separate integration:
// 1. Install: @google-cloud/generative-ai
// 2. Use: ImageGenerativeAI
// 3. Returns: Base64 image data
```

### Upgrade to Actual Video Generation

Replace the storyboard with actual video generation:

```javascript
// Current: Uses Gemini for storyboards
// Future: Use Google's Video Generation API

// Requires separate integration:
// 1. Use: VideoGenerativeAI
// 2. Returns: Video file URL
// 3. Stream to frontend
```

### Add Authentication

Protect your API endpoints:

```javascript
// Check user token before calling Google API
if (!request.headers.authorization) {
  return res.status(401).json({ error: "Unauthorized" });
}
```

### Add Rate Limiting

Prevent abuse of API:

```javascript
// Track requests per user
// Limit to X requests per hour
```

### Add Caching

Store generated results:

```javascript
// Cache same prompts
// Return cached result instead of regenerating
```

---

## 📞 Support

### Need Help?

1. **Google AI Documentation:** https://aistudio.google.com/docs
2. **Vercel Documentation:** https://vercel.com/docs
3. **This Project:** Check console for error messages

### Testing API Locally

```bash
# Test image generation endpoint
curl -X POST http://localhost:5173/api/generateImage \
  -H "Content-Type: application/json" \
  -d '{"prompt":"A beautiful sunset","identity":"photorealistic"}'

# Test video generation endpoint
curl -X POST http://localhost:5173/api/generateVideo \
  -H "Content-Type: application/json" \
  -d '{"prompt":"A character walking","characterName":"Alex","duration":10}'
```

---

## ✨ Summary

Your app now has:
- ✅ Real Google AI integration
- ✅ Secure API key management
- ✅ Serverless backend on Vercel
- ✅ Ready for production deployment
- ✅ Full error handling
- ✅ User-friendly feedback

All with **zero cost** on the free tier! 🚀

---

**Last Updated:** January 25, 2026
**Status:** Ready for Production ✅
