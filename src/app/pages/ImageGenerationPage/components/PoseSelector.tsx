import { Check } from "lucide-react";

type Pose = {
    id: string;
    name: string;
    image: string;
};

type PoseSelectorProps = {
    poses: Pose[];
    value: string;
    onChange: (value: string) => void;
    showError?: boolean;
};

export function PoseSelector({ poses, value, onChange, showError }: PoseSelectorProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Step 6: Select Pose</h3>
                <span className="text-xs text-white/60">Required</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {poses.map((pose) => {
                    const isSelected = value === pose.id;
                    return (
                        <button
                            key={pose.id}
                            type="button"
                            onClick={() => onChange(pose.id)}
                            className={`relative overflow-hidden rounded-2xl border p-3 text-left transition-all ${isSelected
                                    ? "border-primary bg-primary/10 scale-[1.02]"
                                    : "border-white/10 bg-white/5 hover:bg-white/10"
                                }`}
                        >
                            <img
                                src={pose.image}
                                alt={pose.name}
                                className="h-24 w-full rounded-xl object-cover"
                            />
                            <p className="mt-2 text-sm font-medium text-white">{pose.name}</p>
                            {isSelected ? (
                                <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
                                    <Check className="w-4 h-4" />
                                </span>
                            ) : null}
                        </button>
                    );
                })}
            </div>
            {showError ? (
                <p className="text-xs text-rose-300">Select a pose to continue.</p>
            ) : null}
        </div>
    );
}
