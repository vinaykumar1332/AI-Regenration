import { useEffect, useMemo, useRef, useState } from "react";
import "./VirtualReshootModule.css";
import { Card } from "@/app/components/ui/Card/card";
import { Button } from "@/app/components/ui/Button/button";
import { Skeleton } from "@/app/components/ui/Skeleton/skeleton";
import { Badge } from "@/app/components/ui/Badge/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/Select/select";
import { ImageWithFallback } from "@/app/components/ImageWithFallback/ImageWithFallback";
import { Upload, Image as ImageIcon, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { virtualReshootApi } from "@/services/api";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB (images or zip)
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/zip"];

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
    if (file.size > MAX_FILE_SIZE) return "File size must be under 25MB";
    if (!ACCEPTED_TYPES.includes(file.type)) {
        return "Only JPG, PNG, or ZIP files are allowed";
    }
    return null;
}

function normalizeImageUrl(url) {
    if (typeof url !== "string" || !url) return "";
    if (!url.startsWith("http")) return url;

    // Unsplash URLs can be huge; add safe defaults if no query string.
    if (url.includes("images.unsplash.com") && !url.includes("?")) {
        return `${url}?auto=format&fit=crop&w=512&q=80`;
    }
    return url;
}

function FadeInImage({ src, alt, className }) {
    const [loaded, setLoaded] = useState(false);
    return (
        <ImageWithFallback
            src={src}
            alt={alt}
            className={`${className} ${loaded ? "loaded" : ""}`}
            onLoad={() => setLoaded(true)}
        />
    );
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
            } else {
                // zip: still encode as data URL for backend; no thumbnail
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
                type: file.type,
            });
        }

        onFilesChange(next);

        if (inputRef.current) {
            inputRef.current.value = "";
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
        setRemovingIds((prev) => new Set([...prev, id]));
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
        <div className="virtual-reshoot-upload-section">
            <div className="virtual-reshoot-upload-card">
                <div
                    className="virtual-reshoot-upload-inner"
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg,image/png,application/zip"
                        multiple
                        className="virtual-reshoot-upload-input"
                        onChange={onInputChange}
                    />

                    <div className="virtual-reshoot-upload-header">
                        <div className="virtual-reshoot-upload-title">
                            <p className="virtual-reshoot-upload-label">
                                <ImageIcon className="virtual-reshoot-upload-icon" />
                                {label}
                                {required && (
                                    <span className="virtual-reshoot-upload-required">*</span>
                                )}
                            </p>
                            {hint && <p className="virtual-reshoot-upload-hint">{hint}</p>}
                        </div>
                        <span className="virtual-reshoot-upload-cta">
                            Drag & drop or click
                        </span>
                    </div>

                    <div className="virtual-reshoot-upload-dropzone">
                        <div className="virtual-reshoot-upload-dropzone-inner">
                            <Upload className="virtual-reshoot-upload-dropzone-icon" />
                            <span>JPG / PNG / ZIP, up to 25MB each</span>
                        </div>
                    </div>
                </div>
            </div>

            {files.length > 0 && (
                <div className="virtual-reshoot-upload-selected">
                    <p className="virtual-reshoot-upload-selected-label">
                        Selected ({files.length})
                    </p>
                    <div className="virtual-reshoot-upload-selected-list">
                        {files.map((item) => (
                            <div
                                key={item.id}
                                className={`virtual-reshoot-upload-pill ${removingIds.has(item.id) ? "removing" : ""
                                    }`}
                            >
                                {item.preview && item.type?.startsWith("image/") ? (
                                    <span className="virtual-reshoot-upload-thumb">
                                        <img
                                            src={item.preview}
                                            alt={item.name}
                                            className="virtual-reshoot-upload-thumb-img"
                                        />
                                    </span>
                                ) : (
                                    <span className="virtual-reshoot-upload-thumb-fallback">
                                        {item.type === "application/zip" ? "ZIP" : "FILE"}
                                    </span>
                                )}
                                <span className="virtual-reshoot-upload-pill-name">
                                    {item.name}
                                </span>
                                <button
                                    type="button"
                                    aria-label="Remove file"
                                    className="virtual-reshoot-upload-remove"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(item.id);
                                    }}
                                >
                                    <X className="virtual-reshoot-upload-remove-icon" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export function VirtualReshootModule({ onResult }) {
    const [baseFiles, setBaseFiles] = useState([]);
    const [avatarsDb, setAvatarsDb] = useState(null);
    const [isLoadingAvatars, setIsLoadingAvatars] = useState(true);

    const [gender, setGender] = useState("");
    const [origin, setOrigin] = useState("");
    const [selectedAvatarId, setSelectedAvatarId] = useState("");
    const [selectedAvatarImageUrl, setSelectedAvatarImageUrl] = useState("");

    const [showAllImages, setShowAllImages] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [results, setResults] = useState([]);

    const [uiText, setUiText] = useState({
        title: "Virtual Reshoot",
        description: "Upload your image and transform it using AI-powered avatar selection.",
        genderLabel: "Select Gender",
        originLabel: "Select Origin",
        avatarLabel: "Select Avatar",
        generateButton: "Generate Reshoot",
        showAllImages: "Show All Images",
    });

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            setIsLoadingAvatars(true);
            try {
                const [avatarsRes, textRes] = await Promise.all([
                    fetch("/data/avatars.json"),
                    fetch("/en/ImageGeneration/VirtualReshoot.json"),
                ]);

                if (!avatarsRes.ok) {
                    throw new Error(`Failed to load avatars.json (${avatarsRes.status})`);
                }
                if (!textRes.ok) {
                    throw new Error(`Failed to load VirtualReshoot.json (${textRes.status})`);
                }

                const [avatarsJson, textJson] = await Promise.all([
                    avatarsRes.json(),
                    textRes.json(),
                ]);

                if (!isMounted) return;
                setAvatarsDb(avatarsJson);
                setUiText((prev) => ({
                    ...prev,
                    ...textJson,
                }));
            } catch (err) {
                console.error("Failed to load virtual reshoot config", err);
                toast.error("Failed to load avatars database");
            } finally {
                if (isMounted) setIsLoadingAvatars(false);
            }
        };

        load();
        return () => {
            isMounted = false;
        };
    }, []);

    const genderOptions = useMemo(() => {
        if (!avatarsDb) return [];
        return Object.keys(avatarsDb);
    }, [avatarsDb]);

    const originOptions = useMemo(() => {
        if (!avatarsDb || !gender || !avatarsDb[gender]) return [];
        return Object.keys(avatarsDb[gender]);
    }, [avatarsDb, gender]);

    const avatarList = useMemo(() => {
        if (!avatarsDb || !gender || !origin) return [];
        return avatarsDb?.[gender]?.[origin] || [];
    }, [avatarsDb, gender, origin]);

    const selectedAvatar = useMemo(() => {
        return avatarList.find((a) => a.id === selectedAvatarId) || null;
    }, [avatarList, selectedAvatarId]);

    useEffect(() => {
        if (!avatarsDb) return;
        if (!gender && genderOptions.length > 0) {
            setGender(genderOptions[0]);
        }
    }, [avatarsDb, genderOptions, gender]);

    useEffect(() => {
        if (!avatarsDb || !gender) return;

        const nextOrigins = Object.keys(avatarsDb[gender] || {});
        const nextOrigin = nextOrigins[0] || "";

        setOrigin((prev) => {
            if (prev && nextOrigins.includes(prev)) return prev;
            return nextOrigin;
        });

        // Reset selection when gender changes
        setSelectedAvatarId("");
        setSelectedAvatarImageUrl("");
    }, [avatarsDb, gender]);

    useEffect(() => {
        // Reset selection when origin changes
        setSelectedAvatarId("");
        setSelectedAvatarImageUrl("");
    }, [origin]);

    const handleSelectAvatar = (avatar) => {
        setSelectedAvatarId(avatar.id);
        const first = normalizeImageUrl(avatar?.images?.[0] || "");
        setSelectedAvatarImageUrl(first);
    };

    const handleGenerate = async () => {
        if (baseFiles.length === 0) {
            toast.error("Please upload at least one base image or zip");
            return;
        }

        if (!gender) {
            toast.error("Please select a gender");
            return;
        }

        if (!origin) {
            toast.error("Please select an origin");
            return;
        }

        if (!selectedAvatarImageUrl) {
            toast.error("Please select an avatar");
            return;
        }

        setIsSubmitting(true);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 90000);

        try {
            const basePayload = await Promise.all(
                baseFiles.map((item) => {
                    if (item.preview) return item.preview;
                    return readFilePreview(item.file);
                })
            );

            const response = await virtualReshootApi(
                {
                    baseImages: basePayload,
                    avatarImageUrl: selectedAvatarImageUrl,
                    gender,
                    origin,
                },
                controller.signal
            );

            const generationId = response?.generationId || `virtual_reshoot_${Date.now()}`;
            const timestamp = response?.timestamp || new Date().toISOString();

            const outputs =
                Array.isArray(response?.outputs) && response.outputs.length > 0
                    ? response.outputs
                    : response?.images || (response?.imageUrl ? [response.imageUrl] : []);

            const normalized = outputs
                .map((img, index) => {
                    const url = typeof img === "string" ? img : img?.image || img?.url || "";
                    return {
                        id: img?.id || `${generationId}_${index}`,
                        kind: "image",
                        url,
                        status: "completed",
                        index,
                        timestamp,
                    };
                })
                .filter((r) => r.url);

            if (normalized.length > 0) {
                setResults((prev) => [...normalized, ...prev]);
                normalized.forEach((r) => onResult?.(r));
                toast.success("Virtual reshoot generated");
                return;
            }

            // Fallback: backend returns analysisResponse (current Vertex flow)
            const analysis = response?.analysisResponse || response?.text || "";
            const textResult = {
                id: `${generationId}_analysis`,
                kind: "text",
                status: "completed",
                timestamp,
                text: analysis || "Generation completed, but no images were returned.",
            };
            setResults((prev) => [textResult, ...prev]);
            onResult?.(textResult);
            toast.success("Virtual reshoot processed");
        } catch (error) {
            console.error("Virtual reshoot error", error);
            if (error.name === "AbortError") {
                toast.error("Request timed out. Please try again.");
            } else {
                toast.error(error.message || "Failed to generate virtual reshoot");
            }
        } finally {
            clearTimeout(timeoutId);
            setIsSubmitting(false);
        }
    };

    const canShowAll = (selectedAvatar?.images?.length || 0) > 1;
    const modalImages = (selectedAvatar?.images || []).map((u) => normalizeImageUrl(u));

    return (
        <div className="virtual-reshoot-module">
            <Card className="virtual-reshoot-card">
                <div className="virtual-reshoot-header">
                    <h2 className="virtual-reshoot-title">{uiText.title}</h2>
                    <p className="virtual-reshoot-subtitle">{uiText.description}</p>
                </div>

                <div className="virtual-reshoot-step">
                    <p className="virtual-reshoot-step-label">Step 1 – Upload base image</p>
                    <MultipleUploadCard
                        label="Base Image(s)"
                        required
                        hint="Upload one or multiple base images (or a ZIP). Body, clothing, pose, and background are preserved from these."
                        files={baseFiles}
                        onFilesChange={setBaseFiles}
                    />
                </div>

                <div className="virtual-reshoot-step">
                    <p className="virtual-reshoot-step-label">Step 2 – Select avatar</p>

                    {isLoadingAvatars ? (
                        <div className="virtual-reshoot-options-grid">
                            <div className="virtual-reshoot-field">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="virtual-reshoot-field">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    ) : (
                        <div className="virtual-reshoot-options-grid">
                            <div className="virtual-reshoot-field">
                                <label className="virtual-reshoot-field-label">{uiText.genderLabel}</label>
                                <Select value={gender} onValueChange={setGender}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {genderOptions.map((g) => (
                                            <SelectItem key={g} value={g}>
                                                {g}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="virtual-reshoot-field">
                                <label className="virtual-reshoot-field-label">{uiText.originLabel}</label>
                                <Select
                                    value={origin}
                                    onValueChange={setOrigin}
                                    disabled={!gender || originOptions.length === 0}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {originOptions.map((o) => (
                                            <SelectItem key={o} value={o}>
                                                {o}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    <div className="virtual-reshoot-avatars">
                        <div className="virtual-reshoot-avatars-header">
                            <p className="virtual-reshoot-avatars-title">{uiText.avatarLabel}</p>
                        </div>

                        {isLoadingAvatars ? (
                            <div className="virtual-reshoot-avatar-grid">
                                {Array.from({ length: 8 }).map((_, idx) => (
                                    <Skeleton key={idx} className="h-36 w-full rounded-xl" />
                                ))}
                            </div>
                        ) : avatarList.length === 0 ? (
                            <Card className="p-4">
                                <p className="text-sm text-muted-foreground">
                                    No avatars found for the selected gender/origin.
                                </p>
                            </Card>
                        ) : (
                            <div className="virtual-reshoot-avatar-grid">
                                {avatarList.map((avatar) => {
                                    const img = normalizeImageUrl(avatar?.images?.[0] || "");
                                    const isSelected = avatar.id === selectedAvatarId;
                                    return (
                                        <div
                                            key={avatar.id}
                                            className={`virtual-reshoot-avatar-card ${isSelected ? "selected" : ""
                                                }`}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => handleSelectAvatar(avatar)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    handleSelectAvatar(avatar);
                                                }
                                            }}
                                        >
                                            <div className="virtual-reshoot-avatar-media">
                                                <FadeInImage
                                                    src={img}
                                                    alt={avatar.name}
                                                    className="virtual-reshoot-avatar-img"
                                                />
                                            </div>
                                            <div>
                                                <p className="virtual-reshoot-avatar-name">{avatar.name}</p>
                                                <p className="virtual-reshoot-avatar-meta">
                                                    {avatar.images?.length || 0} image(s)
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {selectedAvatar && selectedAvatarImageUrl && (
                            <Card className="p-4">
                                <div className="virtual-reshoot-selected-preview">
                                    <div className="virtual-reshoot-selected-media">
                                        <FadeInImage
                                            src={selectedAvatarImageUrl}
                                            alt={selectedAvatar.name}
                                            className="virtual-reshoot-selected-img"
                                        />
                                    </div>
                                    <div className="virtual-reshoot-selected-body">
                                        <p className="virtual-reshoot-selected-title">
                                            Selected: {selectedAvatar.name}
                                        </p>
                                        <p className="virtual-reshoot-selected-subtitle">
                                            Identity anchor image will be used for the face only.
                                        </p>
                                        <div className="virtual-reshoot-selected-actions">
                                            {canShowAll && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setShowAllImages(true)}
                                                >
                                                    {uiText.showAllImages}
                                                </Button>
                                            )}
                                            <Badge variant="secondary">
                                                {gender} / {origin}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>

                <div className="virtual-reshoot-step">
                    <p className="virtual-reshoot-step-label">Step 3 – Generate</p>
                    <div className="virtual-reshoot-button-wrapper">
                        <Button
                            type="button"
                            className="virtual-reshoot-generate-button"
                            disabled={isSubmitting}
                            onClick={handleGenerate}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="virtual-reshoot-generate-loader" />
                                    Generating...
                                </>
                            ) : (
                                <>{uiText.generateButton}</>
                            )}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Sends base images + selected avatar URL to the backend. The AI prompt is hardcoded server-side.
                    </p>
                </div>
            </Card>

            <div className="virtual-reshoot-results">
                <h3 className="virtual-reshoot-results-title">Recent Reshoots</h3>
                {results.length === 0 ? (
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-12 w-12 rounded-xl" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium">No reshoots yet</p>
                                <p className="text-sm text-muted-foreground">
                                    Generate a reshoot to see outputs here.
                                </p>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="virtual-reshoot-results-grid">
                        {results.map((item, index) => (
                            <Card key={item.id} className="virtual-reshoot-result-card">
                                {item.kind === "image" ? (
                                    <div className="virtual-reshoot-result-media">
                                        <img
                                            src={item.url}
                                            alt="Virtual reshoot result"
                                            className="virtual-reshoot-result-img"
                                        />
                                    </div>
                                ) : (
                                    <div className="virtual-reshoot-result-body">
                                        <div className="virtual-reshoot-result-meta">
                                            <Badge variant="secondary">Text</Badge>
                                            <span>•</span>
                                            <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                        <p className="virtual-reshoot-result-caption">
                                            Result {index + 1}
                                        </p>
                                        <p className="virtual-reshoot-result-text">{item.text}</p>
                                    </div>
                                )}

                                {item.kind === "image" && (
                                    <div className="virtual-reshoot-result-body">
                                        <div className="virtual-reshoot-result-meta">
                                            <Badge variant="default">Completed</Badge>
                                            <span>•</span>
                                            <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                        <p className="virtual-reshoot-result-caption">Reshoot output</p>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {showAllImages && selectedAvatar && (
                <div
                    className="virtual-reshoot-modal-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Avatar images"
                    onClick={() => setShowAllImages(false)}
                >
                    <div
                        className="virtual-reshoot-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="virtual-reshoot-modal-header">
                            <p className="virtual-reshoot-modal-title">
                                {selectedAvatar.name} — {modalImages.length} image(s)
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowAllImages(false)}
                            >
                                Close
                            </Button>
                        </div>
                        <div className="virtual-reshoot-modal-grid">
                            {modalImages.map((imgUrl) => (
                                <div
                                    key={imgUrl}
                                    className="virtual-reshoot-modal-image"
                                    onClick={() => {
                                        setSelectedAvatarImageUrl(imgUrl);
                                        setShowAllImages(false);
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            setSelectedAvatarImageUrl(imgUrl);
                                            setShowAllImages(false);
                                        }
                                    }}
                                >
                                    <FadeInImage src={imgUrl} alt="Avatar option" className="" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
