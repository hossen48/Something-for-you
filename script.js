const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

let audioCtx = null;
let sfxMaster = null;
let soundOn = true;
const bgMusic = $('#bgMusic');

function ensureSfx() {
  if (audioCtx) return;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  audioCtx = new Ctx();
  sfxMaster = audioCtx.createGain();
  sfxMaster.gain.value = 0.14;
  sfxMaster.connect(audioCtx.destination);
}

async function unlockSound() {
  ensureSfx();
  if (audioCtx && audioCtx.state === 'suspended') {
    try { await audioCtx.resume(); } catch (_) {}
  }
}

function beep(freq = 440, duration = 0.08, type = 'sine', gain = 0.08) {
  if (!soundOn) return;
  ensureSfx();
  if (!audioCtx || !sfxMaster) return;
  const now = audioCtx.currentTime;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, now);
  g.gain.setValueAtTime(Math.max(gain, 0.001), now);
  g.gain.exponentialRampToValueAtTime(0.001, now + duration);
  o.connect(g).connect(sfxMaster);
  o.start(now);
  o.stop(now + duration + 0.02);
}

async function startMusic() {
  soundOn = true;
  $('#musicBtn').textContent = '♫';
  $('#musicBtn').setAttribute('aria-pressed', 'true');
  try {
    bgMusic.volume = 0.48;
    await bgMusic.play();
  } catch (_) {
    // Some browsers need another tap before media can start.
    $('#toast').textContent = 'Tap the music button once to start the music ♫';
    $('#toast').classList.add('show');
    setTimeout(() => $('#toast').classList.remove('show'), 2600);
  }
  await unlockSound();
}

function stopMusic() {
  soundOn = false;
  bgMusic.pause();
  $('#musicBtn').textContent = '♪';
  $('#musicBtn').setAttribute('aria-pressed', 'false');
}

function unlockNext(id) {
  const sec = $(id);
  if (sec) sec.classList.add('unlocked');
}

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

window.addEventListener('load', () => {
  setTimeout(() => {
    $('#loader')?.remove();
    $('#hero')?.classList.add('visible');
  }, 450);
}, { once: true });

$('#openBtn').addEventListener('click', async () => {
  await startMusic();
  beep(523, .12, 'triangle', .10);
  setTimeout(() => beep(659, .16, 'triangle', .08), 90);
  ['#timeline','#why','#funny','#days','#gallery','#battle','#letter','#ending'].forEach(unlockNext);
  scrollToId('timeline');
});

$('#musicBtn').addEventListener('click', async () => {
  if (bgMusic.paused) {
    await startMusic();
    beep(659, .12, 'triangle', .10);
  } else {
    stopMusic();
  }
});

$$('.reason-card').forEach(card => card.addEventListener('click', async () => {
  await unlockSound();
  $('#modalTitle').textContent = card.dataset.title;
  $('#modalText').textContent = card.dataset.text;
  $('#modalIcon').textContent = card.querySelector('i').textContent;
  $('#modal').classList.add('show');
  $('#modal').setAttribute('aria-hidden', 'false');
  beep(659, .12, 'sine', .09);
}));

function closeModal() {
  $('#modal').classList.remove('show');
  $('#modal').setAttribute('aria-hidden', 'true');
}
$('#modalClose').addEventListener('click', closeModal);
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });

$('#confessBtn').addEventListener('click', async () => {
  await unlockSound();
  $('#confessReveal').classList.remove('hidden-message');
  beep(220, .12, 'square', .07);
  $('#toast').textContent = 'Adu has officially been warned 😭';
  $('#toast').classList.add('show');
  setTimeout(() => $('#toast').classList.remove('show'), 2200);
});

$$('.choice').forEach(btn => btn.addEventListener('click', async () => {
  await unlockSound();
  const r = $('#battleResult');
  if (btn.dataset.choice === 'adu') {
    r.innerHTML = '<strong>According to Adu:</strong><br>Obviously Adu. She has to tolerate my anger, forgive me, and somehow forget my mistakes. 😂<br><small>Honestly… fair.</small>';
  } else {
    r.innerHTML = '<strong>According to Hossen:</strong><br>Obviously Hossen. She is my first and only girlfriend, I listen to what she says, and I am completely gone for her. ❤️<br><small>But okay… she probably wins this one.</small>';
  }
  beep(523, .10, 'triangle', .09);
  setTimeout(() => beep(784, .15, 'triangle', .07), 90);
}));

$('#wishBtn').addEventListener('click', async () => {
  await startMusic();
  beep(392, .20, 'sine', .09);
  scrollToId('ending');
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('entered');
  });
}, { threshold: 0.12 });
$$('.section').forEach(s => observer.observe(s));
