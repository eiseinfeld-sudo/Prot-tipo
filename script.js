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
categoriesToggle.querySelector('span').textContent = expanded ? 'Ocultar categorias' : 'Mostrar categorias';
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
searchStatus.textContent = visibleCards ? `${visibleCards} resultado${visibleCards === 1 ? '' : 's'}` : 'Nenhum site encontrado';
}
});
}

const settingsToggle = document.querySelector('.settings-toggle');
const settingsPanel = document.querySelector('.settings-panel');

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

document.querySelectorAll('.pin-toggle').forEach(button => {
button.addEventListener('click', () => {
const card = button.closest('.item-card');
const pinned = card.classList.toggle('pinned');
button.setAttribute('aria-pressed', pinned);
button.textContent = pinned ? '★ Fixado' : '☆ Fixar';
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