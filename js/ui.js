// Общие элементы всех страниц: шапка с панелями меню, подвал, «блуждающие» кнопки, окна, формы, кнопки связи
// Язык — как у главной (Figma «home»): Inter Tight, чёрный #0f1012, красный #f5312a, линии рамки, стрелка-уголок в кнопках.
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const D = window.OG;
  // внешняя ссылка; пустая (мессенджеры, пока нет адресов) — ссылка без href, никуда не ведёт
  const ext = h => h ? ` href="${h}" target="_blank" rel="noopener"` : '';
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
    chat: sv('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/><path d="M8 10h8M8 14h5"/>'),
    ok: sv('<circle cx="12" cy="12" r="10"/><path d="m7.5 12.5 3 3 6-6.5"/>'),
    dl: sv('<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>'),
  };
  const AR_UP = '<svg class="fb-ar" viewBox="0 0 17 17" aria-hidden="true"><path d="M4.958 12.042 12.042 4.958M4.958 4.958h7.084v7.084"/></svg>';
  const FLAG = '<svg class="flag" viewBox="0 0 14 11" aria-hidden="true"><path d="M14 9.036c0 .417-.164.816-.456 1.111a1.55 1.55 0 0 1-1.1.46H1.556a1.55 1.55 0 0 1-1.1-.46A1.58 1.58 0 0 1 0 9.036V7.464h14v1.572Z" fill="#CE2028"/><path d="M0 3.536h14v3.928H0z" fill="#22408C"/><path d="M12.444.393H1.556c-.413 0-.809.165-1.1.46A1.58 1.58 0 0 0 0 1.964v1.572h14V1.964c0-.417-.164-.816-.456-1.111a1.55 1.55 0 0 0-1.1-.46Z" fill="#fff"/></svg>';
  const MAIN = !!$('main.frame:not(.pg)');

  const page = location.pathname.split('/').pop() || 'index.html';
  const sect = { 'uslugi.html': 'uslugi.html', 'usluga.html': 'uslugi.html', 'raboty.html': 'raboty.html', 'rabota.html': 'raboty.html', 'blog.html': 'blog.html', 'statya.html': 'blog.html', 'biblioteka.html': 'biblioteka.html', 'kniga.html': 'biblioteka.html', 'kontakty.html': 'kontakty.html' }[page];

  // ── панель меню — только у «Услуг»: плитки на ширину колонки — миниатюра картинки карточки, название, цена и срок.
  //    У «Наших работ» и «Статей» панели нет: пункт просто ведёт в раздел ──
  const PANELS = {
    'uslugi.html': () => `<ul class="mx-sv">${D.svcOrder.map(D.svc).map((s, i) => `<li class="mx-a" style="--i:${Math.floor(i / 3)}"><a href="usluga.html?id=${s.id}">
          <span class="mx-im"><img data-src="img/s-${s.id}.webp" alt=""></span>
          <span class="mx-tx"><b>${s.cardT}</b><small>от&nbsp;${D.rub(s.price)} · ${s.days} дней</small></span></a></li>`).join('')}</ul>`,
  };

  // ── шапка: логотип-слово, меню капсом, телефон, чёрная кнопка с красной стрелкой; у «Услуг» — панель при наведении ──
  function header() {
    const el = $('#hdr'); if (!el) return;
    const links = D.nav.map(n => {
      const on = sect === n.href ? ' class="is-on"' : '';
      return PANELS[n.href] ? `<a href="${n.href}"${on} data-mx="${n.href}" aria-haspopup="true" aria-expanded="false">${n.t}</a>` : `<a href="${n.href}"${on}>${n.t}</a>`;
    }).join('');
    el.classList.add('hx');
    el.innerHTML = `<div class="hx-in">
      <a class="hx-logo" href="index.html" aria-label="ОГНЕВЕД — на главную"><img src="img/logo.svg" width="976" height="214" alt="ОГНЕВЕД"><small>эксперты в тушении пожаров</small></a>
      <nav class="hx-nav" aria-label="Разделы сайта">${links}</nav>
      <a class="hx-tel" href="${D.phoneHref}">${D.phone}</a>
      <button class="hx-btn" data-open="form"><span>Оставить заявку</span>${AR_UP}</button></div>
      <div class="mx">${Object.entries(PANELS).map(([k, f]) => `<div class="mx-p" data-mx="${k}" inert><div class="mx-in">${f()}</div></div>`).join('')}</div>`;
    const veil = document.createElement('div'); veil.className = 'mx-veil'; el.after(veil);

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
    const pinned = () => [...document.querySelectorAll('#stk-run, #objects')].some(p => { const r = p.getBoundingClientRect(); return r.top < innerHeight * .5 && r.bottom > innerHeight * .5; });
    const onS = () => {
      const y = scrollY, d = Math.sign(y - last);
      el.classList.toggle('is-scrolled', y > 8);
      if (cur && Math.abs(y - anchor) > 24) set(null);
      if (d && d !== dir) { dir = d; anchor = last; }
      if (y < 600 || pinned()) el.classList.remove('is-hid');
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
        <div class="fd-brand-w"><a class="fd-brand" href="${MAIN ? '#top' : 'index.html'}" aria-label="ОГНЕВЕД — ${MAIN ? 'наверх' : 'на главную'}"><img src="img/logo-white.svg" width="976" height="214" alt="ОГНЕВЕД"><small>эксперты в&nbsp;тушении пожаров</small></a>
          <p class="fd-claim">Расчёты и&nbsp;проектная документация в&nbsp;области пожаротушения для зданий и&nbsp;сооружений по&nbsp;всей России</p></div>
        <div class="fd-col"><p class="fd-l">Телефон</p><a class="fd-v" href="${D.phoneHref}">${D.phone}</a><p class="fd-s">${D.hours}</p></div>
        <div class="fd-col"><p class="fd-l">Почта</p><a class="fd-v" href="mailto:${D.email}">${D.email}</a><p class="fd-s">Ответим в&nbsp;течение рабочего дня</p></div>
        <div class="fd-col"><p class="fd-l">Мессенджеры</p><div class="fd-socs"><a${ext(D.max)} aria-label="MAX">${ICO.max}</a><a${ext(D.tg)} aria-label="Telegram">${ICO.tg}</a><a href="mailto:${D.email}" aria-label="Почта">${ICO.mail}</a></div></div>
      </div>
      <div class="fd-mid">
        <div class="fd-cta"><p class="fd-h">Расскажите об&nbsp;объекте — <span>подскажем, какой документ нужен</span></p>
          <button class="fd-btn" data-open="form"><span>Оставить заявку</span>${AR_UP}</button></div>
        <div><p class="fd-l">Разделы</p><ul class="fd-ul">${D.nav.map(n => `<li><a href="${n.href}">${n.t}</a></li>`).join('')}</ul></div>
        <div><p class="fd-l">Услуги</p><ul class="fd-ul">${S.map(s => `<li><a href="usluga.html?id=${s.id}">${s.short}</a></li>`).join('')}</ul></div>
        <div><p class="fd-l">География</p><p class="fd-t">${D.city.split(',')[0]}</p><p class="fd-s">${D.city.split(',').slice(1).join(',').trim()}</p>
          <p class="fd-l fd-l--gap">Режим работы</p><p class="fd-t">${D.hours.replace(/,.*/, '')}</p><p class="fd-s">${(D.hours.split(',')[1] || '').trim()}</p></div>
      </div>
      <div class="fd-bot"><span>© 2012–2026 ОГНЕВЕД</span><a href="#">Политика конфиденциальности</a><a href="#">Согласие на&nbsp;обработку персональных данных</a><a href="#top">Наверх ↑</a></div>
    </div>`;
  }

  // ── формы: поля как в форме первого экрана (Figma «home» 2038:34) — #f3f3f4 с обводкой, подпись внутри поля ──
  const telField = () => `<label class="fld fld--tel">${FLAG}<input name="phone" type="tel" placeholder="+7 (000) 000 00 00" autocomplete="tel" required><span class="pfx">+7</span></label>`;
  const formHTML = (o = {}) => `<form class="form ff${o.cls ? ' ' + o.cls : ''}" novalidate>
    <label class="fld"><input name="name" placeholder=" " autocomplete="name"><span>Ваше имя</span></label>
    ${telField()}
    ${o.q === false ? '' : `<label class="fld fld--ta"><textarea name="q" placeholder=" " rows="3"></textarea><span>${o.ql || 'Объект или вопрос'}</span></label>`}
    <button class="btn btn--red" type="submit">${o.btn || 'Оставить заявку'}</button>
    <p class="consent">Нажимая кнопку, вы соглашаетесь с <a href="#">политикой конфиденциальности</a></p>
    <div class="form-ok">${ICO.ok}<div><b>Заявка отправлена</b><p class="muted">Специалист перезвонит в течение 15 минут в рабочее время.</p></div></div>
  </form>`;
  // строка формы как на первом экране: имя, телефон, объект и красная кнопка в один ряд
  const formRow = (o = {}) => `<form class="form hf" novalidate>
    <label class="fld"><input name="name" placeholder=" " autocomplete="name"><span>Ваше имя</span></label>
    ${telField()}
    <label class="fld"><input name="obj" placeholder=" "><span>${o.ql || 'Ваш объект'}</span></label>
    <button class="btn btn--red" type="submit">${o.btn || 'Получить консультацию'}</button>
    <p class="consent">Нажимая кнопку, вы соглашаетесь с <a href="#">политикой конфиденциальности</a></p>
    <div class="form-ok">${ICO.ok}<div><b>Заявка отправлена</b><p class="muted">Специалист перезвонит в течение 15 минут в рабочее время.</p></div></div>
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
      f.addEventListener('submit', e => {
        e.preventDefault();
        if (tel.value.replace(/\D/g, '').length < 11) { tel.closest('.fld').classList.add('err'); tel.focus(); return; }
        f.classList.add('is-sent');
      });
    });
  }

  // ── связаться: звонок и мессенджеры кнопками — значок в квадрате, подпись капсом и действие, стрелка-уголок.
  //    msgBlock(['max', 'tg']) — только мессенджеры ──
  const MSG = [['tel', 'Позвонить', D.phone, D.phoneHref], ['max', 'Мессенджер', 'Написать в&nbsp;MAX', D.max], ['tg', 'Мессенджер', 'Написать в&nbsp;Telegram', D.tg]];
  const msgBlock = only => `<div class="msg">${MSG.filter(m => !only || only.includes(m[0])).map(([k, t, v, h]) =>
    `<a class="msg-b"${k === 'tel' ? ` href="${h}"` : ext(h)}><span class="msg-i">${ICO[k]}</span><span class="msg-t"><small>${t}</small><b>${v}</b></span>${AR_UP}</a>`).join('')}</div>`;

  // ── коэффициенты калькулятора стоимости (js/calc.js) ──
  const calc = { data: {
    AREA: [['до 1 000 м²', 1], ['1–5 тыс. м²', 1.2], ['5–20 тыс. м²', 1.5], ['20–50 тыс. м²', 1.9], ['более 50 тыс. м²', 2.4]],
    BLD: [['Одно', 1], ['2–3', 1.35], ['4 и более', 1.7]],
    KOBJ: { logistic: 1.1, production: 1.25, admin: 1, living: .9, trade: 1.05, oil: 1.4, social: 1, other: 1.2 },
  } };

  // ── окна и «блуждающие» кнопки ──
  // заявка: слева — тонированная панель с обещаниями и телефоном (рамка с крестиками, как блоки главной), справа — форма
  function modals() {
    const box = document.createElement('div');
    box.innerHTML = `
      <div class="modal mdl" id="m-form" role="dialog" aria-modal="true" aria-label="Заявка на консультацию"><div class="modal-box mdl-box"><button class="modal-x" data-close aria-label="Закрыть">${ICO.x}</button>
        <aside class="mdl-l">
          <p class="badge badge--flat"><i></i>Бесплатная консультация</p>
          <h3 class="mdl-h">Расскажите об&nbsp;объекте&nbsp;— <span class="g">подскажем, какой документ нужен</span></h3>
          <ul class="mdl-ul"><li>Перезвоним в&nbsp;течение 15&nbsp;минут в&nbsp;рабочее время</li><li>Подскажем, какие расчёты нужны вашему объекту</li><li>Назовём стоимость и&nbsp;срок ещё до&nbsp;договора</li></ul>
          <div class="mdl-c"><p class="mdl-k">Или позвоните</p><a href="${D.phoneHref}">${D.phone}</a><small>${D.hours}</small></div>
        </aside>
        <div class="mdl-r"><p class="mdl-t">Заявка на&nbsp;консультацию</p><p class="mdl-s">Оставьте контакты — специалист перезвонит и&nbsp;уточнит задачу</p>${formHTML()}</div></div></div>
      <div class="modal modal--wide" id="m-calc" role="dialog" aria-modal="true" aria-label="Калькулятор стоимости"><div class="modal-box"><button class="modal-x" data-close aria-label="Закрыть">${ICO.x}</button><div data-calc></div></div></div>
      <div class="modal mdl mdl--cnt" id="m-cnt" role="dialog" aria-modal="true" aria-label="Контакты"><div class="modal-box"><button class="modal-x" data-close aria-label="Закрыть">${ICO.x}</button>
        <p class="badge badge--flat"><i></i>Контакты</p>
        <h3 class="mdl-h">Свяжитесь с&nbsp;нами <span class="g">удобным способом</span></h3><p class="mdl-s">Позвоните или напишите в&nbsp;мессенджер — ответим в&nbsp;течение 15&nbsp;минут в&nbsp;рабочее время.</p>${msgBlock()}
        <dl class="mdl-dl"><div><dt>Почта</dt><dd><a href="mailto:${D.email}">${D.email}</a></dd></div><div><dt>Режим работы</dt><dd>${D.hours}</dd></div></dl></div></div>
      <div class="dock" aria-label="Быстрые действия">
        <button data-open="cnt" aria-label="Позвонить или написать">${ICO.tel}<span class="d-tip">Позвонить или написать</span></button>
        <button data-open="form" aria-label="Задать вопрос">${ICO.chat}<span class="d-tip">Задать вопрос</span></button>
        <button class="d-main" data-open="calc" aria-label="Рассчитать стоимость">${ICO.calc}<span>Рассчитать стоимость</span></button>
      </div>`;
    document.body.append(...box.children);
    bindForms();
    let last;
    const open = (id, data = {}) => {
      const m = $('#m-' + id); if (!m) return;
      last = document.activeElement;
      if (id === 'calc' && data.svc) { const c = $('[data-calc]', m); c.ogSet && c.ogSet(data.svc); }
      if (id === 'form') { const f = $('form', m); f.classList.remove('is-sent'); const q = $('textarea', f); if (q) q.value = data.q || ''; }
      m.classList.add('is-open'); document.body.classList.add('is-locked'); window.OG_LENIS && window.OG_LENIS.stop();
      setTimeout(() => ($('input:not([type=radio]):not([type=checkbox])', m) || $('.modal-x', m)).focus({ preventScroll: true }), 60);
    };
    const close = () => { $$('.modal.is-open').forEach(m => m.classList.remove('is-open')); document.body.classList.remove('is-locked'); window.OG_LENIS && window.OG_LENIS.start(); last && last.focus && last.focus({ preventScroll: true }); };
    document.addEventListener('click', e => {
      const o = e.target.closest('[data-open]');
      if (o) { e.preventDefault(); open(o.dataset.open, { svc: o.dataset.svc, q: o.dataset.q }); return; }
      if (e.target.closest('[data-close]') || e.target.classList.contains('modal')) close();
    });
    addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    window.OG_UI.open = open;
  }

  window.OG_UI = { $, $$, ICO, AR_UP, formHTML, formRow, bindForms, calc, msgBlock };
  header(); footer(); modals();
})();
