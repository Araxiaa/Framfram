# Où modifier quoi

## Je veux changer un contenu

| Je veux modifier…                        | Je vais dans…                    |
|------------------------------------------|----------------------------------|
| Une relation (ajout, cœurs, texte)       | `js/data/relations.js`           |
| Un chat de l'arbre généalogique          | `js/data/lignee.js`              |
| Une vie (don, perte, lune)               | `js/data/vies.js`                |
| Un sujet du journal                      | `js/data/journal.js`             |
| Une illustration de la galerie           | `js/data/galerie.js`             |
| Le texte du caractère                    | `caractere.html`                 |
| Le texte du physique                     | `physique.html`                  |
| L'histoire (les périodes)                | `histoire.html`                  |
| La relation au clan, la diplomatie       | `relations.html`                 |
| La charte, la fiche rapide, la devise    | `index.html`                     |
| Un lien du menu, sa phrase sur l'accueil, le pied de page | `js/site.js`    |

Les fichiers `js/data/` sont des listes : chaque chat, relation, vie ou œuvre est un petit bloc
`{ ... }` à copier-coller. Le mode d'emploi est écrit en commentaire en haut de chaque fichier.

## Écrire un texte avec une apostrophe

Dans les fichiers `js/data/`, mets chaque texte entre **backticks** ( ` ), pas entre apostrophes :

    titre: `Clapotis d'Étang`      ✔ fonctionne
    titre: 'Clapotis d'Étang'      ✘ le fichier plante, rien ne s'affiche

Sur un clavier AZERTY, le backtick se tape avec **AltGr + 7** (puis Espace).
Un backtick accepte les apostrophes, les guillemets, les accents. Il suffit d'éviter
un backtick ou la suite `${` à l'intérieur d'un texte.

(Les anciens textes écrits entre apostrophes avec `\'` continuent de fonctionner.)

## Je veux changer l'apparence

| Je veux changer…                         | Je vais dans…                    |
|------------------------------------------|----------------------------------|
| Les couleurs, les polices                | `css/base.css` (variables en haut ; le bloc `data-theme="dark"` règle le thème sombre) |
| L'en-tête, le menu, le pied de page      | `css/layout.css`                 |
| Les accordéons, pastilles, panneaux      | `css/components.css`             |
| Le design d'une page précise             | `css/pages/<nom de la page>.css` |

## Les animations

Tout est dans `css/animations.css` (l'apparence) et `js/animations.js` (le comportement).
Elles se chargent depuis le bloc « Animations » en bas de `js/site.js`.

- **Tout couper** : supprimer ce bloc dans `js/site.js`.
- **Plus de nuages / de pétales** : tableau `ciel()` et boucle `petales()` dans `js/animations.js`.
- **Plus lent ou plus rapide** : les durées sont dans `css/animations.css` (`--duree` des nuages, `animation` des sections).
- **Apparition au défilement** : la liste des éléments concernés est la variable `cibles` dans `js/animations.js`.

Les personnes qui ont activé « réduire les animations » sur leur appareil voient un site immobile.

## Thème clair / sombre

Le site suit le réglage de l'appareil, et le bouton en forme de lune (en haut) permet de choisir.
Les couleurs des deux thèmes sont dans `css/base.css` ; le script `js/theme.js` retient le choix.

## Les images

Toutes les images vont dans `assets/photos/`, y compris `avatar_courlis.png`
(qui n'est pas encore ajouté : l'initiale s'affiche à sa place).

**Format** : préfère le **WebP** (10 à 15 fois plus léger que le PNG, même rendu). Pour convertir une image,
l'outil en ligne squoosh.app suffit (qualité 80, largeur maximale ~1600 px). Pense à écrire
l'extension `.webp` dans `js/data/*.js`. Les anciens PNG originaux sont gardés dans le dossier
« Etoile de Framboisier - originaux », hors du site.

Le nom du fichier dans `js/data/*.js` doit correspondre exactement au nom réel de l'image.
Si une image est introuvable, le site affiche l'initiale du chat (portraits)
ou le nom de fichier attendu (galerie).

## Ajouter une page

1. Copier une page existante (par exemple `vies.html`) et la renommer.
2. Changer `data-page="..."` dans la balise `<body>`.
3. Ajouter une ligne dans `PAGES` en haut de `js/site.js`.
