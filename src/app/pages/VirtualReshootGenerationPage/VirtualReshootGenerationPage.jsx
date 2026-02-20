import { VirtualReshootModule } from "@/app/components/ImageGeneration/VirtualReshootModule";

export function VirtualReshootGenerationPage() {
    return (
        <div className="w-full max-w-6xl mx-auto px-6">
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">Virtual Reshoot Model</h1>
                    <p className="text-muted-foreground">
                        Create on-model virtual reshoots with the same workflow as Swap Face.
                        This page is a separate module so we can extend it with additional features next.
                    </p>
                </div>

                <VirtualReshootModule />
            </div>
        </div>
    );
}
