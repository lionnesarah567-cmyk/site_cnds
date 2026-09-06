# CNDS Burundi — Site Web Officiel

> **« Le dialogue social au service de la paix sociale en milieu du travail »**

Refonte complète, moderne et sécurisée du site web officiel du **Comité National de Dialogue Social (CNDS)** de la République du Burundi.

Ce projet remplace l'ancienne infrastructure WordPress compromise par une stack ultra-rapide, modulaire et immunisée contre les injections de contenu spam/SEO et le XSS stocké.

---

## 🏛️ À propos du CNDS

Le **Comité National de Dialogue Social (CNDS)** est une institution d'utilité publique tripartite (Gouvernement, Employeurs, Travailleurs) régie par le **Décret N° 100/132 du 21 mai 2013** et la **Charte Nationale de Dialogue Social du 25 mai 2011**.

- **Siège officiel :** Kigobe, Avenue Murembwe n°28, Bujumbura, Burundi
- **Téléphones :** +257 22 278 929 / +257 22 211 016 / +257 22 221 017
- **Bureau Exécutif :**
  - **S.E. NTIBANTUNGANYA Sylvestre** — Président (indépendant)
  - **Céléstin NSAVYIMANA** — Vice-président (Collège des Travailleurs)
  - **Théodore KAMWENUBUSA** — Vice-président (Collège des Employeurs)
  - **Emmanuel Ngomirakiza** — Représentant du Gouvernement
  - **Nduwimana Charles** — Secrétaire Exécutif Permanent

---

## 🛠️ Stack Technique

- **Frontend :** React 18, Vite, Tailwind CSS, Lucide React, React Router DOM v6
- **Backend :** Node.js, Express, Helmet, CORS, Express Rate Limit, JWT, BcryptJS, Zod, Sanitize-HTML
- **Base de données :** Turso (SQLite distribué via `@libsql/client` et support local SQLite)
- **Internationalisation :** Architecture bilingue Français (FR) & Kirundi (RN)
- **Déploiement :** Prêt pour Vercel (monorepo frontend statique + API serverless)

---

## 🎨 Charte Graphique Officielle

| Variable CSS | Hex Code | Rôle & Surface |
| :--- | :--- | :--- |
| `--white` | `#FFFFFF` | **Couleur principale dominante (>70% des surfaces)** |
| `--off-white` | `#FAFAF8` | Fonds des sections alternées et cartes |
| `--red` | `#CE1126` | Rouge drapeau Burundi — Boutons d'action (CTA), soulignements d'accent |
| `--green` | `#1A7F3C` | Vert drapeau Burundi — Badges, tags, statuts |
| `--gold` | `#B5852E` | Or du sceau CNDS — Bordures dorées, nœuds institutionnels |
| `--ink` | `#161616` | Texte principal haute lisibilité |
| `--ink-soft` | `#5A5A56` | Texte secondaire et métadonnées |
| `--line` | `#E7E5DF` | Bordures épurées et séparateurs |

### Typographies
- **Titres (`h1`, `h2`, `h3`) :** `Fraunces` (Google Fonts, serif noble)
- **Corps de texte & UI :** `IBM Plex Sans` (Google Fonts, sans-serif institutionnel)

---

## 🔒 Sécurité Renforcée

1. **Anti-Injection SEO & Anti-XSS :** Assainissement strict du HTML avec `sanitize-html` et validation de schéma avec `zod` sur toute création/mise à jour d'articles.
2. **Protection Anti-Spam & Anti-Bot :** Formulaire de contact équipé d'un **honeypot** invisible et d'un limiteur de débit (`express-rate-limit`).
3. **Authentification Forte :** Mots de passe hashés avec `bcryptjs` (facteur 12), jetons JWT à durée limitée et middleware de vérification d'identité.
4. **En-têtes HTTP Sécurisés :** `Helmet` configuré avec politique de sécurité de contenu (CSP) stricte.

---

## 📂 Structure du Répertoire

```
site_cnds/
├── client/                     # Application Frontend React + Vite
│   ├── public/                 # Favicon SVG, robots.txt, sitemap.xml
│   ├── src/
│   │   ├── api/                # Client API fetch (avec fallback hors-ligne)
│   │   ├── components/         # Header, Footer, Tripartite, NewsCard, Stats, Lightbox...
│   │   ├── context/            # LanguageContext (FR/RN), AuthContext
│   │   ├── i18n/               # fr.json, rn.json
│   │   ├── pages/              # 11 pages du site + Espace Admin
│   │   ├── styles/             # Variables CSS et directives Tailwind
│   │   ├── App.jsx             # Configuration des routes
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # API Backend Node.js + Express
│   ├── src/
│   │   ├── db/                 # Client Turso LibSQL, schema.sql, seed.js
│   │   ├── middleware/         # auth.js, rateLimit.js, validate.js
│   │   ├── routes/             # news, board, legal, multimedia, gallery, partners, contact, auth
│   │   └── index.js            # Point d'entrée serveur Express
│   ├── package.json
│   └── .env.example
├── api/
│   └── index.js                # Handler Serverless Vercel
├── vercel.json                 # Configuration de déploiement Vercel
├── package.json                # Scripts monorepo racine
└── README.md
```

---

## 🚀 Installation & Démarrage Local

### 1. Cloner et installer les dépendances

Installez les dépendances à la racine, côté serveur et côté client :

```bash
# À la racine du projet
npm install

# Dans le dossier server
cd server && npm install

# Dans le dossier client
cd ../client && npm install
```

### 2. Initialiser la base de données (Seed)

Le script d'amorçage crée automatiquement les tables SQL et insère les 5 membres du bureau, les décrets officiels, les vraies actualités du CNDS et le compte administrateur :

```bash
# Depuis la racine
npm run seed

# Ou depuis le dossier server
cd server && npm run seed
```

### 3. Lancer l'environnement de développement

```bash
# Depuis la racine (lance le client sur http://localhost:5173 et l'API sur http://localhost:5000)
npm run dev
```

---

## 🔐 Identifiants d'Administration par Défaut

- **URL de connexion :** `http://localhost:5173/admin/login`
- **Identifiant :** `admin`
- **Mot de passe initial :** `CndsBurundi2024!`

*(Vous pouvez modifier le mot de passe dans l'espace d'administration ou dans la table `admins`).*

---

## ☁️ Déploiement sur Turso & Vercel

### 1. Créer une base de données Turso Cloud

1. Installez le CLI Turso ou connectez-vous sur [turso.tech](https://turso.tech)
2. Créez une base de données :
   ```bash
   turso db create cnds-burundi
   turso db show cnds-burundi --url
   turso db tokens create cnds-burundi
   ```
3. Reportez l'URL `libsql://...` et le token d'authentification dans vos variables d'environnement Vercel.

### 2. Déployer sur Vercel

1. Importez le projet GitHub sur votre compte Vercel.
2. Définissez les variables d'environnement dans les paramètres Vercel :
   - `TURSO_DATABASE_URL` : `libsql://cnds-burundi-votre-compte.turso.io`
   - `TURSO_AUTH_TOKEN` : `votre-token-turso`
   - `JWT_SECRET` : `votre-secret-jwt-aleatoire-tres-long`
   - `NODE_ENV` : `production`
3. Lancez le déploiement. Vercel construira le frontend React et déploiera l'API Express en fonctions serverless selon la configuration `vercel.json`.

---

## 📄 Licence

© République du Burundi — Comité National de Dialogue Social (CNDS). Tous droits réservés.
