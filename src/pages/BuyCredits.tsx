import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft, Check, Zap, Star, Crown, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 199,
    credits: 50,
    icon: Zap,
    popular: false,
    features: [
      "50 image generations",
      "Standard quality",
      "Basic styles",
      "24h support",
    ],
  },
  {
    id: "popular",
    name: "Popular",
    price: 499,
    credits: 150,
    icon: Star,
    popular: true,
    features: [
      "150 image generations",
      "HD quality",
      "All styles unlocked",
      "Priority support",
      "Commercial license",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 999,
    credits: 400,
    icon: Crown,
    popular: false,
    features: [
      "400 image generations",
      "Ultra HD quality",
      "All styles + exclusive",
      "Priority support",
      "Commercial license",
      "API access",
    ],
  },
];

const BuyCredits = () => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const { session } = useAuth();
  const { refetchProfile } = useProfile();

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "cancelled") {
      toast.error("Payment was cancelled");
    }
  }, [searchParams]);

  const handleBuy = async (planId: string) => {
    if (!session) {
      toast.error("Please sign in to purchase credits");
      return;
    }

    setLoadingPlan(planId);

    try {
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: { packageId: planId },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.url) {
        window.open(data.url, "_blank");
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to start payment");
    } finally {
      setLoadingPlan(null);
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
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12 opacity-0 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Buy <span className="text-gradient">Credits</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your creative needs. More credits, more creations!
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative glass rounded-2xl p-6 lg:p-8 opacity-0 animate-fade-up transition-all duration-300 hover:scale-105 ${
                  plan.popular
                    ? "border-primary/50 shadow-[0_0_40px_hsl(var(--primary)/0.2)]"
                    : "hover:border-primary/30"
                }`}
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                    plan.popular
                      ? "bg-gradient-to-br from-primary to-secondary"
                      : "bg-gradient-to-br from-primary/20 to-secondary/20"
                  }`}
                >
                  <plan.icon
                    className={`w-7 h-7 ${
                      plan.popular ? "text-primary-foreground" : "text-primary"
                    }`}
                  />
                </div>

                {/* Plan Name */}
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-6">
                  <span className="font-display text-4xl font-bold text-foreground">
                    ₹{plan.price}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    / {plan.credits} credits
                  </span>
                </div>

                {/* Per Credit Cost */}
                <p className="text-sm text-muted-foreground mb-6">
                  ₹{(plan.price / plan.credits).toFixed(2)} per credit
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Buy Button */}
                <Button
                  variant={plan.popular ? "glow" : "outline"}
                  size="lg"
                  className="w-full"
                  onClick={() => handleBuy(plan.id)}
                  disabled={loadingPlan !== null}
                >
                  {loadingPlan === plan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Buy ${plan.credits} Credits`
                  )}
                </Button>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <p className="text-center text-muted-foreground text-sm mt-12 opacity-0 animate-fade-up" style={{ animationDelay: "0.5s" }}>
            All payments are secure and encrypted. Credits never expire.
          </p>
        </div>
      </main>
    </div>
  );
};

export default BuyCredits;
