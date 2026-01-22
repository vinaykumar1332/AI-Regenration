import React, { useState } from "react";
import { Plus, Upload } from "lucide-react";
import { AvatarCard } from "./AvatarCard";
import { CreateAvatarModal } from "./CreateAvatarModal";
import { predefinedAvatars, formatAvatarCard } from "./avatarGalleryData";
import "./AvatarModule.css";

export function AvatarGallery({ onAvatarSelect, selectedAvatarId }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [customAvatars, setCustomAvatars] = useState([]);
    const [selectedAvatar, setSelectedAvatar] = useState(selectedAvatarId);
    const [infoModal, setInfoModal] = useState(null);

    const allAvatars = [
        ...predefinedAvatars,
        ...customAvatars,
    ];

    const handleAvatarSelect = (avatar) => {
        setSelectedAvatar(avatar.id);
        onAvatarSelect?.(avatar);
    };

    const handleCreateAvatar = (newAvatar) => {
        setCustomAvatars([...customAvatars, newAvatar]);
        setShowCreateModal(false);
    };

    return (
        <div className="avatar-gallery-wrapper">
            <div className="avatar-gallery-header">
                <div>
                    <h2 className="avatar-gallery-title">Character Store</h2>
                    <p className="avatar-gallery-subtitle">
                        Select a character or create your own avatar with a face reference
                    </p>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="avatar-gallery-grid">
                {allAvatars.map((avatar) => (
                    <AvatarCard
                        key={avatar.id}
                        avatar={avatar}
                        isSelected={selectedAvatar === avatar.id}
                        onSelect={handleAvatarSelect}
                        onInfo={setInfoModal}
                    />
                ))}

                {/* Create New Avatar Card */}
                <div
                    className="avatar-card-wrapper avatar-card--create"
                    onClick={() => setShowCreateModal(true)}
                >
                    <div className="avatar-card avatar-card--create-button">
                        <div className="avatar-card__create-content">
                            <Plus className="w-12 h-12 mb-3" />
                            <h3 className="avatar-card__create-title">Create New Avatar</h3>
                            <p className="avatar-card__create-subtitle">
                                Upload your face reference image
                            </p>
                            <div className="avatar-card__create-icon">
                                <Upload className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showCreateModal && (
                <CreateAvatarModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateAvatar}
                />
            )}

            {infoModal && (
                <div className="avatar-info-modal-overlay" onClick={() => setInfoModal(null)}>
                    <div className="avatar-info-modal" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="avatar-info-modal__close"
                            onClick={() => setInfoModal(null)}
                        >
                            ✕
                        </button>
                        <div className="avatar-info-modal__content">
                            <img
                                src={infoModal.imageUrl}
                                alt={infoModal.name}
                                className="avatar-info-modal__image"
                            />
                            <div className="avatar-info-modal__info">
                                <h3 className="avatar-info-modal__name">{infoModal.name}</h3>
                                <p className="avatar-info-modal__origin">Origin: {infoModal.origin}</p>
                                <p className="avatar-info-modal__tagline">{infoModal.tagline}</p>
                                <p className="avatar-info-modal__description">
                                    {infoModal.description}
                                </p>
                                {infoModal.faceReference && (
                                    <div className="avatar-info-modal__reference">
                                        <p className="text-xs font-semibold mb-2">Face Reference:</p>
                                        <code className="text-xs bg-muted p-2 rounded block break-words">
                                            {infoModal.faceReference.prompt}
                                        </code>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
