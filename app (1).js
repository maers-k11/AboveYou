document.addEventListener('DOMContentLoaded', () => {
  // 1. Starfield Background
  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');
  let stars = [];

  function initStars() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        alpha: Math.random(),
        speed: (Math.random() * 0.02) + 0.005
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
      star.alpha += star.speed;
      if (star.alpha <= 0 || star.alpha >= 1) star.speed = -star.speed;
      
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.alpha)})`;
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', initStars);
  initStars();
  drawStars();

  // 2. Time & Date
  function updateTime() {
    const now = new Date();
    document.getElementById('current-time').textContent = now.toLocaleTimeString('en-US', { hour12: false });
  }
  setInterval(updateTime, 1000);
  updateTime();

  // 3. Location Modal & Geolocation
  const locationBtn = document.getElementById('change-location-btn');
  const modal = document.getElementById('location-modal');
  const closeBtn = document.querySelector('.close-btn');
  const cityInput = document.getElementById('city-input');
  const currentCity = document.getElementById('current-city');

  locationBtn.addEventListener('click', () => {
    modal.classList.add('active');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  document.getElementById('use-gps-btn').addEventListener('click', () => {
    if (navigator.geolocation) {
      currentCity.textContent = 'Detecting...';
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lng = position.coords.longitude.toFixed(4);
          currentCity.textContent = `${lat}°, ${lng}°`;
          modal.classList.remove('active');
        },
        (error) => {
          currentCity.textContent = 'Location Denied';
          console.error("Error getting location:", error);
          modal.classList.remove('active');
        }
      );
    } else {
      currentCity.textContent = 'GPS Unsupported';
    }
  });

  document.querySelectorAll('.quick-city-tag').forEach(tag => {
    tag.addEventListener('click', (e) => {
      currentCity.textContent = e.target.getAttribute('data-name');
      modal.classList.remove('active');
    });
  });

  document.getElementById('search-city-btn').addEventListener('click', () => {
    if (cityInput.value.trim() !== '') {
      currentCity.textContent = cityInput.value.trim();
      cityInput.value = '';
      modal.classList.remove('active');
    }
  });

  // 4. Live ISS Tracker (Where the ISS at API)
  const mapCanvas = document.getElementById('iss-map-canvas');
  const mctx = mapCanvas.getContext('2d');
  
  async function fetchISS() {
    try {
      const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
      const data = await response.json();
      
      document.getElementById('iss-lat').textContent = data.latitude.toFixed(4) + '°';
      document.getElementById('iss-lng').textContent = data.longitude.toFixed(4) + '°';
      document.getElementById('iss-velocity').textContent = Math.round(data.velocity).toLocaleString() + ' km/h';
      document.getElementById('iss-altitude').textContent = Math.round(data.altitude) + ' km';
      
      updateISSMap(data.latitude, data.longitude);
    } catch (error) {
      console.error('Error fetching ISS data', error);
    }
  }

  function updateISSMap(lat, lng) {
    const wrapper = document.querySelector('.map-wrapper');
    mapCanvas.width = wrapper.clientWidth;
    mapCanvas.height = wrapper.clientHeight;
    
    mctx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
    
    const x = (lng + 180) * (mapCanvas.width / 360);
    const y = (lat * -1 + 90) * (mapCanvas.height / 180);
    
    mctx.beginPath();
    mctx.arc(x, y, 5, 0, Math.PI * 2);
    mctx.fillStyle = '#00f0ff';
    mctx.shadowBlur = 15;
    mctx.shadowColor = '#00f0ff';
    mctx.fill();

    mctx.beginPath();
    mctx.arc(x, y, 2, 0, Math.PI * 2);
    mctx.fillStyle = '#fff';
    mctx.fill();
  }

  setInterval(fetchISS, 3000);
  fetchISS();
  window.addEventListener('resize', fetchISS);

  // 5. Moon Phase Calculation
  function calculateMoonPhase() {
    const newMoonDate = new Date('2024-01-11T11:57:00Z').getTime();
    const now = new Date().getTime();
    const cycle = 29.53058867 * 24 * 60 * 60 * 1000;
    
    let phase = ((now - newMoonDate) % cycle) / cycle;
    if (phase < 0) phase += 1;
    
    const age = phase * 29.53;
    const illumination = (0.5 * (1 - Math.cos(phase * 2 * Math.PI))) * 100;
    
    document.getElementById('moon-age').textContent = age.toFixed(1) + ' days';
    document.getElementById('moon-illumination').textContent = Math.round(illumination) + '%';
    
    let phaseName = "";
    if (phase < 0.03 || phase > 0.97) phaseName = "New Moon";
    else if (phase < 0.25) phaseName = "Waxing Crescent";
    else if (phase < 0.28) phaseName = "First Quarter";
    else if (phase < 0.47) phaseName = "Waxing Gibbous";
    else if (phase < 0.53) phaseName = "Full Moon";
    else if (phase < 0.72) phaseName = "Waning Gibbous";
    else if (phase < 0.78) phaseName = "Last Quarter";
    else phaseName = "Waning Crescent";
    
    document.getElementById('moon-phase-name').textContent = phaseName;
    
    let daysToFull = 0;
    if (phase <= 0.5) {
        daysToFull = (0.5 - phase) * 29.53;
    } else {
        daysToFull = (1.5 - phase) * 29.53;
    }
    const nextFull = new Date(now + daysToFull * 24 * 60 * 60 * 1000);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    document.getElementById('moon-next-full').textContent = `${months[nextFull.getMonth()]} ${nextFull.getDate()}`;
    
    const path = document.getElementById('moon-light-path');
    path.setAttribute('d', 'M 50,5 A 45,45 0 0,1 50,95 A 25,45 0 0,0 50,5 Z'); 
  }
  calculateMoonPhase();

  // 6. AstroBot Chatbot
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const messagesContainer = document.getElementById('chat-messages-container');
  const clearChatBtn = document.getElementById('clear-chat');

  function addMessage(text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isUser ? 'user-message' : 'bot-message'} animate-fade-in`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    msgDiv.innerHTML = `
      <div class="message-content">
        <p>${text}</p>
      </div>
      <span class="message-time">${time}</span>
    `;
    
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function addTypingIndicator() {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message bot-message typing-msg';
    msgDiv.innerHTML = `
      <div class="message-content typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return msgDiv;
  }

  function simulateBotResponse(userMsg) {
    const indicator = addTypingIndicator();
    
    setTimeout(() => {
      indicator.remove();
      const lowerMsg = userMsg.toLowerCase();
      let response = "I'm still learning! But I can tell you about the ISS, planets, or meteor showers.";
      
      if (lowerMsg.includes('see') || lowerMsg.includes('tonight')) {
        response = "Tonight you'll have a great view of **Venus** right after sunset in the west. **Jupiter** will also be visible from 8:00 PM onwards.";
      } else if (lowerMsg.includes('interesting') || lowerMsg.includes('today')) {
        response = "Yes! The **Arietiids Meteor Shower** is active today. It's a daytime shower, but you might catch some right before dawn tomorrow.";
      } else if (lowerMsg.includes('iss') || lowerMsg.includes('space station')) {
        response = "The ISS is currently orbiting at over 27,000 km/h! You can track its live position on the map to your left.";
      } else if (lowerMsg.includes('outside')) {
        response = "I'd recommend going outside around 8:45 PM tonight. The skies will be clear, and you might catch a satellite flyover!";
      } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        response = "Hello there, star-gazer! How can I help you explore the cosmos today?";
      }

      addMessage(response, false);
    }, 1500);
  }

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    
    addMessage(text, true);
    chatInput.value = '';
    
    simulateBotResponse(text);
  });

  clearChatBtn.addEventListener('click', () => {
    messagesContainer.innerHTML = '';
    addMessage("Chat cleared. What else would you like to know about the sky?", false);
  });

  document.querySelectorAll('.suggestion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const query = btn.getAttribute('data-query');
      chatInput.value = query;
      chatForm.dispatchEvent(new Event('submit'));
    });
  });

  // 7. Birthday Sky (NASA APOD API)
  const birthdayInput = document.getElementById('birthday-input');
  const birthdayForm = document.getElementById('birthday-form');
  const birthdayResult = document.getElementById('birthday-result');

  // Set max date to today
  const today = new Date().toISOString().split('T')[0];
  birthdayInput.setAttribute('max', today);

  birthdayForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const selectedDate = birthdayInput.value;
    if (!selectedDate) return;

    birthdayResult.style.display = 'block';
    birthdayResult.innerHTML = '<p class="text-cyan pulse">Communicating with NASA...</p>';

    // APOD starts from June 16, 1995
    const limitDate = new Date('1995-06-16');
    const inputDateObj = new Date(selectedDate);
    
    if (inputDateObj < limitDate) {
      birthdayResult.innerHTML = `
        <div class="apod-error">
          <p><i class="fa-solid fa-triangle-exclamation text-orange"></i> NASA APOD archives only go back to <strong>June 16, 1995</strong>.</p>
          <p style="font-size:0.8rem; margin-top:0.5rem;" class="text-muted">Fun Fact: Before this date, the Hubble Space Telescope was recently launched and just beginning to unlock the universe's secrets!</p>
        </div>
      `;
      return;
    }

    try {
      const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${selectedDate}`);
      if (!res.ok) throw new Error('API Request Failed');
      const data = await res.json();
      
      let mediaHtml = '';
      if (data.media_type === 'video') {
        mediaHtml = `<iframe src="${data.url}" frameborder="0" allowfullscreen class="apod-media"></iframe>`;
      } else {
        mediaHtml = `<img src="${data.url}" alt="${data.title}" class="apod-media">`;
      }

      birthdayResult.innerHTML = `
        ${mediaHtml}
        <h4 style="margin-top:0.75rem;">${data.title}</h4>
        <p class="text-muted" style="font-size:0.8rem; margin-top:0.4rem; max-height:100px; overflow-y:auto; padding-right:5px;">${data.explanation}</p>
      `;
    } catch (error) {
      birthdayResult.innerHTML = `<p class="text-red">Error fetching data. Try another date.</p>`;
    }
  });
});
