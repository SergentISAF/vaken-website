/*!
 * Cookie consent banner — GDPR/ePrivacy compliant
 * Datatilsynets krav: ligeværdig accept/afvis, ingen pre-check, trækbart tilbage
 *
 * Site-specifik config sættes FØR scriptet indlæses:
 *   window.COOKIE_CONSENT_CONFIG = {
 *     privacyUrl: '/privacy',
 *     services: {
 *       'google-fonts': {
 *         label: { da: 'Google Fonts', en: 'Google Fonts', ... },
 *         description: { da: '...', en: '...', ... },
 *         onAccept: function () { ...load resource... }
 *       }
 *     },
 *     detectLang: function() { return 'da'; }   // optional
 *   };
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'cookie_consent_v1';
    var POLICY_VERSION = '2026-04-23';
    var SUPPORTED = ['da', 'no', 'sv', 'fi', 'en'];

    var config = window.COOKIE_CONSENT_CONFIG || {};
    var services = config.services || {};
    var privacyUrl = config.privacyUrl || '/privacy';

    var I18N = {
        da: {
            bannerTitle: 'Vi respekterer dit privatliv',
            bannerBody: 'Denne side bruger valgfrie tredjeparts-tjenester. Intet aktiveres uden dit samtykke. Nødvendige cookies (fx sprogvalg) bruges altid — se privatlivspolitikken for detaljer.',
            acceptAll: 'Accepter alle',
            rejectAll: 'Afvis alle',
            customize: 'Tilpas',
            save: 'Gem valg',
            close: 'Luk',
            settingsTitle: 'Cookie-indstillinger',
            settingsIntro: 'Her kan du vælge hvilke tredjeparts-tjenester du tillader. Dit valg gemmes i din browser og kan ændres når som helst.',
            necessaryLabel: 'Nødvendige',
            necessaryDesc: 'Kræves for at siden fungerer (fx sprogvalg og samtykkelagring). Kan ikke fravælges.',
            alwaysOn: 'Altid aktiv',
            privacyLink: 'Privatlivspolitik',
            settingsLink: 'Cookie-indstillinger',
            placeholderText: 'Denne funktion kræver dit samtykke.',
            placeholderButton: 'Aktiver',
            version: 'Version'
        },
        no: {
            bannerTitle: 'Vi respekterer personvernet ditt',
            bannerBody: 'Denne siden bruker valgfrie tredjepartstjenester. Ingenting aktiveres uten ditt samtykke. Nødvendige cookies (f.eks. språkvalg) brukes alltid — se personvernerklæringen for detaljer.',
            acceptAll: 'Godta alle',
            rejectAll: 'Avvis alle',
            customize: 'Tilpass',
            save: 'Lagre valg',
            close: 'Lukk',
            settingsTitle: 'Cookie-innstillinger',
            settingsIntro: 'Her kan du velge hvilke tredjepartstjenester du tillater. Valget ditt lagres i nettleseren og kan endres når som helst.',
            necessaryLabel: 'Nødvendige',
            necessaryDesc: 'Kreves for at siden skal fungere (f.eks. språkvalg og samtykkelagring). Kan ikke velges bort.',
            alwaysOn: 'Alltid aktiv',
            privacyLink: 'Personvernerklæring',
            settingsLink: 'Cookie-innstillinger',
            placeholderText: 'Denne funksjonen krever ditt samtykke.',
            placeholderButton: 'Aktiver',
            version: 'Versjon'
        },
        sv: {
            bannerTitle: 'Vi respekterar din integritet',
            bannerBody: 'Denna sida använder valfria tredjepartstjänster. Inget aktiveras utan ditt samtycke. Nödvändiga cookies (t.ex. språkval) används alltid — se integritetspolicyn för detaljer.',
            acceptAll: 'Acceptera alla',
            rejectAll: 'Avvisa alla',
            customize: 'Anpassa',
            save: 'Spara val',
            close: 'Stäng',
            settingsTitle: 'Cookie-inställningar',
            settingsIntro: 'Här kan du välja vilka tredjepartstjänster du tillåter. Ditt val sparas i webbläsaren och kan ändras när som helst.',
            necessaryLabel: 'Nödvändiga',
            necessaryDesc: 'Krävs för att sidan ska fungera (t.ex. språkval och samtyckeslagring). Kan inte väljas bort.',
            alwaysOn: 'Alltid aktiv',
            privacyLink: 'Integritetspolicy',
            settingsLink: 'Cookie-inställningar',
            placeholderText: 'Denna funktion kräver ditt samtycke.',
            placeholderButton: 'Aktivera',
            version: 'Version'
        },
        fi: {
            bannerTitle: 'Kunnioitamme yksityisyyttäsi',
            bannerBody: 'Tämä sivu käyttää valinnaisia kolmannen osapuolen palveluita. Mitään ei aktivoida ilman suostumustasi. Välttämättömiä evästeitä (esim. kielivalinta) käytetään aina — katso yksityisyydensuoja lisätiedoista.',
            acceptAll: 'Hyväksy kaikki',
            rejectAll: 'Hylkää kaikki',
            customize: 'Mukauta',
            save: 'Tallenna valinnat',
            close: 'Sulje',
            settingsTitle: 'Evästeasetukset',
            settingsIntro: 'Voit valita, mitä kolmannen osapuolen palveluita sallit. Valintasi tallennetaan selaimeen ja voit muuttaa sitä milloin tahansa.',
            necessaryLabel: 'Välttämättömät',
            necessaryDesc: 'Vaaditaan sivun toimintaan (esim. kielivalinta ja suostumuksen tallennus). Ei voi poistaa käytöstä.',
            alwaysOn: 'Aina käytössä',
            privacyLink: 'Yksityisyydensuoja',
            settingsLink: 'Evästeasetukset',
            placeholderText: 'Tämä toiminto vaatii suostumuksesi.',
            placeholderButton: 'Ota käyttöön',
            version: 'Versio'
        },
        en: {
            bannerTitle: 'We respect your privacy',
            bannerBody: 'This site uses optional third-party services. Nothing is enabled without your consent. Necessary cookies (e.g. language choice) are always used — see the privacy policy for details.',
            acceptAll: 'Accept all',
            rejectAll: 'Reject all',
            customize: 'Customize',
            save: 'Save choice',
            close: 'Close',
            settingsTitle: 'Cookie settings',
            settingsIntro: 'Choose which third-party services you allow. Your choice is stored in your browser and can be changed at any time.',
            necessaryLabel: 'Necessary',
            necessaryDesc: 'Required for the site to function (e.g. language choice and consent storage). Cannot be disabled.',
            alwaysOn: 'Always on',
            privacyLink: 'Privacy policy',
            settingsLink: 'Cookie settings',
            placeholderText: 'This feature requires your consent.',
            placeholderButton: 'Enable',
            version: 'Version'
        }
    };

    function defaultDetectLang() {
        try {
            var stored = localStorage.getItem('vaken-lang') ||
                         localStorage.getItem('holmstadgroup_lang') ||
                         localStorage.getItem('lang');
            if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
        } catch (e) {}
        var htmlLang = (document.documentElement.lang || '').toLowerCase();
        if (htmlLang.indexOf('da') === 0) return 'da';
        if (htmlLang.indexOf('nb') === 0 || htmlLang.indexOf('nn') === 0 || htmlLang.indexOf('no') === 0) return 'no';
        if (htmlLang.indexOf('sv') === 0) return 'sv';
        if (htmlLang.indexOf('fi') === 0) return 'fi';
        var browserLang = (navigator.language || 'en').toLowerCase();
        if (browserLang.indexOf('da') === 0) return 'da';
        if (browserLang.indexOf('nb') === 0 || browserLang.indexOf('nn') === 0 || browserLang.indexOf('no') === 0) return 'no';
        if (browserLang.indexOf('sv') === 0) return 'sv';
        if (browserLang.indexOf('fi') === 0) return 'fi';
        return 'en';
    }

    var detectLang = config.detectLang || defaultDetectLang;
    function t() { return I18N[detectLang()] || I18N.en; }

    function localizedValue(obj, fallback) {
        if (!obj) return fallback || '';
        if (typeof obj === 'string') return obj;
        return obj[detectLang()] || obj.en || obj.da || fallback || '';
    }

    function getConsent() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            var parsed = JSON.parse(raw);
            if (parsed.version !== POLICY_VERSION) return null;
            return parsed;
        } catch (e) { return null; }
    }

    function saveConsent(choices) {
        var data = {
            version: POLICY_VERSION,
            timestamp: new Date().toISOString(),
            choices: choices
        };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
        applyConsent(choices);
        hideBanner();
        hideSettings();
    }

    function applyConsent(choices) {
        Object.keys(services).forEach(function (key) {
            var svc = services[key];
            if (choices[key] && !svc._loaded) {
                try {
                    if (typeof svc.onAccept === 'function') svc.onAccept();
                    svc._loaded = true;
                    document.querySelectorAll('[data-consent-placeholder="' + key + '"]').forEach(function (el) {
                        el.style.display = 'none';
                    });
                    document.querySelectorAll('[data-consent-gated="' + key + '"]').forEach(function (el) {
                        el.style.display = '';
                    });
                } catch (e) { /* swallow — don't break page */ }
            }
        });
        try {
            document.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: choices }));
        } catch (e) {}
    }

    function el(tag, attrs, children) {
        var node = document.createElement(tag);
        if (attrs) Object.keys(attrs).forEach(function (k) {
            if (k === 'class') node.className = attrs[k];
            else if (k === 'html') node.innerHTML = attrs[k];
            else if (k === 'text') node.textContent = attrs[k];
            else if (k === 'onclick') node.addEventListener('click', attrs[k]);
            else node.setAttribute(k, attrs[k]);
        });
        (children || []).forEach(function (c) {
            if (c) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
        });
        return node;
    }

    var bannerEl = null;
    var settingsEl = null;

    function buildBanner() {
        var L = t();
        bannerEl = el('div', { class: 'cc-banner', role: 'dialog', 'aria-live': 'polite', 'aria-label': L.bannerTitle });
        var inner = el('div', { class: 'cc-banner-inner' });
        inner.appendChild(el('h2', { class: 'cc-banner-title', text: L.bannerTitle }));
        inner.appendChild(el('p', { class: 'cc-banner-body', text: L.bannerBody }));
        var actions = el('div', { class: 'cc-banner-actions' });
        actions.appendChild(el('button', { class: 'cc-btn cc-btn-accept', type: 'button', text: L.acceptAll, onclick: acceptAll }));
        actions.appendChild(el('button', { class: 'cc-btn cc-btn-reject', type: 'button', text: L.rejectAll, onclick: rejectAll }));
        actions.appendChild(el('button', { class: 'cc-btn cc-btn-link', type: 'button', text: L.customize, onclick: showSettings }));
        inner.appendChild(actions);
        var links = el('div', { class: 'cc-banner-links' });
        var a = el('a', { href: privacyUrl, text: L.privacyLink });
        links.appendChild(a);
        inner.appendChild(links);
        bannerEl.appendChild(inner);
        document.body.appendChild(bannerEl);
    }

    function showBanner() {
        if (!bannerEl) buildBanner();
        bannerEl.classList.add('cc-visible');
    }
    function hideBanner() {
        if (bannerEl) bannerEl.classList.remove('cc-visible');
    }

    function buildSettings() {
        var L = t();
        var existing = getConsent();
        var current = existing ? existing.choices : {};

        settingsEl = el('div', { class: 'cc-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'cc-settings-title' });
        var dialog = el('div', { class: 'cc-modal-dialog' });
        var header = el('div', { class: 'cc-modal-header' });
        header.appendChild(el('h2', { class: 'cc-modal-title', id: 'cc-settings-title', text: L.settingsTitle }));
        header.appendChild(el('button', { class: 'cc-modal-close', type: 'button', 'aria-label': L.close, html: '&times;', onclick: hideSettings }));
        dialog.appendChild(header);
        dialog.appendChild(el('p', { class: 'cc-modal-intro', text: L.settingsIntro }));

        var list = el('div', { class: 'cc-cat-list' });

        // Necessary (always on)
        var necRow = el('div', { class: 'cc-cat' });
        var necHead = el('div', { class: 'cc-cat-head' });
        necHead.appendChild(el('div', { class: 'cc-cat-title', text: L.necessaryLabel }));
        necHead.appendChild(el('div', { class: 'cc-cat-badge', text: L.alwaysOn }));
        necRow.appendChild(necHead);
        necRow.appendChild(el('p', { class: 'cc-cat-desc', text: L.necessaryDesc }));
        list.appendChild(necRow);

        // Optional services
        var toggles = {};
        Object.keys(services).forEach(function (key) {
            var svc = services[key];
            var row = el('div', { class: 'cc-cat' });
            var head = el('div', { class: 'cc-cat-head' });
            head.appendChild(el('div', { class: 'cc-cat-title', text: localizedValue(svc.label, key) }));

            var switchWrap = el('label', { class: 'cc-switch' });
            var input = el('input', { type: 'checkbox' });
            if (current[key]) input.checked = true;
            toggles[key] = input;
            switchWrap.appendChild(input);
            switchWrap.appendChild(el('span', { class: 'cc-switch-slider' }));
            head.appendChild(switchWrap);
            row.appendChild(head);
            row.appendChild(el('p', { class: 'cc-cat-desc', text: localizedValue(svc.description, '') }));
            list.appendChild(row);
        });
        dialog.appendChild(list);

        var footer = el('div', { class: 'cc-modal-actions' });
        footer.appendChild(el('button', { class: 'cc-btn cc-btn-reject', type: 'button', text: L.rejectAll, onclick: rejectAll }));
        footer.appendChild(el('button', { class: 'cc-btn cc-btn-accept', type: 'button', text: L.acceptAll, onclick: acceptAll }));
        footer.appendChild(el('button', { class: 'cc-btn cc-btn-save', type: 'button', text: L.save, onclick: function () {
            var choices = {};
            Object.keys(toggles).forEach(function (k) { choices[k] = toggles[k].checked; });
            saveConsent(choices);
        }}));
        dialog.appendChild(footer);

        dialog.appendChild(el('div', { class: 'cc-modal-version', text: L.version + ': ' + POLICY_VERSION }));
        settingsEl.appendChild(dialog);
        settingsEl.addEventListener('click', function (e) {
            if (e.target === settingsEl) hideSettings();
        });
        document.body.appendChild(settingsEl);
    }

    function showSettings() {
        if (settingsEl) settingsEl.parentNode.removeChild(settingsEl);
        buildSettings();
        settingsEl.classList.add('cc-visible');
    }
    function hideSettings() {
        if (settingsEl) settingsEl.classList.remove('cc-visible');
    }

    function acceptAll() {
        var choices = {};
        Object.keys(services).forEach(function (k) { choices[k] = true; });
        saveConsent(choices);
    }
    function rejectAll() {
        var choices = {};
        Object.keys(services).forEach(function (k) { choices[k] = false; });
        saveConsent(choices);
    }

    function ensureSettingsLink() {
        if (document.querySelector('[data-cc-settings-link]')) return;
    }

    function init() {
        var existing = getConsent();
        if (existing) {
            applyConsent(existing.choices);
        } else {
            showBanner();
        }
        ensureSettingsLink();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.CookieConsent = {
        get: getConsent,
        openSettings: showSettings,
        revoke: function () {
            try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
            location.reload();
        }
    };

    // Click-handler for alle <a data-cc-open-settings> elementer
    document.addEventListener('click', function (e) {
        var target = e.target.closest && e.target.closest('[data-cc-open-settings]');
        if (target) { e.preventDefault(); showSettings(); }
    });
})();
