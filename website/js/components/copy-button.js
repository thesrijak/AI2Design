/**
 * Copy button — wires up all .copy-btn elements.
 * Reads data-copy-target attribute to find the element
 * whose textContent to copy. Falls back to closest pre/code.
 */

export function initCopyButtons() {
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const targetId = btn.getAttribute("data-copy-target");
      const target = targetId
        ? document.getElementById(targetId)
        : btn.closest(".code-block")?.querySelector("pre");
      if (!target) return;

      const text = target.textContent ?? "";

      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Fallback for browsers without clipboard API permission
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }

      // Feedback
      const original = btn.innerHTML;
      btn.classList.add("is-copied");
      btn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path d="M2.5 8.5L6.5 12.5L13.5 4.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Copied!
      `;
      setTimeout(() => {
        btn.innerHTML = original;
        btn.classList.remove("is-copied");
      }, 2000);
    });
  });
}
