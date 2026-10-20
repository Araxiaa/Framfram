/* ==========================================================================
   DASHBOARD — connexion Discord + éditeur de contenus.
   Pour ajouter une rubrique modifiable : ajouter une entrée dans RUBRIQUES
   (et la même clé dans js/donnees.js pour que le site la lise).
   ========================================================================== */
(function () {
    'use strict';

    var C = window.SITE_CONFIG;
    var O = window.Outils;

    /* ---------- Description des formulaires ----------
       t : text | area | select | bool | image | liste
       k : nom du champ      l : libellé      aide : petite explication */

    var STATUTS_CHAT = [
        ['vivant', 'Vivant (PNJ)'], ['vivant-pj', 'Vivant (joué par un joueur)'], ['decede', 'Décédé'],
        ['disparu', 'Disparu'], ['vide', 'Emplacement vide'], ['heros', 'Étoile de Framboisier (cerclé de framboise)']
    ];

    var AFFINITES = [
        ['', 'Aucun cœur'], [3, 'Très apprécié (3 cœurs)'], [2, 'Apprécié (2 cœurs)'], [1, 'Un peu apprécié (1 cœur)'],
        [0, 'Neutre'], [-1, 'Un peu d’aversion (1 cœur sombre)'], [-2, 'Aversion (2 cœurs sombres)'], [-3, 'Forte aversion (3 cœurs sombres)']];

    // Clans / groupes déjà saisis, proposés à l'écriture (pour écrire toujours pareil)
    function clansConnus() {
        var vus = [];
        ((donnees.relations && donnees.relations.liste) || []).forEach(function (r) {
            if (r.clan && vus.indexOf(r.clan) < 0) vus.push(r.clan);
        });
        return vus;
    }

    var CHAMPS_RELATION = [
        { k: 'nom', t: 'text', l: 'Nom' },
        { k: 'role', t: 'text', l: 'Rôle', aide: 'Ex. Lieutenante, Fils adoptif' },
        { k: 'clan', t: 'text', l: 'Clan / groupe', aide: 'Sert de filtre sur le site. Laisser vide = « Sans clan »', suggere: clansConnus },
        { k: 'joueur', t: 'text', l: 'Joueur', aide: 'Ex. @Oriyakii ou PNJ' },
        { k: 'photo', t: 'image', l: 'Photo' },
        { k: 'mort', t: 'bool', l: 'Décédé(e) (affiche un crâne)' },
        {
            k: 'avis', t: 'liste', l: 'Évolution de son avis (du plus ancien au plus récent)', ajout: 'Ajouter un avis',
            lib: function (o) {
                var a = AFFINITES.filter(function (x) { return String(x[0]) === String(o.affinite == null ? '' : o.affinite); })[0];
                return (o.lune || 'Lune ?') + ' · ' + (a ? a[1] : '');
            },
            item: [
                { k: 'lune', t: 'text', l: 'Lune (âge d’Étoile de Framboisier)', aide: 'Ex. 20 lunes' },
                { k: 'affinite', t: 'select', num: true, l: 'Affinité', opts: AFFINITES },
                { k: 'respect', t: 'bool', l: 'Respect (affiche une étoile)' },
                { k: 'texte', t: 'area', l: 'Appréciation', aide: 'Ce qu’il pense de ce chat à ce moment' }
            ]
        }
    ];

    var CHAMPS_MEMBRE = [
        { k: 'nom', t: 'text', l: 'Nom' },
        { k: 'role', t: 'text', l: 'Rôle', aide: 'Ex. Grand-mère, Frère' },
        { k: 'statut', t: 'select', l: 'Statut', opts: STATUTS_CHAT },
        { k: 'etiquette', t: 'text', l: 'Pastille', aide: 'Ex. Vivante, Décédé' },
        { k: 'joueur', t: 'text', l: 'Joueur', aide: 'Ex. @Oriyakii ou PNJ' },
        { k: 'tag', t: 'text', l: 'Pastille en plus', aide: 'Facultatif, ex. Highlander' },
        { k: 'photo', t: 'image', l: 'Photo' }
    ];

    // Modèles réutilisés par la rubrique « Textes des pages »
    var NOM_TEXTE = [{ k: 'nom', t: 'text', l: 'Nom' }, { k: 'texte', t: 'area', l: 'Texte' }];
    var TITRE_TEXTE = [{ k: 'titre', t: 'text', l: 'Titre' }, { k: 'texte', t: 'area', l: 'Texte' }];
    function PARAGRAPHES(cle, libelle) {
        return {
            k: cle, t: 'liste', l: libelle, ajout: 'Ajouter un paragraphe',
            lib: function (o) { return (o.texte || '').slice(0, 70) + ((o.texte || '').length > 70 ? '…' : ''); },
            item: [{ k: 'texte', t: 'area', l: 'Paragraphe' }]
        };
    }

    var RUBRIQUES = [
        {
            cle: 'relations', nom: 'Relations', defaut: function () { return window.RELATIONS; },
            aide: 'Les visages de son quotidien (page Relations).',
            champs: [{
                k: 'liste', t: 'liste', ajout: 'Ajouter une relation', item: CHAMPS_RELATION,
                lib: function (o) { return o.nom + (o.role ? ' — ' + o.role : ''); }
            }], racineListe: true
        },
        {
            cle: 'lignee', nom: 'Lignée', defaut: function () { return window.LIGNEE; },
            aide: 'L\'arbre généalogique : générations → groupes → chats.',
            champs: [
                { k: 'origine', t: 'text', l: 'Répartition des origines', aide: 'Phrase affichée sous le titre de la page' },
                {
                    k: 'generations', t: 'liste', ajout: 'Ajouter une génération', lib: function (o) { return o.titre; },
                    item: [
                        { k: 'titre', t: 'text', l: 'Titre de la génération' },
                        {
                            k: 'groupes', t: 'liste', ajout: 'Ajouter un groupe', lib: function (o) { return o.titre || '(groupe sans titre)'; },
                            item: [
                                { k: 'titre', t: 'text', l: 'Titre du groupe', aide: 'Peut rester vide' },
                                { k: 'couple', t: 'bool', l: 'Les deux premiers sont un couple (trait entre eux)' },
                                {
                                    k: 'membres', t: 'liste', ajout: 'Ajouter un chat', item: CHAMPS_MEMBRE,
                                    lib: function (o) { return o.nom + (o.role ? ' — ' + o.role : ''); }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            cle: 'vies', nom: 'Ses vies', defaut: function () { return window.VIES; },
            aide: 'Quand une vie est perdue : passe-la en « Perdue » et indique la lune.',
            champs: [{
                k: 'liste', t: 'liste', ajout: 'Ajouter une vie',
                lib: function (o) { return o.don + (o.statut === 'perdue' ? ' (perdue)' : ''); },
                item: [
                    { k: 'don', t: 'text', l: 'Don' },
                    { k: 'statut', t: 'select', l: 'Statut', opts: [['active', 'Active'], ['perdue', 'Perdue']] },
                    { k: 'lune', t: 'text', l: 'Âge de la perte', aide: 'Seulement si perdue, ex. 15 lunes' },
                    { k: 'texte', t: 'area', l: 'Description du don, ou circonstances de la perte' }
                ]
            }], racineListe: true
        },
        {
            cle: 'journal', nom: 'Journal des lunes', defaut: function () { return window.JOURNAL; },
            aide: 'Un bloc par sujet joué. Les sujets d\'une même lune sont regroupés sur le site.',
            champs: [{
                k: 'liste', t: 'liste', ajout: 'Ajouter un sujet',
                lib: function (o) { return (o.lune ? o.lune + ' · ' : '') + o.titre + (o.enCours ? ' (en cours)' : ''); },
                item: [
                    { k: 'lune', t: 'text', l: 'Lune', aide: 'Ex. 22 lunes' },
                    { k: 'titre', t: 'text', l: 'Titre du sujet' },
                    { k: 'lien', t: 'text', l: 'Lien Discord', aide: 'Laisser # s\'il n\'y en a pas' },
                    { k: 'compagnons', t: 'text', l: 'Compagnons', aide: 'Séparés par des virgules' },
                    { k: 'resume', t: 'area', l: 'Résumé' },
                    { k: 'enCours', t: 'bool', l: 'Scène en cours (affiche « En cours »)' }
                ]
            }], racineListe: true
        },
        {
            cle: 'galerie', nom: 'Galerie', defaut: function () { return window.GALERIE; },
            aide: 'Les illustrations. Envoie une image avec le bouton : elle est automatiquement allégée.',
            champs: [{
                k: 'liste', t: 'liste', ajout: 'Ajouter une illustration',
                lib: function (o) { return (o.titre || 'Illustration') + (o.auteur ? ' — ' + o.auteur : ''); },
                item: [
                    { k: 'fichier', t: 'image', l: 'Image' },
                    { k: 'titre', t: 'text', l: 'Légende' },
                    { k: 'auteur', t: 'text', l: 'Artiste', aide: 'Ex. @Oriyakii' },
                    { k: 'alt', t: 'text', l: 'Description (pour les lecteurs d\'écran)' }
                ]
            }], racineListe: true
        },
        {
            cle: 'lunes', nom: 'Mur des lunes', defaut: function () { return window.LUNES; },
            aide: 'Les souvenirs épinglés sur l’accueil, dans l’ordre où ils s’affichent.',
            champs: [{
                k: 'liste', t: 'liste', ajout: 'Ajouter un souvenir',
                lib: function (o) { return (o.lune ? o.lune + ' · ' : '') + (o.titre || ''); },
                item: [
                    { k: 'lune', t: 'text', l: 'Lune', aide: 'Ex. 15 lunes' },
                    { k: 'titre', t: 'text', l: 'Titre du moment' },
                    { k: 'texte', t: 'area', l: 'Texte' },
                    { k: 'image', t: 'image', l: 'Image (facultatif)' },
                    { k: 'teinte', t: 'select', l: 'Couleur de la note', opts: [['', 'Vert sauge'], ['azur', 'Bleu azur'], ['roux', 'Roux'], ['framboise', 'Framboise']] }
                ]
            }], racineListe: true
        },
        {
            cle: 'textes', nom: 'Textes des pages', defaut: function () { return window.TEXTES; },
            aide: 'Tous les textes longs : accueil, caractère, physique, histoire, monde. Ouvre un groupe pour le modifier.',
            champs: [
                { k: 'accueil', t: 'groupe', l: 'Accueil', champs: [
                    { k: 'fonction', t: 'text', l: 'Fonction (au-dessus du nom)' },
                    { k: 'devise', t: 'text', l: 'Devise', aide: 'Sans les guillemets' },
                    { k: 'fiche', t: 'liste', l: 'Fiche rapide', ajout: 'Ajouter une ligne', lib: function (o) { return o.label + ' : ' + (o.valeur || ''); }, item: [
                        { k: 'label', t: 'text', l: 'Intitulé' }, { k: 'valeur', t: 'text', l: 'Valeur' }] },
                    { k: 'charte_titre', t: 'text', l: 'Titre de la charte' },
                    { k: 'charte_intro', t: 'area', l: 'Introduction de la charte' },
                    { k: 'charte', t: 'liste', l: 'Articles de la charte', ajout: 'Ajouter un article', lib: function (o) { return (o.num || '') + ' · ' + (o.titre || ''); }, item: [
                        { k: 'num', t: 'text', l: 'Numéro', aide: 'Ex. I, II, III' }, { k: 'titre', t: 'text', l: 'Titre' },
                        { k: 'sous', t: 'text', l: 'Sous-titre', aide: 'Facultatif' }, { k: 'texte', t: 'area', l: 'Texte' }] }
                ] },
                { k: 'caractere', t: 'groupe', l: 'Le Meneur — Caractère', champs: [
                    PARAGRAPHES('paragraphes', 'Description globale'),
                    { k: 'qualites', t: 'liste', l: 'Qualités', ajout: 'Ajouter une qualité', lib: function (o) { return o.nom; }, item: NOM_TEXTE },
                    { k: 'defauts', t: 'liste', l: 'Défauts', ajout: 'Ajouter un défaut', lib: function (o) { return o.nom; }, item: NOM_TEXTE },
                    { k: 'gouts', t: 'liste', l: 'Goûts, phobies et habitudes', ajout: 'Ajouter un bloc', lib: function (o) { return o.titre; }, item: TITRE_TEXTE }
                ] },
                { k: 'physique', t: 'groupe', l: 'Le Meneur — Physique', champs: [
                    PARAGRAPHES('paragraphes', 'Description globale'),
                    { k: 'apercu', t: 'liste', l: 'En un coup d\'œil', ajout: 'Ajouter une ligne', lib: function (o) { return o.label + ' : ' + (o.valeur || ''); }, item: [
                        { k: 'label', t: 'text', l: 'Intitulé' }, { k: 'valeur', t: 'text', l: 'Valeur' }] },
                    { k: 'profil', t: 'liste', l: 'Son profil (jauges)', ajout: 'Ajouter une jauge', lib: function (o) { return o.nom + ' (' + (o.niveau == null ? 0 : o.niveau) + '/5)'; }, item: [
                        { k: 'nom', t: 'text', l: 'Caractéristique' },
                        { k: 'niveau', t: 'select', num: true, l: 'Niveau', opts: [[0, '0 sur 5'], [1, '1 sur 5'], [2, '2 sur 5'], [3, '3 sur 5'], [4, '4 sur 5'], [5, '5 sur 5']] }] },
                    PARAGRAPHES('forts', 'Points forts'),
                    PARAGRAPHES('faibles', 'Points faibles'),
                    { k: 'marques', t: 'liste', l: 'Marques et accessoires', ajout: 'Ajouter un bloc', lib: function (o) { return o.titre; }, item: TITRE_TEXTE }
                ] },
                { k: 'histoire', t: 'groupe', l: 'Son histoire', champs: [
                    { k: 'titre', t: 'text', l: 'Titre de la page' },
                    { k: 'intro', t: 'text', l: 'Phrase d\'introduction' },
                    { k: 'periodes', t: 'liste', l: 'Les périodes', ajout: 'Ajouter une période', lib: function (o) { return (o.lune || '') + ' · ' + (o.titre || ''); }, item: [
                        { k: 'lune', t: 'text', l: 'Âge', aide: 'Ex. 6 à 12 lunes' }, { k: 'titre', t: 'text', l: 'Titre' },
                        { k: 'texte', t: 'area', l: 'Texte' }, { k: 'avenir', t: 'bool', l: 'Période à venir (affichée en pointillés)' }] }
                ] },
                { k: 'monde', t: 'groupe', l: 'Son monde', champs: [
                    PARAGRAPHES('clan', 'Relation au Clan du Tonnerre'),
                    { k: 'diplomatie', t: 'liste', l: 'Diplomatie', ajout: 'Ajouter un clan', lib: function (o) { return o.titre; }, item: [
                        { k: 'titre', t: 'text', l: 'Clan' }, { k: 'etiquette', t: 'text', l: 'Étiquette', aide: 'Ex. Neutralité bienveillante' },
                        { k: 'defaut', t: 'bool', l: 'Étiquette en rose (méfiance)' }, { k: 'texte', t: 'area', l: 'Texte' }] }
                ] }
            ]
        }
    ];

    /* ---------- Petits outils ---------- */
    var $ = function (id) { return document.getElementById(id); };

    function h(tag, props, enfants) {
        var e = document.createElement(tag);
        Object.keys(props || {}).forEach(function (k) {
            if (k === 'class') e.className = props[k];
            else if (k === 'text') e.textContent = props[k];
            else e.setAttribute(k, props[k]);
        });
        (enfants || []).forEach(function (c) { if (c) e.appendChild(c); });
        return e;
    }

    var toastTimer;
    function toast(message, erreur) {
        var t = $('toast');
        t.textContent = message;
        t.className = 'admin-toast visible' + (erreur ? ' erreur' : '');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { t.className = 'admin-toast'; }, erreur ? 6000 : 2600);
    }

    function copie(x) { return JSON.parse(JSON.stringify(x)); }

    /* ---------- État ---------- */
    var client = window.supabase.createClient(C.url, C.cle);
    var donnees = {};          // clé -> valeur en cours d'édition
    var modifie = {};          // clé -> true si pas enregistré
    var courante = null;       // rubrique affichée

    /* ---------- Éditeur de formulaires ---------- */
    function fixer(obj, k, v) {
        if (v === '' || v === false || v == null) delete obj[k];
        else obj[k] = v;
    }

    var compteur = 0;

    function formulaire(defs, obj, change) {
        var corps = h('div', { class: 'grille-champs' });
        var conteneur = h('div');

        defs.forEach(function (d) {
            var id = 'c' + (++compteur);
            var champ;

            if (d.t === 'liste') {
                conteneur.appendChild(corps.childNodes.length ? corps : document.createComment(''));
                conteneur.appendChild(liste(d, obj, change));
                corps = h('div', { class: 'grille-champs' });
                return;
            }

            if (d.t === 'groupe') {
                // un sous-ensemble de champs, replié par défaut
                if (!obj[d.k] || typeof obj[d.k] !== 'object') obj[d.k] = {};
                conteneur.appendChild(corps.childNodes.length ? corps : document.createComment(''));
                var det = h('details', { class: 'item' });
                det.appendChild(h('summary', {}, [h('span', { class: 'item-titre', text: d.l })]));
                var cg = h('div', { class: 'item-corps' });
                cg.appendChild(formulaire(d.champs, obj[d.k], change));
                det.appendChild(cg);
                conteneur.appendChild(h('div', { class: 'liste' }, [det]));
                corps = h('div', { class: 'grille-champs' });
                return;
            }

            if (d.t === 'bool') {
                var cb = h('input', { type: 'checkbox', id: id });
                cb.checked = !!obj[d.k];
                cb.addEventListener('change', function () { fixer(obj, d.k, cb.checked); change(); });
                champ = h('div', { class: 'champ case' }, [cb, h('label', { for: id, text: d.l })]);
            } else {
                var saisie;
                if (d.t === 'area') {
                    saisie = h('textarea', { id: id });
                    saisie.value = obj[d.k] == null ? '' : obj[d.k];
                    saisie.addEventListener('input', function () { fixer(obj, d.k, saisie.value); change(); });
                } else if (d.t === 'select') {
                    saisie = h('select', { id: id }, d.opts.map(function (o) { return h('option', { value: String(o[0]), text: o[1] }); }));
                    saisie.value = obj[d.k] == null ? '' : String(obj[d.k]);
                    saisie.addEventListener('change', function () {
                        var v = saisie.value;
                        fixer(obj, d.k, v === '' ? '' : (d.num ? Number(v) : v));
                        change();
                    });
                } else if (d.t === 'image') {
                    saisie = champImage(id, d, obj, change);
                } else {
                    saisie = h('input', { type: 'text', id: id });
                    if (d.suggere) {
                        var dl = h('datalist', { id: id + '-dl' }, d.suggere().map(function (v) { return h('option', { value: v }); }));
                        saisie.setAttribute('list', id + '-dl');
                        document.body.appendChild(dl);
                    }
                    saisie.value = obj[d.k] == null ? '' : obj[d.k];
                    saisie.addEventListener('input', function () { fixer(obj, d.k, saisie.value); change(); });
                }
                var enfants = [h('label', { for: id, text: d.l })];
                enfants.push(saisie);
                if (d.aide) enfants.push(h('span', { class: 'aide', text: d.aide }));
                champ = h('div', { class: 'champ' }, enfants);
                if (d.t === 'area') champ.style.gridColumn = '1 / -1';
            }
            corps.appendChild(champ);
        });

        if (corps.childNodes.length) conteneur.appendChild(corps);
        return conteneur;
    }

    function champImage(id, d, obj, change) {
        var texte = h('input', { type: 'text', id: id, placeholder: 'Nom de fichier ou adresse' });
        var vignette = h('img', { class: 'vignette', alt: '' });
        var fichier = h('input', { type: 'file', accept: 'image/*', hidden: '' });
        var bouton = h('button', { type: 'button', class: 'bouton-clair bouton-petit', text: 'Envoyer une image' });

        function aperçu() {
            if (texte.value.trim()) vignette.src = O.urlPhoto(texte.value.trim());
            else vignette.removeAttribute('src');
        }
        texte.value = obj[d.k] == null ? '' : obj[d.k];
        aperçu();
        texte.addEventListener('input', function () { fixer(obj, d.k, texte.value.trim()); change(); });
        texte.addEventListener('change', aperçu);
        vignette.addEventListener('error', function () { vignette.removeAttribute('src'); });

        bouton.addEventListener('click', function () { fichier.click(); });
        fichier.addEventListener('change', function () {
            var f = fichier.files[0];
            if (!f) return;
            bouton.disabled = true;
            bouton.textContent = 'Envoi…';
            envoyerImage(f).then(function (url) {
                texte.value = url;
                fixer(obj, d.k, url);
                aperçu();
                change();
                toast('Image envoyée. N\'oublie pas d\'enregistrer.');
            }).catch(function (e) {
                toast('Envoi impossible : ' + (e && e.message ? e.message : e), true);
            }).then(function () {
                bouton.disabled = false;
                bouton.textContent = 'Envoyer une image';
                fichier.value = '';
            });
        });

        return h('div', { class: 'champ-image' }, [vignette, texte, bouton, fichier]);
    }

    // Réduit l'image (1600 px max) et la convertit en WebP avant l'envoi
    function versWebp(f) {
        return createImageBitmap(f).then(function (bmp) {
            var k = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
            var c = document.createElement('canvas');
            c.width = Math.round(bmp.width * k);
            c.height = Math.round(bmp.height * k);
            c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
            return new Promise(function (ok) {
                c.toBlob(function (b) { ok(b && b.type === 'image/webp' ? b : null); }, 'image/webp', 0.82);
            });
        }).catch(function () { return null; });
    }

    function envoyerImage(f) {
        return versWebp(f).then(function (webp) {
            var base = f.name.replace(/\.[^.]+$/, '').normalize('NFD').replace(/[̀-ͯ]/g, '')
                .replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'image';
            var corps = webp || f;
            var ext = webp ? 'webp' : (f.name.split('.').pop() || 'png').toLowerCase();
            var nom = Date.now().toString(36) + '-' + base + '.' + ext;
            return client.storage.from('photos').upload(nom, corps, {
                contentType: webp ? 'image/webp' : f.type, cacheControl: '31536000'
            }).then(function (r) {
                if (r.error) throw r.error;
                return client.storage.from('photos').getPublicUrl(nom).data.publicUrl;
            });
        });
    }

    function liste(d, obj, change) {
        if (!Array.isArray(obj[d.k])) obj[d.k] = [];
        var tab = obj[d.k];
        var boite = h('div', { class: 'liste' });
        var titre = (d.l ? h('h3', { class: 'liste-titre', text: d.l }) : null);

        function rendre(ouvert) {
            boite.textContent = '';
            tab.forEach(function (item, i) {
                var det = h('details', { class: 'item' });
                if (i === ouvert) det.open = true;
                var nom = h('span', { class: 'item-titre' });
                function libelle() { nom.textContent = (d.lib ? d.lib(item) : '') || '(sans titre)'; }
                libelle();

                function bouton(sym, label, fait, inactif) {
                    var b = h('button', { type: 'button', 'aria-label': label, title: label, text: sym });
                    b.disabled = !!inactif;
                    b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); fait(); });
                    return b;
                }
                function deplacer(de, vers) {
                    var x = tab.splice(de, 1)[0];
                    tab.splice(vers, 0, x);
                    change(); rendre(vers);
                }
                var outils = h('span', { class: 'mini-boutons' }, [
                    bouton('↑', 'Monter', function () { deplacer(i, i - 1); }, i === 0),
                    bouton('↓', 'Descendre', function () { deplacer(i, i + 1); }, i === tab.length - 1),
                    bouton('✕', 'Supprimer', function () {
                        if (!window.confirm('Supprimer « ' + ((d.lib && d.lib(item)) || 'cet élément') + ' » ?')) return;
                        tab.splice(i, 1); change(); rendre();
                    })
                ]);
                det.appendChild(h('summary', {}, [nom, outils]));
                var corps = h('div', { class: 'item-corps' });
                corps.appendChild(formulaire(d.item, item, function () { libelle(); change(); }));
                det.appendChild(corps);
                boite.appendChild(det);
            });
            var ajout = h('button', { type: 'button', class: 'bouton-ajout', text: '+ ' + (d.ajout || 'Ajouter') });
            ajout.addEventListener('click', function () {
                tab.push({}); change(); rendre(tab.length - 1);
            });
            boite.appendChild(ajout);
        }
        rendre();

        var tout = h('div');
        if (titre) tout.appendChild(titre);
        tout.appendChild(boite);
        return tout;
    }

    /* ---------- Affichage d'une rubrique ---------- */
    function afficher(r) {
        courante = r;
        $('rubrique-titre').textContent = r.nom;
        $('rubrique-aide').textContent = r.aide;
        var racine = donnees[r.cle];

        var cible = $('formulaire');
        cible.textContent = '';
        cible.appendChild(formulaire(r.champs, racine, function () {
            modifie[r.cle] = true;
            majOnglets();
        }));
        majOnglets();
    }

    function majOnglets() {
        Array.prototype.forEach.call($('onglets').children, function (b, i) {
            var r = RUBRIQUES[i];
            b.setAttribute('aria-current', r === courante ? 'true' : 'false');
            b.className = modifie[r.cle] ? 'modifie' : '';
        });
    }

    function valeurFinale(r) {
        var v = donnees[r.cle];
        return r.racineListe ? v.liste : v;
    }

    function enregistrer() {
        var r = courante;
        var b = $('enregistrer');
        b.disabled = true;
        b.textContent = 'Enregistrement…';
        client.from('contenus').upsert({ cle: r.cle, valeur: valeurFinale(r) }).then(function (res) {
            if (res.error) throw res.error;
            modifie[r.cle] = false;
            majOnglets();
            toast('Enregistré. Le site est à jour !');
        }).catch(function (e) {
            toast('Échec de l\'enregistrement : ' + (e && e.message ? e.message : e), true);
        }).then(function () {
            b.disabled = false;
            b.textContent = 'Enregistrer';
        });
    }

    /* ---------- Écrans ---------- */
    function ecran(titre, texte, bouton, action) {
        $('app').hidden = true;
        var e = $('ecran');
        e.hidden = false;
        e.textContent = '';
        e.appendChild(h('h1', { text: titre }));
        if (texte) e.appendChild(h('p', { text: texte }));
        if (bouton) {
            var b = h('button', { type: 'button', class: 'bouton', text: bouton });
            b.addEventListener('click', action);
            e.appendChild(b);
        }
    }

    function connexionDiscord() {
        client.auth.signInWithOAuth({
            provider: 'discord',
            options: { redirectTo: window.location.origin + window.location.pathname }
        });
    }

    function deconnexion() {
        client.auth.signOut().then(function () { window.location.reload(); });
    }

    function charger() {
        return client.from('contenus').select('cle,valeur').then(function (res) {
            if (res.error) throw res.error;
            var lignes = {};
            res.data.forEach(function (l) { lignes[l.cle] = l.valeur; });
            RUBRIQUES.forEach(function (r) {
                // pas encore en base : on part des valeurs d'origine du site
                var v = copie(lignes[r.cle] != null ? lignes[r.cle] : (r.defaut() || (r.racineListe ? [] : {})));
                if (r.cle === 'relations') v = v.map(O.normaliserRelation);   // ancien format -> avis datés
                donnees[r.cle] = r.racineListe ? { liste: v } : v;
                modifie[r.cle] = false;
            });
        });
    }

    function ouvrirDashboard() {
        return charger().then(function () {
            $('ecran').hidden = true;
            $('app').hidden = false;
            var nav = $('onglets');
            nav.textContent = '';
            RUBRIQUES.forEach(function (r) {
                var b = h('button', { type: 'button', text: r.nom });
                b.addEventListener('click', function () { afficher(r); });
                nav.appendChild(b);
            });
            afficher(RUBRIQUES[0]);
        });
    }

    function demarrer(session) {
        if (!session) {
            $('deconnexion').hidden = true;
            $('qui').textContent = '';
            ecran('Dashboard', 'Connecte-toi avec Discord pour modifier le site.', 'Se connecter avec Discord', connexionDiscord);
            return;
        }
        var meta = session.user.user_metadata || {};
        $('qui').textContent = meta.full_name || meta.name || meta.custom_claims && meta.custom_claims.global_name || '';
        $('deconnexion').hidden = false;

        client.rpc('est_admin').then(function (r) {
            if (r.error) throw r.error;
            if (!r.data) {
                ecran('Accès refusé', 'Ce compte Discord n\'est pas administrateur du site.', 'Se déconnecter', deconnexion);
                return;
            }
            return ouvrirDashboard();
        }).catch(function (e) {
            var msg = e && e.message ? e.message : String(e);
            var base = /est_admin|contenus|schema cache|relation/i.test(msg)
                ? 'La base n\'est pas encore prête : lance le fichier supabase/schema.sql dans Supabase (SQL Editor). '
                : '';
            ecran('Erreur', base + msg, 'Se déconnecter', deconnexion);
        });
    }

    /* ---------- Lancement ---------- */
    $('deconnexion').addEventListener('click', deconnexion);
    $('enregistrer').addEventListener('click', enregistrer);

    window.addEventListener('beforeunload', function (e) {
        if (Object.keys(modifie).some(function (k) { return modifie[k]; })) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    var demarre = false;
    client.auth.onAuthStateChange(function (evenement, session) {
        // INITIAL_SESSION puis SIGNED_IN peuvent se suivre : on ne démarre qu'une fois par session
        if (evenement === 'TOKEN_REFRESHED' || evenement === 'USER_UPDATED') return;
        if (evenement === 'SIGNED_IN' && demarre) return;
        demarre = !!session;
        // on sort du callback avant d'appeler Supabase (évite un blocage connu de supabase-js)
        setTimeout(function () { demarrer(session); }, 0);
    });
})();
