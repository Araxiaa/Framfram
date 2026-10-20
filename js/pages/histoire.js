/* Son histoire — la chronique (js/data/textes.js) et le journal des lunes (js/data/journal.js),
   ou leurs versions en ligne dans Supabase. */
window.Donnees.pret(function () {
    'use strict';
    var O = window.Outils;
    var e = O.esc;
    var H = (window.TEXTES && window.TEXTES.histoire) || {};

    /* ---------- La chronique ---------- */
    var titre = document.getElementById('histoire-titre');
    var intro = document.getElementById('histoire-intro');
    if (titre && H.titre) titre.textContent = H.titre;
    if (intro && H.intro) intro.textContent = H.intro;

    var liste = document.getElementById('chronique-liste');
    if (liste && H.periodes) {
        liste.innerHTML = H.periodes.map(function (p, i) {
            return '<li class="periode' + (p.avenir ? ' a-venir' : '') + '">' +
                '<span class="periode-noeud" aria-hidden="true"></span>' +
                '<div class="periode-carte carte">' +
                    '<span class="periode-lune">' + e(p.lune) + '</span>' +
                    '<h3>' + e(p.titre) + '</h3>' +
                    '<p>' + e(p.texte) + '</p>' +
                '</div>' +
            '</li>';
        }).join('');
    }

    /* ---------- Le journal des lunes ---------- */
    var donnees = window.JOURNAL || [];
    var fil = document.getElementById('journal-fil');
    var bilan = document.getElementById('journal-bilan');
    var bouton = document.getElementById('journal-ordre');
    if (!fil) return;

    var recentEnPremier = false;
    function enCours(x) { return x.enCours === true || x.enCours === 'true'; }

    // Regroupe par lune en gardant l'ordre des données
    function grouper() {
        var groupes = [], index = {};
        donnees.forEach(function (x) {
            if (!(x.lune in index)) {
                index[x.lune] = groupes.length;
                groupes.push({ lune: x.lune, sujets: [] });
            }
            groupes[index[x.lune]].sujets.push(x);
        });
        return groupes;
    }
    function compagnons(c) {
        var l = Array.isArray(c) ? c : String(c || '').split(',');
        return l.map(function (n) { return n.trim(); }).filter(function (n) { return n && n !== '—'; });
    }

    function sujet(x) {
        var lien = x.lien && x.lien !== '#';
        var titreSujet = lien
            ? '<a href="' + e(x.lien) + '" target="_blank" rel="noopener">' + e(x.titre) + '</a>'
            : e(x.titre);
        var avec = compagnons(x.compagnons);
        return '<li class="sujet' + (enCours(x) ? ' en-cours' : '') + '">' +
            '<div class="sujet-tete"><h3>' + titreSujet + '</h3>' +
                (enCours(x) ? '<span class="pastille roux">En cours</span>' : '') + '</div>' +
            '<p class="sujet-resume">' + e(x.resume) + '</p>' +
            (avec.length
                ? '<ul class="pastilles">' + avec.map(function (n) { return '<li class="pastille neutre">' + e(n) + '</li>'; }).join('') + '</ul>'
                : '') +
        '</li>';
    }

    function groupe(g) {
        var nombre = String(g.lune).match(/\d+/);
        var n = g.sujets.length;
        return '<section class="lune-groupe">' +
            '<h2 class="lune-titre">' +
                '<span class="lune-disque" aria-hidden="true"></span>' +
                (nombre
                    ? '<span class="lune-num">' + nombre[0] + '</span><span class="lune-unit">' + (nombre[0] === '1' ? 'lune' : 'lunes') + '</span>'
                    : '<span class="lune-unit">' + e(g.lune) + '</span>') +
                '<span class="lune-compte">' + n + (n > 1 ? ' sujets' : ' sujet') + '</span>' +
            '</h2>' +
            '<ol class="lune-sujets">' + g.sujets.map(sujet).join('') + '</ol>' +
        '</section>';
    }

    function rendre() {
        var groupes = grouper();
        if (recentEnPremier) {
            groupes.reverse();
            groupes.forEach(function (g) { g.sujets.reverse(); });
        }
        fil.innerHTML = groupes.map(groupe).join('');
    }

    if (bilan) {
        var total = donnees.length;
        var encours = donnees.filter(enCours).length;
        bilan.textContent = total + (total > 1 ? ' sujets joués' : ' sujet joué') +
            (encours ? ', dont ' + encours + ' en cours' : '') + '. Chaque titre ouvre le sujet sur Discord.';
    }
    if (bouton) {
        bouton.addEventListener('click', function () {
            recentEnPremier = !recentEnPremier;
            bouton.setAttribute('aria-pressed', String(recentEnPremier));
            bouton.textContent = recentEnPremier ? 'Revenir à l’ordre chronologique' : 'Voir le plus récent en premier';
            rendre();
        });
    }
    rendre();
});
