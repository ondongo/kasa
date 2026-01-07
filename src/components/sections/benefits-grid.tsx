import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import React from "react";

const benefits = [
  'Suivi des revenus et dépenses en temps réel',
  'Catégories et sous-catégories personnalisables',
  'Graphiques et statistiques détaillés',
  'Gestion des tontines avec calendrier de tours',
  'Enveloppes d\'investissement intelligentes',
  'Conversion automatique multi-devises',
  'Export PDF et CSV de vos données',
  'Notifications et rappels intelligents',
];

export default function BenefitsGrid() {
  return (
    <section className="py-20 md:py-28 bg-transparent">
      <div className="wrapper">
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <h2 className="max-w-2xl mx-auto mb-4 font-bold text-center text-white text-4xl md:text-title-lg">
            Tout ce dont vous avez besoin pour réussir
          </h2>
          <p className="max-w-2xl mx-auto text-xl font-normal leading-relaxed text-gray-400">
            Des fonctionnalités puissantes pour gérer vos finances efficacement
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg bg-card border-2 border-[#F2C086]/20"
              >
                <div className="rounded-full bg-[#2A2520] p-1 mt-0.5">
                  <CheckCircle2 className="h-5 w-5 text-[#F2C086]" />
                </div>
                <span className="font-medium text-gray-200">{benefit}</span>
              </div>
            ))}
            </div>

          <div className="mt-12 text-center">
            <Link href="/login">
              <button className="bg-[#F2C086] hover:bg-[#F2C086]/90 text-black font-semibold px-8 py-4 rounded-full text-lg transition-all">
                Commencer gratuitement
              </button>
                  </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
