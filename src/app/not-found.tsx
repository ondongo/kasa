'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/layout/Logo';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
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
                S'inscrire
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 404 Content */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-2xl mx-auto">
            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="text-9xl md:text-[12rem] font-extrabold text-[#F2C086] leading-none">
                404
              </h1>
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Page introuvable
            </h2>
            
            <p className="text-lg text-gray-300 max-w-xl mx-auto mb-12">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-[#F2C086]/20 text-gray-300 hover:bg-[#2A2520] h-12 px-8 text-base rounded-full"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Retour en arrière
              </Button>
            </div>

            {/* Helpful Links */}
            <div className="mt-16 pt-8 border-t border-[#2A2520]">
              <p className="text-sm text-gray-400 mb-4">Vous cherchez peut-être :</p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/" className="text-sm text-[#F2C086] hover:underline">
                  Accueil
                </Link>
                <Link href="/pricing" className="text-sm text-[#F2C086] hover:underline">
                  Tarifs
                </Link>
                <Link href="/commerçants" className="text-sm text-[#F2C086] hover:underline">
                  Commerçants
                </Link>
                <a href="/#faq" className="text-sm text-[#F2C086] hover:underline">
                  FAQ
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}

