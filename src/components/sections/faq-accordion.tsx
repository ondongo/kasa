"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

// Define the FAQ item type
interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export default function FaqAccordion() {
  const [activeItem, setActiveItem] = useState<number | null>(1);

  // FAQ data
  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: "Comment fonctionne Kasa ?",
      answer:
        "Kasa est une plateforme complète qui vous permet de gérer votre budget en couple, participer à des tontines collectives et suivre vos investissements. Tout est synchronisé en temps réel et accessible depuis n'importe quel appareil.",
    },
    {
      id: 2,
      question: 'Les tontines, comment ça marche ?',
      answer:
        'Une tontine est un système d\'épargne collective où chaque membre contribue régulièrement. À tour de rôle, un membre reçoit la somme totale collectée. Kasa gère automatiquement les tours, les contributions et envoie des rappels.',
    },
    {
      id: 3,
      question: "Quelles devises sont supportées ?",
      answer:
        "Kasa supporte l'Euro (EUR), le Dollar américain (USD) et le Franc CFA (XOF/XAF). Vous pouvez choisir votre devise préférée et le système convertit automatiquement les montants pour vous.",
    },
    {
      id: 4,
      question: 'Mes données sont-elles sécurisées ?',
      answer:
        'Absolument ! Vos données sont chiffrées de bout en bout. Nous proposons l\'authentification à deux facteurs (2FA) et la gestion des appareils de confiance pour une sécurité maximale.',
    },
    {
      id: 5,
      question: "Quel est le prix de Kasa ?",
      answer:
        'Kasa coûte seulement 2000 FCFA par an (environ 3€ ou 3,32$). Vous bénéficiez de 30 jours d\'essai gratuit pour tester toutes les fonctionnalités sans engagement.',
    },
  ];

  const toggleItem = (itemId: number) => {
    setActiveItem(activeItem === itemId ? null : itemId);
  };

  return (
    <section id="faq" className="py-14 md:py-28 bg-transparent">
      <div className="wrapper">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="mb-4 font-bold text-center text-gray-800 text-4xl dark:text-white/90 md:text-title-lg">
            Questions fréquentes
          </h2>
          <p className="max-w-xl mx-auto text-xl leading-relaxed text-gray-500 dark:text-gray-400">
            Tout ce que vous devez savoir sur Kasa
          </p>
        </div>
        <div className="max-w-[600px] mx-auto">
          <div className="space-y-4">
            {faqItems.map((item) => (
              <FAQItem
                key={item.id}
                item={item}
                isActive={activeItem === item.id}
                onToggle={() => toggleItem(item.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// FAQ Item Component
function FAQItem({
  item,
  isActive,
  onToggle,
}: {
  item: FAQItem;
  isActive: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="pb-5 border-b border-gray-200 dark:border-gray-800">
      <button
        type="button"
        className="flex items-center justify-between w-full text-left"
        onClick={onToggle}
        aria-expanded={isActive}
      >
        <span className="text-lg font-medium text-gray-800 dark:text-white/90">
          {item.question}
        </span>
        <span className="shrink-0 ml-6">
          {isActive ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </span>
      </button>
      {isActive && (
        <div className="mt-5">
          <p className="text-base leading-7 text-gray-500 dark:text-gray-400">
            {item.answer}
          </p>
        </div>
      )}
    </div>
  );
}
