document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       Intersection Observer for Scroll Reveal Animations
       ========================================================================== */
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    /* ==========================================================================
       Smooth Scrolling
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        });
    });

    /* ==========================================================================
       Mobile Menu
       ========================================================================== */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if(mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => navLinks.classList.toggle('active'));
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }

    /* ==========================================================================
       Pricing Tabs
       ========================================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.pricing-tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            if (targetContent) targetContent.classList.add('active');
        });
    });

    /* ==========================================================================
       Language Selection & Translation System
       ========================================================================== */
    const langLinks = document.querySelectorAll('.lang-dropdown a, .lang-links-mobile a');
    const langBtnText = document.querySelector('.lang-btn span');
    const langBtn = document.getElementById('lang-btn');
    const langDropdown = document.getElementById('lang-dropdown');

    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('active-dropdown');
        });
        document.addEventListener('click', () => langDropdown.classList.remove('active-dropdown'));
    }
    
    const translatableSelectors = [
        '.nav-links a', '.btn-cta', '.hero-subtitle', '.tech-badge', 
        '.hero-cta a', '.scroll-indicator p', '.section-title', '.section-desc',
        '.solution-card h3', '.solution-card p', '.tab-btn',
        '.cyber-heading', '.split-title', '.tier-info h4', '.tier-info p', 
        '.tier-price', 'label', '.btn-submit', '.terminal-body p:nth-child(odd)',
        '.terminal-body p.output', '.footer-container p'
    ];

    const translatableElements = document.querySelectorAll(translatableSelectors.join(', '));
    translatableElements.forEach(el => {
        if (!el.hasAttribute('data-en')) el.setAttribute('data-en', el.innerHTML.trim());
    });

    // --- Dynamic Sync Engine (Firestore) ---
    function applyLocalOverrides(lang) {
        // Use window.pricingData from pricing_data.js and window.activePricingData from Firestore
        const baseData = window.pricingData || {};
        const cloudData = window.activePricingData || {};
        const combined = { ...baseData, ...cloudData };
        
        Object.keys(combined).forEach(planId => {
            const data = combined[planId];
            const fields = ['price', 's1_name', 's1_desc'];
            
            fields.forEach(field => {
                const value = data[`${field}_${lang}`] || data[`${field}_en`];
                if (value) {
                    const elements = document.querySelectorAll(`[data-plan-id="${planId}"][data-field="${field}"]`);
                    elements.forEach(el => {
                        el.innerHTML = value;
                        el.setAttribute('data-sync-active', 'true');
                    });
                }
            });
        });
    }

    function initPricingSystem() {
        if (typeof firebase === 'undefined') return;
        // Use global db if available, else get from firebase
        const firestore = (typeof db !== 'undefined') ? db : firebase.firestore();

        firestore.collection("plans").onSnapshot(snap => {
            const cloudPlans = {};
            snap.forEach(doc => { cloudPlans[doc.id] = doc.data(); });
            window.activePricingData = cloudPlans;
            
            const currentLang = localStorage.getItem('preferredLang') || 'en';
            applyLocalOverrides(currentLang);
        });
    }

    function setLanguage(lang) {
        localStorage.setItem('preferredLang', lang);
        document.documentElement.lang = lang;
        
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

        // Apply translations
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // Fallback translation
        translatableElements.forEach(el => {
            if (el.hasAttribute('data-i18n')) return; 
            const enText = el.getAttribute('data-en');
            if (lang === 'en') el.innerHTML = enText;
            else if (translations[lang] && translations[lang][enText]) el.innerHTML = translations[lang][enText];
        });

        const inputs = document.querySelectorAll('[data-i18n-placeholder]');
        inputs.forEach(input => {
            const key = input.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) input.placeholder = translations[lang][key];
        });

        // Override with dynamic cloud data
        applyLocalOverrides(lang);
    }
    
    langLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            setLanguage(link.getAttribute('data-lang'));
            if(navLinks) navLinks.classList.remove('active');
        });
    });

    // Initialize
    const initialLang = localStorage.getItem('preferredLang') || 'en';
    setLanguage(initialLang);
    initPricingSystem();

    /* ==========================================================================
       Portfolio Rendering
       ========================================================================== */
    function renderPortfolio() {
        if (typeof firebase === 'undefined') return;
        const firestore = (typeof db !== 'undefined') ? db : firebase.firestore();
        const grid = document.getElementById('portfolio-grid');
        if (!grid) return;

        firestore.collection("projects").onSnapshot(snapshot => {
            grid.innerHTML = '';
            const projects = [];
            snapshot.forEach(doc => projects.push({ id: doc.id, ...doc.data() }));
            projects.sort((a, b) => (a.order || 0) - (b.order || 0));

            projects.slice(0, 6).forEach(p => {
                const path = p.path && p.path.includes("drive.google.com") 
                    ? `https://docs.google.com/uc?export=download&id=${p.path.split("/d/")[1]?.split("/")[0] || p.path.split("id=")[1]?.split("&")[0]}`
                    : p.path;
                const thumb = p.thumbnail && p.thumbnail.includes("drive.google.com")
                    ? `https://drive.google.com/thumbnail?id=${p.thumbnail.split("/d/")[1]?.split("/")[0] || p.thumbnail.split("id=")[1]?.split("&")[0]}&sz=w1000`
                    : (p.thumbnail || path);

                const card = document.createElement('div');
                card.className = 'portfolio-card animate-on-scroll fade-up is-visible';
                card.style = "position: relative; overflow: hidden; border-radius: 16px; aspect-ratio: 16/9; background: #0a0a0a;";
                
                let mediaHtml = p.type === 'video' 
                    ? `<video src="${path}" autoplay muted loop playsinline style="width: 100%; height: 100%; object-fit: cover;" poster="${thumb}"></video>`
                    : `<img src="${thumb}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">`;

                card.innerHTML = `
                    ${mediaHtml}
                    <div class="portfolio-overlay" style="position: absolute; inset: 0; padding: 1.5rem; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%); display: flex; flex-direction: column; justify-content: flex-end; opacity: 0; transition: opacity 0.3s ease;">
                        <span style="color: var(--primary-accent); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px;">${p.category}</span>
                        <h3 style="margin: 5px 0 15px; font-size: 1.1rem;">${p.title}</h3>
                        <a href="${p.link || '#'}" target="_blank" style="color: #fff; text-decoration: none; font-size: 0.85rem; display: flex; align-items: center; gap: 5px;">
                            View Project <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                        </a>
                    </div>`;
                
                card.addEventListener('mouseenter', () => card.querySelector('.portfolio-overlay').style.opacity = '1');
                card.addEventListener('mouseleave', () => card.querySelector('.portfolio-overlay').style.opacity = '0');
                grid.appendChild(card);
            });
        });
    }
    renderPortfolio();

    /* ==========================================================================
       Contact Form
       ========================================================================== */
    const submitBtn = document.getElementById('realSubmitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const message = document.getElementById('contactMessage').value;
            const method = document.querySelector('input[name="method"]:checked')?.value || 'whatsapp';
            if (!name || !email || !message) return alert("Please fill all fields.");
            const msg = `Inquiry from ${name}\nNode: ${email}\n\nPayload:\n${message}`;
            if (method === 'whatsapp') window.open(`https://wa.me/213676184805?text=${encodeURIComponent(msg)}`, '_blank');
            else window.location.href = `mailto:altizsolutionsdz@gmail.com?subject=Inquiry from ${name}&body=${encodeURIComponent(msg)}`;
        });
    }
});
