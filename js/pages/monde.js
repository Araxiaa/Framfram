/* Son monde — lignée, relations, diplomatie.
   Données : js/data/lignee.js, relations.js, textes.js (ou la base Supabase). */
window.Donnees.pret(function () {
    'use strict';
    var O = window.Outils;
    var e = O.esc;

    /* ---------- Lignée ---------- */
    var D = window.LIGNEE;
    var CLASSE_ETIQUETTE = {
        'vivant': 'sauge', 'vivant-pj': '', 'decede': 'neutre',
        'disparu': 'roux', 'vide': 'neutre', 'heros': 'defaut'
    };

    function fiche(m) {
        var statut = m.statut || 'vivant';
        var etiquette = m.etiquette
            ? '<span class="pastille ' + (CLASSE_ETIQUETTE[statut] || '') + '">' + e(m.etiquette) + '</span>' : '';
        var tag = m.tag ? '<span class="pastille roux">' + e(m.tag) + '</span>' : '';
        return '<article class="fiche-chat statut-' + statut + '">' +
            O.avatar(m.nom, statut === 'vide' ? null : m.photo) +
            '<h4>' + e(m.nom) + '</h4>' +
            (m.role ? '<p class="fiche-role">' + e(m.role) + '</p>' : '') +
            '<div class="fiche-etiquettes">' + etiquette + tag + '</div>' +
            (m.joueur ? '<p class="fiche-joueur">' + e(m.joueur) + '</p>' : '') +
        '</article>';
    }
    function groupe(g) {
        return '<div class="groupe' + (g.couple ? ' couple' : '') + '">' +
            (g.titre ? '<h4 class="groupe-titre">' + e(g.titre) + '</h4>' : '') +
            '<div class="membres">' + (g.membres || []).map(fiche).join('') + '</div>' +
        '</div>';
    }
    function generation(gen) {
        return '<section class="generation">' +
            '<h3 class="gen-titre">' + e(gen.titre) + '</h3>' +
            '<div class="groupes">' + (gen.groupes || []).map(groupe).join('') + '</div>' +
        '</section>';
    }
    var origine = document.getElementById('origine');
    if (origine && D && D.origine) origine.innerHTML = '<span class="note-main">Répartition</span> ' + e(D.origine);
    var arbre = document.getElementById('arbre');
    if (arbre && D) {
        arbre.innerHTML = (D.generations || []).map(generation).join('<div class="lien-gen" aria-hidden="true"></div>');
        O.activerAvatars(arbre);
    }

    /* ---------- Relations ---------- */
    var legende = document.getElementById('legende');
    if (legende) {
        var c = O.icone('coeur'), s = O.icone('sombre');
        legende.innerHTML =
            '<li><span class="coeurs">' + c + c + c + '</span> Appréciation, l’intensité croît avec le nombre</li>' +
            '<li><span class="coeurs">' + s + s + s + '</span> Aversion, l’intensité croît avec le nombre</li>' +
            '<li><span class="coeurs">' + c + s + '</span> Neutre</li>' +
            '<li><span class="coeurs">' + O.icone('etoile') + '</span> Respect</li>' +
            '<li><span class="coeurs">' + O.icone('crane') + '</span> Décédé(e)</li>';
    }
    var M = (window.TEXTES && window.TEXTES.monde) || {};
    var clan = document.getElementById('clan-texte');
    if (clan && M.clan) {
        clan.innerHTML = '<h3>Relation au Clan du Tonnerre</h3>' +
            M.clan.map(function (p) { return '<p>' + e(p.texte) + '</p>'; }).join('');
    }

    function joueur(j) {
        if (!j) return '';
        return j.charAt(0) === '@' ? 'Joué par <strong>' + e(j) + '</strong>' : e(j);
    }
    var rels = (window.RELATIONS || []).map(O.normaliserRelation);
    var SANS_CLAN = 'Sans clan';
    function clanDe(r) { return r.clan || SANS_CLAN; }

    // L'avis le plus récent (le dernier de la liste) résume la carte
    function dernier(r) { return r.avis[r.avis.length - 1] || {}; }
    function symboles(r, avis) {
        return O.coeurs({ affinite: avis.affinite, respect: avis.respect, mort: r.mort });
    }

    function carte(r, i) {
        var nb = r.avis.length;
        return '<li class="relation' + (r.mort ? ' defunt' : '') + '" data-clan="' + e(clanDe(r)) + '">' +
            '<button type="button" class="relation-bouton" data-i="' + i + '" aria-haspopup="dialog">' +
                O.avatar(r.nom, r.photo, 'grand') +
                '<span class="relation-corps">' +
                    '<span class="relation-nom">' + e(r.nom) + '</span>' +
                    '<span class="relation-meta">' +
                        (r.role ? '<span class="pastille neutre">' + e(r.role) + '</span>' : '') +
                        '<span class="pastille ' + (r.clan ? 'sauge' : 'neutre') + '">' + e(clanDe(r)) + '</span>' +
                    '</span>' +
                    '<span class="relation-bas">' + symboles(r, dernier(r)) +
                        '<span class="relation-nb">' + nb + ' avis</span></span>' +
                '</span>' +
            '</button>' +
        '</li>';
    }
    var visages = document.getElementById('visages');
    if (visages) {
        visages.innerHTML = rels.map(carte).join('');
        O.activerAvatars(visages);
    }

    // Filtres par clan / groupe, créés à partir des données
    var filtres = document.getElementById('filtres');
    if (filtres) {
        var clansVus = [];
        rels.forEach(function (r) { if (clansVus.indexOf(clanDe(r)) < 0) clansVus.push(clanDe(r)); });
        if (clansVus.length > 1) {
            filtres.innerHTML = ['Tous'].concat(clansVus).map(function (nom, i) {
                return '<button type="button" class="filtre" data-f="' + e(nom) + '" aria-pressed="' + (i === 0) + '">' + e(nom) + '</button>';
            }).join('');
            filtres.addEventListener('click', function (ev) {
                var b = ev.target.closest ? ev.target.closest('.filtre') : null;
                if (!b) return;
                var f = b.getAttribute('data-f');
                Array.prototype.forEach.call(filtres.children, function (x) { x.setAttribute('aria-pressed', String(x === b)); });
                Array.prototype.forEach.call(visages.children, function (li) {
                    li.hidden = f !== 'Tous' && li.getAttribute('data-clan') !== f;
                });
            });
        } else filtres.hidden = true;
    }

    /* ---------- Fiche d'un chat : évolution de son avis (fenêtre qui défile) ---------- */
    function courbe(r) {
        var pts = r.avis.filter(function (a) { return typeof a.affinite === 'number'; });
        if (pts.length < 2) return '';
        var L = 560, H = 120, m = 22;
        var x = function (i) { return m + (L - 2 * m) * i / (pts.length - 1); };
        var y = function (v) { return m + (H - 2 * m) * (3 - v) / 6; };
        var ligne = pts.map(function (a, i) { return x(i).toFixed(1) + ',' + y(a.affinite).toFixed(1); }).join(' ');
        var points = pts.map(function (a, i) {
            return '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(a.affinite).toFixed(1) + '" r="5.5" class="' +
                (a.affinite > 0 ? 'pt-aime' : a.affinite < 0 ? 'pt-aversion' : 'pt-neutre') + '"/>';
        }).join('');
        return '<figure class="courbe">' +
            '<svg viewBox="0 0 ' + L + ' ' + H + '" role="img" aria-label="Évolution de l’affinité au fil des lunes">' +
                '<line x1="' + m + '" x2="' + (L - m) + '" y1="' + y(0) + '" y2="' + y(0) + '" class="zero"/>' +
                '<polyline points="' + ligne + '" class="trace"/>' + points +
            '</svg>' +
            '<figcaption><span>' + e(pts[0].lune || '') + '</span><span class="note-main">l’évolution de son cœur</span><span>' + e(pts[pts.length - 1].lune || '') + '</span></figcaption>' +
        '</figure>';
    }

    function avisHtml(a, estDernier) {
        return '<li class="avis' + (estDernier ? ' actuel' : '') + '">' +
            '<span class="avis-noeud" aria-hidden="true"></span>' +
            '<div class="avis-tete">' +
                '<span class="avis-lune">' + e(a.lune || 'Lune inconnue') + '</span>' +
                O.coeurs({ affinite: a.affinite, respect: a.respect }) +
                (estDernier ? '<span class="pastille">Avis actuel</span>' : '') +
            '</div>' +
            (a.texte ? '<p>' + e(a.texte) + '</p>' : '') +
        '</li>';
    }

    var boite = null, recentEnPremier = false, ouverte = null;
    function creerBoite() {
        boite = document.createElement('dialog');
        boite.className = 'fiche-relation';
        boite.setAttribute('aria-label', 'Fiche de relation');
        boite.innerHTML = '<button class="vis-fermer" type="button" aria-label="Fermer">×</button><div class="fr-contenu"></div>';
        document.body.appendChild(boite);
        boite.querySelector('.vis-fermer').addEventListener('click', function () { boite.close(); });
        boite.addEventListener('click', function (ev) {
            if (ev.target === boite) { boite.close(); return; }
            var b = ev.target.closest ? ev.target.closest('.ordre-avis') : null;
            if (!b) return;
            recentEnPremier = !recentEnPremier;
            remplir(ouverte);
        });
    }
    function remplir(r) {
        var liste = r.avis.map(function (a, i) { return avisHtml(a, i === r.avis.length - 1); });
        if (recentEnPremier) liste.reverse();
        var nb = r.avis.length;
        boite.querySelector('.fr-contenu').innerHTML =
            '<header class="fr-tete">' +
                O.avatar(r.nom, r.photo, 'enorme') +
                '<div>' +
                    '<h2>' + e(r.nom) + '</h2>' +
                    '<p class="fr-meta">' +
                        (r.role ? '<span class="pastille neutre">' + e(r.role) + '</span> ' : '') +
                        '<span class="pastille ' + (r.clan ? 'sauge' : 'neutre') + '">' + e(clanDe(r)) + '</span> ' +
                        symboles(r, dernier(r)) +
                    '</p>' +
                    (r.joueur ? '<p class="relation-joueur">' + joueur(r.joueur) + '</p>' : '') +
                '</div>' +
            '</header>' +
            '<div class="fr-corps">' +
                courbe(r) +
                '<div class="fr-outils"><h3>' + nb + (nb > 1 ? ' avis au fil des lunes' : ' avis') + '</h3>' +
                    (nb > 1 ? '<button type="button" class="ordre-avis bouton bouton-clair bouton-petit">' +
                        (recentEnPremier ? 'Du plus ancien au plus récent' : 'Le plus récent en premier') + '</button>' : '') +
                '</div>' +
                '<ol class="avis-liste">' + liste.join('') + '</ol>' +
            '</div>';
        O.activerAvatars(boite);
    }

    if (visages && typeof HTMLDialogElement === 'function') {
        visages.addEventListener('click', function (ev) {
            var b = ev.target.closest ? ev.target.closest('.relation-bouton') : null;
            if (!b) return;
            if (!boite) creerBoite();
            ouverte = rels[parseInt(b.getAttribute('data-i'), 10)];
            recentEnPremier = false;
            remplir(ouverte);
            boite.showModal();
            boite.querySelector('.fr-corps').scrollTop = 0;
        });
    }

    /* ---------- Diplomatie ---------- */
    var clans = document.getElementById('clans');
    if (clans && M.diplomatie) {
        clans.innerHTML = M.diplomatie.map(function (c, i) {
            return '<article class="clan carte ' + (c.defaut ? 'mefiant' : 'neutre') + '">' +
                '<h3>' + e(c.titre) + '</h3>' +
                '<span class="pastille ' + (c.defaut ? 'defaut' : '') + '">' + e(c.etiquette) + '</span>' +
                '<p>' + e(c.texte) + '</p>' +
            '</article>';
        }).join('');
    }
});
