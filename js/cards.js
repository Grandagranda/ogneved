// Карточки, общие для главной и разделов
(function () {
  const D = window.OG, I = window.OG_UI.ICO;

  // «4 рабочих дня», «5 + 2 рабочих дней» — по последнему числу
  const dn = t => { const n = +String(t).match(/\d+(?!.*\d)/)[0], a = n % 10, b = n % 100;
    return 'раб. ' + (a === 1 && b !== 11 ? 'день' : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 'дня' : 'дней'); };

  const C = {
    dn,
    svc: (s, i) => `<article class="card svc">
      ${s.img ? `<div class="svc-ph"><img src="img/${s.img}" alt=""></div>` : `<div class="ph svc-ph" data-ph="${s.short} · PNG"></div>`}
      <div class="svc-b">
        <div class="svc-m"><span>${String(i + 1).padStart(2, '0')}</span><span>${s.days} раб. дней</span></div>
        <h3 class="svc-t"><a class="cover-link" href="usluga.html?id=${s.id}">${s.title}</a></h3>
        <p class="svc-d">${s.lead}</p>
        <div class="svc-f"><div><small>Стоимость</small><b>от ${D.rub(s.price)}</b></div>
          <button class="btn btn--dark btn--sm" data-open="form" data-q="Услуга: ${s.short}">Заказать</button></div>
      </div>
    </article>`,

    obj: (o, i) => `<article class="card obj">
      ${o.img ? `<div class="obj-ph"><img src="img/${o.img}" alt=""></div>` : `<div class="ph obj-ph" data-ph="3D-изображение · PNG"></div>`}
      <div class="obj-b"><span class="obj-n">${String(i + 1).padStart(2, '0')}</span><h3 class="obj-t">${o.t}</h3>
        <button class="obj-btn cover-link" data-open="form" data-q="Объект: ${o.t}"><span>Получить предложение</span><span class="rnd">${I.arUp}</span></button></div>
    </article>`,

    work: w => `<article class="card work">
      <a class="work-img" href="rabota.html?id=${w.id}" tabindex="-1"><img src="img/${w.img}.webp" alt="${w.obj}" loading="lazy"><span class="tag">${w.type}</span></a>
      <div class="work-b">
        <h3 class="work-t"><a class="cover-link" href="rabota.html?id=${w.id}">${w.obj}</a></h3>
        <dl class="work-dl"><div><dt>Регион</dt><dd>${w.city}</dd></div><div><dt>Стоимость</dt><dd>${w.cost} тыс. ₽</dd></div><div><dt>Срок</dt><dd>${w.days} ${dn(w.days)}</dd></div></dl>
        <p class="work-x">${w.extra ? `<b>+</b>${w.extra}` : '<span class="muted">Без дополнительных услуг</span>'}</p>
      </div>
    </article>`,

    art: a => `<article class="card art">
      <div class="art-img"><img src="img/${a.img}.webp" alt="" loading="lazy"></div>
      <div class="art-b"><p class="art-m"><span>${a.tag}</span><time>${a.date}</time></p>
        <h3 class="art-t"><a class="cover-link" href="statya.html?id=${a.id}">${a.t}</a></h3></div>
    </article>`,

    cover: b => b.img ? `<img src="img/${b.img}.webp" alt="" loading="lazy">`
      : `<div class="cv cv--${b.cover.c}"><div class="cv-h">${b.cover.h}</div><div class="cv-n">${b.num}</div><div class="cv-t">${b.t}</div><div class="cv-l"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>`,

    book: b => `<a class="folder" href="kniga.html?id=${b.id}">
      <span class="f-back"></span>
      <span class="f-doc">${C.cover(b)}</span>
      <span class="f-front">
        <span class="f-k">${b.kind} · ${b.num}</span>
        <span class="f-t">${b.t}</span>
        <span class="f-d">${b.news ? `<em>${b.news}</em>` : ''}<time>${b.date}</time></span>
      </span>
    </a>`,

    faq: (f, i) => `<div class="acc-i${i === 0 ? ' is-open' : ''}"><button class="acc-q" aria-expanded="${i === 0}"><span>${f.q}</span><i>${I.plus}</i></button><div class="acc-a"><div><p>${f.a}</p></div></div></div>`,

    plist: () => D.services.map(s => `<li><a href="usluga.html?id=${s.id}"><b>${s.short}</b><span>${s.days} раб. дней</span></a><strong>от ${D.rub(s.price)}</strong></li>`).join(''),
  };

  C.bindAcc = root => root.addEventListener('click', e => {
    const q = e.target.closest('.acc-q'); if (!q) return;
    const it = q.parentElement, on = !it.classList.contains('is-open');
    it.classList.toggle('is-open', on); q.setAttribute('aria-expanded', on);
  });
  window.OG_C = C;
})();
