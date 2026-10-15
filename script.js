/* =========================================================
   Foldline — interactions
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const range = (p, start, end) => clamp((p - start) / (end - start));
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2); // easeInOutCubic
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const money = (v, d = 2) => "$" + v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

  /* ---------------------------------------------------------
     DATA
  --------------------------------------------------------- */
  const PRODUCTS = [
    { id: "mailer", name: "Mailer box", img: "mailer", tags: ["ship", "eco"], badge: "Best seller", price: 0.62, min: 100,
      short: "The go-to box for e-commerce. Sturdy, stylish and ships without an outer carton.",
      features: ["Self-locking tuck lid", "E-flute corrugated board", "Print inside & out", "Ships flat to save space"],
      specs: ["Corrugated", "From 100 units"] },
    { id: "shipping", name: "Shipping box", img: "shipping", tags: ["ship", "eco"], price: 0.48, min: 250,
      short: "Strong, simple and cost-effective. Built for heavier products and bulk orders.",
      features: ["Double-wall option", "Up to 30 kg load", "1-colour logo printing", "100% recyclable"],
      specs: ["Corrugated", "From 250 units"] },
    { id: "carton", name: "Product box", img: "carton", tags: ["retail"], price: 0.32, min: 250,
      short: "A slim folding carton for cosmetics, supplements, candles and more.",
      features: ["Crisp full-colour print", "Tuck-end or auto-bottom", "Window cut-outs available", "Shelf-ready finish"],
      specs: ["Paperboard", "From 250 units"] },
    { id: "rigid", name: "Rigid gift box", img: "rigid", tags: ["gift", "retail"], badge: "Premium", price: 2.4, min: 100,
      short: "A luxurious two-piece box that makes every unboxing feel like a gift.",
      features: ["2 mm greyboard core", "Wrapped in premium paper", "Foil & emboss options", "Custom foam inserts"],
      specs: ["Rigid board", "From 100 units"] },
    { id: "bag", name: "Paper bag", img: "bag", tags: ["retail", "gift", "eco"], price: 0.55, min: 250,
      short: "Kraft carrier bags with twisted handles for shops, events and pop-ups.",
      features: ["Twisted paper handles", "Holds up to 8 kg", "Water-based inks", "Plastic-free"],
      specs: ["Kraft paper", "From 250 units"] },
    { id: "pouch", name: "Paper mailer", img: "pouch", tags: ["ship", "eco"], badge: "Plastic-free", badgeGreen: true, price: 0.28, min: 500,
      short: "Lightweight padded mailers for apparel, books and flat goods.",
      features: ["Paper padding, no bubble wrap", "Peel & seal closure", "Tear strip for easy opening", "Curbside recyclable"],
      specs: ["Padded paper", "From 500 units"] },
  ];

  // Quote builder box types: base price at default size & 500 units
  const TYPES = {
    mailer:   { label: "Mailer",   sub: "E-commerce",   base: 0.62, dims: [24, 17, 8],  eta: 10 },
    shipping: { label: "Shipping", sub: "Heavy duty",   base: 0.48, dims: [30, 20, 20], eta: 8 },
    carton:   { label: "Product",  sub: "Retail shelf", base: 0.32, dims: [8, 6, 16],   eta: 10 },
    rigid:    { label: "Rigid",    sub: "Luxury gift",  base: 2.40, dims: [22, 16, 8],  eta: 15 },
    bag:      { label: "Bag",      sub: "Carry out",    base: 0.55, dims: [26, 12, 32], eta: 12 },
    pouch:    { label: "Mailer bag", sub: "Plastic-free", base: 0.28, dims: [30, 24, 2], eta: 9 },
  };
  const QTY = [100, 250, 500, 1000, 2500, 5000, 10000, 25000];
  const MATERIAL = { kraft: 1, white: 1.12, black: 1.25 };
  const PRINT = { none: 0.82, one: 1, full: 1.3, both: 1.62 };
  const FINISH = { matte: 1, gloss: 1.06, soft: 1.15 };

  const REVIEWS = [
    { q: "Our unboxing videos went from ‘nice’ to ‘wow’. Customers literally comment on the box before the product.", n: "Maya Chen", r: "Founder, Bloomly", c: "#C98F55" },
    { q: "The instant pricing saved me days of back-and-forth emails. I had a proof the next morning.", n: "James Okafor", r: "Ops lead, Hearth Coffee", c: "#2F5D45" },
    { q: "We switched to custom-sized mailers and cut our shipping costs by almost a fifth. Huge win.", n: "Sofia Martins", r: "Head of E-com, Saltwater", c: "#3A3A3A" },
    { q: "Starting at 100 units meant we could launch properly without a warehouse full of boxes.", n: "Daniel Reyes", r: "Co-founder, Pebble", c: "#8C6A4A" },
    { q: "Beautiful print quality and the team caught a bleed issue in our artwork we'd totally missed.", n: "Aisha Rahman", r: "Brand designer, Lumen", c: "#5B6B8C" },
  ];

  /* ---------------------------------------------------------
     NAV
  --------------------------------------------------------- */
  const nav = $("#nav");
  const burger = $("#burger");
  const navLinks = $("#navLinks");
  let lastY = window.scrollY;

  burger.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!open));
    navLinks.classList.toggle("is-open", !open);
  });
  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a")) { burger.setAttribute("aria-expanded", "false"); navLinks.classList.remove("is-open"); }
  });

  function onNavScroll(y) {
    nav.classList.toggle("is-scrolled", y > 10);
    const goingDown = y > lastY;
    const menuOpen = navLinks.classList.contains("is-open");
    nav.classList.toggle("is-hidden", goingDown && y > 400 && !menuOpen);
    lastY = y;
  }

  // Active link highlight
  const sectionIds = ["products", "process", "quote", "eco", "faq"];
  const linkMap = new Map(sectionIds.map((id) => [id, $(`.nav__links a[href="#${id}"]`)]));
  const activeObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      const link = linkMap.get(en.target.id);
      if (link && en.isIntersecting) {
        linkMap.forEach((l) => l.classList.remove("is-active"));
        link.classList.add("is-active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sectionIds.forEach((id) => { const el = document.getElementById(id); el && activeObs.observe(el); });

  /* ---------------------------------------------------------
     HERO — scroll-driven folding box
  --------------------------------------------------------- */
  const hero = $("#hero");
  const box = $("#box3d");
  const shadow = $("#boxShadow");
  const intro = $("#heroIntro");
  const stepsEl = $("#heroSteps");
  const steps = $$("li", stepsEl);
  const progressBar = $("#heroProgress");
  const scrollHint = $("#scrollHint");
  const stageTag = $("#stageTag");
  const stageEl = $(".stage");
  const stageWrap = $("#heroStage");

  const W = 240, D = 170, H = 110, T = 34;
  const TAGS = [
    "Flat dieline · 240 × 170 × 110 mm",
    "Folding the walls…",
    "Closing the lid…",
    "Ready to ship ✓",
  ];
  let currentStep = -1;

  function fitStage() {
    const r = stageWrap.getBoundingClientRect();
    const mobile = window.innerWidth <= 900;
    const s = Math.min(r.width / 600, r.height / 660, mobile ? 0.78 : 1.05);
    stageEl.style.setProperty("--stage-scale", Math.max(0.4, s).toFixed(3));
  }

  function renderHero() {
    const rect = hero.getBoundingClientRect();
    const total = hero.offsetHeight - window.innerHeight;
    const p = clamp(-rect.top / total);

    // Timeline
    const pIntro = range(p, 0.02, 0.12);          // intro text fades out
    const pTilt  = ease(range(p, 0.10, 0.40));    // dieline lies down
    const f1     = ease(range(p, 0.22, 0.48));    // walls fold
    const f2     = ease(range(p, 0.50, 0.68));    // lid closes
    const f3     = ease(range(p, 0.56, 0.70));    // tuck flap
    const pShip  = ease(range(p, 0.72, 1.0));     // lift & spin

    const tilt = lerp(0, 58, pTilt) - pShip * 6;
    const spin = lerp(0, -34, pTilt) + pShip * -360;
    const offY = lerp(102, 0, ease(range(p, 0.10, 0.48))) + pShip * 10;
    const lift = Math.sin(pShip * Math.PI) * 60 + pShip * 18;
    const scale = lerp(0.92, 1, pTilt) + pShip * 0.08;

    box.style.setProperty("--f1", f1.toFixed(4));
    box.style.setProperty("--f2", f2.toFixed(4));
    box.style.setProperty("--f3", f3.toFixed(4));
    box.style.setProperty("--lift", lift.toFixed(2) + "px");
    box.style.setProperty("--dieline", (1 - range(p, 0.24, 0.42)).toFixed(3));
    box.style.transform =
      `translateY(${offY.toFixed(2)}px) scale(${scale.toFixed(4)}) rotateX(${tilt.toFixed(3)}deg) rotateZ(${spin.toFixed(3)}deg) translateZ(${(-H / 2 * f1).toFixed(2)}px)`;

    // Shadow follows the base on the "floor"
    const shOpacity = (0.25 + 0.6 * pTilt) * (1 - 0.45 * Math.sin(pShip * Math.PI));
    const shScale = 1 + 0.25 * Math.sin(pShip * Math.PI);
    shadow.style.opacity = shOpacity.toFixed(3);
    shadow.style.transform =
      `translateY(${(offY + lerp(0, 70, pTilt)).toFixed(2)}px) scale(${(lerp(1.25, 0.95, pTilt) * shScale).toFixed(3)}, ${(lerp(1.6, 0.55, pTilt) * shScale).toFixed(3)})`;

    // Copy
    intro.style.opacity = (1 - pIntro).toFixed(3);
    intro.style.transform = `translateY(${(-40 * easeOut(pIntro)).toFixed(2)}px)`;
    intro.style.pointerEvents = pIntro > 0.5 ? "none" : "";
    intro.style.visibility = pIntro >= 1 ? "hidden" : "";

    const pSteps = range(p, 0.08, 0.16);
    stepsEl.style.opacity = pSteps.toFixed(3);
    stepsEl.style.transform = `translateY(${(30 * (1 - easeOut(pSteps))).toFixed(2)}px)`;
    stepsEl.style.pointerEvents = pSteps > 0.5 ? "auto" : "none";

    const step = p < 0.22 ? 0 : p < 0.5 ? 1 : p < 0.71 ? 2 : 3;
    if (step !== currentStep) {
      currentStep = step;
      steps.forEach((li, i) => {
        li.classList.toggle("is-active", i === step);
        li.classList.toggle("is-done", i < step);
      });
      stageTag.style.opacity = 0;
      setTimeout(() => { stageTag.textContent = TAGS[step]; stageTag.style.opacity = 1; }, 150);
    }

    progressBar.style.transform = `scaleX(${p.toFixed(4)})`;
    scrollHint.style.opacity = p > 0.015 ? 0 : 1;
  }

  // Click a step to jump to it
  const STEP_TARGETS = [0.17, 0.42, 0.66, 0.97];
  steps.forEach((li, i) => {
    li.style.cursor = "pointer";
    li.addEventListener("click", () => {
      const total = hero.offsetHeight - window.innerHeight;
      window.scrollTo({ top: hero.offsetTop + total * STEP_TARGETS[i], behavior: "smooth" });
    });
  });

  /* ---------------------------------------------------------
     SCROLL LOOP
  --------------------------------------------------------- */
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      onNavScroll(window.scrollY);
      renderHero();
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => { fitStage(); renderHero(); updateReviews(); });
  fitStage();
  renderHero();

  /* ---------------------------------------------------------
     REVEAL ON SCROLL
  --------------------------------------------------------- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); revealObs.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  function observeReveals(root = document) {
    // Stagger siblings
    $$(".reveal", root).forEach((el) => {
      const sibs = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
      const idx = sibs.indexOf(el);
      if (idx > 0) el.style.setProperty("--d", `${Math.min(idx, 6) * 0.08}s`);
      revealObs.observe(el);
    });
  }

  /* ---------------------------------------------------------
     PRODUCTS
  --------------------------------------------------------- */
  const grid = $("#productGrid");
  grid.innerHTML = PRODUCTS.map((p) => `
    <article class="card reveal" tabindex="0" role="button" data-id="${p.id}" data-tags="${p.tags.join(" ")}" aria-label="${p.name} — quick view">
      <div class="card__media">
        <img src="assets/images/${p.img}.jpg" alt="${p.name}" loading="lazy" />
        ${p.badge ? `<span class="card__badge ${p.badgeGreen ? "card__badge--green" : ""}">${p.badge}</span>` : ""}
        <span class="card__quick">Quick view</span>
      </div>
      <div class="card__body">
        <div class="card__top">
          <h3>${p.name}</h3>
          <span class="card__price">from <strong>${money(p.price)}</strong></span>
        </div>
        <p>${p.short}</p>
        <div class="card__specs">${p.specs.map((s) => `<span>${s}</span>`).join("")}</div>
      </div>
    </article>`).join("");

  // Filters
  $$(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      $$(".chip").forEach((c) => { c.classList.remove("is-active"); c.setAttribute("aria-selected", "false"); });
      chip.classList.add("is-active");
      chip.setAttribute("aria-selected", "true");
      const f = chip.dataset.filter;
      let i = 0;
      $$(".card", grid).forEach((card) => {
        const show = f === "all" || card.dataset.tags.split(" ").includes(f);
        card.classList.toggle("is-hidden", !show);
        card.classList.remove("is-entering");
        if (show) {
          void card.offsetWidth; // restart animation
          card.style.setProperty("--d", `${i++ * 0.06}s`);
          card.classList.add("is-in", "is-entering");
        }
      });
    });
  });

  // Subtle tilt on hover (desktop)
  if (window.matchMedia("(hover: hover)").matches) {
    grid.addEventListener("mousemove", (e) => {
      const card = e.target.closest(".card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-6px) perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg)`;
    });
    grid.addEventListener("mouseout", (e) => {
      const card = e.target.closest(".card");
      if (card && !card.contains(e.relatedTarget)) card.style.transform = "";
    });
  }

  // Product modal
  const pModal = $("#productModal");
  let activeProduct = null;
  function openProduct(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    activeProduct = p;
    $("#pmImg").src = `assets/images/${p.img}.jpg`;
    $("#pmImg").alt = p.name;
    $("#pmTag").textContent = p.specs[0] + " · min. " + p.min + " units";
    $("#pmTitle").textContent = p.name;
    $("#pmDesc").textContent = p.short;
    $("#pmList").innerHTML = p.features.map((f) => `<li>${f}</li>`).join("");
    $("#pmPrice").textContent = money(p.price);
    openModal(pModal);
  }
  grid.addEventListener("click", (e) => { const c = e.target.closest(".card"); c && openProduct(c.dataset.id); });
  grid.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("card")) { e.preventDefault(); openProduct(e.target.dataset.id); }
  });
  $("#pmUse").addEventListener("click", () => {
    closeModal(pModal);
    if (activeProduct) setType(activeProduct.id, true);
    setTimeout(() => $("#quote").scrollIntoView({ behavior: "smooth" }), 250);
  });

  /* ---------------------------------------------------------
     MODALS
  --------------------------------------------------------- */
  let lastFocus = null;
  function openModal(m) {
    lastFocus = document.activeElement;
    m.classList.add("is-open");
    m.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => { const f = m.querySelector("input, button.btn, .modal__close"); f && f.focus({ preventScroll: true }); }, 60);
  }
  function closeModal(m) {
    m.classList.remove("is-open");
    m.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  }
  $$(".modal").forEach((m) => {
    m.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(m); });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") $$(".modal.is-open").forEach(closeModal);
  });

  /* ---------------------------------------------------------
     QUOTE BUILDER
  --------------------------------------------------------- */
  const state = { type: "mailer", L: 24, W: 17, H: 8, qi: 2, material: "kraft", print: "one", finish: "matte", unit: "cm" };
  const typeGroup = $("#typeGroup");
  const dimL = $("#dimL"), dimW = $("#dimW"), dimH = $("#dimH"), qty = $("#qty");
  const cube = $("#cube");
  const cubeLogo = $("#cubeLogo");

  typeGroup.innerHTML = Object.entries(TYPES).map(([k, t]) =>
    `<button type="button" class="seg" data-type="${k}" aria-pressed="false"><strong>${t.label}</strong><span>${t.sub}</span></button>`).join("");

  $("#qtyTicks").innerHTML = QTY.map((q, i) =>
    `<button type="button" data-qi="${i}">${q >= 1000 ? q / 1000 + "K" : q}</button>`).join("");

  function setType(type, resetDims) {
    state.type = type;
    $$(".seg", typeGroup).forEach((b) => {
      const on = b.dataset.type === type;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    if (resetDims) {
      [state.L, state.W, state.H] = TYPES[type].dims;
      dimL.value = state.L; dimW.value = state.W; dimH.value = state.H;
    }
    updateQuote();
  }
  typeGroup.addEventListener("click", (e) => { const b = e.target.closest(".seg"); b && setType(b.dataset.type, true); });

  const fmtLen = (cm) => state.unit === "cm" ? `${cm} cm` : `${(cm / 2.54).toFixed(1)}″`;
  const fmtDims = () => state.unit === "cm"
    ? `${state.L} × ${state.W} × ${state.H} cm`
    : `${(state.L / 2.54).toFixed(1)} × ${(state.W / 2.54).toFixed(1)} × ${(state.H / 2.54).toFixed(1)} in`;

  function paintRange(input) {
    const p = ((input.value - input.min) / (input.max - input.min)) * 100;
    input.style.setProperty("--p", p + "%");
  }

  function addBusinessDays(date, n) {
    const d = new Date(date);
    while (n > 0) { d.setDate(d.getDate() + 1); const w = d.getDay(); if (w !== 0 && w !== 6) n--; }
    return d;
  }
  const fmtDate = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  function unitPriceFor(qi) {
    const t = TYPES[state.type];
    const [dl, dw, dh] = t.dims;
    const refArea = 2 * (dl * dw + dl * dh + dw * dh);
    const area = 2 * (state.L * state.W + state.L * state.H + state.W * state.H);
    const size = 0.4 + 0.6 * (area / refArea);
    const q = QTY[qi];
    const qtyF = Math.pow(q / 500, -0.22);
    return Math.max(0.12, t.base * size * MATERIAL[state.material] * PRINT[state.print] * FINISH[state.finish] * qtyF);
  }

  // Animated number
  const tweens = new WeakMap();
  function tweenText(el, to, fmt) {
    const from = tweens.get(el) ?? to;
    const start = performance.now(), dur = 450;
    cancelAnimationFrame(el._raf);
    const step = (now) => {
      const t = easeOut(clamp((now - start) / dur));
      const v = from + (to - from) * t;
      el.textContent = fmt(v);
      tweens.set(el, v);
      if (t < 1) el._raf = requestAnimationFrame(step);
    };
    el._raf = requestAnimationFrame(step);
  }

  function updateQuote() {
    state.L = +dimL.value; state.W = +dimW.value; state.H = +dimH.value; state.qi = +qty.value;
    state.material = $('input[name="material"]:checked').value;
    state.print = $("#print").value;
    state.finish = $('input[name="finish"]:checked').value;

    [dimL, dimW, dimH, qty].forEach(paintRange);
    $("#outL").textContent = fmtLen(state.L);
    $("#outW").textContent = fmtLen(state.W);
    $("#outH").textContent = fmtLen(state.H);
    $$("#qtyTicks button").forEach((b) => b.classList.toggle("is-active", +b.dataset.qi === state.qi));

    const q = QTY[state.qi];
    const unit = unitPriceFor(state.qi);
    const total = unit * q;
    tweenText($("#unitPrice"), unit, (v) => money(v));
    tweenText($("#totalPrice"), total, (v) => money(v, 0));
    $("#sumQty").textContent = q.toLocaleString("en-US") + " boxes";
    $("#sumSize").textContent = fmtDims();

    let days = TYPES[state.type].eta + (q >= 5000 ? 3 : 0) + (q >= 25000 ? 4 : 0) + (state.print === "both" ? 2 : 0);
    const now = new Date();
    $("#sumEta").textContent = `${fmtDate(addBusinessDays(now, days))} – ${fmtDate(addBusinessDays(now, days + 3))}`;

    const save = state.qi > 0 ? Math.round((1 - unit / unitPriceFor(0)) * 100) : 0;
    $("#sumSave").textContent = save > 0 ? `✓ You save ${save}% per box vs. ordering 100` : "Tip: order more to unlock bulk savings";
    $("#sumSave").style.color = save > 0 ? "" : "var(--muted)";

    updateCube();
  }

  const COLORS = {
    kraft: { top: "#D6A36E", front: "#C99662", side: "#B0804E", back: "#B5844F", bottom: "#9E7144", logo: "#1c1712" },
    white: { top: "#FBFAF7", front: "#F0EDE7", side: "#E1DDD5", back: "#E6E2DA", bottom: "#D2CDC3", logo: "#141414" },
    black: { top: "#3A3A3A", front: "#2E2E2E", side: "#222222", back: "#262626", bottom: "#1A1A1A", logo: "#E9D3B8" },
  };
  function updateCube() {
    const max = Math.max(state.L, state.W, state.H);
    const k = 170 / Math.max(max, 1);
    cube.style.setProperty("--l", (state.L * k).toFixed(1) + "px");
    cube.style.setProperty("--w", (state.W * k).toFixed(1) + "px");
    cube.style.setProperty("--h", Math.max(state.H * k, 4).toFixed(1) + "px");
    const c = COLORS[state.material];
    Object.entries({ top: c.top, front: c.front, side: c.side, back: c.back, bottom: c.bottom }).forEach(([n, v]) => cube.style.setProperty(`--c-${n}`, v));
    cube.style.setProperty("--logo", state.print === "full" || state.print === "both" ? "#fff" : c.logo);
    cubeLogo.style.opacity = state.print === "none" ? 0 : 1;
    const pattern = (state.print === "full" || state.print === "both")
      ? "radial-gradient(circle at 30% 30%, rgba(255,255,255,.18) 0 3px, transparent 4px), linear-gradient(135deg, rgba(47,93,69,.85), rgba(201,143,85,.75))"
      : "none";
    cube.style.setProperty("--pattern", pattern);
    const sheen = state.finish === "gloss"
      ? "linear-gradient(120deg, transparent 30%, rgba(255,255,255,.35) 45%, transparent 60%)"
      : state.finish === "soft" ? "linear-gradient(rgba(255,255,255,.04), rgba(0,0,0,.06))" : "none";
    cube.style.setProperty("--sheen", sheen);
  }

  [dimL, dimW, dimH, qty].forEach((el) => el.addEventListener("input", updateQuote));
  $("#print").addEventListener("change", updateQuote);
  $$('input[name="material"], input[name="finish"]').forEach((el) => el.addEventListener("change", updateQuote));
  $("#qtyTicks").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { qty.value = b.dataset.qi; updateQuote(); } });
  $$(".unit-toggle button").forEach((b) => b.addEventListener("click", () => {
    state.unit = b.dataset.unit;
    $$(".unit-toggle button").forEach((x) => x.classList.toggle("is-active", x === b));
    updateQuote();
  }));

  // Draggable preview with idle auto-rotate
  const preview = $("#preview");
  let rx = -24, ry = -35, dragging = false, px = 0, py = 0, lastInteract = 0;
  preview.addEventListener("pointerdown", (e) => { dragging = true; px = e.clientX; py = e.clientY; preview.setPointerCapture(e.pointerId); });
  preview.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    ry += (e.clientX - px) * 0.5;
    rx = clamp(rx - (e.clientY - py) * 0.4, -80, 20);
    px = e.clientX; py = e.clientY; lastInteract = performance.now();
  });
  const endDrag = () => { dragging = false; lastInteract = performance.now(); };
  preview.addEventListener("pointerup", endDrag);
  preview.addEventListener("pointercancel", endDrag);

  let previewVisible = false;
  new IntersectionObserver(([en]) => { previewVisible = en.isIntersecting; }).observe(preview);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  (function spinLoop() {
    if (previewVisible && !dragging && !reduceMotion && performance.now() - lastInteract > 2000) ry += 0.18;
    cube.style.setProperty("--rx", rx + "deg");
    cube.style.setProperty("--ry", ry + "deg");
    requestAnimationFrame(spinLoop);
  })();

  setType("mailer", true);

  // Quote modal
  const qModal = $("#quoteModal");
  function openQuote() {
    const t = TYPES[state.type];
    $("#qmSummary").innerHTML = `<strong>${QTY[state.qi].toLocaleString("en-US")} × ${t.label} box</strong> · ${fmtDims()} · ${state.material}, ${$("#print").selectedOptions[0].text.toLowerCase()} · est. <strong>${$("#totalPrice").textContent}</strong>`;
    $("#qmForm").hidden = false;
    $("#qmDone").hidden = true;
    openModal(qModal);
  }
  $("#openQuote").addEventListener("click", openQuote);
  $$("[data-open-quote]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); openQuote(); }));

  $("#quoteForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    let ok = true;
    $$(".input", form).forEach((wrap) => {
      const input = wrap.querySelector("input[required]");
      if (!input) return;
      const valid = input.type === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()) : input.value.trim().length > 1;
      wrap.classList.toggle("is-invalid", !valid);
      if (!valid && ok) { input.focus(); ok = false; }
    });
    if (!ok) return;
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = "Sending…";
    setTimeout(() => {
      $("#qmForm").hidden = true;
      $("#qmDone").hidden = false;
      form.reset();
      btn.disabled = false;
      btn.innerHTML = 'Send my request <span class="arrow">→</span>';
    }, 900);
  });
  $$("#quoteForm input").forEach((i) => i.addEventListener("input", () => i.closest(".input").classList.remove("is-invalid")));

  /* ---------------------------------------------------------
     COUNTERS
  --------------------------------------------------------- */
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target, to = parseFloat(el.dataset.count), dec = +(el.dataset.decimals || 0);
      const start = performance.now(), dur = 1600;
      const tick = (now) => {
        const t = easeOut(clamp((now - start) / dur));
        el.textContent = (to * t).toFixed(dec);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObs.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach((el) => countObs.observe(el));

  /* ---------------------------------------------------------
     REVIEWS SLIDER
  --------------------------------------------------------- */
  const track = $("#reviewTrack");
  const dotsEl = $("#reviewDots");
  track.innerHTML = REVIEWS.map((r) => `
    <figure class="review">
      <div class="review__stars" aria-label="5 out of 5 stars">★★★★★</div>
      <blockquote>“${r.q}”</blockquote>
      <figcaption class="review__who">
        <span class="avatar" style="background:${r.c}">${r.n.split(" ").map((w) => w[0]).join("")}</span>
        <div><strong>${r.n}</strong><span>${r.r}</span></div>
      </figcaption>
    </figure>`).join("");

  let rIndex = 0;
  const perView = () => (window.innerWidth <= 640 ? 1 : window.innerWidth <= 1080 ? 2 : 3);
  const maxIndex = () => REVIEWS.length - perView();

  function updateReviews() {
    const max = maxIndex();
    rIndex = ((rIndex % (max + 1)) + (max + 1)) % (max + 1);
    const card = track.children[0];
    const gap = 20;
    track.style.transform = `translateX(${-(card.offsetWidth + gap) * rIndex}px)`;
    if (dotsEl.children.length !== max + 1) {
      dotsEl.innerHTML = Array.from({ length: max + 1 }, (_, i) => `<button aria-label="Go to review ${i + 1}"></button>`).join("");
    }
    [...dotsEl.children].forEach((d, i) => d.classList.toggle("is-active", i === rIndex));
  }
  $("#prevReview").addEventListener("click", () => { rIndex--; updateReviews(); resetAuto(); });
  $("#nextReview").addEventListener("click", () => { rIndex++; updateReviews(); resetAuto(); });
  dotsEl.addEventListener("click", (e) => { const i = [...dotsEl.children].indexOf(e.target); if (i > -1) { rIndex = i; updateReviews(); resetAuto(); } });

  // swipe
  let sx = null;
  track.addEventListener("pointerdown", (e) => { sx = e.clientX; });
  track.addEventListener("pointerup", (e) => {
    if (sx === null) return;
    const dx = e.clientX - sx;
    if (Math.abs(dx) > 40) { rIndex += dx < 0 ? 1 : -1; updateReviews(); resetAuto(); }
    sx = null;
  });

  let auto;
  const resetAuto = () => { clearInterval(auto); auto = setInterval(() => { rIndex++; updateReviews(); }, 6000); };
  const reviewsWrap = $(".reviews");
  reviewsWrap.addEventListener("mouseenter", () => clearInterval(auto));
  reviewsWrap.addEventListener("mouseleave", resetAuto);
  updateReviews();
  resetAuto();

  /* ---------------------------------------------------------
     FAQ — smooth accordion (one open at a time)
  --------------------------------------------------------- */
  $$("#accordion details").forEach((d) => {
    const summary = d.querySelector("summary");
    const body = d.querySelector("p");
    summary.addEventListener("click", (e) => {
      e.preventDefault();
      if (d.open) {
        collapse(d, body);
      } else {
        $$("#accordion details[open]").forEach((o) => o !== d && collapse(o, o.querySelector("p")));
        d.open = true;
        const h = body.scrollHeight;
        body.animate([{ height: "0px", opacity: 0 }, { height: h + "px", opacity: 1 }], { duration: 380, easing: "cubic-bezier(.22,.8,.24,1)" });
      }
    });
  });
  function collapse(d, body) {
    const h = body.scrollHeight;
    const a = body.animate([{ height: h + "px", opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 300, easing: "cubic-bezier(.22,.8,.24,1)" });
    a.onfinish = () => { d.open = false; };
  }

  /* ---------------------------------------------------------
     NEWSLETTER + TOAST
  --------------------------------------------------------- */
  const toast = $("#toast");
  let toastT;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("is-show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove("is-show"), 3200);
  }
  $("#newsletter").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.currentTarget, input = f.querySelector("input");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
      f.classList.remove("is-error"); void f.offsetWidth; f.classList.add("is-error");
      showToast("Please enter a valid email address");
      return;
    }
    f.classList.remove("is-error");
    input.value = "";
    showToast("You're in! Packaging tips are on their way ✉");
  });

  $("#year").textContent = new Date().getFullYear();

  observeReveals();
})();
