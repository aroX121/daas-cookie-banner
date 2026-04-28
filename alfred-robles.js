// ==========================================
// CLIENT: DAAS - ALFRED ROBLES TRACKING ENGINE
// (For GTM + Rogue Meta Pixel)
// ==========================================

// 1. LITERAL COOKIE HANDLERS
function setCookieChoice(choice) {
    document.cookie = "daas_alfredrobles_consent=" + choice + "; max-age=31536000; path=/";
}

function getCookieChoice() {
    var match = document.cookie.match(new RegExp('(^| )daas_alfredrobles_consent=([^;]+)'));
    return match ? match[2] : null;
}

// 2. CORE TRACKING FUNCTIONS
function enableTracking() {
    // 1. Wakes up Google Tags
    gtag("consent", "update", { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted", analytics_storage: "granted" });

    // 2. Wakes up the Rogue Meta Pixel (Meta will automatically fire its queued PageView)
    if (typeof fbq === 'function') {
        fbq('consent', 'grant');
    }

    // 3. Wakes up GTM
    window.dataLayer.push({ 'event': 'consent_granted' });
}

function acceptCookies() {
    enableTracking();
    setCookieChoice('granted');
    hideBanner();
}

function rejectCookies() {
    gtag("consent", "update", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" });
    setCookieChoice('denied');
    hideBanner();
}

// 3. CUSTOM BANNER GENERATOR (Compact Dark Theme)
function showBanner() {
    function injectBanner() {
        if (document.getElementById('daas-cookie-banner')) return;

        var config = {
            bgColor: "#111111", textColor: "#ffffff",
            acceptBgColor: "#ffffff", acceptTextColor: "#000000",
            rejectBgColor: "#333333", rejectTextColor: "#ffffff",
            privacyLink: "/privacy-policy"
        };

        var style = document.createElement('style');
        style.innerHTML = `
            #daas-cookie-banner { position: fixed; bottom: 10px; left: 10px; width: 280px; max-width: calc(100% - 20px); background-color: ${config.bgColor}; color: ${config.textColor}; padding: 10px; z-index: 2147483647; font-family: Arial, sans-serif; box-shadow: 0 2px 10px rgba(0,0,0,0.15); box-sizing: border-box; border-radius: 6px; }
            #daas-cookie-banner p { margin: 0 0 8px 0; font-size: 11px; line-height: 1.2; }
            #daas-cookie-banner a { color: ${config.textColor}; text-decoration: underline; font-weight: bold; }
            .daas-cookie-buttons { display: flex; gap: 6px; }
            .daas-cookie-buttons button { flex: 1; padding: 6px 0; font-size: 11px; cursor: pointer; font-family: inherit; font-weight: bold; border-radius: 4px; transition: opacity 0.2s; }
            .daas-cookie-buttons button:hover { opacity: 0.8; }
            #daas-accept { background-color: ${config.acceptBgColor}; color: ${config.acceptTextColor}; border: none; }
            #daas-reject { background-color: ${config.rejectBgColor}; color: ${config.rejectTextColor}; border: 1px solid ${config.rejectTextColor}; }
            @media (max-width: 600px) { #daas-cookie-banner { bottom: 10px; left: 10px; width: calc(100% - 20px); max-width: calc(100% - 20px); padding: 8px; border-radius: 6px; } }
        `;
        document.head.appendChild(style);

        var banner = document.createElement('div');
        banner.id = 'daas-cookie-banner';
        banner.innerHTML = `<p>We use cookies to improve your experience. Accept all or reject non-essential tracking. <a href="${config.privacyLink}">Learn more</a></p><div class="daas-cookie-buttons"><button id="daas-accept">Accept all</button><button id="daas-reject">Reject</button></div>`;
        document.body.appendChild(banner);

        document.getElementById('daas-accept').onclick = acceptCookies;
        document.getElementById('daas-reject').onclick = rejectCookies;
    }
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', injectBanner); } else { injectBanner(); }
}

function hideBanner() {
    var banner = document.getElementById('daas-cookie-banner');
    if (banner) banner.style.display = 'none';
}

// 4. GEO-LOGIC ENGINE 
var userChoice = getCookieChoice();
if (userChoice === 'granted') {
    enableTracking();
} else if (userChoice === 'denied') {
    // Stays blocked
} else {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            const strictCountries = ['GB', 'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'NO', 'IS', 'LI', 'CH'];

            const strictUSStates = ['California'];
            const strictINStates = ['Assam'];

            if (strictCountries.includes(data.country_code)) {
                showBanner();
            } else if (data.country_code === 'US' && strictUSStates.includes(data.region)) {
                showBanner();
            } else if (data.country_code === 'IN' && strictINStates.includes(data.region)) {
                showBanner();
            } else {
                enableTracking();
                showBanner();
            }
        })
        .catch(error => { console.error('Geo API failed', error); showBanner(); });
}