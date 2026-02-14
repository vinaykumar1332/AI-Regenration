import { Check } from "lucide-react";

type Step = {
    id: string;
    label: string;
};

type StepProgressProps = {
    steps: Step[];
    completion: Record<string, boolean>;
};

export function StepProgress({ steps, completion }: StepProgressProps) {
    const firstIncompleteIndex = steps.findIndex((step) => !completion[step.id]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {steps.map((step, index) => {
                const isComplete = completion[step.id];
                const isCurrent = firstIncompleteIndex === -1 ? false : index === firstIncompleteIndex;

                return (
                    <div
                        key={step.id}
                        className={`rounded-xl border px-3 py-3 text-xs font-medium transition-all ${isComplete
                                ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-200"
                                : isCurrent
                                    ? "border-white/30 bg-white/10 text-white"
                                    : "border-white/10 bg-white/5 text-white/50"
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <span>{step.label}</span>
                            {isComplete ? <Check className="w-3 h-3" /> : null}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
