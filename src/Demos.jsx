import {useState,useMemo} from 'react'
const rnd=s=>()=>(s=(s*16807)%2147483647)/2147483647
const C=['var(--accent)','var(--warm)','var(--ok)','var(--violet)','var(--bad)']
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)

export function Knn(){
  const pts=useMemo(()=>{const r=rnd(7);return Array.from({length:24},(_,i)=>{const c=i%2;return{x:(c?62:30)+(r()-.5)*44,y:(c?40:62)+(r()-.5)*44,c}})},[])
  const[k,setK]=useState(3),[q,setQ]=useState({x:46,y:50})
  const near=pts.map(p=>({...p,d:dist(p,q)})).sort((a,b)=>a.d-b.d).slice(0,k)
  const v=[0,1].map(c=>near.filter(p=>p.c===c).length),pred=v[1]>v[0]?1:0
  const click=e=>{const b=e.currentTarget.getBoundingClientRect();setQ({x:(e.clientX-b.left)/b.width*100,y:(e.clientY-b.top)/b.height*100})}
  return <div className="demo"><svg viewBox="0 0 100 100" className="plot" onClick={click} role="img" aria-label="Точки двух классов и новая точка">
    {near.map((p,i)=><line key={i} x1={q.x} y1={q.y} x2={p.x} y2={p.y} stroke="var(--muted)" strokeWidth=".4"/>)}
    {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="2.2" fill={C[p.c]}/>)}
    <rect x={q.x-2.4} y={q.y-2.4} width="4.8" height="4.8" fill={C[pred]} stroke="var(--ink)" strokeWidth=".6"/></svg>
    <div className="ctl"><label>Число соседей k: {k}<input type="range" min="1" max="15" value={k} onChange={e=>setK(+e.target.value)}/></label>
    <p>Голоса: класс A (синие) — {v[0]}, класс B (оранжевые) — {v[1]}. Квадрат относится к классу {pred?'B':'A'}.</p>
    <p className="hint">Щёлкните по полю, чтобы передвинуть квадрат, и сравните k = 1 и k = 15 рядом с границей классов.</p></div></div>
}

export function Logit(){
  const d=useMemo(()=>{const r=rnd(11);return Array.from({length:40},(_,i)=>{const y=i%2;return{y,p:Math.min(.99,Math.max(.01,(y?.68:.32)+(r()-.5)*.6))}})},[])
  const[t,setT]=useState(.5)
  let tp=0,fp=0,fn=0,tn=0
  d.forEach(s=>{const h=s.p>=t;if(h&&s.y)tp++;else if(h)fp++;else if(s.y)fn++;else tn++})
  const pr=tp+fp?tp/(tp+fp):0,rc=tp+fn?tp/(tp+fn):0,f=pr+rc?2*pr*rc/(pr+rc):0,pc=x=>Math.round(x*100)+'%'
  return <div className="demo"><svg viewBox="0 0 100 40" className="strip" role="img" aria-label="Вероятности, выданные моделью, и порог">
    <line x1={t*100} x2={t*100} y1="0" y2="40" stroke="var(--ink)" strokeWidth=".6" strokeDasharray="2 1.5"/>
    {d.map((s,i)=><circle key={i} cx={s.p*100} cy={s.y?12:28} r="1.6" fill={s.y?C[1]:C[0]}/>)}</svg>
    <p className="hint">Верхний ряд — объекты класса 1 (оранжевые), нижний — класса 0 (синие). По горизонтали — вероятность класса 1 по мнению модели.</p>
    <div className="ctl"><label>Порог: {t.toFixed(2)}<input type="range" min="0" max="1" step=".01" value={t} onChange={e=>setT(+e.target.value)}/></label>
    <table className="cm"><tbody><tr><th></th><th>Предсказан 1</th><th>Предсказан 0</th></tr>
    <tr><th>Факт 1</th><td>{tp} (TP)</td><td>{fn} (FN)</td></tr><tr><th>Факт 0</th><td>{fp} (FP)</td><td>{tn} (TN)</td></tr></tbody></table>
    <div className="stats"><span>Точность <b>{pc(pr)}</b></span><span>Полнота <b>{pc(rc)}</b></span><span>F-мера <b>{pc(f)}</b></span></div></div></div>
}

export function KMeans(){
  const pts=useMemo(()=>{const r=rnd(5),cs=[[22,25],[70,30],[45,75]];return Array.from({length:45},(_,i)=>({x:cs[i%3][0]+(r()-.5)*28,y:cs[i%3][1]+(r()-.5)*28}))},[])
  const init=k=>pts.slice(0,k).map(p=>({...p}))
  const[k,setK]=useState(3),[cen,setCen]=useState(()=>init(3)),[n,setN]=useState(0)
  const lab=pts.map(p=>cen.reduce((b,c,i)=>dist(p,c)<dist(p,cen[b])?i:b,0))
  const inertia=Math.round(pts.reduce((s,p,j)=>s+dist(p,cen[lab[j]])**2,0))
  const step=()=>{setCen(cen.map((c,i)=>{const m=pts.filter((_,j)=>lab[j]===i);return m.length?{x:m.reduce((s,p)=>s+p.x,0)/m.length,y:m.reduce((s,p)=>s+p.y,0)/m.length}:c}));setN(n+1)}
  const reset=kk=>{setK(kk);setCen(init(kk));setN(0)}
  return <div className="demo"><svg viewBox="0 0 100 100" className="plot" role="img" aria-label="Точки и центры кластеров">
    {pts.map((p,j)=><circle key={j} cx={p.x} cy={p.y} r="2" fill={C[lab[j]]}/>)}
    {cen.map((c,i)=><rect key={i} x={c.x-2.6} y={c.y-2.6} width="5.2" height="5.2" fill={C[i]} stroke="var(--ink)" strokeWidth=".7"/>)}</svg>
    <div className="ctl"><label>Число кластеров k: {k}<input type="range" min="2" max="5" value={k} onChange={e=>reset(+e.target.value)}/></label>
    <div className="row"><button className="btn" onClick={step}>Сделать шаг</button><button className="btn ghost" onClick={()=>reset(k)}>Сбросить</button></div>
    <p>Шагов: {n}. Инерция: {inertia}.</p>
    <p className="hint">Квадраты — центры кластеров. Каждый шаг относит точки к ближайшему центру и сдвигает центр в среднее своих точек. Когда инерция перестаёт падать, алгоритм сошёлся.</p></div></div>
}
