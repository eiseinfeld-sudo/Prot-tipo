document.querySelectorAll('.category-link').forEach(link => {
link.addEventListener('click', e => { e.preventDefault(); document.querySelectorAll('.category-link').forEach(l => l.classList.remove('active')); link.classList.add('active'); });
        });

const categoriesMenu = document.querySelector('.categories-menu');
const categoriesToggle = document.querySelector('.categories-toggle');

function updateCategoryOverflow() {
const categoriesList = document.querySelector('.categories-list');
if (!categoriesList) return;
const categoryItems = [...categoriesList.querySelectorAll('li')];
if (!categoryItems.length) return;
const firstRowTop = categoryItems[0].offsetTop;
categoryItems.slice(1).forEach(item => item.classList.toggle('category-overflow', item.offsetTop > firstRowTop));
}

if (categoriesMenu && categoriesToggle) {
categoriesToggle.addEventListener('click', () => {
const expanded = categoriesMenu.classList.toggle('expanded');
categoriesToggle.setAttribute('aria-expanded', expanded);
const text = translations?.[currentLanguage] || translations.pt;
categoriesToggle.querySelector('span').textContent = expanded ? text.hideCategories : text.showCategories;
});
}

window.addEventListener('load', updateCategoryOverflow);
window.addEventListener('resize', updateCategoryOverflow);
document.addEventListener('DOMContentLoaded', updateCategoryOverflow);

const searchBox = document.querySelector('.search-box');
const searchStatus = document.querySelector('.search-status');
const searchableSections = [...document.querySelectorAll('.content-columns .content-section')];
const searchableCards = [...document.querySelectorAll('.content-columns .item-card')];

function normalizeSearchText(value) {
return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

if (searchBox) {
searchBox.addEventListener('input', () => {
const query = normalizeSearchText(searchBox.value.trim());
let visibleCards = 0;

searchableCards.forEach(card => {
const image = card.querySelector('img');
const searchableText = normalizeSearchText(`${card.textContent} ${image?.alt || ''} ${card.querySelector('a')?.href || ''}`);
const matches = !query || searchableText.includes(query);
card.hidden = !matches;
if (matches) visibleCards += 1;
});

searchableSections.forEach(section => {
section.hidden = query.length > 0 && !section.querySelector('.item-card:not([hidden])');
});

if (searchStatus) {
searchStatus.hidden = !query || visibleCards > 0;
const text = translations?.[currentLanguage] || translations.pt;
searchStatus.textContent = visibleCards ? `${visibleCards} ${visibleCards === 1 ? text.result : text.results}` : text.noResults;
}
});
}

const settingsToggle = document.querySelector('.settings-toggle');
const settingsPanel = document.querySelector('.settings-panel');
const languageOptions = document.querySelectorAll('.language-option');

const translations = {
pt: {
search: 'Pesquisar...', searchLabel: 'Pesquisar sites', settings: 'Configurações', language: 'Idioma', notifications: 'Notificações',
heroTitle: 'Lista selecionada com tudo sobre a cultura otaku.', heroSubtitle: 'Lista selecionada com tudo sobre a cultura otaku. Análises atualizadas dos melhores sites de anime/mangá, aplicativos, light novels, música, jogos, dramas asiáticos, VTubers e muito mais em um só lugar...', showCategories: 'Mostrar categorias', hideCategories: 'Ocultar categorias',
sections: ['Anime Streaming', 'Manga Reading'], media: 'Plataformas e Recursos', expand: 'Expandir detalhes⌄', collapse: 'Recolher detalhes⌃', pin: '☆ Fixar', pinned: '★ Fixado', comments: '▢ Comentários', external: 'Acessar site externo ↗', noResults: 'Nenhum site encontrado', result: 'resultado', results: 'resultados', top: '↑ Voltar ao topo',
sidebarHeadings: ['Índice', 'Categorias', 'Páginas']
},
en: {
search: 'Search...', searchLabel: 'Search sites', settings: 'Settings', language: 'Language', notifications: 'Notifications',
heroTitle: 'A curated list with everything about otaku culture.', heroSubtitle: 'A curated list with updated reviews of the best anime and manga sites, apps, light novels, music, games, Asian dramas, VTubers and much more in one place...', showCategories: 'Show categories', hideCategories: 'Hide categories',
sections: ['Anime Streaming', 'Manga Reading'], media: 'Platforms and Resources', expand: 'Expand details⌄', collapse: 'Collapse details⌃', pin: '☆ Pin', pinned: '★ Pinned', comments: '▢ Comments', external: 'Visit external site ↗', noResults: 'No sites found', result: 'result', results: 'results', top: '↑ Back to top',
sidebarHeadings: ['Index', 'Categories', 'Pages']
},
es: {
search: 'Buscar...', searchLabel: 'Buscar sitios', settings: 'Configuración', language: 'Idioma', notifications: 'Notificaciones',
heroTitle: 'Lista seleccionada con todo sobre la cultura otaku.', heroSubtitle: 'Lista seleccionada con análisis actualizados de los mejores sitios de anime y manga, aplicaciones, novelas ligeras, música, juegos, dramas asiáticos, VTubers y mucho más en un solo lugar...', showCategories: 'Mostrar categorías', hideCategories: 'Ocultar categorías',
sections: ['Anime Streaming', 'Manga Reading'], media: 'Plataformas y Recursos', expand: 'Expandir detalles⌄', collapse: 'Replegar detalles⌃', pin: '☆ Fijar', pinned: '★ Fijado', comments: '▢ Comentarios', external: 'Visitar sitio externo ↗', noResults: 'No se encontraron sitios', result: 'resultado', results: 'resultados', top: '↑ Volver arriba',
sidebarHeadings: ['Índice', 'Categorías', 'Páginas']
}
};

let currentLanguage = localStorage.getItem('tudomoe-language') || 'pt';

function applyLanguage(language) {
const text = translations[language] || translations.pt;
currentLanguage = language;
localStorage.setItem('tudomoe-language', language);
document.documentElement.lang = language === 'pt' ? 'pt-BR' : language;
document.querySelector('.search-box')?.setAttribute('placeholder', text.search);
document.querySelector('.search-box')?.setAttribute('aria-label', text.searchLabel);
document.querySelector('.settings-panel strong').textContent = text.settings;
document.querySelector('.language-label').textContent = text.language;
document.querySelector('.settings-notifications').textContent = text.notifications;
document.querySelector('.hero-title').textContent = text.heroTitle;
document.querySelector('.hero-subtitle').textContent = text.heroSubtitle;
document.querySelector('.categories-toggle span')?.replaceChildren(document.createTextNode(categoriesMenu?.classList.contains('expanded') ? text.hideCategories : text.showCategories));
document.querySelectorAll('.content-title').forEach((title, index) => { title.textContent = text.sections[index] || title.textContent; });
document.querySelector('.media-title')?.replaceChildren(document.createTextNode(text.media));
document.querySelectorAll('.sidebar-section h4').forEach((heading, index) => { heading.textContent = text.sidebarHeadings[index] || heading.textContent; });
document.querySelectorAll('.item-expand').forEach(button => { button.textContent = button.closest('.item-card').classList.contains('expanded') ? text.collapse : text.expand; });
document.querySelectorAll('.pin-toggle').forEach(button => { button.textContent = button.closest('.item-card').classList.contains('pinned') ? text.pinned : text.pin; });
document.querySelectorAll('.comments-toggle').forEach(button => { button.textContent = text.comments; });
document.querySelectorAll('.item-external-link').forEach(link => { link.textContent = text.external; });
document.querySelector('a[onclick*="scrollTo"]')?.replaceChildren(document.createTextNode(text.top));
}

languageOptions.forEach(option => option.addEventListener('click', () => applyLanguage(option.dataset.language)));

applyLanguage(currentLanguage);

if (settingsToggle && settingsPanel) {
settingsToggle.addEventListener('click', () => {
const expanded = settingsToggle.getAttribute('aria-expanded') === 'true';
settingsToggle.setAttribute('aria-expanded', !expanded);
settingsPanel.hidden = expanded;
});

document.addEventListener('click', event => {
if (!event.target.closest('.settings-menu')) {
settingsToggle.setAttribute('aria-expanded', 'false');
settingsPanel.hidden = true;
}
});

document.addEventListener('keydown', event => {
if (event.key === 'Escape') {
settingsToggle.setAttribute('aria-expanded', 'false');
settingsPanel.hidden = true;
settingsToggle.focus();
}
});
}

document.querySelectorAll('.item-expand').forEach(button => {
button.addEventListener('click', () => {
const card = button.closest('.item-card');
const expanded = card.classList.toggle('expanded');
button.setAttribute('aria-expanded', expanded);
button.textContent = expanded ? 'Recolher detalhes⌃' : 'Expandir detalhes⌄';
});
});

const pinnedStorageKey = 'tudomoe-pinned-sites';
let pinnedSites = JSON.parse(localStorage.getItem(pinnedStorageKey) || '[]');
const originalCardOrder = new Map();

document.querySelectorAll('.items-list').forEach(list => {
list.querySelectorAll('.item-card').forEach((card, index) => originalCardOrder.set(card, index));
});

function getSiteKey(card) {
const title = card.querySelector('.item-title')?.textContent.trim() || '';
const link = card.querySelector('.item-external-link')?.href || '';
return `${title}|${link}`;
}

function reorderSiteLists() {
document.querySelectorAll('.items-list').forEach(list => {
const cards = [...list.querySelectorAll('.item-card')];
cards.forEach(card => {
const pinned = pinnedSites.includes(getSiteKey(card));
card.classList.toggle('pinned', pinned);
const button = card.querySelector('.pin-toggle');
if (button) updatePinButton(button, pinned);
});
cards.sort((firstCard, secondCard) => {
const firstKey = getSiteKey(firstCard);
const secondKey = getSiteKey(secondCard);
const firstPinned = pinnedSites.indexOf(firstKey);
const secondPinned = pinnedSites.indexOf(secondKey);
if (firstPinned !== -1 || secondPinned !== -1) {
if (firstPinned === -1) return 1;
if (secondPinned === -1) return -1;
return firstPinned - secondPinned;
}
return originalCardOrder.get(firstCard) - originalCardOrder.get(secondCard);
});
cards.forEach(card => list.append(card));
});
}

function updatePinButton(button, pinned) {
const text = translations?.[currentLanguage] || translations.pt;
button.setAttribute('aria-pressed', pinned);
button.textContent = pinned ? text.pinned : text.pin;
}

reorderSiteLists();

document.querySelectorAll('.pin-toggle').forEach(button => {
button.addEventListener('click', () => {
const card = button.closest('.item-card');
const siteKey = getSiteKey(card);
const pinned = card.classList.toggle('pinned');

if (pinned) {
pinnedSites = [siteKey, ...pinnedSites.filter(key => key !== siteKey)];
} else {
pinnedSites = pinnedSites.filter(key => key !== siteKey);
}

localStorage.setItem(pinnedStorageKey, JSON.stringify(pinnedSites));
reorderSiteLists();
});
});

document.querySelectorAll('.comments-toggle').forEach(button => {
button.addEventListener('click', () => {
const card = button.closest('.item-card');
const panel = card.querySelector('.comments-panel');
const visible = panel.classList.toggle('visible');
button.setAttribute('aria-expanded', visible);
});
});

const commentStorageKey = 'tudomoe-comments';
const storedComments = JSON.parse(localStorage.getItem(commentStorageKey) || '{}');

function getCardCommentKey(card) {
const title = card.querySelector('.item-title')?.textContent.trim() || '';
const link = card.querySelector('.item-external-link')?.href || '';
return `${title}|${link}`;
}

function renderComments(card) {
const panel = card.querySelector('.comments-panel');
const comments = storedComments[getCardCommentKey(card)] || [];
const list = panel.querySelector('.comments-list');
if (!list) return;
list.replaceChildren();

comments.forEach(comment => {
const article = document.createElement('article');
article.className = 'comment-entry';
const heading = document.createElement('div');
heading.className = 'comment-heading';
const author = document.createElement('strong');
author.textContent = comment.name;
const rating = document.createElement('span');
rating.textContent = `${'★'.repeat(comment.rating)}${'☆'.repeat(5 - comment.rating)}`;
rating.setAttribute('aria-label', `${comment.rating} de 5 estrelas`);
heading.append(author, rating);
const content = document.createElement('p');
content.textContent = comment.text;
article.append(heading, content);
list.append(article);
});
}

document.querySelectorAll('.comments-panel').forEach(panel => {
const card = panel.closest('.item-card');
panel.innerHTML = `<form class="comment-form">
<div class="comment-fields">
<label>Nome<input name="name" type="text" maxlength="50" required placeholder="Seu nome"></label>
<label>Avaliação<select name="rating" required><option value="">Escolha</option><option value="5">5 estrelas</option><option value="4">4 estrelas</option><option value="3">3 estrelas</option><option value="2">2 estrelas</option><option value="1">1 estrela</option></select></label>
</div>
<label>Comentário<textarea name="text" rows="3" maxlength="500" required placeholder="Conte sua experiência com este site"></textarea></label>
<button class="comment-submit" type="submit">Enviar avaliação</button>
</form><div class="comments-list" aria-live="polite"></div>`;
panel.querySelector('.comment-form').addEventListener('submit', event => {
event.preventDefault();
const form = event.currentTarget;
const data = new FormData(form);
const comment = { name: data.get('name').trim(), rating: Number(data.get('rating')), text: data.get('text').trim() };
if (!comment.name || !comment.rating || !comment.text) return;
const key = getCardCommentKey(card);
storedComments[key] = [...(storedComments[key] || []), comment];
localStorage.setItem(commentStorageKey, JSON.stringify(storedComments));
form.reset();
renderComments(card);
});
renderComments(card);
});

const menuToggle = document.querySelector('.menu-toggle');

function updateMenuIcon(toggleBtn){ if(!toggleBtn) return; if(document.body.classList.contains('sidebar-open')) toggleBtn.textContent = '✕'; else toggleBtn.textContent = '☰'; }

if (menuToggle) {
updateMenuIcon(menuToggle);
      
let backdrop = document.querySelector('.sidebar-backdrop');
if(!backdrop){ backdrop = document.createElement('div'); backdrop.className = 'sidebar-backdrop'; document.body.appendChild(backdrop); }
let sidebarCloseTimer;

function closeSidebar(){
clearTimeout(sidebarCloseTimer);
document.body.classList.remove('sidebar-open');
document.body.classList.add('sidebar-closing');
updateMenuIcon(menuToggle);
backdrop.style.display='none';
sidebarCloseTimer = setTimeout(() => document.body.classList.remove('sidebar-closing'), 350);
}

function openSidebar(){
clearTimeout(sidebarCloseTimer);
document.body.classList.remove('sidebar-closing');
document.body.classList.add('sidebar-open');
updateMenuIcon(menuToggle);
backdrop.style.display='block';
}

menuToggle.addEventListener('click', () => {
if(document.body.classList.contains('sidebar-open')) closeSidebar(); else openSidebar();

});
backdrop.addEventListener('click', closeSidebar);
window.addEventListener('resize', () => { clearTimeout(sidebarCloseTimer); document.body.classList.remove('sidebar-open', 'sidebar-closing'); backdrop.style.display='none'; updateMenuIcon(menuToggle); });
}


function updateSidebarPosition(){
const h1 = document.querySelector('.hero-title');
const container = document.querySelector('.container');
const headerEl = document.querySelector('header');
if(!h1 || !container || !headerEl) return;
const h1DocTop = h1.getBoundingClientRect().top + window.scrollY;
const containerDocTop = container.getBoundingClientRect().top + window.scrollY;
let offset = Math.max(0, h1DocTop - containerDocTop);
const headerHeight = Math.round(headerEl.getBoundingClientRect().height);
document.documentElement.style.setProperty('--sidebar-offset', offset + 'px');
document.documentElement.style.setProperty('--sidebar-top', headerHeight + 'px');
}

window.addEventListener('load', updateSidebarPosition);

window.addEventListener('resize', updateSidebarPosition);

window.addEventListener('DOMContentLoaded', () => setTimeout(updateSidebarPosition, 50));