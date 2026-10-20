/* Le Meneur — Caractère, Physique, Ses vies.
   Données : js/data/textes.js (caractere, physique) et vies.js (ou la base Supabase). */
window.Donnees.pret(function () {
    'use strict';
    var O = window.Outils;
    var T = window.TEXTES || {};
    var e = O.esc;

    function paragraphes(liste) {
        return (liste || []).map(function (p) { return '<p>' + e(p.texte) + '</p>'; }).join('');
    }

    // Carte de trait : le texte long est replié, un clic le déplie
    function trait(nom, texte, classe) {
        return '<article class="trait ' + (classe || '') + '">' +
            '<h4>' + e(nom) + '</h4>' +
            '<p class="trait-texte">' + e(texte) + '</p>' +
            '<button class="trait-plus" type="button" aria-expanded="false">Lire la suite</button>' +
        '</article>';
    }
    function traits(liste, classe) {
        return '<div class="traits">' + (liste || []).map(function (t) {
            return trait(t.nom || t.titre, t.texte, classe);
        }).join('') + '</div>';
    }
    function pastilles(liste, classe) {
        return '<ul class="pastilles">' + (liste || []).map(function (t) {
            return '<li class="pastille ' + (classe || '') + '">' + e(t.nom) + '</li>';
        }).join('') + '</ul>';
    }
    function titre(surtitre, h2) {
        return '<div class="entete-section"><span class="surtitre">' + e(surtitre) + '</span><h2>' + e(h2) + '</h2></div>';
    }

    /* ---------- Caractère ---------- */
    var C = T.caractere;
    var pc = document.getElementById('caractere');
    if (pc && C) {
        pc.innerHTML =
            '<div class="deux-col">' +
                '<div class="prose lettrine">' + paragraphes(C.paragraphes) + '</div>' +
                '<aside class="encart" aria-label="En bref">' +
                    '<div class="carte"><h3>Ses qualités</h3>' + pastilles(C.qualites, 'sauge') + '</div>' +
                    '<div class="carte"><h3>Ses défauts</h3>' + pastilles(C.defauts, 'defaut') + '</div>' +
                '</aside>' +
            '</div>' +
            '<section class="bloc">' + titre('Ce qui le porte', 'Ses qualités') + traits(C.qualites, 'sauge') + '</section>' +
            '<section class="bloc">' + titre('Ce qui le trahit', 'Ses défauts') + traits(C.defauts, 'framboise') + '</section>' +
            '<section class="bloc">' + titre('Au quotidien', 'Goûts, phobies et habitudes') + traits(C.gouts, 'roux') + '</section>';
    }

    /* ---------- Physique ---------- */
    var P = T.physique;
    var pp = document.getElementById('physique');
    if (pp && P) {
        var jauges = (P.profil || []).map(function (j) {
            var cases = '';
            for (var i = 1; i <= 5; i++) cases += '<i class="' + (i <= j.niveau ? 'plein' : '') + '"></i>';
            return '<li class="jauge" role="img" aria-label="' + e(j.nom) + ' : ' + j.niveau + ' sur 5"><span>' + e(j.nom) + '</span><span class="jauge-piste">' + cases + '</span></li>';
        }).join('');
        var apercu = (P.apercu || []).map(function (a) {
            return '<div><dt>' + e(a.label) + '</dt><dd>' + e(a.valeur) + '</dd></div>';
        }).join('');

        pp.innerHTML =
            '<div class="deux-col inverse">' +
                '<aside class="encart" aria-label="Portrait et mensurations">' +
                    '<div class="portrait-cadre petit" data-initiale="É"><img src="' + O.urlPhoto('Headshot Etoile de Framboisier Oriyakii.webp') + '" alt="Portrait d’Étoile de Framboisier" loading="lazy"></div>' +
                    '<div class="carte"><h3>En un coup d’œil</h3><dl class="fiche-dl">' + apercu + '</dl></div>' +
                    '<div class="carte"><h3>Son profil</h3><ul class="jauges">' + jauges + '</ul></div>' +
                '</aside>' +
                '<div class="prose lettrine">' + paragraphes(P.paragraphes) + '</div>' +
            '</div>' +
            '<section class="bloc"><div class="deux-cartes">' +
                '<div class="carte vert"><span class="surtitre">Sa force</span><h3>Ses points forts</h3><div class="prose">' + paragraphes(P.forts) + '</div></div>' +
                '<div class="carte rose"><span class="surtitre">Ses limites</span><h3>Ses points faibles</h3><div class="prose">' + paragraphes(P.faibles) + '</div></div>' +
            '</div></section>' +
            '<section class="bloc">' + titre('Ce qu’il porte sur lui', 'Marques et accessoires') + traits(P.marques, 'roux') + '</section>';

        O.activerAvatars(pp);
        var img = pp.querySelector('.portrait-cadre img');
        if (img) img.addEventListener('error', function () { img.remove(); });
    }

    /* ---------- Ses vies : neuf orbes ---------- */
    var pv = document.getElementById('vies');
    var vies = window.VIES || [];
    if (pv) {
        pv.innerHTML =
            titre('Le don du Clan des Étoiles', 'L’héritage des neuf vies') +
            '<div class="orbes-zone">' +
                '<div class="orbes" role="group" aria-label="Les neuf vies"></div>' +
                '<div class="vie-detail carte" aria-live="polite"></div>' +
            '</div>' +
            '<div class="bilan-vies">' + O.compteurVies(vies) + '</div>';

        var orbes = pv.querySelector('.orbes');
        var detail = pv.querySelector('.vie-detail');

        orbes.innerHTML = vies.map(function (v, i) {
            var perdue = v.statut === 'perdue';
            return '<button type="button" class="orbe ' + (perdue ? 'perdue' : 'active') + '" data-i="' + i + '" aria-pressed="false">' +
                '<span class="orbe-num">' + (i + 1) + '</span><span class="orbe-don">' + e(v.don) + '</span></button>';
        }).join('');

        function montrer(i) {
            var v = vies[i];
            if (!v) return;
            var perdue = v.statut === 'perdue';
            Array.prototype.forEach.call(orbes.children, function (b, k) {
                b.setAttribute('aria-pressed', k === i ? 'true' : 'false');
            });
            detail.className = 'vie-detail carte ' + (perdue ? 'perdue' : 'active');
            detail.innerHTML =
                '<span class="surtitre">Vie n°' + (i + 1) + '</span>' +
                '<h3>' + e(v.don) + ' ' + (perdue
                    ? '<span class="pastille defaut">Perdue' + (v.lune ? ' à ' + e(v.lune) : '') + '</span>'
                    : '<span class="pastille">Active</span>') + '</h3>' +
                '<p>' + e(v.texte) + '</p>';
        }
        orbes.addEventListener('click', function (ev) {
            var b = ev.target.closest ? ev.target.closest('.orbe') : null;
            if (b) montrer(parseInt(b.getAttribute('data-i'), 10));
        });
        var premiere = vies.findIndex(function (v) { return v.statut === 'perdue'; });
        montrer(premiere < 0 ? 0 : premiere);
    }

    /* ---------- Repli / dépli des cartes de trait ---------- */
    document.addEventListener('click', function (ev) {
        var b = ev.target.closest ? ev.target.closest('.trait-plus') : null;
        if (!b) return;
        var carte = b.parentNode;
        var ouvert = carte.classList.toggle('ouvert');
        b.setAttribute('aria-expanded', String(ouvert));
        b.textContent = ouvert ? 'Replier' : 'Lire la suite';
    });
    // pas de bouton quand le texte est court
    window.requestAnimationFrame(function () {
        Array.prototype.forEach.call(document.querySelectorAll('.trait'), function (c) {
            var p = c.querySelector('.trait-texte');
            if (p && p.scrollHeight <= p.clientHeight + 2) c.classList.add('court');
        });
    });
    window.addEventListener('onglet-change', function () {
        Array.prototype.forEach.call(document.querySelectorAll('.trait:not(.ouvert)'), function (c) {
            var p = c.querySelector('.trait-texte');
            if (p && p.clientHeight) c.classList.toggle('court', p.scrollHeight <= p.clientHeight + 2);
        });
    });
});
