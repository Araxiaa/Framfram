# Guide du site

## Les pages

| Page            | Fichier         | Sous-pages (onglets)                       |
|-----------------|-----------------|--------------------------------------------|
| Accueil         | `index.html`    | (une seule page qui défile)                |
| Le Meneur       | `lui.html`      | Caractère · Physique · Ses vies            |
| Son histoire    | `histoire.html` | La chronique · Journal des lunes           |
| Son monde       | `monde.html`    | Lignée · Relations · Diplomatie            |
| Galerie         | `galerie.html`  |                                            |
| Dashboard       | `admin.html`    | réservé à l'administrateur (connexion Discord) |

Une sous-page s'ouvre directement avec son adresse : `lui.html#physique`, `monde.html#relations`…

## Modifier le contenu : le dashboard

Ouvre `admin.html` et connecte-toi avec Discord. Rubriques : Relations, Lignée, Ses vies,
Journal des lunes, Galerie, **Mur des lunes**, **Textes des pages** (accueil, caractère, physique, histoire, monde).
On y ajoute, modifie, déplace, supprime ; les images s'envoient directement (elles sont allégées toutes seules).

Le site lit la base en ligne (Supabase). Si elle est injoignable, il retombe sur les fichiers
`js/data/*.js`, qui servent donc de **sauvegarde** et de valeurs de départ.
Une fois le dashboard en service, la base fait foi : modifier `js/data/*.js` n'a plus d'effet tant qu'elle répond.

| Fichier               | Rôle                                                              |
|-----------------------|-------------------------------------------------------------------|
| `supabase/schema.sql` | À lancer dans Supabase (SQL Editor) : tables, sécurité, compte admin, contenu de départ. Relançable sans risque. |
| `js/config.js`        | Adresse et clé publique du projet Supabase                        |
| `js/donnees.js`       | Charge le contenu depuis la base                                  |
| `js/admin.js`         | Le dashboard ; la liste `RUBRIQUES` décrit les formulaires        |

**Ajouter un administrateur** : Supabase → SQL Editor →
`insert into public.admins (discord_id, note) values ('IDENTIFIANT_DISCORD', 'Nom');`

## Modifier l'apparence

| Je veux changer…                             | Je vais dans…                        |
|----------------------------------------------|--------------------------------------|
| Les couleurs, les polices, le thème sombre   | `css/base.css` (variables en haut)   |
| L'en-tête, le menu, les onglets, le pied     | `css/layout.css`                     |
| Boutons, cartes, pastilles, lavis d'aquarelle | `css/components.css`                |
| Le design d'une page précise                 | `css/pages/<page>.css`               |
| Les liens du menu, les cartes de l'accueil   | `js/site.js` (liste `PAGES`)         |
| Le décor (branche feuillue)                  | `assets/decor/branche.svg`           |

L'ambiance : fond de papier avec grain, taches d'aquarelle (`.lavis`), pétales de freesia le jour,
lucioles la nuit (thème sombre).

## Les animations

Tout est dans `css/animations.css` (apparence) et `js/animations.js` (comportement).
- **Tout couper** : supprimer le bloc « Animations » à la fin de `js/site.js`.
- **Plus ou moins de pétales / lucioles** : boucles `for` dans `ambiance()` de `js/animations.js`.
- **Apparition au défilement** : la liste `cibles` dans `js/animations.js`.

Les personnes qui ont activé « réduire les animations » sur leur appareil voient un site immobile.

## Les images

Toutes dans `assets/photos/` (ou envoyées par le dashboard). Préfère le **WebP** (10 à 15 fois plus léger
que le PNG) : squoosh.app convertit en un clic (qualité 80, 1600 px max).
Si une image est introuvable, le site affiche l'initiale du chat (portraits) ou le nom du fichier attendu (galerie).

## Ajouter une page

1. Copier une page existante (par exemple `galerie.html`) et la renommer.
2. Changer `data-page="..."` dans `<body>`.
3. Ajouter une ligne dans `PAGES` en haut de `js/site.js`.
Pour des sous-pages : `<div data-onglets>` contenant des `<section class="onglet-panneau" id="..." data-titre="...">`.

## Relations : l'évolution des avis

Chaque chat a une fiche (nom, photo, rôle, **clan / groupe**, joueur) et une liste d'**avis** datés, du plus ancien
au plus récent : lune (âge d'Étoile de Framboisier), affinité (cœurs), respect (étoile) et appréciation (texte).
Sur le site, la carte montre le dernier avis ; un clic ouvre une fenêtre qui défile avec la courbe d'évolution et tous les avis.
Les filtres de la page sont créés à partir des clans / groupes saisis (écris-les toujours pareil : le dashboard te les propose).

## Mur des lunes

Les souvenirs épinglés de l'accueil (rubrique « Mur des lunes » du dashboard) : lune, titre, texte, image facultative, couleur.
