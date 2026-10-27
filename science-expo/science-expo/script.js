(()=>{
'use strict';
/* ===== SETUP: paste your free Formspree endpoint (a public ID, not a secret) =====
   Create a form at formspree.io, then replace YOUR_FORM_ID. Until then the site runs in demo mode. */
const FORM_ENDPOINT='https://formspree.io/f/YOUR_FORM_ID';
const DEMO=FORM_ENDPOINT.includes('YOUR_FORM_ID');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=(s,r=document)=>r.querySelector(s);

/* ===== Starfield: twinkling stars, floating particles, occasional shooting star ===== */
const cv=$('#sky'),cx=cv.getContext('2d');let W,H,stars=[],parts=[],shoot=null,bursts=[];
function size(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0);
  const n=Math.round(Math.min(130,W*H/9000));
  stars=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+.3,p:Math.random()*6.28,s:Math.random()*1.5+.5}));
  parts=Array.from({length:Math.round(n/5)},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2.5+1,vx:(Math.random()-.5)*.25,vy:-Math.random()*.3-.05,c:Math.random()>.5?'56,189,248':'255,215,0'}))}
function glow(x,y,r,c,a){const g=cx.createRadialGradient(x,y,0,x,y,r*5);g.addColorStop(0,`rgba(${c},${a})`);g.addColorStop(1,`rgba(${c},0)`);cx.fillStyle=g;cx.beginPath();cx.arc(x,y,r*5,0,6.28);cx.fill()}
let last=0;
function frame(t){cx.clearRect(0,0,W,H);
  for(const s of stars){const a=reduce?.6:.35+.65*Math.abs(Math.sin(t/1000*s.s+s.p));cx.fillStyle=`rgba(255,255,255,${a})`;cx.beginPath();cx.arc(s.x,s.y,s.r,0,6.28);cx.fill()}
  for(const p of parts){if(!reduce){p.x+=p.vx;p.y+=p.vy;if(p.y<-10){p.y=H+10;p.x=Math.random()*W}if(p.x<-10)p.x=W+10;if(p.x>W+10)p.x=-10}glow(p.x,p.y,p.r,p.c,.35)}
  if(!reduce){if(!shoot&&t-last>9000&&Math.random()<.01){shoot={x:Math.random()*W*.7,y:Math.random()*H*.4,l:0};last=t}
    if(shoot){shoot.x+=9;shoot.y+=4.5;shoot.l++;const g=cx.createLinearGradient(shoot.x,shoot.y,shoot.x-90,shoot.y-45);g.addColorStop(0,'rgba(255,255,255,.9)');g.addColorStop(1,'rgba(255,255,255,0)');cx.strokeStyle=g;cx.lineWidth=2;cx.beginPath();cx.moveTo(shoot.x,shoot.y);cx.lineTo(shoot.x-90,shoot.y-45);cx.stroke();if(shoot.l>70)shoot=null}}
  bursts=bursts.filter(b=>b.life>0);for(const b of bursts){b.x+=b.vx;b.y+=b.vy;b.vy+=.04;b.life--;cx.fillStyle=`rgba(255,215,0,${b.life/b.max})`;star(b.x,b.y,b.r,b.rot+=.05)}
  requestAnimationFrame(frame)}
function star(x,y,r,rot){cx.save();cx.translate(x,y);cx.rotate(rot);cx.beginPath();for(let i=0;i<10;i++){const q=i%2?r*.45:r,a=i*Math.PI/5;cx.lineTo(Math.sin(a)*q,-Math.cos(a)*q)}cx.closePath();cx.fill();cx.restore()}
function burst(x,y,n){if(reduce)return;for(let i=0;i<n;i++){const a=Math.random()*6.28,v=Math.random()*5+2,l=Math.random()*50+50;bursts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-2,r:Math.random()*7+4,life:l,max:l,rot:0})}}
size();addEventListener('resize',size);requestAnimationFrame(frame);

/* ===== Thank-you page ===== */
if(document.body.dataset.page==='thanks'){
  if(!sessionStorage.getItem('expo_done')){location.replace('index.html');return}
  sessionStorage.removeItem('expo_done');
  const r=$('#ty').getBoundingClientRect();
  setTimeout(()=>{burst(r.left+r.width/2,r.top+r.height/2,34)},700);
  setTimeout(()=>{burst(r.left+r.width*.2,r.top+r.height/2,12);burst(r.left+r.width*.8,r.top+r.height/2,12)},1100);
  return;
}

/* ===== Form page ===== */
const form=$('#fb'),stars_=[...document.querySelectorAll('#stars button')],txt=$('#rating-text'),bar=$('#bar'),btn=$('#submit');
const LABELS=['','Poor','Fair','Good','Very Good','Excellent!'];
let rating=0;
const DKEY='expo_draft';

function paint(n){stars_.forEach((b,i)=>b.classList.toggle('on',i<n))}
function setRating(v,fromUser){
  rating=v;paint(v);
  stars_.forEach((b,i)=>{b.setAttribute('aria-checked',i+1===v);b.tabIndex=(v?i+1===v:i===0)?0:-1});
  txt.textContent=v?`${v} star${v>1?'s':''} · ${LABELS[v]}`:'Tap a star to rate';txt.classList.toggle('set',!!v);
  if(v)$('#err-rating').textContent='';
  if(fromUser&&v){const b=stars_[v-1];b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop');sparkle(b)}
  progress();save()}
function sparkle(b){if(reduce)return;const c=$('#stars').getBoundingClientRect(),r=b.getBoundingClientRect();
  for(let i=0;i<10;i++){const s=document.createElement('i');s.className='spark';s.style.left=(r.left-c.left+r.width/2)+'px';s.style.top=(r.top-c.top+r.height/2)+'px';
    const a=i/10*6.28,d=34+Math.random()*24;s.style.setProperty('--dx',Math.cos(a)*d+'px');s.style.setProperty('--dy',Math.sin(a)*d+'px');$('#stars').appendChild(s);setTimeout(()=>s.remove(),850)}
  burst(r.left+r.width/2,r.top+r.height/2,8)}
stars_.forEach((b,i)=>{
  b.addEventListener('click',()=>setRating(i+1,true));
  b.addEventListener('mouseenter',()=>paint(i+1));
  b.addEventListener('focus',()=>{});
  b.addEventListener('keydown',e=>{let n=i;
    if(e.key==='ArrowRight'||e.key==='ArrowUp')n=Math.min(4,i+1);else if(e.key==='ArrowLeft'||e.key==='ArrowDown')n=Math.max(0,i-1);
    else if(e.key==='Home')n=0;else if(e.key==='End')n=4;else return;
    e.preventDefault();stars_[n].focus();setRating(n+1,true)})});
$('#stars').addEventListener('mouseleave',()=>paint(rating));

/* counters, progress, draft autosave */
const fields=['feedback','reason'];
function progress(){let p=rating?1:0;fields.forEach(f=>{if($('#'+f).value.trim())p++});bar.style.width=(p/3*100)+'%'}
function save(){try{localStorage.setItem(DKEY,JSON.stringify({rating,feedback:$('#feedback').value,reason:$('#reason').value,exhibit:$('#exhibit').value,tags:tags(),reco:(form.recommend.value||'')}))}catch(e){}}
const tags=()=>[...document.querySelectorAll('#chips input:checked')].map(i=>i.value);
fields.forEach(f=>{const el=$('#'+f);el.addEventListener('input',()=>{$('#c-'+f).textContent=`${el.value.length} / ${el.maxLength}`;if(el.value.trim()){el.classList.remove('invalid');$('#err-'+f).textContent=''}progress();save()})});
form.addEventListener('change',save);$('#exhibit').addEventListener('input',save);
try{const d=JSON.parse(localStorage.getItem(DKEY)||'null');if(d){
  $('#feedback').value=d.feedback||'';$('#reason').value=d.reason||'';$('#exhibit').value=d.exhibit||'';
  (d.tags||[]).forEach(t=>{const i=[...document.querySelectorAll('#chips input')].find(x=>x.value===t);if(i)i.checked=true});
  if(d.reco){const i=[...document.querySelectorAll('#reco input')].find(x=>x.value===d.reco);if(i)i.checked=true}
  fields.forEach(f=>$('#c-'+f).textContent=`${$('#'+f).value.length} / 1000`);
  if(d.rating)setRating(d.rating,false);progress()}}catch(e){}

/* validation */
function validate(){let first=null;
  const bad=(id,msg,el)=>{$('#err-'+id).textContent=msg;if(el){el.classList.add('invalid');el.setAttribute('aria-invalid','true')}first=first||el||stars_[0]};
  if(!rating)bad('rating','Please select a star rating.');
  for(const f of fields){const el=$('#'+f);if(!el.value.trim())bad(f,f==='feedback'?'Please tell us about your experience.':'Please tell us why you chose this rating.',el);else el.removeAttribute('aria-invalid')}
  if(first){first.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});setTimeout(()=>first.focus({preventScroll:true}),350)}
  return !first}
function toast(m){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';t.setAttribute('role','status');document.body.appendChild(t)}t.textContent=m;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),4500)}

form.addEventListener('submit',async e=>{
  e.preventDefault();$('#err-form').textContent='';
  if(btn.disabled||!validate())return;
  if(form._gotcha&&form._gotcha.value){return}
  const body={rating,rating_label:LABELS[rating],feedback:$('#feedback').value.trim(),reason:$('#reason').value.trim(),
    highlights:tags().join(', '),favourite_exhibit:$('#exhibit').value.trim(),recommend:form.recommend.value||'',
    submitted_at:new Date().toISOString(),_gotcha:form._gotcha.value};
  btn.disabled=true;btn.classList.add('loading');btn.querySelector('.lbl').textContent='SENDING…';
  try{
    if(DEMO){await new Promise(r=>setTimeout(r,900));console.warn('Demo mode: set FORM_ENDPOINT in script.js to store feedback.');
      const all=JSON.parse(localStorage.getItem('expo_demo')||'[]');all.push(body);localStorage.setItem('expo_demo',JSON.stringify(all))}
    else{const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),15000);
      const res=await fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(body),signal:ctl.signal});
      clearTimeout(to);if(!res.ok)throw new Error('HTTP '+res.status)}
    try{localStorage.removeItem(DKEY)}catch(e){}
    sessionStorage.setItem('expo_done','1');location.href='thankyou.html';
  }catch(err){
    btn.disabled=false;btn.classList.remove('loading');btn.querySelector('.lbl').textContent='SUBMIT FEEDBACK →';
    const m=navigator.onLine?'We couldn’t save your feedback. Your answers are still here, so please try again.':'You’re offline. Reconnect to the internet, then press submit again.';
    $('#err-form').textContent=m;toast(m)}
});
/* restore button if user returns via browser back */
addEventListener('pageshow',e=>{if(e.persisted){btn.disabled=false;btn.classList.remove('loading');btn.querySelector('.lbl').textContent='SUBMIT FEEDBACK →'}});
})();
