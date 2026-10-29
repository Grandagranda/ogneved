// Карточки, общие для главной и внутренних страниц — в языке макета главной (Figma «home»)
(function () {
  const D = window.OG;
  const pad = n => String(n).padStart(2, '0');
  // стрелка-уголок кнопок (Figma: arrow-up-right) и стрелка круглой кнопки карточки услуги
  const AR = '<svg class="fb-ar" viewBox="0 0 17 17" aria-hidden="true"><path d="M4.958 12.042 12.042 4.958M4.958 4.958h7.084v7.084"/></svg>';
  const GO = '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M16 23 23 16M16 16h7v7"/></svg>';

  // «4 рабочих дня», «5 + 2 рабочих дней» — по последнему числу
  const dn = t => { const n = +String(t).match(/\d+(?!.*\d)/)[0], a = n % 10, b = n % 100;
    return 'раб. ' + (a === 1 && b !== 11 ? 'день' : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 'дня' : 'дней'); };

  const C = {
    dn, pad, AR,
    // порядок услуг — как в макете главной (по рядам слева направо)
    order: D.svcOrder,

    // услуга: картинка на всю карточку, белая панель снизу, при наведении — сцена услуги (js/svc-fx.js)
    sc: (s, i, n = 6) => { const FX = window.OG_FX || {}, fx = FX[s.id]; return `<article class="sc" data-fx="${s.id}">
      <div class="sc-art"><img class="sc-im" src="img/s-${s.id}.webp" alt="" loading="lazy">
        ${fx ? `<svg class="sc-fx" viewBox="0 0 ${FX.W} ${FX.H}" aria-hidden="true">${fx}</svg>` : ''}</div>
      <span class="sc-n">${pad(i + 1)} / ${pad(n)}</span><span class="sc-d">${s.days} раб. дней</span>
      <div class="sc-b">
        <h3><a class="cover-link" href="usluga.html?id=${s.id}">${s.cardT}</a></h3>
        <p>${s.cardD}</p>
        <div class="sc-f"><p class="sc-p"><small>Стоимость</small><b>от ${D.rub(s.price)}</b></p><span class="sc-go">${GO}</span></div>
      </div>
    </article>`; },

    // работа: фото с параллаксом, тип и регион, стоимость и срок, дополнительные услуги
    wkc: (w, cls = '', st = '') => `<article class="wkc${cls ? ' ' + cls : ''}"${st ? ` style="${st}"` : ''}>
      <a class="wkc-img" href="rabota.html?id=${w.id}" tabindex="-1"><img src="img/${w.img}.webp" alt="${w.obj}" loading="lazy" data-par></a>
      <div class="wkc-b">
        <p class="wkc-m"><span>${w.type}</span><span>${w.city}</span></p>
        <h3><a class="cover-link" href="rabota.html?id=${w.id}">${w.obj}</a></h3>
        <dl class="wkc-dl"><div><dt>Стоимость</dt><dd>${w.cost} тыс. ₽</dd></div><div><dt>Срок</dt><dd>${w.days} ${dn(w.days)}</dd></div></dl>
        ${w.extra ? `<p class="wkc-x"><b>+</b>${w.extra}</p>` : ''}
      </div>
    </article>`,

    // статья: фото с меткой темы, белая панель наплывает на фото, дата и «Читать»
    arc: (a, cls = '') => `<article class="arc${cls ? ' ' + cls : ''}">
      <a class="arc-img" href="statya.html?id=${a.id}" tabindex="-1" draggable="false"><img src="img/${a.img}.webp" alt="" loading="lazy" draggable="false"></a>
      <span class="arc-tag">${a.tag}</span>
      <div class="arc-b">
        <h3><a class="cover-link" href="statya.html?id=${a.id}" draggable="false">${a.t}</a></h3>
        <p class="arc-d">${a.d}</p>
        <div class="arc-f"><p><span>Дата публикации</span><time>${a.date}</time></p><span class="fb fb--sm arc-btn"><span>Читать</span>${AR}</span></div>
      </div>
    </article>`,

    cover: b => b.img ? `<img src="img/${b.img}.webp" alt="" loading="lazy">`
      : `<div class="cv cv--${b.cover.c}"><div class="cv-h">${b.cover.h}</div><div class="cv-n">${b.num}</div><div class="cv-t">${b.t}</div><div class="cv-l"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>`,

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
  };

  // белые панели карточек услуг — одной высоты, по самой высокой: иначе в ряду они «пляшут»
  C.eqSc = box => {
    const bs = [...box.querySelectorAll('.sc-b')];
    const eq = () => { bs.forEach(b => (b.style.minHeight = '')); const h = Math.max(...bs.map(b => b.offsetHeight)); bs.forEach(b => (b.style.minHeight = h + 'px')); };
    eq(); addEventListener('resize', eq); addEventListener('load', eq); document.fonts && document.fonts.ready.then(eq);
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
