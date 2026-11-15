const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Play each animated illustration only while it is on screen.
if (!reducedMotion) {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      entry.target.style.setProperty("--illos-play", entry.isIntersecting ? "running" : "paused");
    }
  });
  for (const el of document.querySelectorAll("[data-illos]")) {
    el.style.setProperty("--illos-play", "paused");
    io.observe(el);
  }
}

// Header gets its scrolled state once the page moves.
const nav = document.getElementById("top");
const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 8);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Mobile menu.
const menu = document.getElementById("menu");
const menuBtn = document.getElementById("menu-btn");
const setMenu = (open) => {
  menu.hidden = !open;
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
};
menuBtn.addEventListener("click", () => setMenu(menu.hidden));
menu.addEventListener("click", (e) => {
  if (e.target.closest("a")) setMenu(false);
});
addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !menu.hidden) {
    setMenu(false);
    menuBtn.focus();
  }
});
matchMedia("(min-width: 901px)").addEventListener("change", () => setMenu(false));

// Tabs: click, arrow keys, Home and End.
const ARROWS = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

const tabs = (root) => {
  const list = [...root.querySelectorAll('[role="tab"]')];
  const select = (tab, focus) => {
    for (const t of list) {
      const on = t === tab;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    }
    if (focus) tab.focus();
  };
  list.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (e) => {
      let next = null;
      if (e.key in ARROWS) next = list[(i + ARROWS[e.key] + list.length) % list.length];
      else if (e.key === "Home") next = list[0];
      else if (e.key === "End") next = list[list.length - 1];
      if (next) {
        e.preventDefault();
        select(next, true);
      }
    });
  });
  return select;
};

const selectPersona = tabs(document.querySelector(".personas"));
tabs(document.querySelector(".steps"));

// Footer team links open the matching team tab.
for (const link of document.querySelectorAll("[data-persona]")) {
  link.addEventListener("click", () => selectPersona(document.getElementById(link.dataset.persona)));
}

// Monthly / yearly pricing switch.
const period = document.querySelector(".period");
const radios = [...period.querySelectorAll('[role="radio"]')];
const setPeriod = (radio, focus) => {
  for (const r of radios) {
    const on = r === radio;
    r.setAttribute("aria-checked", on);
    r.tabIndex = on ? 0 : -1;
  }
  const key = radio.dataset.period;
  for (const el of document.querySelectorAll("[data-month]")) el.textContent = el.dataset[key];
  if (focus) radio.focus();
};
radios.forEach((radio, i) => {
  radio.addEventListener("click", () => setPeriod(radio));
  radio.addEventListener("keydown", (e) => {
    const step = ARROWS[e.key];
    if (step) {
      e.preventDefault();
      setPeriod(radios[(i + step + radios.length) % radios.length], true);
    }
  });
});

// Copy booking link.
const copyBtn = document.querySelector("[data-copy]");
const copyStatus = document.querySelector(".share__status");
let copyTimer;
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(copyBtn.dataset.copy);
  } catch {}
  copyBtn.classList.add("is-done");
  copyBtn.querySelector(".share__word").textContent = "Copied";
  copyStatus.textContent = "Booking link copied";
  clearTimeout(copyTimer);
  copyTimer = setTimeout(() => {
    copyBtn.classList.remove("is-done");
    copyBtn.querySelector(".share__word").textContent = "Copy";
    copyStatus.textContent = "";
  }, 1600);
});
