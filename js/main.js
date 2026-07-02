const FALLBACK_PROJECTS = [
    { id: 1, title: "Galaxy Auth", stack: ["Node.js", "JWT", "Postgres"], desc: "Sistema de autenticação OAuth2 escalável.", repo: "https://github.com/newstarcore/galaxy-auth", demo: "#" },
    { id: 2, title: "Nebula UI", stack: ["React", "Tailwind", "Storybook"], desc: "Biblioteca de componentes acessíveis e reutilizáveis.", repo: "https://github.com/newstarcore/nebula-ui", demo: "#" },
    { id: 3, title: "Pulsar CLI", stack: ["Go", "Docker"], desc: "Ferramenta de linha de comando para deploy rápido.", repo: "https://github.com/newstarcore/pulsar-cli", demo: "#" }
];

const FALLBACK_PRODUCTS = [
    { id: 1, title: "Template Portfólio Astro", type: "Codigo", price: "Grátis", desc: "Template performático para devs.", link: "#" },
    { id: 2, title: "Pacote de Ícones Prism", type: "Design", price: "$5", desc: "60 ícones SVG minimalistas.", link: "#" },
    { id: 3, title: "E-book: Clean Code em JS", type: "Recursos Gratuitos", price: "Grátis", desc: "Guia de boas práticas em JavaScript moderno.", link: "#" }
];

const FALLBACK_POSTS = [
    { slug: "construindo-app-estatica", title: "Construindo Apps Estáticas em 2026", date: "2026-03-10", category: "Tutoriais", tags: ["js", "github-pages"], excerpt: "Como criar um everything app sem backend." },
    { slug: "pensamentos-sobre-ia", title: "Reflexões: IA no fluxo de trabalho", date: "2026-02-18", category: "Pensamentos", tags: ["ia", "produtividade"], excerpt: "O papel da IA não é substituir, mas amplificar." }
];

const state = {
    projects: FALLBACK_PROJECTS,
    products: FALLBACK_PRODUCTS,
    posts: FALLBACK_POSTS
};

const scriptUrl = new URL(document.currentScript.src, window.location.href);
const basePath = scriptUrl.pathname.replace(/\/js\/main\.js$/, '');

function siteUrl(path = '') {
    const cleanPath = path.replace(/^\/+/, '');
    if (!cleanPath) return basePath || '/';
    return `${basePath}/${cleanPath}`;
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function updateMetaDescription(content) {
    const meta = document.querySelector('meta[name="description"]');
    if (meta && content) meta.setAttribute('content', content);
}

function stripFrontMatter(markdown) {
    return markdown.replace(/^---\s*[\s\S]*?---\s*/, '');
}

function initAurora() {
    const canvas = document.getElementById('aurora-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let time = 0;

    function resize() {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        const blobs = [
            { x: 0.2, y: 0.3, r: 280, color: [124, 92, 255], speed: 0.0004 },
            { x: 0.75, y: 0.2, r: 220, color: [255, 107, 74], speed: 0.0003 },
            { x: 0.5, y: 0.7, r: 200, color: [61, 214, 140], speed: 0.0005 }
        ];

        blobs.forEach((blob, i) => {
            const ox = blob.x * width + Math.sin(time * blob.speed + i) * 60;
            const oy = blob.y * height + Math.cos(time * blob.speed * 1.3 + i) * 40;
            const gradient = ctx.createRadialGradient(ox, oy, 0, ox, oy, blob.r);
            gradient.addColorStop(0, `rgba(${blob.color.join(',')}, 0.12)`);
            gradient.addColorStop(1, `rgba(${blob.color.join(',')}, 0)`);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        });
    }

    function animate() {
        if (!reduceMotion) time += 16;
        draw();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
}

function initHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open));
        links.classList.toggle('is-open', !open);
    });

    links.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            toggle.setAttribute('aria-expanded', 'false');
            links.classList.remove('is-open');
        });
    });
}

let revealObserver;

function revealInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
}

function initReveal() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = document.querySelectorAll('.reveal:not(.is-visible)');
    if (!items.length) return;

    if (reduceMotion) {
        items.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    if (!revealObserver) {
        revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px 0px 0px' });
    }

    items.forEach((el) => {
        if (revealInViewport(el)) {
            el.classList.add('is-visible');
            return;
        }
        revealObserver.observe(el);
    });
}

async function loadJson(path, fallback) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn(`Não foi possível carregar ${path}. Usando dados locais.`, error);
        return fallback;
    }
}

async function loadMarkdown(slug) {
    const response = await fetch(siteUrl(`blog/posts/${encodeURIComponent(slug)}.md`));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
}

document.addEventListener('DOMContentLoaded', async () => {
    initAurora();
    initHeader();
    initMobileNav();
    initReveal();

    const [projects, products, posts] = await Promise.all([
        loadJson(siteUrl('data/projects.json'), FALLBACK_PROJECTS),
        loadJson(siteUrl('data/products.json'), FALLBACK_PRODUCTS),
        loadJson(siteUrl('data/posts.json'), FALLBACK_POSTS)
    ]);

    state.projects = projects;
    state.products = products;
    state.posts = posts;

    renderHomeHighlights();
    initPortfolioPage();
    initStorePage();
    initBlogPage();
    await initPostPage();
});

function renderHomeHighlights() {
    const highlightsDiv = document.getElementById('home-highlights');
    if (!highlightsDiv) return;

    const latestPost = state.posts[0];
    const featuredProject = state.projects[0];
    const freeResource = state.products.find((product) => product.price === 'Grátis') || state.products[0];

    const cards = [
        {
            label: 'Último artigo',
            title: latestPost.title,
            body: latestPost.excerpt,
            href: siteUrl(`blog/post.html?slug=${encodeURIComponent(latestPost.slug)}`),
            action: 'Ler artigo'
        },
        {
            label: 'Projeto em destaque',
            title: featuredProject.title,
            body: featuredProject.desc,
            href: siteUrl('portfolio/'),
            action: 'Ver portfólio'
        },
        {
            label: 'Recurso gratuito',
            title: freeResource.title,
            body: freeResource.desc,
            href: siteUrl('store/'),
            action: 'Explorar loja'
        }
    ];

    highlightsDiv.innerHTML = cards.map((card) => `
        <article class="card mission-card reveal">
            <span class="card-kicker">${escapeHtml(card.label)}</span>
            <h3>${escapeHtml(card.title)}</h3>
            <p>${escapeHtml(card.body)}</p>
            <div class="card-actions">
                <a href="${escapeHtml(card.href)}" class="btn btn-secondary small-btn">${escapeHtml(card.action)}</a>
            </div>
        </article>
    `).join('');

    initReveal();
}

function initPortfolioPage() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    const filter = document.getElementById('tech-filter');
    if (!portfolioGrid) return;

    renderProjects(state.projects);

    if (filter) {
        filter.addEventListener('change', (event) => {
            const tech = event.target.value;
            const filtered = tech === 'all'
                ? state.projects
                : state.projects.filter((project) => project.stack.includes(tech));
            renderProjects(filtered);
        });
    }
}

function initStorePage() {
    const storeGrid = document.getElementById('store-grid');
    const filter = document.getElementById('store-filter');
    if (!storeGrid) return;

    renderProducts(state.products);

    if (filter) {
        filter.addEventListener('change', (event) => {
            const type = event.target.value;
            const filtered = type === 'all'
                ? state.products
                : state.products.filter((product) => product.type === type);
            renderProducts(filtered);
        });
    }
}

function initBlogPage() {
    const blogList = document.getElementById('blog-list');
    const search = document.getElementById('blog-search');
    if (!blogList) return;

    renderBlogList(state.posts);

    if (search) {
        search.addEventListener('input', (event) => {
            const term = event.target.value.toLowerCase().trim();
            const filtered = state.posts.filter((post) => (
                post.title.toLowerCase().includes(term)
                || post.excerpt.toLowerCase().includes(term)
                || post.tags.some((tag) => tag.toLowerCase().includes(term))
            ));
            renderBlogList(filtered);
        });
    }
}

async function initPostPage() {
    const postContent = document.getElementById('post-content');
    if (!postContent) return;

    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (!slug) {
        postContent.innerHTML = '<p>Informe um post válido na URL.</p>';
        return;
    }

    const postData = state.posts.find((post) => post.slug === slug);
    if (!postData) {
        postContent.innerHTML = '<p>Post não encontrado.</p>';
        return;
    }

    document.title = `${postData.title} | Newstarcore`;
    updateMetaDescription(postData.excerpt);

    try {
        const markdown = await loadMarkdown(slug);
        if (!window.marked) throw new Error('marked.js não foi carregado.');
        postContent.innerHTML = `
            <div class="post-meta">
                <span class="tag tag-accent">${escapeHtml(postData.category)}</span>
                <span>${escapeHtml(postData.date)}</span>
            </div>
            ${window.marked.parse(stripFrontMatter(markdown))}
        `;
    } catch (error) {
        console.error('Erro ao carregar post.', error);
        postContent.innerHTML = `
            <div class="post-meta">
                <span class="tag tag-accent">${escapeHtml(postData.category)}</span>
                <span>${escapeHtml(postData.date)}</span>
            </div>
            <h1>${escapeHtml(postData.title)}</h1>
            <p>${escapeHtml(postData.excerpt)}</p>
            <p class="muted">Não foi possível carregar o arquivo Markdown. Rode um servidor local ou verifique se o arquivo existe em <code>${escapeHtml(siteUrl(`blog/posts/${slug}.md`))}</code>.</p>
        `;
    }
}

function renderProjects(items) {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;

    if (items.length === 0) {
        grid.innerHTML = '<p class="empty-state">Nenhum projeto encontrado.</p>';
        return;
    }

    grid.innerHTML = items.map((project, index) => `
        <article class="card project-card reveal">
            <span class="card-kicker">Projeto ${String(index + 1).padStart(2, '0')}</span>
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.desc)}</p>
            <div class="tag-list">
                ${project.stack.map((stack) => `<span class="tag">${escapeHtml(stack)}</span>`).join('')}
            </div>
            <div class="card-actions">
                <a href="${escapeHtml(project.repo)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary small-btn">Repositório</a>
                ${project.demo && project.demo !== '#' ? `<a href="${escapeHtml(project.demo)}" class="btn btn-primary small-btn">Demo</a>` : ''}
            </div>
        </article>
    `).join('');

    initReveal();
}

function renderProducts(items) {
    const grid = document.getElementById('store-grid');
    if (!grid) return;

    if (items.length === 0) {
        grid.innerHTML = '<p class="empty-state">Nenhum recurso encontrado.</p>';
        return;
    }

    grid.innerHTML = items.map((product) => `
        <article class="card product-card reveal">
            <span class="tag tag-accent">${escapeHtml(product.type)}</span>
            <h3>${escapeHtml(product.title)}</h3>
            <p>${escapeHtml(product.desc)}</p>
            <div class="price-row">
                <strong>${escapeHtml(product.price)}</strong>
                <a href="${escapeHtml(product.link)}" class="btn btn-primary small-btn">Download</a>
            </div>
        </article>
    `).join('');

    initReveal();
}

function renderBlogList(items) {
    const list = document.getElementById('blog-list');
    if (!list) return;

    if (items.length === 0) {
        list.innerHTML = '<p class="empty-state">Nenhum post encontrado.</p>';
        return;
    }

    list.innerHTML = items.map((post) => `
        <article class="card blog-card reveal">
            <div class="card-top">
                <div>
                    <span class="tag tag-accent">${escapeHtml(post.category)}</span>
                    <h3><a href="${siteUrl(`blog/post.html?slug=${encodeURIComponent(post.slug)}`)}" class="post-link">${escapeHtml(post.title)}</a></h3>
                    <small>${escapeHtml(post.date)}</small>
                </div>
                <div class="tag-list">
                    ${post.tags.map((tag) => `<span class="tag tag-outline">#${escapeHtml(tag)}</span>`).join('')}
                </div>
            </div>
            <p>${escapeHtml(post.excerpt)}</p>
        </article>
    `).join('');

    initReveal();
}