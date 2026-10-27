# LingoPulse — gihub_page

Test des possibilités offertes par GitHub Pages : une application de flashcards
pour apprendre le chinois depuis le français ou l'anglais, 100 % côté client.

## Structure du projet

```
.
├── index.html      # Structure de la page (markup uniquement)
├── css/
│   └── style.css   # Tous les styles (variables, composants, animations, responsive)
├── js/
│   └── app.js      # Logique de l'app (données de vocabulaire, état, audio, événements)
└── tools/
    ├── hsk_data.py    # Vocabulaire HSK 1 & 2 (mot, pinyin, FR, EN, exemples)
    └── build_vocab.py # Régénère le bloc `vocab` de js/app.js
```

## Mettre à jour le vocabulaire

Modifiez `tools/hsk_data.py`, puis lancez :

```
python3 tools/build_vocab.py --check   # contrôles seulement
python3 tools/build_vocab.py           # réécrit js/app.js
```

Aucune dépendance : le pinyin est saisi à la main (tons neutres corrects).

## Principes

- **Séparation des responsabilités** : HTML = structure, CSS = présentation, JS = comportement.
- **Zéro dépendance, zéro build** : fichiers statiques servis directement par GitHub Pages.
- **Données locales** : la progression est stockée dans le LocalStorage du navigateur.

## Utilisation

Ouvrez `index.html` dans un navigateur, ou publiez le dépôt via GitHub Pages.

## Pull Request — Refactor

Branche source : `refactor/extract-css-js` → branche cible : `main`

**Titre :** Refactor: extraction du CSS et du JS inline dans des fichiers dédiés

**Description :**

### Modifications
- Extraction de ~765 lignes de CSS inline vers `css/style.css`.
- Extraction de ~160 lignes de JS inline vers `js/app.js` (IIFE, 'use strict', constantes nommées, regroupement des références DOM).
- Suppression de la duplication (« Je le savais » / « À revoir » regroupés dans `recordAnswer(known)`).
- Robustesse : `loadStats()` protégé par try/catch avec fusion des valeurs par défaut ; sauvegarde sécurisée.
- Performance : `unobserve` des éléments révélés par l'IntersectionObserver.
- README mis à jour (structure du projet documentée).

### Vérifications
- Accolades CSS équilibrées ; tous les IDs utilisés par le JS présents dans le HTML.
- Aucune balise `<style>`/`<script>` inline restante ; `index.html` réduit de 1141 à 216 lignes.
- Fonctionnement identique (aucun changement de comportement visible).
