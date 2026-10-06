document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       01 - Interactive Hero Cyber Particles Canvas (Cyberpunk Constellation)
       ========================================================================== */
    function initHeroParticles() {
        const canvas = document.getElementById('hero-particles');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.parentElement.offsetWidth;
        let height = canvas.height = canvas.parentElement.offsetHeight;

        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 35 : 75;
        const maxDistance = isMobile ? 90 : 130;
        const particles = [];

        const mouse = {
            x: null,
            y: null,
            radius: 140
        };

        window.addEventListener('resize', () => {
            if (!canvas.parentElement) return;
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
        });

        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            } else {
                mouse.x = null;
                mouse.y = null;
            }
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 1;
                this.baseX = this.x;
                this.baseY = this.y;
                this.speedX = (Math.random() - 0.5) * 0.8;
                this.speedY = (Math.random() - 0.5) * 0.8;
                this.density = (Math.random() * 20) + 5;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = '#22c55e';
                ctx.shadowBlur = 8;
                ctx.shadowColor = 'rgba(34, 197, 94, 0.8)';
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            update() {
                // Border collision bounce
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > width) this.speedX = -this.speedX;
                if (this.y < 0 || this.y > height) this.speedY = -this.speedY;

                // Mouse interaction repulsion
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouse.radius) {
                        const forceDirectionX = dx / dist;
                        const forceDirectionY = dy / dist;
                        const maxDistance = mouse.radius;
                        const force = (maxDistance - dist) / maxDistance;
                        const directionX = forceDirectionX * force * this.density * 0.5;
                        const directionY = forceDirectionY * force * this.density * 0.5;

                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function connect() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDistance) {
                        const alpha = (1 - (dist / maxDistance)) * 0.25;
                        ctx.strokeStyle = `rgba(34, 197, 94, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        let isHeroVisible = true;
        let animationFrameId;
        function animate() {
            if (!isHeroVisible) return;
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            connect();
            animationFrameId = requestAnimationFrame(animate);
        }

        const heroObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                isHeroVisible = entry.isIntersecting;
                if (isHeroVisible) {
                    cancelAnimationFrame(animationFrameId);
                    animate();
                }
            });
        }, { threshold: 0.05 });
        heroObserver.observe(canvas);

        animate();
    }
    initHeroParticles();

    /* ==========================================================================
       Scroll Reveal Animations (Silk Motion System)
       ========================================================================== */
    const observerOptions = { root: null, rootMargin: '0px 0px -40px 0px', threshold: 0.05 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
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
            if (targetId === '#') return;
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
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', String(isActive));
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ==========================================================================
       Pricing Tabs
       ========================================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.pricing-tab-content');

    tabBtns.forEach(btn => {
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', btn.classList.contains('active') ? 'true' : 'false');
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
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
        '.terminal-body p.output', '.footer-container p',
        '.stat-label', '.category-card-desc', '.card-cta-btn',
        '.faq-question span', '.faq-answer p'
    ];

    const translatableElements = document.querySelectorAll(translatableSelectors.join(', '));
    translatableElements.forEach(el => {
        if (!el.hasAttribute('data-en')) el.setAttribute('data-en', el.innerHTML.trim());
    });

    /* ==========================================================================
       02 - Unified Pricing Engine (Firestore First + Fast localStorage Cache)
       Eliminates pricing_data.js dependency permanently
       ========================================================================== */
    const DEFAULT_PRICING = {
        "visual_identity_basic": {
            "price_en": "2,000 DZD", "price_ar": "2,000 د.ج", "price_fr": "2,000 DZD",
            "s1_name_en": "Logo Design", "s1_name_ar": "تصميم شعار", "s1_name_fr": "Design de Logo",
            "s1_desc_en": "1 Concept, PNG/JPG format.", "s1_desc_ar": "مفهوم واحد، صيغة PNG/JPG.", "s1_desc_fr": "1 Concept, format PNG/JPG."
        },
        "visual_identity_pro": {
            "price_en": "4,000 DZD", "price_ar": "4,000 د.ج", "price_fr": "4,000 DZD",
            "s1_name_en": "Logo Design", "s1_name_ar": "تصميم شعار", "s1_name_fr": "Design de Logo",
            "s1_desc_en": "3 Concepts, Vector files.", "s1_desc_ar": "3 مفاهيم، ملفات Vector.", "s1_desc_fr": "3 Concepts, fichiers Vector."
        },
        "video_production_basic": {
            "price_en": "8,000 DZD", "price_ar": "8,000 د.ج", "price_fr": "8,000 DZD",
            "s1_name_en": "3 Reels", "s1_name_ar": "3 فيديوهات ريلز", "s1_name_fr": "3 Reels",
            "s1_desc_en": "Standard editing.", "s1_desc_ar": "مونتاج قياسي.", "s1_desc_fr": "Montage standard."
        },
        "video_production_pro": {
            "price_en": "12,000 DZD", "price_ar": "12,000 د.ج", "price_fr": "12,000 DZD",
            "s1_name_en": "3 Reels", "s1_name_ar": "3 فيديوهات ريلز", "s1_name_fr": "3 Reels",
            "s1_desc_en": "Cinematic VFX.", "s1_desc_ar": "مؤثرات سينمائية.", "s1_desc_fr": "VFX Cinématographique."
        },
        "digital_strategy_basic": {
            "price_en": "From $10", "price_ar": "من 10 دولار", "price_fr": "À partir de 10$",
            "s1_name_en": "Sponsored Ads", "s1_name_ar": "إعلانات ممولة", "s1_name_fr": "Publicités Sponsorisées",
            "s1_desc_en": "Standard targeting.", "s1_desc_ar": "استهداف قياسي.", "s1_desc_fr": "Ciblage standard."
        },
        "digital_strategy_pro": {
            "price_en": "From $30", "price_ar": "من 30 دولار", "price_fr": "À partir de 30$",
            "s1_name_en": "Sponsored Ads", "s1_name_ar": "إعلانات ممولة", "s1_name_fr": "Publicités Sponsorisées",
            "s1_desc_en": "Advanced A/B testing.", "s1_desc_ar": "اختبار A/B متقدم.", "s1_desc_fr": "Tests A/B avancés."
        },
        "web_dev_landing": {
            "price_en": "Starting from 15,000 DZD", "price_ar": "بداية من 15,000 د.ج", "price_fr": "À partir de 15,000 DZD",
            "s1_name_en": "Landing Page", "s1_name_ar": "صفحة هبوط", "s1_name_fr": "Landing Page",
            "s1_desc_en": "High-conversion page.", "s1_desc_ar": "صفحة عالية التحويل.", "s1_desc_fr": "Page haute conversion."
        },
        "web_dev_business": {
            "price_en": "Starting from 35,000 DZD", "price_ar": "بداية من 35,000 د.ج", "price_fr": "À partir de 35,000 DZD",
            "s1_name_en": "Multi-Page Site", "s1_name_ar": "موقع متعدد الصفحات", "s1_name_fr": "Site Multi-Pages",
            "s1_desc_en": "5-10 professional pages.", "s1_desc_ar": "5-10 صفحات احترافية.", "s1_desc_fr": "5-10 pages professionnelles."
        },
        "web_dev_ecommerce": {
            "price_en": "Starting from 60,000 DZD", "price_ar": "بداية من 60,000 د.ج", "price_fr": "À partir de 60,000 DZD",
            "s1_name_en": "Online Store", "s1_name_ar": "متجر إلكتروني", "s1_name_fr": "Boutique en Ligne",
            "s1_desc_en": "Inventory & payments.", "s1_desc_ar": "إدارة المخزون والمدفوعات.", "s1_desc_fr": "Inventaire et paiements."
        },
        "web_dev_custom": {
            "price_en": "Custom", "price_ar": "حسب الطلب", "price_fr": "Sur Mesure",
            "s1_name_en": "Bespoke Software", "s1_name_ar": "برمجيات مخصصة", "s1_name_fr": "Logiciel sur Mesure",
            "s1_desc_en": "Custom logic & platform.", "s1_desc_ar": "منطق مخصص ومنصة خاصة.", "s1_desc_fr": "Logique personnalisée."
        }
    };

    function getCachedPricing() {
        try {
            const raw = localStorage.getItem('altiz_pricing_cache');
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function savePricingCache(data) {
        try {
            localStorage.setItem('altiz_pricing_cache', JSON.stringify(data));
        } catch (e) {}
    }

    function applyPricingOverrides(lang) {
        const cloudData = window.activePricingData || getCachedPricing() || DEFAULT_PRICING;
        
        Object.keys(cloudData).forEach(planId => {
            const data = cloudData[planId];
            if (!data) return;
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
        // Step 1: Immediate instant paint from cache
        window.activePricingData = getCachedPricing() || DEFAULT_PRICING;
        applyPricingOverrides(localStorage.getItem('preferredLang') || 'en');

        // Step 2: Live Sync with Firestore
        if (typeof firebase === 'undefined') return;
        const firestore = firebase.firestore();

        firestore.collection("plans").onSnapshot(snap => {
            const cloudPlans = {};
            snap.forEach(doc => { cloudPlans[doc.id] = doc.data(); });
            
            // Merge with default to ensure no missing keys
            const merged = { ...DEFAULT_PRICING, ...cloudPlans };
            window.activePricingData = merged;
            savePricingCache(merged);
            applyPricingOverrides(localStorage.getItem('preferredLang') || 'en');
        }, err => {
            console.warn("Pricing live listener using cached fallback:", err);
        });
    }

    function setLanguage(lang) {
        localStorage.setItem('preferredLang', lang);
        document.documentElement.lang = lang;
        
        if (lang === 'ar') {
            document.body.classList.add('rtl-layout');
            document.documentElement.dir = 'rtl';
            if (langBtnText) langBtnText.textContent = 'AR';
        } else if (lang === 'fr') {
            document.body.classList.remove('rtl-layout');
            document.documentElement.dir = 'ltr';
            if (langBtnText) langBtnText.textContent = 'FR';
        } else {
            document.body.classList.remove('rtl-layout');
            document.documentElement.dir = 'ltr';
            if (langBtnText) langBtnText.textContent = 'EN';
        }

        // Apply translations
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
                el.removeAttribute('data-sync-active');
            }
        });

        // Fallback translation
        translatableElements.forEach(el => {
            if (el.hasAttribute('data-i18n')) return; 
            const enText = el.getAttribute('data-en');
            if (lang === 'en') el.innerHTML = enText;
            else if (translations[lang] && translations[lang][enText]) el.innerHTML = translations[lang][enText];
            el.removeAttribute('data-sync-active');
        });

        const inputs = document.querySelectorAll('[data-i18n-placeholder]');
        inputs.forEach(input => {
            const key = input.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) input.placeholder = translations[lang][key];
        });

        // Always re-apply live pricing overrides
        applyPricingOverrides(lang);
    }
    
    langLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            setLanguage(link.getAttribute('data-lang'));
            if (navLinks) navLinks.classList.remove('active');
        });
    });

    const initialLang = localStorage.getItem('preferredLang') || 'en';
    setLanguage(initialLang);
    initPricingSystem();

    /* ==========================================================================
       03 - Trust Building: Interactive FAQ Accordion
       ========================================================================== */
    function initFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.setAttribute('role', 'button');
                question.setAttribute('tabindex', '0');
                question.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');

                const toggleFaq = () => {
                    const wasActive = item.classList.contains('active');
                    faqItems.forEach(i => {
                        i.classList.remove('active');
                        const q = i.querySelector('.faq-question');
                        if (q) q.setAttribute('aria-expanded', 'false');
                    });
                    if (!wasActive) {
                        item.classList.add('active');
                        question.setAttribute('aria-expanded', 'true');
                    }
                };

                question.addEventListener('click', toggleFaq);
                question.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleFaq();
                    }
                });
            }
        });
    }
    initFaqAccordion();

    /* ==========================================================================
       05 - Contact Form Submission
       ========================================================================== */
    const submitBtn = document.getElementById('realSubmitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function () {
            const name = document.getElementById('contactName')?.value.trim();
            const email = document.getElementById('contactEmail')?.value.trim();
            const message = document.getElementById('contactMessage')?.value.trim();
            const method = document.querySelector('input[name="method"]:checked')?.value || 'whatsapp';
            
            if (!name || !email || !message) {
                alert("Please fill all required transmission fields.");
                return;
            }
            
            const msg = `Transmission from: ${name}\nNode: ${email}\n\nPayload:\n${message}`;
            if (method === 'whatsapp') {
                window.open(`https://wa.me/213676184805?text=${encodeURIComponent(msg)}`, '_blank');
            } else {
                window.location.href = `mailto:altizsolutionsdz@gmail.com?subject=Transmission from ${encodeURIComponent(name)}&body=${encodeURIComponent(msg)}`;
            }
        });
    }
});
