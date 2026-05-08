/**
 * Nav module — mobile hamburger toggle + active link detection.
 */

export function initNav() {
  const toggle = document.querySelector(".nav__toggle");
  const drawer = document.getElementById("nav-drawer");

  if (toggle && drawer) {
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      drawer.setAttribute("aria-hidden", String(isOpen));
      drawer.classList.toggle("is-open", !isOpen);
    });

    // Close drawer when any drawer link is clicked
    drawer.querySelectorAll(".nav__drawer-link, .btn").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        drawer.setAttribute("aria-hidden", "true");
        drawer.classList.remove("is-open");
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!toggle.contains(e.target) && !drawer.contains(e.target)) {
        toggle.setAttribute("aria-expanded", "false");
        drawer.setAttribute("aria-hidden", "true");
        drawer.classList.remove("is-open");
      }
    });
  }

  // Active link detection — highlight nav link whose href matches the current section
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
  if (navLinks.length === 0) return;

  const sections = Array.from(navLinks)
    .map((link) => {
      const id = link.getAttribute("href").slice(1);
      return { link, section: document.getElementById(id) };
    })
    .filter(({ section }) => section !== null);

  if (sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        const match = sections.find(({ section }) => section === target);
        if (match) {
          match.link.toggleAttribute("aria-current", isIntersecting);
          if (isIntersecting) {
            navLinks.forEach((l) => {
              if (l !== match.link) l.removeAttribute("aria-current");
            });
          }
        }
      });
    },
    { rootMargin: "-20% 0px -70% 0px" },
  );

  sections.forEach(({ section }) => observer.observe(section));
}
