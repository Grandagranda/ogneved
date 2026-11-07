// Калькулятор стоимости на главной: по шагам, ответ одним нажатием — сразу следующий шаг.
// Справа «лист расчёта» как лист проекта: цена, срок, параметры объекта и состав работ заполняются по ходу.
// Коэффициенты — общие с калькулятором остальных страниц (OG_UI.calc.data).
// Шаги зависят от услуги: «Проезды» и «ПТП» — полный порядок (объект, площадь, здания, данные, срок);
// у услуг из K.vol («Расход воды», «Силы и средства») — три шага: услуга → объём (цена диапазоном из K.vol) →
// чего нет из исходных данных (галочки K.need, каждая — доплата) → заявка.
// На первых двух шагах — форма «не нашли услугу / объект»: заявка уходит отдельно (форма calc-ask).
(function () {
  const D = window.OG, U = window.OG_UI, $ = U.$, $$ = U.$$, K = D.calc, X = K.tx;
  const { AREA, BLD, KOBJ } = U.calc.data;
  const VOL = K.vol || {}, NEED = K.need || { opts: [] }, ASK = K.ask || {};
  const pad = n => String(n).padStart(2, '0');
  const num = n => Math.round(n).toLocaleString('ru-RU').replace(/\s/g, ' ');
  const r5 = v => Math.round(v / 5000) * 5000, r1 = v => Math.round(v / 1000) * 1000;
  const sv = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const dn = n => { const a = n % 10, b = n % 100; return a === 1 && b !== 11 ? 'рабочий день' : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 'рабочих дня' : 'рабочих дней'; };
  const OK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m7.5 12.5 3 3 6-6.5"/></svg>';

  // линейные значки типов объектов
  const OBJ_I = {
    logistic: sv('<path d="M3 20V9.5l9-5 9 5V20"/><path d="M7 20v-7h10v7M7 16.5h10"/>'),
    production: sv('<path d="M3 20h18M4 20v-9l5 3v-3l5 3v-3l5 3V4h2v16"/><path d="M8 17h1.5M12 17h1.5"/>'),
    admin: sv('<rect x="6" y="3" width="12" height="18" rx="1"/><path d="M9.5 7h1M13.5 7h1M9.5 10.5h1M13.5 10.5h1M9.5 14h1M13.5 14h1M11 21v-3h2v3"/>'),
    living: sv('<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5M10 20v-5h4v5"/>'),
    trade: sv('<path d="M4 9.5 5.5 4h13L20 9.5"/><path d="M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0M5.5 11.5V20h13v-8.5M10 20v-5h4v5"/>'),
    oil: sv('<ellipse cx="9" cy="7" rx="5" ry="2"/><path d="M4 7v10c0 1.1 2.2 2 5 2s5-.9 5-2V7M14 12h3.5l2.5-2.5V20"/>'),
    social: sv('<path d="M3 20h18M5 20V9.5l7-4.5 7 4.5V20"/><path d="M12 9.5v5M9.5 12h5"/>'),
    // зрелищные: чаша стадиона
    spec: sv('<ellipse cx="12" cy="8.5" rx="9" ry="3.75"/><ellipse cx="12" cy="8.5" rx="4.25" ry="1.6"/><path d="M3 8.5v6.5c0 2.1 4 3.75 9 3.75s9-1.65 9-3.75V8.5M7.5 17.9v-3M16.5 17.9v-3"/>'),
    other: sv('<rect x="4" y="4" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1"/><path d="M16.75 14v6M13.75 17h6"/>'),
  };
  // значки вариантов «Данные» и «Срок» по ключу; у новых вариантов — значок «Всё есть» / календарь
  const DI = { all: sv('<circle cx="12" cy="12" r="8.5"/><path d="m8.5 12.2 2.4 2.4 4.6-5"/>'),
    dwg: sv('<path d="M4 20 20 4M7 4H4v3M17 20h3v-3"/><rect x="4" y="4" width="16" height="16" rx="1" stroke-dasharray="2.5 2.5"/>'),
    units: sv('<path d="M4 20V9l8-5 8 5v11"/><path d="M9 20v-6h6v6"/><path d="M15 6.5V4h2.5v4"/>'),
    none: sv('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5M12 16h.01"/>') };
  // значки пунктов «Чего нет» (K.need): план участка, поэтажные планы, пожарные части, гидранты
  const NI = { plan: DI.dwg, units: DI.units,
    facades: sv('<path d="M3.5 20.5h17M5.5 20.5V8.5L12 4l6.5 4.5v12"/><path d="M8.5 11.5h2.25v2.5H8.5zM13.25 11.5h2.25v2.5h-2.25zM10.5 20.5v-3.75h3v3.75"/>'),
    floors: sv('<path d="m12 3.5 8.5 4-8.5 4-8.5-4z"/><path d="m3.5 12 8.5 4 8.5-4M3.5 16.5l8.5 4 8.5-4"/>'),
    hydr: sv('<path d="M7.5 20.5h9M9 20.5V10a3 3 0 0 1 6 0v10.5"/><path d="M7.5 10h9M12 4.5V7M6 13.5h3M15 13.5h3"/>') };
  const TI = { norm: sv('<rect x="4" y="5.5" width="16" height="14.5" rx="1.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>'),
    fast: sv('<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>') };
  const TERM = K.term.map(t => [t.v, t.t, t.m, TI[t.v] || TI.norm]);
  const AREA_T = K.area.map(a => a.t), AREA_S = [.3, .5, .75, 1, 1];
  const BLD_T = K.bld.map(b => b.t), BLD_N = [1, 3, 5];
  // типы объектов: «Другие объекты» в калькуляторе заменены «Зрелищными учреждениями» (K.spec, с подсказкой)
  const OBJS = D.objects.filter(o => o.id !== 'other').map(o => ({ id: o.id, t: o.t, k: KOBJ[o.id] }))
    .concat(K.spec ? [{ id: 'spec', t: K.spec.t, n: K.spec.n, k: +K.spec.k || 1 }] : []);
  const kObj = id => (OBJS.find(o => o.id === id) || {}).k || KOBJ.admin || 1;
  const needOf = sid => NEED.opts.filter(o => !o.only || [].concat(o.only).includes(sid));
  // текст пункта «Чего нет»: у «Анализа проездов» свой (tOpp — «в .dwg» вместо «в векторе»)
  const needT = (o, sid) => (sid === 'opp' && o.tOpp) || o.t;
  // подпись варианта с единицей: «от 800 до 2 000 м²» переносится только перед «до», числа не рвутся
  const lab = (t, u) => String(t).split(/\s(?=до\s)/).map((p, i, a) => `<span class="cx-nw">${p}${i === a.length - 1 && u ? ' ' + u : ''}</span>`).join(' ');
  // высота: набор вариантов по услуге и типу объекта; c — столбец таблицы цен. Один вариант — шаг пропускается, ответ подставляется сам
  const HG = K.height || { opts: [] }, HG_S = [.2, .4, .6, .8, 1];
  const has = (l, v) => [].concat(l || []).includes(v);
  const hList = (doc, obj) => {
    const l = has(HG.oneObj, obj) ? (HG.two || HG.opts).slice(0, 1) : doc === 'ptp' && has(HG.ptpObj, obj) && HG.ptp ? HG.ptp
      : has(HG.twoObj, obj) && HG.two ? HG.two : HG.opts;
    return l.map((o, i) => ({ t: o.t, c: o.c ?? i, k: +o.k || 1 }));
  };
  // цена по таблице (K.table — «Анализ проездов» и «ПТП»): строка = площадь × здания, столбец = высота; «-» или пусто — индивидуально
  const TB = K.table || {};
  // нефтегазовые объекты у табличных услуг: вместо площади застройки, высоты, зданий и «Чего нет» — площадь территории (цена диапазоном)
  const TERR = K.terr || null;
  const isTerr = (doc, obj) => !!TERR && has(TERR.obj, obj) && has(TB.svc, doc);
  const cell = (a, b, h) => { const row = (TB.rows || [])[a * 3 + b], m = row && String(row['h' + h] || '').match(/(\d+)\D+(\d+)/); return m ? [+m[1] * 1000, +m[2] * 1000] : null; };
  // цена «от» услуги: у трёхшаговых — нижняя граница самого малого объёма
  const from = s => VOL[s.id] ? Math.min(...VOL[s.id].opts.map(o => +o.lo)) : s.price;

  // вопросы по шагам: подписи — из админки (D.calc.steps по порядку). id — панель, k — ключ ответа
  const Q = K.steps, q = i => Q[i] || {};
  const PANELS = [
    { id: 'doc', ...q(0), c: 2, ask: 'svc',
      opts: () => D.services.filter(s => s.price).map(s => ({ v: s.id, t: s.short, m: `от ${D.rub(from(s))} · ${s.days} ${D.tx.pg.days}` })) },
    { id: 'obj', ...q(1), c: 4, ask: 'obj',
      opts: () => OBJS.map(o => ({ v: o.id, t: o.t, n: o.n, i: OBJ_I[o.id] || OBJ_I.other })) },
    { id: 'area', ...q(2), c: 4,
      opts: () => AREA_T.map((t, i) => ({ v: i, t: lab(t, 'м²'), plan: AREA_S[i] })) },
    ...(TERR ? [{ id: 'terr', t: TERR.t, q: TERR.q, h: TERR.h, c: TERR.opts.length,
      opts: () => TERR.opts.map((o, i) => ({ v: i, t: lab(o.t, 'м²'), plan: [.4, .7, 1][i] || 1 })) }] : []),
    { id: 'height', t: HG.t, q: HG.q, h: HG.h, c: 5,
      opts: () => hList().map((o, i) => ({ v: i, t: lab(o.t, 'м'), hg: HG_S[o.c] || 1 })) },
    { id: 'bld', ...q(3), c: 3,
      opts: () => BLD_T.map((t, i) => ({ v: i, t, blocks: BLD_N[i] })) },
    { id: 'term', ...q(5), c: 2,
      opts: () => TERM.map(([v, t, m, i]) => ({ v, t, m, i })) },
    ...Object.keys(VOL).map(sid =>
      ({ id: 'vol-' + sid, k: 'vol', sid, t: VOL[sid].t, q: VOL[sid].q, h: VOL[sid].h, c: 3,
        opts: () => VOL[sid].opts.map((o, i) => ({ v: i, t: o.t, m: `${num(o.lo)} – ${num(o.hi)}&nbsp;₽`, blocks: i + 1 })) })),
    // «Чего нет из исходных данных» — галочки, у каждой услуги свой набор (K.need.opts[].only)
    ...D.services.filter(s => s.price).map(s => s.id).map(sid =>
      ({ id: 'need-' + sid, k: 'need', sid, t: NEED.t, q: NEED.q, h: NEED.h, c: 2, multi: 1,
        opts: () => needOf(sid).map(o => ({ v: o.v, t: needT(o, sid), m: `${o.m} · +${num(+o.add || 0)}&nbsp;₽`, i: NI[o.v] || DI.none })) })),
  ].map(p => ({ k: p.id, ...p }));
  const PI = Object.fromEntries(PANELS.map(p => [p.id, p]));

  // нижняя граница до выбора услуги: самая низкая цена и самый короткий срок
  const P0 = Math.min(...D.services.filter(s => s.price).map(from)), DAY0 = Math.min(...D.services.map(s => parseInt(s.days, 10)).filter(n => n > 0));

  const optHTML = (o, multi) => `<button type="button" class="cx-o${o.i ? ' cx-o--ico' : ''}${o.plan || o.hg ? ' cx-o--plan' : ''}${o.hg ? ' cx-o--hg' : ''}${o.blocks ? ' cx-o--blk' : ''}${multi ? ' cx-o--multi' : ''}" data-v="${o.v}"${multi ? ' aria-pressed="false"' : ''}>
      ${o.i ? `<span class="cx-oi">${o.i}</span>` : ''}
      ${o.plan ? `<span class="cx-pl"><i style="--s:${o.plan}"></i></span>` : ''}
      ${o.hg ? `<span class="cx-hgi"><i style="--s:${o.hg}"></i></span>` : ''}
      ${o.blocks ? `<span class="cx-bl">${'<i></i>'.repeat(o.blocks)}</span>` : ''}
      <span class="cx-ot"><b>${o.t}</b>${o.m ? `<small>${o.m}</small>` : ''}</span><i class="cx-ck"></i>
      ${o.n ? `<span class="cx-in" aria-hidden="true">i</span><span class="cx-tip">${o.n}</span>` : ''}</button>`;
  // «не нашли»: телефон, что нужно, кнопка — одной строкой под вариантами
  const askHTML = k => `<form class="form cx-ask" data-form="calc-ask" data-ask="${k}" novalidate>
      <p class="cx-ask-t">${ASK[k] || ''}</p>
      <div class="cx-ask-r">
        <label class="fld"><input name="phone" type="tel" placeholder=" " autocomplete="tel" required><span>${X.phone}</span></label>
        <label class="fld cx-ask-q"><input name="q" placeholder=" " maxlength="500"><span>${ASK.ph || ''}</span></label>
        <button class="btn btn--dark" type="submit">${ASK.btn || X.btn}</button>
      </div>
      <label class="consent agr"><input type="checkbox" name="agree" required><i></i><span>${D.tx.form.agree}</span></label>
      <div class="form-ok">${OK}<div><b>${D.tx.form.okT}</b><p class="muted">${(D.forms['calc-ask'] && D.forms['calc-ask'].ok) || ASK.ok || X.ok}</p></div></div>
    </form>`;

  function calc(el) {
    const st = { step: 0, a: {} };
    // порядок шагов по выбранной услуге
    // порядок шагов: у «Проездов» и «ПТП» высота пропускается, если для типа объекта она одна (логистика)
    // нефтегаз у «Проездов» и «ПТП»: услуга → объект → территория → срок
    const flow = () => { const d = st.a.doc || 'opp';
      if (VOL[d]) return ['doc', 'vol-' + d, 'need-' + d];
      if (isTerr(d, st.a.obj)) return ['doc', 'obj', 'terr', 'term'];
      return ['doc', 'obj', 'area', ...(hList(d, st.a.obj).length > 1 ? ['height'] : []), 'bld', 'need-' + d, 'term']; };
    // в истории браузера — шаги калькулятора на странице: «назад» браузера и телефона возвращает на шаг, а не уводит со страницы.
    // В окне не пишем — там «назад» закрывает окно (слои js/ui.js)
    const inline = !el.closest('.modal'), hid = 'cx' + Math.random().toString(36).slice(2, 7);
    // hs — шаги записей истории (0 — запись до калькулятора), hn — на какой стоим
    let pushed = 0, hs = [0], hn = 0;
    el.classList.add('cx-wrap');
    el.innerHTML = `<div class="cx">
      <div class="cx-main">
        <div class="cx-stage">
          ${PANELS.map(s => `<div class="cx-q" data-id="${s.id}">
            <p class="cx-k"></p>
            <h3 class="cx-t">${s.q}</h3><p class="cx-h">${s.h}</p>
            <div class="cx-opts${s.multi ? ' cx-opts--multi' : ''}" style="--c:${s.c}">${s.opts().map(o => optHTML(o, s.multi)).join('')}</div>
            ${s.multi ? `<div class="cx-go"><button type="button" class="btn btn--red cx-gob">${X.nextStep}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button><p class="cx-gon">${X.needNone}</p></div>` : ''}
            ${s.ask ? askHTML(s.ask) : ''}</div>`).join('')}
          <div class="cx-q cx-fin" data-id="fin">
            <p class="cx-k">${X.finK}</p>
            <h3 class="cx-t">${X.finT}</h3>
            <p class="cx-h">${X.finH}</p>
            <ol class="cx-next">${X.next.map((t, i) => `<li><b>${pad(i + 1)}</b>${t}</li>`).join('')}</ol>
            <form class="form cx-form" data-form="calc" novalidate>
              <label class="fld"><input name="name" placeholder=" " autocomplete="name"><span>${D.tx.form.name}</span></label>
              <label class="fld"><input name="phone" type="tel" placeholder=" " autocomplete="tel" required><span>${X.phone}</span></label>
              <button class="btn btn--red" type="submit">${X.btn}</button>
              <label class="consent agr"><input type="checkbox" name="agree" required><i></i><span>${D.tx.form.agree}</span></label>
              <div class="form-ok">${OK}<div><b>${D.tx.form.okT}</b><p class="muted">${(D.forms.calc && D.forms.calc.ok) || X.ok}</p></div></div>
            </form>
          </div>
        </div>
        <div class="cx-nav">
          <button type="button" class="cx-back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>${X.back}</button>
          <button type="button" class="cx-reset">${X.reset}</button>
        </div>
      </div>
      <aside class="cx-sheet" aria-live="polite">
        <div class="cs-price"><small>${X.priceK}</small><b><span class="cs-lo">от ${num(P0).replace(' ', '&nbsp;')}</span><i class="cs-dash">–</i><span class="cs-hi"></span><span class="cs-cur">&nbsp;₽</span></b></div>
        <div class="cs-time"><div class="cs-trow"><small>${X.timeK}</small><b class="cs-days">—</b></div></div>
        <dl class="cs-spec">${PANELS.map(s => `<div data-id="${s.id}"><dt>${s.t}</dt><dd>—</dd></div>`).join('')}</dl>
        <div class="cs-inc"><small>${X.incK}</small><ul></ul></div>
        ${D.priceList ? `<a class="cs-pdf" href="${D.priceList}" download="${D.esc(X.pdfName)}"><span class="cs-pdf-i">PDF</span><span class="cs-pdf-t"><b>${X.pdfT}</b><small>${X.pdfS}</small></span>${U.ICO.dl}</a>` : ''}
      </aside>
    </div>`;

    const qs = $$('.cx-q', el), QE = Object.fromEntries(qs.map(x => [x.dataset.id, x])), back = $('.cx-back', el);
    const lo = $('.cs-lo', el), hi = $('.cs-hi', el), dash = $('.cs-dash', el), cur = $('.cs-cur', el), days = $('.cs-days', el);
    const spec = Object.fromEntries($$('.cs-spec > div', el).map(d => [d.dataset.id, d])), sheet = $('.cs-spec', el), inc = $('.cs-inc ul', el);
    let busy = 0, shown = { lo: P0, hi: 0 };

    // ── расчёт: неотвеченные параметры берутся по умолчанию ──
    function estimate() {
      const a = st.a, s = a.doc && D.svc(a.doc);
      if (!s) return null;
      const V = VOL[s.id];
      if (V) {
        // трёхшаговая услуга: диапазон объёма + доплаты за отмеченные пункты; к сроку — самый долгий из них
        const o = V.opts[a.vol ?? 0], ns = needOf(s.id).filter(n => (a.need || []).includes(n.v));
        const add = ns.reduce((x, n) => x + (+n.add || 0), 0), xd = Math.max(0, ...ns.map(n => +n.days || 0));
        const [d0, d1] = (String(s.days).match(/\d+/g) || [s.base, s.base + 2]).map(Number);
        return { s, lo: +o.lo + add, hi: +o.hi + add, d0: d0 + xd, d1: (d1 || d0 + 2) + xd };
      }
      const fast = a.term === (TERM[1] || [])[0], kf = fast ? +K.fast.price || 1 : 1;
      if (isTerr(s.id, a.obj)) {
        // нефтегаз: цена диапазоном по площади территории, сверху «Срочно»; срок — из карточки услуги
        const o = TERR.opts[a.terr ?? 0] || TERR.opts[0];
        let [d0, d1] = (String(s.days).match(/\d+/g) || [s.base, s.base + 2]).map(Number); d1 = d1 || d0 + 2;
        if (fast) { d0 = Math.max(2, Math.ceil(d0 * (+K.fast.time || 1))); d1 = Math.max(d0 + 1, Math.ceil(d1 * (+K.fast.time || 1))); }
        return { s, lo: r1(+o.lo * kf), hi: r1(+o.hi * kf), d0, d1 };
      }
      // «Проезды» и «ПТП» — по таблице K.table (иначе — от базовой цены коэффициентами). Сверху — отмеченные пункты «Чего нет» и «Срочно»
      const ai = Math.min(a.area ?? 0, AREA.length - 1), bi = Math.min(a.bld ?? 0, BLD.length - 1), hl = hList(s.id, a.obj), hv = hl[a.height] || hl[0];
      const ns = needOf(s.id).filter(n => (a.need || []).includes(n.v)), add = ns.reduce((x, n) => x + (+n.add || 0), 0), xd = Math.max(0, ...ns.map(n => +n.days || 0));
      const ar = AREA[ai][1], bl = BLD[bi][1], B = s.base * Math.sqrt(ar * bl);
      let d0 = Math.max(2, Math.ceil(B)) + xd;
      if (fast) d0 = Math.max(2, Math.ceil(d0 * (+K.fast.time || 1)));
      const days = { d0, d1: d0 + 2 };
      if ([].concat(TB.svc || []).includes(s.id)) {
        const c = !has(TB.skip, a.obj) && cell(ai, bi, hv.c);
        if (!c) return { s, ind: 1, ...days };
        return { s, lo: r1((c[0] + add) * kf), hi: r1((c[1] + add) * kf), ...days };
      }
      const p = (s.price * kObj(a.obj || 'admin') * ar * bl * hv.k + add) * kf;
      return { s, lo: Math.max(s.price, r5(p)), hi: r5(p * 1.2), ...days };
    }
    // число докручивается до нового значения; новый вызов отменяет предыдущий
    const tween = (node, from, to) => {
      const id = node._tw = (node._tw || 0) + 1;
      if (from === to) { node.textContent = num(to); return; }
      const t0 = performance.now(), dur = 650;
      const step = now => { if (node._tw !== id) return; const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3); node.textContent = num(from + (to - from) * e); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    // ответ панели строкой — для листа расчёта и заявки
    function said(p) {
      const a = st.a, v = a[p.k];
      if (v == null) return '';
      switch (p.k) {
        case 'doc': return (D.svc(v) || {}).short;
        case 'obj': return (OBJS.find(o => o.id === v) || {}).t;
        case 'area': return AREA_T[v] + ' м²';
        case 'bld': return BLD_T[v];
        case 'height': { const o = hList(a.doc, a.obj)[v]; return o ? o.t + ' м' : ''; }
        case 'terr': return TERR.opts[v] ? TERR.opts[v].t + ' м²' : '';
        case 'term': return (TERM.find(t => t[0] === v) || [])[1];
        case 'vol': return (VOL[p.sid].opts[v] || {}).t;
        case 'need': return v.length ? needOf(p.sid).filter(n => v.includes(n.v)).map(n => needT(n, p.sid)).join('; ') : X.allOk;
      }
      return '';
    }
    function paint() {
      const r = estimate(), F = flow();
      cur.hidden = !!(r && r.ind);
      if (r && r.ind) {
        // нет цены в таблице (сочетание с «-» или нефтегаз) — индивидуально
        lo._tw = hi._tw = 0; lo.textContent = X.ind || 'Индивидуально'; hi.textContent = ''; dash.hidden = true; shown = { lo: 0, hi: 0 };
        days.textContent = `${r.d0}–${r.d1} ${dn(r.d1)}`;
      } else if (!r) {
        lo.textContent = 'от ' + num(P0); hi.textContent = ''; dash.hidden = true; days.textContent = D.f(X.time0, { n: DAY0 });
        shown = { lo: P0, hi: 0 };
        lo._tw = hi._tw = 0; inc.innerHTML = ''; inc.dataset.svc = '';
      } else {
        dash.hidden = false;
        if (!/^\d/.test(lo.textContent)) shown = { lo: r.lo, hi: r.hi };
        tween(lo, shown.lo, r.lo); tween(hi, shown.hi || r.hi, r.hi); shown = { lo: r.lo, hi: r.hi };
        days.textContent = `${r.d0}–${r.d1} ${dn(r.d1)}`;
      }
      if (r) {
        // состав работ — из описания услуги
        if (inc.dataset.svc !== r.s.id) {
          inc.dataset.svc = r.s.id;
          inc.innerHTML = r.s.includes.slice(0, 3).map((t, i) => `<li style="--i:${i}">${t}</li>`).join('');
        }
      }
      // параметры объекта: строки только шагов текущего порядка и в его последовательности
      const fk = F.join();
      if (sheet.dataset.f !== fk) { sheet.dataset.f = fk; F.forEach(id => sheet.appendChild(spec[id])); }
      PANELS.forEach(p => {
        const row = spec[p.id], dd = row.lastElementChild, v = said(p) || '—';
        row.hidden = !F.includes(p.id);
        row.classList.toggle('is-cur', F[st.step] === p.id);
        row.classList.toggle('is-set', v !== '—');
        if (dd.textContent !== v) { dd.textContent = v; dd.title = v === '—' ? '' : v; dd.classList.remove('is-new'); void dd.offsetWidth; dd.classList.add('is-new'); }
      });
    }

    // ── шаги ──
    // вопросы до текущего уезжают влево, после — ждут справа
    function go(i, push) {
      const F = flow(), L = F.length;
      i = Math.max(0, Math.min(L, i));
      if (push && inline && i !== st.step) { hs.length = hn + 1; hs.push(i); hn++; history.pushState({ cx: i, hid, n: hn }, ''); pushed = 1; }
      st.step = i;
      const cur = i === L ? 'fin' : F[i];
      qs.forEach(x => {
        const id = x.dataset.id, k = id === 'fin' ? L : F.indexOf(id), on = id === cur;
        x.classList.toggle('is-on', on);
        x.classList.toggle('is-left', k >= 0 && k < i);
        x.inert = !on;
      });
      F.forEach((id, k) => { $('.cx-k', QE[id]).textContent = D.f(X.step, { n: pad(k + 1), all: pad(L) }); });
      back.disabled = i === 0;
      el.classList.toggle('is-fin', i === L);
      paint();
    }
    // после ответа — первый неотвеченный шаг дальше, а если всё отвечено — заявка
    function advance(i) {
      const F = flow(), ans = id => st.a[PI[id].k] != null;
      const next = F.findIndex((id, k) => k > i && !ans(id));
      go(next < 0 ? (F.every(ans) ? F.length : i + 1) : next, true);
      const f = $('.cx-q.is-on .cx-o.is-sel, .cx-q.is-on .cx-o, .cx-q.is-on input', el);
      f && f.focus({ preventScroll: true });
      // телефон: варианты идут столбиком, до нижних докручивают — если новый вопрос ушёл выше кадра, возвращаем к верху
      // калькулятора, где стоит итог (под шапку страницы или к верху листа окна)
      if (U.MOB && U.MOB.matches) {
        const qt = $('.cx-main', el).getBoundingClientRect().top, cx = $('.cx', el).getBoundingClientRect().top, sc = el.closest('.modal-sc');
        if (sc) { const d = qt - sc.getBoundingClientRect().top; if (d < 0) sc.scrollTo({ top: Math.max(0, sc.scrollTop + cx - sc.getBoundingClientRect().top), behavior: 'smooth' }); }
        else if (qt < 64) scrollTo({ top: scrollY + cx - 72, behavior: 'smooth' });
      }
    }
    // сброс ответов панели (при смене услуги с другим набором шагов)
    const clear = ids => ids.forEach(id => { $$('.cx-o.is-sel', QE[id]).forEach(o => { o.classList.remove('is-sel'); o.hasAttribute('aria-pressed') && o.setAttribute('aria-pressed', 'false'); }); note(QE[id]); });
    // подпись под галочками: сколько отмечено и на сколько дороже
    function note(x) {
      const n = $('.cx-gon', x); if (!n) return;
      const p = PI[x.dataset.id], sel = $$('.cx-o.is-sel', x).map(o => o.dataset.v), sum = needOf(p.sid).filter(o => sel.includes(o.v)).reduce((s, o) => s + (+o.add || 0), 0);
      n.textContent = sel.length ? D.f(X.needSel, { n: sel.length, sum: num(sum) }) : X.needNone;
    }
    // выбор: отметка → короткая пауза, чтобы было видно выбор → следующий шаг (или первый неотвеченный).
    // Галочки (multi) только отмечаются, дальше — кнопкой «Следующий шаг»
    function pick(btn) {
      const x = btn.closest('.cx-q'), p = PI[x.dataset.id], i = flow().indexOf(p.id);
      if (p.multi) {
        const on = btn.classList.toggle('is-sel'); btn.setAttribute('aria-pressed', on);
        st.a.need = $$('.cx-o.is-sel', x).map(o => o.dataset.v);
        note(x); paint(); return;
      }
      if (busy) return;
      const v = /^\d+$/.test(btn.dataset.v) ? +btn.dataset.v : btn.dataset.v;
      $$('.cx-o', x).forEach(o => o.classList.toggle('is-sel', o === btn));
      if (p.k === 'doc' && st.a.doc !== v) newDoc(v);
      st.a[p.k] = v;
      if (p.k === 'obj' || p.k === 'doc') syncHeight();
      paint();
      busy = setTimeout(() => { busy = 0; advance(i); }, 380);
    }
    // другая услуга — свой набор «Чего нет» (и объём у трёхшаговых): эти ответы сбрасываются
    function newDoc(v) {
      delete st.a.need; clear(PANELS.filter(z => z.sid).map(z => z.id));
      if (VOL[st.a.doc] || VOL[v]) delete st.a.vol;
    }
    // высоты под услугу и тип объекта: варианты перестраиваются, сетка по их числу; другой набор — ответ сбрасывается;
    // единственный вариант отвечается сам
    function syncHeight() {
      const x = QE.height; if (!x) return;
      const l = hList(st.a.doc, st.a.obj), key = l.map(o => o.t + '/' + o.c).join('|'), box = $('.cx-opts', x);
      if (box.dataset.key !== key) {
        box.dataset.key = key;
        box.innerHTML = l.map((o, i) => optHTML({ v: i, t: lab(o.t, 'м'), hg: HG_S[o.c] || 1 })).join('');
        box.setAttribute('style', '--c:' + Math.max(2, l.length));
        delete st.a.height; st.hAuto = 0;
      }
      // подставленная сама высота (логистика) — не ответ клиента: у другого типа объекта шаг спросит заново
      if (l.length === 1) { st.a.height = 0; st.hAuto = 1; }
      else if (st.hAuto) { delete st.a.height; st.hAuto = 0; }
      $$('.cx-o', x).forEach((o, i) => o.classList.toggle('is-sel', st.a.height === i && l.length > 1));
    }
    // назад: если шаг записан в истории — через историю (её «назад» и вернёт шаг), иначе сразу
    // кнопка «Назад» — всегда на шаг раньше по порядку. Если предыдущая запись истории и есть этот шаг — уходим по истории,
    // иначе (шаги перепрыгивались) — переходим сами и переписываем текущую запись
    function stepBack() {
      if (st.step <= 0) return;
      const t = st.step - 1;
      if (inline && hn > 0 && hs[hn - 1] === t) return history.back();
      go(t);
      hs[hn] = t;
      if (inline && hn > 0) history.replaceState({ cx: t, hid, n: hn }, '');
    }
    addEventListener('popstate', e => {
      if (!inline || !pushed) return;
      const h = e.state, ours = h && h.hid === hid;
      hn = ours ? h.n : 0;
      go(ours ? h.cx : hs[0]);
    });
    function nextFromMulti() {
      if (st.a.need == null) st.a.need = [];
      advance(st.step);
    }
    el.addEventListener('click', e => {
      // подсказка «i» у варианта: по нажатию (телефон) показывается, вариант не выбирается
      const tip = e.target.closest('.cx-in');
      if (tip) { e.preventDefault(); tip.parentElement.classList.toggle('is-tip'); return; }
      const o = e.target.closest('.cx-o'); if (o) return pick(o);
      if (e.target.closest('.cx-gob')) return nextFromMulti();
      if (e.target.closest('.cx-back')) return stepBack();
      if (e.target.closest('.cx-reset')) { st.a = {}; clear(PANELS.map(p => p.id)); syncHeight(); $('.cx-form', el).classList.remove('is-sent'); return go(0, true); }
    });
    el.addEventListener('mouseleave', () => $$('.cx-o.is-tip', el).forEach(o => o.classList.remove('is-tip')));
    // клавиатура: цифры — ответ, стрелки — назад/вперёд; работает, когда калькулятор на экране
    let inView = false;
    new IntersectionObserver(([e]) => { inView = e.isIntersecting && e.intersectionRatio > .45; }, { threshold: [0, .45, .7] }).observe(el);
    document.addEventListener('keydown', e => {
      if (e.ctrlKey || e.metaKey || e.altKey || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
      // в окне — только когда окно открыто; на странице — когда калькулятор на экране и окон нет
      if (el.closest('.modal') ? !el.closest('.modal.is-open') : (!inView || document.querySelector('.modal.is-open'))) return;
      const F = flow(), x = QE[F[st.step]], p = x && PI[x.dataset.id];
      if (/^[1-9]$/.test(e.key)) { const o = x && $$('.cx-o', x)[+e.key - 1]; if (o) { e.preventDefault(); pick(o); } }
      else if (e.key === 'ArrowLeft' || e.key === 'Backspace') { if (st.step > 0) { e.preventDefault(); stepBack(); } }
      else if (e.key === 'ArrowRight' && p) { if (p.multi) { e.preventDefault(); nextFromMulti(); } else if (st.a[p.k] != null) { e.preventDefault(); go(st.step + 1, true); } }
    });

    // в заявку уходят ответы и расчёт — менеджер видит их в админке
    const answers = () => $$('.cs-spec > div:not([hidden])', el).map(d => [d.firstElementChild.textContent, d.lastElementChild.textContent]).filter(x => x[1] !== '—');
    $('.cx-form', el).ogExtra = () => {
      const r = estimate();
      return { calc: { answers: answers(), price: r ? (r.ind ? X.ind || 'Индивидуально' : `${num(r.lo)}–${num(r.hi)} ₽`) : '', days: r ? `${r.d0}–${r.d1} ${dn(r.d1)}` : '' } };
    };
    $$('.cx-ask', el).forEach(f => { f.ogExtra = () => ({ topic: ASK[f.dataset.ask] || '', calc: { answers: answers(), price: '', days: '' } }); });
    U.bindForms(el);
    syncHeight();
    go(0);
    // открыть с выбранной услугой: документ уже отмечен, начинаем со второго шага
    el.ogSet = id => {
      if (!D.svc(id)) return;
      if (st.a.doc !== id) newDoc(id);
      st.a.doc = id; syncHeight();
      $$('.cx-q[data-id="doc"] .cx-o', el).forEach(o => o.classList.toggle('is-sel', o.dataset.v === id));
      go(1);
    };
    return el;
  }
  window.OG_CALC = calc;
  // окно «Рассчитать стоимость» на всех страницах — тот же калькулятор
  const mc = $('#m-calc [data-calc]');
  if (mc) calc(mc);
})();
