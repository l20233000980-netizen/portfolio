const hero = document.querySelector('.hero');
const layer = document.querySelector('.trail-layer');
const projects = [...document.querySelectorAll('.project')];
const sources = Array.from({length: 11}, (_, i) => `assets/photo-${i + 1}.jpg`);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let lastX = -1000, lastY = -1000, lastTime = 0, index = 0, resetTimer;
sources.forEach(src => { const image = new Image(); image.src = src; });
hero.addEventListener('pointermove', event => {
  if (event.pointerType === 'touch' || reduceMotion.matches) return;
  const bounds = hero.getBoundingClientRect();
  const x = event.clientX - bounds.left, y = event.clientY - bounds.top;
  const now = performance.now();
  if (Math.hypot(x-lastX,y-lastY) < 75 || now-lastTime < 95) return;
  lastX = x; lastY = y; lastTime = now;
  hero.classList.add('is-exploring');
  clearTimeout(resetTimer);
  resetTimer = setTimeout(() => hero.classList.remove('is-exploring'), 1500);
  const image = document.createElement('img');
  image.className = 'trail-image'; image.alt = ''; image.src = sources[index++ % sources.length];
  image.style.left = x + 'px'; image.style.top = y + 'px';
  layer.append(image);
  const rotation = (index % 5 - 2) * 7;
  const animation = image.animate([
    {transform:`translate(-50%,-45%) rotate(${rotation-5}deg) scale(.65)`,opacity:0},
    {transform:`translate(-50%,-50%) rotate(${rotation}deg) scale(1)`,opacity:1,offset:.18},
    {transform:`translate(-50%,-50%) rotate(${rotation}deg) scale(1)`,opacity:1,offset:.48},
    {transform:`translate(-50%,-62%) rotate(${rotation+4}deg) scale(.85)`,opacity:0}
  ], {duration:1150,easing:'cubic-bezier(.2,.65,.3,1)',fill:'forwards'});
  animation.onfinish = () => image.remove();
});
hero.addEventListener('pointerleave', () => { lastX = -1000; lastY = -1000; });
const dialog = document.querySelector('dialog');
projects.forEach(project => project.addEventListener('click', () => {
  const source = project.querySelector('img');
  const target = dialog.querySelector('img'); target.src = source.src; target.alt = source.alt;
  document.querySelector('#dialog-title').textContent = project.querySelector('h3').textContent;
  dialog.showModal(); document.body.style.overflow = 'hidden';
}));
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if(event.target === dialog) { const r = dialog.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
