// ==UserScript==
// @name         Force Dark Mode Exceptions
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Disables Chrome's Force Dark Mode flag on specific sites.
// @run-at       document-start
// @grant        GM_addStyle
// @match        *://*.youtube.com/*
// @match        *://*.github.com/*
// @match        *://*.google.com/*
// ==/UserScript==

(function() {
    'use strict';
    const css = ':root, html, body { color-scheme: only light !important; }';

    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    }

    const meta = document.createElement('meta');
    meta.name = "color-scheme";
    meta.content = "only light";
    (document.head || document.documentElement).appendChild(meta);
})();