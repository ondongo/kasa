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
import { Crown, CheckCircle2, Sparkles, Play } from 'lucide-react';

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
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-white">
                Un prix abordable pour tous
              </h2>
              <p className="text-lg text-gray-400 mb-4">
                Accédez à toutes les fonctionnalités pour seulement 2000 FCFA par an
              </p>
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                <Sparkles className="h-5 w-5 text-green-400" />
                <p className="text-base font-semibold text-green-400">
                  Avec 2000 FCFA par an, économisez jusqu'à <span className="text-white font-bold">1.000.000 FCFA</span> par an en gérant mieux vos finances
                </p>
              </div>
            </div>

            {/* Pricing card */}
            <div className="relative max-w-md mx-auto">
              <div className="bg-card p-10 rounded-2xl border-2 border-[#F2C086]/20">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Crown className="h-6 w-6 text-[#F2C086]" />
                <h3 className="text-2xl font-bold text-white">Plan Premium</h3>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-extrabold text-[#F2C086]">2 000</span>
                  <div className="flex flex-col items-start">
                    <span className="text-xl font-bold text-gray-400">FCFA</span>
                    <span className="text-sm text-gray-400">/ an</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Soit ~3,05 € ou ~3,32 $ par an
                </p>
                <p className="text-sm font-medium text-[#F2C086] mt-1">
                  ✨ Seulement 167 FCFA par mois
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Budget illimité (seul ou en couple)',
                  'Tontines collectives sans limite',
                  'Suivi des investissements',
                  'Multi-devises (EUR, USD, FCFA)',
                  'Graphiques et statistiques',
                  'Export PDF et CSV',
                  'Support client réactif',
                  '30 jours d\'essai gratuit',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#F2C086] shrink-0" />
                    <span className="text-sm font-medium text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/login">
                <Button
                  size="lg"
                  className="w-full bg-[#F2C086] hover:bg-[#F2C086]/90 text-black font-semibold h-12"
                >
                  Commencer maintenant
                </Button>
              </Link>
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
