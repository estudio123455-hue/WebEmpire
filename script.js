/* ============================================
   WEBEMPIRE — Creador de sitios web SaaS
   ============================================ */

/* ---------- CATEGORIES ---------- */
const CATEGORIES = [
  { id: 'restaurantes', name: 'Restaurantes', icon: '🍽' },
  { id: 'tiendas', name: 'Tiendas Online', icon: '🛍' },
  { id: 'salud', name: 'Salud y Bienestar', icon: '💪' },
  { id: 'educacion', name: 'Educación', icon: '📚' },
  { id: 'tecnologia', name: 'Tecnología', icon: '💻' },
  { id: 'fotografia', name: 'Fotografía', icon: '📷' },
  { id: 'fitness', name: 'Fitness', icon: '🏋' },
  { id: 'abogados', name: 'Abogados', icon: '⚖' },
  { id: 'inmobiliario', name: 'Inmobiliario', icon: '🏠' },
  { id: 'marketing', name: 'Marketing Digital', icon: '📣' },
  { id: 'consultoria', name: 'Consultoría', icon: '💼' },
  { id: 'otros', name: 'Otros', icon: '📦' }
];

const CATEGORY_GRADIENTS = {
  restaurantes: 'linear-gradient(135deg, #f97316, #ea580c)',
  tiendas: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  salud: 'linear-gradient(135deg, #10b981, #059669)',
  educacion: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  tecnologia: 'linear-gradient(135deg, #6366f1, #4f46e5)',
  fotografia: 'linear-gradient(135deg, #ec4899, #db2777)',
  fitness: 'linear-gradient(135deg, #ef4444, #dc2626)',
  abogados: 'linear-gradient(135deg, #1e293b, #0f172a)',
  inmobiliario: 'linear-gradient(135deg, #14b8a6, #0d9488)',
  marketing: 'linear-gradient(135deg, #f59e0b, #d97706)',
  consultoria: 'linear-gradient(135deg, #64748b, #475569)',
  otros: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
};

const COMMISSION_RATE = 0.10;

/* ---------- CURRENCY ---------- */
const CURRENCY = 'USD';
const CURRENCY_LOCALE = 'en-US';

function formatCurrency(amount) {
  const numeric = Number(amount);
  if (Number.isNaN(numeric)) return String(amount);
  return new Intl.NumberFormat(CURRENCY_LOCALE, { style: 'currency', currency: CURRENCY, maximumFractionDigits: numeric % 1 === 0 ? 0 : 2 }).format(numeric);
}

/* ---------- UTILITIES ---------- */
function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const FAVORITES_CHANGED = 'webempire:favorites-changed';

/* ---------- STORE ---------- */
function createStore() {
  const KEY = 'webempire_db';
  const SESSION_KEY = 'webempire_session';

  function load(key) {
    try { return JSON.parse(localStorage.getItem(key)) || null; }
    catch { return null; }
  }
  function save(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

  return {
    getUsers() { return load(KEY)?.users || []; },
    setUsers(users) { const d = load(KEY) || {}; d.users = users; save(KEY, d); },
    addUser(user) { const users = this.getUsers(); users.push(user); this.setUsers(users); },

    getUser() { return load(SESSION_KEY); },
    setUser(user) { user ? save(SESSION_KEY, user) : localStorage.removeItem(SESSION_KEY); },

    getServices() { return load(KEY)?.services || []; },
    setServices(services) { const d = load(KEY) || {}; d.services = services; save(KEY, d); },
    addService(service) { const s = this.getServices(); s.push(service); this.setServices(s); },

    getRequests() { return load(KEY)?.requests || []; },
    setRequests(requests) { const d = load(KEY) || {}; d.requests = requests; save(KEY, d); },
    addRequest(req) { const r = this.getRequests(); r.push(req); this.setRequests(r); },

    getFavorites() { return this.getUser()?.favorites || []; },
    toggleFavorite(serviceId) {
      const user = this.getUser();
      if (!user) return false;
      if (!user.favorites) user.favorites = [];
      const idx = user.favorites.indexOf(serviceId);
      if (idx > -1) { user.favorites.splice(idx, 1); this.setUser(user); window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED)); return false; }
      user.favorites.push(serviceId); this.setUser(user); window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED)); return true;
    },

    getTheme() { return load(KEY)?.theme || 'dark'; },
    setTheme(theme) { const d = load(KEY) || {}; d.theme = theme; save(KEY, d); },

    getSites() { return load(KEY)?.sites || []; },
    setSites(sites) { const d = load(KEY) || {}; d.sites = sites; save(KEY, d); },
    addSite(site) { const s = this.getSites(); s.push(site); this.setSites(s); },

    getOnboardingComplete() { return this.getUser()?.onboardingComplete || false; },
    setOnboardingComplete() { const user = this.getUser(); if (user) { user.onboardingComplete = true; this.setUser(user); } },

    getCurrentPlan() { return this.getUser()?.plan || 'free'; },
    setCurrentPlan(planId) { const user = this.getUser(); if (user) { user.plan = planId; this.setUser(user); } },

    getCustomDomain() { return this.getUser()?.customDomain || ''; },
    setCustomDomain(domain) { const user = this.getUser(); if (user) { user.customDomain = domain; this.setUser(user); } },

    getAnalytics(siteId) {
      const days = 30; const data = [];
      for (let i = days; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        data.push({ date: d.toISOString().slice(0, 10), visits: Math.floor(Math.random() * 200) + 10 });
      }
      return data;
    }
  };
}

const store = createStore();

/* ---------- SITE TEMPLATES ---------- */
const SITE_TEMPLATES = [
  {
    id: 'restaurante-moderno',
    name: 'Restaurante Moderno',
    category: 'restaurantes',
    icon: '🍽',
    gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
    description: 'Elegante plantilla para restaurantes con menú digital y reservas',
    sections: [
      { type: 'hero', title: 'Bienvenidos a nuestro Restaurante', subtitle: 'Cocina de autor con los mejores ingredientes', bgImage: '' },
      { type: 'services', title: 'Nuestro Menú', items: [{ name: 'Entradas', desc: 'Selección de entrantes de temporada', price: 12 }, { name: 'Platos Principales', desc: 'Carnes y pescados a la parrilla', price: 28 }, { name: 'Postres', desc: 'Repostería artesanal diaria', price: 10 }] },
      { type: 'testimonials', title: 'Lo que dicen nuestros clientes', items: [{ text: 'Experiencia culinaria increíble', author: 'María G.' }, { text: 'El mejor restaurante de la ciudad', author: 'Carlos R.' }] },
      { type: 'contact', title: 'Reserva tu mesa', subtitle: 'Te esperamos' }
    ]
  },
  {
    id: 'tienda-online',
    name: 'Tienda Online',
    category: 'tiendas',
    icon: '🛍',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    description: 'Plantilla para e-commerce con catálogo y carrito de compras',
    sections: [
      { type: 'hero', title: 'Tienda Online Premium', subtitle: 'Productos de calidad para ti', bgImage: '' },
      { type: 'services', title: 'Nuestros Productos', items: [{ name: 'Producto 1', desc: 'Descripción del producto', price: 49 }, { name: 'Producto 2', desc: 'Descripción del producto', price: 79 }, { name: 'Producto 3', desc: 'Descripción del producto', price: 29 }] },
      { type: 'testimonials', title: 'Opiniones de clientes', items: [{ text: 'Excelente calidad y servicio', author: 'Ana P.' }, { text: 'Envío rápido y producto perfecto', author: 'Luis M.' }] },
      { type: 'contact', title: 'Contáctanos', subtitle: 'Estamos aquí para ayudarte' }
    ]
  },
  {
    id: 'consultorio-salud',
    name: 'Consultorio de Salud',
    category: 'salud',
    icon: '💪',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    description: 'Plantilla profesional para clínicas y consultorios médicos',
    sections: [
      { type: 'hero', title: 'Tu salud es nuestra prioridad', subtitle: 'Atención médica de calidad', bgImage: '' },
      { type: 'services', title: 'Nuestros Servicios', items: [{ name: 'Consulta General', desc: 'Evaluación médica completa', price: 80 }, { name: 'Especialidades', desc: 'Atención especializada', price: 120 }, { name: 'Chequeo Preventivo', desc: 'Exámenes y análisis', price: 150 }] },
      { type: 'testimonials', title: 'Testimonios', items: [{ text: 'Excelente atención médica', author: 'Roberto S.' }, { text: 'Muy profesionales y amables', author: 'Laura F.' }] },
      { type: 'contact', title: 'Agenda tu cita', subtitle: 'Llámanos o escríbenos' }
    ]
  },
  {
    id: 'academia-online',
    name: 'Academia Online',
    category: 'educacion',
    icon: '📚',
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    description: 'Plantilla para escuelas y cursos online con clases virtuales',
    sections: [
      { type: 'hero', title: 'Aprende con los mejores', subtitle: 'Educación de calidad a tu alcance', bgImage: '' },
      { type: 'services', title: 'Nuestros Cursos', items: [{ name: 'Curso Básico', desc: 'Fundamentos del área', price: 99 }, { name: 'Curso Avanzado', desc: 'Nivel profesional', price: 199 }, { name: 'Mentoría 1:1', desc: 'Sesión personalizada', price: 150 }] },
      { type: 'testimonials', title: 'Estudiantes destacados', items: [{ text: 'Transformó mi carrera profesional', author: 'Pedro A.' }, { text: 'Los mejores instructores', author: 'Sofia L.' }] },
      { type: 'contact', title: 'Inscríbete ahora', subtitle: 'Da el primer paso' }
    ]
  },
  {
    id: 'startup-tech',
    name: 'Startup Tech',
    category: 'tecnologia',
    icon: '💻',
    gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    description: 'Plantilla moderna para startups y empresas de tecnología',
    sections: [
      { type: 'hero', title: 'Innovación digital', subtitle: 'Soluciones tecnológicas para el futuro', bgImage: '' },
      { type: 'services', title: 'Nuestros Servicios', items: [{ name: 'Desarrollo Web', desc: 'Aplicaciones web modernas', price: 2500 }, { name: 'App Móvil', desc: 'iOS y Android', price: 5000 }, { name: 'Consultoría Tech', desc: 'Estrategia digital', price: '200/h' }] },
      { type: 'testimonials', title: 'Clientes satisfechos', items: [{ text: 'Transformaron nuestro negocio', author: 'Empresa XYZ' }, { text: 'Soluciones innovadoras y eficientes', author: 'Tech Corp' }] },
      { type: 'contact', title: 'Contáctanos', subtitle: 'Hablemos de tu proyecto' }
    ]
  },
  {
    id: 'estudio-fotografia',
    name: 'Estudio de Fotografía',
    category: 'fotografia',
    icon: '📷',
    gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
    description: 'Plantilla visual para fotógrafos y estudios creativos',
    sections: [
      { type: 'hero', title: 'Capturamos tus momentos', subtitle: 'Fotografía profesional', bgImage: '' },
      { type: 'services', title: 'Nuestros Servicios', items: [{ name: 'Sesión Fotográfica', desc: '1 hora de sesión', price: 200 }, { name: 'Book Profesional', desc: 'Pack completo', price: 450 }, { name: 'Evento', desc: 'Cobertura de eventos', price: 800 }] },
      { type: 'testimonials', title: 'Opiniones', items: [{ text: 'Fotos increíbles, superó mis expectativas', author: 'Elena R.' }, { text: 'Muy profesional y creativo', author: 'Miguel T.' }] },
      { type: 'contact', title: 'Reserva tu sesión', subtitle: 'Creemos algo juntos' }
    ]
  }
];

/* ---------- PLANS ---------- */
const PLANS = {
  free: { id: 'free', name: 'Gratis', price: 0, period: 'mes', features: ['1 sitio web', 'Subdominio incluido', 'Plantillas básicas', 'SSL gratuito', '500MB almacenamiento'] },
  pro: { id: 'pro', name: 'Profesional', price: 19, period: 'mes', features: ['5 sitios web', 'Dominio personalizado', 'Todas las plantillas', 'SSL + CDN', '10GB almacenamiento', 'Analytics avanzado', 'Soporte prioritario'] },
  business: { id: 'business', name: 'Business', price: 49, period: 'mes', features: ['Sitios ilimitados', 'Dominio personalizado', 'Plantillas personalizadas', 'SSL + CDN + WAF', '100GB almacenamiento', 'Analytics + API', 'Soporte 24/7', 'White label'] }
};

/* ---------- SITE MODEL ---------- */
function createSite(data) {
  return {
    id: 'site_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    userId: data.userId,
    name: data.name,
    templateId: data.templateId,
    subdomain: data.subdomain,
    customDomain: data.customDomain || '',
    sections: data.sections || [],
    published: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}

/* ---------- SEED DATA ---------- */
function seedData() {
  const data = store.getUsers().length > 0 ? store.getUsers() : [];
  if (data.length === 0) {
    const users = [
      { id: 'user_demo_1', name: 'Carlos Mendoza', email: 'carlos@demo.com', password: 'demo123', role: 'professional', category: 'tecnologia', bio: 'Desarrollador full-stack con 8 años de experiencia', favorites: [], onboardingComplete: true, plan: 'pro', createdAt: Date.now() - 86400000 * 30 },
      { id: 'user_demo_2', name: 'Ana García', email: 'ana@demo.com', password: 'demo123', role: 'client', favorites: [], onboardingComplete: true, plan: 'free', createdAt: Date.now() - 86400000 * 20 },
      { id: 'user_demo_3', name: 'María López', email: 'maria@demo.com', password: 'demo123', role: 'professional', category: 'fotografia', bio: 'Fotógrafa profesional especializada en bodas', favorites: [], onboardingComplete: true, plan: 'pro', createdAt: Date.now() - 86400000 * 15 }
    ];
    store.setUsers(users);
  }
  if (store.getServices().length === 0) {
    const services = [
      { id: 'svc_1', title: 'Desarrollo Web Full-Stack', category: 'tecnologia', description: 'Creo aplicaciones web completas con React, Node.js y bases de datos modernas. Incluye diseño responsive, optimización SEO y despliegue.', shortDesc: 'Aplicaciones web completas con tecnologías modernas', price: 2500, delivery: 14, tags: ['react', 'nodejs', 'fullstack', 'web'], rating: 4.9, reviewCount: 127, professionalId: 'user_demo_1', professionalName: 'Carlos Mendoza', professionalBio: 'Desarrollador full-stack', createdAt: Date.now() - 86400000 * 10 },
      { id: 'svc_2', title: 'Sesión Fotográfica Profesional', category: 'fotografia', description: 'Sesión fotográfica de 2 horas con edición profesional. Ideal para retratos, productos o eventos.', shortDesc: 'Sesión fotográfica con edición incluida', price: 450, delivery: 5, tags: ['fotografia', 'profesional', 'edicion'], rating: 4.8, reviewCount: 89, professionalId: 'user_demo_3', professionalName: 'María López', professionalBio: 'Fotógrafa profesional', createdAt: Date.now() - 86400000 * 8 },
      { id: 'svc_3', title: 'Diseño de Identidad Visual', category: 'marketing', description: 'Creación de logo, paleta de colores, tipografía y manual de marca completo para tu negocio.', shortDesc: 'Branding completo para tu empresa', price: 800, delivery: 7, tags: ['branding', 'logo', 'diseño', 'identidad'], rating: 4.7, reviewCount: 64, professionalId: 'user_demo_1', professionalName: 'Carlos Mendoza', professionalBio: 'Desarrollador full-stack', createdAt: Date.now() - 86400000 * 5 },
      { id: 'svc_4', title: 'Consultoría Digital Empresarial', category: 'consultoria', description: 'Análisis completo de tu presencia digital con plan de acción personalizado para hacer crecer tu negocio online.', shortDesc: 'Estrategia digital para tu negocio', price: 200, delivery: 3, tags: ['consultoria', 'estrategia', 'digital', 'negocios'], rating: 4.6, reviewCount: 45, professionalId: 'user_demo_1', professionalName: 'Carlos Mendoza', professionalBio: 'Desarrollador full-stack', createdAt: Date.now() - 86400000 * 3 }
    ];
    store.setServices(services);
  }
}



/* ========== DOM HELPERS ========== */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function showPage(pageId) {
  $$('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  updateNav();
}

function updateNav() {
  const user = store.getUser();
  const isAuth = !!user;
  const favEl = document.getElementById('navFavorites');
  const dashEl = document.getElementById('navDashboard');
  const authEl = document.getElementById('authButtons');
  const userMenu = document.getElementById('userMenu');
  if (authEl) authEl.classList.toggle('hidden', isAuth);
  if (userMenu) userMenu.classList.toggle('hidden', !isAuth);
  if (favEl) favEl.classList.toggle('hidden', !isAuth);
  if (dashEl) dashEl.classList.toggle('hidden', !isAuth);
  updateFavoritesCounter();
  if (user) {
    const letter = document.getElementById('userAvatarLetter');
    const name = document.getElementById('userMenuName');
    if (letter) letter.textContent = user.name.charAt(0).toUpperCase();
    if (name) name.textContent = user.name.split(' ')[0];
  }
}

function updateFavoritesCounter() {
  const badge = document.getElementById('navFavoritesCount');
  if (!badge) return;
  const user = store.getUser();
  const count = user ? store.getFavorites().length : 0;
  const navLink = document.getElementById('navFavorites');
  if (navLink) navLink.classList.toggle('hidden', !user);
  badge.textContent = count;
  badge.classList.remove('bump');
  void badge.offsetWidth;
  if (count > 0) badge.classList.add('bump');
}
window.addEventListener(FAVORITES_CHANGED, () => {
  updateFavoritesCounter();
  if ($('#page-favorites').classList.contains('active')) renderFavorites();
  if ($('#page-client-dashboard').classList.contains('active') && $('#tab-client-favorites').classList.contains('active')) renderClientFavorites();
});

function getCategoryName(id) { const c = CATEGORIES.find(c => c.id === id); return c ? c.name : id; }
function getCategoryIcon(id) { const c = CATEGORIES.find(c => c.id === id); return c ? c.icon : '📦'; }
function getCategoryGradient(id) { return CATEGORY_GRADIENTS[id] || 'linear-gradient(135deg, #64748b, #475569)'; }
function formatDate(ts) { return new Date(ts).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }); }
function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins + ' min';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h';
  const days = Math.floor(hrs / 24);
  if (days < 30) return days + 'd';
  const months = Math.floor(days / 30);
  return months + ' mes' + (months > 1 ? 'es' : '');
}
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
}
function toast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const t = document.createElement('div');
  t.className = 'toast toast-' + type;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

/* ========== THEME ========== */
function initTheme() {
  const theme = store.getTheme();
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀' : '◐';
}

/* ========== NAVIGATION DELEGATION ========== */
document.addEventListener('click', (e) => {
  const nav = e.target.closest('[data-navigate]');
  if (nav) {
    e.preventDefault();
    const target = nav.dataset.navigate;
    if (target === 'home') { showPage('home'); renderHome(); }
    else if (target === 'templates') { showPage('templates'); renderTemplates(); }
    else if (target === 'pricing') { showPage('pricing'); renderPricing(); }
    else if (target === 'domain') {
      const user = store.getUser();
      if (!user) { toast('Inicia sesión primero', 'error'); return; }
      showPage('domain'); renderDomain();
    }
    else if (target === 'create-site') {
      const user = store.getUser();
      if (!user) { toast('Inicia sesión primero', 'error'); return; }
      showPage('create-site'); renderCreateSite();
    }
    else if (target === 'editor') {
      const user = store.getUser();
      if (!user) { toast('Inicia sesión primero', 'error'); return; }
      const siteId = window._editorSiteId;
      if (siteId) { showPage('editor'); renderEditor(siteId); }
      else { showPage('projects'); renderProjects(); }
    }
    else if (target === 'projects') {
      const user = store.getUser();
      if (!user) { toast('Inicia sesión primero', 'error'); return; }
      showPage('projects'); renderProjects();
    }
    else if (target === 'site-dashboard') {
      const user = store.getUser();
      if (!user) { toast('Inicia sesión primero', 'error'); return; }
      showPage('site-dashboard'); renderSiteDashboard();
    }
    else if (target === 'dashboard') {
      const user = store.getUser();
      if (!user) { toast('Inicia sesión primero', 'error'); return; }
      showPage('dashboard'); renderDashboard();
    }
    else if (target === 'onboarding') {
      const user = store.getUser();
      if (!user) { toast('Inicia sesión primero', 'error'); return; }
      showPage('onboarding'); renderOnboarding();
    }
    else if (target === 'favorites') { renderFavorites(); showPage('favorites'); }
    else if (target === 'marketplace') { showPage('marketplace'); renderMarketplace(); }
    else if (target === 'landing') { showPage('landing'); renderLanding(); }
    else if (target === 'service' || target === 'profile' || target === 'preview') {
      showPage(target);
    }
    else { showPage(target); }
    return;
  }
  const themeToggle = e.target.closest('#themeToggle');
  if (themeToggle) {
    const current = store.getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    store.setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    themeToggle.textContent = next === 'dark' ? '☀' : '◐';
  }
  const logout = e.target.closest('#logoutBtn');
  if (logout) {
    e.preventDefault();
    store.setUser(null);
    updateNav();
    showPage('home'); renderHome();
    toast('Sesión cerrada', 'info');
  }
  const sideTab = e.target.closest('.sidebar-tab');
  if (sideTab && sideTab.dataset.tab) {
    e.preventDefault();
    const layout = sideTab.closest('.dashboard-layout');
    if (layout) {
      layout.querySelectorAll('.sidebar-tab').forEach(t => t.classList.toggle('active', t === sideTab));
      const content = layout.querySelector('.dashboard-tabs');
      if (content) {
        content.querySelectorAll('.tab-content').forEach(t => t.classList.toggle('active', t.id === 'tab-' + sideTab.dataset.tab));
      }
    }
  }
});

/* ========== AUTH ========== */
function bindAuth() {
  const roleSel = document.getElementById('registerRole');
  if (roleSel) {
    roleSel.addEventListener('change', () => {
      const group = document.getElementById('professionalCategoryGroup');
      if (group) group.style.display = roleSel.value === 'professional' ? 'block' : 'none';
    });
  }
  const regForm = document.getElementById('registerForm');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('registerName').value.trim();
      const email = document.getElementById('registerEmail').value.trim().toLowerCase();
      const password = document.getElementById('registerPassword').value;
      const role = document.getElementById('registerRole').value;
      const category = document.getElementById('registerCategory')?.value || '';
      if (!role) { toast('Selecciona tu rol', 'error'); return; }
      if (role === 'professional' && !category) { toast('Selecciona una categoría', 'error'); return; }
      if (store.getUsers().find(u => u.email === email)) { toast('El email ya está registrado', 'error'); return; }
      const user = { id: 'user_' + Date.now(), name, email, password, role, category: category || null, bio: '', favorites: [], onboardingComplete: false, plan: 'free', createdAt: Date.now() };
      store.addUser(user);
      store.setUser(user);
      updateNav();
      toast('¡Cuenta creada exitosamente!');
      showPage('onboarding'); renderOnboarding();
      e.target.reset();
      const group = document.getElementById('professionalCategoryGroup');
      if (group) group.style.display = 'none';
    });
  }
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPassword').value;
      const user = store.getUsers().find(u => u.email === email && u.password === password);
      if (!user) { toast('Email o contraseña incorrectos', 'error'); return; }
      store.setUser(user);
      updateNav();
      toast('¡Bienvenido, ' + user.name.split(' ')[0] + '!');
      if (!store.getOnboardingComplete()) { showPage('onboarding'); renderOnboarding(); }
      else { showPage('dashboard'); renderDashboard(); }
      e.target.reset();
    });
  }
}

/* ========== LANDING (OLD) ========== */
function renderLanding() {
  const services = store.getServices();
  const catGrid = document.getElementById('homeCategories');
  if (catGrid) {
    catGrid.innerHTML = CATEGORIES.map(cat => {
      const count = services.filter(s => s.category === cat.id).length;
      return `<div class="category-card" data-navigate="marketplace" data-category-filter="${cat.id}"><span class="category-icon">${cat.icon}</span><span class="category-name">${cat.name}</span><span class="category-count">${count} servicios</span></div>`;
    }).join('');
    catGrid.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => { showPage('marketplace'); renderMarketplace(card.dataset.categoryFilter); });
    });
  }
  const featured = document.getElementById('featuredServices');
  if (featured) {
    const sorted = [...services].sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount)).slice(0, 6);
    featured.innerHTML = sorted.map(s => renderServiceCard(s)).join('');
    bindServiceCards();
  }
}

bindAuth();

/* ========== MARKETPLACE ========== */
let currentFilters = { category: '', search: '', maxPrice: 1000, minRating: 0, sort: 'featured' };

function renderMarketplace(preselectCategory) {
  const services = store.getServices();
  const catFilters = $('#categoryFilters');
  catFilters.innerHTML = CATEGORIES.map(cat => {
    const count = services.filter(s => s.category === cat.id).length;
    return `<label class="filter-checkbox"><input type="radio" name="category" value="${cat.id}" ${preselectCategory === cat.id ? 'checked' : ''}> ${cat.icon} ${cat.name} (${count})</label>`;
  }).join('');
  if (preselectCategory) {
    currentFilters.category = preselectCategory;
    const radio = catFilters.querySelector(`[value="${preselectCategory}"]`);
    if (radio) radio.checked = true;
  }
  applyFilters();
}

function renderSkeletonCards(count = 6) {
  return Array.from({ length: count }, () => `
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton sk-img"></div>
      <div class="skeleton sk-line short"></div>
      <div class="skeleton sk-line mid"></div>
      <div class="skeleton sk-line"></div>
      <div class="skeleton sk-footer"></div>
    </div>`).join('');
}

function applyFilters() {
  const services = store.getServices();
  let filtered = [...services];
  if (currentFilters.category) filtered = filtered.filter(s => s.category === currentFilters.category);
  if (currentFilters.search) {
    const q = currentFilters.search.toLowerCase();
    filtered = filtered.filter(s => s.title.toLowerCase().includes(q) || s.shortDesc.toLowerCase().includes(q) || s.professionalName.toLowerCase().includes(q) || s.tags.some(t => t.toLowerCase().includes(q)));
  }
  filtered = filtered.filter(s => s.price <= currentFilters.maxPrice);
  if (currentFilters.minRating > 0) filtered = filtered.filter(s => s.rating >= currentFilters.minRating);
  switch (currentFilters.sort) {
    case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
    case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
    case 'rating': filtered.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount)); break;
    case 'newest': filtered.sort((a, b) => b.createdAt - a.createdAt); break;
    default: filtered.sort((a, b) => (b.rating * b.reviewCount * 2) - (a.rating * a.reviewCount * 2));
  }
  const grid = $('#marketplaceServices');
  const empty = $('#emptyMarketplace');
  const count = $('#resultsCount');
  count.textContent = filtered.length + ' servicio' + (filtered.length !== 1 ? 's' : '') + ' encontrado' + (filtered.length !== 1 ? 's' : '');
  if (filtered.length === 0) { grid.innerHTML = ''; empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');
  grid.innerHTML = renderSkeletonCards(Math.min(filtered.length, 6));
  setTimeout(() => {
    if (grid.querySelector('.skeleton-card')) grid.innerHTML = filtered.map(s => renderServiceCard(s)).join('');
    bindServiceCards();
  }, 350);
}

const debouncedSearch = debounce(() => {
  currentFilters.search = $('#searchInput').value.trim();
  applyFilters();
}, 300);

$('#searchInput').addEventListener('input', debouncedSearch);
$('#searchBtn').addEventListener('click', () => { currentFilters.search = $('#searchInput').value.trim(); applyFilters(); });
$('#categoryFilters').addEventListener('change', (e) => { if (e.target.name === 'category') { currentFilters.category = e.target.value; applyFilters(); } });
$('#priceFilter').addEventListener('input', (e) => { currentFilters.maxPrice = parseInt(e.target.value); $('#priceFilterValue').textContent = formatCurrency(parseInt(e.target.value)); applyFilters(); });
$('#ratingFilters').addEventListener('change', (e) => { if (e.target.name === 'rating') { currentFilters.minRating = parseInt(e.target.value); applyFilters(); } });
$('#sortFilter').addEventListener('change', (e) => { currentFilters.sort = e.target.value; applyFilters(); });
function resetFilters() {
  currentFilters = { category: '', search: '', maxPrice: 1000, minRating: 0, sort: 'featured' };
  const si = $('#searchInput'); if (si) si.value = '';
  const pr = $('#priceFilter'); if (pr) pr.value = 1000;
  const pv = $('#priceFilterValue'); if (pv) pv.textContent = formatCurrency(1000);
  const sf = $('#sortFilter'); if (sf) sf.value = 'featured';
  $$('#categoryFilters input, #ratingFilters input').forEach(i => i.checked = false);
  applyFilters();
}
$('#clearFilters').addEventListener('click', resetFilters);
$('#clearAllFiltersBtn')?.addEventListener('click', resetFilters);
$('#openFilters')?.addEventListener('click', () => { $('#filtersSidebar').classList.add('open'); });
$('#closeFilters')?.addEventListener('click', () => { $('#filtersSidebar').classList.remove('open'); });

/* ========== RATING FILTERS RENDER ========== */
(function renderRatingFilters() {
  const container = $('#ratingFilters');
  if (!container) return;
  const opts = [
    { v: 0, label: 'Todas' },
    { v: 4, label: '4+ ★' },
    { v: 3, label: '3+ ★' },
    { v: 2, label: '2+ ★' }
  ];
  container.innerHTML = '<h4>Valoración</h4>' + opts.map(o => `<label class="filter-checkbox"><input type="radio" name="rating" value="${o.v}" ${o.v === 0 ? 'checked' : ''}><span>${o.label}</span></label>`).join('');
})();

/* ========== SERVICE CARD ========== */
function renderServiceCard(s) {
  const user = store.getUser();
  const favs = store.getFavorites();
  const isFav = favs.includes(s.id);
  const gradient = getCategoryGradient(s.category);
  const avatarLetter = s.professionalName?.charAt(0) || '?';
  return `<div class="service-card" data-service-id="${s.id}"><div class="service-card-img" style="background:${gradient}"><span style="filter:grayscale(0.1)">${getCategoryIcon(s.category)}</span>${user ? `<button class="service-card-favorite ${isFav ? 'active' : ''}" data-fav-id="${s.id}">${isFav ? '♥' : '♡'}</button>` : ''}</div><div class="service-card-body"><div class="service-card-category">${getCategoryName(s.category)}</div><div class="service-card-title">${s.title}</div><div class="service-card-desc">${s.shortDesc}</div><div class="service-card-pro"><span class="service-card-avatar">${avatarLetter}</span><span class="service-card-pro-name">${s.professionalName}</span></div></div><div class="service-card-footer"><span class="service-card-price">${formatCurrency(s.price)}</span><span class="service-card-rating"><span class="stars">${renderStars(s.rating)}</span> ${s.rating} (${s.reviewCount})</span></div></div>`;
}

function bindServiceCards() {
  $$('.service-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.service-card-favorite')) return;
      renderServiceDetail(card.dataset.serviceId); showPage('service');
    });
  });
  $$('.service-card-favorite').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const user = store.getUser();
      if (!user) { toast('Inicia sesión para guardar favoritos', 'error'); return; }
      const added = store.toggleFavorite(btn.dataset.favId);
      btn.classList.toggle('active', added); btn.textContent = added ? '♥' : '♡';
      toast(added ? 'Añadido a favoritos' : 'Eliminado de favoritos');
    });
  });
}

/* ========== SERVICE DETAIL ========== */
function renderServiceDetail(serviceId) {
  const service = store.getServices().find(s => s.id === serviceId);
  if (!service) return;
  const user = store.getUser();
  const gradient = getCategoryGradient(service.category);
  const html = `<div class="service-detail-header"><div><div class="service-detail-hero" style="background:${gradient}"><span style="filter:grayscale(0.1)">${getCategoryIcon(service.category)}</span></div><div class="service-detail-info"><span class="service-card-category">${getCategoryName(service.category)}</span><h1>${service.title}</h1><div class="service-card-pro" style="cursor:pointer" data-profile-id="${service.professionalId}"><span class="service-card-avatar">${service.professionalName.charAt(0)}</span><span class="service-card-pro-name">${service.professionalName}</span></div><div class="service-detail-description">${service.description}</div><div class="service-detail-tags">${service.tags.map(t => `<span class="service-tag">${t}</span>`).join('')}</div></div></div><div class="service-detail-sidebar"><div class="sidebar-price">${formatCurrency(service.price)}</div><p class="sidebar-delivery">Entrega en ${service.delivery} días</p><div class="service-card-rating" style="margin-bottom:20px"><span class="stars">${renderStars(service.rating)}</span> ${service.rating} (${service.reviewCount} reseñas)</div><div class="sidebar-pro" data-profile-id="${service.professionalId}"><span class="sidebar-pro-avatar">${service.professionalName.charAt(0)}</span><div class="sidebar-pro-info"><h4>${service.professionalName}</h4><p>${getCategoryName(service.category)}</p></div></div>${user && user.role === 'client' ? `<button class="btn btn-primary btn-block" id="requestServiceBtn" data-service-id="${service.id}">Solicitar servicio</button>` : !user ? `<button class="btn btn-primary btn-block" data-navigate="login">Inicia sesión para contratar</button>` : `<p style="text-align:center;color:var(--text-tertiary);font-size:14px;margin-top:12px">Solo los clientes pueden solicitar servicios</p>`}</div></div>`;
  $('#serviceDetail').innerHTML = html;
  $('#requestServiceBtn')?.addEventListener('click', () => { openRequestModal(service); });
  $$('[data-profile-id]').forEach(el => { el.addEventListener('click', () => { renderProfile(el.dataset.profileId); showPage('profile'); }); });
}

/* ========== PROFESSIONAL PROFILE ========== */
function renderProfile(userId) {
  const users = store.getUsers();
  const pro = users.find(u => u.id === userId);
  if (!pro) { $('#profileContent').innerHTML = '<p>Profesional no encontrado</p>'; return; }
  const services = store.getServices().filter(s => s.professionalId === userId);
  const avgRating = services.length > 0 ? (services.reduce((a, s) => a + s.rating, 0) / services.length).toFixed(1) : '—';
  const totalReviews = services.reduce((a, s) => a + s.reviewCount, 0);
  const html = `<div class="profile-card"><div class="profile-avatar">${pro.name.charAt(0)}</div><h2>${pro.name}</h2><p class="profile-role">${pro.category ? getCategoryName(pro.category) : 'Profesional'}</p>${pro.bio ? `<p style="font-size:14px;color:var(--text-secondary);margin-bottom:16px">${pro.bio}</p>` : ''}<div class="profile-stats"><div class="profile-stat"><strong>${services.length}</strong><span>Servicios</span></div><div class="profile-stat"><strong>${avgRating}</strong><span>Valoración</span></div><div class="profile-stat"><strong>${totalReviews}</strong><span>Reseñas</span></div><div class="profile-stat"><strong>${timeAgo(pro.createdAt)}</strong><span>Miembro desde</span></div></div></div><div class="profile-services"><h3>Servicios de ${pro.name.split(' ')[0]}</h3><div class="services-grid">${services.length > 0 ? services.map(s => renderServiceCard(s)).join('') : '<p class="empty-text">Aún no ha publicado servicios</p>'}</div></div>`;
  $('#profileContent').innerHTML = html;
  bindServiceCards();
}

/* ========== REQUEST MODAL ========== */
function openRequestModal(service) {
  const user = store.getUser();
  if (!user) { toast('Inicia sesión primero', 'error'); return; }
  if (user.id === service.professionalId) { toast('No puedes solicitar tu propio servicio', 'error'); return; }
  $('#requestServiceName').value = service.title;
  $('#requestProfessional').value = service.professionalName;
  $('#requestPrice').value = formatCurrency(service.price);
  $('#requestServiceId').value = service.id;
  $('#requestProfessionalId').value = service.professionalId;
  $('#requestMessage').value = '';
  const err = $('#requestMessageError');
  if (err) err.classList.remove('show');
  const group = $('#requestMessage')?.closest('.form-group');
  if (group) group.classList.remove('has-error', 'is-valid');
  $('#requestModal').classList.remove('hidden');
}
$('#closeRequestModal')?.addEventListener('click', () => { $('#requestModal').classList.add('hidden'); });
$('#requestModal')?.addEventListener('click', (e) => { if (e.target === $('#requestModal')) $('#requestModal').classList.add('hidden'); });
$('#requestMessage')?.addEventListener('input', (e) => {
  const val = e.target.value;
  const err = $('#requestMessageError');
  const group = e.target.closest('.form-group');
  const valid = val.trim().length > 0;
  if (err) err.classList.toggle('show', !valid);
  if (group) { group.classList.toggle('has-error', !valid); group.classList.toggle('is-valid', valid); }
});
$('#requestServiceForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = store.getUser();
  if (!user) return;
  const serviceId = $('#requestServiceId').value;
  const proId = $('#requestProfessionalId').value;
  const message = $('#requestMessage').value.trim();
  const service = store.getServices().find(s => s.id === serviceId);
  if (!message) { toast('Escribe un mensaje para el profesional', 'error'); return; }
  const request = { id: 'req_' + Date.now(), serviceId, serviceName: service?.title || 'Servicio', professionalId: proId, professionalName: service?.professionalName || 'Profesional', clientId: user.id, clientName: user.name, price: service?.price || 0, message, status: 'pending', createdAt: Date.now() };
  store.addRequest(request);
  $('#requestModal').classList.add('hidden');
  toast('¡Solicitud enviada al profesional!');
  e.target.reset();
});

/* ========== CLIENT DASHBOARD ========== */
function renderClientDashboard() {
  const user = store.getUser();
  if (!user) return;
  $('#clientName').textContent = user.name;
  $('#clientAvatar').textContent = user.name.charAt(0).toUpperCase();
  const requests = store.getRequests().filter(r => r.clientId === user.id);
  const favs = store.getFavorites();
  $('#clientTotalRequests').textContent = requests.length;
  $('#clientActiveRequests').textContent = requests.filter(r => r.status === 'accepted' || r.status === 'pending').length;
  $('#clientFavoritesCount').textContent = favs.length;
  const recent = requests.slice(-5).reverse();
  if (recent.length > 0) {
    $('#clientRecentActivity').innerHTML = recent.map(r => {
      const colors = { pending: 'orange', accepted: 'green', rejected: 'orange', completed: 'green' };
      const labels = { pending: 'Pendiente', accepted: 'Aceptada', rejected: 'Rechazada', completed: 'Completada' };
      return `<div class="activity-item"><span class="activity-dot ${colors[r.status] || 'blue'}"></span><span class="activity-text">Solicitud a <strong>${r.professionalName}</strong> — ${r.serviceName}</span><span class="badge badge-${r.status}">${labels[r.status]}</span><span class="activity-time">${timeAgo(r.createdAt)}</span></div>`;
    }).join('');
  }
  renderClientRequests(requests);
  renderClientFavorites();
  renderClientSettings();
}
function renderClientRequests(requests) {
  const container = $('#clientRequestsList');
  if (requests.length === 0) { container.innerHTML = '<div class="request-empty">No has enviado solicitudes aún.</div>'; return; }
  container.innerHTML = [...requests].reverse().map(r => {
    const labels = { pending: 'Pendiente', accepted: 'Aceptada', rejected: 'Rechazada', completed: 'Completada' };
    return `<div class="request-card"><div class="request-info"><h4>${r.serviceName}</h4><p>Profesional: ${r.professionalName} — ${formatCurrency(r.price)}</p><p style="margin-top:4px">${r.message}</p></div><span class="badge badge-${r.status}">${labels[r.status]}</span></div>`;
  }).join('');
}
function renderClientFavorites() {
  const favs = store.getFavorites();
  const services = store.getServices().filter(s => favs.includes(s.id));
  const grid = $('#clientFavoritesGrid');
  grid.innerHTML = services.length > 0 ? services.map(s => renderServiceCard(s)).join('') : '<p class="empty-text">No tienes favoritos guardados</p>';
  bindServiceCards();
}
function renderClientSettings() {
  const user = store.getUser();
  $('#clientSettingsForm').innerHTML = `<div class="form-group"><label>Nombre</label><input type="text" id="settingsName" value="${user.name}"></div><div class="form-group"><label>Email</label><input type="email" id="settingsEmail" value="${user.email}" readonly class="input-readonly"></div><div class="form-group"><label>Nueva contraseña (dejar vacío para no cambiar)</label><input type="password" id="settingsPassword" placeholder="••••••••"></div><button class="btn btn-primary" id="saveClientSettings">Guardar cambios</button>`;
  $('#saveClientSettings').addEventListener('click', () => {
    const name = $('#settingsName').value.trim();
    const password = $('#settingsPassword').value;
    if (!name) { toast('El nombre es obligatorio', 'error'); return; }
    const users = store.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) { users[idx].name = name; if (password.length >= 6) users[idx].password = password; store.setUsers(users); store.setUser(users[idx]); updateNav(); toast('Configuración guardada'); }
  });
}

/* ========== PROFESSIONAL DASHBOARD ========== */
function renderProDashboard() {
  const user = store.getUser();
  if (!user) return;
  $('#proName').textContent = user.name;
  $('#proAvatar').textContent = user.name.charAt(0).toUpperCase();
  const myServices = store.getServices().filter(s => s.professionalId === user.id);
  const myRequests = store.getRequests().filter(r => r.professionalId === user.id);
  const completedRequests = myRequests.filter(r => r.status === 'completed');
  const grossEarnings = completedRequests.reduce((a, r) => a + r.price, 0);
  const netEarnings = grossEarnings * (1 - COMMISSION_RATE);
  const avgRating = myServices.length > 0 ? (myServices.reduce((a, s) => a + s.rating, 0) / myServices.length).toFixed(1) : '—';
  $('#proTotalServices').textContent = myServices.length;
  $('#proTotalRequests').textContent = myRequests.length;
  $('#proTotalEarnings').textContent = formatCurrency(netEarnings);
  $('#proAvgRating').textContent = avgRating;
  const recent = myRequests.slice(-5).reverse();
  if (recent.length > 0) {
    $('#proRecentActivity').innerHTML = recent.map(r => {
      const colors = { pending: 'orange', accepted: 'green', rejected: 'orange', completed: 'green' };
      const labels = { pending: 'Pendiente', accepted: 'Aceptada', rejected: 'Rechazada', completed: 'Completada' };
      return `<div class="activity-item"><span class="activity-dot ${colors[r.status] || 'blue'}"></span><span class="activity-text">Solicitud de <strong>${r.clientName}</strong> — ${r.serviceName}</span><span class="badge badge-${r.status}">${labels[r.status]}</span><span class="activity-time">${timeAgo(r.createdAt)}</span></div>`;
    }).join('');
  }
  renderProServices(myServices);
  renderProRequests(myRequests);
  renderEarnings(completedRequests, grossEarnings, netEarnings);
  renderProSettings();
}
function renderProServices(myServices) {
  const container = $('#proServicesList');
  if (myServices.length === 0) { container.innerHTML = '<div class="request-empty">No has publicado servicios aún.</div>'; return; }
  container.innerHTML = myServices.map(s => `<div class="my-service-card"><span class="service-icon">${getCategoryIcon(s.category)}</span><div class="service-info"><h4>${s.title}</h4><p>${getCategoryName(s.category)} — ${s.reviewCount} reseñas — ${s.rating} ★</p></div><span class="service-price">${formatCurrency(s.price)}</span><div class="my-service-actions"><button class="btn btn-ghost btn-sm" onclick="editService('${s.id}')">Editar</button><button class="btn btn-danger btn-sm" onclick="deleteService('${s.id}')">Eliminar</button></div></div>`).join('');
}
function renderProRequests(myRequests) {
  const container = $('#proRequestsList');
  if (myRequests.length === 0) { container.innerHTML = '<div class="request-empty">No has recibido solicitudes aún.</div>'; return; }
  container.innerHTML = [...myRequests].reverse().map(r => {
    const labels = { pending: 'Pendiente', accepted: 'Aceptada', rejected: 'Rechazada', completed: 'Completada' };
    const canRespond = r.status === 'pending';
    return `<div class="request-card"><div class="request-info"><h4>${r.serviceName}</h4><p>Cliente: ${r.clientName} — ${formatCurrency(r.price)}</p><p style="margin-top:4px;font-style:italic">"${r.message}"</p><p style="margin-top:2px;font-size:12px;color:var(--text-tertiary)">${formatDate(r.createdAt)}</p></div><div style="display:flex;align-items:center;gap:8px"><span class="badge badge-${r.status}">${labels[r.status]}</span>${canRespond ? `<button class="btn btn-success btn-sm" onclick="respondRequest('${r.id}','accepted')">Aceptar</button><button class="btn btn-danger btn-sm" onclick="respondRequest('${r.id}','rejected')">Rechazar</button>` : ''}${r.status === 'accepted' ? `<button class="btn btn-primary btn-sm" onclick="respondRequest('${r.id}','completed')">Marcar completado</button>` : ''}</div></div>`;
  }).join('');
}
function renderEarnings(completedRequests, gross, net) {
  const g = $('#earningsGross'); if (g) g.textContent = formatCurrency(gross);
  const f = $('#earningsFee'); if (f) f.textContent = formatCurrency(gross * COMMISSION_RATE);
  const n = $('#earningsNet'); if (n) n.textContent = formatCurrency(net);
  const p = $('#earningsProjects'); if (p) p.textContent = completedRequests.length;
  const history = $('#earningsHistory');
  if (!history) return;
  if (completedRequests.length === 0) { history.innerHTML = '<div class="transaction-empty">No hay transacciones completadas aún</div>'; return; }
  history.innerHTML = [...completedRequests].reverse().map(r => {
    const fee = r.price * COMMISSION_RATE;
    const netVal = r.price - fee;
    return `<div class="transaction-item"><div><strong>${r.serviceName}</strong><p style="font-size:13px;color:var(--text-secondary)">Cliente: ${r.clientName} — ${formatDate(r.createdAt)}</p></div><div style="text-align:right"><span class="transaction-amount">+${formatCurrency(netVal)}</span><span class="transaction-fee">Comisión: -${formatCurrency(fee)}</span></div></div>`;
  }).join('');
}
function renderProSettings() {
  const user = store.getUser();
  $('#proSettingsForm').innerHTML = `<div class="form-group"><label>Nombre</label><input type="text" id="proSettingsName" value="${user.name}"></div><div class="form-group"><label>Email</label><input type="email" value="${user.email}" readonly class="input-readonly"></div><div class="form-group"><label>Bio profesional</label><textarea id="proSettingsBio" rows="3">${user.bio || ''}</textarea></div><div class="form-group"><label>Categoría principal</label><select id="proSettingsCategory">${CATEGORIES.map(c => `<option value="${c.id}" ${user.category === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}</select></div><div class="form-group"><label>Nueva contraseña (dejar vacío para no cambiar)</label><input type="password" id="proSettingsPassword" placeholder="••••••••"></div><button class="btn btn-primary" id="saveProSettings">Guardar cambios</button>`;
  $('#saveProSettings').addEventListener('click', () => {
    const name = $('#proSettingsName').value.trim(); const bio = $('#proSettingsBio').value.trim();
    const category = $('#proSettingsCategory').value; const password = $('#proSettingsPassword').value;
    if (!name) { toast('El nombre es obligatorio', 'error'); return; }
    const users = store.getUsers(); const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) { users[idx].name = name; users[idx].bio = bio; users[idx].category = category; if (password.length >= 6) users[idx].password = password; store.setUsers(users); store.setUser(users[idx]); updateNav(); toast('Configuración guardada'); }
  });
}

/* ========== PUBLISH SERVICE ========== */
function renderPublishForm() {
  const catSelect = $('#serviceCategory');
  if (catSelect && catSelect.options.length <= 1) {
    catSelect.innerHTML = '<option value="">Selecciona una categoría</option>' + CATEGORIES.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('');
  }
}

function getFieldErrorId(field) {
  const map = {
    serviceTitle: 'serviceTitleError',
    serviceCategory: 'serviceCategoryError',
    serviceShortDesc: 'serviceShortDescError',
    serviceDescription: 'serviceDescriptionError',
    servicePrice: 'servicePriceError',
    serviceDelivery: 'serviceDeliveryError'
  };
  return map[field] || field + 'Error';
}

function setFieldState(id, errorId, isValid, errorMsg) {
  const input = document.getElementById(id);
  const err = document.getElementById(errorId);
  if (!input) return;
  const group = input.closest('.form-group');
  if (group) {
    group.classList.toggle('has-error', !isValid);
    group.classList.toggle('is-valid', isValid);
  }
  if (err) {
    err.textContent = errorMsg || '';
    err.classList.toggle('show', !!errorMsg);
  }
}

function updateFieldCounter(id, max) {
  const input = document.getElementById(id);
  const counterId = id === 'serviceTitle' ? 'titleCounter' : id === 'serviceShortDesc' ? 'shortDescCounter' : 'descCounter';
  const counter = document.getElementById(counterId);
  if (!input || !counter) return;
  counter.textContent = input.value.length + '/' + max;
  counter.classList.toggle('over-limit', input.value.length > max);
}

const PUBLISH_VALIDATORS = {
  serviceTitle(v) {
    if (!v.trim()) return 'El título es obligatorio';
    if (v.trim().length < 5) return 'El título debe tener al menos 5 caracteres';
    return '';
  },
  serviceShortDesc(v) {
    if (!v.trim()) return 'La descripción corta es obligatoria';
    return '';
  },
  serviceDescription(v) {
    if (!v.trim()) return 'La descripción es obligatoria';
    if (v.trim().length < 20) return 'Describe tu servicio con al menos 20 caracteres';
    return '';
  },
  serviceCategory(v) {
    if (!v) return 'Selecciona una categoría';
    return '';
  },
  servicePrice(v) {
    const n = Number(v);
    if (v === '' || Number.isNaN(n) || n <= 0) return 'Ingresa un precio válido mayor a 0';
    return '';
  },
  serviceDelivery(v) {
    const n = Number(v);
    if (v === '' || Number.isNaN(n) || n < 1) return 'Ingresa días de entrega válidos (mínimo 1)';
    return '';
  }
};

function validatePublishField(field, show = true) {
  const input = document.getElementById(field);
  if (!input) return true;
  const errorId = getFieldErrorId(field);
  const validator = PUBLISH_VALIDATORS[field];
  if (!validator) return true;
  const error = validator(input.value);
  setFieldState(field, errorId, !error, show ? error : '');
  return !error;
}

const PUBLISH_FIELDS = ['serviceTitle', 'serviceShortDesc', 'serviceDescription', 'serviceCategory', 'servicePrice', 'serviceDelivery'];

function validatePublishForm() {
  let valid = true;
  PUBLISH_FIELDS.forEach(f => {
    if (!validatePublishField(f)) valid = false;
  });
  return valid;
}

function initPublishFormBinding() {
  renderPublishForm();
  const form = $('#publishServiceForm');
  if (!form || form.dataset.bound) return;
  form.dataset.bound = '1';

  form.querySelectorAll('input, select, textarea').forEach((el) => {
    el.addEventListener('input', () => {
      validatePublishField(el.id);
      if (el.id === 'serviceTitle') updateFieldCounter('serviceTitle', 100);
      if (el.id === 'serviceShortDesc') updateFieldCounter('serviceShortDesc', 120);
      if (el.id === 'serviceDescription') updateFieldCounter('serviceDescription', 1000);
    });
    el.addEventListener('blur', () => validatePublishField(el.id));
    el.addEventListener('change', () => validatePublishField(el.id));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validatePublishForm()) { toast('Revisa los campos marcados en rojo', 'error'); return; }
    const user = store.getUser();
    if (!user) return;
    const title = $('#serviceTitle').value.trim();
    const category = $('#serviceCategory').value;
    const shortDesc = $('#serviceShortDesc').value.trim();
    const description = $('#serviceDescription').value.trim();
    const price = parseInt($('#servicePrice').value);
    const delivery = parseInt($('#serviceDelivery').value);
    const tags = $('#serviceTags').value.split(',').map(t => t.trim()).filter(Boolean);
    const service = { id: 'svc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5), title, category, description, shortDesc, price, delivery, tags, rating: 0, reviewCount: 0, professionalId: user.id, professionalName: user.name, professionalBio: user.bio || '', createdAt: Date.now() };
    if (window._editingServiceId) {
      const services = store.getServices(); const idx = services.findIndex(s => s.id === window._editingServiceId);
      if (idx !== -1) { Object.assign(services[idx], { title, category, description, shortDesc, price, delivery, tags }); store.setServices(services); toast('Servicio actualizado'); }
      window._editingServiceId = null;
      form.querySelector('button[type="submit"]').textContent = 'Publicar servicio';
    } else { store.addService(service); toast('¡Servicio publicado exitosamente!'); }
    form.reset();
    clearPublishValidation();
    updateFieldCounter('serviceTitle', 100);
    updateFieldCounter('serviceShortDesc', 120);
    updateFieldCounter('serviceDescription', 1000);
    renderProDashboard();
    const sidebar = form.closest('.dashboard-layout');
    if (sidebar) { sidebar.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active')); sidebar.querySelector('[data-tab="pro-services"]')?.classList.add('active'); sidebar.querySelectorAll('.dashboard-tab').forEach(t => t.classList.remove('active')); $('#tab-pro-services')?.classList.add('active'); }
  });
}

function clearPublishValidation() {
  PUBLISH_FIELDS.forEach(f => {
    const input = document.getElementById(f);
    if (input) {
      const group = input.closest('.form-group');
      if (group) { group.classList.remove('has-error', 'is-valid'); }
    }
    const err = document.getElementById(getFieldErrorId(f));
    if (err) err.classList.remove('show');
  });
}

window.publishValidators = { validatePublishField, validatePublishForm, setFieldState };

/* ========== SERVICE ACTIONS ========== */
window.respondRequest = function(requestId, status) {
  const requests = store.getRequests(); const idx = requests.findIndex(r => r.id === requestId);
  if (idx === -1) return; requests[idx].status = status; store.setRequests(requests);
  const labels = { accepted: 'aceptada', rejected: 'rechazada', completed: 'completada' };
  toast('Solicitud ' + labels[status]); renderProDashboard();
};
window.deleteService = function(serviceId) {
  if (!confirm('¿Estás seguro de eliminar este servicio?')) return;
  store.setServices(store.getServices().filter(s => s.id !== serviceId));
  toast('Servicio eliminado'); renderProDashboard();
};
window.editService = function(serviceId) {
  const service = store.getServices().find(s => s.id === serviceId);
  if (!service) return; showPage('professional-dashboard');
  initPublishFormBinding();
  const sidebar = $('#page-professional-dashboard .dashboard-layout');
  sidebar.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  sidebar.querySelector('[data-tab="pro-publish"]')?.classList.add('active');
  sidebar.querySelectorAll('.dashboard-tab').forEach(t => t.classList.remove('active'));
  $('#tab-pro-publish')?.classList.add('active');
  $('#serviceTitle').value = service.title; $('#serviceCategory').value = service.category;
  $('#serviceDescription').value = service.description; $('#serviceShortDesc').value = service.shortDesc;
  $('#servicePrice').value = service.price; $('#serviceDelivery').value = service.delivery;
  $('#serviceTags').value = service.tags.join(', ');
  window._editingServiceId = serviceId;
  clearPublishValidation();
  updateFieldCounter('serviceTitle', 100);
  updateFieldCounter('serviceShortDesc', 120);
  updateFieldCounter('serviceDescription', 1000);
  $('#publishServiceForm').querySelector('button[type="submit"]').textContent = 'Actualizar servicio';
};

/* ========== FAVORITES PAGE ========== */
function renderFavorites() {
  const user = store.getUser();
  if (!user) return;
  const favs = store.getFavorites();
  const services = store.getServices().filter(s => favs.includes(s.id));
  const grid = $('#favoritesGrid'); const empty = $('#emptyFavorites');
  if (services.length === 0) { grid.innerHTML = ''; empty.classList.remove('hidden'); }
  else { empty.classList.add('hidden'); grid.innerHTML = services.map(s => renderServiceCard(s)).join(''); bindServiceCards(); }
}

/* ========================================================================
   NEW SaaS FEATURES
   ======================================================================== */

/* ========== HOME (NEW LANDING) ========== */
function renderHome() {
  const container = $('#homeContent');
  if (!container) return;
  const templates = SITE_TEMPLATES.slice(0, 3);
  container.innerHTML = `
    <div class="hero"><div class="hero-bg"><div class="hero-gradient"></div><div class="hero-grid"></div></div><div class="hero-content"><div class="hero-badge">Creador de sitios web #1</div><h1 class="hero-title">Crea tu sitio web <span class="gradient-text">en minutos</span></h1><p class="hero-subtitle">Elige una plantilla, personalízalo y publica tu sitio profesional. Sin código, sin complicaciones.</p><div class="hero-actions"><button class="btn btn-primary btn-lg" data-navigate="templates">Empezar gratis</button><button class="btn btn-outline btn-lg" data-navigate="pricing">Ver planes</button></div><div class="hero-stats"><div class="stat"><span class="stat-number">10,000+</span><span class="stat-label">Sitios creados</span></div><div class="stat"><span class="stat-number">50+</span><span class="stat-label">Plantillas</span></div><div class="stat"><span class="stat-number">99.9%</span><span class="stat-label">Uptime</span></div></div></div></div>
    <div class="section section-dark"><div class="container"><div class="section-header"><h2 class="section-title">¿Cómo funciona?</h2><p class="section-subtitle">Tres pasos para tener tu sitio web online</p></div><div class="steps-grid"><div class="step-card"><div class="step-number">01</div><h3>Elige una plantilla</h3><p>Selecciona entre nuestras plantillas profesionales diseñadas para cada tipo de negocio</p></div><div class="step-card"><div class="step-number">02</div><h3>Personaliza</h3><p>Edita colores, textos, imágenes y secciones con nuestro editor visual intuitivo</p></div><div class="step-card"><div class="step-number">03</div><h3>Publica</h3><p>Un clic y tu sitio está online con hosting incluido y dominio personalizado</p></div></div></div></div>
    <div class="section"><div class="container"><div class="section-header"><h2 class="section-title">¿Por qué elegirnos?</h2><p class="section-subtitle">Todo lo que necesitas para crear tu presencia digital</p></div><div class="benefits-grid"><div class="benefit-card"><div class="benefit-icon">⚡</div><h3>Ultrarrápido</h3><p>Sites optimizados con CDN global y carga instantánea</p></div><div class="benefit-card"><div class="benefit-icon">🎨</div><h3>Personalizable</h3><p>Colores, fuentes, secciones y contenido editables al instante</p></div><div class="benefit-card"><div class="benefit-icon">📱</div><h3>Responsive</h3><p>Tus sitios se ven perfectos en móvil, tablet y escritorio</p></div><div class="benefit-card"><div class="benefit-icon">🔍</div><h3>SEO optimizado</h3><p>Meta tags, sitemap y estructura optimizada para Google</p></div><div class="benefit-card"><div class="benefit-icon">🔒</div><h3>SSL incluido</h3><p>Certificado de seguridad gratuito para todos los sitios</p></div><div class="benefit-card"><div class="benefit-icon">📊</div><h3>Analytics</h3><p>Estadísticas de visitantes y rendimiento en tiempo real</p></div></div></div></div>
    <div class="section section-dark"><div class="container"><div class="section-header"><h2 class="section-title">Plantillas destacadas</h2><p class="section-subtitle">Diseños profesionales listos para personalizar</p></div><div class="templates-grid">${templates.map(t => `<div class="template-card"><div class="template-preview" style="background:${t.gradient}"><span class="template-preview-icon">${t.icon}</span></div><div class="template-card-body"><h3>${t.name}</h3><p>${t.description}</p><button class="btn btn-primary btn-sm" data-navigate="templates">Ver plantillas</button></div></div>`).join('')}</div></div></div>
    <div class="section"><div class="container"><div class="section-header"><h2 class="section-title">Planes y precios</h2><p class="section-subtitle">Elige el plan que mejor se adapte a tu negocio</p></div><div class="pricing-grid">${Object.values(PLANS).map(plan => `<div class="pricing-card ${plan.id === 'pro' ? 'pricing-featured' : ''}">${plan.id === 'pro' ? '<div class="pricing-badge">Más popular</div>' : ''}<h3 class="pricing-name">${plan.name}</h3><div class="pricing-price"><span class="pricing-amount">${plan.price === 0 ? 'Gratis' : formatCurrency(plan.price)}</span>${plan.price > 0 ? '<span class="pricing-period">/' + plan.period + '</span>' : ''}</div><ul class="pricing-features">${plan.features.map(f => `<li>✓ ${f}</li>`).join('')}</ul><button class="btn ${plan.id === 'pro' ? 'btn-primary' : 'btn-outline'} btn-block" data-navigate="${store.getUser() ? 'pricing' : 'register'}">${plan.price === 0 ? 'Empezar gratis' : 'Seleccionar plan'}</button></div>`).join('')}</div></div></div>
    <div class="section section-dark"><div class="container"><div class="section-header"><h2 class="section-title">Preguntas frecuentes</h2><p class="section-subtitle">Resolvemos tus dudas</p></div><div class="faq-list"><div class="faq-item"><div class="faq-question">¿Necesito saber programar?</div><div class="faq-answer">No, para nada. Nuestro editor visual te permite crear y personalizar tu sitio sin escribir una sola línea de código.</div></div><div class="faq-item"><div class="faq-question">¿Puedo usar mi propio dominio?</div><div class="faq-answer">Sí, con los planes Pro y Business puedes conectar tu propio dominio personalizado.</div></div><div class="faq-item"><div class="faq-question">¿Hay costo de hosting?</div><div class="faq-answer">No, el hosting está incluido en todos los planes con CDN, SSL y backups automáticos.</div></div><div class="faq-item"><div class="faq-question">¿Puedo cambiar de plan después?</div><div class="faq-answer">Sí, puedes actualizar o reducir tu plan en cualquier momento.</div></div><div class="faq-item"><div class="faq-question">¿Mis datos están seguros?</div><div class="faq-answer">Absolutamente. Usamos encriptación SSL, backups diarios, y cumplimos con GDPR.</div></div></div></div></div>
    <div class="section cta-section"><div class="container"><div class="cta-card"><h2>¿Listo para crear tu sitio?</h2><p>Empieza gratis hoy mismo. Sin tarjeta de crédito, sin compromiso.</p><button class="btn btn-primary btn-lg" data-navigate="templates">Comenzar ahora</button></div></div></div>
    <footer class="footer"><div class="container"><div class="footer-grid"><div class="footer-brand"><span class="logo-icon">◆</span><span class="logo-text">WebEmpire</span><p>Crea sitios web profesionales en minutos.</p></div><div class="footer-col"><h4>Producto</h4><a href="#" data-navigate="templates">Plantillas</a><a href="#" data-navigate="pricing">Precios</a><a href="#" data-navigate="marketplace">Servicios</a></div><div class="footer-col"><h4>Empresa</h4><a href="#">Sobre nosotros</a><a href="#">Blog</a><a href="#">Contacto</a></div><div class="footer-col"><h4>Legal</h4><a href="#">Términos</a><a href="#">Privacidad</a></div></div><div class="footer-bottom"><p>© 2026 WebEmpire. Todos los derechos reservados.</p></div></div></footer>`;
  initFAQ();
}

/* ========== FAQ ACCORDION ========== */
function initFAQ() {
  setTimeout(() => {
    $$('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        $$('.faq-item.open').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }, 50);
}


/* ========== ONBOARDING ========== */
function renderOnboarding() {
  const step = store.getUser()?.onboardingStep || 1;
  const totalSteps = 4;
  const container = $('#onboardingContent');
  const user = store.getUser();
  container.innerHTML = `
    <div class="onboarding-container">
      <div class="onboarding-progress">
        ${Array.from({length: totalSteps}, (_, i) => `<div class="progress-step ${i < step ? 'active' : ''}"><div class="progress-circle">${i < step ? '✓' : i+1}</div><span>${['Tu perfil', 'Tu negocio', 'Estilo', 'Listo'][i]}</span></div>`).join('<div class="progress-line"></div>')}
      </div>
      <div class="onboarding-card">
        ${step === 1 ? `
          <h2>Cuéntanos sobre ti</h2>
          <p class="onboarding-subtitle">Personaliza tu perfil para empezar</p>
          <div class="form-group"><label>¿Cómo te llamas?</label><input type="text" id="obName" value="${user?.name || ''}"></div>
          <div class="form-group"><label>¿Qué tipo de negocio tienes?</label>
            <select id="obBusinessType">
              <option value="">Selecciona una categoría</option>
              ${CATEGORIES.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('')}
            </select>
          </div>
        ` : ''}
        ${step === 2 ? `
          <h2>Describe tu negocio</h2>
          <p class="onboarding-subtitle">Ayúdanos a entender tu proyecto</p>
          <div class="form-group"><label>Nombre del negocio</label><input type="text" id="obBusinessName" placeholder="Mi Empresa S.A."></div>
          <div class="form-group"><label>Descripción corta</label><textarea id="obBusinessDesc" rows="3" placeholder="¿Qué hace tu negocio?"></textarea></div>
          <div class="form-group"><label>¿Tienes sitio web actual?</label>
            <div class="radio-group">
              <label class="radio-option"><input type="radio" name="hasWebsite" value="yes"> Sí</label>
              <label class="radio-option"><input type="radio" name="hasWebsite" value="no" checked> No, quiero crear uno</label>
            </div>
          </div>
        ` : ''}
        ${step === 3 ? `
          <h2>Elige tu estilo</h2>
          <p class="onboarding-subtitle">Selecciona el que más te guste</p>
          <div class="style-grid">
            ${SITE_TEMPLATES.slice(0, 4).map(t => `
              <div class="style-option" data-template="${t.id}">
                <div class="style-preview" style="background:${t.gradient}"><span>${t.icon}</span></div>
                <span class="style-name">${t.name}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
        ${step === 4 ? `
          <div class="onboarding-complete">
            <div class="complete-icon">🎉</div>
            <h2>¡Todo listo!</h2>
            <p>Tu sitio está casi listo. Ahora puedes personalizarlo con nuestro editor visual.</p>
          </div>
        ` : ''}
        <div class="onboarding-actions">
          ${step > 1 ? '<button class="btn btn-ghost" id="obBack">Atrás</button>' : '<span></span>'}
          ${step < totalSteps ? '<button class="btn btn-primary" id="obNext">Continuar</button>' : '<button class="btn btn-primary" id="obFinish">Crear mi sitio</button>'}
        </div>
      </div>
    </div>`;
  if (step === 3) {
    $$('.style-option').forEach(opt => {
      opt.addEventListener('click', () => {
        $$('.style-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
      });
    });
  }
  $('#obNext')?.addEventListener('click', () => updateOnboardingStep(step + 1));
  $('#obBack')?.addEventListener('click', () => updateOnboardingStep(step - 1));
  $('#obFinish')?.addEventListener('click', () => completeOnboarding());
}

function updateOnboardingStep(step) {
  const user = store.getUser();
  if (user) { user.onboardingStep = step; store.setUser(user); }
  renderOnboarding();
}

function completeOnboarding() {
  const user = store.getUser();
  const selected = $('.style-option.selected');
  const templateId = selected?.dataset.template || SITE_TEMPLATES[0].id;
  const template = SITE_TEMPLATES.find(t => t.id === templateId);
  const subdomain = (user?.name || 'mysite').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20);
  const site = createSite({
    userId: user.id,
    name: template?.name || 'Mi Sitio',
    templateId,
    subdomain,
    sections: template?.sections?.map(s => ({...s, id: 'sec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)})) || []
  });
  store.addSite(site);
  store.setOnboardingComplete();
  toast('¡Sitio creado exitosamente!');
  window._editorSiteId = site.id;
  showPage('editor');
  renderEditor(site.id);
}

/* ========== TEMPLATES PAGE ========== */
function renderTemplates() {
  const container = $('#templatesContent');
  const user = store.getUser();
  container.innerHTML = `
    <div class="templates-header">
      <h1>Plantillas profesionales</h1>
      <p>Elige una plantilla y empieza a personalizar</p>
    </div>
    <div class="templates-filters">
      <button class="btn btn-sm filter-btn active" data-filter="all">Todas</button>
      ${CATEGORIES.slice(0, 6).map(c => `<button class="btn btn-sm filter-btn" data-filter="${c.id}">${c.icon} ${c.name}</button>`).join('')}
    </div>
    <div class="templates-grid" id="templatesGrid">
      ${SITE_TEMPLATES.map(t => `
        <div class="template-card" data-category="${t.category}">
          <div class="template-preview" style="background:${t.gradient}">
            <span class="template-preview-icon">${t.icon}</span>
          </div>
          <div class="template-card-body">
            <h3>${t.name}</h3>
            <p>${t.description}</p>
            <div class="template-card-actions">
              <button class="btn btn-outline btn-sm" onclick="window._previewTemplateId='${t.id}';showPage('preview');renderPreview(null,'${t.id}')">Vista previa</button>
              <button class="btn btn-primary btn-sm" onclick="selectTemplate('${t.id}')">Usar plantilla</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>`;
  $$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterTemplates(btn.dataset.filter);
    });
  });
}

function filterTemplates(category) {
  $$('.template-card').forEach(card => {
    card.style.display = (category === 'all' || card.dataset.category === category) ? '' : 'none';
  });
}

function selectTemplate(templateId) {
  const user = store.getUser();
  if (!user) { toast('Inicia sesión para usar una plantilla', 'error'); return; }
  window._selectedTemplateId = templateId;
  showPage('create-site');
  renderCreateSite(templateId);
}

/* ========== CREATE SITE ========== */
function renderCreateSite(templateId) {
  const container = $('#createSiteContent');
  const tid = templateId || window._selectedTemplateId;
  const template = SITE_TEMPLATES.find(t => t.id === tid);
  container.innerHTML = `
    <div class="create-site-container">
      <h1>Crear nuevo sitio</h1>
      ${template ? `<p class="create-site-subtitle">Plantilla: <strong>${template.name}</strong></p>` : ''}
      <form id="createSiteForm" class="create-site-form">
        <div class="form-group"><label>Nombre del sitio</label><input type="text" id="siteNameInput" value="${template?.name || ''}" required></div>
        <div class="form-group"><label>Subdominio</label><div class="input-group"><input type="text" id="siteSubdomain" pattern="[a-z0-9-]+" required><span class="input-suffix">.webempire.com</span></div></div>
        ${!template ? `<div class="form-group"><label>Plantilla</label><select id="siteTemplateSelect" required>
          <option value="">Selecciona una plantilla</option>
          ${SITE_TEMPLATES.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
        </select></div>` : ''}
        <input type="hidden" id="siteTemplateId" value="${tid || ''}">
        <div class="form-actions">
          <button type="button" class="btn btn-ghost" data-navigate="templates">Cancelar</button>
          <button type="submit" class="btn btn-primary">Crear sitio</button>
        </div>
      </form>
    </div>`;
  $('#createSiteForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = store.getUser();
    const name = $('#siteNameInput').value.trim();
    const subdomain = $('#siteSubdomain').value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    const tplId = $('#siteTemplateId').value || $('#siteTemplateSelect')?.value;
    const tpl = SITE_TEMPLATES.find(t => t.id === tplId);
    if (!subdomain) { toast('El subdominio es obligatorio', 'error'); return; }
    const existing = store.getSites().find(s => s.subdomain === subdomain);
    if (existing) { toast('Ese subdominio ya está en uso', 'error'); return; }
    const site = createSite({
      userId: user.id, name, templateId: tplId, subdomain,
      sections: tpl?.sections?.map(s => ({...s, id: 'sec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)})) || []
    });
    store.addSite(site);
    toast('¡Sitio creado!');
    window._editorSiteId = site.id;
    showPage('editor');
    renderEditor(site.id);
  });
}

/* ========== SITE EDITOR ========== */
let currentEditorSection = null;

function renderEditor(siteId) {
  const site = store.getSites().find(s => s.id === siteId);
  if (!site) { showPage('projects'); renderProjects(); return; }
  window._editorSiteId = siteId;
  const container = $('#editorContent');
  container.innerHTML = `
    <div class="editor-layout">
      <div class="editor-sidebar">
        <div class="editor-sidebar-header">
          <h3>${site.name}</h3>
          <span class="badge badge-sm">${site.published ? 'Publicado' : 'Borrador'}</span>
        </div>
        <div class="editor-sections">
          <div class="editor-sections-header"><h4>Secciones</h4><button class="btn btn-sm btn-ghost" id="addEditorSection">+ Añadir</button></div>
          <div class="editor-section-list" id="editorSectionList">
            ${site.sections.map((s, i) => `
              <div class="editor-section-item ${i === 0 ? 'active' : ''}" data-index="${i}">
                <span class="section-icon">${getSectionIcon(s.type)}</span>
                <span class="section-label">${getSectionLabel(s.type)}</span>
                <div class="section-actions">
                  ${i > 0 ? `<button class="btn-icon" onclick="moveEditorSection(${i},-1)">↑</button>` : ''}
                  ${i < site.sections.length - 1 ? `<button class="btn-icon" onclick="moveEditorSection(${i},1)">↓</button>` : ''}
                  <button class="btn-icon btn-danger-icon" onclick="removeEditorSection(${i})">×</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="editor-sidebar-actions">
          <button class="btn btn-outline btn-block btn-sm" onclick="refreshEditorPreview()">↻ Vista previa</button>
          <button class="btn btn-primary btn-block btn-sm" id="saveEditorBtn">Guardar</button>
        </div>
      </div>
      <div class="editor-main">
        <div class="editor-topbar">
          <div class="editor-device-toggle">
            <button class="device-btn active" data-device="desktop">🖥</button>
            <button class="device-btn" data-device="tablet">📱</button>
            <button class="device-btn" data-device="mobile">📱</button>
          </div>
          <div class="editor-topbar-actions">
            <button class="btn btn-ghost btn-sm" onclick="navigateToPreview()">Vista completa</button>
          </div>
        </div>
        <div class="editor-preview" id="editorPreview"></div>
      </div>
      <div class="editor-properties" id="editorProperties">
        <div class="editor-properties-header"><h4>Propiedades</h4></div>
        <div id="editorPropertiesContent"><p class="text-muted">Selecciona una sección para editar</p></div>
      </div>
    </div>`;
  if (site.sections.length > 0) {
    selectEditorSection(0);
  }
  renderEditorPreview(site);
  $('#saveEditorBtn').addEventListener('click', () => saveCurrentSite());
  $$('.device-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.device-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const device = btn.dataset.device;
      const preview = $('#editorPreview');
      preview.className = 'editor-preview device-' + device;
    });
  });
  $('#addEditorSection').addEventListener('click', () => addEditorSection());
}

function getSectionIcon(type) {
  const icons = { hero: '🏠', services: '📦', testimonials: '💬', contact: '✉', gallery: '🖼', pricing: '💰', faq: '❓', team: '👥', about: 'ℹ' };
  return icons[type] || '📄';
}

function getSectionLabel(type) {
  const labels = { hero: 'Inicio', services: 'Servicios', testimonials: 'Testimonios', contact: 'Contacto', gallery: 'Galería', pricing: 'Precios', faq: 'FAQ', team: 'Equipo', about: 'Acerca de' };
  return labels[type] || type;
}

function selectEditorSection(index) {
  $$('.editor-section-item').forEach((item, i) => item.classList.toggle('active', i === index));
  currentEditorSection = index;
  const site = store.getSites().find(s => s.id === window._editorSiteId);
  if (site && site.sections[index]) {
    renderEditorProperties(site.sections[index], index);
  }
}

function renderEditorProperties(section, index) {
  const container = $('#editorPropertiesContent');
  let html = `<div class="properties-section"><h5>${getSectionLabel(section.type)}</h5>`;
  if (section.title !== undefined) html += `<div class="form-group"><label>Título</label><input type="text" value="${escapeAttr(section.title)}" onchange="updateSectionProperty(${index},'title',this.value)"></div>`;
  if (section.subtitle !== undefined) html += `<div class="form-group"><label>Subtítulo</label><input type="text" value="${escapeAttr(section.subtitle)}" onchange="updateSectionProperty(${index},'subtitle',this.value)"></div>`;
  if (section.bgImage !== undefined) html += `<div class="form-group"><label>Imagen de fondo (URL)</label><input type="text" value="${escapeAttr(section.bgImage)}" onchange="updateSectionProperty(${index},'bgImage',this.value)"></div>`;
  if (section.items && section.type === 'services') {
    html += `<div class="form-group"><label>Servicios/Productos</label><div id="servicesListEditor">`;
    section.items.forEach((item, i) => {
      html += `<div class="service-item-editor"><input type="text" value="${escapeAttr(item.name)}" placeholder="Nombre" onchange="updateSectionProperty(${index},'items.${i}.name',this.value)"><input type="text" value="${escapeAttr(item.desc)}" placeholder="Descripción" onchange="updateSectionProperty(${index},'items.${i}.desc',this.value)"><input type="text" value="${escapeAttr(item.price)}" placeholder="Precio" onchange="updateSectionProperty(${index},'items.${i}.price',this.value)"><button class="btn-icon btn-danger-icon" onclick="removeServiceItem(${index},${i})">×</button></div>`;
    });
    html += `</div><button class="btn btn-sm btn-ghost" onclick="addServiceItem(${index})">+ Añadir servicio</button></div>`;
  }
  if (section.items && section.type === 'testimonials') {
    html += `<div class="form-group"><label>Testimonios</label><div id="testimonialsListEditor">`;
    section.items.forEach((item, i) => {
      html += `<div class="testimonial-item-editor"><textarea rows="2" onchange="updateSectionProperty(${index},'items.${i}.text',this.value)">${escapeAttr(item.text)}</textarea><input type="text" value="${escapeAttr(item.author)}" placeholder="Autor" onchange="updateSectionProperty(${index},'items.${i}.author',this.value)"><button class="btn-icon btn-danger-icon" onclick="removeTestimonialItem(${index},${i})">×</button></div>`;
    });
    html += `</div><button class="btn btn-sm btn-ghost" onclick="addTestimonialItem(${index})">+ Añadir testimonio</button></div>`;
  }
  html += '</div>';
  container.innerHTML = html;
}

function escapeAttr(str) { return String(str || '').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

function updateSectionProperty(index, path, value) {
  const site = store.getSites().find(s => s.id === window._editorSiteId);
  if (!site || !site.sections[index]) return;
  const section = site.sections[index];
  if (path.includes('.')) {
    const parts = path.split('.');
    const itemIdx = parseInt(parts[1]);
    const prop = parts[2];
    if (section.items && section.items[itemIdx]) section.items[itemIdx][prop] = value;
  } else {
    section[path] = value;
  }
  site.updatedAt = Date.now();
  store.setSites(store.getSites().map(s => s.id === site.id ? site : s));
}

function addServiceItem(sectionIndex) {
  const site = store.getSites().find(s => s.id === window._editorSiteId);
  if (!site) return;
  site.sections[sectionIndex].items.push({ name: 'Nuevo servicio', desc: 'Descripción', price: '0' });
  store.setSites(store.getSites().map(s => s.id === site.id ? site : s));
  renderEditorProperties(site.sections[sectionIndex], sectionIndex);
  renderEditorPreview(site);
}

function removeServiceItem(sectionIndex, itemIndex) {
  const site = store.getSites().find(s => s.id === window._editorSiteId);
  if (!site) return;
  site.sections[sectionIndex].items.splice(itemIndex, 1);
  store.setSites(store.getSites().map(s => s.id === site.id ? site : s));
  renderEditorProperties(site.sections[sectionIndex], sectionIndex);
  renderEditorPreview(site);
}

function addTestimonialItem(sectionIndex) {
  const site = store.getSites().find(s => s.id === window._editorSiteId);
  if (!site) return;
  site.sections[sectionIndex].items.push({ text: 'Nuevo testimonio', author: 'Autor' });
  store.setSites(store.getSites().map(s => s.id === site.id ? site : s));
  renderEditorProperties(site.sections[sectionIndex], sectionIndex);
  renderEditorPreview(site);
}

function removeTestimonialItem(sectionIndex, itemIndex) {
  const site = store.getSites().find(s => s.id === window._editorSiteId);
  if (!site) return;
  site.sections[sectionIndex].items.splice(itemIndex, 1);
  store.setSites(store.getSites().map(s => s.id === site.id ? site : s));
  renderEditorProperties(site.sections[sectionIndex], sectionIndex);
  renderEditorPreview(site);
}

function addEditorSection() {
  const site = store.getSites().find(s => s.id === window._editorSiteId);
  if (!site) return;
  const types = ['hero', 'services', 'testimonials', 'contact'];
  const type = types[site.sections.length % types.length];
  const newSection = { type, id: 'sec_' + Date.now(), title: getSectionLabel(type), subtitle: '', items: type === 'services' || type === 'testimonials' ? [] : undefined, bgImage: '' };
  site.sections.push(newSection);
  site.updatedAt = Date.now();
  store.setSites(store.getSites().map(s => s.id === site.id ? site : s));
  renderEditor(site.id);
  toast('Sección añadida');
}

function removeEditorSection(index) {
  const site = store.getSites().find(s => s.id === window._editorSiteId);
  if (!site || site.sections.length <= 1) { toast('Necesitas al menos una sección', 'error'); return; }
  if (!confirm('¿Eliminar esta sección?')) return;
  site.sections.splice(index, 1);
  site.updatedAt = Date.now();
  store.setSites(store.getSites().map(s => s.id === site.id ? site : s));
  renderEditor(site.id);
  toast('Sección eliminada');
}

function moveEditorSection(index, direction) {
  const site = store.getSites().find(s => s.id === window._editorSiteId);
  if (!site) return;
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= site.sections.length) return;
  [site.sections[index], site.sections[newIndex]] = [site.sections[newIndex], site.sections[index]];
  site.updatedAt = Date.now();
  store.setSites(store.getSites().map(s => s.id === site.id ? site : s));
  renderEditor(site.id);
}

function saveCurrentSite() {
  const site = store.getSites().find(s => s.id === window._editorSiteId);
  if (!site) return;
  site.updatedAt = Date.now();
  store.setSites(store.getSites().map(s => s.id === site.id ? site : s));
  toast('Sitio guardado');
}

function refreshEditorPreview() {
  const site = store.getSites().find(s => s.id === window._editorSiteId);
  if (site) renderEditorPreview(site);
}

function renderEditorPreview(site) {
  const container = $('#editorPreview');
  if (!container || !site) return;
  container.innerHTML = site.sections.map(section => {
    let html = '<div class="preview-section">';
    if (section.type === 'hero') {
      html += `<div class="preview-hero" ${section.bgImage ? `style="background-image:url('${section.bgImage}')"` : ''}><h1>${section.title || ''}</h1><p>${section.subtitle || ''}</p></div>`;
    } else if (section.type === 'services' && section.items) {
      html += `<div class="preview-services"><h2>${section.title || ''}</h2><div class="preview-services-grid">${section.items.map(item => `<div class="preview-service-card"><h3>${item.name}</h3><p>${item.desc}</p><span class="preview-price">${item.price}</span></div>`).join('')}</div></div>`;
    } else if (section.type === 'testimonials' && section.items) {
      html += `<div class="preview-testimonials"><h2>${section.title || ''}</h2><div class="preview-testimonials-grid">${section.items.map(item => `<div class="preview-testimonial-card"><p>"${item.text}"</p><span class="preview-author">— ${item.author}</span></div>`).join('')}</div></div>`;
    } else if (section.type === 'contact') {
      html += `<div class="preview-contact"><h2>${section.title || ''}</h2><p>${section.subtitle || ''}</p><form class="preview-contact-form"><input type="text" placeholder="Nombre"><input type="email" placeholder="Email"><textarea placeholder="Mensaje"></textarea><button type="button" class="btn btn-primary">Enviar</button></form></div>`;
    }
    html += '</div>';
    return html;
  }).join('');
}

function navigateToPreview() {
  const site = store.getSites().find(s => s.id === window._editorSiteId);
  if (site) { window._previewSiteId = site.id; showPage('preview'); renderPreview(site.id); }
}

/* ========== PREVIEW PAGE ========== */
function renderPreview(siteId, templateId) {
  const container = $('#previewContent');
  let site = null;
  if (siteId) {
    site = store.getSites().find(s => s.id === siteId);
  } else if (templateId) {
    const tpl = SITE_TEMPLATES.find(t => t.id === templateId);
    if (tpl) site = { name: tpl.name, sections: tpl.sections, subdomain: 'preview', published: false };
  }
  if (!site) { container.innerHTML = '<p>Sitio no encontrado</p>'; return; }
  container.innerHTML = `
    <div class="preview-topbar">
      <button class="btn btn-ghost btn-sm" data-navigate="editor">← Volver al editor</button>
      <div class="preview-device-toggle">
        <button class="device-btn active" data-device="desktop" onclick="setPreviewDevice('desktop',this)">🖥</button>
        <button class="device-btn" data-device="tablet" onclick="setPreviewDevice('tablet',this)">📱</button>
        <button class="device-btn" data-device="mobile" onclick="setPreviewDevice('mobile',this)">📱</button>
      </div>
      <div class="preview-url">${site.subdomain}.webempire.com</div>
    </div>
    <div class="preview-frame device-desktop" id="previewFrame">
      ${site.sections.map(section => {
        let html = '';
        if (section.type === 'hero') {
          html += `<div class="preview-hero" ${section.bgImage ? `style="background-image:url('${section.bgImage}')"` : ''}><h1>${section.title || ''}</h1><p>${section.subtitle || ''}</p></div>`;
        } else if (section.type === 'services' && section.items) {
          html += `<div class="preview-services"><h2>${section.title || ''}</h2><div class="preview-services-grid">${section.items.map(item => `<div class="preview-service-card"><h3>${item.name}</h3><p>${item.desc}</p><span class="preview-price">${item.price}</span></div>`).join('')}</div></div>`;
        } else if (section.type === 'testimonials' && section.items) {
          html += `<div class="preview-testimonials"><h2>${section.title || ''}</h2><div class="preview-testimonials-grid">${section.items.map(item => `<div class="preview-testimonial-card"><p>"${item.text}"</p><span class="preview-author">— ${item.author}</span></div>`).join('')}</div></div>`;
        } else if (section.type === 'contact') {
          html += `<div class="preview-contact"><h2>${section.title || ''}</h2><p>${section.subtitle || ''}</p></div>`;
        }
        return html;
      }).join('')}
    </div>`;
}

function setPreviewDevice(device, btn) {
  $$('.device-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const frame = $('#previewFrame');
  if (frame) { frame.className = 'preview-frame device-' + device; }
}

/* ========== PROJECTS PAGE ========== */
function renderProjects() {
  const user = store.getUser();
  const sites = store.getSites().filter(s => s.userId === user.id);
  const container = $('#projectsContent');
  const currentPlan = store.getCurrentPlan();
  const planLimits = { free: 1, pro: 5, business: Infinity };
  const limit = planLimits[currentPlan] || 1;
  const canCreate = sites.length < limit;
  container.innerHTML = `
    <div class="projects-header">
      <div><h1>Mis sitios</h1><p>${sites.length}/${limit === Infinity ? '∞' : limit} sitios creados</p></div>
      ${canCreate ? '<button class="btn btn-primary" data-navigate="templates">+ Nuevo sitio</button>' : '<button class="btn btn-outline" data-navigate="pricing">Actualizar plan para crear más</button>'}
    </div>
    ${sites.length === 0 ? `
      <div class="empty-state">
        <div class="empty-icon">🌐</div>
        <h3>No tienes sitios aún</h3>
        <p>Crea tu primer sitio web en minutos</p>
        <button class="btn btn-primary" data-navigate="templates">Crear sitio</button>
      </div>
    ` : `
      <div class="projects-grid">
        ${sites.map(site => {
          const tpl = SITE_TEMPLATES.find(t => t.id === site.templateId);
          return `
            <div class="project-card">
              <div class="project-preview" style="background:${tpl?.gradient || 'linear-gradient(135deg, #64748b, #475569)'}">
                <span class="project-preview-icon">${tpl?.icon || '🌐'}</span>
              </div>
              <div class="project-card-body">
                <div class="project-card-header">
                  <h3>${site.name}</h3>
                  <span class="badge badge-sm ${site.published ? 'badge-success' : 'badge-warning'}">${site.published ? 'Publicado' : 'Borrador'}</span>
                </div>
                <p class="project-url">${site.subdomain}.webempire.com</p>
                <p class="project-date">Actualizado ${timeAgo(site.updatedAt)}</p>
                <div class="project-card-actions">
                  <button class="btn btn-primary btn-sm" onclick="openEditor('${site.id}')">Editar</button>
                  <button class="btn btn-ghost btn-sm" onclick="openPreview('${site.id}')">Vista previa</button>
                  <button class="btn btn-ghost btn-sm" onclick="duplicateSite('${site.id}')">Duplicar</button>
                  <button class="btn btn-outline btn-sm" onclick="togglePublishSite('${site.id}')">${site.published ? 'Despublicar' : 'Publicar'}</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteSite('${site.id}')">Eliminar</button>
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>
    `}
    ${sites.length > 0 ? `
      <div class="projects-usage">
        <h3>Uso del plan</h3>
        <div class="usage-bar"><div class="usage-fill" style="width:${Math.min((sites.length / limit) * 100, 100)}%"></div></div>
        <p>${sites.length} de ${limit === Infinity ? '∞' : limit} sitios (${currentPlan === 'free' ? 'Gratis' : currentPlan === 'pro' ? 'Profesional' : 'Business'})</p>
        ${currentPlan === 'free' ? '<a href="#" data-navigate="pricing" class="btn btn-sm btn-outline" style="margin-top:8px">Actualizar plan</a>' : ''}
      </div>
    ` : ''}`;
}

window.openEditor = function(siteId) { window._editorSiteId = siteId; showPage('editor'); renderEditor(siteId); };
window.openPreview = function(siteId) { window._previewSiteId = siteId; showPage('preview'); renderPreview(siteId); };
window.duplicateSite = function(siteId) {
  const site = store.getSites().find(s => s.id === siteId);
  if (!site) return;
  const dup = createSite({ userId: site.userId, name: site.name + ' (copia)', templateId: site.templateId, subdomain: site.subdomain + '-copy-' + Date.now().toString(36), sections: JSON.parse(JSON.stringify(site.sections)) });
  store.addSite(dup);
  toast('Sitio duplicado');
  renderProjects();
};
window.deleteSite = function(siteId) {
  if (!confirm('¿Eliminar este sitio? Esta acción no se puede deshacer.')) return;
  store.setSites(store.getSites().filter(s => s.id !== siteId));
  toast('Sitio eliminado');
  renderProjects();
};
window.togglePublishSite = function(siteId) {
  const sites = store.getSites();
  const site = sites.find(s => s.id === siteId);
  if (!site) return;
  site.published = !site.published;
  site.updatedAt = Date.now();
  store.setSites(sites);
  toast(site.published ? 'Sitio publicado' : 'Sitio despublicado');
  renderProjects();
};

/* ========== SITE DASHBOARD ========== */
function renderSiteDashboard() {
  const user = store.getUser();
  const sites = store.getSites().filter(s => s.userId === user.id);
  const published = sites.filter(s => s.published);
  const totalViews = published.reduce((a, s) => a + Math.floor(Math.random() * 500) + 50, 0);
  const container = $('#siteDashboardContent');
  container.innerHTML = `
    <div class="site-dashboard-header"><h1>Panel del sitio</h1></div>
    <div class="site-stats-grid">
      <div class="stat-card"><div class="stat-icon">🌐</div><div class="stat-info"><span class="stat-number">${sites.length}</span><span class="stat-label">Sitios totales</span></div></div>
      <div class="stat-card"><div class="stat-icon">✅</div><div class="stat-info"><span class="stat-number">${published.length}</span><span class="stat-label">Publicados</span></div></div>
      <div class="stat-card"><div class="stat-icon">👁</div><div class="stat-info"><span class="stat-number">${totalViews.toLocaleString()}</span><span class="stat-label">Visitas totales</span></div></div>
      <div class="stat-card"><div class="stat-icon">📊</div><div class="stat-info"><span class="stat-number">${store.getCurrentPlan() === 'free' ? 'Gratis' : store.getCurrentPlan() === 'pro' ? 'Pro' : 'Business'}</span><span class="stat-label">Plan actual</span></div></div>
    </div>
    <div class="site-dashboard-grid">
      <div class="site-dashboard-section">
        <h3>Sitios recientes</h3>
        ${sites.slice(-5).reverse().map(s => `<div class="recent-site"><span class="recent-site-name">${s.name}</span><span class="badge badge-sm ${s.published ? 'badge-success' : 'badge-warning'}">${s.published ? 'Online' : 'Borrador'}</span><button class="btn btn-sm btn-ghost" onclick="openEditor('${s.id}')">Editar</button></div>`).join('') || '<p class="text-muted">No tienes sitios</p>'}
      </div>
      <div class="site-dashboard-section">
        <h3>Acciones rápidas</h3>
        <div class="quick-actions">
          <button class="btn btn-outline btn-block" data-navigate="templates">Crear nuevo sitio</button>
          <button class="btn btn-outline btn-block" data-navigate="pricing">Ver planes</button>
          <button class="btn btn-outline btn-block" data-navigate="domain">Configurar dominio</button>
        </div>
      </div>
    </div>`;
}

/* ========== PRICING PAGE ========== */
function renderPricing() {
  const user = store.getUser();
  const currentPlan = store.getCurrentPlan();
  let isAnnual = false;
  const container = $('#pricingContent');
  container.innerHTML = `
    <div class="pricing-header"><h1>Planes y precios</h1><p>Elige el plan perfecto para tu negocio</p></div>
    <div class="pricing-toggle">
      <span class="${!isAnnual ? 'active' : ''}">Mensual</span>
      <label class="toggle"><input type="checkbox" id="pricingToggle" ${isAnnual ? 'checked' : ''}><span class="toggle-slider"></span></label>
      <span class="${isAnnual ? 'active' : ''}">Anual <span class="badge badge-sm badge-success">-20%</span></span>
    </div>
    <div class="pricing-grid">
      ${Object.values(PLANS).map(plan => {
        const price = isAnnual ? Math.round(plan.price * 0.8) : plan.price;
        const isCurrent = currentPlan === plan.id;
        return `
          <div class="pricing-card ${plan.id === 'pro' ? 'pricing-featured' : ''} ${isCurrent ? 'pricing-current' : ''}">
            ${plan.id === 'pro' ? '<div class="pricing-badge">Más popular</div>' : ''}
            ${isCurrent ? '<div class="pricing-current-badge">Plan actual</div>' : ''}
            <h3 class="pricing-name">${plan.name}</h3>
            <div class="pricing-price">
              <span class="pricing-amount">${price === 0 ? 'Gratis' : formatCurrency(price)}</span>
              ${price > 0 ? '<span class="pricing-period">/mes</span>' : ''}
            </div>
            ${isAnnual && price > 0 ? `<p class="pricing-annual">Facturado ${formatCurrency(price * 12)}/año</p>` : ''}
            <ul class="pricing-features">${plan.features.map(f => `<li>✓ ${f}</li>`).join('')}</ul>
            <button class="btn ${plan.id === 'pro' ? 'btn-primary' : 'btn-outline'} btn-block" onclick="selectPlan('${plan.id}')" ${isCurrent ? 'disabled' : ''}>${isCurrent ? 'Plan actual' : price === 0 ? 'Empezar gratis' : 'Seleccionar plan'}</button>
          </div>`;
      }).join('')}
    </div>`;
  const toggle = $('#pricingToggle');
  if (toggle) {
    toggle.addEventListener('change', () => { togglePricing(toggle.checked); });
  }
}

window.togglePricing = function(isAnnual) {
  renderPricing();
  const t = $('#pricingToggle');
  if (t) t.checked = isAnnual;
}

window.selectPlan = function(planId) {
  const user = store.getUser();
  if (!user) { toast('Inicia sesión primero', 'error'); return; }
  store.setCurrentPlan(planId);
  toast('Plan actualizado a ' + PLANS[planId].name);
  renderPricing();
};

/* ========== DOMAIN PAGE ========== */
function renderDomain() {
  const user = store.getUser();
  const sites = store.getSites().filter(s => s.userId === user.id);
  const customDomain = store.getCustomDomain();
  const currentPlan = store.getCurrentPlan();
  const container = $('#domainContent');
  container.innerHTML = `
    <div class="domain-header"><h1>Configuración de dominio</h1></div>
    <div class="domain-section">
      <h3>Subdominio</h3>
      <p class="text-muted">Tu sitio está disponible en:</p>
      <div class="domain-display">
        <input type="text" id="subdomainInput" value="${sites[0]?.subdomain || user.name.toLowerCase().replace(/[^a-z0-9]/g, '')}" class="domain-input">
        <span class="domain-suffix">.webempire.com</span>
        <button class="btn btn-primary btn-sm" onclick="updateSubdomain()">Actualizar</button>
      </div>
    </div>
    <div class="domain-section">
      <h3>Dominio personalizado</h3>
      ${currentPlan === 'free' ? `
        <div class="domain-upgrade">
          <p>Actualiza tu plan para usar un dominio personalizado</p>
          <button class="btn btn-primary btn-sm" data-navigate="pricing">Ver planes</button>
        </div>
      ` : `
        <p class="text-muted">Conecta tu propio dominio</p>
        <div class="domain-display">
          <input type="text" id="customDomainInput" value="${customDomain}" placeholder="tudominio.com" class="domain-input">
          <button class="btn btn-primary btn-sm" onclick="saveCustomDomain()">Guardar</button>
        </div>
        <div class="domain-dns">
          <h4>Configuración DNS</h4>
          <p>Añade estos registros en tu proveedor de dominio:</p>
          <div class="dns-record"><code>CNAME</code> <span>tudominio.com</span> <span>→ cname.webempire.com</span></div>
          <div class="dns-record"><code>A</code> <span>@</span> <span>→ 76.76.21.21</span></div>
        </div>
      `}
    </div>
    <div class="domain-section">
      <h3>SSL & Seguridad</h3>
      <div class="ssl-status"><span class="ssl-icon">🔒</span><span>Certificado SSL activo</span><span class="badge badge-success">Automático</span></div>
    </div>`;
}

window.updateSubdomain = function() {
  const input = $('#subdomainInput');
  const value = input?.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
  if (!value) { toast('El subdominio no puede estar vacío', 'error'); return; }
  const sites = store.getSites();
  if (sites.find(s => s.subdomain === value)) { toast('Ese subdominio ya está en uso', 'error'); return; }
  const user = store.getUser();
  const userSites = sites.filter(s => s.userId === user.id);
  if (userSites.length > 0) { userSites[0].subdomain = value; store.setSites(sites); }
  toast('Subdominio actualizado');
  renderDomain();
};

window.saveCustomDomain = function() {
  const input = $('#customDomainInput');
  const value = input?.value.trim();
  if (!value) { toast('Ingresa un dominio', 'error'); return; }
  store.setCustomDomain(value);
  toast('Dominio personalizado guardado');
  renderDomain();
};

/* ========== USER DASHBOARD ========== */
function renderDashboard() {
  const user = store.getUser();
  if (!user) return;
  const sites = store.getSites().filter(s => s.userId === user.id);
  const currentPlan = store.getCurrentPlan();
  const container = $('#dashboardContent');
  container.innerHTML = `
    <div class="user-dashboard">
      <div class="dashboard-sidebar">
        <div class="dashboard-user-info">
          <div class="dashboard-avatar">${user.name.charAt(0).toUpperCase()}</div>
          <h3>${user.name}</h3>
          <p class="text-muted">${user.email}</p>
          <span class="badge">${currentPlan === 'free' ? 'Gratis' : currentPlan === 'pro' ? 'Pro' : 'Business'}</span>
        </div>
        <nav class="dashboard-nav">
          <a href="#" class="active" data-tab="overview" onclick="switchDashboardTab('overview')">Resumen</a>
          <a href="#" data-tab="sites" onclick="switchDashboardTab('sites')">Mis sitios</a>
          <a href="#" data-tab="domains" onclick="switchDashboardTab('domains')">Dominios</a>
          <a href="#" data-tab="settings" onclick="switchDashboardTab('settings')">Configuración</a>
          <a href="#" data-tab="billing" onclick="switchDashboardTab('billing')">Facturación</a>
        </nav>
      </div>
      <div class="dashboard-main">
        <div class="dashboard-tab active" id="tab-overview">
          <h2>Resumen</h2>
          <div class="overview-stats">
            <div class="stat-card"><span class="stat-number">${sites.length}</span><span class="stat-label">Sitios</span></div>
            <div class="stat-card"><span class="stat-number">${sites.filter(s => s.published).length}</span><span class="stat-label">Publicados</span></div>
            <div class="stat-card"><span class="stat-number">${currentPlan === 'free' ? 'Gratis' : formatCurrency(PLANS[currentPlan]?.price) + '/mes'}</span><span class="stat-label">Plan</span></div>
          </div>
          <div class="overview-actions">
            <button class="btn btn-primary" data-navigate="templates">Crear nuevo sitio</button>
            <button class="btn btn-outline" data-navigate="pricing">Ver planes</button>
          </div>
        </div>
        <div class="dashboard-tab" id="tab-sites">
          <h2>Mis sitios</h2>
          ${sites.length > 0 ? sites.map(s => `<div class="site-list-item"><span>${s.name}</span><span class="badge badge-sm ${s.published ? 'badge-success' : 'badge-warning'}">${s.published ? 'Online' : 'Borrador'}</span><button class="btn btn-sm btn-ghost" onclick="openEditor('${s.id}')">Editar</button></div>`).join('') : '<p class="text-muted">No tienes sitios aún</p>'}
          <button class="btn btn-primary btn-sm" style="margin-top:12px" data-navigate="templates">Crear sitio</button>
        </div>
        <div class="dashboard-tab" id="tab-domains">
          <h2>Dominios</h2>
          <a href="#" data-navigate="domain" class="btn btn-outline btn-sm">Configurar dominios →</a>
        </div>
        <div class="dashboard-tab" id="tab-settings">
          <h2>Configuración</h2>
          <form id="dashboardSettingsForm">
            <div class="form-group"><label>Nombre</label><input type="text" id="dashSettingsName" value="${user.name}"></div>
            <div class="form-group"><label>Email</label><input type="email" value="${user.email}" readonly class="input-readonly"></div>
            <div class="form-group"><label>Nueva contraseña</label><input type="password" id="dashSettingsPassword" placeholder="Dejar vacío para no cambiar"></div>
            <button type="button" class="btn btn-primary" onclick="renderDashboardSettings()">Guardar</button>
          </form>
        </div>
        <div class="dashboard-tab" id="tab-billing">
          <h2>Facturación</h2>
          <div class="billing-plan">
            <h3>Plan actual: ${currentPlan === 'free' ? 'Gratis' : PLANS[currentPlan]?.name + ' (' + formatCurrency(PLANS[currentPlan]?.price) + '/mes)'}</h3>
            <p>${currentPlan === 'free' ? 'Estás en el plan gratuito.' : 'Próxima facturación: ' + new Date(Date.now() + 30*86400000).toLocaleDateString('es-ES')}</p>
            <button class="btn btn-outline btn-sm" data-navigate="pricing">Cambiar plan</button>
          </div>
        </div>
      </div>
    </div>`;
}

window.switchDashboardTab = function(tab) {
  $$('.dashboard-nav a').forEach(a => a.classList.toggle('active', a.dataset.tab === tab));
  $$('.dashboard-tab').forEach(t => t.classList.toggle('active', t.id === 'tab-' + tab));
};

window.renderDashboardSettings = function() {
  const user = store.getUser();
  const name = $('#dashSettingsName')?.value.trim();
  const password = $('#dashSettingsPassword')?.value;
  if (!name) { toast('El nombre es obligatorio', 'error'); return; }
  const users = store.getUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx !== -1) {
    users[idx].name = name;
    if (password && password.length >= 6) users[idx].password = password;
    store.setUsers(users);
    store.setUser(users[idx]);
    updateNav();
    toast('Configuración guardada');
  }
};

/* ========== INIT ========== */
seedData();
initTheme();
updateNav();
initPublishFormBinding();
updateFavoritesCounter();
showPage('home');
renderHome();

/* ========== PRIVACY BANNER ========== */
(function initPrivacyBanner() {
  const KEY = 'webempire_cookie_consent';
  const banner = document.getElementById('privacyBanner');
  if (!banner) return;

  function loadPrefs() {
    try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch { return null; }
  }
  function savePrefs(prefs) { localStorage.setItem(KEY, JSON.stringify(prefs)); }
  function hideBanner() { banner.classList.add('hidden'); }

  const prefs = loadPrefs();
  if (prefs && prefs.accepted) { hideBanner(); return; }

  banner.classList.remove('hidden');

  document.getElementById('acceptCookies')?.addEventListener('click', () => {
    savePrefs({ accepted: true, essential: true, analytics: true, marketing: true, preferences: true });
    hideBanner();
    toast('Cookies aceptadas', 'info');
  });

  document.getElementById('privacyReject')?.addEventListener('click', () => {
    savePrefs({ accepted: true, essential: true, analytics: false, marketing: false, preferences: false });
    hideBanner();
    toast('Solo cookies esenciales activas', 'info');
  });

  const settingsBtn = document.getElementById('privacySettings');
  const modal = document.getElementById('privacyModal');
  const closeBtn = document.getElementById('closePrivacyModal');
  const cancelBtn = document.getElementById('privacyModalCancel');
  const saveBtn = document.getElementById('privacyModalSave');

  if (settingsBtn && modal) {
    settingsBtn.addEventListener('click', () => {
      const current = loadPrefs();
      const ca = document.getElementById('cookieAnalytics');
      const cm = document.getElementById('cookieMarketing');
      const cp = document.getElementById('cookiePreferences');
      if (current) { if (ca) ca.checked = current.analytics; if (cm) cm.checked = current.marketing; if (cp) cp.checked = current.preferences; }
      modal.classList.remove('hidden');
      modal.querySelector('.modal-close')?.focus();
    });
  }

  function closeModal() { modal?.classList.add('hidden'); settingsBtn?.focus(); }

  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) closeModal();
  });

  saveBtn?.addEventListener('click', () => {
    const ca = document.getElementById('cookieAnalytics')?.checked || false;
    const cm = document.getElementById('cookieMarketing')?.checked || false;
    const cp = document.getElementById('cookiePreferences')?.checked || false;
    savePrefs({ accepted: true, essential: true, analytics: ca, marketing: cm, preferences: cp });
    closeModal();
    hideBanner();
    toast('Preferencias de cookies guardadas', 'info');
  });
})();

/* ========== ACCESSIBILITY TOGGLES ========== */
(function initAccessibilityToggles() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileBtn.setAttribute('aria-expanded', String(isOpen));
      mobileBtn.textContent = isOpen ? '✕' : '☰';
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileBtn.setAttribute('aria-expanded', 'false');
        mobileBtn.textContent = '☰';
      });
    });
  }

  const userBtn = document.getElementById('userAvatarBtn');
  const userDropdown = document.getElementById('userDropdown');
  if (userBtn && userDropdown) {
    userBtn.addEventListener('click', () => {
      const isOpen = userDropdown.classList.toggle('show');
      userBtn.setAttribute('aria-expanded', String(isOpen));
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#userMenu')) {
        userDropdown.classList.remove('show');
        userBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const openFilters = document.getElementById('openFilters');
  const closeFilters = document.getElementById('closeFilters');
  const sidebar = document.getElementById('filtersSidebar');
  if (openFilters && sidebar) {
    openFilters.addEventListener('click', () => {
      sidebar.classList.add('open');
      openFilters.setAttribute('aria-expanded', 'true');
      closeFilters?.focus();
    });
  }
  if (closeFilters && sidebar) {
    closeFilters.addEventListener('click', () => {
      sidebar.classList.remove('open');
      openFilters?.setAttribute('aria-expanded', 'false');
      openFilters?.focus();
    });
  }

  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    const updateLabel = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      themeBtn.setAttribute('aria-label', isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
    };
    updateLabel();
    themeBtn.addEventListener('click', updateLabel);
  }
})();
