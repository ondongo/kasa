"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Loader2,
  Sparkles,
  Clock,
  CreditCard,
  Shield,
  Zap,
  Crown,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

import { toast } from "react-toastify";
import { PricingSkeleton } from "@/components/skeletons/PricingSkeleton";

export default function PricingPage() {
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const response = await fetch("/api/subscription/status");
      const data = await response.json();
      setSubscription(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    setProcessing(true);
    try {
      const response = await fetch("/api/subscription/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Erreur lors de la création de l'abonnement");
        setProcessing(false);
        return;
      }

      // Rediriger vers PayDunya
      if (data.paymentUrl) {
        toast.success("Redirection vers PayDunya...");
        window.location.href = data.paymentUrl;
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
      setProcessing(false);
    }
  };

  const getDaysRemaining = () => {
    if (!subscription?.endDate) return 0;
    const end = new Date(subscription.endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const isTrialActive = subscription?.status === "TRIAL";
  const isActive = subscription?.status === "ACTIVE";
  const isExpired =
    subscription?.status === "EXPIRED" || subscription?.status === "CANCELLED";

  if (loading) {
    return <PricingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Offre de lancement</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Gérez votre budget ensemble
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            La solution complète pour gérer vos finances en couple. Simple,
            sécurisé et accessible.
          </p>
        </div>

        {/* Statut actuel */}
        {subscription && (
          <Card className="mb-12 border-2 shadow-lg max-w-2xl mx-auto">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Votre abonnement</CardTitle>
                <Badge
                  variant={
                    isActive
                      ? "default"
                      : isTrialActive
                      ? "secondary"
                      : "destructive"
                  }
                  className="text-sm px-3 py-1"
                >
                  {isTrialActive && "🎉 Essai gratuit"}
                  {isActive && "✨ Premium"}
                  {isExpired && "⏰ Expiré"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(isTrialActive || isActive) && (
                  <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                    <Clock className="h-8 w-8 text-primary mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">
                      Jours restants
                    </p>
                    <p className="text-2xl font-bold">{getDaysRemaining()}</p>
                  </div>
                )}
                {isActive && subscription.endDate && (
                  <>
                    <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                      <Shield className="h-8 w-8 text-green-600 mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">
                        Statut
                      </p>
                      <p className="text-lg font-semibold text-green-600">
                        Actif
                      </p>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                      <CreditCard className="h-8 w-8 text-[#F2C086] mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">
                        Expire le
                      </p>
                      <p className="text-sm font-semibold">
                        {new Date(subscription.endDate).toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>
                    </div>
                  </>
                )}
                {isTrialActive && (
                  <div className="flex flex-col items-center p-4 rounded-lg bg-primary/10">
                    <Zap className="h-8 w-8 text-primary mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">
                      Essai gratuit
                    </p>
                    <p className="text-sm font-semibold">30 jours</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <section className="py-20 md:py-28 bg-muted/50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">
                  Un prix abordable pour tous
                </h2>
                <p className="text-xl text-muted-foreground">
                  Accédez à toutes les fonctionnalités pour seulement 2000 FCFA
                  par an
                </p>
              </div>

              <div className="bg-card p-10 rounded-2xl border-2 border-[#F2C086]/20 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Crown className="h-6 w-6 text-[#F2C086]" />
                  <h3 className="text-2xl font-bold">Plan Premium</h3>
                </div>

                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-6xl font-extrabold text-[#F2C086]">
                      2 000
                    </span>
                    <div className="flex flex-col items-start">
                      <span className="text-2xl font-bold text-muted-foreground">
                        FCFA
                      </span>
                      <span className="text-sm text-muted-foreground">
                        / an
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Soit ~3,05 € ou ~3,32 $ par an
                  </p>
                  <p className="text-sm font-medium text-[#F2C086] mt-1">
                    ✨ Seulement 167 FCFA par mois
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "Budget en couple illimité",
                    "Tontines collectives sans limite",
                    "Suivi des investissements",
                    "Multi-devises (EUR, USD, FCFA)",
                    "Graphiques et statistiques",
                    "Export PDF et CSV",
                    "Support client réactif",
                    "30 jours d'essai gratuit",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#F2C086] shrink-0" />
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/login">
                  <Button
                    size="lg"
                    className="w-full bg-[#F2C086] hover:bg-[#F2C086]/90 text-[#1a1a1a] font-semibold h-12"
                  >
                    Commencer maintenant
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Plan d'abonnement */}
        <div className="grid md:grid-cols-1 gap-8 max-w-lg mx-auto">
          <Card className="relative overflow-hidden border-2 border-primary shadow-2xl hover:shadow-3xl transition-shadow duration-300">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />

            {/* Badge "Meilleure offre" */}
            <div className="absolute top-6 right-6 z-10">
              <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                <Sparkles className="h-3 w-3" />
                Recommandé
              </div>
            </div>

            <CardHeader className="pb-8 pt-8 relative">
              <div className="space-y-2">
                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Plan Annuel
                </CardTitle>
                <CardDescription className="text-base">
                  Accès illimité à toutes les fonctionnalités premium
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 relative">
              {/* Prix */}
              <div className="text-center py-6 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-xl border">
                <div className="flex items-baseline justify-center gap-3 mb-2">
                  <span className="text-6xl font-extrabold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    2 000
                  </span>
                  <div className="flex flex-col items-start">
                    <span className="text-2xl font-bold text-muted-foreground">
                      FCFA
                    </span>
                    <span className="text-sm text-muted-foreground">/ an</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-primary">
                    ✨ Seulement 167 FCFA par mois
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Soit ~3,05 € ou ~3,32 $ par an
                  </p>
                </div>
              </div>

              {/* Fonctionnalités */}
              <div className="space-y-1">
                <h3 className="font-semibold text-lg mb-4 text-center">
                  Ce qui est inclus :
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="rounded-full bg-primary/10 p-1">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                    </div>
                    <span className="text-sm font-medium">
                      Gestion de budget en couple
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="rounded-full bg-primary/10 p-1">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                    </div>
                    <span className="text-sm font-medium">
                      Suivi des revenus et dépenses
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="rounded-full bg-primary/10 p-1">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                    </div>
                    <span className="text-sm font-medium">
                      Gestion des investissements
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="rounded-full bg-primary/10 p-1">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                    </div>
                    <span className="text-sm font-medium">
                      Multi-devises (EUR, USD, FCFA...)
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="rounded-full bg-primary/10 p-1">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                    </div>
                    <span className="text-sm font-medium">
                      Graphiques et statistiques détaillés
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="rounded-full bg-primary/10 p-1">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                    </div>
                    <span className="text-sm font-medium">
                      Export PDF et CSV
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="rounded-full bg-primary/10 p-1">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                    </div>
                    <span className="text-sm font-medium">
                      Support client réactif
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 relative pt-6">
              {isTrialActive && (
                <div className="text-center px-4 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    ⏰ Votre essai gratuit expire dans {getDaysRemaining()}{" "}
                    jours
                  </p>
                </div>
              )}

              {(isTrialActive || isExpired) && (
                <Button
                  className="w-full h-14 text-base font-bold shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                  size="lg"
                  onClick={handleSubscribe}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Chargement...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      S&apos;abonner maintenant
                    </>
                  )}
                </Button>
              )}

              {isActive && (
                <div className="text-center px-4 py-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                  <p className="text-sm font-semibold text-green-700 dark:text-green-300 flex items-center justify-center gap-2">
                    <Check className="h-4 w-4" />
                    Vous êtes déjà abonné
                  </p>
                </div>
              )}

              <div className="text-center py-3 px-4 rounded-lg bg-muted/50">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  🔒 Paiement sécurisé via PayDunya
                </p>
                <p className="text-xs text-muted-foreground">
                  Orange Money • MTN • Moov Money • Wave
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Section Pourquoi Kasa */}
        <div className="mt-24 mb-12">
          <h2 className="text-3xl font-bold text-center mb-4">
            Pourquoi choisir Kasa ?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            La solution complète pour gérer vos finances en couple
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Sécurisé</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Vos données sont chiffrées de bout en bout. Authentification à
                  deux facteurs (2FA) incluse pour une protection maximale.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Simple</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Interface moderne et intuitive. Commencez à gérer votre budget
                  en quelques clics seulement.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Abordable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Seulement 2 000 FCFA/an. Moins cher qu'un repas au restaurant
                  pour un an de tranquillité financière !
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer CTA */}
        {!isActive && (
          <div className="text-center py-16 px-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-2 shadow-lg mb-8">
            <h3 className="text-3xl font-bold mb-4">
              Prêt à maîtriser vos finances ?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg">
              Rejoignez des centaines de couples qui gèrent déjà leur budget
              avec Kasa.
            </p>
            <Button
              onClick={handleSubscribe}
              disabled={processing}
              size="lg"
              className="h-14 px-10 text-base font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Chargement...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Commencer maintenant
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
