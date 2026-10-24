// Разделы и шаблонные страницы: услуги, работы, статьи, библиотека, контакты
(function () {
  const D = window.OG, U = window.OG_UI, C = window.OG_C, T = window.OG_TEXT, I = U.ICO, $ = U.$, $$ = U.$$;
  const main = $('#page'), kind = main.dataset.page, qs = new URLSearchParams(location.search);
  const AR = I.ar, rnd = `<span class="rnd">${I.ar}</span>`;

  const crumbs = list => `<nav class="crumbs" aria-label="Хлебные крошки"><a href="index.html">Главная</a>${list.map(([t, h]) => h ? `<span><a href="${h}">${t}</a></span>` : `<span>${t}</span>`).join('')}</nav>`;
  const pageHead = (cr, title, lead, extra = '') => `<section class="pg-h"><div class="wrap">${crumbs(cr)}<h1 class="h1">${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}${extra}</div></section>`;
  const sh = (eb, title, right = '') => `<div class="sh"><div><p class="eyebrow">${eb}</p><h2 class="h2">${title}</h2></div>${right ? `<div class="sh-r">${right}</div>` : ''}</div>`;
  const cta = (t = 'Обсудим <em>ваш объект</em>', p = 'Оставьте контакты — специалист перезвонит в течение 15 минут, бесплатно подскажет, какой документ нужен, и назовёт стоимость.') =>
    `<section class="sec"><div class="wrap"><div class="cta on-dark"><div><h2 class="h2">${t}</h2><p class="lead">${p}</p>
      <div class="cta-tel"><a href="${D.phoneHref}">${D.phone}</a><span>${D.hours}</span></div></div>${U.formHTML()}</div></div></section>`;
  const filter = (items, cur) => `<div class="chips">${items.map(([v, t, n]) => `<button class="chip${v === cur ? ' is-on' : ''}" data-f="${v}">${t}${n != null ? `<sup>${n}</sup>` : ''}</button>`).join('')}</div>`;
  const bindFilter = (grid, list, render, key) => main.addEventListener('click', e => {
    const b = e.target.closest('[data-f]'); if (!b) return;
    $$('[data-f]', main).forEach(x => x.classList.toggle('is-on', x === b));
    grid.innerHTML = list.filter(x => b.dataset.f === 'all' || x[key] === b.dataset.f).map(render).join('');
  });
  const notFound = () => pageHead([['Страница не найдена']], 'Такой страницы нет', 'Возможно, ссылка устарела. Вернитесь на главную или выберите раздел в меню.');
  const findBook = n => D.books.find(b => n.includes(b.num.replace('№ ', '')) || n.includes(b.t) || b.num.includes(n.replace('СП ', '')));

  const R = {};

  // ── 2. Раздел «Услуги» ──
  R.uslugi = () => pageHead([['Услуги']], 'Услуги', 'Разрабатываем расчёты и проектную документацию, которые подтверждают: пожарные подразделения смогут потушить пожар на вашем объекте.') +
    `<section class="sec sec--top"><div class="wrap"><div class="svc-rows">${D.services.map((s, i) => `
      <article class="card svc-row">
        ${s.img ? `<div class="sr-ph svc-ph"><img src="img/${s.img}" alt=""></div>` : `<div class="ph sr-ph" data-ph="${s.short} · PNG"></div>`}
        <div class="sr-b">
          <div class="svc-m"><span class="tag">${String(i + 1).padStart(2, '0')}</span><span class="muted">${s.days} раб. дней</span></div>
          <h2 class="sr-t"><a class="cover-link" href="usluga.html?id=${s.id}">${s.title}</a></h2>
          <p class="sr-d">${s.lead}</p>
          <ul class="ticks ticks--sm">${s.includes.slice(0, 3).map(t => `<li>${t}</li>`).join('')}</ul>
          <div class="sr-f"><div><small>Стоимость</small><b>от ${D.rub(s.price)}</b></div>
            <div class="sr-btns"><button class="btn btn--line btn--sm" data-open="calc" data-svc="${s.id}">Рассчитать</button><button class="btn btn--dark btn--sm" data-open="form" data-q="Услуга: ${s.short}">Заказать</button></div></div>
        </div>
      </article>`).join('')}</div></div></section>` + cta('Не знаете, <em>какой документ нужен?</em>');

  // ── 3. Страница услуги ──
  R.usluga = () => {
    const s = D.svc(qs.get('id')) || D.services[0], i = D.services.indexOf(s);
    document.title = s.short + ' — ОГНЕВЕД';
    const works = D.works.filter(w => w.s === s.id);
    return `<section class="pg-h pg-h--svc"><div class="wrap">${crumbs([['Услуги', 'uslugi.html'], [s.short]])}
        <div class="svc-hero">
          <div><p class="eyebrow">Услуга ${String(i + 1).padStart(2, '0')}</p><h1 class="h1">${s.title}</h1><p class="lead">${s.lead}</p>
            <div class="sr-btns"><button class="btn btn--dark" data-open="form" data-q="Услуга: ${s.short}">Заказать${AR}</button><button class="btn btn--line" data-open="calc" data-svc="${s.id}">Рассчитать стоимость</button></div></div>
          <div class="svc-hero-r">${s.img ? `<div class="svc-hero-ph svc-ph"><img src="img/${s.img}" alt=""></div>` : `<div class="ph svc-hero-ph" data-ph="${s.short} · PNG"></div>`}
            <dl class="kv"><div><dt>Стоимость</dt><dd>от ${D.rub(s.price)}</dd></div><div><dt>Срок</dt><dd>${s.days} раб. дней</dd></div><div><dt>Результат</dt><dd>PDF с подписью</dd></div></dl></div>
        </div></div></section>
      <section class="sec sec--soft"><div class="wrap">${sh('Когда нужен', 'Когда нужен <em>этот документ</em>', `<p class="lead">${s.full}</p>`)}
        <div class="when">${s.when.map((t, k) => `<div class="when-i"><span class="tag tag--soft">${String(k + 1).padStart(2, '0')}</span><p>${t}</p></div>`).join('')}</div></div></section>
      <section class="sec"><div class="wrap split">
        <div class="split-l"><p class="eyebrow">Состав работ</p><h2 class="h2">Что входит <em>в&nbsp;работу</em></h2></div>
        <ol class="steps">${s.includes.map((t, k) => `<li><span>${String(k + 1).padStart(2, '0')}</span><p>${t}</p></li>`).join('')}</ol>
      </div></section>
      <section class="sec"><div class="wrap two">
        <div class="two-card"><h3 class="h3">Что нужно от вас</h3><ul class="ticks">${s.input.map(t => `<li>${t}</li>`).join('')}</ul><p class="muted">Не хватает данных — поможем собрать.</p></div>
        <div class="two-card two-card--dark"><h3 class="h3">Результат</h3><p>${s.result}</p>
          <p class="eyebrow">Нормативная база</p><div class="chips">${s.norms.map(n => { const b = findBook(n); return b ? `<a class="chip" href="kniga.html?id=${b.id}">${n}</a>` : `<span class="chip">${n}</span>`; }).join('')}</div></div>
      </div></section>
      ${works.length ? `<section class="sec sec--soft"><div class="wrap">${sh('Примеры', 'Выполненные <em>проекты</em>', `<a class="link" href="raboty.html">Все проекты${rnd}</a>`)}<div class="work-grid">${works.slice(0, 2).map(C.work).join('')}</div></div></section>` : ''}
      <section class="sec"><div class="wrap">${sh('Ещё', 'Другие <em>услуги</em>', `<a class="link" href="uslugi.html">Все услуги${rnd}</a>`)}<div class="svc-grid">${D.services.filter(x => x !== s).slice(0, 3).map(x => C.svc(x, D.services.indexOf(x))).join('')}</div></div></section>` + cta();
  };

  // ── 4. Раздел «Наши работы» ──
  R.raboty = () => {
    const used = D.services.filter(s => D.works.some(w => w.s === s.id));
    setTimeout(() => bindFilter($('#wgrid'), D.works, C.work, 's'));
    return pageHead([['Наши работы']], 'Наши работы', 'Проекты для жилых домов, складов, производств, мостов и гидроэлектростанций по всей России. Стоимость и сроки — «основная работа + дополнительные услуги».',
      filter([['all', 'Все проекты', D.works.length], ...used.map(s => [s.id, s.short, D.works.filter(w => w.s === s.id).length])], 'all')) +
      `<section class="sec sec--top"><div class="wrap"><div class="work-grid work-grid--3" id="wgrid">${D.works.map(C.work).join('')}</div></div></section>` + cta('Нужен <em>похожий проект?</em>');
  };

  // ── 5. Страница проекта ──
  R.rabota = () => {
    const w = D.works.find(x => x.id === qs.get('id')) || D.works[0], s = D.svc(w.s), tx = T.work[w.s] || T.work.opp;
    document.title = w.obj + ' — ОГНЕВЕД';
    const others = D.works.filter(x => x !== w).sort((a, b) => (b.s === w.s) - (a.s === w.s)).slice(0, 2);
    return `<section class="pg-h"><div class="wrap">${crumbs([['Наши работы', 'raboty.html'], [w.obj]])}
        <p class="eyebrow">${w.type}</p><h1 class="h1">${w.obj}</h1>
        <dl class="kv kv--row"><div><dt>Регион</dt><dd>${w.city}</dd></div><div><dt>Стоимость</dt><dd>${w.cost} тыс. ₽</dd></div><div><dt>Срок</dt><dd>${w.days} ${C.dn(w.days)}</dd></div><div><dt>Объект</dt><dd>${D.objects.find(o => o.id === w.o).t}</dd></div></dl></div></section>
      <div class="wrap"><div class="wp-img"><img src="img/${w.img}.webp" alt="${w.obj}"></div></div>
      <section class="sec"><div class="wrap work-page">
        <div class="prose">
          <h2>Задача</h2><p>${tx[0]}</p>
          <h2>Что сделали</h2><p>${tx[1]}</p>${w.extra ? `<p><b>Дополнительно:</b> ${w.extra.toLowerCase()}.</p>` : ''}
          <h2>Результат</h2><p>${tx[2]}</p>
        </div>
        <aside class="side-card"><p class="eyebrow">Услуга</p><a class="sc-svc" href="usluga.html?id=${s.id}"><b>${s.title}</b><span>от ${D.rub(s.price)} · ${s.days} раб. дней</span></a>
          <button class="btn btn--dark btn--full" data-open="form" data-q="Похожий проект: ${w.obj}">Заказать похожий проект${AR}</button>
          <button class="btn btn--line btn--full" data-open="calc" data-svc="${s.id}">Рассчитать стоимость</button></aside>
      </div></section>
      <section class="sec sec--soft"><div class="wrap">${sh('Ещё', 'Другие <em>проекты</em>', `<a class="link" href="raboty.html">Все проекты${rnd}</a>`)}<div class="work-grid">${others.map(C.work).join('')}</div></div></section>` + cta();
  };

  // ── 6. Раздел «Статьи» ──
  R.blog = () => {
    const tags = [...new Set(D.articles.map(a => a.tag))];
    const top = D.articles.slice(0, 2), rest = D.articles.slice(2);
    setTimeout(() => main.addEventListener('click', e => {
      const b = e.target.closest('[data-f]'); if (!b) return;
      $$('[data-f]', main).forEach(x => x.classList.toggle('is-on', x === b));
      const v = b.dataset.f;
      $('#atop').style.display = v === 'all' ? '' : 'none';
      $('#agrid').innerHTML = (v === 'all' ? rest : D.articles.filter(a => a.tag === v)).map(C.art).join('');
    }));
    return pageHead([['Статьи']], 'Статьи', 'Простым языком о проездах, планах тушения, водоснабжении и расчётах сил и средств.', filter([['all', 'Все статьи', D.articles.length], ...tags.map(t => [t, t])], 'all')) +
      `<section class="sec sec--top"><div class="wrap">
        <div class="art-top" id="atop">${top.map(a => `<article class="card art art--big"><div class="art-img"><img src="img/${a.img}.webp" alt=""></div><div class="art-b"><p class="art-m"><span>${a.tag}</span><time>${a.date}</time></p><h2 class="art-t"><a class="cover-link" href="statya.html?id=${a.id}">${a.t}</a></h2><p class="art-d">${a.d}</p></div></article>`).join('')}</div>
        <div class="art-grid art-grid--3" id="agrid">${rest.map(C.art).join('')}</div></div></section>`;
  };

  // ── 7. Статья ──
  R.statya = () => {
    const a = D.articles.find(x => x.id === qs.get('id')) || D.articles[0], tx = T.articles[a.id];
    document.title = a.t + ' — ОГНЕВЕД';
    const more = D.articles.filter(x => x !== a).slice(0, 3);
    return `<section class="pg-h pg-h--art"><div class="wrap">${crumbs([['Статьи', 'blog.html'], [a.t]])}
        <div class="art-head"><p class="art-m"><span>${a.tag}</span><time>${a.date}</time><span class="muted">4 мин чтения</span></p><h1 class="h1">${a.t}</h1><p class="lead">${tx.lead}</p></div></div></section>
      <div class="wrap"><div class="art-cover"><img src="img/${a.img}.webp" alt=""></div></div>
      <section class="sec"><div class="wrap article">
        <aside class="toc"><p class="eyebrow">Содержание</p><ol>${tx.body.map(([h], k) => `<li><a href="#p${k}">${h}</a></li>`).join('')}</ol></aside>
        <div class="prose">${tx.body.map(([h, p], k) => `<h2 id="p${k}">${h}</h2><p>${p}</p>`).join('')}
          <div class="prose-cta"><b>Нужен расчёт для вашего объекта?</b><p>Бесплатно подскажем, какой документ потребуется, и назовём стоимость.</p><button class="btn btn--dark btn--sm" data-open="form" data-q="Вопрос по статье: ${a.t}">Задать вопрос</button></div></div>
        <aside class="side-card side-card--list"><p class="eyebrow">Услуги</p>${D.services.slice(0, 4).map(s => `<a class="sc-svc" href="usluga.html?id=${s.id}"><b>${s.short}</b><span>от ${D.rub(s.price)}</span></a>`).join('')}</aside>
      </div></section>
      <section class="sec sec--soft"><div class="wrap">${sh('Читать дальше', 'Другие <em>статьи</em>', `<a class="link" href="blog.html">Все статьи${rnd}</a>`)}<div class="art-grid art-grid--3">${more.map(C.art).join('')}</div></div></section>`;
  };

  // ── 8. Раздел «Библиотека» ──
  R.biblioteka = () => {
    const kinds = [...new Set(D.books.map(b => b.kind))];
    setTimeout(() => bindFilter($('#bgrid'), D.books, C.book, 'kind'));
    return pageHead([['Библиотека']], 'Библиотека', 'Законы, своды правил, приказы МЧС и книги, на которые мы опираемся в работе. Следим за изменениями и отмечаем новые редакции.',
      filter([['all', 'Все документы', D.books.length], ...kinds.map(k => [k, k, D.books.filter(b => b.kind === k).length])], 'all')) +
      `<section class="sec sec--top"><div class="wrap"><div class="lib-grid lib-grid--3" id="bgrid">${D.books.map(C.book).join('')}</div></div></section>`;
  };

  // ── 9. Карточка книги ──
  R.kniga = () => {
    const b = D.books.find(x => x.id === qs.get('id')) || D.books[0];
    document.title = b.t + ' — ОГНЕВЕД';
    const svcs = D.services.filter(s => s.norms.some(n => findBook(n) === b));
    const status = b.kind === 'Учебник' || b.kind === 'Справочник' ? 'Учебное издание' : 'Действует';
    return `<section class="pg-h"><div class="wrap">${crumbs([['Библиотека', 'biblioteka.html'], [b.t]])}
      <div class="book">
        <div class="book-cv"><div class="book-doc">${C.cover(b)}</div></div>
        <div class="book-info"><p class="eyebrow">${b.kind}</p><h1 class="h1">${b.t}</h1>
          <dl class="kv kv--row"><div><dt>Номер</dt><dd>${b.num}</dd></div><div><dt>Дата</dt><dd>${b.date}</dd></div><div><dt>Статус</dt><dd><span class="status">${status}</span></dd></div></dl>
          <p class="lead">${b.d}</p>
          ${b.news ? `<p class="book-news"><span class="tag tag--acc">${b.news}</span></p>` : ''}
          ${svcs.length ? `<div class="book-svc"><p class="eyebrow">Применяем в услугах</p><div class="chips">${svcs.map(s => `<a class="chip" href="usluga.html?id=${s.id}">${s.short}</a>`).join('')}</div></div>` : ''}
          <div class="sr-btns"><a class="btn btn--dark" href="#">Скачать PDF${I.dl}</a><button class="btn btn--line" data-open="form" data-q="Вопрос по документу: ${b.t}">Задать вопрос по документу</button></div>
          <p class="note">Документ приведён для ознакомления. Актуальную редакцию сверяйте с официальным источником.</p>
        </div></div></div></section>
      <section class="sec sec--soft"><div class="wrap">${sh('Ещё', 'Другие <em>документы</em>', `<a class="link" href="biblioteka.html">Вся библиотека${rnd}</a>`)}<div class="lib-grid">${D.books.filter(x => x !== b).slice(0, 4).map(C.book).join('')}</div></div></section>`;
  };

  // ── 10. Контакты ──
  R.kontakty = () => {
    setTimeout(() => U.fillQR(main));
    return pageHead([['Контакты']], 'Контакты', 'Работаем дистанционно по всей России. Позвоните, напишите в мессенджер или оставьте заявку — ответим в течение 15 минут в рабочее время.') +
      `<section class="sec sec--top"><div class="wrap contacts">
        <div class="ct-l">
          <div class="ct-main"><p class="eyebrow">Телефон</p><a href="${D.phoneHref}">${D.phone}</a><span>${D.hours}</span></div>
          <div class="ct-grid">
            <div><p class="eyebrow">Почта</p><a href="mailto:${D.email}">${D.email}</a></div>
            <div><p class="eyebrow">География</p><span>${D.city}</span></div>
            <div><p class="eyebrow">Руководитель</p><span>Пигусова Екатерина Михайловна, исполнительный директор</span></div>
            <div><p class="eyebrow">Реквизиты</p><span>Отправим вместе с договором</span></div>
          </div>
          <div class="ct-qr"><h2 class="h3">Быстрая связь с&nbsp;телефона</h2>${U.qrBlock()}</div>
        </div>
        <div class="ct-form"><h2 class="h3">Напишите нам</h2><p class="muted">Опишите объект и задачу — подготовим предложение.</p>${U.formHTML({ ql: 'Объект и задача' })}</div>
      </div></section>`;
  };

  main.innerHTML = (R[kind] || notFound)();
  U.bindForms(main);
  // своя форма-приглашение на странице — призыв в подвале не дублируем
  if ($('.cta, .ct-form', main)) $('.ftr-cta')?.remove();
  U.reveal();
})();
