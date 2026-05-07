// ==UserScript==
// @name         Force Dark Mode Exceptions
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Alt+L (Site) / Alt+Shift+L (Domain) Disables Chrome's Force Dark Mode flag by site or domain.
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @match        *://*/*
// @allFrames    true
// ==/UserScript==

(function () {
    "use strict";

    // Domain & Match
    const host = location.hostname;
    const root = host.split(".").slice(-2).join(".");

    // Default Domain List
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

    // (google.com added by default preference)
    let ex = GM_getValue("ex", ["google.com"]); // Exact host list
    let dm = GM_getValue("dm", []); // Domain list

    // Hotkeys
    const toggle = (list, item, key, label) => {
        const index = list.indexOf(item);
        if (index > -1) {
            list.splice(index, 1);
        } else {
            list.push(item);
        }
        GM_setValue(key, list);
        alert(`${label} toggled: ${item}`);
        location.reload();
    };

    window.addEventListener("keydown", (e) => {
        // Use 'L' as the base key
        if (e.altKey && e.code === "KeyL") {
            if (e.shiftKey) {
                toggle(dm, root, "dm", "Root Domain (*)");
            } else {
                toggle(ex, host, "ex", "Specific Host Only");
            }
        }
    });

    // Check if current site should be processed
    const shouldRun =
        ex.includes(host) || dm.includes(root) || staticList.includes(root);
    if (!shouldRun) return;

    // CSS & Inject
    const CSS = `
        *, html, body { color-scheme: only light !important; }
        html, canvas { filter: none !important; }
        svg, svg * {
            filter: none !important;
            mix-blend-mode: normal !important;
            backdrop-filter: none !important;
        }
    `;

    const injectStyle = (target) => {
        const rootNode = target.shadowRoot || target;
        if (rootNode && !rootNode.getElementById("f-l-style")) {
            const s = document.createElement("style");
            s.id = "f-l-style";
            s.textContent = CSS;
            (target.shadowRoot || document.documentElement).appendChild(s);
        }
    };

    const styleTag = document.createElement("style");
    styleTag.textContent = CSS;
    document.documentElement.append(styleTag);

    const metaTag = document.createElement("meta");
    metaTag.name = "color-scheme";
    metaTag.content = "only light";
    document.documentElement.prepend(metaTag);

    // Spoof prefers-color-scheme
    window.matchMedia = ((orig) => (q) => {
        if (q?.includes("prefers-color-scheme")) {
            return {
                matches: false,
                media: q,
                onchange: null,
                addListener() {},
                removeListener() {},
                addEventListener() {},
                removeEventListener() {},
                dispatchEvent() {
                    return false;
                },
            };
        }
        return orig.call(window, q);
    })(window.matchMedia);

    // Spoof computed styles
    window.getComputedStyle = ((orig) => (el) => {
        const s = orig.call(window, el);
        if (!s) return s;
        return new Proxy(s, {
            get: (target, prop) =>
                prop === "colorScheme" || prop === "color-scheme"
                    ? "light"
                    : target[prop],
        });
    })(window.getComputedStyle);

    // Patch Shadow DOM
    Element.prototype.attachShadow = ((orig) =>
        function (init) {
            const shadow = orig.call(this, init);
            setTimeout(() => injectStyle(this), 0);
            return shadow;
        })(Element.prototype.attachShadow);

    // Patch Canvas
    HTMLCanvasElement.prototype.getContext = ((orig) =>
        function (type, attrs) {
            const ctx = orig.call(this, type, attrs);
            if (ctx) {
                if ("filter" in ctx) ctx.filter = "none";
                if ("globalCompositeOperation" in ctx)
                    ctx.globalCompositeOperation = "source-over";
            }
            return ctx;
        })(HTMLCanvasElement.prototype.getContext);

    // DOM & Observers
    const fixSVG = (rootNode) => {
        if (!rootNode.querySelectorAll) return;
        rootNode.querySelectorAll("svg *").forEach((el) => {
            ["fill", "stroke"].forEach((attr) => {
                if (el.hasAttribute(attr))
                    el.style[attr] = el.getAttribute(attr);
            });
        });
    };

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
            m.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    fixSVG(node);
                    injectStyle(node);
                }
            });
        });
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

    window.addEventListener("DOMContentLoaded", () => {
        fixSVG(document);
        document.querySelectorAll("*").forEach(injectStyle);
    });
})();