import { useEffect, useMemo, useState } from "react";
import { Upload } from "lucide-react";

type UploadSectionProps = {
    files: File[];
    onFilesChange: (files: File[]) => void;
    showError?: boolean;
};

const acceptedTypes = ["image/jpeg", "image/png", "image/webp", "application/zip"];

export function UploadSection({ files, onFilesChange, showError }: UploadSectionProps) {
    const [isDragging, setIsDragging] = useState(false);

    const previews = useMemo(() => {
        return files.map((file) => {
            if (file.type === "application/zip") {
                return { name: file.name, type: "zip", url: "" };
            }
            return { name: file.name, type: "image", url: URL.createObjectURL(file) };
        });
    }, [files]);

    useEffect(() => {
        return () => {
            previews.forEach((preview) => {
                if (preview.type === "image") {
                    URL.revokeObjectURL(preview.url);
                }
            });
        };
    }, [previews]);

    const handleFiles = (incomingFiles: FileList | null) => {
        if (!incomingFiles) {
            return;
        }

        const nextFiles = Array.from(incomingFiles).filter((file) =>
            acceptedTypes.includes(file.type) || file.name.toLowerCase().endsWith(".zip")
        );
        onFilesChange(nextFiles);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Step 1: Upload Input</h3>
                <span className="text-xs text-white/60">Required</span>
            </div>

            <label
                className={`block rounded-2xl border border-dashed p-6 text-center transition-all ${isDragging
                        ? "border-primary bg-primary/10"
                        : "border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                    handleFiles(event.dataTransfer.files);
                }}
            >
                <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.webp,.zip"
                    multiple
                    onChange={(event) => handleFiles(event.target.files)}
                />
                <div className="flex flex-col items-center gap-2 text-white/60">
                    <Upload className="w-6 h-6" />
                    <span className="text-sm font-medium">Drag and drop or click to upload</span>
                    <span className="text-xs">JPG, PNG, WEBP or ZIP for bulk</span>
                </div>
            </label>

            {showError ? (
                <p className="text-xs text-rose-300">Upload at least one file.</p>
            ) : null}

            {previews.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {previews.map((preview) => (
                        <div
                            key={preview.name}
                            className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/70"
                        >
                            {preview.type === "image" ? (
                                <img
                                    src={preview.url}
                                    alt={preview.name}
                                    className="h-24 w-full rounded-lg object-cover"
                                />
                            ) : (
                                <div className="flex h-24 items-center justify-center rounded-lg border border-white/10 bg-white/10">
                                    <span className="text-sm font-semibold">ZIP</span>
                                </div>
                            )}
                            <p className="mt-2 truncate">{preview.name}</p>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
