/* Thème clair / sombre — chargé dans le <head> pour éviter tout clignotement.
   Suit l'appareil par défaut ; le bouton de l'en-tête mémorise le choix. */
(function () {
    var choix = null;
    try { choix = localStorage.getItem('theme'); } catch (e) {}
    var sombre = choix ? choix === 'dark'
        : !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', sombre ? 'dark' : 'light');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', sombre ? '#0E1A19' : '#F5EFDF');
})();
