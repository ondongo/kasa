"use client";

import { Star } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Marie Dupont',
    role: 'Utilisatrice Premium',
    avatar: 'MD',
    testimonial:
      'Kasa a transformé la gestion de notre budget de couple. Tout est transparent et synchronisé en temps réel. Plus de disputes sur l\'argent !',
    rating: 5,
  },
  {
    id: 2,
    name: 'Jean Kouassi',
    role: 'Membre Tontine',
    avatar: 'JK',
    testimonial:
      'La fonctionnalité tontine est géniale ! Je gère 3 tontines avec mes amis et tout est automatisé. Les rappels sont très pratiques.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Sophie Martin',
    role: 'Investisseuse',
    avatar: 'SM',
    testimonial:
      'Le suivi des investissements est très clair. J\'adore voir l\'évolution de mon patrimoine en temps réel avec les graphiques.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Amadou Diallo',
    role: 'Utilisateur FCFA',
    avatar: 'AD',
    testimonial:
      'Enfin une app qui supporte vraiment le FCFA ! La conversion automatique avec l\'euro fonctionne parfaitement.',
    rating: 5,
  },
  {
    id: 5,
    name: 'Claire Dubois',
    role: 'Utilisatrice Premium',
    avatar: 'CD',
    testimonial:
      'Interface magnifique et intuitive. Le mode sombre est parfait pour mes yeux. Je recommande à tous mes amis !',
    rating: 5,
  },
  {
    id: 6,
    name: 'Ibrahim Traoré',
    role: 'Chef de famille',
    avatar: 'IT',
    testimonial:
      'La sécurité avec la 2FA me rassure complètement. Mes données financières sont bien protégées. Excellent service !',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [showAll, setShowAll] = useState(false);

  const visibleTestimonials = showAll
    ? testimonials
    : testimonials.slice(0, 3);

  return (
    <section className="py-20 md:py-28 relative bg-transparent">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto mb-16 text-center">
          <h2 className="mb-4 font-bold text-gray-800 text-4xl dark:text-white/90 md:text-title-lg">
            Ce que nos utilisateurs disent
          </h2>
          <p className="max-w-xl mx-auto text-xl leading-relaxed text-gray-500 dark:text-gray-400">
            Rejoignez des centaines d'utilisateurs satisfaits qui ont simplifié leur gestion financière
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {visibleTestimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
            />
          ))}
        </div>

        {/* Show More Button */}
        {testimonials.length > 3 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            >
              {showAll ? 'Voir moins' : 'Voir plus de témoignages'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof testimonials)[number];
}) {
  return (
    <div className="relative group">
      {/* Subtle glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F2C086]/20 to-[#F2C086]/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
      
      {/* Card */}
      <div className="relative bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1">
        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#F2C086] text-[#F2C086]" />
          ))}
        </div>

        {/* Testimonial */}
        <p className="text-gray-300 mb-6 leading-relaxed">
          "{testimonial.testimonial}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#F2C086]/20 flex items-center justify-center font-semibold text-[#F2C086]">
            {testimonial.avatar}
          </div>
          <div>
            <h4 className="font-semibold text-white">
              {testimonial.name}
            </h4>
            <p className="text-sm text-gray-400">
              {testimonial.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
