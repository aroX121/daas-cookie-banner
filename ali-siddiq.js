// ==========================================
//  ALI SIDDIQ SITE TRACKING ENGINE
// ==========================================

// 1. RETARGET IQ LOADER (Ali Siddiq Specific Pixel)
window.loadRetargetIQ = function () {
    if (window.retargetIQLoaded) return;
    (function (s, p, i, c, e) {
        s[e] = s[e] || function () { (s[e].a = s[e].a || []).push(arguments); };
        s[e].l = 1 * new Date();
        var t = new Date().getTime();
        var k = c.createElement("script"), a = c.getElementsByTagName("script")[0];
        k.async = 1, k.src = p + "?request_id=" + i + "&t=" + t, a.parentNode.insertBefore(k, a);
        s.pixelClientId = i;
    })(window, "https://app.retargetiq.com/script", "ali-siddiq", document, "script");
    window.retargetIQLoaded = true;
};

// 2. CORE TRACKING FUNCTIONS
function enableTracking() {
    gtag("consent", "update", { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted", analytics_storage: "granted" });
    window.loadRetargetIQ();
    window.dataLayer.push({ 'event': 'consent_granted' });
}

function acceptCookies() {
    enableTracking();
    localStorage.setItem('daas_cookie_choice', 'granted');
    hideBanner();
}

function rejectCookies() {
    gtag("consent", "update", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" });
    localStorage.setItem('daas_cookie_choice', 'denied');
    hideBanner();
}

// 3. CUSTOM BANNER GENERATOR
function showBanner() {
    function injectBanner() {
        if (document.getElementById('daas-cookie-banner')) return;

        var config = {
            bgColor: "#111111",
            textColor: "#ffffff",
            acceptBgColor: "#ffffff",
            acceptTextColor: "#000000",
            rejectBgColor: "#333333",
            rejectTextColor: "#ffffff",
            privacyLink: "/privacy-policy"
        };

        var style = document.createElement('style');
        style.innerHTML = `
            #daas-cookie-banner {
                position: fixed; bottom: 10px; left: 10px; width: 280px; max-width: calc(100% - 20px);
                background-color: ${config.bgColor}; color: ${config.textColor};
                padding: 10px; z-index: 2147483647; font-family: Arial, sans-serif;
                box-shadow: 0 2px 10px rgba(0,0,0,0.15); box-sizing: border-box; border-radius: 6px;
            }
            #daas-cookie-banner p { margin: 0 0 8px 0; font-size: 11px; line-height: 1.2; }
            #daas-cookie-banner a { color: ${config.textColor}; text-decoration: underline; font-weight: bold; }
            .daas-cookie-buttons { display: flex; gap: 6px; }
            .daas-cookie-buttons button { 
                flex: 1; padding: 6px 0; font-size: 11px; cursor: pointer; 
                font-family: inherit; font-weight: bold; border-radius: 4px; transition: opacity 0.2s;
            }
            .daas-cookie-buttons button:hover { opacity: 0.8; }
            #daas-accept { background-color: ${config.acceptBgColor}; color: ${config.acceptTextColor}; border: none; }
            #daas-reject { background-color: ${config.rejectBgColor}; color: ${config.rejectTextColor}; border: 1px solid ${config.rejectTextColor}; }
            @media (max-width: 600px) {
                #daas-cookie-banner { bottom: 10px; left: 10px; width: calc(100% - 20px); max-width: calc(100% - 20px); padding: 8px; border-radius: 6px; }
            }
        `;
        document.head.appendChild(style);

        var banner = document.createElement('div');
        banner.id = 'daas-cookie-banner';
        banner.innerHTML = `
            <p>We use cookies to improve your experience. Accept all or reject non-essential tracking. <a href="${config.privacyLink}">Learn more</a></p>
            <div class="daas-cookie-buttons">
                <button id="daas-accept">Accept all</button>
                <button id="daas-reject">Reject</button>
            </div>
        `;
        document.body.appendChild(banner);

        document.getElementById('daas-accept').onclick = acceptCookies;
        document.getElementById('daas-reject').onclick = rejectCookies;
    }

    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', injectBanner); }
    else { injectBanner(); }
}

function hideBanner() {
    var banner = document.getElementById('daas-cookie-banner');
    if (banner) banner.style.display = 'none';
}

// 4. GEO-LOGIC ENGINE
var userChoice = localStorage.getItem('daas_cookie_choice');
if (userChoice === 'granted') {
    enableTracking();
} else if (userChoice === 'denied') {
    // Stays blocked
} else {
    fetch('https://get.geojs.io/v1/ip/country.json')
        .then(response => response.json())
        .then(data => {
            const strictCountries = ['GB', 'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'IN', 'SE'];
            if (!strictCountries.includes(data.country)) { enableTracking(); showBanner(); }
            else { showBanner(); }
        })
        .catch(error => { console.error('Geo API failed', error); showBanner(); });
}
