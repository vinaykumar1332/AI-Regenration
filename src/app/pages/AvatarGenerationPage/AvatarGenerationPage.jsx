import { useState } from "react";
import { Card } from "@/app/components/ui/Card/card";
import { Button } from "@/app/components/ui/Button/button";
import { Textarea } from "@/app/components/ui/Textarea/textarea";
import { Badge } from "@/app/components/ui/Badge/badge";
import { Input } from "@/app/components/ui/Input/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/Select/select";
import { Upload, Sparkles, Download, RefreshCw, Loader2, Check, Users, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { AvatarSelector } from "./AvatarSelector";
import { predefinedAvatars } from "@/app/components/AvatarModule/avatarGalleryData";

export function AvatarGenerationPage() {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [generationType, setGenerationType] = useState("image");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customAvatars, setCustomAvatars] = useState([]);
  const [createForm, setCreateForm] = useState({
    name: "",
    origin: "Asian",
    faceImage: null,
    faceImagePreview: null,
  });

  const allAvatars = [...predefinedAvatars, ...customAvatars];

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    toast.success(`Selected: ${avatar.name}`);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCreateForm({
          ...createForm,
          faceImage: file,
          faceImagePreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateAvatar = () => {
    if (!createForm.name.trim()) {
      toast.error("Please enter a character name");
      return;
    }

    if (!createForm.faceImagePreview) {
      toast.error("Please upload a face reference image");
      return;
    }

    const newAvatar = {
      id: `custom-${Date.now()}`,
      name: createForm.name,
      origin: createForm.origin,
      tagline: `Custom Character - ${createForm.origin}`,
      description: "Custom avatar created by user",
      skinTone: "custom",
      isCustom: true,
      imageUrl: createForm.faceImagePreview,
      faceReference: {
        type: "FACE_REFERENCE",
        characterId: `custom-${Date.now()}`,
        prompt: `Custom character "${createForm.name}" from ${createForm.origin}`,
      },
    };

    setCustomAvatars([...customAvatars, newAvatar]);
    setCreateForm({
      name: "",
      origin: "Asian",
      faceImage: null,
      faceImagePreview: null,
    });
    setShowCreateModal(false);
    toast.success("Avatar created successfully! 🎉");
  };

  const handleGenerate = () => {
    if (!selectedAvatar) {
      toast.error("Please select an avatar first");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);

    const payload = {
      type: generationType,
      characterName: selectedAvatar.name,
      origin: selectedAvatar.origin,
      prompt: prompt,
      faceReference: selectedAvatar.faceReference || null,
      timestamp: new Date().toISOString(),
    };

    setTimeout(() => {
      setIsGenerating(false);
      toast.success(`${generationType === "image" ? "Image" : "Video"} generation started!`);
      console.log("Generation Payload:", payload);
    }, 2000);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold mb-2">Avatar Generation</h1>
        <p className="text-muted-foreground">Create stunning content using character-based avatars with preserved facial identity</p>
      </div>

      {/* Avatar Selection */}
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Select Your Avatar
          </h2>
          <AvatarSelector
            avatars={allAvatars}
            selectedAvatar={selectedAvatar}
            onSelect={handleAvatarSelect}
            onCreateNew={() => setShowCreateModal(true)}
          />
        </div>
      </Card>

      {/* Generation Form */}
      {selectedAvatar && (
        <Card className="p-6">
          <div className="space-y-6">
            {/* Generation Type */}
            <div>
              <label className="text-sm font-medium mb-3 block">Generation Type</label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={generationType === "image" ? "default" : "outline"}
                  onClick={() => setGenerationType("image")}
                  className="flex items-center gap-2"
                >
                  <span>📸 Image</span>
                </Button>
                <Button
                  variant={generationType === "video" ? "default" : "outline"}
                  onClick={() => setGenerationType("video")}
                  className="flex items-center gap-2"
                >
                  <span>🎬 Video</span>
                </Button>
              </div>
            </div>

            {/* Prompt Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">Prompt</label>
              <Textarea
                placeholder={`Describe what you want to generate with ${selectedAvatar.name}... (e.g., 'Professional photoshoot in studio with professional lighting')`}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Your facial features will be preserved from the selected avatar
              </p>
            </div>

            {/* Selected Avatar Info */}
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden">
                  <img
                    src={selectedAvatar.imageUrl}
                    alt={selectedAvatar.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedAvatar.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedAvatar.origin}</p>
                  <p className="text-sm mt-1">{selectedAvatar.tagline}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      <Check className="w-3 h-3 mr-1" />
                      Face Reference
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate {generationType === "image" ? "Image" : "Video"}
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!selectedAvatar && (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <Users className="w-12 h-12 mx-auto text-muted-foreground" />
            <h3 className="font-semibold text-lg">Select an Avatar to Continue</h3>
            <p className="text-muted-foreground">Choose a pre-defined character or create your own custom avatar</p>
          </div>
        </Card>
      )}

      {/* Create Avatar Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Avatar
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Face Reference Upload */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Face Reference Image</label>
                  {createForm.faceImagePreview ? (
                    <div className="relative">
                      <img
                        src={createForm.faceImagePreview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg border border-border"
                      />
                      <button
                        onClick={() =>
                          setCreateForm({
                            ...createForm,
                            faceImage: null,
                            faceImagePreview: null,
                          })
                        }
                        className="absolute top-2 right-2 bg-destructive text-white p-1 rounded hover:bg-destructive/90"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary transition-colors cursor-pointer flex flex-col items-center gap-2">
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Click to upload face image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Character Name */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Character Name</label>
                  <Input
                    placeholder="e.g., Alex, Sarah, Jordan..."
                    value={createForm.name}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, name: e.target.value })
                    }
                  />
                </div>

                {/* Origin Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Origin</label>
                  <Select value={createForm.origin} onValueChange={(value) => setCreateForm({ ...createForm, origin: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asian">Asian</SelectItem>
                      <SelectItem value="European">European</SelectItem>
                      <SelectItem value="African">African</SelectItem>
                      <SelectItem value="Indian">Indian</SelectItem>
                      <SelectItem value="Middle Eastern">Middle Eastern</SelectItem>
                      <SelectItem value="Latin American">Latin American</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateAvatar}
                  className="flex-1"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Avatar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
