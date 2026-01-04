import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, ArrowLeft, Loader2, ImageIcon, Download, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import pixelmindLogo from "@/assets/pixelmind-logo.png";
import StylePresets, { StylePreset, stylePresets } from "@/components/StylePresets";

const Generate = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>(stylePresets[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { session } = useAuth();
  const { profile, refetchProfile } = useProfile();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    if (!session) {
      toast.error("Please sign in to generate images");
      return;
    }

    if ((profile?.credits ?? 0) < 2) {
      toast.error("Insufficient credits. Please purchase more credits.");
      return;
    }
    
    setIsLoading(true);
    setGeneratedImage(null);
    
    try {
      // Combine user prompt with selected style
      const fullPrompt = selectedStyle.prompt 
        ? `${prompt.trim()}, ${selectedStyle.prompt}`
        : prompt.trim();

      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { prompt: fullPrompt, size: "1024x1024" },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.image_url) {
        setGeneratedImage(data.image_url);
        toast.success(`Image generated! ${data.credits_remaining} credits remaining.`);
        refetchProfile();
      } else {
        throw new Error("No image returned from API");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded!");
    } catch {
      toast.error("Failed to download image");
    }
  };

  return (
    <div className="min-h-screen bg-background hero-gradient">
      {/* Background effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={pixelmindLogo} alt="PixelMind AI" className="w-10 h-10 rounded-xl object-cover" />
            <span className="font-display text-xl font-bold text-foreground">
              PixelMind AI
            </span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-10 opacity-0 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Generate <span className="text-gradient">AI Images</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Describe your vision and let AI bring it to life
            </p>
          </div>

          {/* Generator Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6 opacity-0 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              {/* Style Presets */}
              <div className="glass rounded-2xl p-6">
                <StylePresets
                  selectedStyle={selectedStyle.id}
                  onSelectStyle={setSelectedStyle}
                />
              </div>

              <div className="glass rounded-2xl p-6">
                <label className="block text-foreground font-medium mb-3">
                  Describe your image
                  {selectedStyle.id !== "none" && (
                    <span className="ml-2 text-sm font-normal text-primary">
                      + {selectedStyle.name} style
                    </span>
                  )}
                </label>
                <Textarea
                  placeholder="A majestic dragon soaring through a cosmic nebula, with iridescent scales reflecting starlight..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[140px] resize-none bg-muted/50 border-border focus:border-primary/50 text-foreground placeholder:text-muted-foreground"
                />
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-muted-foreground">
                    {prompt.length}/1000 characters
                  </span>
                  <Button
                    variant="glow"
                    size="lg"
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Credits Display */}
              <div className="glass rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Coins className="w-5 h-5 text-primary" />
                  <span className="text-foreground font-medium">{profile?.credits ?? 0} credits</span>
                </div>
                <span className="text-sm text-muted-foreground">2 credits per image</span>
              </div>

              {/* Tips */}
              <div className="glass rounded-xl p-4">
                <h3 className="text-sm font-medium text-foreground mb-2">Tips for better results:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Be specific about style, lighting, and mood</li>
                  <li>• Include artistic references (e.g., "in the style of...")</li>
                  <li>• Add quality keywords like "ultra detailed", "4K", "cinematic"</li>
                </ul>
              </div>
            </div>

            {/* Output Section */}
            <div className="opacity-0 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <div className="glass rounded-2xl p-6 h-full min-h-[400px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-foreground font-medium">Generated Image</h3>
                  {generatedImage && (
                    <Button variant="ghost" size="sm" onClick={handleDownload}>
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  )}
                </div>
                
                <div className="flex-1 rounded-xl overflow-hidden bg-muted/30 flex items-center justify-center">
                  {isLoading ? (
                    <div className="text-center">
                      <div className="relative w-20 h-20 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                        <Wand2 className="absolute inset-0 m-auto w-8 h-8 text-primary" />
                      </div>
                      <p className="text-muted-foreground">Creating your masterpiece...</p>
                      <p className="text-sm text-muted-foreground/70 mt-1">This may take a few seconds</p>
                    </div>
                  ) : generatedImage ? (
                    <img
                      src={generatedImage}
                      alt="Generated AI Image"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="text-center p-8">
                      <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">Your generated image will appear here</p>
                      <p className="text-sm text-muted-foreground/70 mt-1">Enter a prompt and click Generate</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Generate;
