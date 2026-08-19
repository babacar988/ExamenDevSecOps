# ShopSN — Plateforme E-Commerce (Examen DevSecOps)

Application React consommant la [Fake Store API](https://fakestoreapi.com/docs) :
authentification, catalogue de produits, panier d'achat. Livrée via une chaîne
CI/CD DevSecOps complète (voir `rapport-technique-devsecops.docx` pour la
justification détaillée de chaque choix).

## Démarrage local (sans Docker)

```bash
cd ecommerce-app
cp .env.example .env.local
npm ci
npm run dev
```

## Démarrage via Docker

```bash
docker compose up --build
# App disponible sur http://localhost:8080
```

## Stack d'observabilité (optionnelle, pour démonstration)

```bash
docker compose -f docker-compose.yml -f docker-compose.observability.yml up --build
# Grafana   : http://localhost:3000 (admin / changeme)
# Prometheus: http://localhost:9090
# cAdvisor  : http://localhost:8081
```

## Tests et qualité

```bash
cd ecommerce-app
npm run lint            # analyse statique (oxlint)
npm run test            # tests unitaires (Vitest + React Testing Library)
npm run test:coverage   # tests avec rapport de couverture
npm run build           # build de production
```

## Structure du dépôt

```
ecommerce-app/            Code source de l'application React
  src/api/                 Client HTTP vers Fake Store API
  src/context/              État global (auth, panier)
  src/pages/                 Écrans (Login, Catalogue, Panier)
  src/components/            Composants réutilisables + ErrorBoundary
  src/test/                   Tests unitaires
  src/monitoring.js         Shim RUM (logs structurés + Web Vitals)
  Dockerfile                 Build multi-stage (Node -> Nginx non-root)
  nginx.conf                 Configuration Nginx durcie
.github/workflows/        Pipelines CI, Security, CD (GitHub Actions)
.github/dependabot.yml    Mise à jour automatisée des dépendances
observability/            Configuration Prometheus + Grafana
docker-compose.yml        Lancement local de l'application conteneurisée
docker-compose.observability.yml  Stack de supervision (Prometheus/Grafana/cAdvisor)
SECURITY.md                Politique de sécurité du projet
```

## Identifiants de démonstration

L'écran de connexion est pré-rempli avec les identifiants publics de test de la
Fake Store API (`mor_2314` / `83r5^_`, documentés sur fakestoreapi.com) — ce ne
sont pas des secrets réels.
