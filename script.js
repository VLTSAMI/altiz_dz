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
        // Firebase Config & Init
    const firebaseConfig = {
        apiKey: "AIzaSyCNco6kLvd7CBwVutBqlXbT_1sgsqPWz9s",
        authDomain: "altiz1dz.firebaseapp.com",
        projectId: "altiz1dz",
        storageBucket: "altiz1dz.firebasestorage.app",
        messagingSenderId: "716320058728",
        appId: "1:716320058728:web:54d7fcb0dc72aba8347add"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        // Enable Offline Persistence for faster loading
        firebase.firestore().enablePersistence().catch(err => console.error("Persistence failed", err));
    }
    const db = firebase.firestore();

    function fixDriveUrl(url, type = 'image') {
        if (!url) return "";
        if (url.includes("drive.google.com")) {
            let id = "";
            if (url.includes("/d/")) id = url.split("/d/")[1].split("/")[0];
            else if (url.includes("id=")) id = url.split("id=")[1].split("&")[0];
            if (!id) return url;
            if (type === 'video') return `https://docs.google.com/uc?export=download&id=${id}`;
            if (type === 'preview') return `https://drive.google.com/file/d/${id}/view`;
            return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
        }
        return url;
    }

    const grid = document.getElementById('portfolio-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    let allProjects = [];
    let currentFilter = 'all';

    function renderFilteredProjects() {
        if (!grid) return;
        grid.innerHTML = '';
        
        let filtered = currentFilter === 'all' 
            ? allProjects 
            : allProjects.filter(p => p.category === currentFilter);

        if (filtered.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2rem; opacity: 0.5;">No projects found in this category.</div>`;
            return;
        }

        filtered.slice(0, 6).forEach((p) => {
            const path = fixDriveUrl(p.path, p.type);
            const thumb = fixDriveUrl(p.thumbnail, 'image');
            const preview = fixDriveUrl(p.path, 'preview');
            const displayImage = thumb || path;
            const projectLink = (p.link && p.link !== '#') ? p.link : preview;

            const card = document.createElement('div');
            card.className = 'portfolio-card animate-on-scroll fade-up is-visible';
            card.style = "position: relative; overflow: hidden; border-radius: 16px; aspect-ratio: 16/9; background: #0a0a0a;";
            
            let mediaHtml = p.type === 'video' 
                ? `<video src="${path}" autoplay muted loop playsinline style="width: 100%; height: 100%; object-fit: contain;" poster="${thumb}"></video>`
                : `<img src="${displayImage}" style="width: 100%; height: 100%; object-fit: contain;" loading="lazy">`;

            card.innerHTML = `
                ${mediaHtml}
                <div class="portfolio-overlay" style="position: absolute; inset: 0; padding: 1.5rem; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%); display: flex; flex-direction: column; justify-content: flex-end; opacity: 0; transition: opacity 0.3s ease;">
                    <span style="color: var(--primary-accent); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px;">${p.category}</span>
                    <h3 style="margin: 5px 0 15px; font-size: 1.1rem;">${p.title}</h3>
                    <a href="${projectLink}" target="_blank" style="color: #fff; text-decoration: none; font-size: 0.85rem; display: flex; align-items: center; gap: 5px;">
                        View Project <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                    </a>
                </div>
            `;
            
            card.addEventListener('mouseenter', () => card.querySelector('.portfolio-overlay').style.opacity = '1');
            card.addEventListener('mouseleave', () => card.querySelector('.portfolio-overlay').style.opacity = '0');
            
            grid.appendChild(card);
        });
    }

    if (grid) {
        db.collection("projects").onSnapshot((snapshot) => {
            if (snapshot.metadata.fromCache && snapshot.empty) return;
            
            allProjects = [];
            snapshot.forEach(doc => allProjects.push({ id: doc.id, ...doc.data() }));
            allProjects.sort((a, b) => (a.order || 0) - (b.order || 0));
            
            renderFilteredProjects();
        }, (error) => {
            console.error("Firebase Error:", error);
            grid.innerHTML = '<p style="text-align:center; color:red;">Connection Error. Please refresh.</p>';
        });

        // Filter Button Logic
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => {
                    b.classList.remove('active');
                    b.style.background = 'rgba(255,255,255,0.05)';
                    b.style.color = '#fff';
                });
                btn.classList.add('active');
                btn.style.background = 'var(--primary-accent)';
                btn.style.color = '#000';
                currentFilter = btn.dataset.filter;
                renderFilteredProjects();
            });
        });
    }
} // <--- Added this to properly close renderPortfolio

// Initialize
renderPortfolio();

// Contact Form Logic
const submitBtn = document.getElementById('realSubmitBtn');
if (submitBtn) {
    submitBtn.addEventListener('click', function() {
        const nameInput = document.getElementById('contactName');
        const emailInput = document.getElementById('contactEmail');
        const messageInput = document.getElementById('contactMessage');
        const methodInput = document.querySelector('input[name="method"]:checked');
        
        if (!nameInput.value || !emailInput.value || !messageInput.value) {
            alert("Please fill in all details.");
            return;
        }

        const name = nameInput.value;
        const email = emailInput.value;
        const message = messageInput.value;
        const method = methodInput ? methodInput.value : 'whatsapp';
        
        const myEmail = "altizsolutionsdz@gmail.com";
        const myWhatsApp = "213676184805"; 
        
        const msg = `Hello, I am ${name} (${email}).\n\nProject Details:\n${message}`;

        if (method === 'whatsapp') {
            window.open(`https://wa.me/${myWhatsApp}?text=${encodeURIComponent(msg)}`, '_blank');
        } else {
            window.location.href = `mailto:${myEmail}?subject=Project Inquiry&body=${encodeURIComponent(msg)}`;
        }

        nameInput.value = '';
        emailInput.value = '';
        messageInput.value = '';
    });
}

// Modal Logic
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
