# Force Dark Mode Exceptions 🕶🖥
**A performant userscript for Desktop to disable Chrome's "Auto Dark Mode" flag on specific sites.**

Unlike sluggish Chrome extensions, this Desktop script targets the Chromium engine's forced-dark filters, securely ensuring your whitelisted sites maintain their original, non-dark UI or respect their native dark themes.

<br>

## 📥 Installation
**[Download for Chrome / GreasyFork / Desktop](https://github.com/ancandi/Force-Dark-Mode-Exceptions/raw/refs/heads/main/force-dark-mode-exceptions.user.js)** *(Optimized for Blink/Chromium engines)*

<br>

## 🛠️ How to Use
* **Install**: Add the script to your preferred manager (Tampermonkey, Violentmonkey, or Greasemonkey).
* **Automatic Detection**: The script identifies the domain; if it matches the metadata, all forced filters are instantly neutralized.
* **Default Whitelist**: Pre-configured for google.com, youtube.com, and github.com.
* **Adding Sites**: Open the script editor and add a new // @match line for any site where the browser's dark mode breaks the UI.
> Note: You may have to use the `*://*.domain.com/*` format to ensure all subdomains and paths are recognized.
> 
<br>

## 🚀 Key Features
* **Hardware-Level Bypass**: Injects color-scheme: only light !important to signal the Chromium engine to abort forced color inversion on the GPU.
* **Dual-Layer Failsafe**: Combines dynamic CSS injection with a root-level meta-tag override to ensure maximum compatibility across different browser versions.
* **Zero-Latency Injection**: Executes at document-start to eliminate the "flash of dark" (FOD) often seen with extension-based dark mode managers.
* **Native Fidelity**: Specifically designed to stop "double-darkening" on sites that already provide a native dark mode toggle.

<br>

## 🔍 Looking for more?
### 🛠️ The Userscript Directory
> **Optimization Level:** Featherweight | **Last Updated:** 2026

#### 🚀 Primary Utilities (ancandi)
* **YouTube Mobile URL Shield AB+** — UI-driven unmute & ad-nuke (v3.0.8).
* **Video Bitrate O/BA** — Adaptive codec & bitrate overdrive (v1.0.1).
* **Force Dark Mode Exceptions** — Contrast & UI control for Chromium/Desktop (v1.0).
* **Night Mode Disabler (Whitelist)** — Contrast control for mobile UI (v1.0.1).
* **YouTube Shield (Zero UI)** — Invisible automation engine (v4.0.1).

#### 🔗 External Resources
* ⚡ **Evade** — via **[Evade - Link Bypasser](https://skipped.lol/)**
* **AdGuard Extra** — Advanced anti-adblock bypass.
* **AdsBypasser** — Countdown and redirect skip logic.
* **FMHY Base64 Auto Decoder** — Automatic string decoding for piracy/sharing.
* **Bypass All Shortlinks** — Universal link-shortener skip.
* **I don't care about cookies** — Automated cookie consent handling.

#### ⚠️ Maintenance & Status
* **Login reminder popup remover** — `[DEVELOPMENT CEASED]`
---
## AND1 UserScripts — This is the complete collection of high-performance, streamlined userscripts designed to reclaim control over mobile web experiences. ⬇
> Otherwise, check out the full source code and technical documentation at **[github.com/ancandi](https://github.com/ancandi)**.

---

#### 🚀 Video Bitrate O/BA
**Version 1.0.1** | *Adaptive Codec & Bitrate Overdrive*

Forces high-fidelity VP9/AV1 streams and bypasses mobile data throttling by hijacking the MediaSource API and mapping bitrate to real-time resolution.

* **>Install: Video Bitrate O/BA**
    * [Standard Build (Blink)](https://github.com/ancandi/YouTube-Bitrate-Overdrive/raw/main/video-bitrate-oba.user.js)
* **>Install: Video Bitrate O/BA [Safari]**
    * [Safari Build (WebKit)](https://github.com/ancandi/YouTube-Bitrate-Overdrive/raw/main/video-bitrate-oba-safari.user.js)

---

#### 🛡️ YouTube Mobile URL Shield AB+
**Version 3.0.8** | *UI-Driven Interaction Off*

Automates the "Tap to Unmute" process on mobile, nukes monetization-slots, and prevents player stalls with a custom frosted-glass UI.

* **>Install: YouTube Mobile URL Shield AB+**
    * [Standard Build](https://github.com/ancandi/YouTube-Mobile-URL-Shield-AB/raw/refs/heads/main/main/url-shield-ab+-latest-beta.user.js)
* **>Install: YouTube Mobile URL Shield AB+ [Safari]**
    * [Safari Build (WebKit)](https://github.com/ancandi/YouTube-Mobile-URL-Shield-AB/raw/refs/heads/main/main/url-shield-ab+-safari-beta.user.js)

---

#### 🌙 Night Mode Disabler & Whitelist (M)
**Version 1.0.1** | *Contrast & UI Control*

Prevents aggressive "Forced Dark Mode" on mobile browsers from breaking specific site UI elements. Includes whitelist settings to maintain original site aesthetics where dark mode fails.

* **>Install: Night Mode Disabler**
    * [Standard Build](https://github.com/ancandi/Night-Mode-Disabler-Whitelist-M/raw/main/night-mode-disabler.user.js)
* **>Install: Night Mode Disabler [Safari]**
    * [Safari Build (WebKit)](https://github.com/ancandi/Night-Mode-Disabler-Whitelist-M/raw/main/night-mode-disabler-safari.user.js)
      
---

#### 🕶 Force Dark Mode Exceptions
**Version 1.0** | *UI Fidelity & Chrome Desktop Flag Control*

Neutralizes the aggressive enable-force-dark flag in Chrome for specific sites. Prevents broken UI elements and maintains original color palettes on whitelisted domains.

* **>Install: Force Dark Mode Exceptions**
    * [Standard Build](https://github.com/ancandi/Force-Dark-Mode-Exceptions/raw/refs/heads/main/force-dark-mode-exceptions.user.js)
  
---

<br>

## 📜 Copyright
Personal use and modification are permitted. Repackaging, rebranding, or unauthorized publishing of this code is strictly forbidden. 

© Copyright 2026. All rights reserved.
