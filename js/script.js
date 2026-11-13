document.documentElement.classList.add("js");

(() => {
  "use strict";

  const selectors = {
    header: "[data-header]",
    menuToggle: "[data-menu-toggle]",
    nav: "[data-nav]",
    reveal: ".reveal",
    section: "main section[id]",
    navLink: "[data-nav] a[href^='#']",
    demoLink: "[data-demo-link]",
    toast: "[data-toast]",
    year: "[data-year]",
  };

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

  const initHeader = () => {
    const header = $(selectors.header);
    if (!header) return;

    const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 24);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  };

  const initMenu = () => {
    const toggle = $(selectors.menuToggle);
    const nav = $(selectors.nav);
    if (!toggle || !nav) return;

    const closeMenu = () => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
      nav.classList.remove("open");
      document.body.classList.remove("menu-open");
    };

    const openMenu = () => {
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Fechar menu");
      nav.classList.add("open");
      document.body.classList.add("menu-open");
    };

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeMenu() : openMenu();
    });

    $$("a", nav).forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 960) closeMenu();
    });
  };

  const initRevealAnimations = () => {
    const items = $$(selectors.reveal);
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("revealed");
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -55px" }
    );

    items.forEach((item) => observer.observe(item));
  };

  const initActiveNavigation = () => {
    const sections = $$(selectors.section);
    const links = $$(selectors.navLink);
    if (!sections.length || !links.length || !("IntersectionObserver" in window)) return;

    const linksById = new Map(links.map((link) => [link.getAttribute("href").slice(1), link]));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => link.classList.remove("active"));
          linksById.get(entry.target.id)?.classList.add("active");
        });
      },
      { rootMargin: "-35% 0px -55%", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  };

  const initDemoLinks = () => {
    const toast = $(selectors.toast);
    if (!toast) return;
    let timer;

    $$(selectors.demoLink).forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        window.clearTimeout(timer);
        toast.classList.add("visible");
        timer = window.setTimeout(() => toast.classList.remove("visible"), 3200);
      });
    });
  };

  const initCurrentYear = () => {
    $$(selectors.year).forEach((element) => {
      element.textContent = new Date().getFullYear();
    });
  };

  const init = () => {
    initHeader();
    initMenu();
    initRevealAnimations();
    initActiveNavigation();
    initDemoLinks();
    initCurrentYear();
  };

  init();
})();
