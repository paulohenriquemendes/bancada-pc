let missionFilters = { query: '', level: '', status: '' };
const normalizeSearch = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const escapeHTML = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function attemptPanel(s) {
  const score = Math.max(0, 1000 - s.penalty);
  const stage = s.solved ? 3 : s.diagnosed ? 2 : s.tests.length >= 2 ? 1 : 0;
  const instructions = ['Colete pelo menos duas pistas. Os testes são gratuitos.', 'Compare as pistas e escolha a causa do defeito.', 'Prepare a energia e aplique o reparo recomendado.', 'Reparo validado! Explore outro desafio ou pratique novamente.'];
  return `<section class="attempt-panel" aria-label="Sua tentativa"><div class="attempt-score"><div><small>${s.solved?'Pontuação desta tentativa':'Pontos desta tentativa'}</small><strong>${score}<span> / 1.000</span></strong></div><span class="tag">${s.solved?'Concluído':s.penalty?`−${s.penalty} pts`:'Sem descontos'}</span></div><meter min="0" max="1000" value="${score}" aria-label="Pontos desta tentativa">${score}</meter><ol class="journey">${['Investigar','Diagnosticar','Reparar'].map((label,i)=>`<li class="${stage>i?'done':stage===i?'current':''}" ${stage===i?'aria-current="step"':''}><span>${stage>i?'✓':i+1}</span>${label}</li>`).join('')}</ol><p>${instructions[stage]}</p></section>`;
}

function catalogCard(c,i) {
  const run=runs[i], ongoing=run&&!run.solved&&(run.tests.length>0||run.hint||run.wrong.length>0||run.diagnosed);
  const done=Object.hasOwn(saved.best,i);
  return `<article class="card mission"><span class="tag">${c.level} · ${c.area}</span><h3>${String(i+1).padStart(2,'0')} / ${c.title}</h3><p>${c.symptom}</p><div class="mission-status">${ongoing?`${run.tests.length}/3 pistas · Em andamento`:done?`✓ Recorde: ${saved.best[i]} / 1.000 pts`:'○ Ainda não resolvido'}</div><button class="outline" data-start="${i}">${ongoing?'Continuar investigação':done?'Praticar novamente':'Investigar caso'} →</button></article>`;
}

function updateCatalog() {
  const list=cases.map((c,i)=>({c,i})).filter(({c,i})=>{
    const run=runs[i],ongoing=run&&!run.solved&&(run.tests.length>0||run.hint||run.wrong.length>0||run.diagnosed);
    return (!missionFilters.query||normalizeSearch(`${c.title} ${c.area} ${c.symptom}`).includes(normalizeSearch(missionFilters.query.trim())))&&(!missionFilters.level||c.level===missionFilters.level)&&(!missionFilters.status||(missionFilters.status==='done'?Object.hasOwn(saved.best,i):missionFilters.status==='ongoing'?ongoing:!Object.hasOwn(saved.best,i)));
  });
  document.querySelector('#mission-list').innerHTML=list.length?list.map(({c,i})=>catalogCard(c,i)).join(''):'<div class="card no-results"><h3>Nenhum desafio encontrado</h3><p>Tente outro termo ou remova os filtros.</p><button class="outline" data-action="clear-filters">Limpar filtros</button></div>';
  document.querySelector('#filter-count').textContent=`${list.length} de ${cases.length} desafios`;
}

function catalog() {
  app.innerHTML=title(`${cases.length} desafios. Muitas descobertas.`,'Escolha um caso e coloque seu raciocínio técnico à prova.', '<button class="primary" data-action="random">Sortear desafio ↗</button>')+stats()+`<div class="catalog-filters"><label>Buscar desafio<input id="mission-search" type="search" placeholder="Ex.: memória, rede, energia…" value="${escapeHTML(missionFilters.query)}"></label><label>Dificuldade<select id="mission-level"><option value="">Todas as dificuldades</option>${['Iniciante','Intermediário','Avançado'].map(level=>`<option ${missionFilters.level===level?'selected':''}>${level}</option>`).join('')}</select></label><label>Progresso<select id="mission-status">${[['','Todos'],['pending','Ainda não resolvidos'],['ongoing','Em andamento'],['done','Concluídos']].map(([value,label])=>`<option value="${value}" ${missionFilters.status===value?'selected':''}>${label}</option>`).join('')}</select></label></div><div class="catalog-summary"><span id="filter-count" role="status"></span><button class="text-button" data-action="clear-filters">Limpar filtros</button></div><div class="mission-grid" id="mission-list"></div>`;
  updateCatalog();
}

document.addEventListener('input',e=>{if(e.target.id==='mission-search'){missionFilters.query=e.target.value;updateCatalog()}});
document.addEventListener('change',e=>{if(e.target.id==='mission-level')missionFilters.level=e.target.value;else if(e.target.id==='mission-status')missionFilters.status=e.target.value;else return;updateCatalog()});
document.addEventListener('click',e=>{
  const action=e.target.closest('button')?.dataset.action;
  if(action==='clear-filters'){missionFilters={query:'',level:'',status:''};catalog();document.querySelector('#mission-search').focus()}
  if(action==='random'){
    const unfinished=cases.map((_,i)=>i).filter(i=>!Object.hasOwn(saved.best,i));
    const pool=unfinished.length?unfinished:cases.map((_,i)=>i);
    start(pool[Math.floor(Math.random()*pool.length)]);
  }
});
