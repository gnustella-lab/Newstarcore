const FALLBACK_PROJECTS = [
    { id: 1, title: "Galaxy Auth", stack: ["Node.js", "JWT", "Postgres"], desc: "Sistema de autenticação OAuth2 escalável.", repo: "https://github.com/newstarcore/galaxy-auth", demo: "#" },
    { id: 2, title: "Nebula UI", stack: ["React", "Tailwind", "Storybook"], desc: "Biblioteca de componentes cósmicos e acessíveis.", repo: "https://github.com/newstarcore/nebula-ui", demo: "#" },
    { id: 3, title: "Pulsar CLI", stack: ["Go", "Docker"], desc: "Ferramenta de linha de comando para deploy rápido.", repo: "https://github.com/newstarcore/pulsar-cli", demo: "#" }
];

const FALLBACK_PRODUCTS = [
    { id: 1, title: "Template Portfólio Astro", type: "Codigo", price: "Grátis", desc: "Template performático para devs.", link: "#" },
    { id: 2, title: "Pacote de Ícones Cosmic", type: "Design", price: "$5", desc: "50 ícones SVG estilo minimalista espacial.", link: "#" },
    { id: 3, title: "E-book: Clean Code em JS", type: "Recursos Gratuitos", price: "Grátis", desc: "Guia de boas práticas em JavaScript moderno.", link: "#" }
];

const FALLBACK_POSTS = [
    { slug: "construindo-app-estatica", title: "Construindo Apps Estáticas em 2023", date: "2023-10-25", category: "Tutoriais", tags: ["js", "github-pages"], excerpt: "Como criar um everything app sem backend." },
    { slug: "pensamentos-sobre-ia", title: "Reflexões: IA no fluxo de trabalho", date: "2023-10-15", category: "Pensamentos", tags: ["ia", "produtividade"], excerpt: "O papel da IA não é substituir, mas amplificar." }
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

function initStars() {
    const canvas = document.getElementById('star-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let stars = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        stars = Array.from({ length: 100 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5,
            o: Math.random()
        }));
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach((star) => {
            ctx.fillStyle = `rgba(255, 255, 255, ${star.o})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function animate() {
        draw();
        if (!reduceMotion) requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
        draw();
    });

    resize();
    animate();
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

function stripFrontMatter(markdown) {
    return markdown.replace(/^---\s*[\s\S]*?---\s*/, '');
}

function escapeHtml(value) {
    return String(value)
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

document.addEventListener('DOMContentLoaded', async () => {
    initStars();

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
    initPostPage();
});

function renderHomeHighlights() {
    const highlightsDiv = document.getElementById('home-highlights');
    if (!highlightsDiv) return;

    const latestPost = state.posts[0];
    const featuredProject = state.projects[0];
    const freeResource = state.products.find((product) => product.price === 'Grátis') || state.products[0];

    highlightsDiv.innerHTML = `
        <div class="card">
            <h3>Último Artigo</h3>
            <p>${escapeHtml(latestPost.title)}</p>
            <a href="${siteUrl(`blog/post.html?slug=${encodeURIComponent(latestPost.slug)}`)}" class="btn btn-secondary small-btn">Ler mais</a>
        </div>
        <div class="card">
            <h3>Projeto Destaque</h3>
            <p>${escapeHtml(featuredProject.title)}</p>
            <a href="${siteUrl('portfolio/')}" class="btn btn-secondary small-btn">Ver projeto</a>
        </div>
        <div class="card">
            <h3>Recurso Grátis</h3>
            <p>${escapeHtml(freeResource.title)}</p>
            <a href="${siteUrl('store/')}" class="btn btn-secondary small-btn">Baixar</a>
        </div>
    `;
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
        postContent.innerHTML = window.marked.parse(stripFrontMatter(markdown));
    } catch (error) {
        console.error('Erro ao carregar post.', error);
        postContent.innerHTML = `
            <h1>${escapeHtml(postData.title)}</h1>
            <p><em>Publicado em: ${escapeHtml(postData.date)}</em></p>
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

    grid.innerHTML = items.map((project) => `
        <article class="card">
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.desc)}</p>
            <div class="tag-list">
                ${project.stack.map((stack) => `<span class="tag">${escapeHtml(stack)}</span>`).join('')}
            </div>
            <div class="card-actions">
                <a href="${escapeHtml(project.repo)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary small-btn">Repositório</a>
                <a href="${escapeHtml(project.demo)}" class="btn btn-primary small-btn">Demo</a>
            </div>
        </article>
    `).join('');
}

function renderProducts(items) {
    const grid = document.getElementById('store-grid');
    if (!grid) return;

    if (items.length === 0) {
        grid.innerHTML = '<p class="empty-state">Nenhum recurso encontrado.</p>';
        return;
    }

    grid.innerHTML = items.map((product) => `
        <article class="card">
            <span class="tag tag-accent">${escapeHtml(product.type)}</span>
            <h3>${escapeHtml(product.title)}</h3>
            <p>${escapeHtml(product.desc)}</p>
            <div class="price-row">
                <strong>${escapeHtml(product.price)}</strong>
                <a href="${escapeHtml(product.link)}" class="btn btn-primary small-btn">Download</a>
            </div>
        </article>
    `).join('');
}

function renderBlogList(items) {
    const list = document.getElementById('blog-list');
    if (!list) return;

    if (items.length === 0) {
        list.innerHTML = '<p class="empty-state">Nenhum post encontrado.</p>';
        return;
    }

    list.innerHTML = items.map((post) => `
        <article class="card blog-card">
            <div class="card-top">
                <div>
                    <span class="tag">${escapeHtml(post.category)}</span>
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
}
