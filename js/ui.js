// Общие элементы всех страниц: шапка с панелями меню, подвал, «блуждающие» кнопки, окна, формы, кнопки связи
// Язык — как у главной (Figma «home»): Inter Tight, чёрный #0f1012, красный #f5312a, линии рамки, стрелка-уголок в кнопках.
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const D = window.OG, X = D.tx, BT = D.btn;
  // MAX: ссылка профиля открывает чат прямо в приложении. Пока её нет, на Android кнопка зовёт приложение MAX (пакет ru.oneme.app)
  // по адресу max.ru, а без приложения браузер уходит в веб-версию (S.browser_fallback_url); на iPhone и ПК — веб-версия
  if (D.maxProfile) { D.max = D.maxProfile; D.maxQr = D.maxProfile; }
  else if (/Android/i.test(navigator.userAgent)) D.max = `intent://max.ru/#Intent;scheme=https;package=ru.oneme.app;S.browser_fallback_url=${encodeURIComponent(D.max)};end`;
  // внешняя ссылка; пустая (мессенджеры, пока нет адресов) — ссылка без href, никуда не ведёт.
  // intent: — в той же вкладке: из новой вкладки встроенные браузеры (Telegram) приложение не открывают
  const ext = h => !h ? '' : /^intent:/.test(h) ? ` href="${h}"` : ` href="${h}" target="_blank" rel="noopener"`;
  const sv = (p, vb = 24) => `<svg viewBox="0 0 ${vb} ${vb}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;

  // знаки связи — заливкой: MAX — официальный знак (maxicons.ru), Telegram, телефон и почта — им в пару
  const fl = (p, vb = 24) => `<svg viewBox="0 0 ${vb} ${vb}" fill="currentColor" aria-hidden="true">${p}</svg>`;
  const ICO = {
    x: sv('<path d="M18 6 6 18M6 6l12 12"/>'),
    tel: fl('<path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.98.98 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>'),
    tg: fl('<path d="M21.2 3.3c.6-.24 1.2.28 1.07.91l-3.1 14.95c-.13.63-.86.92-1.38.55l-4.62-3.33-2.36 2.27c-.34.33-.91.17-1.03-.29l-1.25-4.6-4.35-1.4c-.62-.2-.65-1.06-.05-1.3L21.2 3.3Zm-3.94 4.03-8.1 5.65.66 3.1.27-2.06c.03-.23.14-.44.31-.6l6.86-6.09Z"/>'),
    max: fl('<path d="M350.4,9.6C141.8,20.5,4.1,184.1,12.8,390.4c3.8,90.3,40.1,168,48.7,253.7,2.2,22.2-4.2,49.6,21.4,59.3,31.5,11.9,79.8-8.1,106.2-26.4,9-6.1,17.6-13.2,24.2-22,27.3,18.1,53.2,35.6,85.7,43.4,143.1,34.3,299.9-44.2,369.6-170.3C799.6,291.2,622.5-4.6,350.4,9.6h0ZM269.4,504c-11.3,8.8-22.2,20.8-34.7,27.7-18.1,9.7-23.7-.4-30.5-16.4-21.4-50.9-24-137.6-11.5-190.9,16.8-72.5,72.9-136.3,150-143.1,78-6.9,150.4,32.7,183.1,104.2,72.4,159.1-112.9,316.2-256.4,218.6h0Z"/>', 720),
    mail: fl('<path d="M4 4.5h16A2.5 2.5 0 0 1 22.5 7v.3l-10.5 6.6L1.5 7.3V7A2.5 2.5 0 0 1 4 4.5Zm-2.5 5.2 9.97 6.27c.32.2.74.2 1.06 0L22.5 9.7V17a2.5 2.5 0 0 1-2.5 2.5H4A2.5 2.5 0 0 1 1.5 17V9.7Z"/>'),
    calc: sv('<rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M8.5 6.5h7"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h.01M12 18h.01M15.5 18h.01" stroke-width="2.2"/>'),
    // значок окна связи: QR-код — там и коды для телефона, и звонок, и мессенджеры
    qr: sv('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v.01M14 21h.01M21 17.5V21h-3.5"/>'),
    chat: sv('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/><path d="M8 10h8M8 14h5"/>'),
    ok: sv('<circle cx="12" cy="12" r="10"/><path d="m7.5 12.5 3 3 6-6.5"/>'),
    dl: sv('<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>'),
  };
  const AR_UP = '<svg class="fb-ar" viewBox="0 0 17 17" aria-hidden="true"><path d="M4.958 12.042 12.042 4.958M4.958 4.958h7.084v7.084"/></svg>';
  const FLAG = '<svg class="flag" viewBox="0 0 14 11" aria-hidden="true"><path d="M14 9.036c0 .417-.164.816-.456 1.111a1.55 1.55 0 0 1-1.1.46H1.556a1.55 1.55 0 0 1-1.1-.46A1.58 1.58 0 0 1 0 9.036V7.464h14v1.572Z" fill="#CE2028"/><path d="M0 3.536h14v3.928H0z" fill="#22408C"/><path d="M12.444.393H1.556c-.413 0-.809.165-1.1.46A1.58 1.58 0 0 0 0 1.964v1.572h14V1.964c0-.417-.164-.816-.456-1.111a1.55 1.55 0 0 0-1.1-.46Z" fill="#fff"/></svg>';
  const MAIN = !!$('main.frame:not(.pg)');
  // сенсорная раскладка (css/mobile.css): телефоны, вертикальные планшеты, телефоны боком. Тот же запрос — у <link> mobile.css
  // на всех страницах (_tools/m/inject.cjs): менять в обоих местах
  const MOB = window.OG_MQ = matchMedia('(max-width: 900px), (max-width: 1199px) and (orientation: portrait), (max-width: 1100px) and (max-height: 520px), (max-width: 1199px) and (hover: none) and (pointer: coarse)');

  // слои телефона (меню, окна): открытый слой — запись в истории, «назад» его закрывает
  const layers = [];
  const layer = close => { layers.push(close); history.pushState({ ogl: layers.length }, ''); };
  const unlayer = () => { if (layers.length) history.back(); };
  addEventListener('popstate', () => { const f = layers.pop(); f && f(); });
  // страница вернулась из кэша назад/вперёд — открытые слои закрываем, их записи в истории уже не наши
  addEventListener('pageshow', e => { if (e.persisted) while (layers.length) layers.pop()(); });

  const page = location.pathname.split('/').pop() || 'index.html';
  const sect = { 'uslugi.html': 'uslugi.html', 'usluga.html': 'uslugi.html', 'raboty.html': 'raboty.html', 'rabota.html': 'raboty.html', 'blog.html': 'blog.html', 'statya.html': 'blog.html', 'biblioteka.html': 'biblioteka.html', 'kniga.html': 'biblioteka.html', 'kontakty.html': 'kontakty.html' }[page];

  // ── панель меню — только у «Услуг»: плитки на ширину колонки — миниатюра картинки карточки, название, цена и срок.
  //    У «Наших работ» и «Статей» панели нет: пункт просто ведёт в раздел ──
  const PANELS = {
    'uslugi.html': () => `<ul class="mx-sv">${D.svcOrder.map(D.svc).map((s, i) => `<li class="mx-a" style="--i:${Math.floor(i / 3)}"><a href="usluga.html?id=${s.id}">
          <span class="mx-im"><img data-src="img/${s.img}.webp" alt=""></span>
          <span class="mx-tx"><b>${s.cardT}</b><small>${D.cost(s)} · ${s.days} ${X.pg.days}</small></span></a></li>`).join('')}</ul>`,
  };

  // ── меню телефона: лист под шапкой — разделы строками на линиях (у «Услуг» раскрывается список с миниатюрами),
  //    на главной — переходы к блокам, внизу — телефон, мессенджеры и заявка. Открыто — запись в истории, «назад» закрывает ──
  const BLOCKS = [['about', 'О нас'], ['objects', 'Объекты'], ['works', 'Наши работы'], ['price', 'Стоимость'], ['steps', 'Как мы работаем'], ['geo', 'География'], ['faq', 'Вопросы'], ['blog', 'Статьи'], ['library', 'Библиотека']];
  const mm = { open: false, close: () => {} };
  function mobileMenu(hdr) {
    const bur = $('.hx-bur', hdr), nav = D.nav.map((n, i) => {
      const on = sect === n.href ? ' is-on' : '', num = `<i class="num">${String(i + 1).padStart(2, '0')}</i>`;
      if (!n.sub) return `<a class="mm-a${on}" href="${n.href}">${num}<b>${n.t}</b>${AR_UP}</a>`;
      return `<div class="mm-r"><a class="mm-a${on}" href="${n.href}">${num}<b>${n.t}</b></a><button class="mm-tg" type="button" aria-expanded="false" aria-controls="mm-sv" aria-label="Показать услуги"><i></i></button></div>
        <div class="mm-sv" id="mm-sv"><ul>${D.svcOrder.map(D.svc).map(s => `<li><a href="usluga.html?id=${s.id}"><span class="mm-im"><img data-src="img/m/t/${s.img}.webp" alt="" width="96" height="60"></span><span class="mm-tx"><b>${s.cardT}</b><small>${D.cost(s)} · ${s.days} ${X.pg.days}</small></span></a></li>`).join('')}</ul></div>`;
    }).join('');
    const box = document.createElement('div');
    box.className = 'mm'; box.id = 'mm'; box.inert = true;
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Меню');
    box.innerHTML = `<div class="mm-in">
        <nav class="mm-nav" aria-label="Разделы сайта">${nav}</nav>
        ${MAIN ? `<div class="mm-pg"><p class="mm-k">${X.mm.pg}</p><div class="mm-chips">${BLOCKS.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('')}</div></div>` : ''}
        <div class="mm-ct">
          <p class="mm-k">${X.mm.ct}</p>
          <a class="mm-tel" href="${D.phoneHref}">${D.phone}</a><p class="mm-s">${D.hours}</p>
          <div class="mm-msg"><a${ext(D.max)}>${ICO.max}<span>MAX</span></a><a${ext(D.tg)}>${ICO.tg}<span>Telegram</span></a><a href="mailto:${D.email}">${ICO.mail}<span>Почта</span></a></div>
          ${D.B(BT.mm, 'btn btn--red mm-cta', {}, { arrow: false })}
        </div>
      </div>`;
    document.body.append(box);
    let pend = null, loaded = false;
    const set = on => {
      mm.open = on; box.inert = !on;
      box.classList.toggle('is-open', on); hdr.classList.toggle('mm-on', on); document.documentElement.classList.toggle('is-mm', on);
      bur.setAttribute('aria-expanded', on); bur.setAttribute('aria-label', on ? 'Закрыть меню' : 'Меню');
      if (on && !loaded) { loaded = true; $$('img[data-src]', box).forEach(i => { i.src = i.dataset.src; i.removeAttribute('data-src'); }); }
      if (!on && pend) { const t = pend; pend = null; requestAnimationFrame(() => scrollTo({ top: t.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0), behavior: 'smooth' })); }
    };
    // close(true) — без шага назад: слой меню забирает окно, которое открылось из него
    mm.close = handoff => { if (!mm.open) return; if (handoff) { set(false); return true; } unlayer(); };
    bur.addEventListener('click', () => { if (mm.open) mm.close(); else { set(true); layer(() => set(false)); } });
    box.addEventListener('click', e => {
      const tg = e.target.closest('.mm-tg');
      if (tg) { const on = tg.getAttribute('aria-expanded') !== 'true'; tg.setAttribute('aria-expanded', on); $('.mm-sv', box).classList.toggle('is-open', on); return; }
      // переход к блоку этой же страницы: сначала закрываем меню, потом едем к блоку
      const a = e.target.closest('a[href]'); if (!a) return;
      const u = new URL(a.href, location.href), here = p => p.replace(/\/$/, '/index.html');
      if (u.hash && here(u.pathname) === here(location.pathname)) { const t = document.querySelector(u.hash); if (t) { e.preventDefault(); pend = t; mm.close(); } }
    });
    addEventListener('keydown', e => { if (e.key === 'Escape' && mm.open) mm.close(); });
    // раскладка сменилась на ПК (поворот планшета) — меню закрываем
    MOB.addEventListener('change', () => { if (!MOB.matches && mm.open) mm.close(); });
  }

  // ── шапка: логотип-слово, меню капсом, телефон, чёрная кнопка с красной стрелкой; у «Услуг» — панель при наведении ──
  function header() {
    const el = $('#hdr'); if (!el) return;
    const links = D.nav.map(n => {
      const on = sect === n.href ? ' class="is-on"' : '';
      return PANELS[n.href] ? `<a href="${n.href}"${on} data-mx="${n.href}" aria-haspopup="true" aria-expanded="false">${n.t}</a>` : `<a href="${n.href}"${on}>${n.t}</a>`;
    }).join('');
    el.classList.add('hx');
    el.innerHTML = `<div class="hx-in">
      <a class="hx-logo" href="index.html" aria-label="ОГНЕВЕД — на главную"><img src="img/logo.svg" width="940" height="214" alt="ОГНЕВЕД"><small>${X.hdr.tag}</small></a>
      <nav class="hx-nav" aria-label="Разделы сайта">${links}</nav>
      <a class="hx-tel" href="${D.phoneHref}">${D.phone}</a>
      ${D.B(BT.hdr, 'hx-btn')}
      <a class="hx-call m-only" href="${D.phoneHref}" aria-label="Позвонить: ${D.phone}">${ICO.tel}</a>
      <button class="hx-bur m-only" type="button" aria-label="Меню" aria-expanded="false" aria-controls="mm"><i></i><i></i></button></div>
      <div class="mx">${Object.entries(PANELS).map(([k, f]) => `<div class="mx-p" data-mx="${k}" inert><div class="mx-in">${f()}</div></div>`).join('')}</div>`;
    const veil = document.createElement('div'); veil.className = 'mx-veil'; el.after(veil);
    mobileMenu(el);

    // наведение с намерением: панель открывается после короткой паузы, закрывается с задержкой — курсор успевает
    // спуститься с пункта на панель наискосок; между панелями переключение без шторки
    const ps = $$('.mx-p', el), keys = $$('[data-mx]', $('.hx-nav', el));
    let cur = null, tOpen = 0, tClose = 0, loaded = false;
    const load = () => { if (loaded) return; loaded = true; $$('img[data-src]', el).forEach(i => { i.src = i.dataset.src; i.removeAttribute('data-src'); }); };
    const set = k => {
      clearTimeout(tOpen); clearTimeout(tClose);
      if (k === cur) return;
      const snap = !!(cur && k);
      ps.forEach(p => { const on = p.dataset.mx === k; p.classList.toggle('is-snap', snap); p.classList.toggle('is-open', on); p.inert = !on; });
      keys.forEach(a => { const on = a.dataset.mx === k; a.classList.toggle('is-hot', on); a.setAttribute('aria-expanded', on); });
      el.classList.toggle('mx-on', !!k); veil.classList.toggle('is-on', !!k);
      cur = k;
      if (k) load();
      if (snap) requestAnimationFrame(() => requestAnimationFrame(() => ps.forEach(p => p.classList.remove('is-snap'))));
    };
    const later = () => { clearTimeout(tOpen); if (cur) { clearTimeout(tClose); tClose = setTimeout(() => set(null), 260); } };
    // пустое место шапки (полоса между пунктом и панелью) панель не закрывает — закрывают другие пункты, логотип, телефон, кнопка
    el.addEventListener('mouseover', e => {
      const a = e.target.closest('[data-mx]');
      if (a && a.closest('.hx-nav')) { load(); clearTimeout(tClose); clearTimeout(tOpen); tOpen = setTimeout(() => set(a.dataset.mx), cur ? 40 : 110); return; }
      if (e.target.closest('.mx-p')) { clearTimeout(tClose); clearTimeout(tOpen); return; }
      if (e.target.closest('a, button')) later(); else clearTimeout(tOpen);
    });
    el.addEventListener('mouseleave', e => { clearTimeout(tOpen); clearTimeout(tClose); if (!overPanel(e)) tClose = setTimeout(() => set(null), 200); });
    el.addEventListener('focusin', e => { const a = e.target.closest('[data-mx]'); if (a && a.closest('.hx-nav')) set(a.dataset.mx); else if (!e.target.closest('.mx-p')) set(null); });
    el.addEventListener('focusout', e => { if (!el.contains(e.relatedTarget)) set(null); });
    // шторка закрывает панель, только если курсор не над её листом: пока лист раскрывается, его нераскрытая часть
    // не ловит курсор и под ним оказывается шторка — по ней панель закрываться не должна
    const overPanel = e => { const p = cur && $(`.mx-p[data-mx="${cur}"]`, el); if (!p) return false; const r = p.getBoundingClientRect(); return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top - 2 && e.clientY <= r.bottom; };
    veil.addEventListener('mousemove', e => { if (overPanel(e)) { clearTimeout(tClose); clearTimeout(tOpen); } else if (cur) { clearTimeout(tClose); tClose = setTimeout(() => set(null), 160); } });
    addEventListener('keydown', e => { if (e.key === 'Escape' && cur) set(null); });
    el.addEventListener('click', e => { if (e.target.closest('[data-open]')) set(null); });
    // картинки панелей подгружаются, когда страница уже загрузилась
    addEventListener('load', () => setTimeout(load, 1500));

    // при прокрутке вниз шапка уходит, при движении вверх — возвращается; срабатывает только после 48px пути в одну сторону,
    // чтобы не дёргаться от мелких толчков. Внутри закреплённых блоков главной («Как мы работаем», «Объекты») шапка стоит на месте
    let last = scrollY, anchor = scrollY, dir = 0;
    // на телефоне «Объекты» — обычная лента, закреплены только карточки шагов
    const pinned = () => [...document.querySelectorAll(MOB.matches ? '#stk-run' : '#stk-run, #objects')].some(p => { const r = p.getBoundingClientRect(); return r.top < innerHeight * .5 && r.bottom > innerHeight * .5; });
    const onS = () => {
      const y = scrollY, d = Math.sign(y - last);
      el.classList.toggle('is-scrolled', y > 8);
      if (cur && Math.abs(y - anchor) > 24) set(null);
      if (d && d !== dir) { dir = d; anchor = last; }
      if (y < (MOB.matches ? 240 : 600) || pinned()) el.classList.remove('is-hid');
      else if (dir > 0 && y - anchor > 48) el.classList.add('is-hid');
      else if (dir < 0 && anchor - y > 48) el.classList.remove('is-hid');
      last = y;
    };
    addEventListener('scroll', onS, { passive: true }); onS();
  }

  // ── подвал: тёмный, в формате «Зелёного патруля» — сверху логотип и контакты крупно (подпись капсом + значение),
  //    посередине призыв с кнопкой и колонки ссылок, снизу линия во всю ширину и служебная строка ──
  function footer() {
    const el = $('#ftr'); if (!el) return;
    const S = D.svcOrder.map(D.svc);
    el.innerHTML = `<div class="wrap2 fd">
      <div class="fd-top">
        <div class="fd-brand-w"><a class="fd-brand" href="${MAIN ? '#top' : 'index.html'}" aria-label="ОГНЕВЕД — ${MAIN ? 'наверх' : 'на главную'}"><img src="img/logo-white.svg" width="940" height="214" alt="ОГНЕВЕД"><small>${X.ftr.tag}</small></a>
          <p class="fd-claim">${X.ftr.claim}</p></div>
        <div class="fd-col"><p class="fd-l">${X.ftr.telL}</p><a class="fd-v" href="${D.phoneHref}">${D.phone}</a><p class="fd-s">${D.hours}</p></div>
        <div class="fd-col"><p class="fd-l">${X.ftr.mailL}</p><a class="fd-v" href="mailto:${D.email}">${D.email}</a><p class="fd-s">${X.ftr.mailS}</p></div>
        <div class="fd-col"><p class="fd-l">${X.ftr.msgL}</p><div class="fd-socs"><a${ext(D.max)} aria-label="MAX">${ICO.max}</a><a${ext(D.tg)} aria-label="Telegram">${ICO.tg}</a><a href="mailto:${D.email}" aria-label="Почта">${ICO.mail}</a></div></div>
      </div>
      <div class="fd-mid">
        <div class="fd-cta"><p class="fd-h">${X.ftr.cta}</p>
          ${D.B(BT.ftr, 'fd-btn')}</div>
        <div><p class="fd-l">${X.ftr.navL}</p><ul class="fd-ul">${D.nav.map(n => `<li><a href="${n.href}">${n.t}</a></li>`).join('')}</ul></div>
        <div><p class="fd-l">${X.ftr.svcL}</p><ul class="fd-ul">${S.map(s => `<li><a href="usluga.html?id=${s.id}">${s.short}</a></li>`).join('')}</ul></div>
        <div><p class="fd-l">${X.ftr.geoL}</p><p class="fd-t">${D.city.split(',')[0]}</p><p class="fd-s">${D.city.split(',').slice(1).join(',').trim()}</p>
          <p class="fd-l fd-l--gap">${X.ftr.hoursL}</p><p class="fd-t">${D.hours.replace(/,.*/, '')}</p><p class="fd-s">${(D.hours.split(',')[1] || '').trim()}</p></div>
      </div>
      <div class="fd-bot"><span>${X.ftr.copy}</span><a href="politika.html">${X.ftr.privacy}</a><a href="soglasie.html">${X.ftr.consent}</a><a href="#top">${X.ftr.up}</a></div>
    </div>`;
  }

  // ── формы: поля как в форме первого экрана (Figma «home» 2038:34) — #f3f3f4 с обводкой, подпись внутри поля ──
  const telField = () => `<label class="fld fld--tel">${FLAG}<input name="phone" type="tel" placeholder="+7 (000) 000 00 00" autocomplete="tel" required><span class="pfx">+7</span></label>`;
  // o.form — какая это форма (в админке видно, откуда пришла заявка, и по нему выбирают, куда её отправить)
  const FX = X.form, okOf = k => (D.forms[k] && D.forms[k].ok) || FX.ok;
  const agree = () => `<label class="consent agr"><input type="checkbox" name="agree" required><i></i><span>${FX.agree}</span></label>`;
  const formHTML = (o = {}) => `<form class="form ff${o.cls ? ' ' + o.cls : ''}" data-form="${o.form || 'modal'}" novalidate>
    <label class="fld"><input name="name" placeholder=" " autocomplete="name"><span>${FX.name}</span></label>
    ${telField()}
    ${o.q === false ? '' : `<label class="fld fld--ta"><textarea name="q" placeholder=" " rows="3"></textarea><span>${o.ql || FX.q}</span></label>`}
    <button class="btn btn--red" type="submit">${o.btn || FX.btn}</button>
    ${agree()}
    <div class="form-ok">${ICO.ok}<div><b>${FX.okT}</b><p class="muted">${okOf(o.form || 'modal')}</p></div></div>
  </form>`;
  // строка формы как на первом экране: имя, телефон, объект и красная кнопка в один ряд
  const formRow = (o = {}) => `<form class="form hf" data-form="${o.form || 'cta'}" novalidate>
    <label class="fld"><input name="name" placeholder=" " autocomplete="name"><span>${FX.name}</span></label>
    ${telField()}
    <label class="fld"><input name="obj" placeholder=" "><span>${o.ql || FX.obj}</span></label>
    <button class="btn btn--red" type="submit">${o.btn || FX.btnRow}</button>
    ${agree()}
    <div class="form-ok">${ICO.ok}<div><b>${FX.okT}</b><p class="muted">${okOf(o.form || 'cta')}</p></div></div>
  </form>`;
  function bindForms(root = document) {
    $$('form.form', root).forEach(f => {
      if (f.dataset.bound) return; f.dataset.bound = 1;
      const tel = $('input[type=tel]', f); if (!tel) return;
      tel.addEventListener('input', () => {
        let d = tel.value.replace(/\D/g, ''); if (!d) { tel.value = ''; return; }
        if (d[0] === '8') d = '7' + d.slice(1); if (d[0] !== '7') d = '7' + d; d = d.slice(0, 11);
        const p = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)];
        tel.value = '+7' + (p[0] ? ' (' + p[0] : '') + (p[0].length === 3 ? ') ' : '') + p[1] + (p[2] ? '-' + p[2] : '') + (p[3] ? '-' + p[3] : '');
        tel.closest('.fld').classList.remove('err');
      });
      f.addEventListener('change', e => { if (e.target.name === 'agree') e.target.closest('.agr').classList.remove('err'); });
      f.addEventListener('submit', e => {
        e.preventDefault();
        if (tel.value.replace(/\D/g, '').length < 11) { tel.closest('.fld').classList.add('err'); tel.focus(); return; }
        const agr = f.elements.agree;
        if (agr && !agr.checked) { agr.closest('.agr').classList.add('err'); agr.focus(); return; }
        sendLead(f);
      });
    });
  }

  // ── заявка уходит на сервер (send.php): сохраняется в админке → «Заявки» и рассылается туда, куда указано в админке.
  //    t — сколько мс страница открыта: робот отправляет форму сразу. В предпросмотре админки заявки не отправляются ──
  const leadCtx = { topic: '', btn: '' };
  const utm = (() => { try { const q = new URLSearchParams(location.search), o = {}; ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(k => { if (q.get(k)) o[k] = q.get(k); }); if (Object.keys(o).length) sessionStorage.setItem('og-utm', JSON.stringify(o)); return JSON.parse(sessionStorage.getItem('og-utm') || '{}'); } catch (e) { return {}; } })();
  function sendLead(f) {
    const kind = f.dataset.form || 'modal', el = f.elements, v = n => (el[n] && el[n].value || '').trim();
    const lead = { form: kind, name: v('name'), phone: v('phone'), text: v('q') || v('obj'), page: location.pathname.split('/').pop() + location.search,
      title: document.title, ref: document.referrer, utm, t: Math.round(performance.now()) };
    if (kind === 'modal') { lead.topic = leadCtx.topic; lead.btn = leadCtx.btn; }
    if (f.ogExtra) Object.assign(lead, f.ogExtra());
    const btn = $('button[type=submit]', f), done = () => { f.classList.add('is-sent'); f.classList.remove('is-busy'); btn.disabled = false; };
    if (D.preview) return done();
    f.classList.add('is-busy'); btn.disabled = true;
    fetch(D.forms.endpoint || 'send.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) })
      .then(r => r.json()).then(j => { if (!j.ok) throw new Error(j.error); done(); f.reset(); })
      .catch(() => { f.classList.remove('is-busy'); btn.disabled = false; alert(D.f(FX.err, { phone: D.phone })); });
  }

  // ── связаться: звонок и мессенджеры кнопками — значок в квадрате, подпись капсом и действие, стрелка-уголок.
  //    msgBlock(['max', 'tg']) — только мессенджеры ──
  const MSG = [['tel', X.msg.telK, D.phone, D.phoneHref], ['max', D.f(X.msg.maxK, { phone: D.phone }), X.msg.maxV, D.max], ['tg', X.msg.tgK, X.msg.tgV, D.tg]];
  // qr: код для телефона; строится из той же ссылки, что и кнопка (у звонка — tel:, камера предложит набрать номер)
  const qr = h => { qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8']; const q = qrcode(0, 'M'); q.addData(h, 'Byte'); q.make(); const n = q.getModuleCount(); let d = ''; for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`; return `<svg class="msg-q" viewBox="-2 -2 ${n + 4} ${n + 4}" shape-rendering="crispEdges" aria-hidden="true"><path d="${d}"/></svg>`; };
  const msgBlock = (only, withQr) => `<div class="msg${withQr ? ' msg--qr' : ''}">${MSG.filter(m => !only || only.includes(m[0])).map(([k, t, v, h]) =>
    `<a class="msg-b"${k === 'tel' ? ` href="${h}"` : ext(h)}><span class="msg-i">${ICO[k]}</span><span class="msg-t"><small>${t}</small><b>${v}</b></span>${withQr ? qr(k === 'max' ? D.maxQr : h) : ''}${AR_UP}</a>`).join('')}</div>`;

  // ── коэффициенты калькулятора стоимости (js/calc.js) ──
  const K = D.calc;
  const calc = { data: { AREA: K.area.map(a => [a.t + ' м²', +a.k]), BLD: K.bld.map(b => [b.t, +b.k]), KOBJ: Object.fromEntries(D.objects.map(o => [o.id, +o.k || 1])) } };

  // ── окна и «блуждающие» кнопки ──
  // заявка: слева — тонированная панель с обещаниями и телефоном (рамка с крестиками, как блоки главной), справа — форма
  function modals() {
    const box = document.createElement('div');
    box.innerHTML = `
      <div class="modal mdl" id="m-form" role="dialog" aria-modal="true" aria-label="Заявка на консультацию"><div class="modal-box mdl-box"><button class="modal-x" data-close aria-label="Закрыть">${ICO.x}</button>
        <aside class="mdl-l">
          <p class="badge badge--flat"><i></i>${X.mForm.badge}</p>
          <h3 class="mdl-h">${X.mForm.h}</h3>
          <ul class="mdl-ul">${X.mForm.ul.map(t => `<li>${t}</li>`).join('')}</ul>
          <div class="mdl-c"><div class="mdl-ct"><p class="mdl-k">${X.mForm.callK}</p><a href="${D.phoneHref}">${D.phone}</a><small>${D.hours}</small></div>${qr(D.phoneHref)}</div>
        </aside>
        <div class="mdl-r"><p class="mdl-t">${X.mForm.t}</p><p class="mdl-s">${X.mForm.s}</p>${formHTML({ form: 'modal' })}</div></div></div>
      <div class="modal modal--wide" id="m-calc" role="dialog" aria-modal="true" aria-label="Калькулятор стоимости"><div class="modal-box"><button class="modal-x" data-close aria-label="Закрыть">${ICO.x}</button><div data-calc></div></div></div>
      <div class="modal mdl mdl--cnt" id="m-cnt" role="dialog" aria-modal="true" aria-label="Контакты"><div class="modal-box"><button class="modal-x" data-close aria-label="Закрыть">${ICO.x}</button>
        <p class="badge badge--flat"><i></i>${X.mCnt.badge}</p>
        <h3 class="mdl-h">${X.mCnt.h}</h3><p class="mdl-s">${X.mCnt.s}</p>${msgBlock(null, true)}
        <dl class="mdl-dl"><div><dt>${X.mCnt.mailL}</dt><dd><a href="mailto:${D.email}">${D.email}</a></dd></div><div><dt>${X.mCnt.hoursL}</dt><dd>${D.hours}</dd></div></dl></div></div>
      <div class="dock" aria-label="Быстрые действия">
        <button data-open="cnt" aria-label="Позвонить, написать или открыть QR-код">${ICO.qr.replace('<svg', '<svg class="pc-only"')}${ICO.tel.replace('<svg', '<svg class="m-only"')}<span class="d-tip">${X.dock.cnt}</span></button>
        <button data-open="form" aria-label="${X.dock.ask}">${ICO.chat}<span class="d-tip">${X.dock.ask}</span></button>
        <button class="d-main" data-open="calc" aria-label="${X.dock.calc}">${ICO.calc}<span>${X.dock.calc}</span></button>
      </div>`;
    document.body.append(...box.children);
    // содержимое окна — в обёртке: на телефоне лист прокручивается внутри неё, а крестик стоит; на ПК обёртка — display: contents
    $$('.modal-box').forEach(b => { const w = document.createElement('div'); w.className = 'modal-sc'; w.append(...[...b.children].filter(c => !c.matches('.modal-x'))); b.append(w); });
    bindForms();
    let last;
    const open = (id, data = {}) => {
      const m = $('#m-' + id); if (!m) return;
      last = document.activeElement;
      if (id === 'calc' && data.svc) { const c = $('[data-calc]', m); c.ogSet && c.ogSet(data.svc); }
      if (id === 'form') { const f = $('form', m); f.classList.remove('is-sent'); const q = $('textarea', f); if (q) q.value = data.q || ''; leadCtx.topic = data.q || ''; leadCtx.btn = data.btn || ''; }
      // окно из меню телефона занимает его запись в истории; одно окно поверх другого — тоже без новой записи
      const was = $('.modal.is-open');
      if (was && was !== m) was.classList.remove('is-open');
      if (MOB.matches) { if (mm.close(true)) layers[layers.length - 1] = shut; else if (!was) layer(shut); }
      m.classList.add('is-open'); document.body.classList.add('is-locked'); window.OG_LENIS && window.OG_LENIS.stop();
      // на телефоне поле сразу не фокусируем: клавиатура закрыла бы половину листа, пока его ещё не прочитали
      setTimeout(() => (MOB.matches ? $('.modal-x', m) : $('input:not([type=radio]):not([type=checkbox])', m) || $('.modal-x', m)).focus({ preventScroll: true }), 60);
    };
    const shut = () => { $$('.modal.is-open').forEach(m => m.classList.remove('is-open')); document.body.classList.remove('is-locked'); window.OG_LENIS && window.OG_LENIS.start(); last && last.focus && last.focus({ preventScroll: true }); };
    const close = () => { if (!$('.modal.is-open')) return; if (MOB.matches && layers.length) unlayer(); else shut(); };
    document.addEventListener('click', e => {
      // карточка с кнопкой (data-card) нажимается целиком: клик мимо кнопки отдаём её главной кнопке или ссылке
      const cd = e.target.closest('[data-card]');
      if (cd && !e.target.closest('a, button, input, textarea, select, label')) { const b = cd.querySelector('[data-open], a[href]'); if (b) { b.click(); return; } }
      const o = e.target.closest('[data-open]');
      if (o) { e.preventDefault(); open(o.dataset.open, { svc: o.dataset.svc, q: o.dataset.q, btn: (o.getAttribute('aria-label') || o.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80) }); return; }
      if (e.target.closest('[data-close]') || e.target.classList.contains('modal')) close();
    });
    addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    window.OG_UI.open = open;

    // телефон: лист окна тянется вниз пальцем (когда его содержимое у верха) — дотянули на треть или смахнули, лист закрывается
    $$('.modal').forEach(m => {
      const box = $('.modal-box', m), sc = $('.modal-sc', m);
      let y0 = null, dy = 0, t0 = 0;
      box.addEventListener('touchstart', e => {
        if (!MOB.matches || e.touches.length > 1 || sc.scrollTop > 2 || e.target.closest('input, textarea, select')) { y0 = null; return; }
        y0 = e.touches[0].clientY; dy = 0; t0 = performance.now();
      }, { passive: true });
      box.addEventListener('touchmove', e => {
        if (y0 === null) return;
        dy = e.touches[0].clientY - y0;
        if (dy <= 0) { box.style.transition = box.style.transform = ''; if (dy < -8) y0 = null; return; }
        if (e.cancelable) e.preventDefault();
        box.style.transition = 'none'; box.style.transform = `translateY(${dy}px)`;
      }, { passive: false });
      const end = () => {
        if (y0 === null) return; y0 = null;
        const go = dy > box.offsetHeight / 3 || (dy > 50 && dy / (performance.now() - t0) > .5);
        box.style.transition = '';
        if (!go) { box.style.transform = ''; return; }
        box.style.transform = 'translateY(100%)';
        close(); setTimeout(() => { box.style.transform = ''; }, 550);
      };
      box.addEventListener('touchend', end); box.addEventListener('touchcancel', end);
    });

    // нижняя панель телефона: появляется, когда первый экран ушёл вверх; прячется у подвала (там те же контакты)
    // и пока печатают в поле — клавиатура подняла бы её на середину экрана. Под меню и окнами её скрывает mobile.css
    const dock = $('.dock'), ftr = $('#ftr');
    let past = false, foot = false, typing = false, wait = false;
    const paint = () => dock.classList.toggle('is-up', MOB.matches && past && !foot && !typing);
    const onS = () => { wait = false; const p = scrollY > innerHeight * .75; if (p !== past) { past = p; paint(); } };
    addEventListener('scroll', () => { if (!wait) { wait = true; requestAnimationFrame(onS); } }, { passive: true }); onS();
    if (ftr) new IntersectionObserver(([e]) => { foot = e.isIntersecting; paint(); }).observe(ftr);
    const field = t => t.matches && t.matches('input:not([type=checkbox]):not([type=radio]), textarea, select');
    document.addEventListener('focusin', e => { if (field(e.target)) { typing = true; paint(); } });
    document.addEventListener('focusout', e => { if (field(e.target)) { typing = false; setTimeout(paint, 250); } });
    MOB.addEventListener('change', paint);
  }

  window.OG_UI = { $, $$, ICO, AR_UP, formHTML, formRow, bindForms, calc, msgBlock, qr, MOB, sendLead };
  header(); footer(); modals();
  // ленивые картинки — за экран до блока, а не у самого края: в лентах (объекты, статьи, ленты телефона) карточки стоят
  // за правым краем окна, и браузер сам начинает их грузить, только когда карточка почти выехала. Качество то же, меняется только момент
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; io.unobserve(e.target); $$('img[loading="lazy"]', e.target).forEach(i => { i.loading = 'eager'; }); }), { rootMargin: '100% 0px' });
    const watch = () => $$('main section').forEach(s => io.observe(s));
    document.readyState === 'complete' ? watch() : addEventListener('load', watch, { once: true });
  }
})();
