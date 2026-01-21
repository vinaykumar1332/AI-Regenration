import { useState } from "react";
import { Card } from "@/app/components/ui/Card/card";
import { Badge } from "@/app/components/ui/Badge/badge";
import { Button } from "@/app/components/ui/Button/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/Tabs/tabs";
import { avatarOptions, getAvatarPreview } from "./avatarData";
import {
    ChevronRight,
    Zap,
    User,
    UserCircle,
    Globe,
    MapPin,
    Compass,
    Building2,
    Leaf,
    Minus,
    Waves,
    Shuffle,
    Smile,
    Eye,
    Sparkles,
    Star,
} from "lucide-react";

// Icon map to dynamically render correct icon component
const iconMap = {
    User,
    UserCircle,
    Globe,
    MapPin,
    Compass,
    Building2,
    Leaf,
    Minus,
    Waves,
    Shuffle,
    Smile,
    Eye,
    Sparkles,
    Star,
};

const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
};

export function AvatarSelector({ onAvatarSelect, selectedAvatar }) {
    const [currentSelection, setCurrentSelection] = useState(
        selectedAvatar || {
            gender: "male",
            continent: "european",
            skinTone: "light",
            hairStyle: "straight",
            feature: "natural",
        }
    );

    const handleSelectionChange = (category, value) => {
        const newSelection = { ...currentSelection, [category]: value };
        setCurrentSelection(newSelection);
        const preview = getAvatarPreview(newSelection);
        onAvatarSelect(preview);
    };

    const previewData = getAvatarPreview(currentSelection);

    const renderOptionGroup = (category, options) => (
        <div className="space-y-3">
            <label className="text-xs font-semibold uppercase text-muted-foreground">
                {category.replace(/([A-Z])/g, " $1")}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => handleSelectionChange(category, option.id)}
                        className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${currentSelection[category] === option.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                            }`}
                    >
                        {option.iconName ? (
                            getIcon(option.iconName)
                        ) : option.hex ? (
                            <div
                                className="w-5 h-5 rounded-md border-2 border-muted-foreground"
                                style={{ backgroundColor: option.hex }}
                            />
                        ) : null}
                        <span className="text-xs font-medium text-center leading-tight">{option.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <Card className="p-6 border-l-4 border-l-primary">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold">Avatar Selection</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Customize your character appearance for the generated image
                        </p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                        Beta
                    </Badge>
                </div>

                {/* Avatar Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Preview Section */}
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 overflow-hidden flex items-center justify-center">
                            <img
                                src={previewData.preview}
                                alt="Avatar preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-muted-foreground mb-2">Avatar Keyword</p>
                            <code className="text-xs bg-muted px-3 py-2 rounded block break-words">
                                {previewData.keyword}
                            </code>
                        </div>
                    </div>

                    {/* Selection Options */}
                    <div className="space-y-4 overflow-y-auto max-h-96 pr-2">
                        {renderOptionGroup("gender", avatarOptions.genders)}
                        {renderOptionGroup("continent", avatarOptions.continents)}
                        {renderOptionGroup("skinTone", avatarOptions.skinTones)}
                        {renderOptionGroup("hairStyle", avatarOptions.hairStyles)}
                        {renderOptionGroup("feature", avatarOptions.features)}
                    </div>
                </div>

                {/* Selection Summary */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">Current Selection:</p>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-600">
                            {avatarOptions.genders.find((g) => g.id === currentSelection.gender)?.label}
                        </Badge>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-600">
                            {avatarOptions.continents.find((c) => c.id === currentSelection.continent)?.label}
                        </Badge>
                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600">
                            {avatarOptions.skinTones.find((s) => s.id === currentSelection.skinTone)?.label}
                        </Badge>
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-600">
                            {avatarOptions.hairStyles.find((h) => h.id === currentSelection.hairStyle)?.label}
                        </Badge>
                        <Badge variant="secondary" className="bg-orange-500/20 text-orange-600">
                            {avatarOptions.features.find((f) => f.id === currentSelection.feature)?.label}
                        </Badge>
                    </div>
                </div>

                {/* Info Section */}
                <div className="border-t pt-4">
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <ChevronRight className="w-3 h-3" />
                        The selected avatar keyword will be automatically added to your prompt
                    </p>
                </div>
            </div>
        </Card>
    );
}
