// ==UserScript==
// @name         Force Dark Mode Exceptions
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Disables Chrome's Force Dark Mode flag on specific sites.
// @icon         https://raw.githubusercontent.com/ancandi/Force-Dark-Mode-Exceptions/main/glasses-icon.png
// @run-at       document-start
// @grant        GM_addStyle
// @allFrames    true
// General / Search
// @match        *://.google.com/*
// @match        *://*.duckduckgo.com/*
// @match        *://*.brave.com/*
// @match        *://*.wikipedia.org/*

// Social & Communciation
// @match        *://*.reddit.com/*
// @match        *://*.discord.com/*
// @match        *://*.twitch.tv/*
// @match        *://*.x.com/*
// @match        *://*.twitter.com/*

// Productivity & Workspace
// @match        *://*.notion.so/*
// @match        *://*.linear.app/*
// @match        *://*.trello.com/*
// @match        *://*.miro.com/*

// Dev Tools & AI
// @match        *://*.github.com/*
// @match        *://*.stackoverflow.com/*
// @match        *://*.codepen.io/*
// @match        *://*.replit.com/*
// @match        *://*.vercel.com/*
// @match        *://developer.mozilla.org/*
// @match        *://chatgpt.com/*
// @match        *://claude.ai/*
// @match        *://*.huggingface.co/*

// Design & Creative Tools
// @match        *://*.photopea.com/*
// @match        *://*.vectorpea.com/*
// @match        *://*.canva.com/*
// @match        *://*.figma.com/*
// @match        *://*.excalidraw.com/*
// @match        *://*.pixlr.com/*
// @match        *://*.spline.design/*
// @match        *://*.coolors.co/*
// @match        *://*.color-hex.com/*
// @match        *://*.flourish.studio/*
// @match        *://*.flourish.app/*
// @match        *://*.flourish-user-templates.com/*

// Education
// @match        *://*.geogebra.org/*
// @match        *://*.desmos.com/*
// @match        *://*.wolframalpha.com/*
// @match        *://*.khanacademy.org/*

// FMHY/Repos
// @match        *://*.fmhy.net/*
// @match        *://*.rentry.co/*
// @match        *://*.rentry.org/*
// @match        *://*.lemmy.world/*

// Video Streaming (Movies, TV, Anime)
// @match        *://*.youtube.com/*
// @match        *://*.netflix.com/*
// @match        *://*.braflix.ru/*
// @match        *://*.braflix.video/*
// @match        *://*.fbox.to/*
// @match        *://*.fmoviesz.to/*
// @match        *://*.sudo-flix.lol/*
// @match        *://*.sudo-flix.rip/*
// @match        *://*.hianime.to/*
// @match        *://*.aniwave.to/*
// @match        *://*.yarrlist.com/*

// Reading (Mangoa, Books)
// @match        *://*.mangadex.org/*
// @match        *://*.weebcentral.com/*
// @match        *://*.mangafire.to/*
// @match        *://*.manganato.com/*
// @match        *://*.annas-archive.org/*

// Downloads, Tracker, Storage
// @match        *://*.mega.nz/*
// @match        *://*.gofile.io/*
// @match        *://*.pixeldrain.com/*
// @match        *://*.qiwi.gg/*
// @match        *://*.1337x.to/*
// @match        *://*.nyaa.si/*
// @match        *://*.dodi-repacks.site/*
// @match        *://*.torrentgalaxy.to/*

// Misc
// @match        *://*.rankdle.com/*
// @match        *://*.mdigi.tools/*
// @match        *://gchq.github.io/CyberChef/*
// @match        *://*.virustotal.com/*
// @match        file:///*/*.html*
// @match        *://*/*.html*
// ==/UserScript==

(function () {
    'use strict';

    /* CSS */
    const CSS = `
        *, html, body {
            color-scheme: only light !important;
        }

        html {
            filter: none !important;
        }

        svg, svg * {
            filter: none !important;
            mix-blend-mode: normal !important;
            backdrop-filter: none !important;
        }

        canvas {
            filter: none !important;
        }
    `;

    const style = document.createElement('style');
    style.textContent = CSS;
    document.documentElement.appendChild(style);

    const meta = document.createElement('meta');
    meta.name = "color-scheme";
    meta.content = "only light";
    document.documentElement.prepend(meta);

    /* Detection */
    const origMatchMedia = window.matchMedia;
    window.matchMedia = function (q) {
        if (q && q.includes('prefers-color-scheme')) {
            return {
                matches: false,
                media: q,
                onchange: null,
                addListener() {},
                removeListener() {},
                addEventListener() {},
                removeEventListener() {},
                dispatchEvent() { return false; }
            };
        }
        return origMatchMedia.call(window, q);
    };

    /* Style Spoof */
    const origGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = function (el) {
        const style = origGetComputedStyle.call(window, el);
        if (!style) return style;

        return new Proxy(style, {
            get(target, prop) {
                if (prop === 'colorScheme' || prop === 'color-scheme') {
                    return 'light';
                }
                return target[prop];
            }
        });
    };

    /* Shadow DOM Patch */
    const injectShadowStyle = (host) => {
        if (!host.shadowRoot) return;
        const shadow = host.shadowRoot;

        if (!shadow.getElementById('force-light')) {
            const s = document.createElement('style');
            s.id = 'force-light';
            s.textContent = CSS;
            shadow.appendChild(s);
        }
    };

    const origAttachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function (init) {
        const shadow = origAttachShadow.call(this, init);
        setTimeout(() => injectShadowStyle(this), 0);
        return shadow;
    };

    /* SVG */
    const fixSVG = (root) => {
        if (!root.querySelectorAll) return;

        root.querySelectorAll('svg *').forEach(el => {
            if (el.hasAttribute('fill')) {
                el.style.fill = el.getAttribute('fill');
            }
            if (el.hasAttribute('stroke')) {
                el.style.stroke = el.getAttribute('stroke');
            }
        });
    };

    /* Canvas Patch */
    const origGetContext = HTMLCanvasElement.prototype.getContext;

    HTMLCanvasElement.prototype.getContext = function(type, attrs) {
        const ctx = origGetContext.call(this, type, attrs);
        if (!ctx) return ctx;

        // kill filters
        if ('filter' in ctx) ctx.filter = 'none';

        // normalize composite behavior
        if ('globalCompositeOperation' in ctx) {
            ctx.globalCompositeOperation = 'source-over';
        }

        return ctx;
    };

    /* Observer */
    const observer = new MutationObserver((muts) => {
        for (const m of muts) {
            for (const n of m.addedNodes) {
                if (n.nodeType !== 1) continue;
                fixSVG(n);
                injectShadowStyle(n);
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    /* Init Pass */
    window.addEventListener('DOMContentLoaded', () => {
        fixSVG(document);
        document.querySelectorAll('*').forEach(injectShadowStyle);
    });

})();
