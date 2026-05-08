/**
 * docs.js — entry point for docs.html
 *
 * - Builds the sidebar table of contents from h2/h3 IDs in the content
 * - Highlights active sidebar link using IntersectionObserver
 * - Wires up mobile sidebar toggle
 * - Wires up copy buttons
 */

import { initNav } from "./components/nav.js";
import { initCopyButtons } from "./components/copy-button.js";

function buildToc(sidebar) {
  const headings = document.querySelectorAll(
    ".docs-content h2[id], .docs-content h3[id]",
  );
  if (headings.length === 0) return [];

  const links = [];

  headings.forEach((heading) => {
    const isH3 = heading.tagName === "H3";
    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    link.className = `docs-sidebar__link${isH3 ? " docs-sidebar__link--sub" : ""}`;

    sidebar.appendChild(link);
    links.push({ link, heading });
  });

  return links;
}

function initActiveTracking(links) {
  if (links.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        const match = links.find(({ heading }) => heading === target);
        if (match && isIntersecting) {
          links.forEach(({ link }) => link.classList.remove("is-active"));
          match.link.classList.add("is-active");
          // Scroll sidebar link into view if needed
          match.link.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
      });
    },
    { rootMargin: "-10% 0px -80% 0px" },
  );

  links.forEach(({ heading }) => observer.observe(heading));
}

function initSidebarToggle(sidebar) {
  const toggle = document.querySelector(".docs-sidebar-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    sidebar.classList.toggle("is-open", !isOpen);
  });

  // Close sidebar on link click (mobile)
  sidebar.querySelectorAll(".docs-sidebar__link").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      sidebar.classList.remove("is-open");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initCopyButtons();

  const sidebar = document.getElementById("docs-sidebar");
  if (sidebar) {
    const links = buildToc(sidebar);
    initActiveTracking(links);
    initSidebarToggle(sidebar);
  }
});
