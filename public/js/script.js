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
    if (meta) meta.setAttribute("content", next === "light" ? "#f3f6ff" : "#05070d");

    document.dispatchEvent(new Event("themechange"));
    setTimeout(function () { root.classList.remove("theme-anim"); }, 450);
}

(function () {
    "use strict";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

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
                }, 1000);
            });
        }, { threshold: 0.12 });

        targets.forEach(function (el, idx) {
            el.classList.add("reveal");
            el.style.transitionDelay = (idx % 4) * 80 + "ms";
            io.observe(el);
        });
    }

    /* ---------- card spotlight + cursor glow + hero tilt ---------- */
    const glow = document.querySelector(".cursor-glow");
    const hero = document.querySelector(".hero");
    const frame = document.querySelector(".visual-frame");
    let px = 0, py = 0, raf = 0;

    function frameUpdate() {
        raf = 0;
        if (glow) glow.style.transform = "translate3d(" + px + "px," + py + "px,0)";
    }

    document.addEventListener("pointermove", function (e) {
        if (e.pointerType === "touch") return;

        const card = e.target.closest && e.target.closest(".spot");
        if (card) {
            const r = card.getBoundingClientRect();
            card.style.setProperty("--mx", e.clientX - r.left + "px");
            card.style.setProperty("--my", e.clientY - r.top + "px");
        }

        if (glow && finePointer && !reduceMotion) {
            px = e.clientX; py = e.clientY;
            glow.classList.add("on");
            if (!raf) raf = requestAnimationFrame(frameUpdate);
        }

        if (frame && hero && finePointer && !reduceMotion) {
            const r = hero.getBoundingClientRect();
            const nx = (e.clientX - r.left) / r.width - 0.5;
            const ny = (e.clientY - r.top) / r.height - 0.5;
            frame.style.setProperty("--ry", (nx * 8).toFixed(2) + "deg");
            frame.style.setProperty("--rx", (-ny * 8).toFixed(2) + "deg");
        }
    }, { passive: true });

    if (hero && frame) {
        hero.addEventListener("pointerleave", function () {
            frame.style.setProperty("--rx", "0deg");
            frame.style.setProperty("--ry", "0deg");
        });
    }

    /* ---------- particle network background ---------- */
    const canvas = document.getElementById("bg-canvas");
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const PALETTES = {
        dark:  { a: "34,211,238", b: "139,92,246", m: "244,114,182", dot: 0.75, link: 0.16, mouse: 0.32 },
        light: { a: "14,116,144", b: "109,40,217", m: "219,39,119",  dot: 0.60, link: 0.22, mouse: 0.40 }
    };
    let P = PALETTES[document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark"];
    document.addEventListener("themechange", function () {
        P = PALETTES[document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark"];
    });

    let W = 0, H = 0, dpr = 1, nodes = [];
    const mouse = { x: -9999, y: -9999 };
    const LINK = 135;

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = Math.min(75, Math.floor((W * H) / 20000));
        nodes = [];
        for (let i = 0; i < count; i++) {
            nodes.push({
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                r: Math.random() * 1.3 + 0.6,
                k: Math.random() < 0.7 ? "a" : "b"
            });
        }
    }

    window.addEventListener("pointermove", function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener("pointerleave", function () { mouse.x = mouse.y = -9999; });

    let resizeTimer;
    window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 150);
    });

    let running = true;
    document.addEventListener("visibilitychange", function () {
        running = !document.hidden;
        if (running) requestAnimationFrame(draw);
    });

    function draw() {
        if (!running) return;
        ctx.clearRect(0, 0, W, H);

        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            a.x += a.vx; a.y += a.vy;
            if (a.x < 0 || a.x > W) a.vx *= -1;
            if (a.y < 0 || a.y > H) a.vy *= -1;

            ctx.beginPath();
            ctx.arc(a.x, a.y, a.r, 0, 6.2832);
            const col = P[a.k];
            ctx.fillStyle = "rgba(" + col + "," + P.dot + ")";
            ctx.fill();

            for (let j = i + 1; j < nodes.length; j++) {
                const b = nodes[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < LINK) {
                    ctx.strokeStyle = "rgba(" + col + "," + (P.link * (1 - d / LINK)).toFixed(3) + ")";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }

            const mx = a.x - mouse.x, my = a.y - mouse.y;
            const md = Math.sqrt(mx * mx + my * my);
            if (md < 170) {
                ctx.strokeStyle = "rgba(" + P.m + "," + (P.mouse * (1 - md / 170)).toFixed(3) + ")";
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
        requestAnimationFrame(draw);
    }

    resize();
    requestAnimationFrame(draw);
})();
