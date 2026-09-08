const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let audioCtx, master, musicOn=false, musicTimer;

function beep(freq=440,duration=.08,type='sine',gain=.035){
  if(!audioCtx || !musicOn) return;
  const o=audioCtx.createOscillator(), g=audioCtx.createGain();
  o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(gain,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);
  o.connect(g).connect(master);o.start();o.stop(audioCtx.currentTime+duration);
}
function startMusic(){
  if(audioCtx){musicOn=true; return;}
  audioCtx=new (window.AudioContext||window.webkitAudioContext)(); master=audioCtx.createGain(); master.gain.value=.025; master.connect(audioCtx.destination); musicOn=true;
  const notes=[261.63,329.63,392,329.63,293.66,349.23,440,349.23]; let i=0;
  musicTimer=setInterval(()=>{ if(!musicOn)return; beep(notes[i++%notes.length],.7,'sine',.012); },650);
}
function stopMusic(){musicOn=false;}
function unlockNext(id){const sec=$(id); if(sec)sec.classList.add('unlocked');}
function scrollToId(id){document.getElementById(id)?.scrollIntoView({behavior:'smooth'});}

window.addEventListener('load',()=>{
  setTimeout(()=>{ $('#loader').style.opacity='0'; setTimeout(()=>$('#loader').remove(),700); $('#hero').classList.add('visible'); },500);
});

$('#openBtn').addEventListener('click',()=>{
  startMusic(); beep(523,.15,'triangle',.05); beep(659,.18,'triangle',.04);
  ['#timeline','#why','#funny','#days','#gallery','#battle','#letter','#ending'].forEach(unlockNext);
  scrollToId('timeline');
});

$('#musicBtn').addEventListener('click',()=>{ if(!audioCtx)startMusic(); else musicOn?stopMusic():startMusic(); $('#musicBtn').textContent=musicOn?'♫':'♪'; beep(392,.1,'triangle',.04); });

$$('.reason-card').forEach(card=>card.addEventListener('click',()=>{
  $('#modalTitle').textContent=card.dataset.title; $('#modalText').textContent=card.dataset.text; $('#modalIcon').textContent=card.querySelector('i').textContent; $('#modal').classList.add('show'); $('#modal').setAttribute('aria-hidden','false'); beep(659,.12,'sine',.04);
}));
function closeModal(){ $('#modal').classList.remove('show'); $('#modal').setAttribute('aria-hidden','true'); }
$('#modalClose').addEventListener('click',closeModal); $('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});

$('#confessBtn').addEventListener('click',()=>{ $('#confessReveal').classList.remove('hidden-message'); beep(220,.12,'square',.03); $('#toast').textContent='Adu has officially been warned 😭'; $('#toast').classList.add('show'); setTimeout(()=>$('#toast').classList.remove('show'),2200); });

$$('.choice').forEach(btn=>btn.addEventListener('click',()=>{
  const r=$('#battleResult');
  if(btn.dataset.choice==='adu') r.innerHTML='<strong>According to Adu:</strong><br>Obviously Adu. She has to tolerate my anger, forgive me, and somehow forget my mistakes. 😂<br><small>Honestly… fair.</small>';
  else r.innerHTML='<strong>According to Hossen:</strong><br>Obviously Hossen. She is my first and only girlfriend, I listen to what she says, and I am completely gone for her. ❤️<br><small>But okay… she probably wins this one.</small>';
  beep(523,.1,'triangle',.04);beep(784,.15,'triangle',.035);
}));

$('#wishBtn').addEventListener('click',()=>{startMusic();beep(392,.2,'sine',.04);scrollToId('ending');});

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('entered')}),{threshold:.2});
$$('.section').forEach(s=>observer.observe(s));
