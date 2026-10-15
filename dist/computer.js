let motionPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
try { const preference = localStorage.getItem('bancada-motion-paused'); if(preference !== null) motionPaused = preference === 'true'; } catch {}

function computerView(c, s) {
  const modes = ['power','memory','heat','boot','network','audio','loading','artifact'];
  const mode = s.solved ? 'success' : !s.power ? 'off' : c.visual || modes[current] || 'loading';
  const screen = s.solved ? 'SISTEMA OPERACIONAL<br>✓ FUNCIONANDO' : s.power ? c.screen.replaceAll('\n','<br>') : 'SEM SINAL';
  return `<div class="scene computer-scene mode-${mode} ${s.power?'powered':''} ${motionPaused?'motion-paused':'motion-enabled'}">
    <span class="scene-label">BANCADA VIRTUAL / PC-${String(current+1).padStart(2,'0')}</span>
    <span class="scene-badge">${s.solved?'✓ Reparo validado':s.power?'● Em observação':'○ Energia desconectada'}</span>
    <div class="desk"></div><div class="ambient-light" aria-hidden="true"></div>
    <button class="monitor" data-action="observe" aria-label="Observar monitor">
      <span class="screen-top" aria-hidden="true"><i></i><i></i><i></i><span>PC LAB</span></span>
      <span class="screen-symbol" aria-hidden="true">${({success:'✓',off:'⏻',heat:'♨',network:'⌁',crash:':(',clock:'◷',storage:'▤',printer:'▤',keyboard:'⌨',usb:'⌁',artifact:'▧',signal:'◇',audio:'♫'})[mode]||'▥'}</span>
      <span class="screen-copy">${screen}</span>
      <span class="screen-activity" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
      <span class="screen-scan" aria-hidden="true"></span><span class="artifact-lines" aria-hidden="true"></span>
    </button>
    <button class="tower ${s.power?'on':''}" data-action="inspect" aria-label="Observar gabinete">
      <span class="tower-top" aria-hidden="true"><i class="led"></i><i class="usb"></i><i class="usb"></i></span>
      <span class="case-window" aria-hidden="true"><span class="board-traces"></span><span class="fan"></span><span class="ram-sticks"><i></i><i></i></span><span class="gpu-card"><i></i><i></i><i></i></span><span class="disk-light"></span><span class="case-cable"></span></span>
      <span class="tower-label">BANCADA / PC</span><span class="airflow" aria-hidden="true"><i></i><i></i><i></i></span>
    </button>
    <div class="keyboard" aria-hidden="true"></div><span class="scene-note">Clique no monitor ou no gabinete para observar</span>
  </div><div class="scene-controls"><span>Visualização ilustrativa dos sintomas</span><button class="text-button" data-action="motion" aria-pressed="${motionPaused}">${motionPaused?'Ativar animações':'Pausar animações'}</button></div>`;
}

document.addEventListener('click', e => {
  if(e.target.closest('button')?.dataset.action !== 'motion') return;
  motionPaused = !motionPaused;
  try { localStorage.setItem('bancada-motion-paused', String(motionPaused)); } catch {}
  const scene = document.querySelector('.computer-scene');
  scene?.classList.toggle('motion-paused', motionPaused);
  scene?.classList.toggle('motion-enabled', !motionPaused);
  const button = document.querySelector('[data-action="motion"]');
  button.textContent = motionPaused ? 'Ativar animações' : 'Pausar animações';
  button.setAttribute('aria-pressed', String(motionPaused));
});
