import { Check } from "lucide-react";

type Avatar = {
    id: string;
    name: string;
    image: string;
};

type AvatarSelectorProps = {
    avatars: Avatar[];
    value: string;
    onChange: (value: string) => void;
    showError?: boolean;
};

export function AvatarSelector({ avatars, value, onChange, showError }: AvatarSelectorProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Step 4: Select Avatar</h3>
                <span className="text-xs text-white/60">Required</span>
            </div>

            {avatars.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                    Select gender and origin to see matching avatars.
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {avatars.map((avatar) => {
                        const isSelected = value === avatar.id;
                        return (
                            <button
                                key={avatar.id}
                                type="button"
                                onClick={() => onChange(avatar.id)}
                                className={`group relative overflow-hidden rounded-2xl border p-3 text-left transition-all ${isSelected
                                        ? "border-primary bg-primary/10 scale-[1.02]"
                                        : "border-white/10 bg-white/5 hover:bg-white/10"
                                    }`}
                            >
                                <img
                                    src={avatar.image}
                                    alt={avatar.name}
                                    className="h-28 w-full rounded-xl object-cover"
                                />
                                <p className="mt-2 text-sm font-medium text-white">{avatar.name}</p>
                                {isSelected ? (
                                    <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
                                        <Check className="w-4 h-4" />
                                    </span>
                                ) : null}
                            </button>
                        );
                    })}
                </div>
            )}

            {showError ? (
                <p className="text-xs text-rose-300">Select an avatar to continue.</p>
            ) : null}
        </div>
    );
}
