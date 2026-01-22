import React, { useState } from "react";
import { Image, Video, Loader2 } from "lucide-react";
import { generateAIPrompt } from "./avatarGalleryData";
import "./AvatarModule.css";
import { toast } from "sonner";

export function GenerationPanel({ selectedAvatar, styleReference }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationType, setGenerationType] = useState("image");
    const [generatedPrompt, setGeneratedPrompt] = useState(null);

    const handleGenerate = (type) => {
        if (!selectedAvatar) {
            toast.error("Please select an avatar first");
            return;
        }

        const prompt = generateAIPrompt(selectedAvatar, styleReference, type);

        if (!prompt) {
            toast.error("Failed to generate prompt");
            return;
        }

        setGenerationType(type);
        setGeneratedPrompt(prompt);
        setIsGenerating(true);

        // Simulate API call
        setTimeout(() => {
            setIsGenerating(false);
            toast.success(`${type === "image" ? "Image" : "Video"} generation started!`);
            console.log("Generation Payload:", prompt);
        }, 1500);
    };

    return (
        <div className="generation-panel-wrapper">
            <div className="generation-panel">
                {/* Header */}
                <div className="generation-panel__header">
                    <h3 className="generation-panel__title">Generate Content</h3>
                    {selectedAvatar && (
                        <p className="generation-panel__subtitle">
                            Using: <span className="font-semibold">{selectedAvatar.name}</span>
                        </p>
                    )}
                </div>

                {/* Generation Type Selection */}
                <div className="generation-panel__types">
                    <button
                        className={`generation-panel__type-btn ${generationType === "image" ? "generation-panel__type-btn--active" : ""
                            }`}
                        onClick={() => setGenerationType("image")}
                        disabled={isGenerating}
                    >
                        <Image className="w-5 h-5 mr-2" />
                        Image Generation
                    </button>
                    <button
                        className={`generation-panel__type-btn ${generationType === "video" ? "generation-panel__type-btn--active" : ""
                            }`}
                        onClick={() => setGenerationType("video")}
                        disabled={isGenerating}
                    >
                        <Video className="w-5 h-5 mr-2" />
                        Video Generation
                    </button>
                </div>

                {/* Prompt Display */}
                {generatedPrompt && (
                    <div className="generation-panel__prompt">
                        <p className="text-xs font-semibold mb-2">Generated Prompt:</p>
                        <code className="text-xs bg-muted/50 p-3 rounded block break-words">
                            {generatedPrompt.fullPrompt}
                        </code>
                    </div>
                )}

                {/* Reference Info */}
                <div className="generation-panel__references">
                    <div className="generation-panel__reference-item">
                        <span className="text-xs font-semibold">Face Reference:</span>
                        <span className="text-xs text-emerald-400">
                            {selectedAvatar ? "✓ Ready" : "⚠ Not selected"}
                        </span>
                    </div>
                    <div className="generation-panel__reference-item">
                        <span className="text-xs font-semibold">Style Reference:</span>
                        <span className="text-xs text-emerald-400">
                            {styleReference ? "✓ Uploaded" : "○ Optional"}
                        </span>
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    className="generation-panel__generate-btn"
                    onClick={() => handleGenerate(generationType)}
                    disabled={!selectedAvatar || isGenerating}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            {generationType === "image" ? (
                                <Image className="w-5 h-5 mr-2" />
                            ) : (
                                <Video className="w-5 h-5 mr-2" />
                            )}
                            Generate {generationType === "image" ? "Image" : "Video"}
                        </>
                    )}
                </button>

                {/* Status */}
                {!selectedAvatar && (
                    <p className="generation-panel__status-warning">
                        ⚠ Select an avatar to enable generation
                    </p>
                )}
            </div>
        </div>
    );
}
