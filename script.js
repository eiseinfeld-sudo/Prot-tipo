document.querySelectorAll('.category-link').forEach(link => {
link.addEventListener('click', e => {
e.preventDefault();
document.querySelectorAll('.category-link').forEach(l => l.classList.remove('active'));
link.classList.add('active');
const category = normalizeSearchText(link.textContent.trim());
const targetMap = {
anime: '.content-section:nth-of-type(1)',
 manga: '.content-section:nth-of-type(2)',
 'light novel': '.content-section:nth-of-type(4)',
 drama: '.content-section:nth-of-type(3)',
};
const target = document.querySelector(targetMap[category] || '.media-section');
if (target) {
const headerHeight = document.querySelector('header')?.offsetHeight || 0;
const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
}
});
        });

document.querySelectorAll('.sidebar-section:nth-of-type(2) a').forEach(link => {
link.addEventListener('click', event => {
event.preventDefault();
const category = normalizeSearchText(link.textContent.trim());
const targetMap = {
anime: '.content-section:nth-of-type(1)',
manga: '.content-section:nth-of-type(2)',
'light novel': '.content-section:nth-of-type(4)',
drama: '.content-section:nth-of-type(3)',
};
const target = document.querySelector(targetMap[category] || '.media-section');
if (target) {
const headerHeight = document.querySelector('header')?.offsetHeight || 0;
const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
}
});
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
const searchSuggestions = document.querySelector('.search-suggestions');
const searchableSections = [...document.querySelectorAll('.content-columns .content-section')];
const searchableCards = [...document.querySelectorAll('.content-columns .item-card')];

function normalizeSearchText(value) {
return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function closeSearchSuggestions() {
if (searchSuggestions) searchSuggestions.hidden = true;
}

function renderSearchSuggestions(query) {
if (!searchSuggestions) return;
searchSuggestions.replaceChildren();
if (!query) {
closeSearchSuggestions();
return;
}
const matches = searchableCards.filter(card => {
const image = card.querySelector('img');
const searchableText = normalizeSearchText(`${card.textContent} ${image?.alt || ''} ${card.querySelector('a')?.href || ''}`);
return searchableText.includes(query);
}).slice(0, 5);

matches.forEach(card => {
const suggestion = document.createElement('button');
suggestion.className = 'search-suggestion';
suggestion.type = 'button';
suggestion.setAttribute('role', 'option');
const title = card.querySelector('.item-title')?.textContent.trim() || 'Site';
const section = card.closest('.content-section')?.querySelector('.content-title')?.textContent.trim() || '';
const image = card.querySelector('.item-image img');
const imageElement = document.createElement('img');
imageElement.className = 'search-suggestion-icon';
imageElement.src = image?.src || '';
imageElement.alt = '';
imageElement.setAttribute('aria-hidden', 'true');
const textContainer = document.createElement('span');
textContainer.className = 'search-suggestion-text';
const titleElement = document.createElement('span');
titleElement.textContent = title;
const sectionElement = document.createElement('small');
sectionElement.textContent = section;
textContainer.append(titleElement, sectionElement);
suggestion.append(imageElement, textContainer);
suggestion.addEventListener('click', () => {
card.hidden = false;
card.closest('.content-section').hidden = false;
const headerHeight = document.querySelector('header')?.offsetHeight || 0;
const cardTop = card.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
window.scrollTo({ top: Math.max(0, cardTop), behavior: 'smooth' });
searchBox.value = title;
closeSearchSuggestions();
});
searchSuggestions.append(suggestion);
});

searchSuggestions.hidden = matches.length === 0;
}

if (searchBox) {
searchBox.addEventListener('input', () => {
const query = normalizeSearchText(searchBox.value.trim());
renderSearchSuggestions(query);
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

document.addEventListener('click', event => {
if (!event.target.closest('.search-container')) closeSearchSuggestions();
});

searchBox.addEventListener('keydown', event => {
if (event.key === 'Escape') closeSearchSuggestions();
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

const interfaceTranslations = {
en: {
'Mostrar categorias': 'Show categories', 'Ocultar categorias': 'Hide categories', 'Anime Streaming': 'Anime Streaming', 'Manga Reading': 'Manga Reading', 'Dramas Asiáticos': 'Asian Dramas', 'Novel Reading': 'Novel Reading', 'Plataformas e Recursos': 'Platforms and Resources', 'Animes': 'Anime', 'Mangás': 'Manga', 'Música': 'Music', 'Ferramentas': 'Tools', 'Calendário': 'Calendar', 'Banco de Dados': 'Database', 'Ocidental': 'Western', 'Tendências': 'Trending', 'Guias': 'Guides', 'Fóruns': 'Forums', 'Páginas': 'Pages', 'Categorias': 'Categories', 'Índice': 'Index', 'Sobre & Info': 'About & Info', 'Sobre': 'About', 'Contato': 'Contact', 'Sugestões': 'Suggestions', 'Reportar Erro': 'Report an Error', 'Categorias Principais': 'Main Categories', 'Links Úticos': 'Useful Links', 'Calendário de Lançamentos': 'Release Calendar', 'Disclaimer': 'Disclaimer', 'Changelog': 'Changelog', 'Comunidade': 'Community', 'Prós': 'Pros', 'Contras': 'Cons', 'Acessar site externo ↗': 'Visit external site ↗', 'Fixar': 'Pin', 'Fixado': 'Pinned', 'Comentários': 'Comments', 'Expandir detalhes⌄': 'Expand details⌄', 'Recolher detalhes⌃': 'Collapse details⌃', 'Nenhum comentário ainda.': 'No comments yet.', 'Voltar ao topo': 'Back to top', 'Sobre TudoMoe': 'About TudoMoe', 'O que fazemos': 'What we do', 'Como avaliamos': 'How we evaluate', 'Nosso objetivo': 'Our goal', 'Projeto Comunitário': 'Community Project', 'Cultura Otaku': 'Otaku Culture', 'Aviso Legal': 'Legal Notice', 'Escolha': 'Choose', 'Nome': 'Name', 'Avaliação': 'Rating', 'Comentário': 'Comment', 'Enviar avaliação': 'Submit review', 'Seu nome': 'Your name', 'Conte sua experiência com este site': 'Tell us about your experience with this site', 'Email': 'Email', 'Twitter': 'X', 'Idioma': 'Language', 'Notificações': 'Notifications', 'Main Index': 'Main Index', 'Graveyard': 'Graveyard', 'Updates': 'Updates', 'Down Detector': 'Down Detector', 'Downloads': 'Downloads', 'Light Novel': 'Light Novel', 'Games': 'Games', 'Apps': 'Apps', 'Drama': 'Drama', 'Quiz': 'Quiz', 'Imageboards': 'Imageboards', 'VTuber': 'VTuber', 'Gacha': 'Gacha', 'Cosplay': 'Cosplay', 'AMV': 'AMV', 'Donghua': 'Donghua', 'Schedule': 'Schedule', 'Trends': 'Trends', 'Tools': 'Tools', 'Guides': 'Guides', 'Forums': 'Forums', 'Anime': 'Anime', 'Manga': 'Manga', 'Revisões': 'Reviews', 'Privacidade': 'Privacy', 'Termos': 'Terms', 'Catálogo amplo': 'Wide catalog', 'Navegação simples.': 'Simple navigation.', 'Interface Moderna': 'Modern interface', 'Interface moderna': 'Modern interface', 'Disponibilidade pode variar por região': 'Availability may vary by region', 'Muitos ADS': 'Many ads', 'Fácil de usar': 'Easy to use', 'Galeria considerável': 'Considerable gallery', 'Poucas opções avançadas': 'Few advanced options', 'Watermark': 'Watermark', 'Boa organização das séries': 'Well-organized series', 'Server confiável': 'Reliable server', 'Updates constantes': 'Frequent updates', 'Catálogo mediano': 'Average catalog', 'Atualizações frequentes.': 'Frequent updates.', 'Multíplas fontes e idiomas': 'Multiple sources and languages', 'Catálogo extenso': 'Extensive catalog', 'Busca rápida por conteúdo': 'Fast content search', 'Servers variados': 'Multiple servers', 'Filtros ainda limitados': 'Limited filters', 'Layout direto e acessível.': 'Clear and accessible layout.', 'Recursos sociais reduzidos.': 'Reduced social features', 'Novidades organizadas por data': 'Updates organized by date', 'Calendário simples de consultar.': 'Easy-to-check calendar', 'Nem todos os horários são confirmados.': 'Not all times are confirmed.', 'Lista atualizada regularmente.': 'Regularly updated list.', 'Detalhes extras ainda limitados.': 'Extra details are limited.', 'Visualização rápida das novidades.': 'Quick view of updates', 'Alguns dados podem estar pendentes.': 'Some data may be pending.', 'Fácil de acompanhar.': 'Easy to follow.', 'Sem histórico detalhado.': 'No detailed history.', 'Formato claro e objetivo.': 'Clear and objective format.', 'Pode exigir conferência manual.': 'May require manual checking.'
},
es: {
'Mostrar categorias': 'Mostrar categorías', 'Ocultar categorias': 'Ocultar categorías', 'Anime Streaming': 'Anime Streaming', 'Manga Reading': 'Lectura de manga', 'Dramas Asiáticos': 'Dramas asiáticos', 'Novel Reading': 'Lectura de novelas', 'Plataformas e Recursos': 'Plataformas y recursos', 'Animes': 'Anime', 'Mangás': 'Mangas', 'Música': 'Música', 'Ferramentas': 'Herramientas', 'Calendário': 'Calendario', 'Banco de Dados': 'Base de datos', 'Ocidental': 'Occidental', 'Tendências': 'Tendencias', 'Guias': 'Guías', 'Fóruns': 'Foros', 'Páginas': 'Páginas', 'Categorias': 'Categorías', 'Índice': 'Índice', 'Sobre & Info': 'Sobre e información', 'Sobre': 'Sobre', 'Contato': 'Contacto', 'Sugestões': 'Sugerencias', 'Reportar Erro': 'Informar un error', 'Categorias Principais': 'Categorías principales', 'Links Úticos': 'Enlaces útiles', 'Calendário de Lançamentos': 'Calendario de lanzamientos', 'Disclaimer': 'Aviso legal', 'Changelog': 'Registro de cambios', 'Comunidade': 'Comunidad', 'Prós': 'Ventajas', 'Contras': 'Desventajas', 'Acessar site externo ↗': 'Visitar sitio externo ↗', 'Fixar': 'Fijar', 'Fixado': 'Fijado', 'Comentários': 'Comentarios', 'Expandir detalhes⌄': 'Expandir detalles⌄', 'Recolher detalhes⌃': 'Contraer detalles⌃', 'Nenhum comentário ainda.': 'Aún no hay comentarios.', 'Voltar ao topo': 'Volver arriba', 'Sobre TudoMoe': 'Sobre TudoMoe', 'O que fazemos': 'Qué hacemos', 'Como avaliamos': 'Cómo evaluamos', 'Nosso objetivo': 'Nuestro objetivo', 'Projeto Comunitário': 'Proyecto comunitario', 'Cultura Otaku': 'Cultura otaku', 'Aviso Legal': 'Aviso legal', 'Escolha': 'Elegir', 'Nome': 'Nombre', 'Avaliação': 'Valoración', 'Comentário': 'Comentario', 'Enviar avaliação': 'Enviar valoración', 'Seu nome': 'Tu nombre', 'Conte sua experiência com este site': 'Cuéntanos tu experiencia con este sitio', 'Email': 'Correo electrónico', 'Twitter': 'X', 'Idioma': 'Idioma', 'Notificações': 'Notificaciones', 'Main Index': 'Índice principal', 'Graveyard': 'Archivo', 'Updates': 'Actualizaciones', 'Down Detector': 'Detector de caídas', 'Downloads': 'Descargas', 'Light Novel': 'Novela ligera', 'Games': 'Juegos', 'Apps': 'Aplicaciones', 'Drama': 'Drama', 'Quiz': 'Cuestionario', 'Imageboards': 'Imageboards', 'VTuber': 'VTuber', 'Gacha': 'Gacha', 'Cosplay': 'Cosplay', 'AMV': 'AMV', 'Donghua': 'Donghua', 'Schedule': 'Calendario', 'Trends': 'Tendencias', 'Tools': 'Herramientas', 'Guides': 'Guías', 'Forums': 'Foros', 'Anime': 'Anime', 'Manga': 'Manga', 'Revisões': 'Reseñas', 'Privacidade': 'Privacidad', 'Termos': 'Términos', 'Catálogo amplo': 'Catálogo amplio', 'Navegação simples.': 'Navegación sencilla.', 'Interface Moderna': 'Interfaz moderna', 'Interface moderna': 'Interfaz moderna', 'Disponibilidade pode variar por região': 'La disponibilidad puede variar según la región', 'Muitos ADS': 'Muchos anuncios', 'Fácil de usar': 'Fácil de usar', 'Galeria considerável': 'Galería considerable', 'Poucas opções avançadas': 'Pocas opciones avanzadas', 'Boa organização das séries': 'Series bien organizadas', 'Server confiável': 'Servidor confiable', 'Updates constantes': 'Actualizaciones constantes', 'Catálogo mediano': 'Catálogo mediano', 'Atualizações frequentes.': 'Actualizaciones frecuentes.', 'Multíplas fontes e idiomas': 'Múltiples fuentes e idiomas', 'Catálogo extenso': 'Catálogo extenso', 'Busca rápida por conteúdo': 'Búsqueda rápida de contenido', 'Servers variados': 'Varios servidores', 'Filtros ainda limitados': 'Filtros aún limitados', 'Layout direto e acessível.': 'Diseño claro y accesible.', 'Recursos sociais reduzidos.': 'Recursos sociales reducidos', 'Novidades organizadas por data': 'Novedades organizadas por fecha', 'Calendário simples de consultar.': 'Calendario fácil de consultar', 'Nem todos os horários são confirmados.': 'No todos los horarios están confirmados.', 'Lista atualizada regularmente.': 'Lista actualizada regularmente.', 'Detalhes extras ainda limitados.': 'Detalles adicionales limitados.', 'Visualização rápida das novidades.': 'Vista rápida de las novedades', 'Alguns dados podem estar pendentes.': 'Algunos datos pueden estar pendientes.', 'Fácil de acompanhar.': 'Fácil de seguir.', 'Sem histórico detalhado.': 'Sin historial detallado.', 'Formato claro e objetivo.': 'Formato claro y objetivo.', 'Pode exigir conferência manual.': 'Puede requerir comprobación manual.'
}
};

const originalTextNodes = new WeakMap();

function translateStaticText(language) {
const dictionary = interfaceTranslations[language];
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
const nodes = [];
while (walker.nextNode()) nodes.push(walker.currentNode);
nodes.forEach(node => {
const original = originalTextNodes.get(node) || node.textContent;
originalTextNodes.set(node, original);
const trimmed = original.trim();
if (!trimmed) return;
if (!dictionary) {
node.textContent = original;
return;
}
const withoutPrefix = trimmed.replace(/^[^A-Za-zÀ-ÿ]+/, '');
const translated = dictionary[trimmed] || dictionary[withoutPrefix];
if (translated) node.textContent = original.replace(trimmed, translated);
});
}

function translateCommentForms(language) {
const labels = language === 'en'
? { name: 'Name', rating: 'Rating', comment: 'Comment', choose: 'Choose', submit: 'Submit review', namePlaceholder: 'Your name', textPlaceholder: 'Tell us about your experience with this site', stars: 'stars', star: 'star' }
: language === 'es'
? { name: 'Nombre', rating: 'Valoración', comment: 'Comentario', choose: 'Elegir', submit: 'Enviar valoración', namePlaceholder: 'Tu nombre', textPlaceholder: 'Cuéntanos tu experiencia con este sitio', stars: 'estrellas', star: 'estrella' }
: { name: 'Nome', rating: 'Avaliação', comment: 'Comentário', choose: 'Escolha', submit: 'Enviar avaliação', namePlaceholder: 'Seu nome', textPlaceholder: 'Conte sua experiência com este site', stars: 'estrelas', star: 'estrela' };
document.querySelectorAll('.comment-form').forEach(form => {
const labelsByField = { name: labels.name, rating: labels.rating, text: labels.comment };
Object.entries(labelsByField).forEach(([field, value]) => {
const label = form.querySelector(`[name="${field}"]`)?.closest('label');
if (label?.firstChild) label.firstChild.textContent = value;
});
const nameInput = form.querySelector('[name="name"]');
const ratingSelect = form.querySelector('[name="rating"]');
const textInput = form.querySelector('[name="text"]');
if (nameInput) nameInput.placeholder = labels.namePlaceholder;
if (textInput) textInput.placeholder = labels.textPlaceholder;
if (ratingSelect) {
ratingSelect.options[0].textContent = labels.choose;
for (let index = 1; index < ratingSelect.options.length; index += 1) ratingSelect.options[index].textContent = `${index} ${index === 1 ? labels.star : labels.stars}`;
}
const submit = form.querySelector('.comment-submit');
if (submit) submit.textContent = labels.submit;
});
}

function translateAboutPage(language) {
const aboutText = {
pt: {
intro: 'Listamos e analisamos sites e aplicativos relacionados à cultura de anime e mangá (otaku); cada análise é elaborada manualmente com base em nossos próprios testes (sem automação). Nosso objetivo é oferecer uma lista atualizada e confiável dos melhores sites de anime e mangá para o público de língua inglesa.',
details: ['Reunimos recursos de anime, mangá, jogos, música e outras áreas da cultura otaku em um só lugar.', 'Testamos os serviços manualmente e destacamos seus pontos fortes, limitações e formas de acesso.', 'Facilitamos a descoberta de sites úteis com informações claras, organizadas e atualizadas.'],
sections: ['O EverythingMoe é um projeto comunitário que não visa ao lucro. Nossas avaliações ajudam as pessoas a encontrar o que procuram, sem beneficiar os operadores dos sites. Nossa comunidade reúne informações, notícias, atualizações e discussões sobre os serviços avaliados.', 'O termo pode ser interpretado de várias maneiras. Aqui, ele representa subculturas baseadas em interesses relacionados ao entretenimento e à mídia do Leste Asiático, aproximando-se da cultura ACG.', 'As avaliações refletem opiniões subjetivas e não são julgamentos definitivos nem endossos. As informações vêm de testes pessoais e da comunidade, podendo conter erros ou ficar desatualizadas. Tenha cautela ao acessar sites de terceiros e anúncios.'],
contact: 'Se você não prefere as redes sociais, também pode usar nosso formulário de contato.'
},
en: {
intro: 'We list and review websites and apps related to anime and manga culture (otaku). Each review is written manually based on our own tests. Our goal is to provide an updated and reliable list of the best anime and manga sites for English-speaking users.',
details: ['We bring together resources for anime, manga, games, music and other areas of otaku culture in one place.', 'We test services manually and highlight their strengths, limitations and access options.', 'We make it easier to discover useful sites through clear, organized and updated information.'],
sections: ['EverythingMoe is a non-profit community project. Our reviews help people find what they are looking for without benefiting site operators. The community gathers information, news, updates and discussions about the services we review.', 'The term can be interpreted in many ways. Here, it refers to subcultures based on interests related to East Asian entertainment and media, closely aligned with ACG culture.', 'Reviews reflect subjective opinions and are not definitive judgments or endorsements. Information comes from personal testing and the community and may contain errors or become outdated. Be careful when accessing third-party sites and advertisements.'],
contact: 'If you prefer not to use social networks, you can also use our contact form.'
},
es: {
intro: 'Listamos y analizamos sitios y aplicaciones relacionados con la cultura del anime y el manga (otaku). Cada análisis se realiza manualmente a partir de nuestras propias pruebas. Nuestro objetivo es ofrecer una lista actualizada y confiable de los mejores sitios de anime y manga.',
details: ['Reunimos recursos de anime, manga, juegos, música y otras áreas de la cultura otaku en un solo lugar.', 'Probamos los servicios manualmente y destacamos sus puntos fuertes, limitaciones y formas de acceso.', 'Facilitamos el descubrimiento de sitios útiles con información clara, organizada y actualizada.'],
sections: ['EverythingMoe es un proyecto comunitario sin fines de lucro. Nuestras reseñas ayudan a las personas a encontrar lo que buscan sin beneficiar a los operadores de los sitios. La comunidad reúne información, noticias, actualizaciones y debates sobre los servicios evaluados.', 'El término puede interpretarse de varias maneras. Aquí se refiere a subculturas basadas en intereses relacionados con el entretenimiento y los medios de Asia Oriental, cercanos a la cultura ACG.', 'Las reseñas reflejan opiniones subjetivas y no son juicios definitivos ni recomendaciones. La información proviene de pruebas personales y de la comunidad, por lo que puede contener errores o quedar desactualizada. Ten cuidado al acceder a sitios y anuncios de terceros.'],
contact: 'Si prefieres no utilizar redes sociales, también puedes usar nuestro formulario de contacto.'
}
}[language];
if (!aboutText) return;
const intro = document.querySelector('.about-section > p');
if (intro) intro.textContent = aboutText.intro;
document.querySelectorAll('.about-details p').forEach((paragraph, index) => { paragraph.textContent = aboutText.details[index] || paragraph.textContent; });
document.querySelectorAll('.about-section > h2 + p').forEach((paragraph, index) => { paragraph.textContent = aboutText.sections[index] || paragraph.textContent; });
const contactNote = [...document.querySelectorAll('.about-section li')].find(item => item.textContent.includes('formulário') || item.textContent.includes('form')); 
if (contactNote) contactNote.textContent = aboutText.contact;
}

let currentLanguage = localStorage.getItem('tudomoe-language') || 'pt';

function applyLanguage(language) {
const text = translations[language] || translations.pt;
currentLanguage = language;
localStorage.setItem('tudomoe-language', language);
document.documentElement.lang = language === 'pt' ? 'pt-BR' : language;
document.querySelector('.search-box')?.setAttribute('placeholder', text.search);
document.querySelector('.search-box')?.setAttribute('aria-label', text.searchLabel);
document.querySelector('.settings-toggle')?.setAttribute('title', text.settings);
document.querySelector('.settings-toggle')?.setAttribute('aria-label', text.settings);
document.querySelector('.settings-panel strong')?.replaceChildren(document.createTextNode(text.settings));
document.querySelector('.language-label')?.replaceChildren(document.createTextNode(text.language));
document.querySelector('.settings-notifications')?.replaceChildren(document.createTextNode(text.notifications));
document.querySelector('.hero-title')?.replaceChildren(document.createTextNode(text.heroTitle));
document.querySelector('.hero-subtitle')?.replaceChildren(document.createTextNode(text.heroSubtitle));
document.querySelector('.categories-toggle span')?.replaceChildren(document.createTextNode(categoriesMenu?.classList.contains('expanded') ? text.hideCategories : text.showCategories));
document.querySelectorAll('.content-title').forEach((title, index) => { title.textContent = text.sections[index] || title.textContent; });
document.querySelector('.media-title')?.replaceChildren(document.createTextNode(text.media));
document.querySelectorAll('.sidebar-section h4').forEach((heading, index) => { heading.textContent = text.sidebarHeadings[index] || heading.textContent; });
document.querySelectorAll('.item-expand').forEach(button => { button.textContent = button.closest('.item-card').classList.contains('expanded') ? text.collapse : text.expand; });
document.querySelectorAll('.pin-toggle').forEach(button => { button.textContent = button.closest('.item-card').classList.contains('pinned') ? text.pinned : text.pin; });
document.querySelectorAll('.comments-toggle').forEach(button => { button.textContent = text.comments; });
document.querySelectorAll('.item-external-link').forEach(link => { link.textContent = text.external; });
document.querySelector('a[onclick*="scrollTo"]')?.replaceChildren(document.createTextNode(text.top));
document.querySelector('.share-button')?.setAttribute('title', language === 'en' ? 'Share' : language === 'es' ? 'Compartir' : 'Compartilhar');
document.querySelector('.share-button')?.setAttribute('aria-label', language === 'en' ? 'Share' : language === 'es' ? 'Compartir' : 'Compartilhar');
document.querySelector('.share-copy')?.replaceChildren(document.createTextNode(language === 'en' ? 'Copy link' : language === 'es' ? 'Copiar enlace' : 'Copiar link'));
document.querySelector('.share-native')?.replaceChildren(document.createTextNode(language === 'en' ? 'Share with another app' : language === 'es' ? 'Compartir con otra aplicación' : 'Compartilhar com outro aplicativo'));
const feedbackLabels = language === 'en' ? ['Correction', 'Report item', 'Site feedback'] : language === 'es' ? ['Corrección', 'Informar elemento', 'Opinión sobre el sitio'] : ['Correção', 'Reportar item', 'Opinião sobre o site'];
document.querySelectorAll('.feedback-option').forEach((button, index) => { button.textContent = feedbackLabels[index]; });
document.querySelector('.feedback-button')?.setAttribute('title', language === 'en' ? 'Send feedback' : language === 'es' ? 'Enviar comentarios' : 'Enviar feedback');
document.querySelector('.feedback-button')?.setAttribute('aria-label', language === 'en' ? 'Send feedback' : language === 'es' ? 'Enviar comentarios' : 'Enviar feedback');
translateStaticText(language);
translateCommentForms(language);
translateAboutPage(language);
}

languageOptions.forEach(option => option.addEventListener('click', () => applyLanguage(option.dataset.language)));

applyLanguage(currentLanguage);

const feedbackPageForm = document.querySelector('.feedback-page-form');
if (feedbackPageForm) {
const feedbackType = new URLSearchParams(window.location.search).get('type') || 'opinion';
const feedbackSubjects = currentLanguage === 'en'
? { correction: 'Correction', report: 'Item report', opinion: 'Site opinion' }
: currentLanguage === 'es'
? { correction: 'Corrección', report: 'Informe de elemento', opinion: 'Opinión sobre el sitio' }
: { correction: 'Correção', report: 'Relato de item', opinion: 'Opinião sobre o site' };
const selectedSubject = feedbackSubjects[feedbackType] || feedbackSubjects.opinion;
const subjectInput = feedbackPageForm.querySelector('.feedback-subject');
if (subjectInput) subjectInput.value = selectedSubject;
feedbackPageForm.addEventListener('submit', event => {
event.preventDefault();
const formData = new FormData(feedbackPageForm);
const body = `Nome: ${formData.get('name')}\nE-mail: ${formData.get('email')}\n\n${formData.get('message')}`;
window.location.href = `mailto:contato@everythingmoe.com?subject=${encodeURIComponent(selectedSubject)}&body=${encodeURIComponent(body)}`;
});
}

const shareButton = document.querySelector('.share-button');
const sharePanel = document.querySelector('.share-panel');
const shareCopy = document.querySelector('.share-copy');
const shareNative = document.querySelector('.share-native');
const feedbackButton = document.querySelector('.feedback-button');
const feedbackPanel = document.querySelector('.feedback-panel');
const feedbackOptionButtons = document.querySelectorAll('.feedback-option');
const feedbackEmail = 'contato@everythingmoe.com';

function closeSharePanel() {
if (!shareButton || !sharePanel) return;
shareButton.setAttribute('aria-expanded', 'false');
sharePanel.hidden = true;
}

function closeFeedbackPanel() {
if (!feedbackButton || !feedbackPanel) return;
feedbackButton.setAttribute('aria-expanded', 'false');
feedbackPanel.hidden = true;
}

function feedbackFormCopy() {
return currentLanguage === 'en'
? { recipient: 'Recipient', name: 'Name', email: 'Your e-mail', message: 'Message', send: 'Send', back: 'Back', subject: 'Feedback' }
: currentLanguage === 'es'
? { recipient: 'Destinatario', name: 'Nombre', email: 'Tu correo electrónico', message: 'Mensaje', send: 'Enviar', back: 'Volver', subject: 'Comentarios' }
: { recipient: 'Destinatário', name: 'Nome', email: 'Seu e-mail', message: 'Mensagem', send: 'Enviar', back: 'Voltar', subject: 'Feedback' };
}

function showFeedbackForm(type) {
if (!feedbackPanel) return;
const labels = feedbackFormCopy();
const subjects = currentLanguage === 'en'
? { correction: 'Correction', report: 'Item report', opinion: 'Site opinion' }
: currentLanguage === 'es'
? { correction: 'Corrección', report: 'Informe de elemento', opinion: 'Opinión sobre el sitio' }
: { correction: 'Correção', report: 'Relato de item', opinion: 'Opinião sobre o site' };
feedbackPanel.innerHTML = `<form class="feedback-form">
<strong>${subjects[type]}</strong>
<div class="feedback-recipient">${labels.recipient}: ${feedbackEmail}</div>
<label>${labels.name}<input name="name" type="text" maxlength="80" required></label>
<label>${labels.email}<input name="email" type="email" maxlength="120" required></label>
<label>${labels.message}<textarea name="message" maxlength="1000" required></textarea></label>
<div class="feedback-form-actions"><button class="feedback-back" type="button">${labels.back}</button><button type="submit">${labels.send}</button></div>
</form>`;
const form = feedbackPanel.querySelector('.feedback-form');
form.addEventListener('submit', event => {
event.preventDefault();
const formData = new FormData(form);
const subject = subjects[type];
const body = `${labels.name}: ${formData.get('name')}\n${labels.email}: ${formData.get('email')}\n\n${formData.get('message')}`;
window.location.href = `mailto:${feedbackEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
feedbackPanel.querySelector('.feedback-back').addEventListener('click', () => {
feedbackPanel.innerHTML = '<button class="feedback-option" type="button" data-feedback="correction"></button><button class="feedback-option" type="button" data-feedback="report"></button><button class="feedback-option" type="button" data-feedback="opinion"></button>';
const updatedLabels = currentLanguage === 'en' ? ['Correction', 'Report item', 'Site feedback'] : currentLanguage === 'es' ? ['Corrección', 'Informar elemento', 'Opinión sobre el sitio'] : ['Correção', 'Reportar item', 'Opinião sobre o site'];
feedbackPanel.querySelectorAll('.feedback-option').forEach((button, index) => { button.textContent = updatedLabels[index]; button.addEventListener('click', () => showFeedbackForm(button.dataset.feedback)); });
});
}

if (feedbackButton && feedbackPanel) {
feedbackButton.addEventListener('click', () => {
const expanded = feedbackButton.getAttribute('aria-expanded') === 'true';
feedbackButton.setAttribute('aria-expanded', !expanded);
feedbackPanel.hidden = expanded;
});

feedbackOptionButtons.forEach(button => button.addEventListener('click', () => {
window.location.href = `feedback.html?type=${encodeURIComponent(button.dataset.feedback)}`;
}));

document.addEventListener('click', event => {
if (!event.target.closest('.feedback-menu')) closeFeedbackPanel();
});
}

async function copyCurrentLink() {
if (navigator.clipboard) {
await navigator.clipboard.writeText(window.location.href);
return;
}
const fallback = document.createElement('textarea');
fallback.value = window.location.href;
fallback.setAttribute('readonly', '');
fallback.style.position = 'fixed';
fallback.style.opacity = '0';
document.body.append(fallback);
fallback.select();
document.execCommand('copy');
fallback.remove();
}

if (shareButton && sharePanel) {
shareButton.addEventListener('click', () => {
const expanded = shareButton.getAttribute('aria-expanded') === 'true';
shareButton.setAttribute('aria-expanded', !expanded);
sharePanel.hidden = expanded;
});

shareCopy?.addEventListener('click', async () => {
await copyCurrentLink();
closeSharePanel();
const originalTitle = shareButton.title;
shareButton.title = currentLanguage === 'en' ? 'Link copied!' : currentLanguage === 'es' ? '¡Enlace copiado!' : 'Link copiado!';
setTimeout(() => { shareButton.title = originalTitle; }, 1800);
});

shareNative?.addEventListener('click', async () => {
const shareData = { title: document.title, text: document.querySelector('.hero-title')?.textContent || document.title, url: window.location.href };
try {
if (navigator.share) await navigator.share(shareData);
else await copyCurrentLink();
} catch (error) {
if (error.name !== 'AbortError') console.error('Não foi possível compartilhar o link.', error);
}
closeSharePanel();
});

document.addEventListener('click', event => {
if (!event.target.closest('.share-menu')) closeSharePanel();
});
}

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

applyLanguage(currentLanguage);

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