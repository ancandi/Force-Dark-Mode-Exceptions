// ==UserScript==
// @name         Force Dark Mode Exceptions
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Disables Chrome's Force Dark Mode flag on specific sites.
// @run-at       document-start
// @grant        GM_addStyle
// @allFrames    true
// @match        *://*.youtube.com/*
// @match        *://*.github.com/*
// @match        *://google.com/*
// @match        *://*.rankdle.com/*
// @match        *://*.photopea.com/*
// @match        *://*.canva.com/*
// @match        *://*.flourish.studio/*
// @match        *://*.flourish.app/*
// @match        *://*.flourish-user-templates.com/*
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
