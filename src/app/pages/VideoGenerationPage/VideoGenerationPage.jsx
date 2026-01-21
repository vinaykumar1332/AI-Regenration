import { useState } from "react";
import { Card } from "@/app/components/ui/Card/card";
import { Button } from "@/app/components/ui/Button/button";
import { Textarea } from "@/app/components/ui/Textarea/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/Select/select";
import { Badge } from "@/app/components/ui/Badge/badge";
import { Video, Play, Download, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import mockData from "./mockData.json";

const { mockVideos } = mockData;

export function VideoGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [motionPreset, setMotionPreset] = useState("runway-walk");
  const [duration, setDuration] = useState("10s");
  const [resolution, setResolution] = useState("1080p");
  const [videos, setVideos] = useState(mockVideos);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    toast.success("Video generation started!");

    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Video generated successfully!");
    }, 3000);
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Video Generation</h1>
        <p className="text-muted-foreground">Create AI-powered videos with custom motion presets</p>
      </div>

      {/* Generation Form */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Shared Prompt</label>
            <Textarea
              placeholder="Describe the video content... (e.g., 'Professional model walking on fashion runway')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Motion Preset</label>
              <Select value={motionPreset} onValueChange={setMotionPreset}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="runway-walk">Runway Walk</SelectItem>
                  <SelectItem value="product-rotation">Product Rotation</SelectItem>
                  <SelectItem value="camera-pan">Camera Pan</SelectItem>
                  <SelectItem value="zoom-in">Zoom In</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Duration</label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10s">10 seconds</SelectItem>
                  <SelectItem value="20s">20 seconds</SelectItem>
                  <SelectItem value="30s">30 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Resolution</label>
              <Select value={resolution} onValueChange={setResolution}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                  <SelectItem value="4K">4K (Ultra HD)</SelectItem>
                </SelectContent>
              </Select>
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
                Generating Video...
              </>
            ) : (
              <>
                <Video className="w-5 h-5 mr-2" />
                Generate Video
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Video Results */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted relative group flex items-center justify-center">
                {video.status === "completed" ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20"></div>
                    <Play className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer" />
                  </>
                ) : video.status === "processing" ? (
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                ) : (
                  <div className="text-center">
                    <p className="text-red-600">Failed</p>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    variant={
                      video.status === "completed" ? "default" :
                        video.status === "processing" ? "secondary" :
                          "destructive"
                    }
                  >
                    {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                  </Badge>
                  <div className="flex gap-1 text-xs text-muted-foreground">
                    <span>{video.duration}</span>
                    <span>•</span>
                    <span>{video.resolution}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{video.prompt}</p>
                {video.status === "completed" && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Play className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                )}
                {video.status === "failed" && (
                  <Button size="sm" variant="outline" className="w-full">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Retry
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}













