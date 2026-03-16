/* ============================================
   Script.js - Portfolio Profesional
   UI/UX, accesibilidad e interacci�n 3D en hero
   ============================================ */

function addListenerIfExists(element, eventName, handler, options) {
    if (element) {
        element.addEventListener(eventName, handler, options);
    }
}

function scrollToTarget(selector) {
    if (!selector || !selector.startsWith('#')) {
        return;
    }

    const targetSection = document.querySelector(selector);

    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// ============================================
// 0. Tema oscuro / claro
// ============================================

const themeState = {
    current: 'dark'
};

(function initThemeToggle() {
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const saved = localStorage.getItem('theme') || 'dark';

    html.setAttribute('data-theme', saved);
    themeState.current = saved;

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            themeState.current = next;

            window.dispatchEvent(new CustomEvent('theme:changed', {
                detail: { theme: next }
            }));
        });
    }
})();

// ============================================
// 1. Men� Responsive
// ============================================

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.nav-link');

function setMenuState(isOpen) {
    if (!menuToggle || !mainNav) {
        return;
    }

    menuToggle.classList.toggle('active', isOpen);
    mainNav.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
}

addListenerIfExists(menuToggle, 'click', () => {
    const shouldOpen = !menuToggle.classList.contains('active');
    setMenuState(shouldOpen);
});

navLinks.forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.header')) {
        setMenuState(false);
    }
});

// ============================================
// 2. Typewriter + Scroll suave
// ============================================

const typewriterElement = document.querySelector('.typewriter');

if (typewriterElement) {
    const fullText = typewriterElement.textContent.trim();

    if (!prefersReducedMotion.matches) {
        typewriterElement.textContent = '';
        let currentIndex = 0;

        const typingInterval = setInterval(() => {
            typewriterElement.textContent += fullText.charAt(currentIndex);
            currentIndex += 1;

            if (currentIndex >= fullText.length) {
                clearInterval(typingInterval);
                typewriterElement.classList.add('typing-done');
            }
        }, 80);
    } else {
        typewriterElement.classList.add('typing-done');
    }
}

navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        if (href && href.startsWith('#')) {
            e.preventDefault();
            scrollToTarget(href);
        }
    });
});

const ctaButtons = document.querySelectorAll('.hero a[href^="#"], .btn-contact-alt[href^="#"]');
ctaButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        const href = button.getAttribute('href');

        if (!href || href === '#') {
            e.preventDefault();
            return;
        }
        if (href.startsWith('#')) {
            e.preventDefault();
            scrollToTarget(href);
        }
    });
});

// ============================================
// 2.1 Catálogo de proyectos por categorías
// ============================================

const projectCatalog = [
        {
            category: 'Proyectos Web / Negocios Locales',
            projects: [
                {
                    name: 'ElRinconDeMamaInes',
                    repo: 'https://github.com/comarni/ElRinconDeMamaInes',
                    description: 'Web para una pastelería y repostería en Alcobendas, orientada a presencia de negocio local con estructura clara en HTML.',
                    tools: ['HTML', 'CSS', 'Diseño para negocio local']
                },
                {
                    name: 'PinPanPun',
                    repo: 'https://github.com/comarni/PinPanPun',
                    description: 'Web para otra pastelería en Alcobendas, enfocada en práctica de diseño CSS para hostelería.',
                    tools: ['HTML', 'CSS', 'Diseño gastronómico']
                },
                {
                    name: 'DreamsCoffee',
                    repo: 'https://github.com/comarni/DreamsCoffee',
                    description: 'Sitio para cafetería en Alcobendas con trabajo de marca visual y presentación de producto.',
                    tools: ['HTML', 'CSS', 'Branding UI']
                },
                {
                    name: 'de-Melani',
                    repo: 'https://github.com/comarni/de-Melani',
                    description: 'Sitio web para peluquería en Alcobendas con foco en diseño web para el sector estética.',
                    tools: ['HTML', 'CSS', 'Diseño de servicios']
                },
                {
                    name: 'pikolin',
                    repo: 'https://github.com/comarni/pikolin',
                    description: 'Landing page para colchonería en Alcobendas orientada a producto y captación local.',
                    tools: ['HTML', 'CSS', 'Landing page']
                },
                {
                    name: 'pasteleriaBalaguer',
                    repo: 'https://github.com/comarni/pasteleriaBalaguer',
                    description: 'Sitio para pastelería local con estructura sencilla para presentación de catálogo.',
                    tools: ['HTML', 'CSS', 'Estructura web básica']
                }
            ]
        },
        {
            category: 'Proyectos de Producto / SaaS',
            projects: [
                {
                    name: 'VoiceHub',
                    repo: 'https://github.com/comarni/VoiceHub',
                    description: 'SaaS de procesado de audio con IA: transcripción, separación de pistas y efectos en tiempo real. API REST con Fastify y TypeScript, autenticación JWT, pagos recurrentes con Stripe, cola de trabajos con Bull/Redis, almacenamiento en AWS S3 e inferencia IA via Replicate. Frontend en React 18 con TanStack Query y Zustand.',
                    tools: ['TypeScript', 'Fastify', 'React 18', 'Prisma', 'PostgreSQL', 'Redis', 'Stripe', 'AWS S3', 'Docker', 'Replicate AI']
                },
                {
                    name: 'LanhHub',
                    repo: 'https://github.com/comarni/LanhHub',
                    description: 'Plataforma de aprendizaje de idiomas con IA estilo Duolingo y enfoque social.',
                    tools: ['Docker', 'Backend', 'IA conversacional', 'Full stack']
                },
                {
                    name: 'Komarn.IA',
                    repo: 'https://github.com/comarni/Komarn.IA',
                    description: 'Landing de agencia IA centrada en presentación de servicios y captación de clientes.',
                    tools: ['HTML', 'CSS', 'Copy comercial']
                },
                {
                    name: 'TypeHub',
                    repo: 'https://github.com/comarni/TypeHub',
                    live: 'https://comarni.github.io/TypeHub/',
                    description: 'App de mecanografía tipo Monkeytype con eventos de teclado y métricas en tiempo real.',
                    tools: ['JavaScript', 'HTML', 'CSS', 'Lógica interactiva']
                },
                {
                    name: 'CarHub',
                    repo: 'https://github.com/comarni/CarHub',
                    description: 'Plataforma de compraventa de coches con listados, filtros y flujo tipo e-commerce.',
                    tools: ['JavaScript', 'HTML', 'CSS', 'Filtros dinámicos']
                },
                {
                    name: 'webhub',
                    repo: 'https://github.com/comarni/webhub',
                    live: 'https://comarni.github.io/webhub/',
                    description: 'Portal hub con automatizaciones, feeds, bots y cambio de tema.',
                    tools: ['HTML', 'CSS', 'JavaScript', 'Arquitectura de portal']
                },
                {
                    name: 'DisasterSim-Analytics.',
                    repo: 'https://github.com/comarni/DisasterSim-Analytics.',
                    description: 'Herramienta de simulación y análisis de desastres orientada a visualización de datos.',
                    tools: ['HTML', 'JavaScript', 'Data viz']
                }
            ]
        },
        {
            category: 'Herramientas y Utilidades',
            projects: [
                {
                    name: 'generador-gradiente-css',
                    repo: 'https://github.com/comarni/generador-gradiente-css',
                    description: 'Generador interactivo de gradientes CSS con presets y modo oscuro/claro.',
                    tools: ['HTML', 'CSS', 'JavaScript', 'UI interactiva']
                },
                {
                    name: 'conversor-de-texto',
                    repo: 'https://github.com/comarni/conversor-de-texto',
                    description: 'Conversor de texto online para cambios rápidos de formato y limpieza.',
                    tools: ['HTML', 'CSS', 'JavaScript', 'Manipulación de strings']
                },
                {
                    name: 'Conversor-de-divisas',
                    repo: 'https://github.com/comarni/Conversor-de-divisas',
                    live: 'https://comarni.github.io/Conversor-de-divisas/',
                    description: 'Conversor de divisas en tiempo real con API de Frankfurter y gráficos Chart.js.',
                    tools: ['JavaScript asíncrono', 'API REST', 'Chart.js', 'HTML/CSS']
                },
                {
                    name: 'ruleta3D',
                    repo: 'https://github.com/comarni/ruleta3D',
                    description: 'Ruleta 3D interactiva enfocada en animación y eventos en navegador.',
                    tools: ['JavaScript', 'Animación', 'Geometría 3D']
                }
            ]
        },
        {
            category: '3D / Gráficos',
            projects: [
                {
                    name: 'threejs-prueba',
                    repo: 'https://github.com/comarni/threejs-prueba',
                    live: 'https://comarni.github.io/threejs-prueba/',
                    description: 'Demo de Three.js con cubo 3D interactivo sin frameworks ni bundlers, publicado en GitHub Pages.',
                    tools: ['Three.js', 'WebGL', 'JavaScript Vanilla', 'GitHub Pages']
                }
            ]
        },
        {
            category: 'Portfolio y Presentación Personal',
            projects: [
                {
                    name: 'portfolio',
                    repo: 'https://github.com/comarni/portfolio',
                    live: 'https://comarni.github.io/portfolio/',
                    description: 'Portafolio personal con sitemap, robots.txt y páginas legales para presencia profesional.',
                    tools: ['HTML', 'CSS', 'JavaScript', 'SEO técnico']
                },
                {
                    name: 'Ignite',
                    repo: 'https://github.com/comarni/Ignite',
                    description: 'Landing page moderna orientada a práctica de diseño y estructura de conversión.',
                    tools: ['HTML', 'CSS', 'Diseño visual']
                }
            ]
        },
        {
            category: 'Sector Automoción',
            projects: [
                {
                    name: 'bmw-showcase-site',
                    repo: 'https://github.com/comarni/bmw-showcase-site',
                    description: 'Web corporativa de BMW responsive con historia de marca y catálogo de vehículos.',
                    tools: ['HTML', 'CSS', 'Diseño corporativo responsive']
                }
            ]
        }
    ];

function getRepoSlug(repoUrl) {
    return repoUrl.replace('https://github.com/', '').replace(/\/$/, '');
}

function getRepoPreview(repoUrl) {
    const slug = getRepoSlug(repoUrl);
    return `https://opengraph.githubassets.com/1/${slug}`;
}

function getLivePreview(liveUrl) {
    return `https://image.thum.io/get/width/1200/noanimate/${encodeURIComponent(liveUrl)}`;
}

function getInlineFallbackPreview(projectName) {
    const safeName = (projectName || 'Proyecto').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1a1f2f"/><stop offset="52%" stop-color="#15273d"/><stop offset="100%" stop-color="#2a170f"/></linearGradient></defs><rect width="1200" height="675" fill="url(#g)"/><circle cx="1020" cy="120" r="180" fill="rgba(255,140,0,0.16)"/><circle cx="170" cy="600" r="220" fill="rgba(79,140,255,0.18)"/><text x="90" y="520" fill="#f8fafc" font-size="58" font-family="Segoe UI, Arial, sans-serif" font-weight="700">${safeName}</text><text x="92" y="568" fill="#ffb347" font-size="26" font-family="Segoe UI, Arial, sans-serif">Preview no disponible en origen</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function wirePreviewFallbacks(scope = document) {
    const previews = scope.querySelectorAll('.js-project-preview');

    previews.forEach((img) => {
        const fallbackRepo = img.getAttribute('data-fallback-repo');
        const fallbackInline = img.getAttribute('data-fallback-inline');

        img.addEventListener('error', () => {
            const current = img.getAttribute('src') || '';

            if (fallbackRepo && current !== fallbackRepo) {
                img.setAttribute('src', fallbackRepo);
                return;
            }

            if (fallbackInline && current !== fallbackInline) {
                img.setAttribute('src', fallbackInline);
            }
        }, { once: false });
    });
}

function renderProjectCatalog() {
    const container = document.getElementById('projectCategories');
    if (!container) {
        return;
    }

    container.innerHTML = projectCatalog.map((group) => {
        const projectCards = group.projects.map((project) => {
            const tools = project.tools.map((tool) => `<span class="tech-tag">${tool}</span>`).join('');
            const repoPreview = getRepoPreview(project.repo);
            const inlineFallback = getInlineFallbackPreview(project.name);
            const primaryPreview = project.live ? getLivePreview(project.live) : repoPreview;
            const liveButton = project.live
                ? `<a href="${project.live}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">Ver preview</a>`
                : '<span class="btn btn-muted" aria-disabled="true">Preview no publicada</span>';
            const previewLabel = project.live ? 'Web preview' : 'Repo preview';

            return `
                <article class="project-card">
                    <div class="project-preview-frame-wrap" data-preview-label="${previewLabel}" aria-hidden="true">
                        <img
                            class="project-preview-image js-project-preview"
                            src="${primaryPreview}"
                            data-fallback-repo="${repoPreview}"
                            data-fallback-inline="${inlineFallback}"
                            alt="Previsualización de ${project.name}"
                            loading="lazy"
                            decoding="async"
                            referrerpolicy="no-referrer" />
                    </div>
                    <div class="project-content">
                        <div class="project-headline">
                            <span class="project-badge">${group.category}</span>
                            <h3 class="project-title">${project.name}</h3>
                        </div>
                        <p class="project-description">${project.description}</p>
                        <div class="project-tech">${tools}</div>
                        <div class="project-links">
                            <a href="${project.repo}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">Repositorio</a>
                            ${liveButton}
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        return `
            <section class="project-category" aria-label="${group.category}">
                <header class="project-category-header">
                    <h3 class="project-category-title">${group.category}</h3>
                    <span class="project-category-count">${group.projects.length} proyectos</span>
                </header>
                <div class="project-grid-category">
                    ${projectCards}
                </div>
            </section>
        `;
    }).join('');

    wirePreviewFallbacks(container);
}

renderProjectCatalog();

(function wireChipInteract() {
    var chips = document.querySelectorAll('.highlight-chip');
    chips.forEach(function(chip) {
        chip.addEventListener('mouseenter', function() {
            window.dispatchEvent(new CustomEvent('cube:interact'));
        });
    });
})();

// ============================================
// 3. Validaci�n de formulario
// ============================================

const contactForm = document.getElementById('contactForm');
const nombreInput = document.getElementById('nombre');
const emailInput = document.getElementById('email');
const mensajeInput = document.getElementById('mensaje');
const nombreError = document.getElementById('nombreError');
const emailError = document.getElementById('emailError');
const mensajeError = document.getElementById('mensajeError');
const formMessage = document.getElementById('formMessage');

function setFieldState(field, errorElement, errorText) {
    if (!field || !errorElement) {
        return;
    }

    const hasError = Boolean(errorText);
    field.setAttribute('aria-invalid', String(hasError));
    errorElement.textContent = errorText;
    errorElement.classList.toggle('show', hasError);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateField(field, errorElement, rules) {
    if (!field || !errorElement) {
        return true;
    }

    const value = field.value.trim();
    let isValid = true;
    let errorText = '';

    if (rules.required && !value) {
        isValid = false;
        errorText = 'Este campo es obligatorio';
    } else if (rules.email && !isValidEmail(value)) {
        isValid = false;
        errorText = 'Por favor ingresa un email v�lido';
    } else if (rules.minLength && value.length < rules.minLength) {
        isValid = false;
        errorText = `M�nimo ${rules.minLength} caracteres`;
    }

    setFieldState(field, errorElement, isValid ? '' : errorText);
    return isValid;
}

const formFields = [
    { input: nombreInput, error: nombreError, rules: { required: true, minLength: 2 } },
    { input: emailInput, error: emailError, rules: { required: true, email: true } },
    { input: mensajeInput, error: mensajeError, rules: { required: true, minLength: 10 } }
];

formFields.forEach(({ input, error, rules }) => {
    addListenerIfExists(input, 'blur', () => validateField(input, error, rules));
    addListenerIfExists(input, 'input', () => setFieldState(input, error, ''));
});

addListenerIfExists(contactForm, 'submit', (e) => {
    e.preventDefault();

    const validationResults = formFields.map(({ input, error, rules }) => {
        return validateField(input, error, rules);
    });

    const isFormValid = validationResults.every(Boolean);

    if (isFormValid && formMessage) {
        formMessage.textContent = '�Mensaje enviado exitosamente! Te responder� pronto.';
        formMessage.classList.add('success');
        formMessage.classList.remove('error');
        contactForm.reset();

        formFields.forEach(({ input, error }) => setFieldState(input, error, ''));

        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.classList.remove('success', 'error');
        }, 4500);
    } else if (formMessage) {
        formMessage.textContent = 'Por favor completa todos los campos correctamente';
        formMessage.classList.add('error');
        formMessage.classList.remove('success');

        const firstInvalidField = formFields.find(({ input, error, rules }) => {
            return !validateField(input, error, rules);
        });

        if (firstInvalidField?.input) {
            firstInvalidField.input.focus();
        }
    }
});

// ============================================
// 4. Reveal animations con IntersectionObserver
// ============================================

const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
};

const observer = typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions)
    : null;

const animateElements = document.querySelectorAll('.project-card, .skill-pill, .testimonial-card, .skills-category');
animateElements.forEach((el) => {
    if (observer) {
        observer.observe(el);
    } else {
        el.classList.add('animated');
    }
});

// ============================================
// 5. Scroll UI helpers (nav activo, progress, backToTop)
// ============================================

const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const sections = document.querySelectorAll('section');

function updateScrollUI() {
    const scrollTop = window.scrollY;

    if (scrollProgress) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = `${progress}%`;
    }

    if (backToTop) {
        backToTop.style.display = scrollTop > 320 ? 'flex' : 'none';
    }

    let current = '';

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;

        if (scrollTop >= sectionTop - 220) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });

    if (current && current !== updateScrollUI._lastSection) {
        updateScrollUI._lastSection = current;
        window.dispatchEvent(new CustomEvent('section:active', {
            detail: { section: current }
        }));
    }
}

window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// 6. Hero 3D con Three.js — Cubo reactivo
// ============================================

function initHeroCube() {
    var canvas = document.getElementById('hero3dCanvas');
    var area = document.getElementById('hero3dArea');

    if (!canvas || !area || typeof window.THREE === 'undefined') {
        return null;
    }

    var THREE = window.THREE;
    var isMobile = window.matchMedia('(max-width: 768px)').matches;

    var sectionColorMap = {
        'inicio':      0x2ec4b6,
        'proyectos':   0x4f8cff,
        'habilidades': 0xf59e0b,
        'sobre-mi':    0x10b981,
        'testimonios': 0xa78bfa,
        'contacto':    0xef4444
    };

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    var renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: !prefersReducedMotion.matches,
        alpha: true,
        powerPreference: 'high-performance'
    });

    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.2 : 1.6));

    var ambient = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambient);

    var keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(3, 2, 4);
    scene.add(keyLight);

    var fillLight = new THREE.PointLight(0x4f8cff, 1.1, 14);
    fillLight.position.set(-3, -1.5, 2.2);
    scene.add(fillLight);

    var group = new THREE.Group();
    scene.add(group);

    // Cubo principal
    var cubeGeo = new THREE.BoxGeometry(2, 2, 2, 8, 8, 8);
    var cubeMat = new THREE.MeshPhysicalMaterial({
        color: 0x2ec4b6,
        roughness: 0.28,
        metalness: 0.30,
        clearcoat: 0.60,
        clearcoatRoughness: 0.22,
        emissive: 0x2ec4b6,
        emissiveIntensity: 0.14
    });
    var cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
    group.add(cubeMesh);

    // Wireframe overlay
    var wireGeo = new THREE.WireframeGeometry(cubeGeo);
    var wireMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05 });
    var wireframe = new THREE.LineSegments(wireGeo, wireMat);
    group.add(wireframe);

    var state = {
        scaleX: 1,
        scaleY: 1,
        scaleZ: 1,
        targetScaleX: 1,
        targetScaleY: 1,
        targetScaleZ: 1,
        scrollFactor: 0,
        hoverStrength: 0,
        hoverTarget: 0,
        chipPulse: 0,
        chipPulseTarget: 0,
        emissiveTarget: 0.14,
        emissiveCurrent: 0.14,
        targetEmissiveColor: 0x2ec4b6,
        idleTimer: null,
        rafId: 0
    };

    function setEmissiveColor(hexColor) {
        state.targetEmissiveColor = hexColor;
        cubeMat.emissive.setHex(hexColor);
        fillLight.color.setHex(hexColor);
    }

    function applyTheme(theme) {
        if (theme === 'light') {
            cubeMat.color.setHex(0x2563eb);
            setEmissiveColor(0x0ea5a0);
        } else {
            cubeMat.color.setHex(0x2ec4b6);
            setEmissiveColor(0x2ec4b6);
        }
    }

    function triggerChipPulse() {
        state.chipPulseTarget = 1;
        setTimeout(function() { state.chipPulseTarget = 0; }, 220);
    }

    function scheduleIdleFlash() {
        var delay = 4000 + Math.random() * 6000;
        state.idleTimer = setTimeout(function() {
            var prevColor = cubeMat.emissive.getHex();
            cubeMat.emissive.setHex(0xffffff);
            state.emissiveTarget = 0.55;
            setTimeout(function() {
                cubeMat.emissive.setHex(prevColor);
                state.emissiveTarget = 0.14;
                scheduleIdleFlash();
            }, 180);
        }, delay);
    }

    function tryInitBloom() {
        if (
            typeof window.THREE === 'undefined' ||
            typeof window.THREE.EffectComposer === 'undefined' ||
            typeof window.THREE.RenderPass === 'undefined' ||
            typeof window.THREE.UnrealBloomPass === 'undefined'
        ) {
            return null;
        }
        try {
            var composer = new THREE.EffectComposer(renderer);
            composer.addPass(new THREE.RenderPass(scene, camera));
            var bloom = new THREE.UnrealBloomPass(
                new THREE.Vector2(canvas.width, canvas.height),
                0.6, 0.4, 0.85
            );
            composer.addPass(bloom);
            return composer;
        } catch (e) {
            return null;
        }
    }

    var composer = tryInitBloom();

    function resize() {
        var rect = area.getBoundingClientRect();
        var width = Math.max(220, rect.width);
        var height = Math.max(240, rect.height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);

        if (composer) {
            composer.setSize(width, height);
        }
    }

    function onScroll() {
        var heroRect = area.getBoundingClientRect();
        var viewport = window.innerHeight || 1;
        var normalized = 1 - Math.min(Math.abs(heroRect.top) / viewport, 1);

        state.scrollFactor = normalized;
    }

    function animate() {
        state.hoverStrength += (state.hoverTarget - state.hoverStrength) * 0.08;
        state.chipPulse += (state.chipPulseTarget - state.chipPulse) * 0.18;
        state.emissiveCurrent += (state.emissiveTarget - state.emissiveCurrent) * 0.10;

        var idleSpeed = 0.006;
        var scrollBoost = state.scrollFactor * 0.014;
        cubeMesh.rotation.y += idleSpeed + scrollBoost;
        cubeMesh.rotation.x += 0.002 + state.hoverStrength * 0.01;
        wireframe.rotation.y = cubeMesh.rotation.y;
        wireframe.rotation.x = cubeMesh.rotation.x;

        // Squash & stretch: chip pulse aplasta en Y, estira en X/Z
        var baseScale = 1 + state.scrollFactor * 0.08 + state.hoverStrength * 0.08;
        var squashY = baseScale - state.chipPulse * 0.22;
        var stretchXZ = baseScale + state.chipPulse * 0.12;

        state.targetScaleX = stretchXZ;
        state.targetScaleY = squashY;
        state.targetScaleZ = stretchXZ;

        state.scaleX += (state.targetScaleX - state.scaleX) * 0.12;
        state.scaleY += (state.targetScaleY - state.scaleY) * 0.12;
        state.scaleZ += (state.targetScaleZ - state.scaleZ) * 0.12;

        cubeMesh.scale.set(state.scaleX, state.scaleY, state.scaleZ);
        wireframe.scale.set(state.scaleX, state.scaleY, state.scaleZ);

        cubeMat.emissiveIntensity = state.emissiveCurrent + state.hoverStrength * 0.2;

        if (composer) {
            composer.render();
        } else {
            renderer.render(scene, camera);
        }

        state.rafId = window.requestAnimationFrame(animate);
    }

    applyTheme(themeState.current);
    resize();
    onScroll();

    if (!prefersReducedMotion.matches) {
        scheduleIdleFlash();
        animate();
    } else {
        renderer.render(scene, camera);
    }

    window.addEventListener('theme:changed', function(e) {
        applyTheme(e.detail.theme);
    });

    window.addEventListener('section:active', function(e) {
        var sectionId = e.detail && e.detail.section;
        if (sectionId && sectionColorMap[sectionId]) {
            setEmissiveColor(sectionColorMap[sectionId]);
        }
    });

    window.addEventListener('cube:interact', function() {
        triggerChipPulse();
    });

    window.addEventListener('scroll', onScroll, { passive: true });

    addListenerIfExists(area, 'mouseenter', function() { state.hoverTarget = 1; });
    addListenerIfExists(area, 'mouseleave', function() { state.hoverTarget = 0; });
    addListenerIfExists(area, 'touchstart', function() { state.hoverTarget = 1; }, { passive: true });
    addListenerIfExists(area, 'touchend', function() { state.hoverTarget = 0; }, { passive: true });

    if (typeof ResizeObserver !== 'undefined') {
        var ro = new ResizeObserver(function() { resize(); });
        ro.observe(area);
    } else {
        window.addEventListener('resize', resize);
    }

    return {
        dispose: function() {
            if (state.rafId) {
                cancelAnimationFrame(state.rafId);
            }
            if (state.idleTimer) {
                clearTimeout(state.idleTimer);
            }
            cubeGeo.dispose();
            cubeMat.dispose();
            wireGeo.dispose();
            wireMat.dispose();
            renderer.dispose();
        }
    };
}

initHeroCube();

// ============================================
// 7. Ajustes menores para UX m�vil
// ============================================

const inputs = document.querySelectorAll('input, textarea');
inputs.forEach((input) => {
    input.addEventListener('focus', () => {
        document.documentElement.style.fontSize = '16px';
    });
});

// ============================================
// 8. Cursor cubo 3D
// ============================================

function initCursorCube() {
    if (!window.matchMedia('(pointer: fine)').matches) { return null; }
    if (typeof window.THREE === 'undefined') { return null; }
    if (prefersReducedMotion.matches) { return null; }

    var canvas = document.getElementById('cursorCube');
    if (!canvas) { return null; }

    var THREE = window.THREE;
    var SIZE = 54;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
    camera.position.set(0, 0, 3.2);

    var renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(SIZE, SIZE, false);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    var pointLight = new THREE.PointLight(0x4f8cff, 1.8, 10);
    pointLight.position.set(2, 2, 3);
    scene.add(pointLight);

    var geo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    var mat = new THREE.MeshPhysicalMaterial({
        color: 0x2ec4b6,
        roughness: 0.25,
        metalness: 0.35,
        clearcoat: 0.6,
        emissive: 0x2ec4b6,
        emissiveIntensity: 0.3
    });
    var mesh = new THREE.Mesh(geo, mat);

    var wireGeo = new THREE.WireframeGeometry(geo);
    var wireMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 });
    var wire = new THREE.LineSegments(wireGeo, wireMat);

    var group = new THREE.Group();
    group.add(mesh);
    group.add(wire);
    scene.add(group);

    var colorMap = {
        'inicio':      0x2ec4b6,
        'proyectos':   0x4f8cff,
        'habilidades': 0xf59e0b,
        'sobre-mi':    0x10b981,
        'testimonios': 0xa78bfa,
        'contacto':    0xef4444
    };

    var state = {
        mouseX: -999, mouseY: -999,
        lerpX: -999,  lerpY: -999,
        velX: 0, velY: 0,
        prevX: 0, prevY: 0,
        rotX: 0, rotY: 0,
        hoverStrength: 0, hoverTarget: 0,
        clickPulse: 0,   clickTarget: 0,
        scaleX: 1, scaleY: 1, scaleZ: 1,
        emissiveCurrent: 0x2ec4b6,
        emissiveTarget: 0x2ec4b6,
        visible: false,
        rafId: 0
    };

    var INTERACTIVE = 'a, button, .btn, .nav-link, .highlight-chip, .social-link, label, input, textarea, .project-card';

    document.addEventListener('mousemove', function(e) {
        state.velX = e.clientX - state.prevX;
        state.velY = e.clientY - state.prevY;
        state.prevX = e.clientX;
        state.prevY = e.clientY;
        state.mouseX = e.clientX;
        state.mouseY = e.clientY;
        if (!state.visible) {
            state.lerpX = e.clientX;
            state.lerpY = e.clientY;
            state.visible = true;
            canvas.classList.add('is-visible');
        }
    });

    document.addEventListener('mouseover', function(e) {
        if (e.target.closest(INTERACTIVE)) {
            state.hoverTarget = 1;
        }
    });

    document.addEventListener('mouseout', function(e) {
        if (e.target.closest(INTERACTIVE)) {
            state.hoverTarget = 0;
        }
    });

    document.addEventListener('mousedown', function() {
        state.clickTarget = 1;
        setTimeout(function() { state.clickTarget = 0; }, 140);
    });

    window.addEventListener('section:active', function(e) {
        var id = e.detail && e.detail.section;
        if (id && colorMap[id]) {
            state.emissiveTarget = colorMap[id];
        }
    });

    window.addEventListener('theme:changed', function(e) {
        if (e.detail.theme === 'light') {
            mat.color.setHex(0x2563eb);
        } else {
            mat.color.setHex(0x2ec4b6);
        }
    });

    function lerpColor(current, target, t) {
        var cr = (current >> 16) & 0xff, cg = (current >> 8) & 0xff, cb = current & 0xff;
        var tr = (target >> 16) & 0xff,  tg = (target >> 8) & 0xff,  tb = target & 0xff;
        var r = Math.round(cr + (tr - cr) * t);
        var g = Math.round(cg + (tg - cg) * t);
        var b = Math.round(cb + (tb - cb) * t);
        return (r << 16) | (g << 8) | b;
    }

    function animate() {
        state.lerpX += (state.mouseX - state.lerpX) * 0.14;
        state.lerpY += (state.mouseY - state.lerpY) * 0.14;

        canvas.style.left = state.lerpX + 'px';
        canvas.style.top  = state.lerpY + 'px';

        state.rotY += state.velX * 0.022 + 0.008;
        state.rotX += state.velY * 0.016 + 0.003;
        state.velX *= 0.82;
        state.velY *= 0.82;

        group.rotation.y = state.rotY;
        group.rotation.x = state.rotX;

        state.hoverStrength += (state.hoverTarget - state.hoverStrength) * 0.12;
        var hoverScale = 1 + state.hoverStrength * 0.28;

        state.clickPulse += (state.clickTarget - state.clickPulse) * 0.22;
        var squashY   = hoverScale - state.clickPulse * 0.38;
        var stretchXZ = hoverScale + state.clickPulse * 0.22;

        state.scaleX += (stretchXZ - state.scaleX) * 0.14;
        state.scaleY += (squashY   - state.scaleY) * 0.14;
        state.scaleZ += (stretchXZ - state.scaleZ) * 0.14;

        group.scale.set(state.scaleX, state.scaleY, state.scaleZ);

        state.emissiveCurrent = lerpColor(state.emissiveCurrent, state.emissiveTarget, 0.06);
        mat.emissive.setHex(state.emissiveCurrent);
        mat.emissiveIntensity = 0.30 + state.hoverStrength * 0.25 + state.clickPulse * 0.40;
        pointLight.color.setHex(state.emissiveCurrent);

        renderer.render(scene, camera);
        state.rafId = requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('pagehide', function() {
        cancelAnimationFrame(state.rafId);
        geo.dispose(); mat.dispose();
        wireGeo.dispose(); wireMat.dispose();
        renderer.dispose();
    });

    return state;
}

initCursorCube();

console.log('Portfolio cargado correctamente');
