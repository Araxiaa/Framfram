/* Accueil — fiche, charte, compteur de vies, cartes « Explorer », derniers sujets.
   Données : js/data/textes.js, vies.js, journal.js (ou la base Supabase). */
window.Donnees.pret(function () {
    'use strict';
    var O = window.Outils;
    var T = (window.TEXTES && window.TEXTES.accueil) || {};

    function texte(id, valeur) {
        var el = document.getElementById(id);
        if (el && valeur) el.textContent = valeur;
    }
    texte('hero-fonction', T.fonction);
    texte('hero-devise', T.devise ? '« ' + T.devise + ' »' : '');
    texte('charte-titre', T.charte_titre);
    texte('charte-intro', T.charte_intro);

    var cible = document.getElementById('compteur-vies');
    if (cible && window.VIES) cible.innerHTML = O.compteurVies(window.VIES);

    // Fiche rapide : des galets posés les uns à côté des autres
    var galets = document.getElementById('fiche-galets');
    if (galets && T.fiche) {
        galets.innerHTML = T.fiche.map(function (f) {
            return '<li class="galet"><span>' + O.esc(f.label) + '</span><strong>' + O.esc(f.valeur) + '</strong></li>';
        }).join('');
    }

    // Le mur des lunes : des souvenirs épinglés, à faire défiler
    var mur = document.getElementById('mur');
    var L = window.LUNES || [];
    if (mur && L.length) {
        document.getElementById('mur-section').hidden = false;
        mur.innerHTML = L.map(function (s) {
            var teinte = ['azur', 'sauge', 'roux', 'framboise'].indexOf(s.teinte) >= 0 ? s.teinte : 'sauge';
            return '<article class="souvenir ' + teinte + '">' +
                '<span class="epingle" aria-hidden="true"></span>' +
                (s.image ? '<img class="souvenir-image" src="' + O.urlPhoto(s.image) + '" alt="" loading="lazy">' : '') +
                '<span class="souvenir-lune">' + O.esc(s.lune) + '</span>' +
                '<h3>' + O.esc(s.titre) + '</h3>' +
                (s.texte ? '<p>' + O.esc(s.texte) + '</p>' : '') +
            '</article>';
        }).join('');
        var pas = function () { var c = mur.querySelector('.souvenir'); return c ? c.offsetWidth + 24 : 300; };
        document.getElementById('mur-prec').addEventListener('click', function () { mur.scrollBy({ left: -pas(), behavior: 'smooth' }); });
        document.getElementById('mur-suiv').addEventListener('click', function () { mur.scrollBy({ left: pas(), behavior: 'smooth' }); });
        mur.addEventListener('keydown', function (ev) {
            if (ev.key === 'ArrowRight') mur.scrollBy({ left: pas(), behavior: 'smooth' });
            else if (ev.key === 'ArrowLeft') mur.scrollBy({ left: -pas(), behavior: 'smooth' });
        });
        // l'image du souvenir qui ne charge pas disparaît
        Array.prototype.forEach.call(mur.querySelectorAll('img'), function (img) {
            img.addEventListener('error', function () { img.remove(); });
        });
    }

    // La charte, gravée dans l'écorce
    var articles = document.getElementById('charte-articles');
    if (articles && T.charte) {
        articles.innerHTML = T.charte.map(function (a) {
            return '<li class="article">' +
                '<span class="article-num" aria-hidden="true">' + O.esc(a.num) + '</span>' +
                '<h3>' + O.esc(a.titre) + '</h3>' +
                (a.sous ? '<p class="article-sous">' + O.esc(a.sous) + '</p>' : '') +
                '<p>' + O.esc(a.texte) + '</p>' +
            '</li>';
        }).join('');
    }

    // Cartes « Explorer » : générées à partir de PAGES dans js/site.js
    var IMAGES = {
        lui: 'Headshot Etoile de Framboisier Oriyakii.webp',
        histoire: 'Doodle Framboisier Galopin Courlis.webp',
        monde: 'Framboisier_et_Galopin.webp',
        galerie: 'Etoile de Framboisier - Moonlight.webp'
    };
    var explorer = document.getElementById('explorer');
    if (explorer && window.PAGES_SITE) {
        explorer.innerHTML = window.PAGES_SITE.filter(function (p) { return p[3]; }).map(function (p) {
            return '<a class="carte-nav" href="' + p[0] + '">' +
                '<span class="carte-nav-image"><img src="' + O.urlPhoto(IMAGES[p[2]] || '') + '" alt="" loading="lazy"></span>' +
                '<span class="carte-nav-texte"><h3>' + O.esc(p[1]) + '</h3><p>' + O.esc(p[3]) + '</p></span>' +
                '<span class="carte-fleche" aria-hidden="true">→</span>' +
            '</a>';
        }).join('');
    }

    // Les trois derniers sujets du journal
    var recents = document.getElementById('recents');
    var J = window.JOURNAL || [];
    if (recents && J.length) {
        document.getElementById('recent-section').hidden = false;
        recents.innerHTML = J.slice(-3).reverse().map(function (e) {
            var lien = e.lien && e.lien !== '#' ? e.lien : 'histoire.html#journal';
            return '<a class="recent" href="histoire.html#journal">' +
                '<span class="recent-lune">' + O.esc(e.lune || '') + '</span>' +
                '<h3>' + O.esc(e.titre) + '</h3>' +
                '<p>' + O.esc(e.resume || '') + '</p>' +
            '</a>';
        }).join('');
    }
});
