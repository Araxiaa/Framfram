/* Accueil — compteur de vies (données : js/data/vies.js)
   et cartes « Explorer » (générées à partir de PAGES dans js/site.js). */
(function () {
    'use strict';
    var cible = document.getElementById('compteur-vies');
    if (cible && window.VIES) cible.innerHTML = window.Outils.compteurVies(window.VIES);

    var explorer = document.getElementById('explorer');
    if (explorer && window.PAGES_SITE) {
        var O = window.Outils;
        explorer.innerHTML = window.PAGES_SITE.filter(function (p) { return p[3]; }).map(function (p) {
            return '<a class="carte-lien" href="' + p[0] + '">' +
                '<h3>' + O.esc(p[1]) + '</h3><p>' + O.esc(p[3]) + '</p>' +
                '<span class="carte-fleche" aria-hidden="true">→</span></a>';
        }).join('');
    }
})();
