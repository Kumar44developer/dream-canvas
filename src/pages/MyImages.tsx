import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft, Download, ImageIcon, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface GeneratedImage {
  id: string;
  image_url: string;
  prompt: string;
  created_at: string;
  credits_used: number;
}

const MyImages = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("my-images");

      if (error) {
        throw new Error(error.message);
      }

      if (data?.images) {
        setImages(data.images);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-image-${prompt.slice(0, 20).replace(/\s+/g, "-")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded!");
    } catch {
      toast.error("Failed to download image");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              AI Image Generator
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
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 opacity-0 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              My <span className="text-gradient">Images</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Your collection of AI-generated masterpieces
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : images.length > 0 ? (
            /* Image Grid */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="glass rounded-2xl overflow-hidden group opacity-0 animate-fade-up hover:border-primary/30 transition-all duration-300"
                  style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={image.image_url}
                      alt={image.prompt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        variant="glow"
                        size="lg"
                        onClick={() => handleDownload(image.image_url, image.prompt)}
                      >
                        <Download className="w-5 h-5" />
                        Download
                      </Button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-sm text-foreground line-clamp-2 mb-2">
                      {image.prompt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(image.created_at)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(image.image_url, image.prompt)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="glass rounded-2xl p-12 text-center opacity-0 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                No images yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start creating amazing AI images and they'll appear here
              </p>
              <Button variant="glow" size="lg" asChild>
                <Link to="/generate">
                  <Sparkles className="w-5 h-5" />
                  Generate Your First Image
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyImages;
