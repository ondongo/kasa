"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Sparkles,
  Clock,
  CreditCard,
  Shield,
  Zap,
  Crown,
  CheckCircle2,
} from "lucide-react";

import { toast } from "react-toastify";
import { PricingSkeleton } from "@/components/skeletons/PricingSkeleton";

export default function PricingPage() {
  const { data: session, status } = useSession();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

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

  const handleSubscribe = useCallback(async () => {
    if (status === "loading" || !session) {
      toast.info("Veuillez patienter, chargement de la session...");
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch("/api/subscription/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.status === 401) {
        toast.error("Session expirée. Veuillez vous reconnecter.");
        setProcessing(false);
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Réponse non-JSON:", response.status, response.statusText);
        toast.error("Erreur lors de la communication avec le serveur");
        setProcessing(false);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        console.error("Erreur API:", data);
        toast.error(data.error || "Erreur lors de la création de l'abonnement");
        setProcessing(false);
        return;
      }

      if (data.paymentUrl) {
        toast.success("Redirection vers PayDunya...");
        window.location.href = data.paymentUrl;
      } else {
        console.error("Pas d'URL de paiement:", data);
        toast.error("Erreur: URL de paiement non reçue");
        setProcessing(false);
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
      setProcessing(false);
    }
  }, [session, status]);

  useEffect(() => {
    loadSubscription();
  }, []);

  useEffect(() => {
    if (!session || loading) return;

    const pendingPayment = localStorage.getItem("pendingPayment");
    const urlParams = new URLSearchParams(window.location.search);
    const paymentParam = urlParams.get("payment");

    if (pendingPayment === "true" || paymentParam === "true") {
      localStorage.removeItem("pendingPayment");
      setTimeout(() => {
        handleSubscribe();
      }, 1000);
    }
  }, [session, loading, handleSubscribe]);

  const getDaysRemaining = () => {
    if (!subscription?.endDate) return 0;
    const end = new Date(subscription.endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const isActive = subscription?.status === "ACTIVE";
  const isTrialActive = subscription?.status === "TRIAL";
  const isExpired =
    subscription?.status === "EXPIRED" || subscription?.status === "CANCELLED";

  if (loading) {
    return <PricingSkeleton />;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Tarifs
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-6">
            La solution complète pour gérer votre budget seul ou en couple
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2A2520] border border-[#F2C086]/30">
            <Sparkles className="h-5 w-5 text-[#F2C086]" />
            <p className="text-sm font-semibold text-[#F2C086]">
              Économisez jusqu'à <span className="text-white font-bold">1.000.000 FCFA</span> par an
            </p>
          </div>
        </div>

        {/* Statut actuel - Afficher UNIQUEMENT si abonnement ACTIVE (pas TRIAL) */}
        {subscription && isActive && (
          <Card className="mb-12 border-2 border-[#F2C086]/20 bg-card max-w-2xl mx-auto">
            <CardHeader className="bg-[#2A2520] border-b border-[#F2C086]/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-white">Votre abonnement</CardTitle>
                <Badge className="bg-[#F2C086] text-black px-3 py-1">
                  ✨ Premium
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center p-4 rounded-lg bg-[#2A2520]">
                  <Clock className="h-8 w-8 text-[#F2C086] mb-2" />
                  <p className="text-sm text-gray-400 mb-1">Jours restants</p>
                  <p className="text-2xl font-bold text-white">{getDaysRemaining()}</p>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-[#2A2520]">
                  <Shield className="h-8 w-8 text-green-500 mb-2" />
                  <p className="text-sm text-gray-400 mb-1">Statut</p>
                  <p className="text-lg font-semibold text-green-500">Actif</p>
                </div>
                {subscription.endDate && (
                  <div className="flex flex-col items-center p-4 rounded-lg bg-[#2A2520]">
                    <CreditCard className="h-8 w-8 text-[#F2C086] mb-2" />
                    <p className="text-sm text-gray-400 mb-1">Expire le</p>
                    <p className="text-sm font-semibold text-white">
                      {new Date(subscription.endDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-[#F2C086]/20 bg-card">
            <CardHeader className="text-center pb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Crown className="h-8 w-8 text-[#F2C086]" />
                <CardTitle className="text-3xl font-bold text-white">Plan Premium</CardTitle>
              </div>
              <CardDescription className="text-gray-400 text-lg">
                Accédez à toutes les fonctionnalités
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Prix */}
              <div className="text-center">
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-6xl font-extrabold text-[#F2C086]">2 000</span>
                  <div className="flex flex-col items-start">
                    <span className="text-2xl font-bold text-gray-400">FCFA</span>
                    <span className="text-sm text-gray-500">/ an</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Soit ~3,05 € ou ~3,32 $ par an
                </p>
                <p className="text-sm font-medium text-[#F2C086] mt-1">
                  Seulement 167 FCFA par mois
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3">
                {[
                  "Budget illimité (seul ou en couple)",
                  "Tontines collectives sans limite",
                  "Suivi des investissements",
                  "Multi-devises (EUR, USD, FCFA)",
                  "Graphiques et statistiques",
                  "Export PDF et CSV",
                  "Support client réactif",
                  "7 jours d'essai gratuit",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#F2C086] shrink-0" />
                    <span className="text-sm font-medium text-gray-300">{item}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                onClick={handleSubscribe}
                disabled={processing || isActive}
                size="lg"
                className="w-full bg-[#F2C086] hover:bg-[#F2C086]/90 text-black font-semibold h-14 text-lg"
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Traitement en cours...
                  </>
                ) : isActive ? (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Abonnement actif
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Prendre l'abonnement
                  </>
                )}
              </Button>

              {/* Message pour essai gratuit */}
              {isTrialActive && (
                <div className="text-center p-4 rounded-lg bg-[#2A2520] border border-[#F2C086]/20">
                  <p className="text-sm text-gray-400">
                    Vous êtes en période d'essai gratuit.{" "}
                    <span className="text-[#F2C086] font-semibold">
                      {getDaysRemaining()} jour{getDaysRemaining() > 1 ? "s" : ""} restant{getDaysRemaining() > 1 ? "s" : ""}
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pourquoi Kasa */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">
            Pourquoi choisir Kasa ?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center border-2 border-[#F2C086]/20 bg-card">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-2xl bg-[#2A2520] flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-[#F2C086]" />
                </div>
                <CardTitle className="text-xl text-white">Sécurisé</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Vos données sont chiffrées de bout en bout. Authentification à deux facteurs (2FA) incluse.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-[#F2C086]/20 bg-card">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-2xl bg-[#2A2520] flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-[#F2C086]" />
                </div>
                <CardTitle className="text-xl text-white">Simple</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Interface moderne et intuitive. Commencez à gérer votre budget en quelques clics.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-[#F2C086]/20 bg-card">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-2xl bg-[#2A2520] flex items-center justify-center mb-4">
                  <CreditCard className="h-8 w-8 text-[#F2C086]" />
                </div>
                <CardTitle className="text-xl text-white">Abordable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Seulement 2 000 FCFA/an. Investissez 2000 FCFA pour économiser jusqu'à 1.000.000 FCFA par an.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
