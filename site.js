(() => {
  const tabs = Array.from(document.querySelectorAll(".os-tabs [data-os]"));
  const panels = Array.from(document.querySelectorAll("[data-panel]"));

  function showOs(os) {
    tabs.forEach((tab) => {
      const active = tab.dataset.os === os;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });
    panels.forEach((panel) => {
      const active = panel.dataset.panel === os;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  }

  tabs.forEach((tab) => tab.addEventListener("click", () => showOs(tab.dataset.os)));

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const target = document.getElementById(btn.dataset.copy);
      if (!target) return;
      try {
        await navigator.clipboard.writeText(target.textContent.trim());
        const prev = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(() => { btn.textContent = prev; }, 1400);
      } catch {}
    });
  });

  if (/Windows/i.test(navigator.userAgent)) showOs("windows");
})();
