// Карточки, общие для главной и внутренних страниц — в языке макета главной (Figma «home»)
(function () {
  const D = window.OG, X = D.tx.cards;
  const pad = n => String(n).padStart(2, '0');
  // стрелка-уголок кнопок (Figma: arrow-up-right) и стрелка круглой кнопки карточки услуги
  const AR = '<svg class="fb-ar" viewBox="0 0 17 17" aria-hidden="true"><path d="M4.958 12.042 12.042 4.958M4.958 4.958h7.084v7.084"/></svg>';
  const GO = '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M16 23 23 16M16 16h7v7"/></svg>';

  // «4 рабочих дня», «5 + 2 рабочих дней» — по последнему числу
  const dn = t => { const n = +String(t).match(/\d+(?!.*\d)/)[0], a = n % 10, b = n % 100;
    return 'раб. ' + (a === 1 && b !== 11 ? 'день' : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 'дня' : 'дней'); };

  // фото работ и статей: на телефоне — копия 900 px из img/m (_tools/m/assets.cjs), в строках списка (row) — миниатюра 360 px
  // из img/m/t; планшет и ПК берут исходный файл
  const pic = (name, attrs, row) => `<picture><source media="(max-width: 600px)" srcset="img/m/${row ? 't/' : ''}${name}.webp"><img src="img/${name}.webp" ${attrs}></picture>`;

  const C = {
    dn, pad, AR, pic,
    // картинка своя (загружена в админке) — сцена поверх неё не совпадёт с рисунком, её не показываем
    ownImg: (s, pre = 's-') => s.img === pre + s.id,
    // случайный порядок (Фишер — Йейтс): проекты меняются местами при каждом обновлении страницы
    shuffle: list => { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const k = Math.floor(Math.random() * (i + 1)); [a[i], a[k]] = [a[k], a[i]]; } return a; },
    // порядок услуг — как в макете главной (по рядам слева направо)
    order: D.svcOrder,

    // услуга: картинка на всю карточку, белая панель снизу, при наведении — сцена услуги (js/svc-fx.js)
    sc: (s, i, n = 6) => { const FX = window.OG_FX || {}, fx = C.ownImg(s) && FX[s.id]; return `<article class="sc" data-fx="${s.id}">
      <a class="card-hit" href="usluga.html?id=${s.id}" tabindex="-1" aria-hidden="true"></a>
      <div class="sc-art"><img class="sc-im" src="img/${s.img}.webp" alt="" loading="lazy" decoding="async">
        ${fx ? `<svg class="sc-fx" viewBox="0 0 ${FX.W} ${FX.H}" aria-hidden="true">${fx}</svg>` : ''}</div>
      <span class="sc-n">${pad(i + 1)} / ${pad(n)}</span><span class="sc-d">${s.days} ${X.days}</span>
      <div class="sc-b">
        <h3><a class="cover-link" href="usluga.html?id=${s.id}">${s.cardT}</a></h3>
        <p>${s.cardD}</p>
        <div class="sc-f"><p class="sc-p"><small>${X.price}</small><b>${D.cost(s)}</b></p><span class="sc-go">${GO}</span></div>
      </div>
    </article>`; },

    // работа: фото с параллаксом, тип и регион, стоимость и срок, дополнительные услуги
    // row — карточка идёт строкой в списке страницы (на телефоне — с миниатюрой)
    wkc: (w, cls = '', st = '', row) => `<article class="wkc${cls ? ' ' + cls : ''}"${st ? ` style="${st}"` : ''}>
      <a class="wkc-img" href="rabota.html?id=${w.id}" tabindex="-1">${pic(w.img, `alt="${w.obj}" loading="lazy" decoding="async" data-par`, row)}</a>
      <div class="wkc-b">
        <p class="wkc-m"><span>${w.type}</span><span>${w.city}</span></p>
        <h3><a class="cover-link" href="rabota.html?id=${w.id}">${w.obj}</a></h3>
        <dl class="wkc-dl"><div><dt>${X.price}</dt><dd>${w.cost} ${X.k}</dd></div><div><dt>${X.term}</dt><dd>${w.days} ${dn(w.days)}</dd></div></dl>
        ${w.extra ? `<p class="wkc-x"><b>+</b>${w.extra}</p>` : ''}
      </div>
    </article>`,

    // статья: фото с меткой темы, белая панель наплывает на фото, дата и «Читать»
    arc: (a, cls = '', row) => `<article class="arc${cls ? ' ' + cls : ''}">
      <a class="card-hit" href="statya.html?id=${a.id}" tabindex="-1" aria-hidden="true" draggable="false"></a>
      <a class="arc-img" href="statya.html?id=${a.id}" tabindex="-1" draggable="false">${pic(a.img, 'alt="" loading="lazy" decoding="async" draggable="false"', row)}</a>
      <span class="arc-tag">${a.tag}</span>
      <div class="arc-b">
        <h3><a class="cover-link" href="statya.html?id=${a.id}" draggable="false">${a.t}</a></h3>
        <p class="arc-d">${a.d}</p>
        <div class="arc-f"><p><span>${X.date}</span><time>${a.date}</time></p><span class="fb fb--sm arc-btn"><span>${X.read}</span>${AR}</span></div>
      </div>
    </article>`,

    // вкладыш: у всех один вид, цвет полоски — по разделу библиотеки
    cover: (b, lines = 6) => `<div class="cv cv--${b.cat}"><div class="cv-h">${b.head}</div><div class="cv-n">${b.num}</div><div class="cv-t">${b.t}</div><div class="cv-l">${'<i></i>'.repeat(lines)}</div>${lines > 6 ? `<p class="cv-f"><span>${b.date}</span><span>${b.kind}</span></p>` : ''}</div>`,

    // документ библиотеки: папка, документ выезжает вверх при наведении
    book: b => `<a class="folder" href="kniga.html?id=${b.id}">
      <span class="f-back"></span>
      <span class="f-doc">${C.cover(b)}</span>
      <span class="f-front">
        <span class="f-k">${b.kind} · ${b.num}</span>
        <span class="f-t">${b.t}</span>
        <span class="f-d">${b.news ? `<em>${b.news}</em>` : ''}<time>${b.date}</time></span>
      </span>
    </a>`,

    // раздел библиотеки на главной: та же папка, во вкладыше — первый документ раздела
    bookCat: (c, i) => {
      const list = D.books.filter(b => b.cat === c.id), n = list.length;
      return `<a class="folder" href="biblioteka.html?cat=${c.id}">
      <span class="f-back"></span>
      <span class="f-doc">${C.cover({ cat: c.id, head: c.short, num: '', t: '', ...(list[0] && { num: list[0].num, t: list[0].t }) })}</span>
      <span class="f-front">
        <span class="f-k">${String(i + 1).padStart(2, '0')} / ${String(D.bookCats.length).padStart(2, '0')}</span>
        <span class="f-t">${c.t}</span>
        <span class="f-d">${n ? `${n} ${C.docs(n)}` : X.empty}</span>
      </span>
    </a>`;
    },

    docs: n => (n % 10 === 1 && n % 100 !== 11 ? 'документ' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'документа' : 'документов'),
  };

  // белые панели карточек услуг — одной высоты, по самой высокой: иначе в ряду они «пляшут»
  C.eqSc = box => {
    const bs = [...box.querySelectorAll('.sc-b')];
    // .is-cut — описание не влезло в видимые строки (телефон, mobile.css): в конце строки «… подробнее»
    const eq = () => { bs.forEach(b => (b.style.minHeight = '')); const h = Math.max(...bs.map(b => b.offsetHeight)); bs.forEach(b => (b.style.minHeight = h + 'px'));
      bs.forEach(b => { const p = b.querySelector(':scope > p'); p && p.classList.toggle('is-cut', p.scrollHeight > p.clientHeight + 1); }); };
    eq(); addEventListener('resize', eq); addEventListener('load', eq); document.fonts && document.fonts.ready.then(eq);
  };

  // ── телефон: лента карточек листается пальцем (mobile.css — scroll-snap), под ней номер карточки у левого края и полоса
  //    пройденного. Список перерисовали фильтром — лента встаёт в начало. На ПК лента — обычная сетка, номер не трогаем ──
  const MOB = window.OG_MQ || matchMedia('not all');
  C.rail = (box, bar) => {
    if (!box) return;
    if (!bar) { bar = document.createElement('div'); bar.className = 'rl-bar m-only'; bar.innerHTML = '<span class="num"></span><i><b></b></i>'; box.after(bar); }
    const k = bar.querySelector('.num'), p = bar.querySelector('b');
    let wait = false;
    const paint = () => {
      wait = false;
      const cs = [...box.children]; if (!MOB.matches || !cs.length) return;
      const x = box.scrollLeft, w = box.clientWidth, sw = box.scrollWidth, pl = parseFloat(getComputedStyle(box).paddingLeft) || 0;
      // текущая — первая карточка, у которой больше половины правее левого поля ленты
      const i = Math.max(0, cs.findIndex(c => c.offsetLeft + c.offsetWidth / 2 > x + pl));
      k.textContent = `${pad(Math.min(i + 1, cs.length))} / ${pad(cs.length)}`;
      p.style.transform = `scaleX(${sw > w ? Math.min(1, (x + w) / sw).toFixed(4) : 1})`;
      bar.classList.toggle('is-one', sw <= w + 2);
    };
    const ask = () => { if (!wait) { wait = true; requestAnimationFrame(paint); } };
    box.addEventListener('scroll', ask, { passive: true });
    addEventListener('resize', ask); MOB.addEventListener('change', ask);
    new MutationObserver(() => { box.scrollLeft = 0; ask(); }).observe(box, { childList: true });
    ask();
  };
  // сцена карточки без наведения: на телефоне проигрывается у карточки, которая видна на экране почти целиком
  C.play = box => {
    if (!box || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('is-play', MOB.matches && e.intersectionRatio >= .68)), { threshold: [0, .68, 1] });
    const watch = () => [...box.children].forEach(c => io.observe(c));
    watch(); new MutationObserver(() => { io.disconnect(); watch(); }).observe(box, { childList: true });
  };

  // сетка работ из 12 колонок: ряды по 2, 2, 3 карточки по кругу (7/5, 5/7, 4/4/4); одиночный хвост не оставляем —
  // ряд перед ним становится тройкой или парой
  C.wkSpans = n => {
    const out = [];
    for (let k = 0, two = 0, left = n; left > 0; k++) {
      let s = [2, 2, 3][k % 3];
      if (s > left) s = left;
      if (left - s === 1) s = Math.min(s === 3 ? 2 : 3, left);
      out.push(...(s === 3 ? [4, 4, 4] : s === 2 ? (two++ % 2 ? [5, 7] : [7, 5]) : [12]));
      left -= s;
    }
    return out;
  };


  // карта «Географии» (главная, «Контакты»): силуэт России по Figma (js/map-outline.js), сеть дуг из Москвы, города с проектами
  // и города покрытия; оживает классами .is-lit (появление волной) и #geo.is-live (свечение и пульсы) — стили в home.css
  C.mapSVG = () => {
    const M = window.OG_MAP, C0 = D.cities;
    const max = Math.max(...C0.map(c => c[3]));
    const P = C0.map(c => M.xy(c[1], c[2])), HUB = P[0];
    const f1 = v => v.toFixed(1);
    // дуга из Москвы: середина приподнята на четверть расстояния
    const route = ([x, y]) => { const [hx, hy] = HUB, d = Math.hypot(x - hx, y - hy); return `M${f1(hx)},${f1(hy)}Q${f1((hx + x) / 2)},${f1((hy + y) / 2 - d * .25)} ${f1(x)},${f1(y)}`; };
    // волна: всё зажигается из Москвы наружу — задержка по расстоянию
    const FAR = Math.max(...P.map(([x, y]) => Math.hypot(x - HUB[0], y - HUB[1])));
    const wave = (x, y) => (.2 + Math.hypot(x - HUB[0], y - HUB[1]) / FAR * 1.8).toFixed(2);
    // карта по Figma («09 · География» → «Контур России»): сплошной светлый силуэт без точек и обводки
    let svg = `<svg viewBox="-12 -12 ${M.w + 24} ${M.h + 24}" class="map-svg" role="img" aria-label="Карта выполненных проектов">`;
    svg += `<defs><radialGradient id="og-glow"><stop offset="0" stop-color="#f5312a" stop-opacity=".55"/><stop offset=".4" stop-color="#f5312a" stop-opacity=".16"/><stop offset="1" stop-color="#f5312a" stop-opacity="0"/></radialGradient></defs>`;
    svg += `<path class="map-land" d="${M.outline}"/>`;
    // сеть: от Москвы к каждому городу с проектами тонкая дуга — при появлении блока прорисовываются по очереди и остаются неподвижными
    svg += `<g class="map-rt">${P.map((p, i) => {
      if (!i) return '';
      let s = `<path class="rt-n" d="${route(p)}" pathLength="1" style="--w:${wave(...p)}s"/>`;
      return s + `<path class="rt-on" data-i="${i}" d="${route(p)}" pathLength="1"/>`;
    }).join('')}</g>`;
    // города покрытия — мелкие серые точки; время от времени одна из них вспыхивает красным (работаем и там)
    svg += `<g class="map-cov">${(D.coverage || []).map(([t, lo, la]) => { const [x, y] = M.xy(lo, la); return `<g class="cov" style="--w:${wave(x, y)}s" transform="translate(${f1(x)},${f1(y)})"><title>${t}</title><circle class="c-rip" r="7"/><circle class="cv-dot" r="1.6"/></g>`; }).join('')}</g>`;
    // города с проектами: мягкое свечение (дышит), ядро с белым ободком, кольцо-вспышка; Москва — тёмное ядро с красным центром и двойным пульсом
    svg += C0.map(([t, , , n], i) => {
      const [x, y] = P[i], r = i ? 2 + Math.sqrt(n / max) * 3 : 4.6;
      const mark = i ? `<circle class="c-glow" r="${f1(r * 3.4)}" fill="url(#og-glow)"/><circle class="c-rip" r="${f1(r + 8)}"/><circle class="c-dot" r="${f1(r)}"/>`
        : `<circle class="c-glow" r="${f1(r * 4.2)}" fill="url(#og-glow)"/><circle class="c-ping" r="${f1(r + 11)}"/><circle class="c-ping c-ping--2" r="${f1(r + 11)}"/><circle class="c-rip" r="${f1(r + 11)}"/><circle class="c-hub" r="${f1(r)}"/><circle class="c-core" r="1.9"/>`;
      const dst = `" style="--k:${i};--w:${wave(x, y)}s;--b:${(i % 7 * .45).toFixed(2)}s`;
      return `<g class="city${i ? '' : ' city--hub'}${dst}" data-i="${i}" transform="translate(${f1(x)},${f1(y)})" tabindex="0" aria-label="${t}: ${n}">${mark}<circle class="c-hit" r="${f1(Math.max(r + 6, 12))}"/></g>`;
    }).join('');
    return svg + '</svg>';
  };

  window.OG_C = C;
})();
