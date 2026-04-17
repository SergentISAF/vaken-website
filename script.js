// Vaken Landing Page — vaken.dk

(function () {
    'use strict';

    var SUPPORTED_LANGS = ['da', 'no', 'sv', 'fi', 'en'];

    // Detect initial language:
    // 1. User's saved choice (localStorage) if valid
    // 2. Browser language — nordic langs pick themselves
    // 3. Default: English (primary marked er US-engelsk-talende)
    function detectInitialLanguage() {
        try {
            var saved = localStorage.getItem('vaken-lang');
            if (saved && SUPPORTED_LANGS.indexOf(saved) !== -1) return saved;
        } catch (e) { /* localStorage blocked — fortsæt med browser detection */ }

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

    // --- Email signup ---
    var form = document.getElementById('signup-form');
    var successMsg = document.getElementById('signup-success');
    var SIGNUP_API = 'https://claude-code.tail330027.ts.net/api/signup';

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var email = document.getElementById('email-input').value;
            var submitBtn = form.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = '...';

            fetch(SIGNUP_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            })
            .then(function (res) { return res.json(); })
            .then(function (data) {
                form.style.display = 'none';
                if (successMsg) successMsg.classList.add('visible');
            })
            .catch(function () {
                // Fallback: store locally if API is down
                var signups = JSON.parse(localStorage.getItem('vaken-signups') || '[]');
                signups.push({ email: email, date: new Date().toISOString() });
                localStorage.setItem('vaken-signups', JSON.stringify(signups));
                form.style.display = 'none';
                if (successMsg) successMsg.classList.add('visible');
            });
        });
    }

    // --- Smooth reveal on scroll ---
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.manifest-lead, .pledge-item, .feature-card, .audience-item, .story blockquote, .story-body').forEach(function (el) {
        el.classList.add('reveal');
        observer.observe(el);
    });

    // Add reveal CSS dynamically
    var style = document.createElement('style');
    style.textContent = '.reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; } .reveal.visible { opacity: 1; transform: translateY(0); }';
    document.head.appendChild(style);
})();
