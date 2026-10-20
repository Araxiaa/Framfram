/* ==========================================================================
   SITE — menu et pied de page, écrits une seule fois pour toutes les pages.
   Pour ajouter une page au menu : ajouter une ligne dans PAGES.
   Chaque ligne : [fichier, nom dans le menu, identifiant, phrase de présentation]
   (la phrase sert aux cartes « Explorer » de l'accueil).
   ========================================================================== */
(function () {
    'use strict';

    var PAGES = [
        ['index.html',     'Accueil',           'accueil',   ''],
        ['caractere.html', 'Caractère',         'caractere', 'Sa personnalité, ses forces et ses failles.'],
        ['physique.html',  'Physique',          'physique',  'Pelage, regard, stature : à quoi il ressemble.'],
        ['lignee.html',    'Lignée',            'lignee',    'L’arbre généalogique, des aïeux à ses enfants.'],
        ['relations.html', 'Relations',         'relations', 'Ses liens avec le clan et les chats qui comptent.'],
        ['histoire.html',  'Histoire',          'histoire',  'Les grandes périodes de sa vie.'],
        ['vies.html',      'Ses vies',          'vies',      'Neuf vies, huit encore à vivre.'],
        ['journal.html',   'Journal des lunes', 'journal',   'Les sujets de RP, lune après lune.'],
        ['galerie.html',   'Galerie',           'galerie',   'Les illustrations faites par les artistes.']
    ];
    window.PAGES_SITE = PAGES;

    var ICONE_ETOILE =
        '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="var(--azur-pale)"/>' +
        '<path d="M32 8l6.2 15.2 16.3 1.3-12.4 10.6 3.9 15.9L32 42.2 18 51l3.9-15.9L9.5 24.5l16.3-1.3z" fill="var(--framboise)"/>' +
        '<circle cx="32" cy="30" r="5" fill="var(--creme)"/></svg>';
    var ICONE_MENU =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
        '<path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    var ICONE_LUNE =
        '<svg class="i-lune" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>';
    var ICONE_SOLEIL =
        '<svg class="i-soleil" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

    var courante = document.body.getAttribute('data-page');

    var liens = PAGES.map(function (p) {
        var actif = p[2] === courante ? ' aria-current="page"' : '';
        return '<li><a href="' + p[0] + '"' + actif + '>' + p[1] + '</a></li>';
    }).join('');

    var entete = document.getElementById('entete');
    if (entete) {
        entete.className = 'site-header';
        entete.innerHTML =
            '<a class="lien-evitement" href="#contenu">Aller au contenu</a>' +
            '<div class="barre">' +
                '<a class="marque" href="index.html">' + ICONE_ETOILE + 'Étoile de Framboisier</a>' +
                '<button class="bouton-rond bouton-theme" type="button" aria-label="Changer de thème">' + ICONE_LUNE + ICONE_SOLEIL + '</button>' +
                '<button class="bouton-rond bouton-menu" type="button" aria-label="Menu" aria-expanded="false" aria-controls="menu-principal">' + ICONE_MENU + '</button>' +
                '<nav aria-label="Navigation principale"><ul class="menu" id="menu-principal">' + liens + '</ul></nav>' +
            '</div>';

        // Menu replié sur petit écran
        var boutonMenu = entete.querySelector('.bouton-menu');
        boutonMenu.addEventListener('click', function () {
            var ouvert = entete.classList.toggle('ouvert');
            boutonMenu.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
        });

        // Bouton thème clair / sombre
        entete.querySelector('.bouton-theme').addEventListener('click', function () {
            var racine = document.documentElement;
            var sombre = racine.getAttribute('data-theme') !== 'dark';
            racine.setAttribute('data-theme', sombre ? 'dark' : 'light');
            try { localStorage.setItem('theme', sombre ? 'dark' : 'light'); } catch (e) {}
            var meta = document.querySelector('meta[name="theme-color"]');
            if (meta) meta.setAttribute('content', sombre ? '#14202B' : '#E6ECF1');
        });
    }

    var pied = document.getElementById('pied');
    if (pied) {
        pied.className = 'site-footer';
        pied.innerHTML =
            '<p>Codex d’Étoile de Framboisier — Créé pour <em>@.araxia.</em></p>' +
            '<p>Inspiré de <em>@Oriyakii</em></p>';
    }

    // Portrait introuvable : l'arche garde son initiale à la place de la photo
    Array.prototype.forEach.call(document.querySelectorAll('.arche img'), function (img) {
        function retirer() { if (img.parentNode) img.parentNode.removeChild(img); }
        img.addEventListener('error', retirer);
        if (img.complete && img.naturalWidth === 0) retirer();
    });

    // ---------- Animations ----------
    // Retirer ce bloc pour supprimer toutes les animations du site.
    var feuille = document.createElement('link');
    feuille.rel = 'stylesheet';
    feuille.href = 'css/animations.css';
    document.head.appendChild(feuille);

    var anim = document.createElement('script');
    anim.src = 'js/animations.js';
    document.body.appendChild(anim);
})();
