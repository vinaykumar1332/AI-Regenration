type OptionItem = {
    id: string;
    label: string;
};

type OriginSelectorProps = {
    options: OptionItem[];
    value: string;
    onChange: (value: string) => void;
    showError?: boolean;
};

export function OriginSelector({ options, value, onChange, showError }: OriginSelectorProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Step 3: Select Origin</h3>
                <span className="text-xs text-white/60">Required</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {options.map((option) => (
                    <button
                        key={option.id}
                        type="button"
                        onClick={() => onChange(option.id)}
                        className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-all ${value === option.id
                                ? "border-primary bg-primary/15 text-white shadow-lg shadow-primary/20 scale-[1.01]"
                                : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
            {showError ? (
                <p className="text-xs text-rose-300">Select an origin to continue.</p>
            ) : null}
        </div>
    );
}
