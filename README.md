# Kasa

Application web moderne de gestion de budget pour couples, inspirée de Finary. Gérez vos revenus, dépenses et investissements avec une interface élégante et intuitive.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-7.0-2D3748)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)

## Fonctionnalités

### Gestion complète du budget
- **Revenus** : Salaires, revenus complémentaires, aides, avantages
- **Dépenses** : Catégorisées par type (logement, vie quotidienne, transport, etc.)
- **Investissements** : Répartition par enveloppes (actions, livrets, comptes épargne)

### Visualisations
- **Dashboard** avec indicateurs clés :
  - Taux d'épargne
  - Revenus totaux
  - Dépenses totales
  - Reste à vivre
- **Diagramme Sankey** interactif pour visualiser les flux financiers

### Mode Couple
- Gestion à deux utilisateurs
- Attribution des transactions : Moi / Partenaire / Commun
- Vue consolidée du budget du foyer

### Historique
- Navigation par mois (précédent/suivant)
- Visualisation mensuelle des données
- Comparaison entre périodes

### Récurrences
- Gestion des transactions récurrentes (loyer, abonnements, virements)
- Fréquences : mensuelle, trimestrielle, annuelle
- Génération automatique

### Import/Export
- Export CSV des transactions
- Import CSV avec validation
- Rapport d'erreurs détaillé

### Interface
- Design minimaliste et sobre
- Dark mode par défaut
- Interface responsive
- Components shadcn/ui

## Installation

### Prérequis

- Node.js 20+
- PostgreSQL 14+
- npm ou yarn

### 1. Cloner le projet

\`\`\`bash
git clone https://github.com/votre-username/kasa.git
cd kasa
\`\`\`

### 2. Installer les dépendances

\`\`\`bash
npm install
\`\`\`

### 3. Configurer la base de données

Créez un fichier \`.env\` à la racine du projet :

\`\`\`env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/kasa?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production"

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
\`\`\`

### 4. Créer la base de données

\`\`\`bash
# Créer la base de données PostgreSQL
createdb kasa

# Ou via psql
psql -U postgres -c "CREATE DATABASE kasa;"
\`\`\`



## Remerciements

- Design inspiré de [Finary](https://finary.com)
- UI Components par [shadcn/ui](https://ui.shadcn.com)
- Icons par [Lucide](https://lucide.dev)


