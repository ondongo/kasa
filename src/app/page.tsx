import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/sections/hero-section';
import { CoreFeatures } from '@/components/sections/core-features';
import BenefitsGrid from '@/components/sections/benefits-grid';
import FaqAccordion from '@/components/sections/faq-accordion';
import { FloatingBadges } from '@/components/home/FloatingBadges';
import { FeatureTabs } from '@/components/home/FeatureTabs';
import TestimonialsSection from '@/components/sections/client-testimonial';
import { NavLinks } from '@/components/home/NavLinks';
import { Logo } from '@/components/layout/Logo';
import { Crown, CheckCircle2, Sparkles, Play, Shield, Zap, CreditCard } from 'lucide-react';

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background image */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/budget-background.png)' }}
        />
      </div>

      {/* Navigation */}
      <nav className="border-b bg-card border-[#2A2520] sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="text-xl font-bold text-white">Kasa</span>
          </Link>
          
          {/* Menu */}
          <div className="hidden md:flex items-center gap-1 bg-[#2A2520] rounded-full p-1">
            <NavLinks />
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-300">Connexion</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-[#F2C086] hover:bg-[#F2C086]/90 text-black font-semibold rounded-full">
                S'inscrire
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Badges flottants */}
      <FloatingBadges />

      {/* Hero Section avec vidéo */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2A2520] border border-[#F2C086] text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4 text-[#F2C086]" />
            <span className="text-gray-300">La solution financière complète pour gérer votre budget seul, en couple ou en groupe</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight max-w-4xl mx-auto text-white">
            Économisez jusqu'à <span className="text-[#F2C086]">1.000.000 FCFA</span> par an en gérant mieux vos finances
          </h1>
          
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
            Pour seulement <span className="text-[#F2C086] font-semibold">2000 FCFA par an</span>, prenez le contrôle total de votre budget, vos tontines et vos investissements. 
            La solution complète pour gérer vos finances seul, en couple ou en groupe.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/login">
              <Button size="lg" className="bg-[#F2C086] hover:bg-[#F2C086]/90 text-black font-semibold h-12 px-6 text-base rounded-full">
                Essayer gratuitement
              </Button>
            </Link>
          </div>

          {/* Section Vidéo */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-4 border-10 border-[#F2C086]/20 overflow-hidden">
              <div className="aspect-video rounded-xl flex items-center justify-center relative group cursor-pointer">
                <button className="relative z-10 w-16 h-16 rounded-full bg-[#F2C086] flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                  {/* Point central fixe */}
                  <div 
                    className="absolute w-16 h-16 rounded-full bg-[#F2C086] z-10 flex items-center justify-center"
                    style={{ 
                      boxShadow: '0 0 10px rgba(242, 192, 134, 0.9)'
                    }}
                  >
                    <Play className="h-8 w-8 text-black fill-black ml-1" />
                  </div>
                  {/* Cercle pulse 1 */}
                  <div 
                    className="absolute top-0 left-0 w-16 h-16 rounded-full border border-[#F2C086]"
                    style={{ 
                      animation: 'pulse-ring 2s ease-out infinite',
                      opacity: 0.8
                    }} 
                  />
                  {/* Cercle pulse 2 */}
                  <div 
                    className="absolute top-0 left-0 w-16 h-16 rounded-full border border-[#F2C086]"
                    style={{ 
                      animation: 'pulse-ring 2s ease-out infinite',
                      animationDelay: '1s',
                      opacity: 0.6
                    }} 
                  />
                </button>
                <p className="absolute bottom-4 left-4 text-white text-sm font-medium z-10">
                  Vidéo de démonstration
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs des fonctionnalités */}
      <div style={{ backgroundColor: '#191919' }} className="bg-muted/50">
        <FeatureTabs />
      </div>

      {/* Core Features */}
      <div style={{ backgroundColor: '#191919' }} className="bg-muted/50">
        <CoreFeatures />
      </div>

      {/* Benefits */}
      <div style={{ backgroundColor: '#191919' }} className="bg-muted/50">
        <BenefitsGrid />
      </div>

      {/* Testimonials */}
  <TestimonialsSection />

      {/* Pricing Section */}
      <section className="py-20 md:py-28 bg-transparent">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Tarifs
            </h2>
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

          {/* Pricing Card */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="bg-card border-2 border-[#F2C086]/20 rounded-2xl overflow-hidden">
              <div className="text-center pb-8 pt-8 px-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Crown className="h-8 w-8 text-[#F2C086]" />
                  <h3 className="text-3xl font-bold text-white">Plan Premium</h3>
                </div>
                <p className="text-gray-400 text-lg">
                  Accédez à toutes les fonctionnalités
                </p>
              </div>
              <div className="px-6 pb-8 space-y-8">
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
                <Link href="/login">
                  <Button
                    size="lg"
                    className="w-full bg-[#F2C086] hover:bg-[#F2C086]/90 text-black font-semibold h-14 text-lg"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Commencer maintenant
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Pourquoi Kasa */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-white">
              Pourquoi choisir Kasa ?
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center bg-card p-6 rounded-2xl border-2 border-[#F2C086]/20">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-[#2A2520] flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-[#F2C086]" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Sécurisé</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Vos données sont chiffrées de bout en bout. Authentification à deux facteurs (2FA) incluse.
                </p>
              </div>

              <div className="text-center bg-card p-6 rounded-2xl border-2 border-[#F2C086]/20">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-[#2A2520] flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-[#F2C086]" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Simple</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Interface moderne et intuitive. Commencez à gérer votre budget en quelques clics.
                </p>
              </div>

              <div className="text-center bg-card p-6 rounded-2xl border-2 border-[#F2C086]/20">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-[#2A2520] flex items-center justify-center mb-4">
                  <CreditCard className="h-8 w-8 text-[#F2C086]" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Abordable</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Seulement 2 000 FCFA/an. Investissez 2000 FCFA pour économiser jusqu'à 1.000.000 FCFA par an.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
  <FaqAccordion />

      {/* CTA Section */}
      <section className="py-20 bg-transparent">
        <div className="container mx-auto px-6">
          <div className="relative max-w-4xl mx-auto">
            {/* CTA Card */}
            <div className="text-center bg-card p-12 rounded-2xl border-2 border-[#F2C086]/20">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Prêt à transformer votre gestion financière ?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Rejoignez des centaines d'utilisateurs qui gèrent déjà leurs finances avec Kasa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-[#F2C086] hover:bg-[#F2C086]/90 text-black font-semibold h-12 px-6 text-base"
                >
                  Commencer gratuitement
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
      
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2A2520] py-8 bg-card">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <span className="text-xl font-bold text-white">Kasa</span>
            </Link>
            <p className="text-sm text-gray-400">
              © 2026 Kasa. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
