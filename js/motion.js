// Плавность главной: инерционная прокрутка (Lenis), появления блоков, заголовки по словам из маски,
// заявление «О нас» заполняется словами по прокрутке, счётчики цифр, лёгкий параллакс фото.
// Эффекты, привязанные к прокрутке, регистрируются в window.OG_TICK и считаются в одном кадре.
(function () {
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ticks = window.OG_TICK = window.OG_TICK || [];

  // ── инерционная прокрутка ──
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ lerp: .09, wheelMultiplier: .9, smoothWheel: true });
    window.OG_LENIS = lenis;
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"], a[href^="index.html#"]'); if (!a) return;
      const id = a.getAttribute('href').replace('index.html', ''), t = id.length > 1 && document.querySelector(id);
      if (!t && id !== '#top') return;
      e.preventDefault(); lenis.scrollTo(id === '#top' ? 0 : t, { offset: -(+a.dataset.off || 24), duration: 1.4 });
    });
  }
  // эффекты прокрутки считаем только когда страница сдвинулась (или изменился размер/догрузились картинки) —
  // так выбор услуги наведением не перебивается каждым кадром
  let lastY = -1;
  const force = () => { lastY = -1; };
  addEventListener('resize', force); addEventListener('load', force);
  const loop = t => { lenis && lenis.raf(t); const y = scrollY; if (y !== lastY) { lastY = y; for (const f of ticks) f(t); } requestAnimationFrame(loop); };
  requestAnimationFrame(loop);

  // ── заголовки: слова поднимаются из маски ──
  const split = el => {
    let n = 0;
    const walk = node => {
      [...node.childNodes].forEach(ch => {
        if (ch.nodeType === 3) {
          const frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach(w => {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.append(document.createTextNode(w)); return; }
            const m = document.createElement('span'); m.className = 'wm';
            const i = document.createElement('span'); i.className = 'wi'; i.style.setProperty('--w', n++); i.textContent = w;
            m.append(i); frag.append(m);
          });
          ch.replaceWith(frag);
        } else if (ch.nodeType === 1 && ch.tagName === 'MARK') {
          const m = document.createElement('span'); m.className = 'wm';
          const i = document.createElement('span'); i.className = 'wi'; i.style.setProperty('--w', n++);
          ch.replaceWith(m); i.append(ch); m.append(i);
        } else if (ch.nodeType === 1) walk(ch);
      });
    };
    walk(el); el.classList.add('is-split');
    return n;
  };

  // ── появления ──
  // группы: дети появляются по очереди; одиночные — сами по себе (главная и внутренние страницы)
  const GROUPS = '.nums, .prx, .scx, .wkx, .arx, .lbx, .fqx-list, .gcx, .fx-cols, .pgf, .pgd, .rmt, .fls, .pk-list, .io, .arg, .cnt-l, .wpb-main, .ath, .bkh-r';
  const ONE = '.sh .badge, .shc .badge, .fqx-l .badge, .stk-l .badge, .stk-s, .sh-r, .chips2, .more2, .cl-head, .fx-btns, .gbar, .st .badge, .cl-grid, ' +
    '.crb, .pgh-h .badge, .pgh-r, .svh-l > :not(h1), .svh-art, .gnt,.pk-l > :not(h2),  .ctx-l .badge, .ctx-r, .ctx-f, .wph, .wpb-side, .atc, .toc2, .prose2, .ats, .bkh-v, .cnt-f, .arf';
  if (!reduce && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-rv');
    $$(GROUPS).forEach(g => [...g.children].forEach((c, i) => { if (c.matches('h1')) return; c.classList.add('rv'); if (!c.style.getPropertyValue('--i')) c.style.setProperty('--i', Math.min(i, 7)); }));
    $$(ONE).forEach(el => el.classList.add('rv'));
    const heads = $$('.h2x, .h1x');
    heads.forEach(split);
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target; io.unobserve(el); el.classList.add('is-in');
      // служебный класс снимаем после появления — возвращаются собственные переходы элемента (наведение)
      if (el.classList.contains('gst-map')) el.classList.add('is-lit');
      if (el.classList.contains('rv')) { const i = +el.style.getPropertyValue('--i') || 0; setTimeout(() => el.classList.remove('rv', 'is-in'), 1450 + i * 70); return; }
      // после появления клип снимаем — иначе маска режет буквы при наведении и масштабе
      const n = el.querySelectorAll('.wi').length;
      setTimeout(() => el.classList.add('is-done'), 1300 + n * 45);
    }), { rootMargin: '0px 0px -8% 0px', threshold: .12 });
    $$('.rv').forEach(el => io.observe(el));
    heads.forEach(el => io.observe(el));
    // списки перерисовываются фильтром — новые карточки показываем сразу с появлением, по очереди
    const pop = (n, i) => { n.classList.add('rv'); n.style.setProperty('--i', Math.min(i, 7)); requestAnimationFrame(() => requestAnimationFrame(() => n.classList.add('is-in'))); setTimeout(() => n.classList.remove('rv', 'is-in'), 1500 + i * 70); };
    const mo = new MutationObserver(ms => ms.forEach(m => [...m.addedNodes].filter(n => n.nodeType === 1).forEach((n, i) => {
      if (n.matches('.arg')) [...n.children].forEach((c, k) => pop(c, k + 1)); else pop(n, i);
    })));
    $$('#works-list, [data-swap]').forEach(el => mo.observe(el, { childList: true }));
  }

  // ── счётчики ──
  // крупные цифры: тире диапазона и плюс — отдельными знаками поменьше и с воздухом (стили — home.css)
  $$('.nums b, .pgf b, .rmt-sum strong, .gbar strong').forEach(el => {
    el.innerHTML = el.innerHTML.replace(/(\d)\s*[–—-]\s*(\d)/g, (s, a, b) => a + '<i class="n-dash">–</i>' + b).replace(/(\d)\+/g, (s, a) => a + '<i class="n-plus">+</i>');
  });
  // тире ровно посередине: у цифр разные боковые поля (у «1» широкое слева), поэтому равные поля тире дают разные просветы —
  // меряем контуры знаков на canvas и делим воздух (те же .4em тире) так, чтобы от цифры до цифры было поровну;
  // контуры canvas округляет до пикселя — меряем в кегле ×10
  const dashFit = () => {
    const cx = document.createElement('canvas').getContext('2d');
    $$('.n-dash').forEach(t => {
      const a = t.previousSibling, c = t.nextSibling;
      if (!a || !c || a.nodeType !== 3 || c.nodeType !== 3) return;
      const ps = getComputedStyle(t.parentNode), ts = getComputedStyle(t), fs = parseFloat(ts.fontSize);
      const m = (s, ch) => {
        cx.font = `${s.fontWeight} ${parseFloat(s.fontSize) * 10}px ${s.fontFamily}`;
        const r = cx.measureText(ch);
        return { width: r.width / 10, actualBoundingBoxLeft: r.actualBoundingBoxLeft / 10, actualBoundingBoxRight: r.actualBoundingBoxRight / 10 };
      };
      const A = m(ps, a.nodeValue.slice(-1)), T = m(ts, '–'), C = m(ps, c.nodeValue[0]);
      const gl = A.width - A.actualBoundingBoxRight + (parseFloat(ps.letterSpacing) || 0) - T.actualBoundingBoxLeft;
      const gr = T.width - T.actualBoundingBoxRight - C.actualBoundingBoxLeft;
      const g = (gl + gr) / 2 + .2 * fs;
      t.style.margin = `0 ${((g - gr) / fs).toFixed(3)}em 0 ${((g - gl) / fs).toFixed(3)}em`;
    });
  };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(dashFit);
  // счётчик меняет только число — первый текстовый узел с цифрами, знаки рядом остаются
  const countUp = el => {
    const n = [...el.childNodes].find(c => c.nodeType === 3 && /\d/.test(c.nodeValue)); if (!n) return;
    const m = n.nodeValue.match(/^(\D*)(\d+)(.*)$/); if (!m) return;
    const to = +m[2], t0 = performance.now(), dur = 1600;
    const step = now => { const k = Math.min(1, (now - t0) / dur); n.nodeValue = m[1] + Math.round(to * (1 - Math.pow(1 - k, 4))) + m[3]; if (k < 1) requestAnimationFrame(step); };
    n.nodeValue = m[1] + 0 + m[3]; requestAnimationFrame(step);
  };
  if (!reduce) {
    const cio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { cio.unobserve(e.target); countUp(e.target); } }), { threshold: .6 });
    $$('[data-count]').forEach(el => cio.observe(el));
  }

  // ── заявление «О нас»: слова темнеют по мере прокрутки ──
  const stx = document.getElementById('statement');
  if (stx) {
    const words = [];
    stx.innerHTML = stx.innerHTML.split(/(\s+)/).map(w => /^\s+$/.test(w) || !w ? w : `<span class="sw">${w}</span>`).join('');
    stx.querySelectorAll('.sw').forEach(w => words.push(w));
    const A = [171, 176, 197], B = [15, 16, 18];
    let lastN = -1;
    const fill = () => {
      const r = stx.getBoundingClientRect(), vh = innerHeight;
      const p = Math.min(1, Math.max(0, (vh * .82 - r.top) / (r.height + vh * .32)));
      const n = p * (words.length + 2);
      if (Math.abs(n - lastN) < .01) return; lastN = n;
      words.forEach((w, i) => {
        const k = Math.min(1, Math.max(0, n - i));
        w.style.color = `rgb(${A.map((a, j) => Math.round(a + (B[j] - a) * k)).join(',')})`;
      });
    };
    if (reduce) words.forEach(w => (w.style.color = 'rgb(15,16,18)')); else ticks.push(fill);
  }

  // ── параллакс фото в карточках работ ──
  if (!reduce) ticks.push(() => {
    const vh = innerHeight;
    $$('[data-par]').forEach(img => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < -50 || r.top > vh + 50) return;
      const k = ((r.top + r.height / 2) - vh / 2) / vh;
      img.style.setProperty('--py', (k * -6).toFixed(2) + '%');
    });
  });
})();
