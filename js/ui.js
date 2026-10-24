// Общие элементы всех страниц: шапка, подвал, «блуждающие» кнопки, окна, формы, калькулятор, QR
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const D = window.OG;
  const sv = (p, vb = 24) => `<svg viewBox="0 0 ${vb} ${vb}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;

  const ICO = {
    ar: '<svg class="ar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    arUp: sv('<path d="M7 17 17 7M8 7h9v9"/>'),
    chev: sv('<path d="m6 9 6 6 6-6"/>'),
    x: sv('<path d="M18 6 6 18M6 6l12 12"/>'),
    plus: sv('<path d="M12 5v14M5 12h14"/>'),
    tel: sv('<path d="M5 4h3.2l1.6 4.2-2.1 1.3a11 11 0 0 0 5.3 5.3l1.3-2.1 4.2 1.6V17.5A2.5 2.5 0 0 1 16 20C9.3 19.6 4.4 14.7 4 8a2.5 2.5 0 0 1 1-4z"/>'),
    tg: sv('<path d="M21 4 3 11l6 2 2 6 3-4 5 4 2-15z"/><path d="m9 13 8-6"/>'),
    max: sv('<path d="M12 3.5a8.5 8.5 0 0 0-7.6 12.3L3.5 20.5l4.7-.9A8.5 8.5 0 1 0 12 3.5z"/><path d="M8 14.5v-5l4 3.5 4-3.5v5"/>'),
    mail: sv('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>'),
    calc: sv('<rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M8.5 6.5h7"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h.01M12 18h.01M15.5 18h.01" stroke-width="2.2"/>'),
    qr: sv('<rect x="3.5" y="3.5" width="6" height="6" rx="1.2"/><rect x="14.5" y="3.5" width="6" height="6" rx="1.2"/><rect x="3.5" y="14.5" width="6" height="6" rx="1.2"/><path d="M14.5 14.5h2.5v2.5h-2.5zM18 18h2.5v2.5H18zM18 14.5h2.5M14.5 18v2.5"/>'),
    chat: sv('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/><path d="M8 10h8M8 14h5"/>'),
    ok: sv('<circle cx="12" cy="12" r="10"/><path d="m7.5 12.5 3 3 6-6.5"/>'),
    dl: sv('<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>'),
    flame: sv('<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>'),
    pin: sv('<path d="M12 21s7-6.2 7-11.5a7 7 0 1 0-14 0C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    clock: sv('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    rub: sv('<path d="M9 20V4h5a4 4 0 0 1 0 8H6M6 16h8"/>'),
    // преимущества
    helmet: sv('<path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5M4 15v-3a6 6 0 0 1 6-6M14 6a6 6 0 0 1 6 6v3"/>'),
    globe: sv('<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>'),
    building: sv('<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18zM6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4"/>'),
    doc: sv('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M9 15l2 2 4-4"/>'),
    user: sv('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>'),
    ask: sv('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>'),
  };
  const AR_UP = '<svg class="fb-ar" viewBox="0 0 17 17" aria-hidden="true"><path d="M4.958 12.042 12.042 4.958M4.958 4.958h7.084v7.084"/></svg>';
  const HOME = document.body.classList.contains('home');
  const logo = () => `<a class="logo" href="index.html" aria-label="ОГНЕВЕД — на главную"><span class="logo-m">${ICO.flame}</span><span><b>ОГНЕВЕД</b><small>эксперты в тушении пожаров</small></span></a>`;

  const page = location.pathname.split('/').pop() || 'index.html';
  const sect = { 'uslugi.html': 'uslugi.html', 'usluga.html': 'uslugi.html', 'raboty.html': 'raboty.html', 'rabota.html': 'raboty.html', 'blog.html': 'blog.html', 'statya.html': 'blog.html', 'biblioteka.html': 'biblioteka.html', 'kniga.html': 'biblioteka.html', 'kontakty.html': 'kontakty.html' }[page];

  // ── шапка ──
  function header() {
    const el = $('#hdr'); if (!el) return;
    if (HOME) return headerHome(el);
    const mega = D.services.map(s => `<a href="usluga.html?id=${s.id}"><b>${s.short}</b><span>от ${D.rub(s.price)} · ${s.days} дней</span></a>`).join('') +
      `<a class="all" href="uslugi.html"><b>Все услуги</b>${ICO.ar}</a>`;
    const links = D.nav.map(n => n.sub
      ? `<div class="dd"><a href="${n.href}" class="${sect === n.href ? 'is-on' : ''}">${n.t}${ICO.chev}</a><div class="mega">${mega}</div></div>`
      : `<a href="${n.href}" class="${sect === n.href ? 'is-on' : ''}">${n.t}</a>`).join('');
    el.innerHTML = `<div class="wrap">${logo()}<nav class="nav" aria-label="Разделы сайта">${links}</nav>
      <div class="hdr-r"><div class="hdr-tel"><a href="${D.phoneHref}">${D.phone}</a><small>ежедневно 10:00–20:00</small></div>
      <a class="ib" href="${D.phoneHref}" aria-label="Позвонить">${ICO.tel}</a>
      <button class="btn btn--dark btn--sm hdr-cta" data-open="form">Оставить заявку</button>
      <button class="ib burger" aria-label="Меню"><i></i></button></div></div>`;
    const mn = document.createElement('div');
    mn.className = 'mnav';
    mn.innerHTML = D.nav.map(n => `<a href="${n.href}">${n.t}</a>` + (n.sub ? `<div class="sub">${D.services.map(s => `<a href="usluga.html?id=${s.id}">${s.short}</a>`).join('')}</div>` : '')).join('') +
      `<div class="mn-ft"><a class="btn btn--dark" href="${D.phoneHref}">${D.phone}</a><button class="btn btn--line" data-open="form">Оставить заявку</button></div>`;
    el.after(mn);
    $('.burger', el).addEventListener('click', () => { mn.classList.toggle('is-open'); document.body.classList.toggle('is-locked', mn.classList.contains('is-open')); });
    const onS = () => el.classList.toggle('is-scrolled', scrollY > 8);
    addEventListener('scroll', onS, { passive: true }); onS();
  }

  // ── шапка главной — по макету Figma: логотип-слово, меню капсом, телефон, чёрная кнопка с красной стрелкой ──
  function headerHome(el) {
    const mega = D.services.map((s, i) => `<a href="usluga.html?id=${s.id}"><i>${String(i + 1).padStart(2, '0')}</i><b>${s.short}</b><span>от ${D.rub(s.price)} · ${s.days} дней</span></a>`).join('');
    const links = D.nav.map(n => n.sub
      ? `<div class="dd"><a href="${n.href}">${n.t}</a><div class="mega">${mega}</div></div>`
      : `<a href="${n.href}">${n.t}</a>`).join('');
    el.classList.add('hx');
    el.innerHTML = `<div class="hx-in">
      <a class="hx-logo" href="index.html" aria-label="ОГНЕВЕД — на главную"><img src="img/logo.svg" width="926" height="118" alt="ОГНЕВЕД"><small>эксперты в тушении пожаров</small></a>
      <nav class="hx-nav" aria-label="Разделы сайта">${links}</nav>
      <a class="hx-tel" href="${D.phoneHref}">${D.phone}</a>
      <button class="hx-btn" data-open="form"><span>Оставить заявку</span>${AR_UP}</button></div>`;
    // при прокрутке вниз шапка уходит, при движении вверх — возвращается; срабатывает только после 48px пути в одну сторону,
    // чтобы не дёргаться от мелких толчков. Внутри закреплённых блоков («Как мы работаем», «Объекты») шапка стоит на месте
    let last = scrollY, anchor = scrollY, dir = 0;
    const pinned = () => [...document.querySelectorAll('#stk-run, #objects')].some(p => { const r = p.getBoundingClientRect(); return r.top < innerHeight * .5 && r.bottom > innerHeight * .5; });
    const onS = () => {
      const y = scrollY, d = Math.sign(y - last);
      el.classList.toggle('is-scrolled', y > 8);
      if (d && d !== dir) { dir = d; anchor = last; }
      if (y < 600 || pinned()) el.classList.remove('is-hid');
      else if (dir > 0 && y - anchor > 48) el.classList.add('is-hid');
      else if (dir < 0 && anchor - y > 48) el.classList.remove('is-hid');
      last = y;
    };
    addEventListener('scroll', onS, { passive: true }); onS();
  }

  // ── подвал главной: тёмный, в формате «Зелёного патруля» — сверху логотип и контакты крупно (подпись капсом + значение),
  //    посередине призыв с кнопкой и колонки ссылок, снизу линия во всю ширину и служебная строка ──
  function footerHome(el) {
    el.innerHTML = `<div class="wrap2 fd">
      <div class="fd-top">
        <div class="fd-brand-w"><a class="fd-brand" href="#top" aria-label="ОГНЕВЕД — наверх"><img src="img/logo-white.svg" width="926" height="118" alt="ОГНЕВЕД"><small>эксперты в&nbsp;тушении пожаров</small></a>
          <p class="fd-claim">Расчёты и&nbsp;проектная документация в&nbsp;области пожаротушения для зданий и&nbsp;сооружений по&nbsp;всей России</p></div>
        <div class="fd-col"><p class="fd-l">Телефон</p><a class="fd-v" href="${D.phoneHref}">${D.phone}</a><p class="fd-s">${D.hours}</p></div>
        <div class="fd-col"><p class="fd-l">Почта</p><a class="fd-v" href="mailto:${D.email}">${D.email}</a><p class="fd-s">Ответим в&nbsp;течение рабочего дня</p></div>
        <div class="fd-col"><p class="fd-l">Мессенджеры</p><div class="fd-socs"><a href="${D.max}" target="_blank" rel="noopener" aria-label="MAX">${ICO.max}</a><a href="${D.tg}" target="_blank" rel="noopener" aria-label="Telegram">${ICO.tg}</a><a href="mailto:${D.email}" aria-label="Почта">${ICO.mail}</a></div></div>
      </div>
      <div class="fd-mid">
        <div class="fd-cta"><p class="fd-h">Расскажите об&nbsp;объекте — <span>подскажем, какой документ нужен</span></p>
          <button class="fd-btn" data-open="form"><span>Оставить заявку</span>${AR_UP}</button></div>
        <div><p class="fd-l">Разделы</p><ul class="fd-ul">${D.nav.map(n => `<li><a href="${n.href}">${n.t}</a></li>`).join('')}</ul></div>
        <div><p class="fd-l">Услуги</p><ul class="fd-ul">${D.services.map(s => `<li><a href="usluga.html?id=${s.id}">${s.short}</a></li>`).join('')}</ul></div>
        <div><p class="fd-l">География</p><p class="fd-t">${D.city.split(',')[0]}</p><p class="fd-s">${D.city.split(',').slice(1).join(',').trim()}</p>
          <p class="fd-l fd-l--gap">Режим работы</p><p class="fd-t">${D.hours.replace(/,.*/, '')}</p><p class="fd-s">${(D.hours.split(',')[1] || '').trim()}</p></div>
      </div>
      <div class="fd-bot"><span>© 2012–2026 ОГНЕВЕД</span><a href="#">Политика конфиденциальности</a><a href="#">Согласие на&nbsp;обработку персональных данных</a><a href="#top">Наверх ↑</a></div>
    </div>`;
  }

  // ── подвал ──
  function footer() {
    const el = $('#ftr'); if (!el) return;
    if (HOME) return footerHome(el);
    el.innerHTML = `<div class="wrap">
      <div class="ftr-cta"><h2 class="h2">Расскажите об объекте — подскажем, какой документ нужен</h2>
        <div class="btns"><button class="btn btn--white" data-open="form">Оставить заявку${ICO.ar}</button><a class="btn btn--line on-dark-line" href="${D.phoneHref}">${D.phone}</a></div></div>
      <div class="ftr-top">
        <div>${logo()}<p class="slog">Расчёты и проектная документация в области пожаротушения для зданий и сооружений по всей России.</p></div>
        <div><h4>Разделы</h4><ul>${D.nav.map(n => `<li><a href="${n.href}">${n.t}</a></li>`).join('')}</ul></div>
        <div><h4>Услуги</h4><ul>${D.services.map(s => `<li><a href="usluga.html?id=${s.id}">${s.title}</a></li>`).join('')}</ul></div>
        <div class="ct"><h4>Контакты</h4><a class="big" href="${D.phoneHref}">${D.phone}</a><p>${D.hours}</p><p><a href="mailto:${D.email}">${D.email}</a></p><p>${D.city}</p>
          <div class="soc"><a class="ib" href="${D.max}" target="_blank" rel="noopener" aria-label="MAX">${ICO.max}</a><a class="ib" href="${D.tg}" target="_blank" rel="noopener" aria-label="Telegram">${ICO.tg}</a><a class="ib" href="mailto:${D.email}" aria-label="Почта">${ICO.mail}</a></div></div>
      </div>
      <div class="ftr-bot"><span>© 2012–2026 ОГНЕВЕД</span><a href="#">Политика конфиденциальности</a><a href="#">Пользовательское соглашение</a><a href="#">Согласие на обработку персональных данных</a></div></div>`;
  }

  // ── формы ──
  const formHTML = (o = {}) => `<form class="form" novalidate>
    <label class="fld"><input name="name" placeholder=" " autocomplete="name"><span>Ваше имя</span></label>
    <label class="fld"><input name="phone" type="tel" placeholder=" " autocomplete="tel" required><span>Телефон</span></label>
    ${o.q === false ? '' : `<label class="fld"><textarea name="q" placeholder=" "></textarea><span>${o.ql || 'Объект или вопрос'}</span></label>`}
    <button class="btn ${HOME ? 'btn--red' : 'btn--dark'} btn--full" type="submit">${o.btn || 'Оставить заявку'}${HOME ? '' : ICO.ar}</button>
    <p class="consent">Нажимая кнопку, вы соглашаетесь с <a href="#">политикой конфиденциальности</a></p>
    <div class="form-ok">${ICO.ok}<b>Заявка отправлена</b><p class="muted">Специалист перезвонит в течение 15 минут в рабочее время.</p></div>
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

  // ── QR ──
  let qrLib;
  const loadQR = () => window.qrcode ? Promise.resolve() : qrLib || (qrLib = new Promise(r => { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js'; s.onload = r; document.head.append(s); }));
  function qrSVG(text) {
    const q = qrcode(0, 'M'); q.addData(text); q.make();
    const n = q.getModuleCount(); let d = '';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
    return `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges"><path d="${d}" fill="#0f1012"/></svg>`;
  }
  const qrBlock = () => `<div class="qrs">
    <a class="qr" href="${D.phoneHref}"><div class="qr-img" data-qr="${D.phoneHref}"></div><b>Позвонить</b><small>${D.phone}</small></a>
    <a class="qr" href="${D.max}" target="_blank" rel="noopener"><div class="qr-img" data-qr="${D.max}"></div><b>MAX</b><small>Написать сообщение</small></a>
    <a class="qr" href="${D.tg}" target="_blank" rel="noopener"><div class="qr-img" data-qr="${D.tg}"></div><b>Telegram</b><small>Написать сообщение</small></a></div>`;
  function fillQR(root = document) {
    const els = $$('[data-qr]', root).filter(e => !e.innerHTML); if (!els.length) return;
    loadQR().then(() => els.forEach(e => e.innerHTML = qrSVG(e.dataset.qr)));
  }

  // ── калькулятор: результат пересчитывается сразу ──
  const AREA = [['до 1 000 м²', 1], ['1–5 тыс. м²', 1.2], ['5–20 тыс. м²', 1.5], ['20–50 тыс. м²', 1.9], ['более 50 тыс. м²', 2.4]];
  const BLD = [['Одно', 1], ['2–3', 1.35], ['4 и более', 1.7]];
  const KOBJ = { logistic: 1.1, production: 1.25, admin: 1, living: .9, trade: 1.05, oil: 1.4, social: 1, other: 1.2 };
  const OPT = [['data', 'Запрос данных о пожарных подразделениях', 'Сами получим сведения о ближайших частях', 10000, 2], ['dwg', 'Отрисовка планов и фасадов в .dwg', 'Если нет актуальных чертежей', 20000, 3], ['fast', 'Срочное выполнение', 'Сокращаем срок примерно вдвое', 0, 0]];
  const STEPS = ['Документ', 'Объект', 'Дополнительно'];
  function calc(el, preset) {
    const st = { step: 0, svc: preset || D.services[0].id, obj: 'admin', area: 1, bld: 0, opt: {} };
    const r5 = v => Math.round(v / 5000) * 5000;
    const result = () => {
      const s = D.svc(st.svc);
      let p = s.price * KOBJ[st.obj] * AREA[st.area][1] * BLD[st.bld][1], d = s.base * Math.sqrt(AREA[st.area][1] * BLD[st.bld][1]);
      OPT.forEach(([k, , , pr, dd]) => { if (st.opt[k]) { p += pr; d += dd; } });
      if (st.opt.fast) { p *= 1.3; d *= .6; }
      d = Math.max(2, Math.ceil(d));
      return { lo: Math.max(s.price, r5(p)), hi: r5(p * 1.2), d0: d, d1: d + 2, s };
    };
    const tile = (name, v, t, sub, on, type = 'radio') => `<label class="opt${on ? ' is-on' : ''}${type === 'checkbox' ? ' opt--chk' : ''}"><input type="${type}" name="${name}" value="${v}"${on ? ' checked' : ''}><i></i><span><b>${t}</b>${sub ? `<small>${sub}</small>` : ''}</span></label>`;
    const seg = (k, items, cur) => `<div class="seg">${items.map(([v, t]) => `<button type="button" class="${String(v) === String(cur) ? 'is-on' : ''}" data-k="${k}" data-v="${v}">${t}</button>`).join('')}</div>`;
    el.classList.add('calc', 'on-dark');
    el.innerHTML = `<div class="calc-main"><div class="calc-steps"></div><div class="calc-body"></div><div class="calc-nav"></div></div>
      <aside class="calc-res"><p class="eyebrow">Ориентировочная стоимость</p><div class="calc-out"></div>
        <div class="calc-form">${formHTML({ q: false, btn: 'Получить точный расчёт' })}</div></aside>`;
    const body = $('.calc-body', el), steps = $('.calc-steps', el), nav = $('.calc-nav', el), out = $('.calc-out', el);
    function renderRes() {
      const r = result();
      out.innerHTML = `<div class="calc-sum"><span>${D.rub(r.lo).replace(' ₽', '')}</span><i>–</i><span>${D.rub(r.hi)}</span></div>
        <dl class="calc-dl"><div><dt>Срок</dt><dd>${r.d0}–${r.d1} рабочих дней</dd></div><div><dt>Документ</dt><dd>${r.s.short}</dd></div><div><dt>Объект</dt><dd>${D.objects.find(o => o.id === st.obj).t}, ${AREA[st.area][0]}</dd></div></dl>
        <p class="calc-note">Точную стоимость назовём бесплатно после просмотра исходных данных</p>`;
    }
    function render() {
      steps.innerHTML = STEPS.map((t, i) => `<button type="button" class="cs${i === st.step ? ' is-on' : ''}${i < st.step ? ' is-done' : ''}" data-step="${i}"><i>${i + 1}</i>${t}</button>`).join('');
      if (st.step === 0) body.innerHTML = `<h4 class="calc-q">Какой документ нужен?</h4><div class="opts">${D.services.map(s => tile('svc', s.id, s.short, 'от ' + D.rub(s.price), s.id === st.svc)).join('')}</div>`;
      if (st.step === 1) body.innerHTML = `<h4 class="calc-q">Тип объекта</h4>${seg('obj', D.objects.map(o => [o.id, o.t]), st.obj)}
        <h4 class="calc-q">Площадь</h4>${seg('area', AREA.map((a, i) => [i, a[0]]), st.area)}
        <h4 class="calc-q">Сколько зданий на участке</h4>${seg('bld', BLD.map((a, i) => [i, a[0]]), st.bld)}`;
      if (st.step === 2) body.innerHTML = `<h4 class="calc-q">Что ещё нужно сделать</h4><div class="opts opts--1">${OPT.map(([k, t, sub, pr]) => tile(k, 1, t, sub + (pr ? ` · + ${D.rub(pr)}` : ' · + 30 %'), !!st.opt[k], 'checkbox')).join('')}</div>`;
      nav.innerHTML = (st.step ? `<button type="button" class="btn btn--line btn--sm" data-go="-1">Назад</button>` : `<span class="calc-hint">Шаг 1 из 3 · результат справа обновляется сразу</span>`) +
        (st.step < 2 ? `<button type="button" class="btn btn--white btn--sm" data-go="1">Далее${ICO.ar}</button>` : `<span class="calc-hint">Готово — оставьте телефон для точного расчёта</span>`);
      renderRes();
    }
    el.addEventListener('change', e => {
      const t = e.target;
      if (t.name === 'svc') st.svc = t.value; else if (t.type === 'checkbox') st.opt[t.name] = t.checked;
      render();
    });
    el.addEventListener('click', e => {
      const c = e.target.closest('[data-k]'); if (c) { st[c.dataset.k] = isNaN(c.dataset.v) ? c.dataset.v : +c.dataset.v; render(); return; }
      const g = e.target.closest('[data-go]'); if (g) { st.step = Math.max(0, Math.min(2, st.step + +g.dataset.go)); render(); return; }
      const s = e.target.closest('[data-step]'); if (s) { st.step = +s.dataset.step; render(); }
    });
    render(); bindForms(el);
    el.ogSet = id => { st.svc = id; st.step = 0; render(); };
  }
  // коэффициенты расчёта — общие с калькулятором главной (js/calc.js)
  calc.data = { AREA, BLD, KOBJ, OPT };

  // ── окна и «блуждающие» кнопки ──
  function modals() {
    const box = document.createElement('div');
    box.innerHTML = `
      <div class="modal" id="m-form" role="dialog" aria-modal="true" aria-label="Заявка"><div class="modal-box"><button class="modal-x" data-close aria-label="Закрыть">${ICO.x}</button>
        <h3 class="h3">Бесплатная консультация</h3><p class="sub">Оставьте контакты — специалист перезвонит в течение 15 минут и подскажет, какой документ нужен вашему объекту.</p>${formHTML()}</div></div>
      <div class="modal modal--wide" id="m-calc" role="dialog" aria-modal="true" aria-label="Калькулятор стоимости"><div class="modal-box"><button class="modal-x" data-close aria-label="Закрыть">${ICO.x}</button><div data-calc></div></div></div>
      <div class="modal modal--qr" id="m-qr" role="dialog" aria-modal="true" aria-label="Контакты"><div class="modal-box"><button class="modal-x" data-close aria-label="Закрыть">${ICO.x}</button>
        <h3 class="h3">Свяжитесь с нами</h3><p class="sub">Наведите камеру телефона на код — откроется звонок или чат.</p>${qrBlock()}
        <div class="ct-line"><a href="${D.phoneHref}">${D.phone}</a><a href="mailto:${D.email}">${D.email}</a><span class="muted">${D.hours}</span></div></div></div>
      <div class="dock" aria-label="Быстрые действия">
        <button data-open="qr" aria-label="Контакты и QR-коды">${ICO.qr}<span class="d-tip">Контакты и QR-коды</span></button>
        <button data-open="form" aria-label="Задать вопрос">${ICO.chat}<span class="d-tip">Задать вопрос</span></button>
        <button class="d-main" data-open="calc" aria-label="Рассчитать стоимость">${ICO.calc}<span>Рассчитать стоимость</span></button>
      </div>`;
    document.body.append(...box.children);
    calc($('#m-calc [data-calc]'));
    bindForms();
    let last;
    const open = (id, data = {}) => {
      const m = $('#m-' + id); if (!m) return;
      last = document.activeElement;
      if (id === 'qr') fillQR(m);
      if (id === 'calc' && data.svc) $('[data-calc]', m).ogSet(data.svc);
      if (id === 'form') { const f = $('form', m); f.classList.remove('is-sent'); if (data.q) $('textarea', f).value = data.q; }
      m.classList.add('is-open'); document.body.classList.add('is-locked'); window.OG_LENIS && window.OG_LENIS.stop();
      setTimeout(() => ($('input:not([type=radio]):not([type=checkbox])', m) || $('.modal-x', m)).focus({ preventScroll: true }), 60);
    };
    const close = () => { $$('.modal.is-open').forEach(m => m.classList.remove('is-open')); document.body.classList.remove('is-locked'); window.OG_LENIS && window.OG_LENIS.start(); last && last.focus && last.focus({ preventScroll: true }); };
    document.addEventListener('click', e => {
      const o = e.target.closest('[data-open]');
      if (o) { e.preventDefault(); $('.mnav')?.classList.remove('is-open'); open(o.dataset.open, { svc: o.dataset.svc, q: o.dataset.q }); return; }
      if (e.target.closest('[data-close]') || e.target.classList.contains('modal')) close();
    });
    addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    window.OG_UI.open = open;
  }

  // ── появление блоков при прокрутке и счётчики цифр ──
  // группы: дети появляются по очереди; одиночные элементы — сами по себе
  const RV_GROUPS = '.svl-list, .stats, .bento, .obj-grid, .work-grid, .art-grid, .lib-grid, .faq-list, .geo-cards, .plist-r, .svc-grid, .svc-rows, .when, .steps, .two, .ct-grid, .art-top, .ftr-top';
  const RV_ONE = '.sh .eyebrow, .sh .h2, .sh-r, .pg-h .crumbs, .pg-h .h1, .pg-h .lead, .pg-h .chips, .filt, .calc-wrap, .plist-l, .svl-pic, .map, .geo-bar, .faq-cta, .ftr-cta, .clients, .more, .split-l, .wp-img, .art-cover, .book-cv, .book-info, .ct-l, .ct-form, .side-card, .prose, .svc-hero > *, .cta';
  let io, cio;
  const countUp = el => {
    const m = el.textContent.match(/^(\D*)(\d+)(.*)$/); if (!m) return;
    const to = +m[2], t0 = performance.now(), dur = 1400;
    const step = now => { const k = Math.min(1, (now - t0) / dur); el.textContent = m[1] + Math.round(to * (1 - Math.pow(1 - k, 3))) + m[3]; if (k < 1) requestAnimationFrame(step); };
    el.textContent = m[1] + 0 + m[3]; requestAnimationFrame(step);
  };
  function reveal(root = document) {
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('js-rv');
    io = io || new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, i = +el.style.getPropertyValue('--i') || 0;
      io.unobserve(el); el.classList.add('is-in');
      // после появления служебный класс снимаем, чтобы снова работали собственные переходы элемента (наведение)
      setTimeout(() => { el.classList.remove('rv', 'is-in'); el.style.removeProperty('--i'); }, 1250 + i * 70);
    }), { rootMargin: '0px 0px -6% 0px', threshold: .08 });
    cio = cio || new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { cio.unobserve(e.target); countUp(e.target); } }), { threshold: .6 });
    const add = (el, i = 0) => {
      if (el.classList.contains('rv') || el.dataset.rv || el.closest('.hero-stage')) return;
      el.dataset.rv = 1; el.classList.add('rv'); if (i) el.style.setProperty('--i', Math.min(i, 8)); io.observe(el);
    };
    $$(RV_GROUPS, root).forEach(g => [...g.children].forEach((c, i) => add(c, i)));
    $$(RV_ONE, root).forEach(el => add(el));
    $$('[data-count]', root).forEach(el => { if (!el.dataset.counted) { el.dataset.counted = 1; cio.observe(el); } });
  }

  window.OG_UI = { $, $$, ICO, formHTML, bindForms, calc, fillQR, qrBlock, logo, reveal };
  header(); footer(); modals();
})();
