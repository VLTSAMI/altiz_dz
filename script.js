document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       Intersection Observer for Scroll Reveal Animations
       ========================================================================== */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    /* ==========================================================================
       Smooth Scrolling for Anchor Links (polyfill/enhancement)
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Adjust scroll position considering the fixed navbar
                const headerOffset = 80; // matches var(--nav-height)
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    /* ==========================================================================
       Mobile Menu Toggle
       ========================================================================== */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if(mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    /* ==========================================================================
       Pricing Tabs
       ========================================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.pricing-tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       Language Selection (Native Translation System)
       ========================================================================== */
    const langLinks = document.querySelectorAll('.lang-dropdown a, .lang-links-mobile a');
    const langBtnText = document.querySelector('.lang-btn span');
    const langBtn = document.getElementById('lang-btn');
    const langDropdown = document.getElementById('lang-dropdown');

    // Toggle dropdown on click (better for mobile)
    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('active-dropdown');
        });

        // Close dropdown when clicking elsewhere
        document.addEventListener('click', () => {
            langDropdown.classList.remove('active-dropdown');
        });
    }
    
    // Selectors for elements we want to translate
    const translatableSelectors = [
        '.nav-links a', '.btn-cta', '.hero-subtitle', '.tech-badge', 
        '.hero-cta a', '.scroll-indicator p', '.section-title', '.section-desc',
        '.solution-card h3', '.solution-card p', '.tab-btn',
        '.cyber-heading', '.split-title', '.tier-info h4', '.tier-info p', 
        '.tier-price', 'label', '.btn-submit', '.terminal-body p:nth-child(odd)',
        '.terminal-body p.output', '.footer-container p'
    ];

    // Store original english text
    const translatableElements = document.querySelectorAll(translatableSelectors.join(', '));
    translatableElements.forEach(el => {
        // Only target elements directly containing text or specific simple HTML
        if (!el.hasAttribute('data-en')) {
            el.setAttribute('data-en', el.innerHTML.trim());
        }
    });

    // --- Dynamic Pricing System (Static) ---
    function loadLocalPlans() {
        Object.keys(pricingData).forEach(planId => {
            updatePlanUI(planId, pricingData[planId]);
        });
    }

    function updatePlanUI(planId, data) {
        const lang = (localStorage.getItem('selectedLanguage') || 'en').toLowerCase();
        
        // Select the plan card based on child element with data-i18n
        // This requires a stable way to identify each card.
        // Let's add IDs to the cards or use specific logic.
        // For now, we will update the translations object keys dynamically!
        const suffix = lang === 'ar' ? 'ar' : (lang === 'fr' ? 'fr' : 'en');
        
        if (data[`price_${suffix}`]) {
            // We need to know which translation key to override
            // This part needs a map of doc IDs to translation keys
        }
    }

    // Optimized Language Switcher
    function setLanguage(lang) {
        localStorage.setItem('preferredLang', lang);
        document.documentElement.lang = lang;
        
        // Toggle RTL and update button text
        if (lang === 'ar') {
            document.body.classList.add('rtl-layout');
            if (langBtnText) langBtnText.textContent = 'AR';
        } else if (lang === 'fr') {
            document.body.classList.remove('rtl-layout');
            if (langBtnText) langBtnText.textContent = 'FR';
        } else {
            document.body.classList.remove('rtl-layout');
            if (langBtnText) langBtnText.textContent = 'EN';
        }

        // 1. Apply translations via data-i18n (Primary)
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // 2. Fallback: Apply translations via text matching (Secondary)
        translatableElements.forEach(el => {
            if (el.hasAttribute('data-i18n')) return; 
            
            const enText = el.getAttribute('data-en');
            if (lang === 'en') {
                el.innerHTML = enText;
            } else if (translations[lang] && translations[lang][enText]) {
                el.innerHTML = translations[lang][enText];
            }
        });

        // Handle placeholders
        const inputs = document.querySelectorAll('[data-i18n-placeholder]');
        inputs.forEach(input => {
            const key = input.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) {
                input.placeholder = translations[lang][key];
            }
        });

        // Load local overrides after setting base language
        applyLocalOverrides(lang);
    }

    function applyLocalOverrides(lang) {
        Object.keys(pricingData).forEach(planId => {
            const data = pricingData[planId];
            const fields = ['price', 's1_name', 's1_desc'];
            
            fields.forEach(field => {
                const value = data[`${field}_${lang}`] || data[`${field}_en`];
                if (value) {
                    const el = document.querySelector(`[data-plan-id="${planId}"][data-field="${field}"]`);
                    if (el) el.innerHTML = value;
                }
            });
        });
    }
    
    function updateLangUI(langCode) {
        setLanguage(langCode);
    }

    langLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const langCode = link.getAttribute('data-lang');
            updateLangUI(langCode);
            
            // Close mobile menu if open
            if(navLinks) navLinks.classList.remove('active');
        });
    });

    // Initialize from storage
    const savedLang = localStorage.getItem('preferredLang') || 'en';
    setLanguage(savedLang);
    loadLocalPlans();

    /* ==========================================================================
       Portfolio Rendering (Live Firebase)
       ========================================================================== */
    function renderPortfolio() {
        const grid = document.getElementById('portfolio-grid');
        if (!grid) return;

        if (typeof firebase === 'undefined') {
            console.error("Firebase not loaded yet");
            return;
        }

        const db = firebase.firestore();

        // Helper to convert Drive Link
        function fixDriveUrl(url) {
            if (!url) return "";
            if (url.includes("drive.google.com")) {
                const id = url.split("/d/")[1]?.split("/")[0] || url.split("id=")[1]?.split("&")[0];
                return id ? `https://lh3.googleusercontent.com/d/${id}` : url;
            }
            return url;
        }

        db.collection("projects").orderBy("createdAt", "desc").limit(6).onSnapshot((snapshot) => {
            grid.innerHTML = '';
            
            if (snapshot.empty) {
                grid.innerHTML = `<div class="portfolio-empty-state" style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                    <p data-i18n="portfolio_empty">No projects found in database.</p>
                </div>`;
                return;
            }

            snapshot.forEach((doc) => {
                const p = doc.data();
                const path = fixDriveUrl(p.path);
                const thumb = fixDriveUrl(p.thumbnail);

                let mediaHtml = '';
                if (p.type === 'video') {
                    mediaHtml = `<video src="${path}" autoplay muted loop playsinline style="width: 100%; height: 100%; object-fit: cover;" poster="${thumb}"></video>`;
                } else {
                    mediaHtml = `<img src="${path}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">`;
                }

                const projectLink = (p.link && p.link !== '#') ? p.link : path;

                const card = document.createElement('div');
                card.className = 'portfolio-card animate-on-scroll fade-up is-visible';
                card.style.position = 'relative';
                card.style.overflow = 'hidden';
                card.style.borderRadius = '16px';
                card.style.aspectRatio = '16/9';
                card.innerHTML = `
                    ${mediaHtml}
                    <div class="portfolio-overlay" style="position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);">
                        <span class="portfolio-category" style="color: var(--primary-accent); font-size: 0.8rem; text-transform: uppercase;">${p.category}</span>
                        <h3 class="portfolio-title" style="margin: 0.5rem 0;">${p.title}</h3>
                        <a href="${projectLink}" target="_blank" class="portfolio-link" style="color: #fff; text-decoration: none; border-bottom: 1px solid var(--primary-accent); padding-bottom: 2px;">
                            View Project
                        </a>
                    </div>
                `;
                grid.appendChild(card);
                if(observer) observer.observe(card);
            });
        }, (error) => {
            console.error("Home Firebase Error:", error);
        });
    }

    // Call it
    renderPortfolio();

    /* ==========================================================================
       Modal (Removed Cloud Logic)
       ========================================================================== */
    const modal = document.getElementById('samples-modal');
    const closeBtn = document.querySelector('.modal-close');

    if(closeBtn && modal) {
        closeBtn.onclick = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };
        modal.onclick = (e) => {
            if (e.target === modal) closeBtn.onclick();
        };
    }
});
