import { useState } from "react";
import "./SwapFaceModule.css";
import { Card } from "@/app/components/ui/Card/card";
import { Button } from "@/app/components/ui/Button/button";
import { Label } from "@/app/components/ui/Label/label";
import { Skeleton } from "@/app/components/ui/Skeleton/skeleton";
import { Badge } from "@/app/components/ui/Badge/badge";
import { Upload, Image as ImageIcon, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useAppConfig } from "@/appConfig/useAppConfig";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

function readFilePreview(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function validateFile(file) {
    if (!file) return "File is required";
    if (file.size > MAX_FILE_SIZE) return "File size must be under 10MB";
    if (!ACCEPTED_TYPES.includes(file.type)) {
        return "Only JPG or PNG files are allowed";
    }
    return null;
}

function MultipleUploadCard({ label, required, hint, files, onFilesChange }) {
    const handleFiles = async (fileList) => {
        const incoming = Array.from(fileList || []);
        if (!incoming.length) return;

        const next = [...files];

        for (const file of incoming) {
            const error = validateFile(file);
            if (error) {
                toast.error(`${file.name}: ${error}`);
                continue;
            }

            let preview = null;
            if (file.type.startsWith("image/")) {
                try {
                    preview = await readFilePreview(file);
                } catch (err) {
                    console.error("Failed to read file", err);
                    toast.error(`Failed to read ${file.name}`);
                }
            }

            next.push({
                id: `${file.name}_${file.lastModified}_${file.size}`,
                file,
                name: file.name,
                preview,
            });
        }

        onFilesChange(next);
    };

    const onInputChange = async (event) => {
        await handleFiles(event.target.files);
    };

    const onDrop = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        await handleFiles(event.dataTransfer.files);
    };

    const onDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleRemove = (id) => {
        onFilesChange(files.filter((f) => f.id !== id));
    };

    return (
        <div className="swap-face-upload-section space-y-4">
            {/* Input & Dropzone Section */}
            <div className="swap-face-upload-card p-4 group">
                <div
                    className="swap-face-upload-inner relative flex flex-col gap-3"
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                >
                    <input
                        type="file"
                        accept="image/jpeg,image/png"
                        multiple
                        className="swap-face-upload-input"
                        onChange={onInputChange}
                    />

                    <div className="swap-face-upload-header flex items-center justify-between gap-2">
                        <div className="swap-face-upload-title space-y-1">
                            <p className="swap-face-upload-label text-sm font-medium text-foreground flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-primary" />
                                {label}
                                {required && <span className="text-xs text-rose-400">*</span>}
                            </p>
                            {hint && (
                                <p className="swap-face-upload-hint text-[11px] text-muted-foreground">
                                    {hint}
                                </p>
                            )}
                        </div>
                        <span className="swap-face-upload-cta text-[11px] text-muted-foreground hidden sm:inline-flex">
                            Drag & drop or click
                        </span>
                    </div>

                    <div className="swap-face-upload-dropzone flex h-24 items-center justify-center rounded-lg border border-dashed border-input bg-muted text-xs text-muted-foreground group-hover:border-primary/70 group-hover:text-primary transition-colors">
                        <div className="swap-face-upload-dropzone-inner flex flex-col items-center gap-1">
                            <Upload className="w-4 h-4" />
                            <span>JPG / PNG, up to 10MB each</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Section – Below Input */}
            {files.length > 0 && (
                <div className="swap-face-upload-selected space-y-2">
                    <p className="swap-face-upload-selected-label text-[11px] text-muted-foreground">
                        Selected ({files.length})
                    </p>
                    <div className="swap-face-upload-selected-list flex flex-wrap gap-3">
                        {files.map((item) => (
                            <div
                                key={item.id}
                                className="swap-face-upload-pill flex items-center gap-3 rounded-md border border-input bg-card px-3 py-2 text-[11px] text-foreground hover:border-primary/70 hover:text-primary-foreground transition-all duration-150 ease-out"
                            >
                                {item.preview ? (
                                    <span className="swap-face-upload-thumb w-14 h-14 rounded-md overflow-hidden border border-input">
                                        <img
                                            src={item.preview}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </span>
                                ) : (
                                    <span className="swap-face-upload-thumb-fallback w-14 h-14 rounded-md bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                                        IMG
                                    </span>
                                )}
                                <span className="max-w-[140px] truncate text-left">{item.name}</span>
                                <button
                                    type="button"
                                    aria-label="Remove image"
                                    className="swap-face-upload-remove ml-1 inline-flex items-center justify-center rounded-full bg-muted/70 hover:bg-destructive hover:text-destructive-foreground transition-all duration-150 ease-out w-6 h-6"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(item.id);
                                    }}
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export function SwapFaceModule({ onResult }) {
    const { static: staticConfig } = useAppConfig();
    const swapFacePrompt = staticConfig?.swapFacePrompt || "";

    const [inputImages, setInputImages] = useState([]);
    const [referenceImages, setReferenceImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showProgress, setShowProgress] = useState(false);
    const [results, setResults] = useState([]);

    const handleGenerate = async () => {
        if (inputImages.length === 0) {
            toast.error("Please upload at least one input image");
            return;
        }

        if (referenceImages.length === 0) {
            toast.error("Please upload at least one reference image");
            return;
        }

        if (!swapFacePrompt) {
            toast.error("Swap-face prompt is not configured");
            return;
        }

        setIsSubmitting(true);
        setProgress(0);
        setShowProgress(true);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);
        let progressTimer;

        try {
            progressTimer = window.setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) return prev;
                    return prev + 3;
                });
            }, 350);

            const toBase64Array = async (items) => {
                return Promise.all(
                    items.map((item) => {
                        if (item.preview) return item.preview;
                        return readFilePreview(item.file);
                    })
                );
            };

            const inputPayload = await toBase64Array(inputImages);
            const referencePayload = await toBase64Array(referenceImages);

            let userId = null;
            try {
                userId = window?.localStorage?.getItem("userId") || null;
            } catch {
                // ignore
            }

            const response = await fetch("/api/swap-face", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inputImages: inputPayload,
                    referenceImages: referencePayload,
                    prompt: swapFacePrompt,
                    userId,
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to generate swapped image");
            }

            const generationId = data.generationId || `swap_${Date.now()}`;
            const outputs =
                Array.isArray(data.outputs) && data.outputs.length > 0
                    ? data.outputs
                    : data.images || (data.imageUrl ? [data.imageUrl] : []);

            const normalizedResults = outputs.map((img, index) => {
                const url =
                    typeof img === "string"
                        ? img
                        : img.image || img.url || "";
                return {
                    id: img.id || `${generationId}_${index}`,
                    url,
                    status: "completed",
                    index,
                    timestamp: data.timestamp || new Date().toISOString(),
                };
            });

            setProgress(100);
            setResults((prev) => [...normalizedResults, ...prev]);
            normalizedResults.forEach((result) => onResult?.(result));
            toast.success("Swap face images generated");
        } catch (error) {
            console.error("Swap face error", error);
            if (error.name === "AbortError") {
                toast.error("Request timed out. Please try again.");
            } else {
                toast.error(error.message || "Failed to generate swapped image");
            }
        } finally {
            clearTimeout(timeoutId);
            if (progressTimer) {
                clearInterval(progressTimer);
            }
            setTimeout(() => {
                setShowProgress(false);
            }, 600);
            setIsSubmitting(false);
        }
    };

    const handleDownload = (image) => {
        if (!image?.url) return;
        const link = document.createElement("a");
        link.href = image.url;
        link.download = `${image.id || "swap"}.png`;
        link.click();
    };

    const handlePreview = (image) => {
        if (!image?.url) return;
        window.open(image.url, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="swap-face-module">
            <Card className="swap-face-card p-6 lg:p-7 space-y-6">
                <div className="swap-face-header space-y-2">
                    <h2 className="swap-face-title text-2xl font-semibold text-foreground">Swap Face Generation</h2>
                    <p className="swap-face-subtitle text-sm text-muted-foreground">
                        Upload your input fashion images and reference identity images. We apply a high-quality swap prompt from the backend for consistent, premium results.
                    </p>
                </div>

                {/* Step 1 – Upload Section */}
                <div className="swap-face-step swap-face-step-upload space-y-3">
                    <p className="swap-face-step-label text-xs font-semibold tracking-wide text-muted-foreground uppercase">Step 1 – Upload inputs</p>
                    <div className="swap-face-upload-grid">
                        <MultipleUploadCard
                            label="Input Images"
                            required
                            hint="Upload one or multiple fashion images that should be used as the base."
                            files={inputImages}
                            onFilesChange={setInputImages}
                        />
                        <MultipleUploadCard
                            label="Reference Identity"
                            required
                            hint="Upload one or more face images whose identity should be transferred."
                            files={referenceImages}
                            onFilesChange={setReferenceImages}
                        />
                    </div>
                </div>

                {/* Step 2 – Generate */}
                <div className="swap-face-step swap-face-step-generate space-y-3">
                    <p className="swap-face-step-label text-xs font-semibold tracking-wide text-muted-foreground uppercase">Step 2 – Generate</p>
                    <div className="flex justify-center">
                        <Button
                            type="button"
                            className="swap-face-generate-button h-11 w-full max-w-xs bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/40"
                            disabled={isSubmitting}
                            onClick={handleGenerate}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating swap...
                                </>
                            ) : (
                                <>Generate Swap</>
                            )}
                        </Button>
                    </div>
                    <p className="swap-face-generate-helper text-[11px] text-muted-foreground">
                        Your images are encoded as base64 and sent with a curated swap prompt from the backend.
                    </p>
                    {showProgress && (
                        <div className="swap-face-progress mt-4">
                            <div className="flex items-center gap-3 mb-2">
                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                <div className="flex-1 flex justify-between text-[12px] text-muted-foreground">
                                    <span>Processing swaps...</span>
                                    <span>{progress}%</span>
                                </div>
                            </div>
                            <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Results dashboard */}
            <div className="swap-face-results space-y-3 mt-6">
                <h3 className="swap-face-results-title text-xl font-semibold text-foreground mb-1">Recent Swaps</h3>
                {results.length === 0 ? (
                    <Card className="swap-face-results-empty border border-dashed border-input bg-card p-4">
                        <div className="swap-face-results-empty-inner flex items-center gap-3 text-xs text-muted-foreground">
                            <Skeleton className="swap-face-results-empty-skeleton w-16 h-16 rounded-lg bg-muted" />
                            <div className="space-y-1">
                                <p className="font-medium text-foreground">No swaps yet</p>
                                <p>Generate a swap to see your outputs appear here.</p>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="swap-face-results-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {results.map((image) => (
                            <Card
                                key={image.id}
                                className="swap-face-result-card overflow-hidden hover:shadow-lg transition-shadow bg-card border border-border"
                            >
                                <div className="swap-face-result-media aspect-[3/4] bg-muted flex items-center justify-center overflow-hidden">
                                    {image.status === "completed" ? (
                                        <img
                                            src={image.url}
                                            alt="Swap result"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                    )}
                                </div>
                                <div className="swap-face-result-body p-4">
                                    <div className="swap-face-result-header flex items-center justify-between mb-3">
                                        <Badge
                                            variant={
                                                image.status === "completed"
                                                    ? "default"
                                                    : image.status === "processing"
                                                        ? "secondary"
                                                        : "destructive"
                                            }
                                        >
                                            {image.status.charAt(0).toUpperCase() + image.status.slice(1)}
                                        </Badge>
                                        <div className="swap-face-result-meta flex gap-1 text-xs text-muted-foreground">
                                            <span>Image</span>
                                            <span>•</span>
                                            <span>{new Date(image.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                    <p className="swap-face-result-caption text-sm text-muted-foreground mb-3 line-clamp-2">
                                        Swap result {typeof image.index === "number" ? `#${image.index + 1}` : ""}
                                    </p>
                                    {image.status === "completed" && (
                                        <div className="swap-face-result-actions flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() => handlePreview(image)}
                                            >
                                                Preview
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() => handleDownload(image)}
                                            >
                                                Download
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
