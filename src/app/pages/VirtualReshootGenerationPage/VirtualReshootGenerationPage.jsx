import { VirtualReshootModule } from "@/app/components/ImageGeneration/VirtualReshootModule";

export function VirtualReshootGenerationPage() {
    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-semibold mb-1">Image Generation</h1>
                <p className="text-sm text-muted-foreground">
                    Virtual Reshoot module.
                </p>
            </div>
            <VirtualReshootModule />
        </div>
    );
}
