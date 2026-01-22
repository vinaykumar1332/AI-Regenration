import React, { useState } from "react";
import { Button } from "@/app/components/ui/Button/button";
import { Info, Plus } from "lucide-react";
import "./AvatarSelector.css";

export function AvatarSelector({ avatars, selectedAvatar, onSelect, onCreateNew }) {
  const [infoModal, setInfoModal] = useState(null);

  return (
    <div className="avatar-selector">
      {/* Gallery Grid */}
      <div className="avatar-gallery">
        {avatars.map((avatar) => (
          <div
            key={avatar.id}
            className={`avatar-gallery-card ${selectedAvatar?.id === avatar.id ? "active" : ""}`}
            onClick={() => onSelect(avatar)}
          >
            {/* Image */}
            <div className="avatar-gallery-card__image-wrapper">
              <img
                src={avatar.imageUrl}
                alt={avatar.name}
                className="avatar-gallery-card__image"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/400x400?text=${avatar.name}`;
                }}
              />
              {selectedAvatar?.id === avatar.id && (
                <div className="avatar-gallery-card__badge">✓</div>
              )}
            </div>

            {/* Info */}
            <div className="avatar-gallery-card__info">
              <h3 className="avatar-gallery-card__name">{avatar.name}</h3>
              <p className="avatar-gallery-card__origin">{avatar.origin}</p>
              <p className="avatar-gallery-card__tagline">{avatar.tagline}</p>
              
              <button
                className="avatar-gallery-card__info-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setInfoModal(avatar);
                }}
              >
                <Info className="w-4 h-4" />
                Details
              </button>
            </div>
          </div>
        ))}

        {/* Create New Card */}
        <div className="avatar-gallery-card avatar-gallery-card--create" onClick={onCreateNew}>
          <div className="avatar-gallery-card__image-wrapper avatar-gallery-card__image-wrapper--empty">
            <Plus className="w-8 h-8" />
          </div>
          <div className="avatar-gallery-card__info">
            <h3 className="avatar-gallery-card__name">Create New</h3>
            <p className="avatar-gallery-card__origin">Custom Avatar</p>
            <p className="avatar-gallery-card__tagline">Upload your own face reference</p>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      {infoModal && (
        <div className="avatar-selector-modal" onClick={() => setInfoModal(null)}>
          <div className="avatar-selector-modal__content" onClick={(e) => e.stopPropagation()}>
            <button
              className="avatar-selector-modal__close"
              onClick={() => setInfoModal(null)}
            >
              ✕
            </button>

            <div className="avatar-selector-modal__header">
              <img
                src={infoModal.imageUrl}
                alt={infoModal.name}
                className="avatar-selector-modal__image"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/300x300?text=${infoModal.name}`;
                }}
              />
            </div>

            <div className="avatar-selector-modal__body">
              <h2 className="avatar-selector-modal__name">{infoModal.name}</h2>
              <p className="avatar-selector-modal__origin">{infoModal.origin}</p>
              <p className="avatar-selector-modal__tagline">{infoModal.tagline}</p>
              <p className="avatar-selector-modal__description">{infoModal.description}</p>

              <div className="avatar-selector-modal__details">
                <div className="detail-row">
                  <span className="detail-label">Skin Tone:</span>
                  <span className="detail-value">{infoModal.skinTone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Character Type:</span>
                  <span className="detail-value">{infoModal.isCustom ? "Custom" : "Pre-defined"}</span>
                </div>
              </div>

              <Button
                onClick={() => {
                  setInfoModal(null);
                }}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
