import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="pt-20 pb-16 relative overflow-hidden">
      <div className="max-w-[120rem] mx-auto relative">
        <div className="wrapper">
          <div className="max-w-[900px] mx-auto">
            <div className="text-center pb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F2C086]/10 border border-[#F2C086]/20 text-sm font-medium mb-8">
                <Sparkles className="h-4 w-4 text-[#F2C086]" />
                <span>La solution financière complète pour couples et groupes</span>
              </div>

              <h1 className="text-gray-700 mx-auto font-bold mb-6 text-5xl sm:text-6xl md:text-7xl dark:text-white/90 leading-tight max-w-[800px]">
                Gérez vos finances <span className="text-[#F2C086]">ensemble</span>
              </h1>
              <p className="max-w-[600px] text-center mx-auto dark:text-gray-400 text-gray-500 text-xl leading-relaxed">
                Budget en couple, tontines collectives, suivi des investissements. 
                Kasa est bien plus qu'une simple app de gestion de budget.
              </p>

              <div className="mt-10 flex sm:flex-row flex-col gap-4 relative z-30 items-center justify-center">
                <Link href="/login">
                  <Button size="lg" className="bg-[#F2C086] hover:bg-[#F2C086]/90 text-[#1a1a1a] font-semibold h-14 px-8 text-lg">
                    Essayer gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-12">
                <div>
                  <div className="text-3xl font-bold text-[#F2C086]">2000 FCFA</div>
                  <div className="text-sm text-muted-foreground">par an</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#F2C086]">3 devises</div>
                  <div className="text-sm text-muted-foreground">EUR, USD, FCFA</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#F2C086]">100%</div>
                  <div className="text-sm text-muted-foreground">Sécurisé</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
