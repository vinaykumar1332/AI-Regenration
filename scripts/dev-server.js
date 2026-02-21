

import http from 'http';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env.local') });

const PORT = 3001;
const API_KEY = process.env.AI_KEY;

if (!API_KEY) {
  console.error(' ERROR: AI_KEY environment variable not set!');
  console.error('Add AI_KEY to your .env.local file');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}

// API Handler for /api/generateImage
async function handleGenerateImage(req, res, body) {
  try {
    const { 
      prompt, 
      identity, 
      characterName,
      dressImage,
      gender,
      country,
      skinTone,
      additionalPrompt 
    } = body;

    // Validate inputs
    if (!prompt || !prompt.trim()) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Prompt is required' }));
      return;
    }

    console.log('🎨 Generating image with params:', { 
      prompt: prompt.substring(0, 50) + '...', 
      gender, 
      country, 
      skinTone,
      hasDressImage: !!dressImage 
    });

    // Build enhanced prompt
    let enhancedPrompt = prompt;
    
    if (gender) enhancedPrompt += ` [Gender: ${gender}]`;
    if (country) enhancedPrompt += ` [Country/Origin: ${country}]`;
    if (skinTone) enhancedPrompt += ` [Skin Tone: ${skinTone}]`;
    if (identity && identity !== "default") enhancedPrompt += ` [Style: ${identity}]`;
    if (characterName) enhancedPrompt += ` [Character: ${characterName}]`;
    if (additionalPrompt && additionalPrompt.trim()) enhancedPrompt += ` [Additional: ${additionalPrompt}]`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Prepare content
    const contentArray = [];

    if (dressImage) {
      contentArray.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: dressImage.replace(/^data:image\/[a-z]+;base64,/, ""),
        },
      });
    }

    contentArray.push({
      text: `Generate a detailed image description for: ${enhancedPrompt}. 
      ${dressImage ? 'The user has uploaded a dress image that should be worn by the character in the generated image.' : ''}
      Provide: 1) A detailed visual description of the person wearing the outfit, 2) Color palette and styling, 3) Hair and makeup recommendations, 
      4) Technical specifications for image generation (resolution, aspect ratio, composition).`,
    });

    const response = await model.generateContent(contentArray);
    const description = response.response.text();

    console.log('✅ Image generation successful');

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      generationId: `gen_${Date.now()}`,
      prompt: prompt,
      description: description,
      identity: identity || "default",
      characterName: characterName || null,
      gender: gender || null,
      country: country || null,
      skinTone: skinTone || null,
      hasDressImage: !!dressImage,
      timestamp: new Date().toISOString(),
      model: "gemini-2.0-flash",
    }));
  } catch (error) {
    console.error('❌ Image generation error:', error.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Failed to generate image',
      message: error.message,
    }));
  }
}

// API Handler for /api/generateVideo
async function handleGenerateVideo(req, res, body) {
  try {
    const { prompt, characterName, origin, duration, motionPreset, resolution } = body;

    if (!prompt || !prompt.trim()) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Prompt is required' }));
      return;
    }

    console.log('🎬 Generating video with params:', { 
      prompt: prompt.substring(0, 50) + '...', 
      characterName, 
      origin, 
      duration 
    });

    let enhancedPrompt = prompt;
    
    if (characterName) enhancedPrompt += ` [Character: ${characterName}]`;
    if (origin) enhancedPrompt += ` [Origin: ${origin}]`;

    const videoDuration = duration || 15;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const response = await model.generateContent([
      {
        text: `Create a detailed video storyboard and script for a ${videoDuration}-second video with: ${enhancedPrompt}
        
        Provide in this format:
        1. VIDEO TITLE
        2. OVERALL CONCEPT (2-3 sentences)
        3. SCENE-BY-SCENE BREAKDOWN (for ${videoDuration} seconds total):
           - Scene 1: [duration] seconds - [description]
           - Scene 2: [duration] seconds - [description]
        4. SCRIPT/DIALOGUE (if applicable)
        5. VISUAL STYLE NOTES
        6. TECHNICAL SPECS (resolution, frame rate)
        7. MUSIC/SOUND RECOMMENDATIONS`,
      },
    ]);

    const storyboard = response.response.text();

    console.log('✅ Video generation successful');

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      generationId: `vid_${Date.now()}`,
      prompt: prompt,
      storyboard: storyboard,
      characterName: characterName || null,
      origin: origin || null,
      duration: videoDuration,
      timestamp: new Date().toISOString(),
      model: "gemini-2.0-flash",
      status: "storyboard_generated",
    }));
  } catch (error) {
    console.error('❌ Video generation error:', error.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Failed to generate video',
      message: error.message,
    }));
  }
}

// Create server
const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    const body = await parseBody(req);

    if (req.url === '/api/generateImage') {
      await handleGenerateImage(req, res, body);
    } else if (req.url === '/api/generateVideo') {
      await handleGenerateVideo(req, res, body);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Endpoint not found' }));
    }
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

// Start server
server.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log('🚀 API Development Server Running');
  console.log('═══════════════════════════════════════════════════');
  console.log(`📡 API Server: http://localhost:${PORT}`);
  console.log(`📡 Frontend: http://localhost:5173`);
  console.log('');
  console.log('Endpoints:');
  console.log('  ✅ POST /api/generateImage');
  console.log('  ✅ POST /api/generateVideo');
  console.log('');
  console.log('🔑 API Key: ' + (API_KEY ? '✅ Configured' : '❌ Missing'));
  console.log('═══════════════════════════════════════════════════');
  console.log('');
});

// Error handling
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use!`);
    console.error('Either close the other process or kill the port:');
    console.error(`  netstat -ano | findstr :${PORT}`);
    console.error(`  taskkill /PID [PID] /F`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n✋ Shutting down API server...');
  server.close(() => {
    console.log('✅ API server closed');
    process.exit(0);
  });
});
