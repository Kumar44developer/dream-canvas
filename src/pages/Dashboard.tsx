import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2, CreditCard, LogOut, Coins, Image, Zap, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import pixelmindLogo from "@/assets/pixelmind-logo.png";

interface ImageStats {
  imagesCreated: number;
  creditsUsed: number;
  generationsToday: number;
  favorites: number;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading, refetchProfile } = useProfile();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [stats, setStats] = useState<ImageStats>({
    imagesCreated: 0,
    creditsUsed: 0,
    generationsToday: 0,
    favorites: 0,
  });

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      toast.success("Payment successful! Credits have been added.");
      refetchProfile();
      setSearchParams({});
    }
  }, [searchParams, refetchProfile, setSearchParams]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      // Fetch all images for the user
      const { data: images, error } = await supabase
        .from("generated_images")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching stats:", error);
        return;
      }

      // Calculate stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const generationsToday = images?.filter((img) => {
        const imgDate = new Date(img.created_at);
        return imgDate >= today;
      }).length ?? 0;

      const totalCreditsUsed = images?.reduce((sum, img) => sum + img.credits_used, 0) ?? 0;

      setStats({
        imagesCreated: images?.length ?? 0,
        creditsUsed: totalCreditsUsed,
        generationsToday,
        favorites: 0, // Favorites feature not implemented yet
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background hero-gradient flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const userName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const credits = profile?.credits ?? 10;

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
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Welcome Section */}
          <div className="text-center mb-12 opacity-0 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Welcome back, <span className="text-gradient">{userName}</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Ready to create something amazing today?
            </p>
          </div>

          {/* Credits Card */}
          <div className="glass rounded-2xl p-6 mb-8 opacity-0 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Coins className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Available Credits</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-4xl font-bold text-foreground">{credits}</span>
                    <span className="text-muted-foreground">credits</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="lg" asChild>
                <Link to="/buy-credits">
                  <CreditCard className="w-5 h-5" />
                  Buy Credits
                </Link>
              </Button>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Generate Image Card */}
            <div 
              className="glass rounded-2xl p-8 group hover:border-primary/30 transition-all duration-300 opacity-0 animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Wand2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
                Generate Image
              </h2>
              <p className="text-muted-foreground mb-6">
                Transform your ideas into stunning visuals with our AI-powered image generator.
              </p>
              <Button variant="glow" size="lg" className="w-full" asChild>
                <Link to="/generate">
                  <Wand2 className="w-5 h-5" />
                  Start Creating
                </Link>
              </Button>
            </div>

            {/* Buy Credits Card */}
            <div 
              className="glass rounded-2xl p-8 group hover:border-secondary/30 transition-all duration-300 opacity-0 animate-fade-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <CreditCard className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
                Buy Credits
              </h2>
              <p className="text-muted-foreground mb-6">
                Need more credits? Purchase additional credits to continue creating amazing images.
              </p>
              <Button variant="secondary" size="lg" className="w-full" asChild>
                <Link to="/buy-credits">
                  <CreditCard className="w-5 h-5" />
                  Get More Credits
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 opacity-0 animate-fade-up" style={{ animationDelay: "0.5s" }}>
            {[
              { icon: Image, label: "Images Created", value: stats.imagesCreated.toString() },
              { icon: Coins, label: "Credits Used", value: stats.creditsUsed.toString() },
              { icon: Zap, label: "Generations Today", value: stats.generationsToday.toString() },
              { icon: Heart, label: "Favorites", value: stats.favorites.toString() },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-4 text-center">
                <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* View My Images */}
          <div className="text-center opacity-0 animate-fade-up" style={{ animationDelay: "0.55s" }}>
            <Button variant="glass" size="lg" asChild>
              <Link to="/my-images">
                <Image className="w-5 h-5" />
                View My Images
              </Link>
            </Button>
          </div>

          {/* Logout Button - Mobile */}
          <div className="mt-8 text-center md:hidden opacity-0 animate-fade-up" style={{ animationDelay: "0.6s" }}>
            <Button variant="ghost" size="lg" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
              Logout
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
