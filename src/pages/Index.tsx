import { Button } from "@/components/ui/button";
import { Sparkles, LogIn, UserPlus, Wand2, Image, Zap, Stars } from "lucide-react";
import heroShowcase from "@/assets/hero-showcase.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background hero-gradient overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              AI Image Generator
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <LogIn className="w-4 h-4" />
              Login
            </Button>
            <Button variant="outline" size="sm">
              <UserPlus className="w-4 h-4" />
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 px-6">
        <div className="container mx-auto">
          {/* Floating decorative elements */}
          <div className="absolute top-40 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground mb-6 opacity-0 animate-fade-up" style={{ animationDelay: "0.1s" }}>
                <Zap className="w-4 h-4 text-primary" />
                Powered by Advanced AI
              </div>
              
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 opacity-0 animate-fade-up" style={{ animationDelay: "0.2s" }}>
                Create stunning{" "}
                <span className="text-gradient">AI images</span>
                {" "}from text
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-10 opacity-0 animate-fade-up" style={{ animationDelay: "0.3s" }}>
                Transform your imagination into breathtaking visuals. Simply describe what you envision, and watch as AI brings your ideas to life.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 opacity-0 animate-fade-up" style={{ animationDelay: "0.4s" }}>
                <Button variant="glow" size="xl">
                  <Wand2 className="w-5 h-5" />
                  Generate Images
                </Button>
                <Button variant="glass" size="xl">
                  <UserPlus className="w-5 h-5" />
                  Sign Up Free
                </Button>
                <Button variant="ghost" size="lg" className="hidden sm:flex">
                  <LogIn className="w-5 h-5" />
                  Login
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center lg:justify-start gap-8 mt-12 pt-8 border-t border-border/30 opacity-0 animate-fade-up" style={{ animationDelay: "0.5s" }}>
                <div>
                  <div className="font-display text-3xl font-bold text-foreground">10M+</div>
                  <div className="text-sm text-muted-foreground">Images Created</div>
                </div>
                <div className="w-px h-12 bg-border/50" />
                <div>
                  <div className="font-display text-3xl font-bold text-foreground">500K+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div className="w-px h-12 bg-border/50 hidden sm:block" />
                <div className="hidden sm:block">
                  <div className="font-display text-3xl font-bold text-foreground">4.9★</div>
                  <div className="text-sm text-muted-foreground">User Rating</div>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="flex-1 relative opacity-0 animate-scale-in" style={{ animationDelay: "0.3s" }}>
              <div className="relative">
                {/* Main image with glow */}
                <div className="relative rounded-2xl overflow-hidden glow-primary animate-float">
                  <img 
                    src={heroShowcase} 
                    alt="AI Generated Art Showcase" 
                    className="w-full h-auto rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  
                  {/* Floating badge */}
                  <div className="absolute bottom-4 left-4 right-4 glass rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Stars className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">Crystal Nebula</div>
                        <div className="text-xs text-muted-foreground">Generated in 3.2 seconds</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative floating cards */}
                <div className="absolute -top-6 -right-6 glass rounded-xl p-3 animate-float-slow" style={{ animationDelay: "0.5s" }}>
                  <div className="flex items-center gap-2">
                    <Image className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">HD Quality</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 glass rounded-xl p-3 animate-float-slow" style={{ animationDelay: "1s" }}>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-secondary" />
                    <span className="text-sm font-medium text-foreground">Lightning Fast</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Wand2,
                title: "Text to Image",
                description: "Describe anything and watch AI create stunning visuals in seconds.",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Generate high-quality images in under 5 seconds with our optimized models.",
              },
              {
                icon: Stars,
                title: "Unlimited Styles",
                description: "From photorealistic to artistic, explore endless creative possibilities.",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="glass rounded-2xl p-6 group hover:border-primary/30 transition-all duration-300 opacity-0 animate-fade-up"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
