// ==UserScript==
// @name         Force Dark Mode Exceptions
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Alt + S (Site) / Alt + D (Domain) - Disables Chrome's Force Dark Mode flag by site or domain.
// @icon         https://raw.githubusercontent.com/ancandi/Force-Dark-Mode-Exceptions/main/glasses-icon.png
// @author       ancandi
// @match        *://*/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addElement
// @allFrames    true
// ==/UserScript==

(function () {
    "use strict";

    const host = location.hostname;
    const root = host.split(".").slice(-2).join(".");

    const defaultDomains = [
        "duckduckgo.com", "github.com", "brave.com", "wikipedia.org", "reddit.com", "discord.com", "twitch.tv", "x.com", "twitter.com",
        "notion.so", "linear.app", "trello.com", "miro.com", "stackoverflow.com", "codepen.io", "replit.com", "vercel.com",
        "chatgpt.com", "claude.ai", "huggingface.co", "photopea.com", "vectorpea.com", "canva.com", "figma.com", "excalidraw.com",
        "pixlr.com", "spline.design", "coolors.co", "color-hex.com", "flourish.studio", "flourish.app", "geogebra.org", "desmos.com",
        "wolframalpha.com", "khanacademy.org", "fmhy.net", "rentry.co", "rentry.org", "lemmy.world", "youtube.com", "netflix.com",
        "braflix.ru", "braflix.video", "fbox.to", "fmoviesz.to", "sudo-flix.lol", "sudo-flix.rip", "hianime.to", "aniwave.to",
        "yarrlist.com", "mangadex.org", "weebcentral.com", "mangafire.to", "manganato.com", "annas-archive.org", "mega.nz",
        "gofile.io", "pixeldrain.com", "qiwi.gg", "1337x.to", "nyaa.si", "dodi-repacks.site", "torrentgalaxy.to", "rankdle.com",
        "mdigi.tools", "virustotal.com", "chatgpt.com"
    ];

    const ex = GM_getValue("ex", []);
    const dm = GM_getValue("dm", defaultDomains);
    if (GM_getValue("dm") === undefined) GM_setValue("dm", dm);

    const buildEl = (tag, cssText, textContent = "") => {
        const el = document.createElement(tag);
        if (cssText) el.style.cssText = cssText;
        if (textContent) el.textContent = textContent;
        return el;
    };

    const showIndicator = (targetName, actionType, scopeLabel) => {
        const id = "f-mode-hud-wrapper";
        document.getElementById(id)?.remove();

        const wrapper = GM_addElement(document.documentElement, "div", {
            id,
            style: "position:fixed; top:16px; left:50%; transform:translateX(-50%); z-index:2147483647; pointer-events:none;"
        });

        const shadow = wrapper.attachShadow({ mode: "open" });
        const isAdding = actionType === "ADD";

        // Re-evaluate state precisely when indicator shows
        const siteActive = ex.includes(host);
        const domActive = dm.includes(root);

        const container = buildEl("div", "display:flex; flex-direction:column; align-items:flex-start; opacity:0; transform:translateY(-16px); transition:all 0.5s cubic-bezier(0.16, 1, 0.3, 1); filter:none;");
        const tabRow = buildEl("div", "display:flex; gap:2px; margin-left:12px;");

        const createTab = (label, active) => buildEl("div",
            `width:24px; height:20px; display:flex; align-items:center; justify-content:center; border-radius:8px 8px 0 0; font-weight:800; font-size:12px; font-family:sans-serif; background:${active ? "rgba(255,255,255,0.98)" : "rgba(15,15,15,0.96)"} !important; color:${active ? "#000" : "#fff"} !important; border:1px solid ${active ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)"} !important; border-bottom:none !important; backdrop-filter:blur(10px); color-scheme:${active ? "only light" : "only dark"} !important;`,
            label
        );

        tabRow.append(createTab("S", siteActive), createTab("D", domActive));

        const mainHud = buildEl("div", `padding:10px 36px; border-radius:0 24px 24px 24px; font-family:sans-serif, 'Segoe UI'; box-shadow:0 10px 30px rgba(0,0,0,0.25); text-align:center; min-width:240px; backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); background:${isAdding ? "rgba(255,255,255,0.98)" : "rgba(15,15,15,0.96)"} !important; color:${isAdding ? "#000" : "#fff"} !important; border:1px solid ${isAdding ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.1)"}; color-scheme:${isAdding ? "only light" : "only dark"} !important;`);

        mainHud.append(
            buildEl("div", "font-size:10px; font-weight:700; text-transform:uppercase; opacity:0.6;", scopeLabel),
            buildEl("div", "font-size:16px; font-weight:700;", isAdding ? "Light Mode Enabled" : "System Default"),
            buildEl("div", "font-size:14px; opacity:0.7;", targetName)
        );

        container.append(tabRow, mainHud);
        shadow.append(container);

        requestAnimationFrame(() => {
            container.style.opacity = "1";
            container.style.transform = "translateY(0)";
        });

        setTimeout(() => {
            container.style.opacity = "0";
            setTimeout(() => location.reload(), 300);
        }, 2500);
    };

    const toggle = (list, item, key, scopeLabel) => {
        const index = list.indexOf(item);
        const isAdding = index === -1;
        if (isAdding) list.push(item); else list.splice(index, 1);
        GM_setValue(key, list);
        showIndicator(item, isAdding ? "ADD" : "REMOVE", scopeLabel);
    };

    const actions = {
        KeyS: () => toggle(ex, host, "ex", "Site Exception"),
        KeyD: () => toggle(dm, root, "dm", "Domain")
    };

    GM_registerMenuCommand("Site: ALT+S", actions.KeyS);
    GM_registerMenuCommand("Domain: ALT+D", actions.KeyD);

    window.addEventListener("keydown", (e) => {
        if (e.altKey && !e.shiftKey && !e.ctrlKey && actions[e.code]) {
            e.preventDefault();
            actions[e.code]();
        }
    }, true);

    if (ex.includes(host) || dm.includes(root)) {
        const CSS = "*,html,body{color-scheme:only light!important}html,canvas{filter:none!important}svg,svg *{filter:none!important;mix-blend-mode:normal!important;backdrop-filter:none!important}";

        document.documentElement.prepend(Object.assign(document.createElement("meta"), { name: "color-scheme", content: "only light" }));

        const injectStyle = (rootNode) => {
            if (rootNode && !rootNode.getElementById?.("f-l-style")) {
                const s = document.createElement("style");
                s.id = "f-l-style";
                s.textContent = CSS;
                rootNode.appendChild(s);
            }
        };

        injectStyle(document.documentElement);

        const ogMatchMedia = window.matchMedia;
        window.matchMedia = q => q?.includes("prefers-color-scheme")
            ? { matches: false, media: q, onchange: null, addListener(){}, removeListener(){}, addEventListener(){}, removeEventListener(){}, dispatchEvent(){return false}}
            : ogMatchMedia.call(window, q);

        const ogGetComputedStyle = window.getComputedStyle;
        window.getComputedStyle = el => {
            const s = ogGetComputedStyle.call(window, el);
            return s ? new Proxy(s, { get: (t, p) => (p === "colorScheme" || p === "color-scheme") ? "light" : t[p] }) : s;
        };

        const ogAttachShadow = Element.prototype.attachShadow;
        Element.prototype.attachShadow = function (init) {
            const shadow = ogAttachShadow.call(this, init);
            injectStyle(shadow);
            return shadow;
        };

        new MutationObserver(ms => {
            for (let i = 0; i < ms.length; i++) {
                const nodes = ms[i].addedNodes;
                for (let j = 0; j < nodes.length; j++) {
                    const n = nodes[j];
                    if (n.nodeType === 1 && n.shadowRoot) injectStyle(n.shadowRoot);
                }
            }
        }).observe(document.documentElement, { childList: true, subtree: true });

        window.addEventListener("DOMContentLoaded", () => {
            const elements = document.querySelectorAll("*");
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].shadowRoot) injectStyle(elements[i].shadowRoot);
            }
        });
    }
})();