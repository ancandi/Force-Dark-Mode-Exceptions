// ==UserScript==
// @name          Force Dark Mode Exceptions
// @namespace     http://tampermonkey.net/
// @version       1.2
// @description   Alt + S (Site) / Alt + D (Domain) - Disables Chrome's Force Dark Mode flag by site or domain.
// @icon          https://raw.githubusercontent.com/ancandi/Force-Dark-Mode-Exceptions/main/glasses-icon.png
// @author        ancandi
// @match         *://*/*
// @run-at        document-start
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @grant         GM_addElement
// @allFrames     true
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
        "mdigi.tools", "virustotal.com"
    ];

    const ex = GM_getValue("ex", []);
    const dm = GM_getValue("dm", defaultDomains);
    if (GM_getValue("dm") === undefined) GM_setValue("dm", dm);

    const isException = ex.includes(host) || dm.some(d => host === d || host.endsWith('.' + d));

    const buildEl = (tag, cssText, textContent = "") => {
        const el = document.createElement(tag);
        if (cssText) el.style.cssText = cssText;
        if (textContent) el.textContent = textContent;
        return el;
    };

    const showIndicator = (targetName, actionType, scopeLabel) => {
        if (window.self !== window.top) return;
        const id = "f-mode-hud-wrapper";
        document.getElementById(id)?.remove();
        const wrapper = GM_addElement(document.documentElement, "div", {
            id,
            style: "position:fixed; top:16px; left:50%; transform:translateX(-50%); z-index:2147483647; pointer-events:none;"
        });
        const shadow = wrapper.attachShadow({ mode: "open" });
        const isAdding = actionType === "ADD";
        const container = buildEl("div", "display:flex; flex-direction:column; align-items:flex-start; opacity:0; transform:translateY(-16px); transition:all 0.5s cubic-bezier(0.16, 1, 0.3, 1); filter:none;");
        const tabRow = buildEl("div", "display:flex; gap:2px; margin-left:12px;");
        const createTab = (label, active) => buildEl("div",
            `width:24px; height:20px; display:flex; align-items:center; justify-content:center; border-radius:8px 8px 0 0; font-weight:800; font-size:12px; font-family:sans-serif; background:${active ? "rgba(255,255,255,0.98)" : "rgba(15,15,15,0.96)"} !important; color:${active ? "#000" : "#fff"} !important; border:1px solid ${active ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)"} !important; border-bottom:none !important; backdrop-filter:blur(10px); color-scheme:${active ? "only light" : "only dark"} !important;`,
            label
        );
        tabRow.append(createTab("S", ex.includes(host)), createTab("D", dm.includes(root)));
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
        if (index === -1) list.push(item); else list.splice(index, 1);
        GM_setValue(key, list);
        showIndicator(item, index === -1 ? "ADD" : "REMOVE", scopeLabel);
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

    if (isException) {
        const CSS = `
            *, ::before, ::after {
                color-scheme: only light !important;
                filter: none !important;
                -webkit-filter: none !important;
            }
            /* Attempts to block browser force-dark-mode flag inversion on new popups (may not work) */
            html, body {
                background-image: linear-gradient(transparent, transparent) !important;
            }
        `;

        const injectStyle = (rootNode) => {
            if (!rootNode) return;
            const dest = rootNode.shadowRoot ||
                         (rootNode.nodeType === 11 ? rootNode :
                         (rootNode === document.documentElement ? (document.head || document.documentElement) : rootNode));
            if (dest && dest.querySelector && !dest.querySelector("#f-l-style")) {
                const s = document.createElement("style");
                s.id = "f-l-style";
                s.textContent = CSS;
                dest.appendChild(s);
            }
        };

        const meta = document.createElement("meta");
        meta.name = "color-scheme";
        meta.content = "only light";
        document.documentElement.prepend(meta);
        injectStyle(document.documentElement);

        const ogAttachShadow = Element.prototype.attachShadow;
        Element.prototype.attachShadow = function (init) {
            const shadow = ogAttachShadow.call(this, init);
            setTimeout(() => injectStyle(shadow), 0);
            return shadow;
        };

        new MutationObserver(ms => {
            for (let i = 0; i < ms.length; i++) {
                ms[i].addedNodes.forEach(n => {
                    if (n.nodeType === 1) {
                        if (n.shadowRoot) injectStyle(n.shadowRoot);
                        if (n.tagName === 'IFRAME') {
                            n.addEventListener('load', () => { try { injectStyle(n.contentDocument); } catch(e){} });
                        }
                        n.querySelectorAll?.('*').forEach(el => { if (el.shadowRoot) injectStyle(el.shadowRoot); });
                    }
                });
            }
        }).observe(document.documentElement, { childList: true, subtree: true });
    }
})();