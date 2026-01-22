import React, { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import "./AvatarModule.css";

export function CreateAvatarModal({ onClose, onCreate }) {
    const [avatarName, setAvatarName] = useState("");
    const [origin, setOrigin] = useState("other");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target?.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreate = () => {
        if (!avatarName || !imagePreview) {
            alert("Please fill in all fields and upload an image");
            return;
        }

        const newAvatar = {
            id: `custom-${Date.now()}`,
            name: avatarName,
            origin: origin,
            tagline: `Custom Avatar`,
            description: "User-created character with personal face reference",
            icon: "User",
            imageUrl: imagePreview,
            skinTone: "custom",
            faceReference: {
                type: "FACE_REFERENCE",
                characterId: `custom-${Date.now()}`,
                prompt: `Custom avatar of ${avatarName} with unique facial characteristics`,
            },
        };

        onCreate(newAvatar);
    };

    return (
        <div className="create-avatar-modal-overlay" onClick={onClose}>
            <div
                className="create-avatar-modal"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="create-avatar-modal__header">
                    <h2 className="create-avatar-modal__title">Create New Avatar</h2>
                    <button
                        className="create-avatar-modal__close"
                        onClick={onClose}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="create-avatar-modal__content">
                    {/* Image Upload Section */}
                    <div className="create-avatar-modal__section">
                        <label className="create-avatar-modal__label">Face Reference Image</label>
                        <div
                            className="create-avatar-modal__upload"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="create-avatar-modal__preview"
                                />
                            ) : (
                                <div className="create-avatar-modal__upload-placeholder">
                                    <Upload className="w-8 h-8 mb-2" />
                                    <p className="text-sm">Click to upload or drag and drop</p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Avatar Name */}
                    <div className="create-avatar-modal__section">
                        <label className="create-avatar-modal__label">Character Name</label>
                        <input
                            type="text"
                            value={avatarName}
                            onChange={(e) => setAvatarName(e.target.value)}
                            placeholder="e.g., Sofia, Alex, Jordan..."
                            className="create-avatar-modal__input"
                        />
                    </div>

                    {/* Origin Selection */}
                    <div className="create-avatar-modal__section">
                        <label className="create-avatar-modal__label">Character Origin</label>
                        <select
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            className="create-avatar-modal__select"
                        >
                            <option value="asian">Asian</option>
                            <option value="european">European</option>
                            <option value="african">African</option>
                            <option value="indian">Indian</option>
                            <option value="middle_eastern">Middle Eastern</option>
                            <option value="latin">Latin American</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div className="create-avatar-modal__footer">
                    <button
                        className="create-avatar-modal__button create-avatar-modal__button--cancel"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="create-avatar-modal__button create-avatar-modal__button--create"
                        onClick={handleCreate}
                        disabled={!avatarName || !imagePreview}
                    >
                        Create Avatar
                    </button>
                </div>
            </div>
        </div>
    );
}
