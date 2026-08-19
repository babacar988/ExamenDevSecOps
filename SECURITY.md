# Politique de sécurité

## Contrôles automatisés (pipeline `security.yml`)

| Contrôle | Outil | Déclencheur |
|---|---|---|
| SAST (analyse statique du code) | GitHub CodeQL | push, PR |
| Détection de secrets | Gitleaks | push, PR |
| Analyse des dépendances (SCA) | `npm audit` | push, PR |
| Scan de l'image conteneur | Trivy | après build de l'image |
| Mise à jour des dépendances | Dependabot | hebdomadaire |
| Signature de l'image | cosign (keyless/OIDC) | à la publication (CD) |

## Signaler une vulnérabilité

Ouvrir une issue privée (GitHub Security Advisories) plutôt qu'une issue publique.
Ne jamais committer de secrets réels ; utiliser `.env.example` comme référence et
GitHub Actions secrets / un coffre-fort (Vault, AWS Secrets Manager...) en production.

## Durcissement appliqué

- Image finale basée sur `nginx-unprivileged` (utilisateur non-root, port 8080).
- Système de fichiers du conteneur en lecture seule (`read_only: true`) avec `tmpfs`
  ciblé pour les répertoires nécessitant l'écriture.
- En-têtes de sécurité HTTP (CSP, X-Frame-Options, HSTS, etc.) définis dans `nginx.conf`.
- Jeton d'authentification stocké en `sessionStorage` (durée de vie limitée à l'onglet),
  jamais en `localStorage`.
- Aucun secret dans l'image : le build ne copie que `dist/`.
