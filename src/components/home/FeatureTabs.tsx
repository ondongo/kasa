'use client';

import { useState } from 'react';
import { Users, PiggyBank, TrendingUp, Globe, Shield, Zap } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    id: 'budget',
    icon: Users,
    label: 'Budget en Couple',
    color: '#F2C086',
    description: 'Gérez vos finances à deux avec des catégories partagées et un suivi en temps réel.',
    image: 'https://images.unsplash.com/photo-1605460375648-278bcbd579a6?w=800&h=600&fit=crop&q=80',
  },
  {
    id: 'tontines',
    icon: PiggyBank,
    label: 'Tontines',
    color: '#F2C086',
    description: 'Organisez des tontines collectives, invitez des membres et suivez automatiquement les tours.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop&q=80',
  },
  {
    id: 'investments',
    icon: TrendingUp,
    label: 'Investissements',
    color: '#F2C086',
    description: 'Suivez l\'évolution de vos placements avec des enveloppes dédiées et des graphiques détaillés.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&q=80',
  },
  {
    id: 'currencies',
    icon: Globe,
    label: 'Multi-devises',
    color: '#F2C086',
    description: 'EUR, USD, FCFA - Toutes vos transactions converties automatiquement.',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=600&fit=crop&q=80',
  },
  {
    id: 'security',
    icon: Shield,
    label: 'Sécurité',
    color: '#F2C086',
    description: 'Authentification 2FA, chiffrement bout en bout, appareils de confiance.',
    image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=600&fit=crop&q=80',
  },
  {
    id: 'performance',
    icon: Zap,
    label: 'Rapidité',
    color: '#F2C086',
    description: 'Interface ultra-rapide avec synchronisation en temps réel sur tous vos appareils.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&q=80',
  },
];

export function FeatureTabs() {
  const [activeTab, setActiveTab] = useState('budget');

  const activeFeature = features.find((f) => f.id === activeTab) || features[0];
  const Icon = activeFeature.icon;

  return (
    <section className="py-20 md:py-28 bg-transparent">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Découvrez nos fonctionnalités
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour gérer vos finances efficacement
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {features.map((feature) => {
            const FeatureIcon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full font-medium transition-all ${
                  activeTab === feature.id
                    ? 'bg-[#F2C086] text-black'
                    : 'bg-card text-gray-300 border-2 border-[#F2C086]/20'
                }`}
              >
                <FeatureIcon className="h-5 w-5" />
                <span>{feature.label}</span>
              </button>
            );
          })}
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Card */}
          <div className="relative">
            <div className="bg-card rounded-2xl p-8 md:p-12 border-2 border-[#F2C086]/20">
              <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-[#2A2520] border border-[#F2C086]">
                  <Icon className="h-5 w-5 text-[#F2C086]" />
                  <span className="font-semibold text-[#F2C086]">{activeFeature.label}</span>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed">
                  {activeFeature.description}
                </p>
                <div className="mt-8 space-y-3">
                  {['Facile à utiliser', 'Synchronisation temps réel', 'Données sécurisées'].map(
                    (benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#2A2520]">
                          <svg
                            className="w-3 h-3 text-[#F2C086]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-300">{benefit}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden bg-[#2A2520] border border-[#F2C086]">
                <Image
                  src={activeFeature.image}
                  alt={activeFeature.label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#1E2634]/90 via-[#1E2634]/50 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8 relative z-10">
                    <Icon className="w-20 h-20 mx-auto mb-4 text-[#F2C086]" />
                    <p className="text-2xl font-bold text-[#F2C086]">
                      {activeFeature.label}
                    </p>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
