import React from "react";
import { Check } from "lucide-react";
import "./AvatarModule.css";

export function AvatarCard({ avatar, isSelected, onSelect, onInfo }) {
    return (
        <div className="avatar-card-wrapper">
            <div
                className={`avatar-card ${isSelected ? "avatar-card--selected" : ""}`}
                onClick={() => onSelect(avatar)}
            >
                {/* Avatar Image */}
                <div className="avatar-card__image-container">
                    <img
                        src={avatar.imageUrl}
                        alt={avatar.name}
                        className="avatar-card__image"
                    />
                    {isSelected && (
                        <div className="avatar-card__selected-badge">
                            <Check className="w-5 h-5" />
                        </div>
                    )}
                </div>

                {/* Avatar Info */}
                <div className="avatar-card__content">
                    <div className="avatar-card__header">
                        <h3 className="avatar-card__name">{avatar.name}</h3>
                        <span className="avatar-card__origin">{avatar.origin}</span>
                    </div>

                    <p className="avatar-card__tagline">{avatar.tagline}</p>
                    <p className="avatar-card__description">{avatar.description}</p>

                    {/* Meta Info */}
                    <div className="avatar-card__meta">
                        <button
                            className="avatar-card__info-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onInfo?.(avatar);
                            }}
                            title="View character details"
                        >
                            <span className="text-xs">ℹ️ Details</span>
                        </button>
                    </div>
                </div>

                {/* Glassmorphism Border Effect */}
                <div className="avatar-card__border" />
            </div>
        </div>
    );
}
