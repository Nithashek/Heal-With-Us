// ── Pages ──
  function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0,0);
  }
  function setActive(el) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    el.classList.add('active');
  }

  // ── Modals ──
  function openModal(type) {
    if(type==='auth') document.getElementById('authModal').classList.add('open');
    if(type==='match') document.getElementById('matchModal').classList.add('open');
  }
  function closeModal(id) {
    document.getElementById(id).classList.remove('open');
    // reset auth
    if(id==='authModal') {
      document.getElementById('authStep1').style.display='block';
      document.getElementById('authStep2').style.display='none';
      document.getElementById('authStep3').style.display='none';
    }
  }
  document.querySelectorAll('.overlay').forEach(o => {
    o.addEventListener('click', function(e){ if(e.target===this) this.classList.remove('open'); });
  });

  // ── Tabs ──
  function switchTab(el, form) {
    document.querySelectorAll('#authModal .tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('signup-form').style.display = form==='signup' ? 'block' : 'none';
    document.getElementById('login-form').style.display = form==='login' ? 'block' : 'none';
  }

  // ── Username check ──
  const taken = ['sunbeam42','willowmoon','riverstone','duskpetal','morningdew'];
  function checkUsername(el) {
    const v = el.value.toLowerCase().trim();
    const hint = document.getElementById('usernameHint');
    if(!v) { hint.textContent = 'Pick a unique pseudonym — this is how others know you.'; hint.className='field-hint'; return; }
    if(taken.includes(v)) { hint.textContent = '✗ Username already taken. Try another!'; hint.className='field-hint err'; }
    else if(v.length < 4) { hint.textContent = 'Username must be at least 4 characters.'; hint.className='field-hint err'; }
    else { hint.textContent = '✓ Username available!'; hint.className='field-hint ok'; }
  }

  // ── Auth flow ──
  function goToVerify() {
    document.getElementById('authStep1').style.display='none';
    document.getElementById('authStep2').style.display='block';
  }
  function verifySuccess() {
    const un = document.getElementById('usernameInput').value || 'WillowMoon';
    document.getElementById('welcomeUser').textContent = un;
    document.getElementById('authStep2').style.display='none';
    document.getElementById('authStep3').style.display='block';
  }
  function loginSuccess() {
    document.getElementById('authStep2').style.display='none';
    document.getElementById('authStep3').style.display='block';
    document.getElementById('welcomeUser').textContent = 'WillowMoon';
    document.getElementById('authStep1').style.display='none';
  }

  // ── OTP nav ──
  const otpInputs = document.querySelectorAll('.otp-row input');
  function otpNext(el, idx) {
    if(el.value && idx < 5) otpInputs[idx+1].focus();
  }

  // ── Chat ──
  const responses = [
    "I hear you. Take your time. 🌿",
    "That sounds really tough. How long have you been feeling this way?",
    "You're braver than you think for sharing this.",
    "It's okay to not be okay. I'm here with you. 💙",
    "What would make you feel even a little lighter right now?",
    "You're not alone in this — not at all.",
  ];
  let rIdx = 0;
  function sendMessage() {
    const inp = document.getElementById('chatInput');
    const text = inp.value.trim();
    if(!text) return;
    const msgs = document.getElementById('messages');
    const typing = document.getElementById('typing-msg');
    const now = new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    // User bubble
    msgs.insertBefore(createBubble(text, 'sent', now, 'Me', 'var(--accent)'), typing);
    inp.value = '';
    msgs.scrollTop = msgs.scrollHeight;
    // Typing indicator
    typing.style.display='flex';
    msgs.scrollTop = msgs.scrollHeight;
    setTimeout(() => {
      typing.style.display='none';
      msgs.insertBefore(createBubble(responses[rIdx++ % responses.length], 'recv', now, 'S', 'var(--deep-sage)'), typing);
      msgs.scrollTop = msgs.scrollHeight;
    }, 1800);
  }
  function createBubble(text, dir, time, initials, bg) {
    const div = document.createElement('div');
    div.className = `msg ${dir}`;
    div.innerHTML = `
      <div class="msg-avatar" style="background:${bg};width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:600;color:white;flex-shrink:0;">${initials}</div>
      <div class="msg-content">
        <div class="bubble">${text}</div>
        <div class="msg-time">${time}</div>
      </div>`;
    return div;
  }
  function handleChatKey(e) { if(e.key==='Enter') sendMessage(); }

  // ── Call ──
  let callActive = false, timerInterval, seconds = 0;
  let mutedState = false, speakerState = true;
  function selectCallType(el) {
    document.querySelectorAll('.call-option-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
  }
  function startCall(name) {
    document.querySelector('.call-name').textContent = name;
    document.getElementById('callStatus').textContent = 'Connecting…';
    setTimeout(() => {
      document.getElementById('callStatus').textContent = '🟢 Connected';
      document.getElementById('callTimer').style.display='block';
      callActive = true; seconds = 0;
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        seconds++;
        const m = String(Math.floor(seconds/60)).padStart(2,'0');
        const s = String(seconds%60).padStart(2,'0');
        document.getElementById('callTimer').textContent = `${m}:${s}`;
      }, 1000);
    }, 2000);
  }
  function endCall() {
    clearInterval(timerInterval);
    document.getElementById('callStatus').textContent = 'Call ended.';
    document.getElementById('callTimer').style.display='none';
    document.querySelector('.call-name').textContent = 'Sunbeam42';
    callActive = false;
    setTimeout(() => { document.getElementById('callStatus').textContent = 'Finding someone for you…'; }, 1500);
  }
  function toggleMute() {
    mutedState = !mutedState;
    const btn = document.getElementById('muteBtn');
    btn.textContent = mutedState ? '🔇' : '🎤';
    btn.classList.toggle('active', mutedState);
  }
  function toggleSpeaker() {
    speakerState = !speakerState;
    document.getElementById('speakerBtn').textContent = speakerState ? '🔊' : '🔈';
  }

  // auto start call ring
  setTimeout(() => startCall('Sunbeam42'), 500);