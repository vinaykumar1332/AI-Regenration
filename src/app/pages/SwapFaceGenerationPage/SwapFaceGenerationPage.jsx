import { SwapFaceModule } from "@/app/components/ImageGeneration/SwapFaceModule";

export function SwapFaceGenerationPage() {
    return (
        <div className="w-full max-w-6xl mx-auto px-6">
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">Swap Face Model</h1>
                    <p className="text-muted-foreground">
                        Transform faces with advanced AI-powered face swapping.
                        Upload reference faces and target images to generate unique combinations.
                    </p>
                </div>

                <SwapFaceModule />
            </div>
        </div>
    );
}
