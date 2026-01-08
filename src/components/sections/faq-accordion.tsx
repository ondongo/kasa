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
      question: "Qu'est-ce que Kasa et que peut-il faire ?",
      answer:
        "Kasa est une plateforme complète de gestion budgétaire qui s'adapte à vos besoins : budgetisation individuelle, en couple ou en groupe. Vous pouvez créer des catégories personnalisables, suivre vos revenus et dépenses, gérer des enveloppes d'investissement et des boîtes d'épargne, organiser des tontines collectives, et attribuer vos transactions (Moi/Partenaire/Commun). Toutes vos données sont synchronisées en temps réel sur tous vos appareils avec des rapports et statistiques détaillés.",
    },
    {
      id: 2,
      question: 'Comment fonctionnent les tontines sur Kasa ?',
      answer:
        'Les tontines sur Kasa permettent d\'organiser des systèmes d\'épargne collective facilement. Créez une tontine, invitez des membres par code, définissez le montant et la fréquence des contributions. Kasa gère automatiquement les tours de rotation, suit les contributions de chaque membre, envoie des rappels, et vous permet de voir l\'historique complet de toutes vos tontines.',
    },
    {
      id: 3,
      question: "Quelles fonctionnalités de gestion financière sont disponibles ?",
      answer:
        "Kasa offre une gamme complète d'outils : catégories personnalisables pour organiser vos transactions, enveloppes d'investissement pour suivre vos placements, boîtes d'épargne pour vos objectifs financiers, transactions récurrentes pour automatiser vos entrées et sorties, rapports détaillés avec graphiques d'évolution, et attribution des transactions pour une gestion en couple ou en groupe. Tout cela avec support multi-devises (EUR, USD, FCFA) et conversion automatique.",
    },
    {
      id: 4,
      question: 'Comment Kasa protège mes données financières ?',
      answer:
        'La sécurité est une priorité absolue. Vos données sont chiffrées de bout en bout, nous proposons l\'authentification à deux facteurs (2FA) par SMS, la gestion des appareils de confiance, et la vérification d\'email et de téléphone. Vous avez un contrôle total sur qui peut accéder à votre budget partagé, et toutes les synchronisations sont sécurisées.',
    },
    {
      id: 5,
      question: "Quel est le prix et puis-je essayer gratuitement ?",
      answer:
        'Kasa coûte seulement 2000 FCFA par an (environ 3€ ou 3,32$), ce qui représente un excellent rapport qualité-prix pour toutes les fonctionnalités offertes. Vous bénéficiez de 7 jours d\'essai gratuit pour explorer toutes les capacités de la plateforme : budgetisation, tontines, investissements, multi-devises, et bien plus, sans engagement ni carte bancaire requise.',
    },
  ];

  const toggleItem = (itemId: number) => {
    setActiveItem(activeItem === itemId ? null : itemId);
  };

  return (
    <section id="faq" className="py-14 md:py-28 bg-transparent">
      <div className="wrapper">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="mb-4 font-bold text-center text-white text-4xl md:text-title-lg">
            Questions fréquentes
          </h2>
          <p className="max-w-xl mx-auto text-xl leading-relaxed text-gray-400">
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
    <div className="pb-5 border-b border-[#2A2520]">
      <button
        type="button"
        className="flex items-center justify-between w-full text-left"
        onClick={onToggle}
        aria-expanded={isActive}
      >
        <span className="text-lg font-medium text-white">
          {item.question}
        </span>
        <span className="shrink-0 ml-6 text-[#F2C086]">
          {isActive ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </span>
      </button>
      {isActive && (
        <div className="mt-5">
          <p className="text-base leading-7 text-gray-400">
            {item.answer}
          </p>
        </div>
      )}
    </div>
  );
}
