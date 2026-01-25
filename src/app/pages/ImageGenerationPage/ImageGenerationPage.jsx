import { useState } from "react";
import { Card } from "@/app/components/ui/Card/card";
import { Button } from "@/app/components/ui/Button/button";
import { Textarea } from "@/app/components/ui/Textarea/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/Select/select";
import { Badge } from "@/app/components/ui/Badge/badge";
import { Skeleton } from "@/app/components/ui/Skeleton/skeleton";
import { Upload, Sparkles, Download, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import mockData from "./mockData.json";

const { mockImages } = mockData;

export function ImageGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [identity, setIdentity] = useState("default");
  const [dressImage, setDressImage] = useState(null);
  const [dressImagePreview, setDressImagePreview] = useState(null);
  const [gender, setGender] = useState("female");
  const [country, setCountry] = useState("Asian");
  const [skinTone, setSkinTone] = useState("fair");
  const [additionalPrompt, setAdditionalPrompt] = useState("");
  const [images, setImages] = useState(mockImages);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDressImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setDressImagePreview(reader.result);
        setDressImage(reader.result); // Store base64
      };
      reader.readAsDataURL(file);
      toast.success("Dress image uploaded successfully");
    }
  };

  const handleRemoveDressImage = () => {
    setDressImage(null);
    setDressImagePreview(null);
    toast.info("Dress image removed");
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/generateImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          identity: identity,
          characterName: null,
          dressImage: dressImage, // Base64 image
          gender: gender,
          country: country,
          skinTone: skinTone,
          additionalPrompt: additionalPrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      // Create new generation entry
      const newGeneration = {
        id: data.generationId,
        prompt: prompt,
        url: dressImagePreview || `https://via.placeholder.com/512x512?text=${encodeURIComponent(prompt.substring(0, 30))}`,
        status: "completed",
        timestamp: data.timestamp,
        identity: identity,
        gender: gender,
        country: country,
        skinTone: skinTone,
        description: data.description,
        hasDressImage: data.hasDressImage,
      };

      // Add to images array at the beginning
      setImages([newGeneration, ...images]);
      
      // Reset form
      setPrompt("");
      setIdentity("default");
      setDressImage(null);
      setDressImagePreview(null);
      setGender("female");
      setCountry("Asian");
      setSkinTone("fair");
      setAdditionalPrompt("");

      toast.success("Image generated successfully!");
      console.log("Generation Result:", data);
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(error.message || "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (imageId) => {
    const image = images.find((img) => img.id === imageId);
    if (image) {
      const link = document.createElement("a");
      link.href = image.url;
      link.download = `image_${imageId}.png`;
      link.click();
      toast.success("Download started");
    }
  };

  const handleRegenerate = (imageId) => {
    const image = images.find((img) => img.id === imageId);
    if (image) {
      setPrompt(image.prompt);
      setIdentity(image.identity || "default");
      setGender(image.gender || "female");
      setCountry(image.country || "Asian");
      setSkinTone(image.skinTone || "fair");
      if (image.url && image.hasDressImage) {
        setDressImagePreview(image.url);
        setDressImage(image.url);
      }
      toast.info("Prompt restored. Modify and generate again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Image Generation</h1>
        <p className="text-muted-foreground">Create AI-generated images with custom dress, character options, and styling</p>
      </div>

      {/* Generation Form */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Dress Image Upload */}
          <div>
            <label className="text-sm font-medium mb-2 block">Upload Dress Image</label>
            {dressImagePreview ? (
              <div className="border-2 border-primary rounded-lg p-4 bg-muted/50">
                <div className="flex items-center gap-4">
                  <img 
                    src={dressImagePreview} 
                    alt="Dress preview" 
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Dress Image Loaded</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This dress will be worn by the generated character
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRemoveDressImage}
                      className="mt-2"
                    >
                      Remove Image
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary transition-colors cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDressImageUpload}
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-2 text-muted-foreground flex-col">
                  <Upload className="w-6 h-6" />
                  <span className="text-sm font-medium">Upload dress/outfit image</span>
                  <span className="text-xs">Click to upload or drag and drop</span>
                </div>
              </label>
            )}
          </div>

          {/* Main Prompt */}
          <div>
            <label className="text-sm font-medium mb-2 block">Main Prompt</label>
            <Textarea
              placeholder="Describe the scene, background, or overall concept... (e.g., 'In a professional office', 'At a beach sunset', 'In a modern home')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Describe the setting and context for the generated image
            </p>
          </div>

          {/* Character Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Gender</label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Country/Origin</label>
              <Select value={country} onValueChange={setCountry}>
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
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Skin Tone</label>
              <Select value={skinTone} onValueChange={setSkinTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="olive">Olive</SelectItem>
                  <SelectItem value="tan">Tan</SelectItem>
                  <SelectItem value="deep">Deep</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Style</label>
              <Select value={identity} onValueChange={setIdentity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="photorealistic">Photorealistic</SelectItem>
                  <SelectItem value="artistic">Artistic</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Prompt */}
          <div>
            <label className="text-sm font-medium mb-2 block">Additional Details (Optional)</label>
            <Textarea
              placeholder="Add any extra details... (e.g., 'with makeup', 'serious expression', 'smiling naturally')"
              value={additionalPrompt}
              onChange={(e) => setAdditionalPrompt(e.target.value)}
              className="min-h-[80px] resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Add any additional styling or expression details
            </p>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            className="w-full bg-primary hover:bg-primary/90 text-white"
            disabled={isGenerating || !prompt.trim()}
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Image...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Image
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Generated Images Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Generations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-muted relative group">
                {image.status === "completed" ? (
                  <>
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleDownload(image.id)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleRegenerate(image.id)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                )}
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={image.status === "completed" ? "default" : "secondary"}>
                    {image.status === "completed" ? "Ready" : "Processing"}
                  </Badge>
                  {image.hasDressImage && (
                    <Badge variant="outline" className="text-xs">
                      With Dress
                    </Badge>
                  )}
                </div>

                {/* Character Metadata */}
                <div className="space-y-1 text-xs">
                  {image.gender && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gender:</span>
                      <span className="font-medium capitalize">{image.gender}</span>
                    </div>
                  )}
                  {image.country && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Origin:</span>
                      <span className="font-medium">{image.country}</span>
                    </div>
                  )}
                  {image.skinTone && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Skin Tone:</span>
                      <span className="font-medium capitalize">{image.skinTone}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">{image.prompt}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}













