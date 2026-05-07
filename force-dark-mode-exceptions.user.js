// ==UserScript==
// @name         Force Dark Mode Exceptions
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Alt+S (Site) / Alt+D (Domain) - Disables Chrome's Force Dark Mode flag by site or domain.
// @icon         https://raw.githubusercontent.com/ancandi/Force-Dark-Mode-Exceptions/main/glasses-icon.png
// @author       ancandi
// @match        *://*/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @allFrames    true
// ==/UserScript==

(function () {
    "use strict";

    const host = location.hostname;
    const root = host.split(".").slice(-2).join(".");
    // You may add domains here if hotkeys do not work (such as google.com):
    const staticList = [
        "duckduckgo.com", "brave.com", "wikipedia.org", "reddit.com", "discord.com", "twitch.tv", "x.com", "twitter.com",
        "notion.so", "linear.app", "trello.com", "miro.com", "github.com", "stackoverflow.com", "codepen.io", "replit.com", "vercel.com",
        "chatgpt.com", "claude.ai", "huggingface.co", "photopea.com", "vectorpea.com", "canva.com", "figma.com", "excalidraw.com",
        "pixlr.com", "spline.design", "coolors.co", "color-hex.com", "flourish.studio", "flourish.app", "geogebra.org", "desmos.com",
        "wolframalpha.com", "khanacademy.org", "fmhy.net", "rentry.co", "rentry.org", "lemmy.world", "youtube.com", "netflix.com",
        "braflix.ru", "braflix.video", "fbox.to", "fmoviesz.to", "sudo-flix.lol", "sudo-flix.rip", "hianime.to", "aniwave.to",
        "yarrlist.com", "mangadex.org", "weebcentral.com", "mangafire.to", "manganato.com", "annas-archive.org", "mega.nz",
        "gofile.io", "pixeldrain.com", "qiwi.gg", "1337x.to", "nyaa.si", "dodi-repacks.site", "torrentgalaxy.to", "rankdle.com",
        "mdigi.tools", "virustotal.com"
    ];

    let ex = GM_getValue("ex", []);
    let dm = GM_getValue("dm", []);

    const showIndicator = (targetName, actionType, scopeLabel) => {
        const id = 'f-mode-hud-container';
        let container = document.getElementById(id);

        if (!container) {
            container = document.createElement('div');
            container.id = id;
            Object.assign(container.style, {
                position: 'fixed',
                top: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: '2147483647',
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                isolation: 'isolate',
                filter: 'none !important'
            });
            document.body.appendChild(container);
        }

        const isAdding = actionType === 'ADD';
        const siteActive = ex.includes(host);
        const domActive = dm.includes(root) || staticList.includes(root);

        const getTabStyle = (active) => `
            width: 24px; height: 20px;
            display: flex; align-items: center; justify-content: center;
            border-radius: 8px 8px 0 0; font-weight: 800; font-size: 12px;
            background: ${active ? 'rgba(255,255,255,0.98)' : 'rgba(15,15,15,0.96)'} !important;
            color: ${active ? '#000' : '#fff'} !important;
            border: 1px solid ${active ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'} !important;
            border-bottom: none !important;
            backdrop-filter: blur(10px) !important;
            color-scheme: ${active ? 'only light' : 'only dark'} !important;
            filter: none !important;
            transform: translateZ(0);
            margin-bottom: 0px;
        `;

        container.innerHTML = `
            <div style="display: flex; gap: 2px; margin-left: 12px;">
                <div style="${getTabStyle(siteActive)}">S</div>
                <div style="${getTabStyle(domActive)}">D</div>
            </div>
            <div id="f-mode-main-hud" style="
                padding: 10px 36px;
                border-radius: 0 24px 24px 24px;
                font-family: sans-serif, 'Segoe UI Variable Text', 'Segoe UI', Arial;
                box-shadow: 0 10px 30px rgba(0,0,0,0.25);
                text-align: center;
                min-width: 240px;
                backdrop-filter: blur(20px) saturate(180%);
                -webkit-backdrop-filter: blur(20px) saturate(180%);
                background: ${isAdding ? 'rgba(255, 255, 255, 0.98)' : 'rgba(15, 15, 15, 0.96)'} !important;
                color: ${isAdding ? '#000' : '#fff'} !important;
                border: 1px solid ${isAdding ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)'};
                color-scheme: ${isAdding ? 'only light' : 'only dark'} !important;
                transform: translateZ(0);
                filter: none !important;
            ">
                <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; opacity: 0.6; margin-bottom: 2px;">${scopeLabel}</div>
                <div style="font-size: 16px; font-weight: 700; letter-spacing: 0.03em;">${isAdding ? 'Light Mode Enabled' : 'System Default'}</div>
                <div style="font-size: 14px; font-weight: 600; letter-spacing: 0.01em; opacity: 0.7; margin-top: 2px;">${targetName}</div>
            </div>
        `;

        const hud = container;
        hud.style.transition = 'none';
        hud.style.opacity = '0';
        hud.style.transform = 'translateX(-50%) translateY(-16px)';

        requestAnimationFrame(() => {
            hud.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            hud.style.opacity = '1';
            hud.style.transform = 'translateX(-50%) translateY(0)';
        });

        setTimeout(() => {
            hud.style.opacity = '0';
            hud.style.transform = 'translateX(-50%) translateY(-12px)';
            setTimeout(() => {
                if (isAdding) location.reload();
            }, 200);
        }, 2700);
    };

    const toggle = (list, item, key, scopeLabel) => {
        const index = list.indexOf(item);
        const isAdding = index === -1;
        isAdding ? list.push(item) : list.splice(index, 1);
        GM_setValue(key, list);
        showIndicator(item, isAdding ? 'ADD' : 'REMOVE', scopeLabel);
    };

    // Hotkey Listener
    GM_registerMenuCommand(`Site Exception: ALT + S (${host})`, () => toggle(ex, host, "ex", "Site Exception"));
    GM_registerMenuCommand(`Toggle Domain: ALT + D (${root})`, () => toggle(dm, root, "dm", "Domain"));

    window.addEventListener('keydown', (e) => {
        // Only trigger if Alt is held
        if (e.altKey && !e.shiftKey && !e.ctrlKey) {
            if (e.code === 'KeyS' || e.code === 'KeyD') {
                e.stopImmediatePropagation();
                e.preventDefault();

                if (e.code === 'KeyS') {
                    toggle(ex, host, "ex", "Site Exception");
                } else {
                    toggle(dm, root, "dm", "Domain");
                }
            }
        }
    }, true);

    const CSS = `*,html,body{color-scheme:only light!important}html,canvas{filter:none!important}svg,svg *{filter:none!important;mix-blend-mode:normal!important;backdrop-filter:none!important}`;

    const injectStyle = (t) => {
        const r = t.shadowRoot || t;
        if (r && !r.getElementById("f-l-style")) {
            const s = document.createElement("style");
            s.id = "f-l-style";
            s.textContent = CSS;
            (t.shadowRoot || document.documentElement).appendChild(s);
        }
    };

    if (ex.includes(host) || dm.includes(root) || staticList.includes(root)) {
        document.documentElement.append(Object.assign(document.createElement("style"), {
            textContent: CSS
        }));
        document.documentElement.prepend(Object.assign(document.createElement("meta"), {
            name: "color-scheme",
            content: "only light"
        }));

        window.matchMedia = (o => q => q?.includes("prefers-color-scheme") ? {
            matches: false,
            media: q,
            onchange: null,
            addListener() {},
            removeListener() {},
            addEventListener() {},
            removeEventListener() {},
            dispatchEvent() {
                return false
            }
        } : o.call(window, q))(window.matchMedia);

        window.getComputedStyle = (o => el => {
            const s = o.call(window, el);
            return s ? new Proxy(s, {
                get: (t, p) => (p === "colorScheme" || p === "color-scheme") ? "light" : t[p]
            }) : s;
        })(window.getComputedStyle);

        Element.prototype.attachShadow = (o => function (i) {
            const s = o.call(this, i);
            setTimeout(() => injectStyle(this), 0);
            return s;
        })(Element.prototype.attachShadow);

        HTMLCanvasElement.prototype.getContext = (o => function (t, a) {
            const c = o.call(this, t, a);
            if (c) {
                if ("filter" in c) c.filter = "none";
                if ("globalCompositeOperation" in c)
                    c.globalCompositeOperation = "source-over";
            }
            return c;
        })(HTMLCanvasElement.prototype.getContext);

        const fixSVG = (r) => {
            if (r.querySelectorAll) r.querySelectorAll("svg *").forEach(e => {
                ["fill", "stroke"].forEach(a => {
                    if (e.hasAttribute(a)) e.style[a] = e.getAttribute(a);
                });
            });
        };

        new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => {
            if (n.nodeType === 1) {
                fixSVG(n);
                injectStyle(n);
            }
        }))).observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        window.addEventListener("DOMContentLoaded", () => {
            fixSVG(document);
            document.querySelectorAll("*").forEach(injectStyle);
        });
    }
})();