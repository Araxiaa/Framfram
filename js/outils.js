/* ==========================================================================
   OUTILS — petites fonctions partagées par les scripts de pages.
   (Rien à modifier ici pour changer un contenu.)
   ========================================================================== */
(function () {
    'use strict';

    // Protège le texte inséré dans le HTML
    function esc(texte) {
        return String(texte == null ? '' : texte)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // Les images sont rangées dans assets/photos/ ; une adresse complète (https://…)
    // est utilisée telle quelle (images envoyées depuis le dashboard).
    function urlPhoto(fichier) {
        if (/^https?:\/\//.test(fichier)) return fichier;
        return 'assets/photos/' + encodeURIComponent(fichier);
    }

    // Pastille ronde : la photo si elle existe, sinon l'initiale du nom
    function avatar(nom, fichier, classe) {
        var initiale = esc(String(nom).charAt(0));
        var img = fichier
            ? '<img src="' + urlPhoto(fichier) + '" alt="" loading="lazy">'
            : '';
        return '<div class="avatar ' + (classe || '') + '" data-initiale="' + initiale + '">' + img + '</div>';
    }

    // À appeler après avoir inséré du HTML : retire les photos introuvables
    // pour laisser apparaître l'initiale.
    function activerAvatars(racine) {
        var imgs = (racine || document).querySelectorAll('.avatar img');
        Array.prototype.forEach.call(imgs, function (img) {
            function retirer() { if (img.parentNode) img.parentNode.removeChild(img); }
            img.addEventListener('error', retirer);
            if (img.complete && img.naturalWidth === 0) retirer();
        });
    }

    // Cœurs de l'index des relations (mêmes règles que sur Discord)
    //   affinite : 1 à 3 = appréciation, -1 à -3 = aversion, 0 = neutre
    //   respect  : true = étoile      mort : true = crâne
    // Symboles dessinés (suivent les couleurs du thème) : coeur, sombre, etoile, crane
    var CHEMINS = {
        coeur:  'M12 20.5C5 15.6 2.5 12 2.5 8.6 2.5 6 4.5 4 7 4c1.9 0 3.7 1.1 5 3 1.3-1.9 3.1-3 5-3 2.5 0 4.5 2 4.5 4.6 0 3.4-2.5 7-9.5 11.9z',
        etoile: 'M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7.3L12 17.8 5.7 21.5l1.7-7.3L2 9.5l7.1-.6z',
        crane:  'M12 3C7.6 3 4.5 6 4.5 10c0 2.4 1.1 4.2 2.5 5.2V19h2v-2h1.5v2h3v-2H15v2h2v-3.8c1.4-1 2.5-2.8 2.5-5.2C19.5 6 16.4 3 12 3zM8.7 9.2a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8zm6.6 0a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8z'
    };
    function icone(nom) {
        var chemin = CHEMINS[nom === 'sombre' ? 'coeur' : nom];
        return '<svg class="sym sym-' + nom + '" viewBox="0 0 24 24" aria-hidden="true">' +
            '<path d="' + chemin + '"' + (nom === 'crane' ? ' fill-rule="evenodd"' : '') + '/></svg>';
    }

    function coeurs(rel) {
        var signes = '';
        var sens = [];
        var a = rel.affinite;
        if (typeof a === 'number') {
            if (a > 0) { signes += new Array(a + 1).join(icone('coeur')); sens.push('appréciation ' + a + '/3'); }
            else if (a < 0) { signes += new Array(-a + 1).join(icone('sombre')); sens.push('aversion ' + (-a) + '/3'); }
            else { signes += icone('coeur') + icone('sombre'); sens.push('neutre'); }
        }
        if (rel.respect) { signes += icone('etoile'); sens.push('respect'); }
        if (rel.mort) { signes += icone('crane'); sens.push('décédé(e)'); }
        if (!signes) return '';
        return '<span class="coeurs" role="img" aria-label="' + esc(sens.join(', ')) + '">' + signes + '</span>';
    }

    // Une relation = un chat + l'évolution de son avis (liste « avis », chronologique).
    // Accepte aussi l'ancien format (affinite / respect / texte directement sur le chat).
    function normaliserRelation(r) {
        var o = {};
        Object.keys(r).forEach(function (k) {
            if (k !== 'affinite' && k !== 'respect' && k !== 'texte') o[k] = r[k];
        });
        o.avis = Array.isArray(r.avis) ? r.avis.slice() : [];
        if (!o.avis.length && (r.texte || typeof r.affinite === 'number' || r.respect)) {
            var a = {};
            if (r.lune) a.lune = r.lune;
            if (typeof r.affinite === 'number') a.affinite = r.affinite;
            if (r.respect) a.respect = true;
            if (r.texte) a.texte = r.texte;
            o.avis = [a];
        }
        return o;
    }

    // Rangée de neuf points : pleins = vies actives, vides = vies perdues
    function compteurVies(vies) {
        var actives = vies.filter(function (v) { return v.statut === 'active'; }).length;
        var points = vies.map(function (v) {
            return '<li class="point-vie ' + (v.statut === 'active' ? 'plein' : 'vide') + '"></li>';
        }).join('');
        return '<ul class="points-vies" role="img" aria-label="' + actives + ' vies sur ' + vies.length + '">' + points + '</ul>' +
               '<p class="points-legende">' + actives + ' vies sur ' + vies.length + '</p>';
    }

    window.Outils = {
        esc: esc, urlPhoto: urlPhoto, avatar: avatar, activerAvatars: activerAvatars,
        coeurs: coeurs, icone: icone, normaliserRelation: normaliserRelation, compteurVies: compteurVies
    };
})();
