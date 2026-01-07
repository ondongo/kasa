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
import { VideoIntro } from '@/components/home/VideoIntro';
import { FeatureTabs } from '@/components/home/FeatureTabs';
import TestimonialsSection from '@/components/sections/client-testimonial';
import { Crown, CheckCircle2, Sparkles, ChevronDown } from 'lucide-react';

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background avec effet comme login */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 -z-10">
        {/* Effets de lumière harmonisés */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F2C086]/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#F2C086]/15 rounded-full blur-3xl opacity-25 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F2C086]/10 rounded-full blur-3xl opacity-15"></div>
        
        {/* Pattern de grille */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
        
        {/* Formes flottantes */}
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-[#F2C086]/20 rounded-2xl rotate-12 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 border-2 border-[#F2C086]/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 border-2 border-[#F2C086]/20 rounded-lg -rotate-12 animate-pulse"></div>
      </div>

      {/* Navigation avec menu arrondi */}
      <nav className="border-b bg-gray-900/80 backdrop-blur-xl border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F2C086] flex items-center justify-center font-bold text-[#1a1a1a]">
              K
            </div>
            <span className="text-xl font-bold text-white">Kasa</span>
          </Link>
          
          {/* Menu arrondi */}
          <div className="hidden md:flex items-center gap-1 bg-gray-800/50 rounded-full p-1">
            <Link href="/">
              <button className="px-5 py-2 rounded-full bg-gray-700 text-white font-medium shadow-sm transition-all">
                Accueil
              </button>
            </Link>
            <div className="relative group">
              <button className="px-5 py-2 rounded-full hover:bg-gray-700/50 text-gray-300 font-medium transition-all flex items-center gap-1">
                Fonctionnalités
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <Link href="/pricing">
              <button className="px-5 py-2 rounded-full hover:bg-gray-700/50 text-gray-300 font-medium transition-all">
                Tarifs
              </button>
            </Link>
            <a href="#faq">
              <button className="px-5 py-2 rounded-full hover:bg-gray-700/50 text-gray-300 font-medium transition-all">
                FAQ
              </button>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-300 hover:text-white">Connexion</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-[#F2C086] hover:bg-[#F2C086]/90 text-[#1a1a1a] font-semibold rounded-full">
                Commencer
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F2C086]/10 border border-[#F2C086]/20 text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4 text-[#F2C086]" />
            <span className="text-gray-300">La solution financière complète pour couples et groupes</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight max-w-4xl mx-auto text-white">
            Gérez vos finances <span className="text-[#F2C086]">ensemble</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Budget en couple, tontines collectives, suivi des investissements. 
            Kasa est bien plus qu'une simple app de gestion de budget.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/login">
              <Button size="lg" className="bg-[#F2C086] hover:bg-[#F2C086]/90 text-[#1a1a1a] font-semibold h-14 px-8 text-lg rounded-full">
                Essayer gratuitement
              </Button>
            </Link>
            <VideoIntro />
          </div>

          {/* Stats avec effet néo */}
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-[#F2C086]/10 blur-3xl opacity-50"></div>
            <div className="relative grid grid-cols-3 gap-8 bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700">
              <div>
                <div className="text-3xl font-bold text-[#F2C086]">2000 FCFA</div>
                <div className="text-sm text-gray-400">par an</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#F2C086]">3 devises</div>
                <div className="text-sm text-gray-400">EUR, USD, FCFA</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#F2C086]">100%</div>
                <div className="text-sm text-gray-400">Sécurisé</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs des fonctionnalités */}
      <FeatureTabs />

      {/* Core Features */}
  <CoreFeatures />

      {/* Benefits */}
  <BenefitsGrid />

      {/* Testimonials */}
  <TestimonialsSection />

      {/* Pricing Section */}
      <section className="py-20 md:py-28 bg-transparent">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white/90">
                Un prix abordable pour tous
              </h2>
              <p className="text-xl text-gray-500 dark:text-gray-400">
                Accédez à toutes les fonctionnalités pour seulement 2000 FCFA par an
              </p>
            </div>

            {/* Pricing card avec encadrement */}
            <div className="relative max-w-md mx-auto">
              {/* Gradient border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#F2C086]/50 via-[#F2C086]/30 to-[#F2C086]/50 rounded-3xl blur-lg opacity-75"></div>
              
              {/* Main card */}
              <div className="relative bg-white dark:bg-gray-900 p-10 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Crown className="h-6 w-6 text-[#F2C086]" />
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white/90">Plan Premium</h3>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-6xl font-extrabold text-[#F2C086]">2 000</span>
                  <div className="flex flex-col items-start">
                    <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">FCFA</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">/ an</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Soit ~3,05 € ou ~3,32 $ par an
                </p>
                <p className="text-sm font-medium text-[#F2C086] mt-1">
                  ✨ Seulement 167 FCFA par mois
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Budget en couple illimité',
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
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item}</span>
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
        </div>
      </section>

      {/* FAQ */}
  <FaqAccordion />

      {/* CTA Section */}
      <section className="py-20 bg-transparent">
        <div className="container mx-auto px-6">
          <div className="relative max-w-4xl mx-auto">
            {/* Gradient glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#F2C086]/30 via-[#F2C086]/20 to-[#F2C086]/30 rounded-3xl blur-xl opacity-75"></div>
            
            {/* CTA Card */}
            <div className="relative text-center bg-white dark:bg-gray-900 p-12 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl backdrop-blur-sm">
            <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white/90">
              Prêt à transformer votre gestion financière ?
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Rejoignez des centaines de couples et groupes qui gèrent déjà leurs finances avec Kasa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-[#F2C086] hover:bg-[#F2C086]/90 text-[#1a1a1a] font-semibold h-14 px-8 text-lg"
                >
                  Commencer gratuitement
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ✨ 30 jours d'essai gratuit • 🔒 Aucune carte bancaire requise • 💰 2000 FCFA/an
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 bg-gray-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#F2C086] flex items-center justify-center font-bold text-[#1a1a1a]">
                K
              </div>
              <span className="text-xl font-bold text-white">Kasa</span>
            </Link>
            <p className="text-sm text-gray-400">
              © 2026 Kasa. Tous droits réservés.
            </p>
            <nav className="flex gap-4">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-[#F2C086]">
                Confidentialité
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-[#F2C086]">
                Conditions
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
