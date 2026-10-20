/* Galerie — construit la grille à partir de js/data/galerie.js
   et ouvre chaque œuvre en grand dans une visionneuse (flèches du clavier, Échap). */
window.Donnees.pret(function () {
    'use strict';
    var O = window.Outils;
    var grille = document.getElementById('galerie-grille');
    if (!grille || !window.GALERIE) return;
    var oeuvres = window.GALERIE;

    grille.innerHTML = oeuvres.map(function (g, i) {
        var url = O.urlPhoto(g.fichier);
        return '<figure class="oeuvre">' +
            '<a href="' + url + '" data-i="' + i + '" aria-label="Agrandir : ' + O.esc(g.titre) + ' par ' + O.esc(g.auteur) + '">' +
                '<img src="' + url + '" alt="' + O.esc(g.alt || g.titre) + '" decoding="async">' +
            '</a>' +
            '<figcaption><strong>' + O.esc(g.titre) + '</strong>Par ' + O.esc(g.auteur) + '</figcaption>' +
        '</figure>';
    }).join('');

    // Image introuvable : on garde la carte et on indique le fichier attendu
    Array.prototype.forEach.call(grille.querySelectorAll('img'), function (img, i) {
        function remplacer() {
            var manque = document.createElement('div');
            manque.className = 'oeuvre-manquante';
            manque.textContent = 'Image introuvable : assets/photos/' + oeuvres[i].fichier;
            if (img.parentNode) img.parentNode.replaceChild(manque, img);
        }
        img.addEventListener('error', remplacer);
        if (img.complete && img.naturalWidth === 0) remplacer();
    });

    // ---------- Visionneuse ----------
    if (typeof HTMLDialogElement !== 'function') return; // très vieux navigateur : lien direct vers l'image

    var boite = document.createElement('dialog');
    boite.className = 'visionneuse';
    boite.setAttribute('aria-label', 'Illustration en grand');
    boite.innerHTML =
        '<button class="vis-fermer" type="button" aria-label="Fermer">\u00D7</button>' +
        '<button class="vis-nav vis-prec" type="button" aria-label="Illustration précédente">\u2039</button>' +
        '<figure><img alt=""><figcaption></figcaption></figure>' +
        '<button class="vis-nav vis-suiv" type="button" aria-label="Illustration suivante">\u203A</button>';
    document.body.appendChild(boite);

    var img = boite.querySelector('img');
    var legende = boite.querySelector('figcaption');
    var courant = 0;

    function afficher(i) {
        courant = (i + oeuvres.length) % oeuvres.length;
        var g = oeuvres[courant];
        img.src = O.urlPhoto(g.fichier);
        img.alt = g.alt || g.titre;
        legende.innerHTML = '<strong>' + O.esc(g.titre) + '</strong> — par ' + O.esc(g.auteur);
    }

    grille.addEventListener('click', function (e) {
        var lien = e.target.closest ? e.target.closest('a[data-i]') : null;
        if (!lien) return;
        e.preventDefault();
        afficher(parseInt(lien.getAttribute('data-i'), 10));
        boite.showModal();
    });
    boite.querySelector('.vis-fermer').addEventListener('click', function () { boite.close(); });
    boite.querySelector('.vis-prec').addEventListener('click', function () { afficher(courant - 1); });
    boite.querySelector('.vis-suiv').addEventListener('click', function () { afficher(courant + 1); });
    boite.addEventListener('click', function (e) { if (e.target === boite) boite.close(); }); // clic sur le fond
    boite.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') afficher(courant - 1);
        else if (e.key === 'ArrowRight') afficher(courant + 1);
    });
});
