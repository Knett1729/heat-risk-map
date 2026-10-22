document.querySelectorAll(".nav").forEach(nav => {
  const toggle = nav.querySelector(".nav-reveal");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("nav--pinned");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Hide navigation" : "Show navigation");
    if (!open) toggle.blur();
  });

  nav.addEventListener("keydown", event => {
    if (event.key === "Escape" && nav.classList.contains("nav--pinned")) {
      nav.classList.remove("nav--pinned");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Show navigation");
      toggle.focus();
    }
  });
});
