/* ==========================================================================
   LIGNÉE — l'arbre généalogique.
   Pour ajouter un chat : copier une ligne { nom: ... } dans le bon groupe.

   Champs d'un chat :
     nom        (obligatoire)
     role       ex. "Grand-mère", "Frère"
     statut     'vivant' | 'vivant-pj' | 'decede' | 'disparu' | 'vide' | 'heros'
     etiquette  texte de la pastille (ex. "Vivante", "Décédé")
     joueur     ex. "@Oriyakii" ou "PNJ"
     photo      nom du fichier dans assets/photos/  (facultatif)
     tag        petite pastille en plus (ex. "Highlander")  (facultatif)
   ========================================================================== */
window.LIGNEE = {

    origine: '75 % Clan du Tonnerre / 25 % domestique (origines Highlander via Rosie)',

    generations: [
        {
            titre: 'Les aïeux',
            groupes: [
                {
                    titre: 'Branche paternelle',
                    membres: [
                        { nom: 'Longue Liane (Anciennement : Rosie)', role: 'Grand-mère', statut: 'disparu', etiquette: 'Disparue', joueur: 'PNJ', photo: 'Rosie.png', tag: 'Highlander' },
                        { nom: 'Queue de Souris', role: 'Grand-père', statut: 'decede', etiquette: 'Décédé', joueur: 'PNJ', photo: 'Queue de Souris.png' }
                    ]
                }
            ]
        },
        {
            titre: 'Parents',
            groupes: [
                {
                    titre: 'Ses parents',
                    couple: true,
                    membres: [
                        { nom: 'Douce Sève', role: 'Mère biologique', statut: 'vivant', etiquette: 'Vivante', joueur: 'PNJ', photo: 'Douce Sève - PNJ.png' },
                        { nom: 'Racine de Bouleau', role: 'Père biologique', statut: 'vivant', etiquette: 'Vivant', joueur: 'PNJ', photo: 'Racine de Bouleau - PNJ.png' }
                    ]
                },
            ]
        },
        {
            titre: 'Sa génération',
            groupes: [
                {
                    titre: 'La portée',
                    membres: [
                        { nom: 'Épine de Fraisier', role: 'Frère', statut: 'decede', etiquette: 'Décédé', photo: 'Epine de Fraisier - PNJ.png' },
                        { nom: 'Ombre de Myrtille', role: 'Sœur', statut: 'decede', etiquette: 'Décédée', photo: 'Ombre de Myrtille - PNJ.png' },
                        { nom: 'Nuage de Mûre', role: 'Sœur', statut: 'decede', etiquette: 'Décédée', photo: 'Nuage de Mûre.png' },
                        { nom: 'Étoile de Framboisier', role: 'Meneur du Tonnerre', statut: 'heros', etiquette: 'Meneur', photo: 'Headshot Etoile de Framboisier Oriyakii.webp' }
                    ]
                },
                {
                    titre: 'Par adoption',
                    membres: [
                        { nom: 'Veille de Nénuphar', role: 'Sœur adoptive', statut: 'vivant-pj', etiquette: 'Vivante', joueur: '@Une_Bretonne', photo: 'Nuage de Nénuphar.webp' },
                        { nom: 'Piquée du Cormoran', role: 'Frère adoptif', statut: 'vivant', etiquette: 'Vivante', joueur: 'PNJ', photo: 'Piquée du Cormoran.png' }
                    ]
                },
                {
                    titre: 'Partenaire',
                    membres: [
                        { nom: 'Emplacement libre', role: 'Compagne / compagnon', statut: 'vide', etiquette: 'Inconnu', joueur: 'À voir en RP…' }
                    ]
                }
            ]
        },
        {
            titre: 'Ses enfants (liens du cœur)',
            groupes: [
                {
                    titre: 'Fils adoptifs',
                    membres: [
                        { nom: 'Petit Galopin', role: 'Fils adoptif', statut: 'decede', etiquette: 'Mort', joueur: '@Oriyakii', photo: 'Petit Galopin - Oriyakii.webp' },
                        { nom: 'Petit Courlis', role: 'Fils adoptif', statut: 'decede', etiquette: 'Mort', joueur: '@_.velyxia', photo: 'Petit Courlis.png' },
                        { nom: 'Petite Oie', role: 'Fille adoptive', statut: 'vivant-pj', etiquette: 'vivante', joueur: '@plumeau_', photo: 'Petite Oie.png' }
                    ]
                }
            ]
        },
        {
            titre: 'Les petits-enfants',
            groupes: [
                {
                    titre: '',
                    membres: [
                        { nom: 'Aucun petit-chaton', role: 'Petits-enfants', statut: 'vide', etiquette: 'Verrouillé', joueur: 'Futur lointain' }
                    ]
                }
            ]
        }
    ]
};
