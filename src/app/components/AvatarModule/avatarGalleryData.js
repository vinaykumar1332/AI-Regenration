// Avatar Gallery Data - Pre-defined characters with REAL FACE IMAGES
export const predefinedAvatars = [
  {
    id: "sholi",
    name: "Sholi",
    origin: "Asian",
    tagline: "The Minimalist Maven",
    description: "Focused on clean, elegant lines.",
    icon: "Globe",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80",
    skinTone: "medium",
    faceReference: {
      type: "FACE_REFERENCE",
      characterId: "sholi",
      prompt: "Asian woman with minimalist aesthetics, clean facial features, sharp jawline, medium skin tone",
    },
  },
  {
    id: "max",
    name: "Max",
    origin: "European",
    tagline: "The Nordic Nomad",
    description: "High-contrast features, UK skin tone.",
    icon: "Wind",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80",
    skinTone: "pale",
    faceReference: {
      type: "FACE_REFERENCE",
      characterId: "max",
      prompt: "European man with Nordic features, high-contrast facial structure, pale skin tone, sharp features",
    },
  },
  {
    id: "aisha",
    name: "Aisha",
    origin: "African",
    tagline: "The Solar Stylist",
    description: "Vibrant, glowing skin and sharp focus.",
    icon: "Sun",
    imageUrl: "https://images.unsplash.com/photo-1507239711619-bd914236b374?w=400&h=400&fit=crop&q=80",
    skinTone: "dark",
    faceReference: {
      type: "FACE_REFERENCE",
      characterId: "aisha",
      prompt: "African woman with vibrant glowing skin, sharp facial features, dark rich skin tone, radiant expression",
    },
  },
  {
    id: "kiran",
    name: "Kiran",
    origin: "Indian",
    tagline: "The Heritage Weaver",
    description: "Blending tradition with high-tech.",
    icon: "Sparkles",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80",
    skinTone: "tan",
    faceReference: {
      type: "FACE_REFERENCE",
      characterId: "kiran",
      prompt: "Indian person with heritage features, warm tan skin tone, expressive eyes, blending traditional and modern aesthetics",
    },
  },
];

// Function to generate multi-part prompt for AI generation
export const generateAIPrompt = (selectedAvatar, styleReference, type = "image") => {
  if (!selectedAvatar) return null;

  const basePrompt = `Generate ${type} of ${selectedAvatar.name} from Face_Reference wearing the exact clothing from Style_Reference. Preserve 100% facial identity and skin tone.`;

  return {
    type: type, // 'image' or 'video'
    characterName: selectedAvatar.name,
    origin: selectedAvatar.origin,
    faceReference: selectedAvatar.faceReference,
    styleReference: styleReference || null,
    mainPrompt: basePrompt,
    fullPrompt: styleReference
      ? `${basePrompt} Character traits: ${selectedAvatar.description}`
      : basePrompt,
    timestamp: new Date().toISOString(),
  };
};

// Function to format avatar for display
export const formatAvatarCard = (avatar) => ({
  ...avatar,
  displayName: `${avatar.name} - ${avatar.origin} Origin`,
  fullTagline: `${avatar.tagline}: ${avatar.description}`,
});
