// ==========================================
// Anjhela - MASTER TRACKING ENGINE
// ==========================================

window.loadRetargetIQ = function() {
    if (window.retargetIQLoaded) return;
    (function(s, p, i, c, e) {
        s[e] = s[e] || function() { (s[e].a = s[e].a || []).push(arguments); };
        s[e].l = 1 * new Date();
        var t = new Date().getTime();
        var k = c.createElement("script"), a = c.getElementsByTagName("script")[0];
        k.async = 1, k.src = p + "?request_id=" + i + "&t=" + t, a.parentNode.insertBefore(k, a);
        s.pixelClientId = i;
    })(window, "https://app.retargetiq.com/script", "anjelah-johnson-reyes", document, "script");
    window.retargetIQLoaded = true;
};

function enableTracking() {
    gtag("consent", "update", { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted", analytics_storage: "granted" });
    window.loadRetargetIQ();
    window.dataLayer.push({ 'event': 'consent_granted' });
}

function acceptCookies() {
    enableTracking(); 
    localStorage.setItem('agency_cookie_choice', 'granted');
    hideBanner();
}

function rejectCookies() {
    gtag("consent", "update", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" });
    localStorage.setItem('agency_cookie_choice', 'denied');
    hideBanner();
}

function showBanner() {
    function injectBanner() {
        if (document.getElementById('agency-cookie-banner')) return;

        // Pulls config from GoHighLevel, defaults to Anjelah's colors if config is missing
        var config = window.AgencyBannerConfig || {
            bgColor: "#cbd858", textColor: "#000000",
            acceptBgColor: "#000000", acceptTextColor: "#ffffff",
            rejectBgColor: "#ffffff", rejectTextColor: "#000000",
            privacyLink: "/privacy-policy"
        };

        var style = document.createElement('style');
        style.innerHTML = `
            #agency-cookie-banner {
                position: fixed; bottom: 30px; left: 30px; width: 380px; max-width: 90%;
                background-color: ${config.bgColor}; color: ${config.textColor};
                padding: 24px; z-index: 2147483647; font-family: Arial, sans-serif;
                box-shadow: 0 4px 15px rgba(0,0,0,0.15); box-sizing: border-box; border-radius: 8px;
            }
            #agency-cookie-banner p { margin: 0 0 20px 0; font-size: 14px; line-height: 1.5; }
            #agency-cookie-banner a { color: ${config.textColor}; text-decoration: underline; font-weight: bold; }
            .agency-cookie-buttons { display: flex; gap: 12px; }
            .agency-cookie-buttons button { 
                flex: 1; padding: 12px 0; font-size: 14px; cursor: pointer; 
                font-family: inherit; font-weight: bold; border-radius: 4px; transition: opacity 0.2s;
            }
            .agency-cookie-buttons button:hover { opacity: 0.8; }
            #agency-accept { background-color: ${config.acceptBgColor}; color: ${config.acceptTextColor}; border: none; }
            #agency-reject { background-color: ${config.rejectBgColor}; color: ${config.rejectTextColor}; border: 1px solid ${config.textColor}; }
            @media (max-width: 600px) {
                #agency-cookie-banner { bottom: 0; left: 0; width: 100%; max-width: 100%; padding: 20px; border-radius: 0; }
            }
        `;
        document.head.appendChild(style);

        var banner = document.createElement('div');
        banner.id = 'agency-cookie-banner';
        banner.innerHTML = `
            <p>We use cookies to improve your experience. Accept all or reject non-essential tracking. <a href="${config.privacyLink}">Learn more</a></p>
            <div class="agency-cookie-buttons">
                <button id="agency-accept">Accept all</button>
                <button id="agency-reject">Reject</button>
            </div>
        `;
        document.body.appendChild(banner);
        
        document.getElementById('agency-accept').onclick = acceptCookies;
        document.getElementById('agency-reject').onclick = rejectCookies;
    }
    
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', injectBanner); } 
    else { injectBanner(); }
}

function hideBanner() {
    var banner = document.getElementById('agency-cookie-banner');
    if (banner) banner.style.display = 'none';
}

var userChoice = localStorage.getItem('agency_cookie_choice');
if (userChoice === 'granted') {
    enableTracking(); 
} else if (userChoice === 'denied') {
    // Stays blocked
} else {
    fetch('https://get.geojs.io/v1/ip/country.json')
      .then(response => response.json())
      .then(data => {
        const strictCountries = ['GB', 'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];
        if (!strictCountries.includes(data.country)) { enableTracking(); showBanner(); } 
        else { showBanner(); }
      })
      .catch(error => { console.error('Geo API failed', error); showBanner(); });
}