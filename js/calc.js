// Калькулятор стоимости на главной: по шагам, ответ одним нажатием — сразу следующий шаг.
// Справа «лист расчёта» как лист проекта: цена, срок, параметры объекта и состав работ заполняются по ходу.
// Коэффициенты — общие с калькулятором остальных страниц (OG_UI.calc.data).
(function () {
  const D = window.OG, U = window.OG_UI, $ = U.$, $$ = U.$$;
  const { AREA, BLD, KOBJ } = U.calc.data;
  const pad = n => String(n).padStart(2, '0');
  const num = n => Math.round(n).toLocaleString('ru-RU').replace(/\s/g, ' ');
  const r5 = v => Math.round(v / 5000) * 5000;
  const sv = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const AR = '<svg class="fb-ar" viewBox="0 0 17 17" aria-hidden="true"><path d="M4.958 12.042 12.042 4.958M4.958 4.958h7.084v7.084"/></svg>';
  const dn = n => { const a = n % 10, b = n % 100; return a === 1 && b !== 11 ? 'рабочий день' : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 'рабочих дня' : 'рабочих дней'; };

  // линейные значки типов объектов
  const OBJ_I = {
    logistic: sv('<path d="M3 20V9.5l9-5 9 5V20"/><path d="M7 20v-7h10v7M7 16.5h10"/>'),
    production: sv('<path d="M3 20h18M4 20v-9l5 3v-3l5 3v-3l5 3V4h2v16"/><path d="M8 17h1.5M12 17h1.5"/>'),
    admin: sv('<rect x="6" y="3" width="12" height="18" rx="1"/><path d="M9.5 7h1M13.5 7h1M9.5 10.5h1M13.5 10.5h1M9.5 14h1M13.5 14h1M11 21v-3h2v3"/>'),
    living: sv('<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5M10 20v-5h4v5"/>'),
    trade: sv('<path d="M4 9.5 5.5 4h13L20 9.5"/><path d="M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0M5.5 11.5V20h13v-8.5M10 20v-5h4v5"/>'),
    oil: sv('<ellipse cx="9" cy="7" rx="5" ry="2"/><path d="M4 7v10c0 1.1 2.2 2 5 2s5-.9 5-2V7M14 12h3.5l2.5-2.5V20"/>'),
    social: sv('<path d="M3 20h18M5 20V9.5l7-4.5 7 4.5V20"/><path d="M12 9.5v5M9.5 12h5"/>'),
    other: sv('<rect x="4" y="4" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1"/><path d="M16.75 14v6M13.75 17h6"/>'),
  };
  const DATA = [
    ['all', 'Всё есть', 'Чертежи .dwg и сведения о пожарных частях', 0, 0, sv('<circle cx="12" cy="12" r="8.5"/><path d="m8.5 12.2 2.4 2.4 4.6-5"/>')],
    ['dwg', 'Нет чертежей .dwg', 'Отрисуем планы и фасады · +20 000 ₽', 20000, 3, sv('<path d="M4 20 20 4M7 4H4v3M17 20h3v-3"/><rect x="4" y="4" width="16" height="16" rx="1" stroke-dasharray="2.5 2.5"/>')],
    ['units', 'Нет данных о частях', 'Запросим сведения в гарнизоне · +10 000 ₽', 10000, 2, sv('<path d="M4 20V9l8-5 8 5v11"/><path d="M9 20v-6h6v6"/><path d="M15 6.5V4h2.5v4"/>')],
    ['none', 'Нет ни того, ни другого', 'Возьмём на себя чертежи и запросы · +30 000 ₽', 30000, 5, sv('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5M12 16h.01"/>')],
  ];
  const TERM = [
    ['norm', 'В обычном порядке', 'По графику, без доплат', sv('<rect x="4" y="5.5" width="16" height="14.5" rx="1.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>')],
    ['fast', 'Срочно', 'Примерно вдвое быстрее · +30 %', sv('<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>')],
  ];
  const AREA_T = ['до 1 000', '1–5 тыс.', '5–20 тыс.', '20–50 тыс.', 'от 50 тыс.'], AREA_S = [.3, .45, .62, .8, 1];
  const BLD_T = ['Одно здание', '2–3 здания', '4 и более'], BLD_N = [1, 3, 5];

  const STEPS = [
    { k: 'doc', t: 'Документ', q: 'Какой документ нужен?', h: 'Не уверены — выберите ближайший, уточним на консультации', c: 2,
      opts: () => D.services.map(s => ({ v: s.id, t: s.short, m: `от ${D.rub(s.price)} · ${s.days} дней` })) },
    { k: 'obj', t: 'Объект', q: 'Какой у вас объект?', h: 'Тип здания влияет на нормы и объём расчётов', c: 4,
      opts: () => D.objects.map(o => ({ v: o.id, t: o.t, i: OBJ_I[o.id] })) },
    { k: 'area', t: 'Площадь', q: 'Какая площадь объекта?', h: 'Суммарная по всем этажам, достаточно примерно', c: 5,
      opts: () => AREA_T.map((t, i) => ({ v: i, t, m: 'м²', plan: AREA_S[i] })) },
    { k: 'bld', t: 'Здания', q: 'Сколько зданий на участке?', h: 'Для каждого здания проверяем подъезд и расход воды', c: 3,
      opts: () => BLD_T.map((t, i) => ({ v: i, t, blocks: BLD_N[i] })) },
    { k: 'data', t: 'Данные', q: 'Что есть из исходных данных?', h: 'Если чего-то нет — подготовим сами, это учтено в цене', c: 2,
      opts: () => DATA.map(([v, t, m, , , i]) => ({ v, t, m, i })) },
    { k: 'term', t: 'Срок', q: 'Когда нужен документ?', h: 'Срочно — берём в работу вне очереди', c: 2,
      opts: () => TERM.map(([v, t, m, i]) => ({ v, t, m, i })) },
  ];
  const LAST = STEPS.length; // экран результата

  const optHTML = o => `<button type="button" class="cx-o${o.i ? ' cx-o--ico' : ''}${o.plan ? ' cx-o--plan' : ''}${o.blocks ? ' cx-o--blk' : ''}" data-v="${o.v}">
      ${o.i ? `<span class="cx-oi">${o.i}</span>` : ''}
      ${o.plan ? `<span class="cx-pl"><i style="--s:${o.plan}"></i></span>` : ''}
      ${o.blocks ? `<span class="cx-bl">${'<i></i>'.repeat(o.blocks)}</span>` : ''}
      <span class="cx-ot"><b>${o.t}</b>${o.m ? `<small>${o.m}</small>` : ''}</span><i class="cx-ck"></i></button>`;

  function calc(el) {
    const st = { step: 0, max: 0, a: {} };
    el.classList.add('cx-wrap');
    el.innerHTML = `<div class="cx">
      <div class="cx-main">
        <div class="cx-stage">
          ${STEPS.map((s, i) => `<div class="cx-q" data-step="${i}">
            <p class="cx-k">Шаг ${pad(i + 1)} из ${pad(STEPS.length)}</p>
            <h3 class="cx-t">${s.q}</h3><p class="cx-h">${s.h}</p>
            <div class="cx-opts" style="--c:${s.c}">${s.opts().map(optHTML).join('')}</div></div>`).join('')}
          <div class="cx-q cx-fin" data-step="${LAST}">
            <p class="cx-k">Готово</p>
            <h3 class="cx-t">Предварительный расчёт готов</h3>
            <p class="cx-h">Оставьте контакты — инженер проверит исходные данные и&nbsp;назовёт точную стоимость в&nbsp;течение 15&nbsp;минут</p>
            <ol class="cx-next"><li><b>01</b>Проверим исходные данные</li><li><b>02</b>Назовём точную цену и&nbsp;срок</li><li><b>03</b>Пришлём договор</li></ol>
            <form class="form cx-form" novalidate>
              <label class="fld"><input name="name" placeholder=" " autocomplete="name"><span>Ваше имя</span></label>
              <label class="fld"><input name="phone" type="tel" placeholder=" " autocomplete="tel" required><span>Телефон</span></label>
              <button class="btn btn--red" type="submit">Получить точный расчёт</button>
              <p class="consent">Нажимая кнопку, вы соглашаетесь с <a href="#">политикой конфиденциальности</a></p>
              <div class="form-ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m7.5 12.5 3 3 6-6.5"/></svg><div><b>Заявка отправлена</b><p class="muted">Инженер перезвонит в течение 15 минут в рабочее время.</p></div></div>
            </form>
          </div>
        </div>
        <div class="cx-nav">
          <button type="button" class="cx-back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>Назад</button>
          <button type="button" class="cx-reset">Начать заново</button>
        </div>
      </div>
      <aside class="cx-sheet" aria-live="polite">
        <div class="cs-price"><small>Ориентировочная стоимость</small><b><span class="cs-lo">от 30&nbsp;000</span><i class="cs-dash">–</i><span class="cs-hi"></span>&nbsp;₽</b></div>
        <div class="cs-time"><div class="cs-trow"><small>Срок разработки</small><b class="cs-days">—</b></div></div>
        <dl class="cs-spec">${STEPS.map(s => `<div data-k="${s.k}"><dt>${s.t}</dt><dd>—</dd></div>`).join('')}</dl>
        <div class="cs-inc"><small>Состав работ</small><ul></ul></div>
      </aside>
    </div>`;

    const qs = $$('.cx-q', el), back = $('.cx-back', el);
    const lo = $('.cs-lo', el), hi = $('.cs-hi', el), dash = $('.cs-dash', el), days = $('.cs-days', el);
    const spec = Object.fromEntries($$('.cs-spec > div', el).map(d => [d.dataset.k, d])), inc = $('.cs-inc ul', el);
    let busy = 0, shown = { lo: 30000, hi: 0 };

    // ── расчёт: неотвеченные параметры берутся по умолчанию ──
    function estimate() {
      const a = st.a, s = a.doc && D.svc(a.doc);
      if (!s) return null;
      const ar = AREA[a.area ?? 0][1], bl = BLD[a.bld ?? 0][1], dt = DATA.find(d => d[0] === (a.data || 'all')), fast = a.term === 'fast';
      let p = s.price * KOBJ[a.obj || 'admin'] * ar * bl + dt[3];
      const B = s.base * Math.sqrt(ar * bl);
      let seg = [.2 * B + (/units|none/.test(dt[0]) ? 2 : 0), .35 * B, .3 * B + (/dwg|none/.test(dt[0]) ? 3 : 0), .15 * B];
      if (fast) { p *= 1.3; seg = seg.map(v => v * .6); }
      const d0 = Math.max(2, Math.ceil(seg.reduce((x, y) => x + y, 0)));
      return { s, lo: Math.max(s.price, r5(p)), hi: r5(p * 1.2), d0, d1: d0 + 2, seg };
    }
    // число докручивается до нового значения; новый вызов отменяет предыдущий
    const tween = (node, from, to) => {
      const id = node._tw = (node._tw || 0) + 1;
      if (from === to) { node.textContent = num(to); return; }
      const t0 = performance.now(), dur = 650;
      const step = now => { if (node._tw !== id) return; const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3); node.textContent = num(from + (to - from) * e); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    function paint() {
      const r = estimate(), a = st.a;
      if (!r) {
        lo.textContent = 'от 30 000'; hi.textContent = ''; dash.hidden = true; days.textContent = 'от 3 рабочих дней';
        shown = { lo: 30000, hi: 0 };
        lo._tw = hi._tw = 0; inc.innerHTML = ''; inc.dataset.svc = '';
      } else {
        dash.hidden = false;
        if (lo.textContent.startsWith('от')) shown.lo = r.lo;
        tween(lo, shown.lo, r.lo); tween(hi, shown.hi || r.hi, r.hi); shown = { lo: r.lo, hi: r.hi };
        days.textContent = `${r.d0}–${r.d1} ${dn(r.d1)}`;
        // состав работ — из описания услуги
        if (inc.dataset.svc !== r.s.id) {
          inc.dataset.svc = r.s.id;
          inc.innerHTML = r.s.includes.slice(0, 3).map((t, i) => `<li style="--i:${i}">${t}</li>`).join('');
        }
      }
      // параметры объекта
      const txt = {
        doc: a.doc && D.svc(a.doc).short, obj: a.obj && D.objects.find(o => o.id === a.obj).t,
        area: a.area != null && AREA_T[a.area] + ' м²', bld: a.bld != null && BLD_T[a.bld],
        data: a.data && DATA.find(d => d[0] === a.data)[1], term: a.term && TERM.find(t => t[0] === a.term)[1],
      };
      STEPS.forEach((s, i) => {
        const row = spec[s.k], dd = row.lastElementChild, v = txt[s.k] || '—';
        row.classList.toggle('is-cur', i === st.step);
        row.classList.toggle('is-set', !!txt[s.k]);
        if (dd.textContent !== v) { dd.textContent = v; dd.classList.remove('is-new'); void dd.offsetWidth; dd.classList.add('is-new'); }
      });
    }

    // ── шаги ──
    // вопросы до текущего уезжают влево, после — ждут справа
    function go(i) {
      i = Math.max(0, Math.min(LAST, i));
      st.step = i; st.max = Math.max(st.max, i);
      qs.forEach((q, k) => {
        q.classList.toggle('is-on', k === i);
        q.classList.toggle('is-left', k < i);
        q.inert = k !== i;
      });
      back.disabled = i === 0;
      el.classList.toggle('is-fin', i === LAST);
      paint();
    }
    // выбор: отметка → короткая пауза, чтобы было видно выбор → следующий шаг (или первый неотвеченный)
    function pick(btn) {
      if (busy) return;
      const q = btn.closest('.cx-q'), i = +q.dataset.step, s = STEPS[i];
      const v = /^\d+$/.test(btn.dataset.v) ? +btn.dataset.v : btn.dataset.v;
      $$('.cx-o', q).forEach(o => o.classList.toggle('is-sel', o === btn));
      st.a[s.k] = v;
      paint();
      busy = setTimeout(() => {
        busy = 0;
        const next = STEPS.findIndex((x, k) => k > i && st.a[x.k] == null);
        go(next < 0 ? (STEPS.every(x => st.a[x.k] != null) ? LAST : i + 1) : next);
        const f = $('.cx-q.is-on .cx-o.is-sel, .cx-q.is-on .cx-o, .cx-q.is-on input', el);
        f && f.focus({ preventScroll: true });
      }, 380);
    }
    el.addEventListener('click', e => {
      const o = e.target.closest('.cx-o'); if (o) return pick(o);
      if (e.target.closest('.cx-back')) return go(st.step - 1);
      if (e.target.closest('.cx-reset')) { st.a = {}; st.max = 0; $$('.cx-o.is-sel', el).forEach(o => o.classList.remove('is-sel')); $('.cx-form', el).classList.remove('is-sent'); return go(0); }
    });
    // клавиатура: цифры — ответ, стрелки — назад/вперёд; работает, когда калькулятор на экране
    let inView = false;
    new IntersectionObserver(([e]) => { inView = e.isIntersecting && e.intersectionRatio > .45; }, { threshold: [0, .45, .7] }).observe(el);
    document.addEventListener('keydown', e => {
      if (e.ctrlKey || e.metaKey || e.altKey || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
      // в окне — только когда окно открыто; на странице — когда калькулятор на экране и окон нет
      if (el.closest('.modal') ? !el.closest('.modal.is-open') : (!inView || document.querySelector('.modal.is-open'))) return;
      const q = qs[st.step];
      if (/^[1-9]$/.test(e.key)) { const o = $$('.cx-o', q)[+e.key - 1]; if (o) { e.preventDefault(); pick(o); } }
      else if (e.key === 'ArrowLeft' || e.key === 'Backspace') { if (st.step > 0) { e.preventDefault(); go(st.step - 1); } }
      else if (e.key === 'ArrowRight') { if (st.a[STEPS[st.step]?.k] != null) { e.preventDefault(); go(st.step + 1); } }
    });

    U.bindForms(el);
    go(0);
    // открыть с выбранной услугой: документ уже отмечен, начинаем со второго шага
    el.ogSet = id => {
      if (!D.svc(id)) return;
      st.a.doc = id; st.max = Math.max(st.max, 1);
      $$('.cx-q[data-step="0"] .cx-o', el).forEach(o => o.classList.toggle('is-sel', o.dataset.v === id));
      go(1);
    };
    return el;
  }
  window.OG_CALC = calc;
})();
