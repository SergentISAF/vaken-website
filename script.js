// Vaken Landing Page, vaken.dk

(function () {
    'use strict';

    var SUPPORTED_LANGS = ['da', 'no', 'sv', 'fi', 'en'];

    // Detect initial language:
    // 0. ?lang= in the URL
    // 1. User's saved choice (localStorage) if valid
    // 2. Browser language, nordic langs pick themselves
    // 3. Default: English (primary marked er US-engelsk-talende)
    function detectInitialLanguage() {
        // An explicit ?lang= in the address wins (hreflang and shared links).
        var fromUrl = new URLSearchParams(window.location.search).get('lang');
        if (fromUrl && SUPPORTED_LANGS.indexOf(fromUrl) !== -1) return fromUrl;
        try {
            var saved = localStorage.getItem('vaken-lang');
            if (saved && SUPPORTED_LANGS.indexOf(saved) !== -1) return saved;
        } catch (e) { /* localStorage blocked, fortsæt med browser detection */ }

        var browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
        if (browserLang.indexOf('da') === 0) return 'da';
        if (browserLang.indexOf('nb') === 0 || browserLang.indexOf('nn') === 0 || browserLang.indexOf('no') === 0) return 'no';
        if (browserLang.indexOf('sv') === 0) return 'sv';
        if (browserLang.indexOf('fi') === 0) return 'fi';
        return 'en';
    }

    var currentLang = detectInitialLanguage();

    // --- Language switching ---
    function switchLang(lang) {
        if (SUPPORTED_LANGS.indexOf(lang) === -1) return;
        currentLang = lang;
        document.documentElement.lang = lang === 'no' ? 'nb' : lang;

        try { localStorage.setItem('vaken-lang', lang); } catch (e) { /* ignore */ }

        // Update all translatable elements
        document.querySelectorAll('[data-' + lang + ']').forEach(function (el) {
            var text = el.getAttribute('data-' + lang);
            if (text) el.innerHTML = text;
        });

        // Update placeholders
        document.querySelectorAll('[data-' + lang + '-placeholder]').forEach(function (el) {
            var ph = el.getAttribute('data-' + lang + '-placeholder');
            if (ph) el.placeholder = ph;
        });

        // Update active button
        document.querySelectorAll('.lang-btn').forEach(function (btn) {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Update phase label
        updatePhaseLabel();
    }

    // Apply detected language immediately (overrides HTML defaults)
    switchLang(currentLang);

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            switchLang(this.dataset.lang);
        });
    });

    // --- Breathing phase indicator ---
    var phaseLabel = document.getElementById('phase-label');
    var phaseTimer = document.getElementById('phase-timer');
    var inhaleTime = 3000; // 3s
    var exhaleTime = 5000; // 5s
    var cycleTime = inhaleTime + exhaleTime;
    var startTime = Date.now();

    function updatePhaseLabel() {
        var elapsed = (Date.now() - startTime) % cycleTime;
        var isInhale = elapsed < inhaleTime;

        if (phaseLabel) {
            var inWord = phaseLabel.getAttribute('data-' + currentLang + '-in') || 'Ind';
            var outWord = phaseLabel.getAttribute('data-' + currentLang + '-out') || 'Ud';
            phaseLabel.textContent = isInhale ? inWord : outWord;
        }

        if (phaseTimer) {
            var phaseElapsed = isInhale ? elapsed : elapsed - inhaleTime;
            var phaseDuration = isInhale ? inhaleTime : exhaleTime;
            var remaining = Math.ceil((phaseDuration - phaseElapsed) / 1000);
            phaseTimer.textContent = remaining;
        }

        requestAnimationFrame(updatePhaseLabel);
    }

    updatePhaseLabel();

    // --- App Store campaign link ---
    // Tags the App Store buttons with a campaign name so installs can be
    // attributed in App Store Connect. Nothing is stored in the browser:
    // the source is read from the page URL and written to the links only.
    (function tagAppStoreLinks() {
        var params = new URLSearchParams(window.location.search);
        var campaign = params.get('utm_campaign');
        var source = params.get('utm_source');
        var ct = 'web-vaken';
        if (source === 'facebook' && campaign === 'vaken-okt26') ct = 'fb-vaken-okt26';
        document.querySelectorAll('a[href^="https://apps.apple.com/app/id6762458404"]').forEach(function (a) {
            a.href = 'https://apps.apple.com/app/apple-store/id6762458404?pt=128792757&ct=' + ct + '&mt=8';
        });
    })();
})();
