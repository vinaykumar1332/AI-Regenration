import { useSearchParams } from "react-router-dom";
import { SwapFaceModule } from "@/app/components/ImageGeneration/SwapFaceModule";

export function ImageGenerationPage() {
  const [searchParams] = useSearchParams();
  const activeModule = searchParams.get("module") || "swap-face";

  // In the future, more submodules can be handled here based on activeModule.
  const renderModule = () => {
    switch (activeModule) {
      case "swap-face":
      default:
        return <SwapFaceModule />;
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-1">Image Generation</h1>
        <p className="text-sm text-muted-foreground">
          Choose a sub-module from the navigation. Currently, Swap Face generation is available as the primary flow.
        </p>
      </div>
      {renderModule()}
    </div>
  );
}













