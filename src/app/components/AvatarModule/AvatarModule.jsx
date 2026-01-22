import React, { useState } from "react";
import { AvatarGallery } from "./AvatarGallery";
import { GenerationPanel } from "./GenerationPanel";
import "./AvatarModule.css";

export function AvatarModule() {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [styleReference, setStyleReference] = useState(null);

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    console.log("Avatar selected:", avatar);
  };

  return (
    <div className="avatar-module">
      <AvatarGallery 
        onAvatarSelect={handleAvatarSelect}
        selectedAvatarId={selectedAvatar?.id}
      />
      <GenerationPanel 
        selectedAvatar={selectedAvatar}
        styleReference={styleReference}
      />
    </div>
  );
}
