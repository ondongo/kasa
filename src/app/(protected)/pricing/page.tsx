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
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Tarifs
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            La solution complète pour gérer votre budget seul ou en couple
          </p>
        </div>

        {/* Statut actuel - Afficher uniquement si abonnement actif */}
        {subscription && (isActive || isTrialActive) && (
          <Card className="mb-12 border-2 shadow-lg max-w-2xl mx-auto">
            <CardHeader className="bg-linear-to-r from-primary/10 to-primary/5 border-b">
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

        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 text-white">
                  Un prix abordable pour tous
                </h2>
                <p className="text-lg text-gray-400 mb-4">
                  Accédez à toutes les fonctionnalités pour seulement 2000 FCFA
                  par an
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                  <Sparkles className="h-5 w-5 text-green-400" />
                  <p className="text-base font-semibold text-green-400">
                    Avec 2000 FCFA par an, économisez jusqu'à <span className="text-white font-bold">1.000.000 FCFA</span> par an en gérant mieux vos finances
                  </p>
                </div>
              </div>

              <div className="bg-card p-10 rounded-2xl border-2 border-[#F2C086]/20 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Crown className="h-6 w-6 text-[#F2C086]" />
                  <h3 className="text-2xl font-bold">Plan Premium</h3>
                </div>

                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-extrabold text-[#F2C086]">
                      2 000
                    </span>
                    <div className="flex flex-col items-start">
                      <span className="text-xl font-bold text-gray-400">
                        FCFA
                      </span>
                      <span className="text-sm text-gray-400">
                        / an
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Soit ~3,05 € ou ~3,32 $ par an
                  </p>
                  <p className="text-sm font-medium text-[#F2C086] mt-1">
                    Seulement 167 FCFA par mois
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "Budget illimité (seul ou en couple)",
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


        {/* Section Pourquoi Kasa */}
        <div className="mt-16 mb-12">
          <h2 className="text-2xl font-bold text-center mb-4 text-white">
            Pourquoi choisir Kasa ?
          </h2>
          <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
            La solution complète pour gérer votre budget seul ou en couple
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-2 border-[#F2C086]/20 bg-card">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
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

            <Card className="text-center border-2 border-[#F2C086]/20 bg-card">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
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

            <Card className="text-center border-2 border-[#F2C086]/20 bg-card">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Abordable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Seulement 2 000 FCFA/an. Investissez 2000 FCFA pour économiser jusqu'à 1.000.000 FCFA par an grâce à une meilleure gestion de vos finances !
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer CTA */}
        {!isActive && (
          <div className="text-center py-12 px-6 rounded-2xl bg-card border-2 border-[#F2C086]/20 mb-8">
            <h3 className="text-2xl font-bold mb-4 text-white">
              Prêt à maîtriser vos finances ?
            </h3>
            <p className="text-gray-400 mb-4 max-w-xl mx-auto">
              Rejoignez des centaines d'utilisateurs qui gèrent déjà leur budget
              avec Kasa.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 mb-8">
              <Sparkles className="h-5 w-5 text-green-400" />
              <p className="text-base font-semibold text-green-400">
                Investissez <span className="text-white font-bold">2000 FCFA</span> pour économiser jusqu'à <span className="text-white font-bold">1.000.000 FCFA</span> par an
              </p>
            </div>
            <Button
              onClick={handleSubscribe}
              disabled={processing}
              size="lg"
              className="bg-[#F2C086] hover:bg-[#F2C086]/90 text-black font-semibold h-12 px-8"
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
