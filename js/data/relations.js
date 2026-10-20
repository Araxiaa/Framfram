/* ==========================================================================
   RELATIONS — "Les visages de son quotidien".
   Pour ajouter une relation : copier un bloc { ... }, le coller à la suite
   (sans oublier la virgule entre deux blocs) et changer les champs.

   Champs :
     nom       (obligatoire)
     role      ex. "Lieutenante", "Fils adoptif"
     clan      ex. "Clan du Tonnerre"            (facultatif)
     joueur    ex. "@Oriyakii" ou "PNJ"
     photo     nom du fichier dans assets/photos/ (facultatif)
     affinite  1 à 3 = appréciation (❤️), -1 à -3 = aversion (🖤), 0 = neutre (❤️🖤)
               (ne rien mettre = pas de cœur)
     respect   true pour ajouter ⭐
     mort      true pour ajouter 💀
     texte     la description
   ========================================================================== */
window.RELATIONS = [

    {
        nom: 'Nuage de Nénuphar',
        role: 'Sœur adoptive',
        joueur: '@Une_Bretonne',
        photo: 'Nuage de Nénuphar.webp',
        affinite: 3,
        texte: 'Sa sœur adoptive, rescapée du Clan de la Rivière après sa tragique dissolution. Étoile de Framboisier l\'aime énormément. Elle partage son tempérament calme et posé, ce qui crée un écho réconfortant pour lui. Pourtant, une barrière invisible persiste : elle s\'efforce de le garder à distance, un recul que le meneur tente d\'apprivoiser avec douceur.'
    },

    {
        nom: 'Petit Galopin',
        role: 'Fils adoptif',
        joueur: '@Oriyakii',
        photo: 'Petit Galopin - Oriyakii.webp',
        affinite: 3,
        texte: 'Son premier fils adoptif. Étoile de Framboisier l\'a découvert abandonné à la lisière même du territoire du clan. Ce moment a marqué son cœur à tout jamais : n\'écoutant que son instinct protecteur, il l\'a pris sous son aile. Qu\'importe l\'absence de liens de sang, Galopin est son fils, le symbole vivant de son refus de voir une enfance brisée.'
    },

    {
        nom: 'Petit Courlis',
        role: 'Fils adoptif',
        joueur: '@_.velyxia',
        photo: 'avatar_courlis.png',
        affinite: 3,
        texte: 'Son second fils adoptif, qu\'il chérit tout autant. Étoile de Framboisier éprouve pour lui un amour incommensurable et protecteur. À ses côtés, le jeune meneur oublie le poids de son masque de chef pour n\'être qu\'un père dévoué. Courlis est ancré profondément dans son cœur, précieux gardien de son cercle intime.'
    },

    {
        nom: 'Sveltesse de la Fouine',
        role: 'Apprenti',
        joueur: 'PNJ',
        affinite: 1,
        texte: 'Son tout premier apprenti. Étoile de Framboisier a reçu la charge de son éducation alors qu\'il n\'avait lui-même que 13 lunes, une marque de confiance précoce. Le meneur apprécie énormément son apprenti et affectionne les moments passés à ses côtés à lui transmettre sa vision de la forêt et son amour de l\'observation.'
    }

    // ----- Modèle à copier : ajoute une virgule après le bloc précédent,
    // ----- puis colle ceci juste avant le "];" final.
    //
    // {
    //     nom: 'Nom du chat',
    //     role: 'Lieutenante',
    //     clan: 'Clan du Tonnerre',
    //     joueur: 'PNJ',
    //     affinite: 3,
    //     respect: true,
    //     texte: 'Description de la relation.'
    // }
];
