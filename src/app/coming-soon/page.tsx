import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/layout/Logo';
import { Clock, Sparkles, Mail } from 'lucide-react';

export default function ComingSoonPage() {
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
          
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-300">Connexion</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-[#F2C086] hover:bg-[#F2C086]/90 text-black font-semibold rounded-full">
                Commencer
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Coming Soon Content */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2A2520] border-2 border-[#F2C086] mb-8">
              <Clock className="h-5 w-5 text-[#F2C086] animate-pulse" />
              <span className="text-lg font-semibold text-[#F2C086]">Bientôt disponible</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">
              Quelque chose de <span className="text-[#F2C086]">génial</span> arrive
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
              Nous travaillons dur pour vous apporter une nouvelle fonctionnalité. 
              Restez connecté pour être parmi les premiers à en profiter !
            </p>

            {/* Email Notification Form */}
            <div className="bg-card p-8 rounded-2xl border-2 border-[#F2C086]/20 max-w-md mx-auto mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Mail className="h-5 w-5 text-[#F2C086]" />
                <h3 className="text-lg font-semibold text-white">Soyez notifié</h3>
              </div>
              <p className="text-sm text-gray-400 mb-6">
                Entrez votre email pour être averti dès la sortie
              </p>
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="flex-1 px-4 py-3 rounded-full bg-[#2A2520] border border-[#F2C086]/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#F2C086]"
                />
                <Button 
                  type="submit"
                  className="bg-[#F2C086] hover:bg-[#F2C086]/90 text-black font-semibold px-6 rounded-full"
                >
                  Notifier
                </Button>
              </form>
            </div>

            {/* Features Preview */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
              <div className="bg-card p-6 rounded-2xl border-2 border-[#F2C086]/20">
                <div className="w-12 h-12 rounded-full bg-[#2A2520] flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-[#F2C086]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Innovation</h3>
                <p className="text-sm text-gray-400">
                  Des fonctionnalités modernes et intuitives
                </p>
              </div>

              <div className="bg-card p-6 rounded-2xl border-2 border-[#F2C086]/20">
                <div className="w-12 h-12 rounded-full bg-[#2A2520] flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-[#F2C086]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Bientôt</h3>
                <p className="text-sm text-gray-400">
                  Disponible très prochainement
                </p>
              </div>

              <div className="bg-card p-6 rounded-2xl border-2 border-[#F2C086]/20">
                <div className="w-12 h-12 rounded-full bg-[#2A2520] flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-[#F2C086]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Notifications</h3>
                <p className="text-sm text-gray-400">
                  Soyez informé dès le lancement
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12">
              <Link href="/">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-[#F2C086]/20 text-gray-300 hover:bg-[#2A2520] h-12 px-8 text-base rounded-full"
                >
                  Retour à l'accueil
                </Button>
              </Link>
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

