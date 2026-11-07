// Данные сайта «ОГНЕВЕД». Всё содержимое правится в админке (admin/) и хранится в data/content.json;
// «Опубликовать» записывает его в js/content.js (window.OG_CONTENT). Здесь — сборка window.OG из содержимого и помощники.
// В предпросмотре админки (страница сайта в окне админки) содержимое берётся из черновика: window.parent.OG_PREVIEW.
// Тексты статичной разметки index.html помечены data-c (текст) и data-b (кнопка) — их подставляет fill.
(function () {
  const AR = '<svg class="fb-ar" viewBox="0 0 17 17" aria-hidden="true"><path d="M4.958 12.042 12.042 4.958M4.958 4.958h7.084v7.084"/></svg>';
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const get = (o, p) => String(p).split('.').reduce((v, k) => v == null ? v : v[k], o);
  // подстановки в тексте: {phone}, {t}, {n} …
  const f = (s, v = {}) => String(s == null ? '' : s).replace(/\{(\w+)\}/g, (m, k) => v[k] != null ? v[k] : m);
  const vis = a => (a || []).filter(x => x && !x.hidden);
  const digits = s => String(s || '').replace(/[^\d+]/g, '');

  // ── содержимое → window.OG (форма, которой пользуются скрипты сайта) ──
  function build(src) {
    const C = JSON.parse(JSON.stringify(src || {})), ct = C.contacts || {};
    const tel = digits(ct.phone);
    const OG = {
      phone: ct.phone || '', phoneHref: 'tel:' + tel, email: ct.email || '', hours: ct.hours || '', city: ct.city || '',
      priceList: ct.priceList || '', tg: ct.tg || '', maxProfile: ct.maxProfile || '', max: ct.max || 'https://web.max.ru/',
      maxQr: 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:' + (ct.vcardName || 'ОГНЕВЕД') + '\r\nTEL;TYPE=CELL:' + tel + '\r\nEND:VCARD',
      legal: C.legal || {},
      nav: vis(C.nav),
      services: vis(C.services),
      objects: vis(C.objects),
      steps: vis(C.steps),
      about: C.about || { facts: [], pros: [] },
      works: vis(C.works),
      articles: vis(C.articles),
      bookCats: C.bookCats || [],
      books: vis(C.books),
      faq: vis(C.faq),
      geoImg: C.geoImg || '',
      coverage: (C.coverage || []).map(c => [c.t, +c.lon, +c.lat]),
      cities: vis(C.cities).map(c => [c.t, +c.lon, +c.lat, +c.n || 0, c.w || '']),
      clients: vis(C.clients),
      calc: C.calc || {},
      tx: C.tx || {},
      btn: C.btn || {},
      seo: C.seo || {},
      forms: C.forms || {},
    };
    // порядок услуг на сайте — порядок списка в админке
    OG.svcOrder = OG.services.map(s => s.id);
    OG.text = { articles: {}, work: C.workTpl || {} };
    OG.articles.forEach(a => { OG.text.articles[a.id] = { lead: a.lead || '', body: (a.body || []).map(b => [b.h || '', b.p || '']) }; });
    OG.rub = n => n.toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽';
    OG.cost = s => (s.price ? 'от&nbsp;' + OG.rub(s.price) : 'Индивидуально');
    OG.bookCat = id => OG.bookCats.find(c => c.id === id);
    OG.svc = id => OG.services.find(s => s.id === id);
    OG.f = f;
    OG.esc = esc;
    OG.B = (l, cls, v, o) => btn(OG, l, cls, v, o);
    OG.href = (l, v) => href(OG, l, v);
    return OG;
  }

  // ── кнопки: «куда ведёт» задаётся в админке ──
  // to: form — окно заявки (q — тема заявки), calc — калькулятор, cnt — окно контактов, page — страница сайта,
  //     block — блок главной, tel, mail, tg, max, url — своя ссылка, doc — документ библиотеки, none — никуда
  const OPEN = { form: 1, calc: 1, cnt: 1 };
  function href(OG, l, v) {
    l = l || {};
    const main = typeof document !== 'undefined' && document.querySelector && document.querySelector('main.frame:not(.pg)');
    switch (l.to) {
      case 'page': return f(l.page || 'index.html', v);
      case 'block': return (main ? '' : 'index.html') + '#' + (l.block || 'top');
      case 'tel': return OG.phoneHref;
      case 'mail': return 'mailto:' + OG.email;
      case 'tg': return OG.tg;
      case 'max': return OG.max;
      case 'doc': { const b = OG.books.find(x => x.id === l.doc); return b ? (b.pdf || 'kniga.html?id=' + b.id) : 'biblioteka.html'; }
      case 'url': return f(l.url || '', v);
      default: return '';
    }
  }
  function btn(OG, l, cls = 'fb', v = {}, o = {}) {
    l = l || {};
    const t = f(l.text, v), to = l.to || 'form';
    const body = o.inner ? o.inner(t) : `<span>${t}</span>${o.arrow === false ? '' : AR}`;
    const at = (cls ? ` class="${cls}"` : '') + (o.attrs || '');
    if (OPEN[to]) {
      const q = to === 'form' ? f(l.q, v) : '';
      return `<button${at} data-open="${to}"${q ? ` data-q="${esc(q)}"` : ''}${o.svc && to === 'calc' ? ` data-svc="${o.svc}"` : ''}>${body}</button>`;
    }
    if (to === 'none') return `<button${at} type="button">${body}</button>`;
    const h = href(OG, l, v);
    // внешние адреса и файлы — в новой вкладке; intent: (MAX на Android) — в той же
    const blank = /^https?:/.test(h) || /\.pdf$/i.test(h) ? ' target="_blank" rel="noopener"' : '';
    return `<a${at} href="${esc(h)}"${blank}>${body}</a>`;
  }

  // ── подстановка текстов в разметку ──
  // data-c="путь" — внутренность элемента (data-k="N" — первые N детей-элементов, значки, остаются);
  // data-b="ключ кнопки" — элемент целиком заменяется кнопкой с тем же классом
  const val = (OG, p) => { const v = get(OG, p); return Array.isArray(v) ? lines(v) : v; };
  // заголовок первого экрана: строки, последняя — красной плашкой
  const lines = a => a.map((t, i) => `<span class="ln"><span>${i === a.length - 1 ? `<mark class="hl"><b>${t}</b></mark>` : t}</span></span>`).join(' ');
  function fillDom(OG, root) {
    root.querySelectorAll('[data-c]').forEach(el => {
      const v = val(OG, el.dataset.c); if (v == null) return;
      const k = +el.dataset.k || 0, keep = [...el.children].slice(0, k);
      const html = keep.map(x => x.outerHTML).join('') + v;
      if (el.innerHTML !== html) { el.innerHTML = ''; keep.forEach(x => el.append(x)); el.insertAdjacentHTML('beforeend', v); }
    });
    root.querySelectorAll('[data-b]').forEach(el => {
      const l = OG.btn[el.dataset.b]; if (!l) return;
      const cls = el.getAttribute('class');
      const t = document.createElement('template');
      t.innerHTML = btn(OG, l, cls, {}, { attrs: ` data-b="${el.dataset.b}"` + (el.id ? ` id="${el.id}"` : '') });
      const n = t.content.firstElementChild;
      if (n && n.outerHTML !== el.outerHTML) el.replaceWith(n);
    });
  }
  // то же для текста страницы — при публикации (админка пишет index.html с актуальными текстами, их видят поисковики)
  function closeAt(html, from, tag) {
    // конец элемента <tag …> с учётом вложенных одноимённых
    const re = new RegExp(`<(/?)${tag}(?=[\\s>/])[^>]*>`, 'gi');
    re.lastIndex = from; let d = 1, m;
    while ((m = re.exec(html))) { if (m[1]) { if (--d === 0) return [m.index, re.lastIndex]; } else if (!/\/>$/.test(m[0])) d++; }
    return null;
  }
  function fillHtml(html, OG, page) {
    let out = '', i = 0;
    const re = /<([a-z0-9]+)((?:\s[^>]*?)?\sdata-([cb])="([^"]+)"[^>]*)>/gi;
    let m;
    while ((m = re.exec(html))) {
      const [all, tag, attrs, kind, key] = m, start = m.index, open = start + all.length;
      const end = closeAt(html, open, tag); if (!end) continue;
      if (kind === 'c') {
        const v = val(OG, key); if (v == null) continue;
        const k = +((/\sdata-k="(\d+)"/.exec(attrs) || [])[1] || 0);
        let p = open;
        for (let j = 0; j < k; j++) { const t = /^\s*<([a-z0-9]+)/i.exec(html.slice(p)); if (!t) break; const e = closeAt(html, p + t[0].length, t[1]); if (!e) break; p = e[1]; }
        out += html.slice(i, p) + v; i = end[0];
      } else {
        const l = OG.btn[key]; if (!l) continue;
        const cls = (/\sclass="([^"]*)"/.exec(attrs) || [])[1], id = (/\sid="([^"]*)"/.exec(attrs) || [])[1];
        out += html.slice(i, start) + btn(OG, l, cls, {}, { attrs: ` data-b="${key}"` + (id ? ` id="${id}"` : '') }); i = end[1];
      }
      re.lastIndex = Math.max(re.lastIndex, i);
    }
    out += html.slice(i);
    // заголовок вкладки и описание для поисковиков
    const s = page && OG.seo[page];
    if (s) {
      if (s.title) out = out.replace(/<title>[^<]*<\/title>/, `<title>${esc(s.title)}</title>`);
      if (s.description) out = out.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(s.description)}">`);
    }
    return out;
  }

  const CORE = { build, btn, href, fillHtml, fillDom, esc, f, AR };
  if (typeof window === 'undefined') { module.exports = CORE; return; }
  window.OG_CORE = CORE;

  // ── страница сайта ──
  let src = window.OG_CONTENT, prev = null;
  try { if (window.parent !== window && window.parent.OG_PREVIEW) { prev = window.parent.OG_PREVIEW; src = prev.content(); } } catch (e) { /* чужое окно */ }
  if (!src) return;
  const OG = window.OG = build(src);
  OG.preview = !!prev;
  window.OG_TEXT = OG.text;
  if (document.body) fillDom(OG, document);
})();
