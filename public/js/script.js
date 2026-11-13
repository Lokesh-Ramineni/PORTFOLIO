/* mobile menu (used by the inline onclick handlers in header.ejs) */
function dropdown() {
    const drop = document.querySelector(".drop");
    if (!drop) return;
    const open = drop.classList.toggle("active");
    drop.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
}

/* dark / light theme toggle (the saved choice is applied early in head.ejs) */
function toggleTheme() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";

    root.classList.add("theme-anim");
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", next === "light" ? "#f5f6f8" : "#111318");

    setTimeout(function () { root.classList.remove("theme-anim"); }, 400);
}

(function () {
    "use strict";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* keep the browser theme colour in sync with the saved theme */
    if (document.documentElement.getAttribute("data-theme") === "light") {
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute("content", "#f5f6f8");
    }

    /* ---------- highlight the current page in the nav ---------- */
    const path = location.pathname.replace(/\/+$/, "") || "/";
    document.querySelectorAll(".links a, .drop > a:not(.resume-btn)").forEach(function (a) {
        const href = (a.getAttribute("href") || "").replace(/\/+$/, "") || "/";
        if (href === path) a.classList.add("active");
    });

    /* ---------- typing effect: <span data-typed="one|two|three"> ---------- */
    document.querySelectorAll("[data-typed]").forEach(function (el) {
        const words = el.dataset.typed.split("|").filter(Boolean);
        if (reduceMotion || words.length === 0) return;

        let w = 0, i = 0, deleting = false;
        function tick() {
            const word = words[w];
            i += deleting ? -1 : 1;
            el.textContent = word.slice(0, i);

            let delay = deleting ? 35 : 75;
            if (!deleting && i === word.length) { deleting = true; delay = 1700; }
            else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 350; }
            setTimeout(tick, delay);
        }
        el.textContent = "";
        setTimeout(tick, 600);
    });

    /* ---------- scroll reveal ---------- */
    if ("IntersectionObserver" in window && !reduceMotion) {
        const targets = document.querySelectorAll(
            ".project_card, .timeline-item, .skills_container, .contact_info, .contact_cta"
        );
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.classList.add("in");
                io.unobserve(el);
                // drop the helper classes afterwards so hover effects work normally
                setTimeout(function () {
                    el.classList.remove("reveal", "in");
                    el.style.transitionDelay = "";
                }, 900);
            });
        }, { threshold: 0.12 });

        targets.forEach(function (el, idx) {
            el.classList.add("reveal");
            el.style.transitionDelay = (idx % 4) * 70 + "ms";
            io.observe(el);
        });
    }
})();
