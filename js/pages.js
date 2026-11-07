// Внутренние страницы (ПК) — в языке главной (Figma «home»): шапка раздела с крошками и крупным заголовком с серым хвостом,
// блоки на линиях рамки с крестиками, плашки без подложки, карточки и формы главной, кнопки со стрелкой-уголком.
// Фон блоков чередуется: шапка страницы — цвета первого экрана, дальше белый и тонированный по очереди.
(function () {
  const D = window.OG, U = window.OG_UI, C = window.OG_C, T = window.OG_TEXT, $ = U.$, $$ = U.$$;
  // тексты страниц и кнопки — из админки (data/content.json → D.tx.pg, D.btn); {…} — подстановки
  const X = D.tx.pg, BT = D.btn, F = D.f, NP = D.about.facts[0] ? D.about.facts[0].n : '';
  const main = $('#page'), kind = main.dataset.page, qs = new URLSearchParams(location.search);
  const AR = C.AR, pad = C.pad, S = C.order.map(D.svc);
  const after = [];

  // ── общие детали ──
  const crumbs = list => `<nav class="crb" aria-label="Хлебные крошки"><a href="index.html">${X.crumbHome}</a>${list.map(([t, h]) => h ? `<a href="${h}">${t}</a>` : `<span aria-current="page">${t}</span>`).join('')}</nav>`;
  // услуга без цены в калькуляторе: вместо расчёта — запрос стоимости
  const costBtn = (s, t = X.usluga.calc, cls) => s.price ? fb(t, { cls, open: 'calc', svc: s.id }) : fb(X.usluga.ask, { cls, open: 'form', q: F(X.usluga.askQ, s) });
  // кнопка, у которой «куда ведёт» задано в админке
  const lb = (l, cls, v) => D.B(l, 'fb' + (cls ? ' ' + cls : ''), v);
  const badge = t => `<p class="badge badge--flat"><i></i>${t}</p>`;
  const fb = (t, o = {}) => {
    const cls = `fb${o.cls ? ' ' + o.cls : ''}`, inner = `<span>${t}</span>${AR}`;
    if (o.href) return `<a class="${cls}" href="${o.href}"${o.blank ? ' target="_blank" rel="noopener"' : ''}>${inner}</a>`;
    return `<button class="${cls}"${o.open ? ` data-open="${o.open}"` : ''}${o.q ? ` data-q="${o.q}"` : ''}${o.svc ? ` data-svc="${o.svc}"` : ''}>${inner}</button>`;
  };
  // шапка блока, как на главной: плашка, заголовок с серым хвостом, справа — пояснение или кнопка
  const sh = (b, h, r = '', cls = '') => `<div class="sh${cls ? ' ' + cls : ''}">${badge(b)}<h2 class="h2x">${h}</h2>${r ? `<div class="sh-r">${r}</div>` : ''}</div>`;
  // цифры шапки страницы — как ряд цифр «О нас» на главной, только мельче
  const facts = list => `<ul class="pgf">${list.map(([n, t], i) => `<li><span class="num">${pad(i + 1)}</span><b${n === 'Индивидуально' ? ' class="pgf-w"' : ''}>${String(n).replace(/^от(&nbsp;|\s)/, '<small>от</small>')}</b><p>${t}</p></li>`).join('')}</ul>`;
  const dl = (list, cls = '') => `<dl class="pgd${cls ? ' ' + cls : ''}">${list.map(([t, v]) => `<div><dt>${t}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
  // шапка страницы: крошки, слева заголовок, справа — пояснение и кнопки, ниже — цифры или фильтр
  const head = o => `<section class="pgh"><div class="wrap2">
      ${crumbs(o.cr)}
      <div class="pgh-g"><div class="pgh-h">${o.badge ? badge(o.badge) : ''}<h1 class="h1x">${o.h}</h1></div>
        ${o.lead || o.act ? `<div class="pgh-r">${o.lead ? `<p class="pgh-p">${o.lead}</p>` : ''}${o.act ? `<div class="pgh-act">${o.act}</div>` : ''}</div>` : ''}</div>
      ${o.facts ? facts(o.facts) : ''}${o.dl ? dl(o.dl) : ''}
    </div></section>`;
  // блоки страницы: первый после шапки — белый, дальше фон чередуется
  let tint = true;
  const sec = (inner, o = {}) => { tint = o.tint ?? !tint; return `<section class="sec${tint ? ' sec--tint' : ''}${o.cls ? ' ' + o.cls : ''}"${o.id ? ` id="${o.id}"` : ''}><div class="wrap2">${inner}</div></section>`; };
  // призыв в конце страницы: заголовок, телефон и форма первого экрана в ряд
  const cta = (h = X.cta.h) => sec(`
      <div class="ctx">
        <div class="ctx-l">${badge(X.cta.badge)}<h2 class="h2x">${h}</h2></div>
        <div class="ctx-r"><a class="ctx-tel" href="${D.phoneHref}">${D.phone}</a><small>${D.hours}</small></div>
      </div>
      <div class="ctx-f"><h3 class="hf-t">${X.cta.ft}</h3><p class="hf-s">${X.cta.fs}</p>${U.formRow({ form: 'cta' })}</div>`, { cls: 'pg-cta' });
  const findBook = n => D.books.find(b => n.includes(b.num.replace('№ ', '')) || n.includes(b.t) || b.num.includes(n.replace('СП ', '')));
  const chips = (id, list) => `<div class="chips2" id="${id}">${list.map(([v, t], k) => `<button class="chip2${k ? '' : ' is-on'}" data-f="${v}">${t}</button>`).join('')}</div>`;
  // перерисовка списка по фильтру: старые карточки уходят, новые появляются (motion.js — [data-swap])
  const swap = (box, html) => { box.classList.add('is-swap'); setTimeout(() => { box.innerHTML = html; box.classList.remove('is-swap'); }, box.children.length ? 260 : 0); };
  const onChip = (bar, f) => bar.addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; $$('.chip2', bar).forEach(x => x.classList.toggle('is-on', x === b)); f(b.dataset.f); });
  const works = list => { const sp = C.wkSpans(list.length); return list.map((w, k) => C.wkc(w, '', `grid-column:span ${sp[k]}`, true)).join(''); };
  const R = {};

  // ── Услуги ──
  // ситуации заказчика → документ, который её закрывает
  const PICK = X.uslugi.pick.items.map(x => [x.t, x.s]).filter(x => D.svc(x[1]));
  R.uslugi = () => {
    after.push(() => { C.eqSc($('#svc')); C.play($('#svc')); window.OG_CALC($('#calc')); });
    const U0 = X.uslugi;
    return head({ cr: [[U0.crumb]], h: U0.h, lead: U0.lead,
        act: lb(BT.uslugiA, 'fb--red') + lb(BT.uslugiB),
        facts: U0.facts.map(x => [F(x.n, { projects: NP }), F(x.t, { projects: NP })]) }) +
      sec(`<div class="scx" id="svc">${S.map((s, i) => C.sc(s, i, S.length)).join('')}</div>`, { cls: 'sec--first' }) +
      sec(`<div class="pk">
          <div class="pk-l">${badge(U0.pick.badge)}<h2 class="h2x">${U0.pick.h}</h2>
            <p class="pk-s">${U0.pick.s}</p>
            ${lb(BT.pick, 'fb--dark')}</div>
          <ol class="pk-list">${PICK.map(([t, id], i) => `<li><a class="pk-i" href="usluga.html?id=${id}"><span class="num">${pad(i + 1)}</span><b>${t}</b><span class="pk-to"><span class="pk-im"><img src="img/${D.svc(id).img}.webp" alt="" loading="lazy" decoding="async"></span>${D.svc(id).cardT}</span>${AR}</a></li>`).join('')}</ol>
        </div>`) +
      sec(sh(U0.price.badge, U0.price.h, `<p>${U0.price.p}</p>`) +
        '<div class="calc-wrap" id="calc"></div>', { id: 'price' }) +
      cta();
  };

  // ── Страница услуги ──
  // «Когда нужен» — чистые карточки на белом, как в блоке «Исходные данные»: у каждой ситуации своя линейная иконка
  // (js/when-ic.js), номер и текст; последняя — пунктирная «Не уверены, нужен ли документ?»
  const whenCards = s => sh(X.usluga.whenBadge, X.usluga.whenH) +
    `<ul class="fls wn-ls" style="--n:${s.when.length + 1}">${s.when.map((t, k) => `<li class="fl wn-c" style="--k:${k}"><span class="wn-ic">${((window.OG_WIC || {})[s.id] || [])[k] || ''}</span><span class="num">${pad(k + 1)}</span><b>${t}</b></li>`).join('')}
      <li><button class="fl fl--add" data-open="form" data-q="${D.esc(F(X.usluga.whenQ, s))}"><span class="fl-plus"></span><b>${X.usluga.whenAddT}</b><small>${X.usluga.whenAddS}</small></button></li></ul>`;
  // «Что входит» — типовой календарный план: пункты работ строками, справа — шкала рабочих дней типового срока (s.base).
  // Отрезки — из s.plan (data.js); если пунктов стало больше, чем отрезков, они идут внахлёст сами, шагом в полдня
  const spans = (n, B) => { const st = B / n, h = v => Math.round(v * 2) / 2;
    return [...Array(n)].map((_, k) => { const a = k ? h(k * st - st * .35) : 0, b = k === n - 1 ? B : h((k + 1) * st); return [a, Math.max(b, a + .5)]; }); };
  // длительность отрезка: «1 день», «1,5 дня», «2 дня», «5 дней»
  const dur = v => String(v).replace('.', ',') + '&nbsp;' + (v % 1 ? 'дня' : C.dn(v).replace('раб. ', ''));
  const planOf = s => { const n = s.includes.length, sp = s.plan && s.plan.length === n ? s.plan : spans(n, s.base);
    return { sp, B: Math.max(s.base, ...sp.map(x => Math.ceil(x[1]))), hi: +s.days.split('–')[1] || 0 }; };
  // пояснение в шапке блока: типовой срок, от чего отсчёт и срок для крупного объекта
  const planNote = s => { const { B, hi } = planOf(s);
    return `Типовой срок&nbsp;— ${B}&nbsp;${C.dn(B).replace('раб.', 'рабочих')} с&nbsp;получения исходных данных${hi > B ? `, для&nbsp;крупного объекта&nbsp;— до&nbsp;${hi}` : ''}. Дату сдачи фиксируем в&nbsp;договоре.`; };
  const plan = s => {
    const { sp, B } = planOf(s);
    return `<div class="gnt" style="--d:${B}">
        <div class="gnt-tl" aria-hidden="true"><i class="gnt-band"></i><i class="gnt-now"></i></div>
        <div class="gnt-r gnt-hd"><p class="side-k">${X.usluga.stage}</p><ol class="gnt-days" aria-hidden="true">${[...Array(B)].map((_, d) => `<li style="--x:${d}">${pad(d + 1)}</li>`).join('')}</ol><p class="gnt-end">${X.usluga.end}</p></div>
        <ol class="gnt-ls">${s.includes.map((t, k) => `<li class="gnt-r" style="--a:${sp[k][0]};--b:${sp[k][1]}"><p class="gnt-t"><span class="num">${pad(k + 1)}</span><b>${t}</b></p><span class="gnt-c"><i class="gnt-bar"><em>${dur(sp[k][1] - sp[k][0])}</em></i></span></li>`).join('')}</ol>
        <div class="gnt-r gnt-ft">${costBtn(s, X.usluga.planBtn, 'fb--sm')}<p class="gnt-pdf"><i></i>${/бумажн/i.test(s.result) ? X.usluga.pdfPaper : X.usluga.pdfSign}</p></div>
      </div>`;
  };
  // исходные данные — карточками файлов: чертежи присылают в .dwg/.pdf, сведения — в .pdf/.doc
  const extOf = t => /план|схем|разрез|проект|фасад|застройк/i.test(t) ? ['dwg', 'pdf'] : ['pdf', 'doc'];
  R.usluga = () => {
    const s = D.svc(qs.get('id')) || S[0], i = S.indexOf(s), FX = window.OG_FX || {};
    document.title = F(X.titleTpl, { t: s.cardT });
    const wk = D.works.filter(w => w.s === s.id);
    // «Другие документы»: у этих услуг порядок задан заказчиком, у остальных — следующие по кругу
    const MORE = (s.more || []).map(D.svc).filter(x => x && x !== s);
    const others = MORE.length ? MORE.slice(0, 3) : [1, 2, 3].map(k => S[(i + k) % S.length]).filter(x => x !== s);
    after.push(() => {
      setTimeout(() => $('.svh-art').classList.add('is-play'), 900); $('#svc') && (C.eqSc($('#svc')), C.play($('#svc')));
      // календарный план: когда блок на экране, линия «сегодня» проходит шкалу и отрезки заливаются за ней;
      // наведение на пункт подсвечивает его дни полосой через всю шкалу
      $$('.gnt').forEach(el => {
        new IntersectionObserver(([e], o) => { if (e.isIntersecting) { el.classList.add('is-on'); o.disconnect(); } }, { threshold: .4 }).observe(el);
        $$('.gnt-ls li', el).forEach(li => li.addEventListener('mouseenter', () => { el.style.setProperty('--ha', li.style.getPropertyValue('--a')); el.style.setProperty('--hb', li.style.getPropertyValue('--b')); el.classList.add('is-hl'); }));
        $('.gnt-ls', el).addEventListener('mouseleave', () => el.classList.remove('is-hl'));
      });
      // иконки «Когда нужен» прорисовываются при появлении и оживают, только пока ряд на экране
      $$('.wn-ls').forEach(el => new IntersectionObserver(([e]) => el.classList.toggle('is-on', e.isIntersecting), { threshold: .25 }).observe(el));
    });
    return `<section class="pgh svh"><div class="wrap2">
        ${crumbs([[X.uslugi.crumb, 'uslugi.html'], [s.cardT]])}
        <div class="svh-g">
          <div class="svh-l">
            ${badge(`${X.usluga.badge} ${pad(i + 1)} / ${pad(S.length)}`)}
            <h1 class="h1x">${s.cardT.replace(/ и (\S+)/g, (m, a) => ` <span style="white-space:nowrap">и ${a}</span>`).replace(/\s*(\([^)]+\))$/, (m, a) => ` <span class="g">${a}</span>`)}</h1>
            <p class="svh-doc">${s.cardD}</p>
            <p class="svh-p">${s.lead}</p>
            <div class="pgh-act">${lb(BT.uslugaOrder, 'fb--red', s)}</div>
          </div>
          <div class="svh-art sc" data-fx="${s.id}">
            <div class="sc-art"><img class="sc-im" src="img/${s.img}.webp" alt="${s.cardT}">${FX[s.id] && C.ownImg(s) ? `<svg class="sc-fx" viewBox="0 0 ${FX.W} ${FX.H}" aria-hidden="true">${FX[s.id]}</svg>` : ''}</div>
            <span class="sc-n">${pad(i + 1)} / ${pad(S.length)}</span><span class="sc-d">${s.days} ${X.usluga.daysShort}</span>
          </div>
        </div>
        ${facts([[D.cost(s), s.price ? X.usluga.fPrice : X.usluga.fPrice0], [s.days, X.usluga.fDays], [X.usluga.fPdfN, X.usluga.fPdf], [String(s.norms.length), X.usluga.fNorms]])}
      </div></section>` +
      sec(whenCards(s), { cls: 'sec--first' }) +
      sec(sh(X.usluga.planBadge, X.usluga.planH, `<p>${planNote(s)}</p>`, 'sh--line') + plan(s)) +
      sec(`<div class="io">
          <div class="io-c io-in"><div class="io-top">${badge(X.usluga.inBadge)}<h3 class="io-h">${X.usluga.inH}</h3>
            <p class="io-s">${X.usluga.inS}</p></div>
            <ul class="fls">${s.input.map((t, k) => `<li class="fl"><span class="num">${pad(k + 1)}</span><span class="fl-x">${extOf(t).map(e => `<i>${e}</i>`).join('')}</span><b>${t}</b></li>`).join('')}
              <li><button class="fl fl--add" data-open="form" data-q="${D.esc(F(X.usluga.inQ, s))}"><span class="fl-plus"></span><b>${X.usluga.inAddT}</b><small>${X.usluga.inAddS}</small></button></li></ul></div>
          <div class="io-c io-c--dark">${badge(X.usluga.outBadge)}<h3 class="io-h">${X.usluga.outH}</h3><p class="io-p">${s.result}</p>
            <div class="io-nr"><p class="io-k">${X.usluga.norms}</p><div class="io-chips">${s.norms.map(n => { const b = findBook(n); return b ? `<a href="kniga.html?id=${b.id}">${n}${AR}</a>` : `<span>${n}</span>`; }).join('')}</div></div></div>
        </div>`) +
      (wk.length ? sec(sh(X.usluga.exBadge, X.usluga.exH, fb(X.allWorks, { href: 'raboty.html', cls: 'fb--sm' })) + `<div class="wkx">${works(wk.slice(0, 2))}</div>`) : '') +
      sec(sh(X.usluga.moreBadge, X.usluga.moreH, fb(X.allSvc, { href: 'uslugi.html', cls: 'fb--sm' })) + `<div class="scx" id="svc">${others.map(x => C.sc(x, S.indexOf(x), S.length)).join('')}</div>`) +
      cta();
  };

  // ── Наши работы ──
  R.raboty = () => {
    const used = S.filter(s => D.works.some(w => w.s === s.id));
    after.push(() => {
      // порядок карточек свой при каждой загрузке
      const WK = C.shuffle(D.works), grid = $('#wgrid'), show = v => swap(grid, works(WK.filter(w => v === 'all' || w.s === v)));
      onChip($('#wf'), show); show('all');
    });
    const R0 = X.raboty, rv = { projects: NP, cities: D.cities.length };
    return head({ cr: [[R0.crumb]], h: R0.h, lead: R0.lead,
        act: lb(BT.rabotyA, 'fb--red'),
        facts: R0.facts.map(x => [F(x.n, rv), F(x.t, rv)]) }) +
      sec(chips('wf', [['all', F(R0.all, { n: D.works.length })], ...used.map(s => [s.id, s.short])]) + '<div class="wkx" id="wgrid" data-swap></div>', { cls: 'sec--first' }) +
      cta(X.cta.h2);
  };

  // ── Страница проекта ──
  // графическая часть: две схемы на одной панели (js/schemes.js), под панелью — карточки условных обозначений;
  // наведение на карточку оставляет яркими только её слои
  const schemes = w => {
    const B = window.OG_SCH, x = B && B.get(w.id); if (!x) return '';
    const vb = `viewBox="0 0 ${B.W} ${B.H}"`;
    const top = (s, cls) => `<div class="sxh ${cls}"><p class="side-k">${s.l}</p><h3>${s.t}</h3><p class="sxh-s">${s.s}</p></div>`;
    after.push(() => {
      const el = $('#sx'), box = el.closest('.sxw');
      new IntersectionObserver(([e], o) => { if (e.isIntersecting) { el.classList.add('is-on'); o.disconnect(); } }, { threshold: .35 }).observe(el);
      // сигналы бегут, только пока панель на экране
      new IntersectionObserver(([e]) => el.classList.toggle('is-run', e.isIntersecting)).observe(el);
      const layers = $$('[data-l]', el), dim = k => { layers.forEach(g => g.classList.toggle('is-dim', !!k && !g.dataset.l.split(' ').includes(k))); el.classList.toggle('is-dim', !!k); };
      $$('.sxk', box).forEach(b => { b.addEventListener('mouseenter', () => dim(b.dataset.k)); b.addEventListener('focus', () => dim(b.dataset.k)); b.addEventListener('blur', () => dim()); });
      $('.sxk-ls', box).addEventListener('mouseleave', () => dim());
    });
    return sec(sh(X.rabota.sxBadge, X.rabota.sxH, `<p>${x.note}</p>`, 'sh--line') + `
      <div class="sxw">
        <p class="sx-hint m-only">${X.rabota.sxHint}<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 6l4 4-4 4"/></svg></p>
        <div class="sx-scroll"><div class="sx" id="sx" role="img" aria-label="${x.sheets.map(s => s.t + ': ' + s.s).join('. ').replace(/&nbsp;/g, ' ')}">
          <i class="sx-dark"></i>
          <svg class="sx-veil" ${vb} aria-hidden="true">${B.veil(x.veil)}</svg>
          <svg class="sx-art" ${vb} aria-hidden="true"><defs><pattern id="sx-hatch" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V26M0 0H26" fill="none" stroke="#f5312a" stroke-opacity=".34"/></pattern>${[['hb', '#0032df', .34], ['hr', '#f5312a', .5], ['hw', '#fff', .24]].map(([n, c, o]) => `<pattern id="sx-${n}" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V11" fill="none" stroke="${c}" stroke-opacity="${o}"/></pattern>`).join('')}</defs>${x.art}</svg>
          <svg class="sx-run" ${vb} aria-hidden="true">${x.run}</svg>
          ${top(x.sheets[0], 'sxh--l')}${top(x.sheets[1], 'sxh--r')}
          ${x.spec ? `<dl class="sx-spec">${x.spec.map(([t, v]) => `<div><dt>${t}</dt><dd class="num">${v}</dd></div>`).join('')}</dl>` : ''}
          <p class="sx-tag"><i></i>${X.rabota.sxTag}</p>
        </div></div>
        <ul class="sxk-ls" style="--n:${x.keys.length + 1}">${x.keys.map(c => `<li><button class="sxk" data-k="${c.k}"><i class="sxk-ic">${B.ICON[c.i]}</i><b>${c.b}${c.u ? ` <small>${c.u}</small>` : ''}</b><span>${c.t}</span></button></li>`).join('')}
          <li><button class="fl fl--add" data-open="form" data-q="${D.esc(F(X.rabota.sxQ, w))}"><span class="fl-plus"></span><b>${X.rabota.sxAddT}</b><small>${X.rabota.sxAddS}</small></button></li></ul>
      </div>`);
  };
  R.rabota = () => {
    const w = D.works.find(x => x.id === qs.get('id')) || D.works[0], s = D.svc(w.s) || S[0], tpl = T.work[w.s] || T.work.opp || [], R1 = X.rabota;
    // текст проекта: свой у работы или шаблон вида услуги
    const tx = [w.task || tpl[0] || '', w.did || tpl[1] || '', w.result || tpl[2] || ''];
    document.title = F(X.titleTpl, { t: w.obj });
    const others = D.works.filter(x => x !== w).sort((a, b) => (b.s === w.s) - (a.s === w.s)).slice(0, 2);
    const text = [[R1.task, tx[0]], [R1.did, tx[1]], [R1.result, tx[2]]].filter(x => x[1]);
    const ob = D.objects.find(o => o.id === w.o);
    return head({ cr: [[X.raboty.crumb, 'raboty.html'], [w.obj]], badge: w.type, h: w.obj,
        dl: [[R1.region, w.city], [R1.cost, `${w.cost} ${R1.costU}`], [R1.days, `${w.days} ${C.dn(w.days)}`], ...(ob ? [[R1.objType, ob.t]] : [])] }) +
      sec(`<div class="wph">${C.pic(w.img, `alt="${w.obj}" data-par`)}</div>
        <div class="wpb">
          <div class="wpb-main">${text.map(([t, p], k) => `<div class="wpb-i"><p class="wpb-k"><span class="num">${pad(k + 1)}</span>${t}</p><div class="wpb-t"><p>${p}</p>${k === 1 && w.extra ? `<p class="wpb-x"><b>+</b>${R1.extra} ${w.extra.toLowerCase()}</p>` : ''}</div></div>`).join('')}</div>
          <aside class="wpb-side">
            <p class="side-k">${R1.svc}</p>
            <a class="sv-link" href="usluga.html?id=${s.id}"><span class="mx-im"><img src="img/${s.img}.webp" alt=""></span><span class="mx-tx"><i>${pad(S.indexOf(s) + 1)}</i><b>${s.cardT}</b><small>${D.cost(s)} · ${s.days} ${X.days}</small></span>${AR}</a>
            <div class="side-btns">${lb(BT.rabotaOrder, 'fb--red', w)}${costBtn(s)}</div>
          </aside>
        </div>`, { cls: 'sec--first' }) +
      schemes(w) +
      sec(sh(R1.moreBadge, R1.moreH, fb(X.allWorks, { href: 'raboty.html', cls: 'fb--sm' })) + `<div class="wkx">${works(others)}</div>`) +
      cta(X.cta.h2);
  };

  // ── Статьи: первая — крупно, остальные сеткой; фильтр по темам ──
  const feat = a => `<article class="arf">
      <a class="arf-img" href="statya.html?id=${a.id}" tabindex="-1">${C.pic(a.img, 'alt="" fetchpriority="high" data-par')}</a>
      <div class="arf-b">
        <div class="arf-m">${badge(a.tag)}<time>${a.date}</time></div>
        <h2><a class="cover-link" href="statya.html?id=${a.id}">${a.t}</a></h2>
        <p class="arf-d">${a.d}</p>
        <span class="fb arf-btn"><span>${X.blog.read}</span>${AR}</span>
      </div>
    </article>`;
  // ряды по три карточки; если в хвосте осталась одна — два последних ряда становятся парами (7 = 3 + 2 + 2)
  const artGrid = list => { const sp = []; for (let n = list.length; n > 0;) { if (n === 4 || n === 2) { sp.push(...Array(n).fill(3)); n = 0; } else { const k = Math.min(3, n); sp.push(...Array(k).fill(6 / k)); n -= k; } }
    return `<div class="arg">${list.map((a, k) => C.arc(a, '', true).replace('<article class="arc"', `<article class="arc" style="grid-column:span ${sp[k]}"`)).join('')}</div>`; };
  R.blog = () => {
    const tags = [...new Set(D.articles.map(a => a.tag))];
    after.push(() => {
      const grid = $('#agrid');
      const show = v => { const list = D.articles.filter(a => v === 'all' || a.tag === v); swap(grid, v === 'all' ? feat(list[0]) + artGrid(list.slice(1)) : list.length < 3 ? list.map(feat).join('') : artGrid(list)); };
      onChip($('#af'), show); show('all');
    });
    return head({ cr: [[X.blog.crumb]], h: X.blog.h, lead: X.blog.lead }) +
      sec(chips('af', [['all', F(X.blog.all, { n: D.articles.length })], ...tags.map(t => [t, t])]) + '<div class="arw" id="agrid" data-swap></div>', { cls: 'sec--first' }) +
      cta();
  };

  // ── Статья: содержание слева, текст по центру, услуги справа ──
  R.statya = () => {
    const a = D.articles.find(x => x.id === qs.get('id')) || D.articles[0], tx = T.articles[a.id], A0 = X.statya;
    document.title = F(X.titleTpl, { t: a.t });
    const more = D.articles.filter(x => x !== a).slice(0, 3);
    const words = (tx.lead + tx.body.flat().join(' ')).split(/\s+/).length, min = Math.max(2, Math.ceil(words / 160));
    after.push(() => {
      // содержание подсвечивает раздел, который сейчас читают
      const links = $$('.toc2 a'), hs = links.map(l => $(l.getAttribute('href')));
      const spy = () => { let k = 0; hs.forEach((h, i) => { if (h.getBoundingClientRect().top < innerHeight * .4) k = i; }); links.forEach((l, i) => l.classList.toggle('is-on', i === k)); };
      addEventListener('scroll', spy, { passive: true }); spy();
    });
    return `<section class="pgh"><div class="wrap2">${crumbs([[X.blog.crumb, 'blog.html'], [a.tag]])}
        <div class="ath">
          <div class="ath-m">${badge(a.tag)}<time>${a.date}</time><span>${min} ${A0.min}</span></div>
          <h1 class="h1x">${a.t}</h1>
          <p class="ath-p">${tx.lead}</p>
        </div></div></section>` +
      sec(`<div class="atc">${C.pic(a.img, 'alt="" data-par')}</div>
        <div class="atb">
          <aside class="toc2"><p class="side-k">${X.toc}</p><ol>${tx.body.map(([h], k) => `<li><a href="#p${k}" data-off="110"><span class="num">${pad(k + 1)}</span>${h}</a></li>`).join('')}</ol></aside>
          <div class="prose2">${tx.body.map(([h, p], k) => `<h2 id="p${k}">${h}</h2>${String(p).split(/\n\s*\n/).map(x => `<p>${x.replace(/\n/g, '<br>')}</p>`).join('')}`).join('')}
            <div class="prose2-cta" data-card><div><b>${A0.ctaT}</b><p>${A0.ctaP}</p></div>${lb(BT.statyaAsk, 'fb--dark', a)}</div>
          </div>
          <aside class="ats"><p class="side-k">${A0.svc}</p>${S.slice(0, 4).map((s, k) => `<a class="sv-link sv-link--sm" href="usluga.html?id=${s.id}"><span class="mx-im"><img src="img/${s.img}.webp" alt="" loading="lazy" decoding="async"></span><span class="mx-tx"><i>${pad(k + 1)}</i><b>${s.cardT}</b><small>${D.cost(s)}</small></span>${AR}</a>`).join('')}
            ${fb(X.allSvc, { href: 'uslugi.html', cls: 'fb--sm' })}</aside>
        </div>`, { cls: 'sec--first' }) +
      sec(sh(A0.moreBadge, A0.moreH, fb(X.allArts, { href: 'blog.html', cls: 'fb--sm' })) + `<div class="arg">${more.map(x => C.arc(x, '', true)).join('')}</div>`) +
      cta();
  };

  // ── Политика и согласие: содержание слева (как у статьи), текст, справа — вопросы и второй документ ──
  const legal = id => {
    const L = window.OG_LEGAL(D)[id], other = id === 'politika' ? [X.legal.soglasie, 'soglasie.html'] : [X.legal.politika, 'politika.html'];
    document.title = F(X.titleTpl, { t: L.crumb });
    after.push(() => {
      // телефон: содержание документа свёрнуто в строку «Содержание · N разделов», раскрывается касанием —
      // иначе до текста пришлось бы листать полэкрана пунктов
      if (U.MOB && U.MOB.matches) {
        const toc = $('.toc2'), k = $('.side-k', toc);
        k.setAttribute('role', 'button'); k.tabIndex = 0; k.setAttribute('aria-expanded', 'false'); k.dataset.n = L.secs.length;
        const flip = () => { const on = !toc.classList.contains('is-open'); toc.classList.toggle('is-open', on); k.setAttribute('aria-expanded', on); };
        k.addEventListener('click', flip); k.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
      }
      const links = $$('.toc2 a'), hs = links.map(l => $(l.getAttribute('href')));
      const spy = () => { let k = 0; hs.forEach((h, i) => { if (h.getBoundingClientRect().top < innerHeight * .4) k = i; }); links.forEach((l, i) => l.classList.toggle('is-on', i === k)); };
      addEventListener('scroll', spy, { passive: true }); spy();
    });
    return `<section class="pgh"><div class="wrap2">${crumbs([[L.crumb]])}
        <div class="ath">
          <div class="ath-m">${badge(X.legal.badge)}<time>${X.legal.ed}${D.legal.date}</time></div>
          <h1 class="h1x">${L.h}</h1>
          <p class="ath-p">${L.lead}</p>
        </div></div></section>` +
      sec(`<div class="atb lgb">
          <aside class="toc2"><p class="side-k">${X.toc}</p><ol>${L.secs.map(([h], k) => `<li><a href="#p${k}" data-off="110"><span class="num">${pad(k + 1)}</span>${h}</a></li>`).join('')}</ol></aside>
          <div class="prose2 lg">${L.secs.map(([h, b], k) => `<h2 id="p${k}"><span class="num">${pad(k + 1)}</span>${h}</h2>${b}`).join('')}</div>
          <aside class="ats lg-as"><p class="side-k">${X.legal.asK}</p><p class="lg-as-p">${X.legal.asP}</p><a class="lg-as-m" href="mailto:${D.email}">${D.email}</a>
            <p class="side-k">${X.legal.other}</p>${fb(other[0], { href: other[1], cls: 'fb--sm' })}</aside>
        </div>`, { cls: 'sec--first' });
  };
  R.politika = () => legal('politika');
  R.soglasie = () => legal('soglasie');

  // ── Библиотека: папки, как на главной; последняя ячейка — «Не нашли документ?» ──
  const ask = (t = X.lib.askT, d = X.lib.askD) => `<button class="lb-ask" data-open="form" data-q="${D.esc(X.lib.askQ)}"><span class="lb-ask-i"><i></i></span><b>${t}</b><span>${d}</span></button>`;
  R.biblioteka = () => {
    const part = (c, last) => {
      const list = D.books.filter(b => b.cat === c.id);
      return `<div class="lb-cat lb-cat--${c.id}"><h2 class="lb-h"><i></i>${c.t}<span class="num">${list.length || ''}</span></h2><div class="lib-grid lbx">${list.map(C.book).join('')}${list.length ? (last ? ask() : '') : ask(X.lib.emptyT, X.lib.emptyD)}</div></div>`;
    };
    const start = D.bookCat(qs.get('cat')) ? qs.get('cat') : 'all';
    after.push(() => {
      const grid = $('#bgrid'), show = v => swap(grid, (v === 'all' ? D.bookCats : [D.bookCat(v)]).map((c, i, a) => part(c, c === a.filter(x => D.books.some(b => b.cat === x.id)).pop())).join(''));
      onChip($('#bf'), show); show(start);
      $$('#bf .chip2').forEach(x => x.classList.toggle('is-on', x.dataset.f === start));
    });
    return head({ cr: [[X.lib.crumb]], h: X.lib.h, lead: X.lib.lead }) +
      sec(chips('bf', [['all', F(X.lib.all, { n: D.books.length })], ...D.bookCats.map(c => [c.id, c.short])]) + '<div class="lbw" id="bgrid" data-swap></div>', { cls: 'sec--first' }) +
      cta();
  };

  // ── Документ ──
  R.kniga = () => {
    const b = D.books.find(x => x.id === qs.get('id')) || D.books[0];
    document.title = F(X.titleTpl, { t: b.t });
    const svcs = S.filter(s => s.norms.some(n => findBook(n) === b));
    const K0 = X.kniga, book = /Учебник|Справочник/.test(b.kind), status = b.status || (book ? K0.stBook : K0.stOk);
    // обложка крупно: у нарисованной — внизу дата и вид документа
    const cover = C.cover(b, 8);
    return `<section class="pgh bkh"><div class="wrap2">${crumbs([[X.lib.crumb, 'biblioteka.html'], [b.num]])}
        <div class="bkh-g">
          <div class="bkh-v${book ? ' bkh-v--book' : ''}"><div class="bkh-doc">${book ? '<i class="bk-e"></i>' : '<i class="bk-s"></i><i class="bk-s"></i>'}<div class="bk-p">${cover}</div></div></div>
          <div class="bkh-r">
            ${badge(b.kind)}
            <h1 class="h1x h1x--md">${b.t}</h1>
            ${dl([[K0.num, b.num], [K0.date, b.date], [K0.status, `<span class="st-ok">${status}</span>`]])}
            <p class="bkh-p">${b.d}</p>
            ${b.news ? `<p class="bkh-new"><i></i>${b.news}</p>` : ''}
            ${svcs.length ? `<div class="bkh-svc"><p class="side-k">${K0.svc}</p><div class="tag-links">${svcs.map(s => `<a href="usluga.html?id=${s.id}">${s.cardT}${AR}</a>`).join('')}</div></div>` : ''}
            <div class="pgh-act">${fb(K0.pdf, { href: b.pdf || '#', blank: !!b.pdf, cls: 'fb--red' })}${lb(BT.knigaAsk, '', b)}</div>
            <p class="bkh-note">${K0.note}</p>
          </div>
        </div></div></section>` +
      sec(sh(K0.moreBadge, K0.moreH, fb(K0.all, { href: 'biblioteka.html', cls: 'fb--sm' })) + `<div class="lib-grid lbx">${D.books.filter(x => x !== b).slice(0, 5).map(C.book).join('')}</div>`, { cls: 'sec--first' }) +
      cta();
  };

  // ── Контакты: строки контактов слева, форма справа; ниже — как работаем с регионами: карта и тёмная карточка этапов ──
  // у этапа — куда идёт обмен: от заказчика в Москву (in), туда и обратно (both), из Москвы заказчику (out); n — сколько отметок
  const REMOTE = X.kontakty.remote.map(x => [x.t, x.p, x.dir, +x.n || 1]);
  // этапы сменяются раз в STEP мс (наведение держит этап); на карте этап — обмен с одним из дальних городов:
  // по его дуге летят отметки, на прилёте город или Москва вспыхивают кольцом. Город меняется с каждым кругом.
  // Всё идёт, только пока блок на экране
  const remote = g => {
    const st = $('.rmt-st', g), items = $$('li', st), svg = $('.map-svg', g), STEP = 3600, FLY = 1300;
    if (!svg || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const routes = $$('.rt-on', svg).map(p => ({ p, L: p.getTotalLength(), i: +p.dataset.i })).sort((a, b) => b.L - a.L).slice(0, 8);
    const city = i => $(`.city[data-i="${i}"]`, svg), ping = el => { el.classList.remove('is-ping'); void el.getBoundingClientRect(); el.classList.add('is-ping'); };
    const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const fly = (r, back, delay) => setTimeout(() => {
      // отметка: красная точка с белым ободком в мягком красном ореоле
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'g'), t0 = performance.now();
      dot.setAttribute('class', 'rmt-pk'); dot.innerHTML = '<circle class="rmt-pk-h" r="11"/><circle r="4.6"/>'; svg.append(dot);
      const go = now => { const k = Math.min(1, (now - t0) / FLY), pt = r.p.getPointAtLength(r.L * (back ? 1 - ease(k) : ease(k)));
        dot.setAttribute('transform', `translate(${pt.x.toFixed(1)},${pt.y.toFixed(1)})`);
        if (k < 1) requestAnimationFrame(go); else { dot.remove(); ping(back ? city(0) : city(r.i)); } };
      requestAnimationFrame(go);
    }, delay);
    let k = -1, ri = -1, timer = 0, live = false, hold = false;
    const show = n => {
      if (n === 0 || ri < 0) { routes[ri] && routes[ri].p.classList.remove('is-on'); ri = (ri + 1) % routes.length; routes[ri].p.classList.add('is-on'); }
      k = n; items.forEach((li, j) => li.classList.toggle('is-on', j === k));
      const [, , dir, cnt] = REMOTE[k], r = routes[ri];
      if (dir === 'both') { fly(r, false, 150); fly(r, true, 150 + FLY + 250); }
      else for (let j = 0; j < cnt; j++) fly(r, dir === 'in', 150 + j * 260);
    };
    const tick = () => { clearTimeout(timer); if (!live || hold) return; show((k + 1) % REMOTE.length); timer = setTimeout(tick, STEP); };
    st.style.setProperty('--step', STEP + 'ms'); st.classList.add('is-run');
    new IntersectionObserver(([e]) => { live = e.isIntersecting; if (live && !hold) { k = (k < 0 ? -1 : k - 1); tick(); } else clearTimeout(timer); }, { threshold: .35 }).observe(g);
    items.forEach((li, j) => li.addEventListener('mouseenter', () => { hold = true; st.classList.add('is-hold'); clearTimeout(timer); if (j !== k) show(j); }));
    st.addEventListener('mouseleave', () => { hold = false; st.classList.remove('is-hold'); timer = setTimeout(tick, STEP); });
  };
  R.kontakty = () => {
    after.push(() => {
      // свечение городов и пульсы на карте идут, только пока блок на экране
      const g = $('#geo'); if (!g) return;
      new IntersectionObserver(([e]) => g.classList.toggle('is-live', e.isIntersecting)).observe(g);
      remote(g);
    });
    const K1 = X.kontakty;
    return head({ cr: [[K1.crumb]], h: K1.h, lead: K1.lead }) +
      sec(`<div class="cnt">
          <div class="cnt-l">
            <div class="cnt-row"><p class="side-k">${K1.telK}</p><div class="cnt-tel"><div><a class="cnt-big" href="${D.phoneHref}">${D.phone}</a><p class="cnt-s">${D.hours}</p></div>${U.qr(D.phoneHref)}</div></div>
            <div class="cnt-row"><p class="side-k">${K1.mailK}</p><div><a class="cnt-mid" href="mailto:${D.email}">${D.email}</a><p class="cnt-s">${K1.mailS}</p></div></div>
            <div class="cnt-row"><p class="side-k">${K1.msgK}</p><div>${U.msgBlock(['max', 'tg'])}</div></div>
            <div class="cnt-row cnt-row--3">
              ${K1.cells.map(x => `<div><p class="side-k">${x.k}</p><p class="cnt-v">${x.v}</p><p class="cnt-s">${x.s}</p></div>`).join('\n              ')}
            </div>
          </div>
          <div class="cnt-f"><p class="mdl-t">${K1.formT}</p><p class="mdl-s">${K1.formS}</p>${U.formHTML({ ql: K1.formQl, form: 'contacts' })}</div>
        </div>`, { cls: 'sec--first' }) +
      sec(sh(K1.rmBadge, K1.rmH, `<p>${K1.rmP}</p>`) +
        `<div class="rmt">
          <div class="rmt-map">
            <p class="rmt-lg"><span><i class="lg-dot"></i>${F(K1.lgA, { n: D.cities.length })}</span><span><i class="lg-ring"></i>${K1.lgB}</span></p>
            <div class="map gst-map rv">${window.OG_MAP && C.mapSVG ? C.mapSVG() : ''}</div>
            <p class="rmt-sum"><strong>${D.about.facts[0].n}</strong><span>${D.about.facts[0].t}</span></p>
          </div>
          <div class="rmt-st"><p class="side-k">${K1.stK}</p>
            <ol>${REMOTE.map(([t, p], k) => `<li><span class="num">${pad(k + 1)}</span><div><h3>${t}</h3><p>${p}</p></div><i class="rmt-bar"></i></li>`).join('')}</ol></div>
        </div>`, { id: 'geo' });
  };

  const notFound = () => head({ cr: [[X.nf.crumb]], h: X.nf.h, lead: X.nf.lead, act: fb(X.nf.btn, { href: 'index.html', cls: 'fb--red' }) });

  main.innerHTML = (R[kind] || notFound)();
  after.forEach(f => f());
  U.bindForms(main);
})();
