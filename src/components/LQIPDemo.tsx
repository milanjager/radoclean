import { useState } from "react";
import { Upload, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateLQIP } from "@/lib/lqip-generator";
import { toast } from "sonner";

/**
 * Demo component for LQIP generation
 * Shows before/after comparison of image loading with LQIP
 */
const LQIPDemo = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>("");
  const [lqipPreview, setLqipPreview] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setSelectedFile(file);
    setLqipPreview("");

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateLQIP = async () => {
    if (!selectedFile) return;

    setIsGenerating(true);
    try {
      const lqip = await generateLQIP(selectedFile);
      setLqipPreview(lqip);
      toast.success("LQIP generated successfully!");
    } catch (error) {
      console.error("Failed to generate LQIP:", error);
      toast.error("Failed to generate LQIP");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              LQIP Generator Demo
            </h2>
            <p className="text-muted-foreground">
              Upload an image to see how LQIP (Low-Quality Image Placeholder) improves loading experience
            </p>
          </div>

          <Card className="p-8">
            {!selectedFile ? (
              <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  Upload an Image
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select an image to generate its LQIP placeholder
                </p>
                <label htmlFor="image-upload">
                  <Button variant="premium" className="cursor-pointer">
                    Choose Image
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {selectedFile.name}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      setOriginalPreview("");
                      setLqipPreview("");
                    }}
                  >
                    Clear
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Original */}
                  <div>
                    <h4 className="font-semibold mb-3 text-sm text-muted-foreground">
                      Original Image
                    </h4>
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      {originalPreview && (
                        <img
                          src={originalPreview}
                          alt="Original"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Size: {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>

                  {/* LQIP */}
                  <div>
                    <h4 className="font-semibold mb-3 text-sm text-muted-foreground">
                      LQIP Placeholder (20x20px, blurred)
                    </h4>
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      {lqipPreview ? (
                        <img
                          src={lqipPreview}
                          alt="LQIP"
                          className="w-full h-full object-cover"
                          style={{ filter: "blur(20px)", transform: "scale(1.1)" }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-sm text-muted-foreground">
                            Click generate to create LQIP
                          </p>
                        </div>
                      )}
                    </div>
                    {lqipPreview && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Size: ~{(lqipPreview.length * 0.75 / 1024).toFixed(2)} KB
                        (saved ~{((selectedFile.size - lqipPreview.length * 0.75) / 1024).toFixed(0)} KB)
                      </p>
                    )}
                  </div>
                </div>

                {!lqipPreview && (
                  <Button
                    variant="premium"
                    className="w-full"
                    onClick={handleGenerateLQIP}
                    disabled={isGenerating}
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    {isGenerating ? "Generating..." : "Generate LQIP"}
                  </Button>
                )}

                {lqipPreview && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-sm">
                      How it works:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>✓ Image scaled down to 20x20 pixels</li>
                      <li>✓ Compressed with low quality (30%)</li>
                      <li>✓ Blurred and scaled up when displayed</li>
                      <li>✓ Loads instantly while full image loads in background</li>
                      <li>✓ Smooth transition when full image is ready</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </Card>

          <div className="mt-8 bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-3">
              Benefits of LQIP:
            </h3>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold text-primary mb-1">
                  Better UX
                </div>
                <p className="text-muted-foreground">
                  Users see content shape immediately instead of empty space
                </p>
              </div>
              <div>
                <div className="font-semibold text-primary mb-1">
                  Reduced CLS
                </div>
                <p className="text-muted-foreground">
                  Prevents layout shifts during image loading
                </p>
              </div>
              <div>
                <div className="font-semibold text-primary mb-1">
                  Tiny Size
                </div>
                <p className="text-muted-foreground">
                  Only ~1-2KB per placeholder, embedded in HTML
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LQIPDemo;
