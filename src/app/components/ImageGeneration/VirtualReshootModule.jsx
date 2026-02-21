import { useEffect, useMemo, useRef, useState } from "react";
import "./VirtualReshootModule.css";
import { Card } from "@/app/components/ui/Card/card";
import { Button } from "@/app/components/ui/Button/button";
import { Skeleton } from "@/app/components/ui/Skeleton/skeleton";
import { Badge } from "@/app/components/ui/Badge/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/app/components/ui/Accordion/accordion";
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
import { useAppConfig } from "@/appConfig/useAppConfig";
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

function validateFile(file, copy) {
    if (!file) return copy?.errors?.fileRequired || "File is required";
    if (file.size > MAX_FILE_SIZE) return copy?.errors?.fileTooLarge || "File size must be under 25MB";
    if (!ACCEPTED_TYPES.includes(file.type)) {
        return copy?.errors?.invalidFileType || "Only JPG, PNG, or ZIP files are allowed";
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

function MultipleUploadCard({ label, required, hint, files, onFilesChange, copy }) {
    const [removingIds, setRemovingIds] = useState(new Set());
    const inputRef = useRef(null);

    const handleFiles = async (fileList) => {
        const incoming = Array.from(fileList || []);
        if (!incoming.length) return;

        const next = [...files];

        for (const file of incoming) {
            const error = validateFile(file, copy);
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
                    toast.error(`${copy?.errors?.readFileFailed || "Failed to read"} ${file.name}`);
                }
            } else {
                // zip: still encode as data URL for backend; no thumbnail
                try {
                    preview = await readFilePreview(file);
                } catch (err) {
                    console.error("Failed to read file", err);
                    toast.error(`${copy?.errors?.readFileFailed || "Failed to read"} ${file.name}`);
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
                            {copy?.dragDrop || "Drag & drop or click"}
                        </span>
                    </div>

                    <div className="virtual-reshoot-upload-dropzone">
                        <div className="virtual-reshoot-upload-dropzone-inner">
                            <Upload className="virtual-reshoot-upload-dropzone-icon" />
                            <span>{copy?.fileTypes || "JPG / PNG / ZIP, up to 25MB each"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {files.length > 0 && (
                <div className="virtual-reshoot-upload-selected">
                    <p className="virtual-reshoot-upload-selected-label">
                        {(copy?.selected || "Selected")} ({files.length})
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
                                    aria-label={copy?.removeFile || "Remove file"}
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
    const { text } = useAppConfig();
    const copy = text?.imageGeneration?.virtualReshoot || {};
    const [baseFiles, setBaseFiles] = useState([]);
    const [avatarsDb, setAvatarsDb] = useState(null);
    const [isLoadingAvatars, setIsLoadingAvatars] = useState(true);

    const [showUploadGuide, setShowUploadGuide] = useState(false);
    const [recommendedAccordionValue, setRecommendedAccordionValue] = useState("");
    const [avoidAccordionValue, setAvoidAccordionValue] = useState("");
    const [isUploadGuideClosing, setIsUploadGuideClosing] = useState(false);

    const uploadGuideCloseTimeoutRef = useRef(null);

    const [gender, setGender] = useState("");
    const [origin, setOrigin] = useState("");
    const [selectedAvatarId, setSelectedAvatarId] = useState("");
    const [selectedAvatarImageUrl, setSelectedAvatarImageUrl] = useState("");

    const [showAllImages, setShowAllImages] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [results, setResults] = useState([]);

    useEffect(() => {
        const id = setTimeout(() => setShowUploadGuide(true), 300);
        return () => clearTimeout(id);
    }, []);

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            setIsLoadingAvatars(true);
            try {
                const avatarsRes = await fetch("/data/avatars.json");

                if (!avatarsRes.ok) {
                    throw new Error(`Failed to load avatars.json (${avatarsRes.status})`);
                }
                const avatarsJson = await avatarsRes.json();

                if (!isMounted) return;
                setAvatarsDb(avatarsJson);
            } catch (err) {
                console.error("Failed to load virtual reshoot config", err);
                toast.error(copy?.errors?.configFailed || "Failed to load avatars database");
            } finally {
                if (isMounted) setIsLoadingAvatars(false);
            }
        };

        load();
        return () => {
            isMounted = false;
        };
    }, [copy?.errors?.configFailed]);

    useEffect(() => {
        if (!showUploadGuide) return;
        if (isUploadGuideClosing) return;

        const isDesktop =
            typeof window !== "undefined" &&
            window.matchMedia &&
            window.matchMedia("(min-width: 768px)").matches;

        const id = setTimeout(() => {
            setRecommendedAccordionValue("recommended");
            if (isDesktop) setAvoidAccordionValue("avoid");
        }, 450);

        return () => clearTimeout(id);
    }, [showUploadGuide, isUploadGuideClosing]);

    useEffect(() => {
        return () => {
            if (uploadGuideCloseTimeoutRef.current) {
                clearTimeout(uploadGuideCloseTimeoutRef.current);
                uploadGuideCloseTimeoutRef.current = null;
            }
        };
    }, []);

    const closeUploadGuide = () => {
        if (isUploadGuideClosing) return;
        setIsUploadGuideClosing(true);

        // Collapse dropdown first so the user sees it close.
        setRecommendedAccordionValue("");
        setAvoidAccordionValue("");

        if (uploadGuideCloseTimeoutRef.current) {
            clearTimeout(uploadGuideCloseTimeoutRef.current);
        }

        uploadGuideCloseTimeoutRef.current = setTimeout(() => {
            setShowUploadGuide(false);
            setIsUploadGuideClosing(false);
            uploadGuideCloseTimeoutRef.current = null;
        }, 220);
    };

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

    const handleSelectAvatar = async (avatar) => {
        setSelectedAvatarId(avatar.id);
        const firstUrl = normalizeImageUrl(avatar?.images?.[0] || "");
        // if it's a local asset path, fetch and convert to base64
        if (firstUrl.startsWith("/")) {
            try {
                const resp = await fetch(firstUrl);
                const blob = await resp.blob();
                const reader = new FileReader();
                reader.onloadend = () => {
                    setSelectedAvatarImageUrl(reader.result);
                };
                reader.readAsDataURL(blob);
            } catch (err) {
                console.error("Failed to load avatar image", err);
                setSelectedAvatarImageUrl(firstUrl);
            }
        } else {
            setSelectedAvatarImageUrl(firstUrl);
        }
    };

    const handleGenerate = async () => {
        if (baseFiles.length === 0) {
            toast.error(copy?.errors?.uploadBase || "Please upload at least one base image or zip");
            return;
        }


        if (!selectedAvatarImageUrl) {
            toast.error(copy?.errors?.selectAvatar || "Please select an avatar");
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
                toast.success(copy?.success?.generated || "Virtual reshoot generated");
                return;
            }

            // Fallback: backend returns analysisResponse (current Vertex flow)
            const analysis = response?.analysisResponse || response?.text || "";
            const textResult = {
                id: `${generationId}_analysis`,
                kind: "text",
                status: "completed",
                timestamp,
                text: analysis || copy?.fallbackTextResult || "Generation completed, but no images were returned.",
            };
            setResults((prev) => [textResult, ...prev]);
            onResult?.(textResult);
            toast.success(copy?.success?.processed || "Virtual reshoot processed");
        } catch (error) {
            console.error("Virtual reshoot error", error);
            if (error.name === "AbortError") {
                toast.error(copy?.errors?.timeout || "Request timed out. Please try again.");
            } else {
                toast.error(error.message || copy?.errors?.generationFailed || "Failed to generate virtual reshoot");
            }
        } finally {
            clearTimeout(timeoutId);
            setIsSubmitting(false);
        }
    };

    const canShowAll = (selectedAvatar?.images?.length || 0) > 1;
    const modalImages = (selectedAvatar?.images || []).map((u) => normalizeImageUrl(u));
    const uploadGuide = copy?.uploadGuide || {};
    const uploadGuideExamples = Array.isArray(uploadGuide?.exampleImages)
        ? uploadGuide.exampleImages
        : [];

    return (
        <div className="virtual-reshoot-module">
            {showUploadGuide && (
                <div
                    className={`virtual-reshoot-modal-overlay ${isUploadGuideClosing ? "is-closing" : ""}`}
                    role="dialog"
                    aria-modal="true"
                    aria-label={copy?.uploadGuideAria || "Upload guidelines"}
                    onClick={() => closeUploadGuide()}
                >
                    <div
                        className={`virtual-reshoot-modal virtual-reshoot-guide-modal ${isUploadGuideClosing ? "is-closing" : ""}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="virtual-reshoot-modal-header">
                            <div className="virtual-reshoot-guide-header-text">
                                <p className="virtual-reshoot-modal-title">
                                    {uploadGuide.title || "Before you upload: best results tips"}
                                </p>
                                {uploadGuide.subtitle ? (
                                    <p className="virtual-reshoot-guide-subtitle">{uploadGuide.subtitle}</p>
                                ) : null}
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                className="virtual-reshoot-guide-close"
                                onClick={() => closeUploadGuide()}
                            >
                                {uploadGuide.closeButton || "Close"}
                            </Button>
                        </div>

                        <div className="virtual-reshoot-guide-columns">
                            <Accordion
                                type="single"
                                collapsible
                                value={recommendedAccordionValue}
                                onValueChange={setRecommendedAccordionValue}
                                className="virtual-reshoot-guide-col virtual-reshoot-guide-accordion"
                            >
                                <AccordionItem value="recommended" className="virtual-reshoot-guide-accordion-item">
                                    <AccordionTrigger className="virtual-reshoot-guide-accordion-trigger">
                                        {uploadGuide.doTitle || "Recommended"}
                                    </AccordionTrigger>
                                    <AccordionContent className="virtual-reshoot-guide-accordion-content">
                                        <ul className="virtual-reshoot-guide-list">
                                            {(Array.isArray(uploadGuide.do) ? uploadGuide.do : []).map(
                                                (line) => (
                                                    <li key={line}>{line}</li>
                                                )
                                            )}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <Accordion
                                type="single"
                                collapsible
                                value={avoidAccordionValue}
                                onValueChange={setAvoidAccordionValue}
                                className="virtual-reshoot-guide-col virtual-reshoot-guide-accordion"
                            >
                                <AccordionItem value="avoid" className="virtual-reshoot-guide-accordion-item">
                                    <AccordionTrigger className="virtual-reshoot-guide-accordion-trigger">
                                        {uploadGuide.dontTitle || "Avoid"}
                                    </AccordionTrigger>
                                    <AccordionContent className="virtual-reshoot-guide-accordion-content">
                                        <ul className="virtual-reshoot-guide-list">
                                            {(Array.isArray(uploadGuide.dont) ? uploadGuide.dont : []).map(
                                                (line) => (
                                                    <li key={line}>{line}</li>
                                                )
                                            )}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        {uploadGuideExamples.length > 0 && (
                            <div className="virtual-reshoot-guide-examples">
                                <p className="virtual-reshoot-guide-examples-title">
                                    {uploadGuide.examplesTitle || "Example base images"}
                                </p>
                                <div className="virtual-reshoot-guide-examples-grid">
                                    {uploadGuideExamples.map((ex) => {
                                        const src = normalizeImageUrl(ex?.src || "");
                                        const label = ex?.label || "";
                                        if (!src) return null;
                                        return (
                                            <div
                                                key={`${src}_${label}`}
                                                className="virtual-reshoot-guide-example"
                                            >
                                                <div className="virtual-reshoot-guide-example-media">
                                                    <FadeInImage
                                                        src={src}
                                                        alt={label || "Example base image"}
                                                        className="virtual-reshoot-guide-example-img"
                                                    />
                                                </div>
                                                {label ? (
                                                    <p className="virtual-reshoot-guide-example-caption">{label}</p>
                                                ) : null}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <Card className="virtual-reshoot-card">
                <div className="virtual-reshoot-header">
                    <h2 className="virtual-reshoot-title">{copy?.title || "Virtual Reshoot"}</h2>
                    <p className="virtual-reshoot-subtitle">{copy?.description || "Upload your image and transform it using AI-powered avatar selection."}</p>
                </div>

                <div className="virtual-reshoot-step">
                    <p className="virtual-reshoot-step-label">{copy?.step1 || "Step 1 – Upload base image"}</p>
                    <MultipleUploadCard
                        label={copy?.baseImages || "Base Image(s)"}
                        required
                        hint={copy?.baseImagesHint || "Upload one or multiple base images (or a ZIP). Body, clothing, pose, and background are preserved from these."}
                        files={baseFiles}
                        onFilesChange={setBaseFiles}
                        copy={copy}
                    />
                </div>

                <div className="virtual-reshoot-step">
                    <p className="virtual-reshoot-step-label">{copy?.step2 || "Step 2 – Select avatar"}</p>

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
                                <label className="virtual-reshoot-field-label">{copy?.genderLabel || "Select Gender"}</label>
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
                                <label className="virtual-reshoot-field-label">{copy?.originLabel || "Select Origin"}</label>
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
                            <p className="virtual-reshoot-avatars-title">{copy?.avatarLabel || "Select Avatar"}</p>
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
                                    {copy?.noAvatars || "No avatars found for the selected gender/origin."}
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
                                                    {avatar.images?.length || 0} {copy?.imageCountSuffix || "image(s)"}
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
                                            {(copy?.selectedAvatar || "Selected")}: {selectedAvatar.name}
                                        </p>
                                        <p className="virtual-reshoot-selected-subtitle">
                                            {copy?.selectedAvatarSubtitle || "Identity anchor image will be used for the face only."}
                                        </p>
                                        <div className="virtual-reshoot-selected-actions">
                                            {canShowAll && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setShowAllImages(true)}
                                                >
                                                    {copy?.showAllImages || "Show All Images"}
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
                    <p className="virtual-reshoot-step-label">{copy?.step3 || "Step 3 – Generate"}</p>
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
                                    {copy?.generatingButton || "Generating..."}
                                </>
                            ) : (
                                <>{copy?.generateButton || "Generate Reshoot"}</>
                            )}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {copy?.backendHint || "Sends base images + selected avatar URL to the backend. The AI prompt is hardcoded server-side."}
                    </p>
                </div>
            </Card>

            <div className="virtual-reshoot-results">
                <h3 className="virtual-reshoot-results-title">{copy?.recentTitle || "Recent Reshoots"}</h3>
                {results.length === 0 ? (
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-12 w-12 rounded-xl" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium">{copy?.emptyTitle || "No reshoots yet"}</p>
                                <p className="text-sm text-muted-foreground">
                                    {copy?.emptySubtitle || "Generate a reshoot to see outputs here."}
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
                                            <Badge variant="secondary">{copy?.textBadge || "Text"}</Badge>
                                            <span>•</span>
                                            <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                        <p className="virtual-reshoot-result-caption">
                                            {copy?.resultTextCaption || "Result"} {index + 1}
                                        </p>
                                        <p className="virtual-reshoot-result-text">{item.text}</p>
                                    </div>
                                )}

                                {item.kind === "image" && (
                                    <div className="virtual-reshoot-result-body">
                                        <div className="virtual-reshoot-result-meta">
                                            <Badge variant="default">{copy?.statusCompleted || "Completed"}</Badge>
                                            <span>•</span>
                                            <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                        <p className="virtual-reshoot-result-caption">{copy?.resultCaption || "Reshoot output"}</p>
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
                    aria-label={copy?.avatarImagesAria || "Avatar images"}
                    onClick={() => setShowAllImages(false)}
                >
                    <div
                        className="virtual-reshoot-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="virtual-reshoot-modal-header">
                            <p className="virtual-reshoot-modal-title">
                                {selectedAvatar.name} — {modalImages.length} {copy?.imageCountSuffix || "image(s)"}
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowAllImages(false)}
                            >
                                {copy?.close || "Close"}
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
