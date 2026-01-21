// Avatar configuration with gender, continent/origin, and skin tone options
// Icons are imported as strings - they'll be rendered as Lucide React components in the UI
export const avatarOptions = {
  genders: [
    { id: "male", label: "Male", iconName: "User" },
    { id: "female", label: "Female", iconName: "UserCircle" },
  ],
  continents: [
    { id: "european", label: "European", iconName: "Globe", color: "#f4a460" },
    { id: "african", label: "African", iconName: "MapPin", color: "#8b4513" },
    { id: "asian", label: "Asian", iconName: "Compass", color: "#d4a574" },
    { id: "middle_eastern", label: "Middle Eastern", iconName: "Building2", color: "#cd853f" },
    { id: "latin", label: "Latin American", iconName: "Leaf", color: "#daa520" },
  ],
  skinTones: [
    { id: "very_pale", label: "Very Pale", hex: "#fdbcb4" },
    { id: "pale", label: "Pale", hex: "#fad5a8" },
    { id: "light", label: "Light", hex: "#f5b895" },
    { id: "medium", label: "Medium", hex: "#d4a574" },
    { id: "tan", label: "Tan", hex: "#ae8566" },
    { id: "dark", label: "Dark", hex: "#8b4513" },
    { id: "very_dark", label: "Very Dark", hex: "#5c3317" },
  ],
  hairStyles: [
    { id: "straight", label: "Straight", iconName: "Minus" },
    { id: "wavy", label: "Wavy", iconName: "Waves" },
    { id: "curly", label: "Curly", iconName: "Shuffle" },
    { id: "coily", label: "Coily", iconName: "Zap" },
  ],
  features: [
    { id: "beard", label: "Beard", iconName: "Smile" },
    { id: "glasses", label: "Glasses", iconName: "Eye" },
    { id: "freckles", label: "Freckles", iconName: "Sparkles" },
    { id: "natural", label: "Natural", iconName: "Star" },
  ],
};

// Mock avatar previews - in real app, these would be generated or loaded from server
export const getAvatarPreview = (selection) => {
  const { gender, continent, skinTone, hairStyle, feature } = selection;

  // Generate a unique ID for this avatar combination
  const avatarId = `avatar_${gender}_${continent}_${skinTone}_${hairStyle}_${feature}`;

  // Return mock preview data
  return {
    id: avatarId,
    gender,
    continent,
    skinTone,
    hairStyle,
    feature,
    // Mock SVG avatar (in production, this would be generated or from a service)
    preview: `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarId}`,
    keyword: `${gender} ${continent} ${skinTone} ${hairStyle} ${feature}`,
  };
};
