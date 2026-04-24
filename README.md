# daas-cookie-banner

#location
geo-location: https://get.geojs.io/v1/ip/geo.json


#if we plan to restrict stateleevl
// 4. GEO-LOGIC ENGINE (Updated with Global State-Level Targeting)
var userChoice = localStorage.getItem('daas_cookie_choice');
if (userChoice === 'granted') {
    enableTracking(); 
} else if (userChoice === 'denied') {
    // Stays blocked
} else {
    fetch('https://get.geojs.io/v1/ip/geo.json')
      .then(response => response.json())
      .then(data => {
        const strictCountries = ['GB', 'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'CH', 'NO', 'IS'];
        
        // Create arrays for the specific regions you want to block
        const strictUSStates = ['California', 'Virginia', 'Colorado', 'Connecticut', 'Utah'];
        const strictCanadaProvinces = ['Quebec']; // Example: Blocking Quebec
        const strictAussieStates = ['New South Wales', 'Victoria']; // Example: Blocking parts of Australia
        
        // 1. Strict EU/UK Check
        if (strictCountries.includes(data.country_code)) { 
            showBanner(); 
        } 
        // 2. Strict US State Check
        else if (data.country_code === 'US' && strictUSStates.includes(data.region)) {
            showBanner();
        }
        // 3. Strict Canada Province Check
        else if (data.country_code === 'CA' && strictCanadaProvinces.includes(data.region)) {
            showBanner();
        }
        // 4. Strict Australia State Check
        else if (data.country_code === 'AU' && strictAussieStates.includes(data.region)) {
            showBanner();
        }
        // 5. Relaxed Zone (Auto-Fire + Opt-Out Banner for everyone else)
        else { 
            enableTracking(); 
            showBanner(); 
        }
      })
      .catch(error => { console.error('Geo API failed', error); showBanner(); });
}
