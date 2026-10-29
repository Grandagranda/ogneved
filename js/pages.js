// Внутренние страницы (ПК) — в языке главной (Figma «home»): шапка раздела с крошками и крупным заголовком с серым хвостом,
// блоки на линиях рамки с крестиками, плашки без подложки, карточки и формы главной, кнопки со стрелкой-уголком.
// Фон блоков чередуется: шапка страницы — цвета первого экрана, дальше белый и тонированный по очереди.
(function () {
  const D = window.OG, U = window.OG_UI, C = window.OG_C, T = window.OG_TEXT, $ = U.$, $$ = U.$$;
  const main = $('#page'), kind = main.dataset.page, qs = new URLSearchParams(location.search);
  const AR = C.AR, pad = C.pad, S = C.order.map(D.svc);
  const after = [];

  // ── общие детали ──
  const crumbs = list => `<nav class="crb" aria-label="Хлебные крошки"><a href="index.html">Главная</a>${list.map(([t, h]) => h ? `<a href="${h}">${t}</a>` : `<span aria-current="page">${t}</span>`).join('')}</nav>`;
  const badge = t => `<p class="badge badge--flat"><i></i>${t}</p>`;
  const fb = (t, o = {}) => {
    const cls = `fb${o.cls ? ' ' + o.cls : ''}`, inner = `<span>${t}</span>${AR}`;
    if (o.href) return `<a class="${cls}" href="${o.href}">${inner}</a>`;
    return `<button class="${cls}"${o.open ? ` data-open="${o.open}"` : ''}${o.q ? ` data-q="${o.q}"` : ''}${o.svc ? ` data-svc="${o.svc}"` : ''}>${inner}</button>`;
  };
  // шапка блока, как на главной: плашка, заголовок с серым хвостом, справа — пояснение или кнопка
  const sh = (b, h, r = '', cls = '') => `<div class="sh${cls ? ' ' + cls : ''}">${badge(b)}<h2 class="h2x">${h}</h2>${r ? `<div class="sh-r">${r}</div>` : ''}</div>`;
  // цифры шапки страницы — как ряд цифр «О нас» на главной, только мельче
  const facts = list => `<ul class="pgf">${list.map(([n, t], i) => `<li><span class="num">${pad(i + 1)}</span><b>${String(n).replace(/^от(&nbsp;|\s)/, '<small>от</small>')}</b><p>${t}</p></li>`).join('')}</ul>`;
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
  const cta = (h = 'Нужен расчёт<br><span class="g">для вашего объекта?</span>') => sec(`
      <div class="ctx">
        <div class="ctx-l">${badge('Консультация')}<h2 class="h2x">${h}</h2></div>
        <div class="ctx-r"><a class="ctx-tel" href="${D.phoneHref}">${D.phone}</a><small>${D.hours}</small></div>
      </div>
      <div class="ctx-f"><h3 class="hf-t"><em>Бесплатная консультация</em> за&nbsp;15&nbsp;минут</h3><p class="hf-s">Оставьте заявку и&nbsp;мы&nbsp;подберём подходящее решение под ваш объект</p>${U.formRow()}</div>`, { cls: 'pg-cta' });
  const findBook = n => D.books.find(b => n.includes(b.num.replace('№ ', '')) || n.includes(b.t) || b.num.includes(n.replace('СП ', '')));
  const chips = (id, list) => `<div class="chips2" id="${id}">${list.map(([v, t], k) => `<button class="chip2${k ? '' : ' is-on'}" data-f="${v}">${t}</button>`).join('')}</div>`;
  // перерисовка списка по фильтру: старые карточки уходят, новые появляются (motion.js — [data-swap])
  const swap = (box, html) => { box.classList.add('is-swap'); setTimeout(() => { box.innerHTML = html; box.classList.remove('is-swap'); }, box.children.length ? 260 : 0); };
  const onChip = (bar, f) => bar.addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; $$('.chip2', bar).forEach(x => x.classList.toggle('is-on', x === b)); f(b.dataset.f); });
  const works = list => { const sp = C.wkSpans(list.length); return list.map((w, k) => C.wkc(w, '', `grid-column:span ${sp[k]}`)).join(''); };
  const R = {};

  // ── Услуги ──
  // ситуации заказчика → документ, который её закрывает
  const PICK = [
    ['Проезды на&nbsp;участке не&nbsp;совпадают с&nbsp;требованиями свода правил', 'opp'],
    ['Экспертиза запросила обоснование доступа пожарной техники', 'opp'],
    ['Гарнизон требует план тушения пожара для объекта', 'ptp'],
    ['Нужно обосновать меньший объём пожарного резервуара', 'voda'],
    ['На&nbsp;участке нет централизованного водопровода', 'voda'],
    ['Пожарные части не&nbsp;успевают к&nbsp;объекту за&nbsp;нормативное время', 'dislokaciya'],
    ['Предприятие обязано содержать собственную пожарную охрану', 'chislennost'],
    ['Нужно проверить, хватит ли сил гарнизона для тушения', 'sily'],
  ];
  R.uslugi = () => {
    after.push(() => { C.eqSc($('#svc')); window.OG_CALC($('#calc')); });
    return head({ cr: [['Услуги']], h: 'Услуги <span class="g">в&nbsp;области<br>пожаротушения</span>',
        lead: 'Разрабатываем расчёты и&nbsp;проектную документацию, которые подтверждают: пожарные подразделения смогут подъехать к&nbsp;объекту, получить воду и&nbsp;потушить пожар.',
        act: fb('Бесплатная консультация', { cls: 'fb--red', open: 'form', q: 'Подобрать услугу' }) + fb('Рассчитать стоимость', { open: 'calc' }),
        facts: [['6', 'направлений — от&nbsp;проездов до&nbsp;численности пожарной охраны'], ['от&nbsp;30&nbsp;000&nbsp;₽', 'стоимость документа, фиксируем в&nbsp;договоре'], ['3–15', 'рабочих дней на&nbsp;разработку'], [D.about.facts[0].n, 'выполненных проектов с&nbsp;2012 года']] }) +
      sec(`<div class="scx" id="svc">${S.map((s, i) => C.sc(s, i, S.length)).join('')}</div>`, { cls: 'sec--first' }) +
      sec(`<div class="pk">
          <div class="pk-l">${badge('Подбор документа')}<h2 class="h2x">Какой документ <span class="g">нужен объекту</span></h2>
            <p class="pk-s">Найдите свою ситуацию — покажем, какой расчёт её&nbsp;закрывает. Не&nbsp;нашли&nbsp;— подскажем бесплатно.</p>
            ${fb('Задать вопрос', { cls: 'fb--dark', open: 'form', q: 'Какой документ нужен моему объекту?' })}</div>
          <ol class="pk-list">${PICK.map(([t, id], i) => `<li><a class="pk-i" href="usluga.html?id=${id}"><span class="num">${pad(i + 1)}</span><b>${t}</b><span class="pk-to"><span class="pk-im"><img src="img/s-${id}.webp" alt="" loading="lazy"></span>${D.svc(id).cardT}</span>${AR}</a></li>`).join('')}</ol>
        </div>`) +
      sec(sh('Стоимость', 'Сколько стоит <span class="g">проект</span>', '<p>Ответьте на&nbsp;шесть вопросов — посчитаем ориентировочную стоимость и&nbsp;срок. Точную цену назовём после просмотра исходных данных.</p>') +
        '<div class="calc-wrap" id="calc"></div>', { id: 'price' }) +
      cta();
  };

  // ── Страница услуги ──
  // «Когда нужен» — чистые карточки на белом, как в блоке «Исходные данные»: у каждой ситуации своя линейная иконка
  // (js/when-ic.js), номер и текст; последняя — пунктирная «Не уверены, нужен ли документ?»
  const whenCards = s => sh('Когда нужен', 'Когда нужен <span class="g">этот документ</span>') +
    `<ul class="fls wn-ls" style="--n:${s.when.length + 1}">${s.when.map((t, k) => `<li class="fl wn-c" style="--k:${k}"><span class="wn-ic">${((window.OG_WIC || {})[s.id] || [])[k] || ''}</span><span class="num">${pad(k + 1)}</span><b>${t}</b></li>`).join('')}
      <li><button class="fl fl--add" data-open="form" data-q="Нужен ли документ «${s.cardT}» для моего объекта?"><span class="fl-plus"></span><b>Не&nbsp;уверены, нужен ли документ?</b><small>Пришлите данные объекта — бесплатно проверим и&nbsp;подскажем</small></button></li></ul>`;
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
        <div class="gnt-r gnt-hd"><p class="side-k">Этап работ</p><ol class="gnt-days" aria-hidden="true">${[...Array(B)].map((_, d) => `<li style="--x:${d}">${pad(d + 1)}</li>`).join('')}</ol><p class="gnt-end">Сдача</p></div>
        <ol class="gnt-ls">${s.includes.map((t, k) => `<li class="gnt-r" style="--a:${sp[k][0]};--b:${sp[k][1]}"><p class="gnt-t"><span class="num">${pad(k + 1)}</span><b>${t}</b></p><span class="gnt-c"><i class="gnt-bar"><em>${dur(sp[k][1] - sp[k][0])}</em></i></span></li>`).join('')}</ol>
        <div class="gnt-r gnt-ft">${fb('Рассчитать для своего объекта', { cls: 'fb--sm', open: 'calc', svc: s.id })}<p class="gnt-pdf"><i></i>${/бумажн/i.test(s.result) ? 'Бумага и&nbsp;PDF' : 'PDF с&nbsp;подписью'}</p></div>
      </div>`;
  };
  // исходные данные — карточками файлов: чертежи присылают в .dwg/.pdf, сведения — в .pdf/.doc
  const extOf = t => /план|схем|разрез|проект|фасад|застройк/i.test(t) ? ['dwg', 'pdf'] : ['pdf', 'doc'];
  R.usluga = () => {
    const s = D.svc(qs.get('id')) || S[0], i = S.indexOf(s), FX = window.OG_FX || {};
    document.title = s.cardT + ' — ОГНЕВЕД';
    const wk = D.works.filter(w => w.s === s.id);
    const others = [1, 2, 3].map(k => S[(i + k) % S.length]);
    after.push(() => {
      setTimeout(() => $('.svh-art').classList.add('is-play'), 900); $('#svc') && C.eqSc($('#svc'));
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
        ${crumbs([['Услуги', 'uslugi.html'], [s.cardT]])}
        <div class="svh-g">
          <div class="svh-l">
            ${badge(`Услуга ${pad(i + 1)} / ${pad(S.length)}`)}
            <h1 class="h1x">${s.cardT.replace(/\s*(\([^)]+\))$/, (m, a) => ` <span class="g">${a}</span>`)}</h1>
            <p class="svh-doc">${s.cardD}</p>
            <p class="svh-p">${s.lead}</p>
            <div class="pgh-act">${fb('Заказать документ', { cls: 'fb--red', open: 'form', q: 'Услуга: ' + s.short })}${fb('Рассчитать стоимость', { open: 'calc', svc: s.id })}</div>
          </div>
          <div class="svh-art sc" data-fx="${s.id}">
            <div class="sc-art"><img class="sc-im" src="img/s-${s.id}.webp" alt="${s.cardT}">${FX[s.id] ? `<svg class="sc-fx" viewBox="0 0 ${FX.W} ${FX.H}" aria-hidden="true">${FX[s.id]}</svg>` : ''}</div>
            <span class="sc-n">${pad(i + 1)} / ${pad(S.length)}</span><span class="sc-d">${s.days} раб. дней</span>
          </div>
        </div>
        ${facts([['от&nbsp;' + D.rub(s.price), 'стоимость — фиксируем в&nbsp;договоре до&nbsp;начала работ'], [s.days, 'рабочих дней с&nbsp;момента получения исходных данных'], ['PDF', 'с&nbsp;подписью исполнителя — прикладывают к&nbsp;проекту'], [String(s.norms.length), 'нормативных документа в&nbsp;основе расчёта']])}
      </div></section>` +
      sec(whenCards(s), { cls: 'sec--first' }) +
      sec(sh('Состав работ', 'Что входит <span class="g">в&nbsp;работу</span>', `<p>${planNote(s)}</p>`, 'sh--line') + plan(s)) +
      sec(`<div class="io">
          <div class="io-c io-in"><div class="io-top">${badge('Исходные данные')}<h3 class="io-h">Что нужно от&nbsp;вас</h3>
            <p class="io-s">Пришлите, что есть, — точный список уточним после первого звонка</p></div>
            <ul class="fls">${s.input.map((t, k) => `<li class="fl"><span class="num">${pad(k + 1)}</span><span class="fl-x">${extOf(t).map(e => `<i>${e}</i>`).join('')}</span><b>${t}</b></li>`).join('')}
              <li><button class="fl fl--add" data-open="form" data-q="Не хватает исходных данных: ${s.short}"><span class="fl-plus"></span><b>Не&nbsp;хватает данных?</b><small>Запросим сведения о&nbsp;частях, отрисуем планы и&nbsp;фасады в&nbsp;.dwg</small></button></li></ul></div>
          <div class="io-c io-c--dark">${badge('Результат')}<h3 class="io-h">Что вы получите</h3><p class="io-p">${s.result}</p>
            <div class="io-nr"><p class="io-k">Нормативная база</p><div class="io-chips">${s.norms.map(n => { const b = findBook(n); return b ? `<a href="kniga.html?id=${b.id}">${n}${AR}</a>` : `<span>${n}</span>`; }).join('')}</div></div></div>
        </div>`) +
      (wk.length ? sec(sh('Примеры', 'Выполненные <span class="g">проекты</span>', fb('Все проекты', { href: 'raboty.html', cls: 'fb--sm' })) + `<div class="wkx">${works(wk.slice(0, 2))}</div>`) : '') +
      sec(sh('Услуги', 'Другие <span class="g">документы</span>', fb('Все услуги', { href: 'uslugi.html', cls: 'fb--sm' })) + `<div class="scx" id="svc">${others.map(x => C.sc(x, S.indexOf(x), S.length)).join('')}</div>`) +
      cta();
  };

  // ── Наши работы ──
  R.raboty = () => {
    const used = S.filter(s => D.works.some(w => w.s === s.id));
    after.push(() => {
      const grid = $('#wgrid'), show = v => swap(grid, works(D.works.filter(w => v === 'all' || w.s === v)));
      onChip($('#wf'), show); show('all');
    });
    return head({ cr: [['Наши работы']], h: 'Наши работы<br><span class="g">по&nbsp;всей России</span>',
        lead: 'Проекты для жилых домов, складов, производств, мостов и&nbsp;гидроэлектростанций. Стоимость и&nbsp;сроки указаны как «основная работа + дополнительные услуги».',
        act: fb('Обсудить проект', { cls: 'fb--red', open: 'form', q: 'Обсудить проект' }),
        facts: [[D.about.facts[0].n, 'выполненных проектов с&nbsp;2012 года'], [String(D.cities.length), 'городов и&nbsp;регионов на&nbsp;карте работ'], [D.about.facts[1].n, D.about.facts[1].t], [D.about.facts[2].n, D.about.facts[2].t]] }) +
      sec(chips('wf', [['all', `Все проекты · ${D.works.length}`], ...used.map(s => [s.id, s.short])]) + '<div class="wkx" id="wgrid" data-swap></div>', { cls: 'sec--first' }) +
      cta('Нужен похожий<br><span class="g">проект?</span>');
  };

  // ── Страница проекта ──
  R.rabota = () => {
    const w = D.works.find(x => x.id === qs.get('id')) || D.works[0], s = D.svc(w.s), tx = T.work[w.s] || T.work.opp;
    document.title = w.obj + ' — ОГНЕВЕД';
    const others = D.works.filter(x => x !== w).sort((a, b) => (b.s === w.s) - (a.s === w.s)).slice(0, 2);
    const text = [['Задача', tx[0]], ['Что сделали', tx[1]], ['Результат', tx[2]]];
    return head({ cr: [['Наши работы', 'raboty.html'], [w.obj]], badge: w.type, h: w.obj,
        dl: [['Регион', w.city], ['Стоимость', `${w.cost} тыс.&nbsp;₽`], ['Срок', `${w.days} ${C.dn(w.days)}`], ['Тип объекта', D.objects.find(o => o.id === w.o).t]] }) +
      sec(`<div class="wph"><img src="img/${w.img}.webp" alt="${w.obj}" data-par></div>
        <div class="wpb">
          <div class="wpb-main">${text.map(([t, p], k) => `<div class="wpb-i"><p class="wpb-k"><span class="num">${pad(k + 1)}</span>${t}</p><div class="wpb-t"><p>${p}</p>${k === 1 && w.extra ? `<p class="wpb-x"><b>+</b>Дополнительно: ${w.extra.toLowerCase()}</p>` : ''}</div></div>`).join('')}</div>
          <aside class="wpb-side">
            <p class="side-k">Услуга</p>
            <a class="sv-link" href="usluga.html?id=${s.id}"><span class="mx-im"><img src="img/s-${s.id}.webp" alt=""></span><span class="mx-tx"><i>${pad(S.indexOf(s) + 1)}</i><b>${s.cardT}</b><small>от&nbsp;${D.rub(s.price)} · ${s.days} дней</small></span>${AR}</a>
            <div class="side-btns">${fb('Заказать похожий проект', { cls: 'fb--red', open: 'form', q: 'Похожий проект: ' + w.obj })}${fb('Рассчитать стоимость', { open: 'calc', svc: s.id })}</div>
          </aside>
        </div>`, { cls: 'sec--first' }) +
      sec(sh('Наши работы', 'Другие <span class="g">проекты</span>', fb('Все проекты', { href: 'raboty.html', cls: 'fb--sm' })) + `<div class="wkx">${works(others)}</div>`) +
      cta('Нужен похожий<br><span class="g">проект?</span>');
  };

  // ── Статьи: первая — крупно, остальные сеткой; фильтр по темам ──
  const feat = a => `<article class="arf">
      <a class="arf-img" href="statya.html?id=${a.id}" tabindex="-1"><img src="img/${a.img}.webp" alt="" data-par></a>
      <div class="arf-b">
        <div class="arf-m">${badge(a.tag)}<time>${a.date}</time></div>
        <h2><a class="cover-link" href="statya.html?id=${a.id}">${a.t}</a></h2>
        <p class="arf-d">${a.d}</p>
        <span class="fb arf-btn"><span>Читать статью</span>${AR}</span>
      </div>
    </article>`;
  // ряды по три карточки; если в хвосте осталась одна — два последних ряда становятся парами (7 = 3 + 2 + 2)
  const artGrid = list => { const sp = []; for (let n = list.length; n > 0;) { if (n === 4 || n === 2) { sp.push(...Array(n).fill(3)); n = 0; } else { const k = Math.min(3, n); sp.push(...Array(k).fill(6 / k)); n -= k; } }
    return `<div class="arg">${list.map((a, k) => C.arc(a, '').replace('<article class="arc"', `<article class="arc" style="grid-column:span ${sp[k]}"`)).join('')}</div>`; };
  R.blog = () => {
    const tags = [...new Set(D.articles.map(a => a.tag))];
    after.push(() => {
      const grid = $('#agrid');
      const show = v => { const list = D.articles.filter(a => v === 'all' || a.tag === v); swap(grid, v === 'all' ? feat(list[0]) + artGrid(list.slice(1)) : list.length < 3 ? list.map(feat).join('') : artGrid(list)); };
      onChip($('#af'), show); show('all');
    });
    return head({ cr: [['Статьи']], h: 'Статьи<br><span class="g">о&nbsp;пожаротушении</span>',
        lead: 'Простым языком о&nbsp;проездах, планах тушения, водоснабжении и&nbsp;расчётах сил и&nbsp;средств — для проектировщиков, девелоперов и&nbsp;служб эксплуатации.' }) +
      sec(chips('af', [['all', `Все статьи · ${D.articles.length}`], ...tags.map(t => [t, t])]) + '<div class="arw" id="agrid" data-swap></div>', { cls: 'sec--first' }) +
      cta();
  };

  // ── Статья: содержание слева, текст по центру, услуги справа ──
  R.statya = () => {
    const a = D.articles.find(x => x.id === qs.get('id')) || D.articles[0], tx = T.articles[a.id];
    document.title = a.t + ' — ОГНЕВЕД';
    const more = D.articles.filter(x => x !== a).slice(0, 3);
    const words = (tx.lead + tx.body.flat().join(' ')).split(/\s+/).length, min = Math.max(2, Math.ceil(words / 160));
    after.push(() => {
      // содержание подсвечивает раздел, который сейчас читают
      const links = $$('.toc2 a'), hs = links.map(l => $(l.getAttribute('href')));
      const spy = () => { let k = 0; hs.forEach((h, i) => { if (h.getBoundingClientRect().top < innerHeight * .4) k = i; }); links.forEach((l, i) => l.classList.toggle('is-on', i === k)); };
      addEventListener('scroll', spy, { passive: true }); spy();
    });
    return `<section class="pgh"><div class="wrap2">${crumbs([['Статьи', 'blog.html'], [a.tag]])}
        <div class="ath">
          <div class="ath-m">${badge(a.tag)}<time>${a.date}</time><span>${min} мин чтения</span></div>
          <h1 class="h1x">${a.t}</h1>
          <p class="ath-p">${tx.lead}</p>
        </div></div></section>` +
      sec(`<div class="atc"><img src="img/${a.img}.webp" alt="" data-par></div>
        <div class="atb">
          <aside class="toc2"><p class="side-k">Содержание</p><ol>${tx.body.map(([h], k) => `<li><a href="#p${k}" data-off="110"><span class="num">${pad(k + 1)}</span>${h}</a></li>`).join('')}</ol></aside>
          <div class="prose2">${tx.body.map(([h, p], k) => `<h2 id="p${k}">${h}</h2><p>${p}</p>`).join('')}
            <div class="prose2-cta"><div><b>Нужен расчёт для вашего объекта?</b><p>Бесплатно подскажем, какой документ потребуется, и&nbsp;назовём стоимость.</p></div>${fb('Задать вопрос', { cls: 'fb--dark', open: 'form', q: 'Вопрос по статье: ' + a.t })}</div>
          </div>
          <aside class="ats"><p class="side-k">Услуги</p>${S.slice(0, 4).map((s, k) => `<a class="sv-link sv-link--sm" href="usluga.html?id=${s.id}"><span class="mx-im"><img src="img/s-${s.id}.webp" alt="" loading="lazy"></span><span class="mx-tx"><i>${pad(k + 1)}</i><b>${s.cardT}</b><small>от&nbsp;${D.rub(s.price)}</small></span>${AR}</a>`).join('')}
            ${fb('Все услуги', { href: 'uslugi.html', cls: 'fb--sm' })}</aside>
        </div>`, { cls: 'sec--first' }) +
      sec(sh('Читать дальше', 'Другие <span class="g">статьи</span>', fb('Все статьи', { href: 'blog.html', cls: 'fb--sm' })) + `<div class="arg">${more.map(x => C.arc(x)).join('')}</div>`) +
      cta();
  };

  // ── Библиотека: папки, как на главной; последняя ячейка — «Не нашли документ?» ──
  const ask = `<button class="lb-ask" data-open="form" data-q="Ищу документ: "><span class="lb-ask-i"><i></i></span><b>Не&nbsp;нашли документ?</b><span>Спросите — пришлём ссылку на&nbsp;актуальную редакцию</span></button>`;
  R.biblioteka = () => {
    const kinds = [...new Set(D.books.map(b => b.kind))];
    after.push(() => {
      const grid = $('#bgrid'), show = v => swap(grid, D.books.filter(b => v === 'all' || b.kind === v).map(C.book).join('') + ask);
      onChip($('#bf'), show); show('all');
    });
    return head({ cr: [['Библиотека']], h: 'Библиотека<br><span class="g">нормативов и&nbsp;книг</span>',
        lead: 'Законы, своды правил, приказы МЧС и&nbsp;книги, на&nbsp;которые мы&nbsp;опираемся в&nbsp;работе. Следим за&nbsp;изменениями и&nbsp;отмечаем новые редакции.' }) +
      sec(chips('bf', [['all', `Все документы · ${D.books.length}`], ...kinds.map(k => [k, k])]) + '<div class="lib-grid lbx" id="bgrid" data-swap></div>', { cls: 'sec--first' }) +
      cta();
  };

  // ── Документ ──
  R.kniga = () => {
    const b = D.books.find(x => x.id === qs.get('id')) || D.books[0];
    document.title = b.t + ' — ОГНЕВЕД';
    const svcs = S.filter(s => s.norms.some(n => findBook(n) === b));
    const book = /Учебник|Справочник/.test(b.kind), status = book ? 'Учебное издание' : 'Действует';
    // обложка крупно: у нарисованной — внизу дата и вид документа
    const cover = b.img ? `<img src="img/${b.img}.webp" alt="${b.t}">`
      : `<div class="cv cv--${b.cover.c}"><div class="cv-h">${b.cover.h}</div><div class="cv-n">${b.num}</div><div class="cv-t">${b.t}</div><div class="cv-l">${'<i></i>'.repeat(8)}</div><p class="cv-f"><span>${b.date}</span><span>${b.kind}</span></p></div>`;
    return `<section class="pgh bkh"><div class="wrap2">${crumbs([['Библиотека', 'biblioteka.html'], [b.num]])}
        <div class="bkh-g">
          <div class="bkh-v${book ? ' bkh-v--book' : ''}"><div class="bkh-doc">${book ? '<i class="bk-e"></i>' : '<i class="bk-s"></i><i class="bk-s"></i>'}<div class="bk-p">${cover}</div></div></div>
          <div class="bkh-r">
            ${badge(b.kind)}
            <h1 class="h1x h1x--md">${b.t}</h1>
            ${dl([['Номер', b.num], ['Дата', b.date], ['Статус', `<span class="st-ok">${status}</span>`]])}
            <p class="bkh-p">${b.d}</p>
            ${b.news ? `<p class="bkh-new"><i></i>${b.news}</p>` : ''}
            ${svcs.length ? `<div class="bkh-svc"><p class="side-k">Применяем в&nbsp;услугах</p><div class="tag-links">${svcs.map(s => `<a href="usluga.html?id=${s.id}">${s.cardT}${AR}</a>`).join('')}</div></div>` : ''}
            <div class="pgh-act">${fb('Скачать PDF', { href: '#', cls: 'fb--red' })}${fb('Задать вопрос по документу', { open: 'form', q: 'Вопрос по документу: ' + b.t })}</div>
            <p class="bkh-note">Документ приведён для ознакомления. Актуальную редакцию сверяйте с&nbsp;официальным источником.</p>
          </div>
        </div></div></section>` +
      sec(sh('Библиотека', 'Другие <span class="g">документы</span>', fb('Вся библиотека', { href: 'biblioteka.html', cls: 'fb--sm' })) + `<div class="lib-grid lbx">${D.books.filter(x => x !== b).slice(0, 5).map(C.book).join('')}</div>`, { cls: 'sec--first' }) +
      cta();
  };

  // ── Контакты: строки контактов слева, форма справа; ниже — как работаем с регионами: карта и тёмная карточка этапов ──
  // у этапа — куда идёт обмен: от заказчика в Москву (in), туда и обратно (both), из Москвы заказчику (out); n — сколько отметок
  const REMOTE = [
    ['Заявка', 'Звоните, пишете в&nbsp;мессенджер или оставляете заявку на&nbsp;сайте — перезваниваем за&nbsp;15&nbsp;минут', 'in', 1],
    ['Исходные данные', 'Присылаете чертежи и&nbsp;документы онлайн. Список нужного пришлём сами', 'in', 3],
    ['Договор', 'Фиксируем стоимость и&nbsp;срок, подписываем по&nbsp;ЭДО или обмениваемся сканами', 'both', 1],
    ['Документ', 'Передаём PDF с&nbsp;подписью, оригиналы — курьером в&nbsp;любой город', 'out', 1],
  ];
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
    return head({ cr: [['Контакты']], h: 'Контакты<br><span class="g">ответим за&nbsp;15&nbsp;минут</span>',
        lead: 'Работаем дистанционно по&nbsp;всей России. Позвоните, напишите в&nbsp;мессенджер или оставьте заявку&nbsp;— специалист перезвонит и&nbsp;подскажет, какой документ нужен.' }) +
      sec(`<div class="cnt">
          <div class="cnt-l">
            <div class="cnt-row"><p class="side-k">Телефон</p><div><a class="cnt-big" href="${D.phoneHref}">${D.phone}</a><p class="cnt-s">${D.hours}</p></div></div>
            <div class="cnt-row"><p class="side-k">Почта</p><div><a class="cnt-mid" href="mailto:${D.email}">${D.email}</a><p class="cnt-s">Ответим в&nbsp;течение рабочего дня</p></div></div>
            <div class="cnt-row"><p class="side-k">Мессенджеры</p><div>${U.msgBlock(['max', 'tg'])}</div></div>
            <div class="cnt-row cnt-row--3">
              <div><p class="side-k">География</p><p class="cnt-v">Москва</p><p class="cnt-s">работаем по&nbsp;всей России</p></div>
              <div><p class="side-k">Руководитель</p><p class="cnt-v">Пигусова Екатерина Михайловна</p><p class="cnt-s">исполнительный директор</p></div>
              <div><p class="side-k">Реквизиты</p><p class="cnt-v">Отправим с&nbsp;договором</p><p class="cnt-s">работаем с&nbsp;юрлицами и&nbsp;ИП</p></div>
            </div>
          </div>
          <div class="cnt-f"><p class="mdl-t">Напишите нам</p><p class="mdl-s">Опишите объект и&nbsp;задачу — подготовим предложение и&nbsp;назовём стоимость</p>${U.formHTML({ ql: 'Объект и задача' })}</div>
        </div>`, { cls: 'sec--first' }) +
      sec(sh('Работаем дистанционно', 'Из&nbsp;любого региона<br><span class="g">без поездок в&nbsp;Москву</span>', '<p>Все этапы проходят онлайн: исходные данные, договор и&nbsp;готовые документы.</p>') +
        `<div class="rmt">
          <div class="rmt-map">
            <p class="rmt-lg"><span><i class="lg-dot"></i>${D.cities.length} городов с&nbsp;нашими проектами</span><span><i class="lg-ring"></i>и&nbsp;любой другой регион</span></p>
            <div class="map gst-map rv">${window.OG_MAP && C.mapSVG ? C.mapSVG() : ''}</div>
            <p class="rmt-sum"><strong>${D.about.facts[0].n}</strong><span>${D.about.facts[0].t}</span></p>
          </div>
          <div class="rmt-st"><p class="side-k">Как проходит работа</p>
            <ol>${REMOTE.map(([t, p], k) => `<li><span class="num">${pad(k + 1)}</span><div><h3>${t}</h3><p>${p}</p></div><i class="rmt-bar"></i></li>`).join('')}</ol></div>
        </div>`, { id: 'geo' });
  };

  const notFound = () => head({ cr: [['Страница не найдена']], h: 'Такой страницы <span class="g">нет</span>',
    lead: 'Возможно, ссылка устарела. Вернитесь на&nbsp;главную или выберите раздел в&nbsp;меню.', act: fb('На главную', { href: 'index.html', cls: 'fb--red' }) });

  main.innerHTML = (R[kind] || notFound)();
  after.forEach(f => f());
  U.bindForms(main);
})();
