# Kasa 💑💰

Application web moderne de gestion de budget pour couples, inspirée de Finary. Gérez vos revenus, dépenses et investissements avec une interface élégante et intuitive.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-7.0-2D3748)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)

## ✨ Fonctionnalités

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

### 5. Générer le client Prisma et exécuter les migrations

\`\`\`bash
npm run prisma:generate
npm run prisma:migrate
\`\`\`

### 6. Seeder la base de données (optionnel)

Le seed crée un utilisateur de démonstration et des données d'exemple :

\`\`\`bash
npm run prisma:seed
\`\`\`

**Credentials de démonstration :**
- Email : \`demo@kasa.fr\`
- Mot de passe : \`password123\`

**Données de seed :**
- Revenus : 3 197 € (Salaire 1394€ + Revenu complémentaire 1500€ + CAF 202€ + Ticket resto 101€)
- Dépenses : 1 297 € (Loyer, courses, restaurants, transport, abonnements, etc.)
- Investissements : 1 900 € (Actions, Livrets, Revolut)
- **Taux d'épargne : 59.4%**

### 7. Lancer l'application

\`\`\`bash
npm run dev
\`\`\`

L'application est accessible sur [http://localhost:3000](http://localhost:3000)

## Structure du projet

\`\`\`
kasa/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Routes d'authentification
│   │   └── login/
│   ├── app/                      # Routes protégées
│   │   ├── dashboard/            # Page dashboard
│   │   ├── incomes/              # Gestion des revenus
│   │   ├── expenses/             # Gestion des dépenses
│   │   ├── investments/          # Gestion des investissements
│   │   └── settings/             # Paramètres
│   ├── api/                      # API Routes
│   │   ├── auth/                 # NextAuth
│   │   ├── register/             # Inscription
│   │   └── transactions/         # Import/Export CSV
│   └── layout.tsx                # Layout principal
├── components/                   # Composants React
│   ├── layout/                   # Composants de layout
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── MonthPicker.tsx
│   ├── charts/                   # Graphiques
│   │   └── SankeyChart.tsx
│   ├── dialogs/                  # Modales
│   │   └── TransactionDialog.tsx
│   ├── tables/                   # Tableaux
│   │   └── TransactionsTable.tsx
│   └── ui/                       # shadcn/ui components
├── lib/                          # Logique métier et utilitaires
│   ├── actions/                  # Server Actions
│   │   ├── transactions.ts
│   │   ├── categories.ts
│   │   └── envelopes.ts
│   ├── auth.ts                   # Configuration NextAuth
│   ├── prisma.ts                 # Client Prisma
│   ├── zod-schemas.ts            # Schémas de validation
│   ├── money.ts                  # Utilitaires monétaires
│   ├── calculations.ts           # Calculs et logique métier
│   └── utils.ts                  # Utilitaires divers
├── prisma/                       # Configuration Prisma
│   ├── schema.prisma             # Schéma de base de données
│   └── seed.ts                   # Script de seed
├── types/                        # Types TypeScript
│   └── next-auth.d.ts
└── middleware.ts                 # Middleware de protection
\`\`\`

## 🗄️ Modèle de données

### Entités principales

- **User** : Utilisateur de l'application
- **Household** : Foyer (couple)
- **Membership** : Appartenance d'un utilisateur à un foyer
- **Transaction** : Transaction (revenu/dépense/investissement)
- **Category** : Catégorie de transaction
- **Subcategory** : Sous-catégorie
- **InvestmentEnvelope** : Enveloppe d'investissement
- **RecurringTemplate** : Modèle de transaction récurrente

### Relations

\`\`\`
User 1---* Membership *---1 Household
Household 1---* Transaction
Household 1---* Category 1---* Subcategory
Household 1---* InvestmentEnvelope
Transaction *---1 Category
Transaction *---1 Subcategory
Transaction *---1 InvestmentEnvelope
\`\`\`

## 🔒 Sécurité

- Authentification via NextAuth (Credentials + OAuth Google)
- Mot de passe hashé avec bcrypt
- Middleware de protection des routes `/app/*`
- Isolation des données par household
- Validation des données avec Zod
- Protection CSRF

## 🧪 Tests

### Tests unitaires

\`\`\`bash
npm test
\`\`\`

### Tests E2E avec Playwright

\`\`\`bash
npm run test:e2e
\`\`\`

## 📦 Commandes utiles

\`\`\`bash
# Développement
npm run dev                    # Lancer le serveur de dev
npm run build                  # Build de production
npm run start                  # Lancer la version de prod

# Prisma
npm run prisma:generate        # Générer le client Prisma
npm run prisma:migrate         # Créer et appliquer une migration
npm run prisma:seed            # Seeder la base de données
npm run prisma:studio          # Ouvrir Prisma Studio

# Linting
npm run lint                   # Linter le code
\`\`\`

## 🚀 Déploiement sur Vercel

### 1. Préparer le projet

\`\`\`bash
# Build de test local
npm run build
\`\`\`

### 2. Configuration Vercel

1. Créer un compte sur [Vercel](https://vercel.com)
2. Importer le projet GitHub
3. Configurer les variables d'environnement :
   - \`DATABASE_URL\` : URL de votre base PostgreSQL (ex: Supabase, Neon, Railway)
   - \`NEXTAUTH_URL\` : URL de votre application (ex: https://votre-app.vercel.app)
   - \`NEXTAUTH_SECRET\` : Générer avec \`openssl rand -base64 32\`

### 3. Base de données en production

**Options recommandées :**
- [Supabase](https://supabase.com) (gratuit)
- [Neon](https://neon.tech) (gratuit)
- [Railway](https://railway.app)
- [Vercel Postgres](https://vercel.com/storage/postgres)

### 4. Déployer

\`\`\`bash
vercel
\`\`\`

### 5. Migrer la base de données

\`\`\`bash
# Via Vercel CLI
vercel env pull .env.production
npx prisma migrate deploy
\`\`\`

## 🛠️ Technologies utilisées

- **Framework** : Next.js 16 (App Router)
- **Langage** : TypeScript
- **Base de données** : PostgreSQL + Prisma ORM
- **Authentification** : NextAuth.js
- **UI** : Tailwind CSS + shadcn/ui
- **Validation** : Zod
- **Formulaires** : React Hook Form
- **Graphiques** : D3.js (Sankey)
- **Date** : date-fns
- **CSV** : PapaParse

## Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

1. Fork le projet
2. Créer une branche feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit vos changements (\`git commit -m 'Add some AmazingFeature'\`)
4. Push vers la branche (\`git push origin feature/AmazingFeature\`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT.

## 👤 Auteur

Créé avec ❤️ pour la gestion de budget en couple

## 🙏 Remerciements

- Design inspiré de [Finary](https://finary.com)
- UI Components par [shadcn/ui](https://ui.shadcn.com)
- Icons par [Lucide](https://lucide.dev)

---

**Note** : Cette application est un projet de démonstration. Assurez-vous de sécuriser correctement vos données en production (HTTPS, secrets forts, backups réguliers).
