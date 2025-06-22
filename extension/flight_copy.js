(function(){
  // Only run on Google Flights pages
  if(!location.href.includes('google.com/travel/flights')) return;

  function showMessage(text){
    const div = document.createElement('div');
    div.textContent = text;
    Object.assign(div.style, {
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: '#fff',
      padding: '6px 8px',
      borderRadius: '4px',
      zIndex: 9999,
      fontSize: '12px'
    });
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 2000);
  }

  function formatRow(row){
    const text = row.innerText;
    if(!text) return null;

    const timeRegex = /(\d{1,2}:\d{2})/g;
    const airportRegex = /\b[A-Z]{3}\b/g;
    const times = text.match(timeRegex) || [];
    const airports = text.match(airportRegex) || [];

    const airlineEl = row.querySelector('[data-testid="airline-name"], [class*="airline"]');
    const priceEl = row.querySelector('[data-testid="listing-price-dollars"], [data-testid="offer-price"]');

    const depTime = times[0] || '';
    const arrTime = times[1] || '';
    const depAirport = airports[0] || '';
    const arrAirport = airports[1] || '';
    const airline = airlineEl ? airlineEl.innerText.trim() : '';
    const price = priceEl ? priceEl.innerText.trim() : '';

    if(!(depTime && arrTime && depAirport && arrAirport && airline && price)) return null;
    return `${depTime} ${depAirport} > ${arrTime} ${arrAirport}, ${airline}, ${price}`;
  }

  function addButtons(){
    const rows = document.querySelectorAll('[role="listitem"]');
    rows.forEach(row => {
      if(row.querySelector('.copy-flight-btn')) return;
      const btn = document.createElement('button');
      btn.textContent = 'Copy';
      btn.className = 'copy-flight-btn';
      Object.assign(btn.style, {
        marginLeft: '8px',
        padding: '2px 6px',
        fontSize: '12px'
      });
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const formatted = formatRow(row);
        if(!formatted){
          showMessage('Failed to parse');
          return;
        }
        navigator.clipboard.writeText(formatted).then(() => {
          showMessage('Copied!');
        }, () => {
          showMessage('Copy failed');
        });
      });
      row.appendChild(btn);
    });
  }

  const observer = new MutationObserver(() => addButtons());
  observer.observe(document.body, {childList: true, subtree: true});
  addButtons();
})();
