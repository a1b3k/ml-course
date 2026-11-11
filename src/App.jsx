import {useState,useMemo,useEffect} from 'react'
import {lectures} from './data'
import {Knn,Logit,KMeans} from './Demos'
import labHtml from './labs.json'
import lecHtml from './lectures.json'
import './styles.css'
const demos={knn:[Knn,'Подбор k в методе соседей'],logit:[Logit,'Порог и матрица ошибок'],kmeans:[KMeans,'Алгоритм k-средних по шагам']}

function Quiz({lec,onDone}){
  const qs=useMemo(()=>lec.quiz.map(q=>({q:q[0],a:q[1],o:[q[1],q[2],q[3]].sort(()=>Math.random()-.5),e:q[4]})),[lec])
  const[ans,setAns]=useState({})
  const n=Object.keys(ans).length,ok=qs.filter((x,j)=>ans[j]===x.a).length
  useEffect(()=>{if(n===qs.length)onDone(ok)},[n])
  return <section className="quiz" id="quiz"><h3>Проверьте себя</h3>
    {qs.map((x,j)=><div key={j} className="q"><p><b>{x.q}</b></p>
      {x.o.map(o=>{const done=ans[j]!==undefined,st=!done?'':o===x.a?'right':o===ans[j]?'wrong':''
        return <button key={o} className={'opt '+st} disabled={done} onClick={()=>setAns({...ans,[j]:o})}>{o}</button>})}
      {ans[j]!==undefined&&<p className="why"><b>{ans[j]===x.a?'Верно.':'Неверно.'}</b> {x.e}</p>}</div>)}
    {n===qs.length&&<p className="res">Результат: {ok} из {qs.length}.</p>}</section>
}

function LabView({id,done,onToggle}){
  return <div><div className="lab" dangerouslySetInnerHTML={{__html:labHtml[id]}}/>
    <button className={'btn'+(done?' ghost':'')} onClick={onToggle}>{done?'Лабораторная выполнена ✓ (снять отметку)':'Отметить лабораторную выполненной'}</button></div>
}

export default function App({onHome,toQuiz}){
  const[i,setI]=useState(()=>{const n=+location.hash.slice(1);return n>=1&&n<=lectures.length?n-1:0})
  const[score,setScore]=useState(()=>{try{return JSON.parse(localStorage.getItem('ml-score')||'{}')}catch{return{}}})
  const save=(id,s)=>setScore(o=>{const n={...o,[id]:Math.max(o[id]??0,s)};try{localStorage.setItem('ml-score',JSON.stringify(n))}catch{};return n})
  const[tab,setTab]=useState('lecture'),[labs,setLabs]=useState(()=>{try{return JSON.parse(localStorage.getItem('ml-lab')||'{}')}catch{return{}}})
  const toggleLab=id=>setLabs(o=>{const n={...o,[id]:!o[id]};try{localStorage.setItem('ml-lab',JSON.stringify(n))}catch{};return n})
  const go=n=>{setI(n);setTab('lecture');location.hash=n+1;window.scrollTo(0,0)}
  useEffect(()=>{if(toQuiz)setTimeout(()=>document.getElementById('quiz')?.scrollIntoView(),60)},[])
  const lec=lectures[i],D=lec.demo&&demos[lec.demo],done=Object.keys(score).length
  return <div className="app">
    <aside><button className="back" onClick={onHome}>← На главную</button><h1>Основы машинного обучения</h1>
      <div className="bar" aria-hidden="true"><i style={{width:done/lectures.length*100+'%'}}/></div>
      <p className="sm">Пройдено тестов: {done} из {lectures.length}<br/>Выполнено лабораторных: {Object.values(labs).filter(Boolean).length} из {lectures.length}</p>
      <nav>{lectures.map((l,j)=><button key={l.id} aria-current={j===i?'page':undefined} onClick={()=>go(j)}><span>{l.id}</span>{l.title}{score[l.id]!==undefined&&<b title="Тест пройден"> ✓</b>}</button>)}</nav></aside>
    <main><p className="sm">Лекция {lec.id} из {lectures.length}</p><h2>{lec.title}</h2>
      <div className="tabs" role="tablist">{[['lecture','Лекция и тест'],['lab','Практика']].map(([k,t])=><button key={k} role="tab" aria-selected={tab===k} onClick={()=>setTab(k)}>{t}{k==='lab'&&labs[lec.id]?' ✓':''}</button>)}</div>
      {tab==='lab'&&<LabView id={lec.id} done={!!labs[lec.id]} onToggle={()=>toggleLab(lec.id)}/>}
      {tab==='lecture'&&<div className="lab" dangerouslySetInnerHTML={{__html:lecHtml[lec.id]}}/>}
      {tab==='lecture'&&D&&<section><h3>Попробуйте сами: {D[1]}</h3>{(()=>{const Demo=D[0];return <Demo/>})()}</section>}
      {tab==='lecture'&&<Quiz key={lec.id} lec={lec} onDone={s=>save(lec.id,s)}/>}
      <div className="row pager"><button className="btn ghost" disabled={!i} onClick={()=>go(i-1)}>Предыдущая лекция</button>
        <button className="btn" disabled={i===lectures.length-1} onClick={()=>go(i+1)}>Следующая лекция</button></div></main></div>
}
