import { useState } from "react";
import { Card } from "@/app/components/ui/Card/card";
import { Button } from "@/app/components/ui/Button/button";
import { Textarea } from "@/app/components/ui/Textarea/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/Select/select";
import { Badge } from "@/app/components/ui/Badge/badge";
import { Skeleton } from "@/app/components/ui/Skeleton/skeleton";
import { Upload, Sparkles, Download, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";

const mockImages = [
  { id: 1, status: "completed", prompt: "Modern office workspace", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop" },
  { id: 2, status: "completed", prompt: "Abstract tech background", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop" },
  { id: 3, status: "processing", prompt: "Futuristic cityscape", url: "" },
  { id: 4, status: "completed", prompt: "AI neural network visualization", url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=400&fit=crop" },
];

export function ImageGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [identity, setIdentity] = useState("default");
  const [images, setImages] = useState(mockImages);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    toast.success("Image generation started!");

    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Image generated successfully!");
    }, 3000);
  };

  const handleDownload = (imageId) => {
    toast.success("Download started");
  };

  const handleRegenerate = (imageId) => {
    toast.info("Regenerating image...");
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Image Generation</h1>
        <p className="text-muted-foreground">Create stunning AI-generated images from text prompts</p>
      </div>

      {/* Generation Form */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Prompt</label>
            <Textarea
              placeholder="Describe the image you want to generate... (e.g., 'A modern office with natural lighting and minimalist design')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Be specific and descriptive for best results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Identity Selector</label>
              <Select value={identity} onValueChange={setIdentity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Style</SelectItem>
                  <SelectItem value="photorealistic">Photorealistic</SelectItem>
                  <SelectItem value="artistic">Artistic</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Optional Image Upload</label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Upload className="w-5 h-5" />
                  <span className="text-sm">Drop reference image or click to upload</span>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
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
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={image.status === "completed" ? "default" : "secondary"}>
                    {image.status === "completed" ? "Completed" : "Processing"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{image.prompt}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}













