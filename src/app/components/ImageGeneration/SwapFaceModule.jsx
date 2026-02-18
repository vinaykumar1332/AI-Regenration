import { useState, useRef } from "react";
import "./SwapFaceModule.css";
import { Card } from "@/app/components/ui/Card/card";
import { Button } from "@/app/components/ui/Button/button";
import { Label } from "@/app/components/ui/Label/label";
import { Skeleton } from "@/app/components/ui/Skeleton/skeleton";
import { Badge } from "@/app/components/ui/Badge/badge";
import { Upload, Image as ImageIcon, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useAppConfig } from "@/appConfig/useAppConfig";
import { swapFaceApi } from "@/services/api";

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
    const [removingIds, setRemovingIds] = useState(new Set());
    const inputRef = useRef(null);

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

        // Clear input so same file can be selected again
        if (inputRef.current) {
            inputRef.current.value = '';
        }
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
        // Add animation class
        setRemovingIds((prev) => new Set([...prev, id]));

        // Remove after animation completes
        setTimeout(() => {
            onFilesChange(files.filter((f) => f.id !== id));
            setRemovingIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }, 200);
    };

    return (
        <div className="swap-face-upload-section">
            {/* Input & Dropzone Section */}
            <div className="swap-face-upload-card">
                <div
                    className="swap-face-upload-inner"
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg,image/png"
                        multiple
                        className="swap-face-upload-input"
                        onChange={onInputChange}
                    />

                    <div className="swap-face-upload-header">
                        <div className="swap-face-upload-title">
                            <p className="swap-face-upload-label">
                                <ImageIcon className="swap-face-upload-icon" />
                                {label}
                                {required && <span className="swap-face-upload-required">*</span>}
                            </p>
                            {hint && (
                                <p className="swap-face-upload-hint">
                                    {hint}
                                </p>
                            )}
                        </div>
                        <span className="swap-face-upload-cta">
                            Drag & drop or click
                        </span>
                    </div>

                    <div className="swap-face-upload-dropzone">
                        <div className="swap-face-upload-dropzone-inner">
                            <Upload className="swap-face-upload-dropzone-icon" />
                            <span>JPG / PNG, up to 10MB each</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Section – Below Input */}
            {files.length > 0 && (
                <div className="swap-face-upload-selected">
                    <p className="swap-face-upload-selected-label">
                        Selected ({files.length})
                    </p>
                    <div className="swap-face-upload-selected-list">
                        {files.map((item) => (
                            <div
                                key={item.id}
                                className={`swap-face-upload-pill ${removingIds.has(item.id) ? 'removing' : ''}`}
                            >
                                {item.preview ? (
                                    <span className="swap-face-upload-thumb">
                                        <img
                                            src={item.preview}
                                            alt={item.name}
                                            className="swap-face-upload-thumb-img"
                                        />
                                    </span>
                                ) : (
                                    <span className="swap-face-upload-thumb-fallback">
                                        IMG
                                    </span>
                                )}
                                <span className="swap-face-upload-pill-name">{item.name}</span>
                                <button
                                    type="button"
                                    aria-label="Remove image"
                                    className="swap-face-upload-remove"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(item.id);
                                    }}
                                >
                                    <X className="swap-face-upload-remove-icon" />
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

            const response = await swapFaceApi(
                {
                    inputImages: inputPayload,
                    referenceImages: referencePayload,
                    prompt: swapFacePrompt,
                    userId,
                },
                controller.signal
            );

            const data = response;

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
            <Card className="swap-face-card">
                <div className="swap-face-header">
                    <h2 className="swap-face-title">Swap Face Generation</h2>
                    <p className="swap-face-subtitle">
                        Upload your input fashion images and reference identity images. We apply a high-quality swap prompt from the backend for consistent, premium results.
                    </p>
                </div>

                {/* Step 1 – Upload Section */}
                <div className="swap-face-step swap-face-step-upload">
                    <p className="swap-face-step-label">Step 1 – Upload inputs</p>
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
                <div className="swap-face-step swap-face-step-generate">
                    <p className="swap-face-step-label">Step 2 – Generate</p>
                    <div className="swap-face-button-wrapper">
                        <Button
                            type="button"
                            className="swap-face-generate-button"
                            disabled={isSubmitting}
                            onClick={handleGenerate}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="swap-face-generate-loader" />
                                    Generating swap...
                                </>
                            ) : (
                                <>Generate Swap</>
                            )}
                        </Button>
                    </div>
                    <p className="swap-face-generate-helper">
                        Your images are encoded as base64 and sent with a curated swap prompt from the backend.
                    </p>
                    {showProgress && (
                        <div className="swap-face-progress">
                            <div className="swap-face-progress-info">
                                <Loader2 className="swap-face-progress-loader" />
                                <div className="swap-face-progress-text">
                                    <span>Processing swaps...</span>
                                    <span>{progress}%</span>
                                </div>
                            </div>
                            <div className="swap-face-progress-bar-bg">
                                <div
                                    className="swap-face-progress-bar-fill"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Results dashboard */}
            <div className="swap-face-results">
                <h3 className="swap-face-results-title">Recent Swaps</h3>
                {results.length === 0 ? (
                    <Card className="swap-face-results-empty">
                        <div className="swap-face-results-empty-inner">
                            <Skeleton className="swap-face-results-empty-skeleton" />
                            <div className="swap-face-results-empty-text">
                                <p className="swap-face-results-empty-title">No swaps yet</p>
                                <p>Generate a swap to see your outputs appear here.</p>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="swap-face-results-grid">
                        {results.map((image) => (
                            <Card
                                key={image.id}
                                className="swap-face-result-card"
                            >
                                <div className="swap-face-result-media">
                                    {image.status === "completed" ? (
                                        <img
                                            src={image.url}
                                            alt="Swap result"
                                            className="swap-face-result-img"
                                        />
                                    ) : (
                                        <Loader2 className="swap-face-result-loader" />
                                    )}
                                </div>
                                <div className="swap-face-result-body">
                                    <div className="swap-face-result-header">
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
                                        <div className="swap-face-result-meta">
                                            <span>Image</span>
                                            <span>•</span>
                                            <span>{new Date(image.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                    <p className="swap-face-result-caption">
                                        Swap result {typeof image.index === "number" ? `#${image.index + 1}` : ""}
                                    </p>
                                    {image.status === "completed" && (
                                        <div className="swap-face-result-actions">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="swap-face-result-btn"
                                                onClick={() => handlePreview(image)}
                                            >
                                                Preview
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="swap-face-result-btn"
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
