import {useEffect,useRef} from 'react'
import {BRAND,LOGO,PHOTOS} from './config'
import {lectures} from './data'
import './landing.css'

const rnd=s=>()=>(s=(s*16807)%2147483647)/2147483647
const fmt=n=>n.toLocaleString('en-US')
const PAL=['#FF4A12','#FF5A1F','#FF6B2C','#FF8A3D','#FFB06A','#FFD9B5','#FFF3E6']
const H=(a,b,c)=>{let h=(a*374761393+b*668265263+c*2147483647)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296}
const MENU=['Лекции','Тесты','Демо']
const CARDS=[
{id:'home',t:'t1',cur:'Лекции',kick:'КГТУ им. И. Раззакова',title:'Основы машинного обучения',st:[['10','лекций'],['3','демо']],art:'dots',o:70411,d:6140,url:'ml-course/start',code:'# lecture_1.py\nX, y = load_dataset()\nX_train, X_test, y_train, y_test = split(X, y)\nmodel.fit(X_train, y_train)\nprint(model.score(X_test, y_test))'},
{id:'data',t:'t2 dk',cur:'Лекции',kick:'Лекция 2',title:'Предобработка данных: пропуски, масштаб, кодирование',st:[['NaN','→ медиана'],['0–1','нормализация']],art:'dots',o:41208,d:4960,url:'ml-course/lecture-2',code:'# lecture_2.py\ndf = df.fillna(df.median())\nX = scaler.fit_transform(X)\nX = one_hot(df["city"])\nassert not df.isna().any()'},
{id:'line',t:'t3',cur:'Лекции',kick:'Лекция 4',title:'Линейная регрессия: прямая, которая лучше всего описывает данные',st:[['MSE','функция потерь']],art:'line',o:98432,d:6300,url:'ml-course/lecture-4',code:'# lecture_4.py\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\ny_pred = model.predict(X_test)\nmse = mean_squared_error(y_test, y_pred)'},
{id:'tree',t:'t4',cur:'Тесты',kick:'Лекция 7',title:'Дерево решений задаёт данным вопросы и делит их на группы',st:[['0','энтропия в листе']],art:'tree',o:55870,d:8215,url:'ml-course/lecture-7',code:'# lecture_7.py\ntree = DecisionTree(max_depth=4)\ntree.fit(X_train, y_train)\nprint(export_rules(tree))\n# if age > 30 and income > 50: class 1'},
{id:'forest',t:'t5',cur:'Тесты',kick:'Лекции 8 и 9',title:'Лес и бустинг: много слабых моделей вместо одной',st:[['100+','деревьев']],art:'tree',o:63904,d:5512,url:'ml-course/lecture-8',code:'# lecture_8_9.py\nforest = RandomForest(n_estimators=100)\nboost = XGBoost(learning_rate=0.1)\nforest.fit(X_train, y_train)\nboost.fit(X_train, y_train, early_stop=True)'},
{id:'clusters',t:'t6 dk',cur:'Демо',kick:'Лекция 10',title:'Кластеризация: группы без меток',st:[['k = 3','кластера']],art:'blobs',o:47316,d:7602,url:'ml-course/lecture-10',code:'# lecture_10.py\nkm = KMeans(n_clusters=3)\nlabels = km.fit_predict(X)\nprint(km.inertia_)\nprint(silhouette_score(X, labels))'}]
const SECTORS=[['Промышленность','Прогноз отказов оборудования, контроль качества продукции, оптимизация процессов.'],['Медицина','Анализ снимков, прогноз заболеваний, подбор лечения.'],['Финансы','Оценка кредитоспособности, поиск мошеннических операций.'],['Транспорт и логистика','Оптимизация маршрутов, прогноз спроса, управление запасами.'],['Интернет и IT','Распознавание речи и лиц, рекомендации, фильтрация спама.'],['Маркетинг','Сегментация аудитории, прогноз оттока клиентов, персонализация.']]

function Art({k}){
  const r=rnd(k.length*7+3),P=Array.from({length:26},()=>[8+r()*84,8+r()*84])
  return <svg className="k-art" viewBox="0 0 100 100" aria-hidden="true">
    {k==='dots'&&P.map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="2.4" fill="currentColor" opacity=".7"/>)}
    {k==='line'&&<g>{P.map((p,i)=><circle key={i} cx={p[0]} cy={92-p[0]*.8+(p[1]-50)*.3} r="2.4" fill="currentColor" opacity=".75"/>)}<line x1="6" y1="88" x2="94" y2="18" stroke="#FF5A1F" strokeWidth="2.4" strokeLinecap="round"/></g>}
    {k==='tree'&&<g stroke="currentColor" strokeWidth="1.6" fill="none" opacity=".85"><path d="M50 12L25 42M50 12L75 42M25 42L12 78M25 42L38 78M75 42L62 78M75 42L88 78"/>{[[50,12],[25,42],[75,42],[12,78],[38,78],[62,78],[88,78]].map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="5" fill="#FF5A1F" stroke="none"/>)}</g>}
    {k==='blobs'&&[[26,28,'#FF5A1F'],[72,34,'#2447A8'],[48,76,'#1F7A55']].map((c,j)=>P.slice(j*8,j*8+8).map((p,i)=><circle key={j+'-'+i} cx={c[0]+(p[0]-50)*.34} cy={c[1]+(p[1]-50)*.34} r="2.6" fill={c[2]}/>))}
  </svg>}

const Mark=()=><span className="k-mark">{LOGO?<img src={LOGO} alt=""/>:'КГ'}</span>

export default function Landing({open}){
  const st=useRef(),cv=useRef(),num=useRef(),pct=useRef()
  useEffect(()=>{
    const root=st.current,belt=root.querySelector('.belt'),ctx=cv.current.getContext('2d')
    const cards=[...root.querySelectorAll('.card')],codes=[...root.querySelectorAll('.code')],N=cards.length
    const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches
    let cw,ch,gap,W,Lx,bh,dpr,off=0,vel=0,hover=0,over=false,drag=false,lx=0,lt=0,dv=0,last=performance.now(),raf,shown=0,cur=-1,first=true
    const sparks=[]
    const measure=()=>{W=root.clientWidth;Lx=W/2;cw=cards[0].getBoundingClientRect().width;ch=cards[0].getBoundingClientRect().height
      gap=W*(matchMedia('(max-width:767px)').matches?.07:.0475);bh=belt.clientHeight;dpr=Math.min(2,devicePixelRatio||1)
      cv.current.width=W*dpr;cv.current.height=bh*dpr;if(first){off=Lx-.62*cw;first=false}}
    measure()
    const dissolve=(i,x,cut,t)=>{
      const R=.3*cw,g0=Math.floor(cut/3),g1=Math.min(Math.floor(cw/3),Math.ceil((cut+R)/3)),rows=Math.ceil(ch/3),hw=Math.min(150,x+cw-Lx),tw=reduce?0:Math.floor(t*9)
      if(hw>0){const g=ctx.createLinearGradient(Lx,0,Lx+150,0);g.addColorStop(0,'rgba(255,96,40,.42)');g.addColorStop(1,'rgba(255,96,40,0)');ctx.fillStyle=g;ctx.fillRect(Lx,70,hw,ch)}
      for(let gx=g0;gx<g1;gx++){const d=gx*3-cut,p=Math.pow(1-d/R,1.7);if(p<=0)continue
        for(let row=-5;row<rows+5;row++){const ins=row>=0&&row<rows
          const pr=ins?p*.92:p*.16*(1-(row<0?-row:row-rows+1)/6)
          if(H(gx,row,i)>=pr)continue
          if(!reduce&&H(gx,row,tw+97)<.22)continue
          const h2=H(row,gx,i+31),s=1.1+h2*1.7,jx=reduce?0:(H(gx,row,5)-.5)*1.6,jy=reduce?0:(H(row,gx,9)-.5)*1.6
          ctx.fillStyle=d<10?PAL[4+Math.floor(h2*3)]:PAL[Math.floor(h2*h2*7)]
          ctx.fillRect(x+gx*3+jx,70+row*3+jy,s,s)}}}
    const frame=now=>{
      const dt=Math.min(.05,(now-last)/1000);last=now;const t=now/1000
      hover+=((over?1:0)-hover)*Math.min(1,4*dt)
      if(!drag){const tg=(reduce?0:-.075*W)*(1-.65*hover);vel+=(tg-vel)*(1-Math.exp(-2.2*dt));off+=vel*dt}
      const span=cw+gap,period=span*N
      ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,bh)
      let cross=-1,prog=0
      cards.forEach((el,i)=>{
        const x=(((off+i*span+span)%period)+period)%period-span,cut=Math.max(0,Math.min(cw,Lx-x)),tr=`translate3d(${x}px,0,0)`,c=codes[i]
        el.style.transform=tr;c.style.transform=tr
        if(cut>0){el.style.clipPath=`inset(0 0 0 ${cut}px round 0 1.6vw 1.6vw 0)`;el.style.webkitMaskImage=el.style.maskImage=`linear-gradient(90deg,transparent ${cut}px,#000 ${cut+26}px)`;c.style.visibility='visible';c.style.clipPath=`inset(0 ${cw-cut}px 0 0)`}
        else{el.style.clipPath='';el.style.webkitMaskImage=el.style.maskImage='';c.style.visibility='hidden'}
        if(cut>0&&cut<cw){cross=i;prog=cut/cw}
        if(cut>0&&x+cw>Lx)dissolve(i,x,cut,t)})
      if(!reduce&&cross>=0)for(let k=0;k<3;k++)if(Math.random()<.7)sparks.push({x:Lx+Math.random()*30,y:60+Math.random()*(ch+20),vx:-30+Math.random()*70+.6*vel,vy:(Math.random()-.5)*50,s:.8+Math.random()*1.8,c:PAL[Math.floor(Math.random()*7)],l:.3+Math.random()*.8})
      for(let k=sparks.length-1;k>=0;k--){const s=sparks[k];s.l-=dt;if(s.l<=0){sparks.splice(k,1);continue}s.x+=s.vx*dt;s.y+=s.vy*dt;ctx.globalAlpha=Math.min(1,s.l*2.2);ctx.fillStyle=s.c;ctx.fillRect(s.x,s.y,s.s,s.s)}
      ctx.globalAlpha=1
      if(cross>=0){const c=CARDS[cross],tg=Math.round((c.o-c.d)*prog)
        if(cross!==cur){cur=cross;shown=tg;pct.current.textContent=Math.round((c.o-c.d)/c.o*100)+'% меньше'}else shown+=(tg-shown)*Math.min(1,dt*14)}
      num.current.textContent='−'+fmt(Math.round(shown))
      raf=requestAnimationFrame(frame)}
    raf=requestAnimationFrame(frame)
    const dn=e=>{drag=true;belt.classList.add('drag');belt.setPointerCapture(e.pointerId);lx=e.clientX;lt=e.timeStamp;dv=0}
    const mv=e=>{if(!drag)return;const dx=e.clientX-lx;off+=dx;dv=dx/Math.max(8,e.timeStamp-lt)*1000*.8+dv*.2;lx=e.clientX;lt=e.timeStamp}
    const up=()=>{if(!drag)return;drag=false;belt.classList.remove('drag');vel=dv}
    const wh=e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY))vel+=-e.deltaX*6}
    const en=()=>{over=true},lv=()=>{over=false}
    belt.addEventListener('pointerdown',dn);belt.addEventListener('pointermove',mv);belt.addEventListener('pointerup',up);belt.addEventListener('pointercancel',up)
    belt.addEventListener('wheel',wh,{passive:true});belt.addEventListener('pointerenter',en);belt.addEventListener('pointerleave',lv);addEventListener('resize',measure)
    return()=>{cancelAnimationFrame(raf);removeEventListener('resize',measure);belt.removeEventListener('pointerdown',dn);belt.removeEventListener('pointermove',mv);belt.removeEventListener('pointerup',up);belt.removeEventListener('pointercancel',up);belt.removeEventListener('wheel',wh);belt.removeEventListener('pointerenter',en);belt.removeEventListener('pointerleave',lv)}
  },[])
  const go=id=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'})
  return <div className="land">
    <div className="stage" ref={st}>
      <header className="top"><div className="brand"><span className="b-mark">{LOGO?<img src={LOGO} alt=""/>:'КГ'}</span><span>{BRAND.name}</span></div>
        <div className="links"><button className="lk" onClick={()=>go('program')}>Лекции</button><button className="lk" onClick={()=>go('why')}>Зачем это нужно</button><button className="lk" onClick={()=>open(1,true)}>Пройти тест</button></div>
        <button className="pill hot small" onClick={()=>open(1)}>Начать курс</button></header>
      <div className="hero"><div><div className="eyebrow">{BRAND.name}, {BRAND.city}</div><h1 className="hl">Учим людей.<br/><i>Обучаем машины.</i></h1></div>
        <div><p className="lead">Интерактивный курс «Основы машинного обучения»: от подготовки данных до кластеризации. Читайте лекции, запускайте демонстрации и проверяйте себя тестами.</p>
          <button className="pill hot" onClick={()=>go('why')}>Узнать больше</button></div></div>
      <div className="belt" role="img" aria-label="Страницы курса превращаются в программный код">
        <div className="codes">{CARDS.map(c=><div className="code" key={c.id}><pre>{c.code}</pre><pre className="m">{`# сжато: ${fmt(c.d)} токенов\n# исходно: ${fmt(c.o)} токенов\n# ${c.url}`}</pre></div>)}</div>
        <div className="cards">{CARDS.map(c=><div className={'card '+c.t} key={c.id}>
          <div className="k-bg" style={PHOTOS[c.id]?{backgroundImage:`linear-gradient(rgba(10,15,30,.35),rgba(10,15,30,.6)),url(${PHOTOS[c.id]})`}:undefined}/>
          <div className="k-nav"><div className="k-logo"><Mark/>КГТУ</div><div className="k-menu">{MENU.map(m=><span key={m} className={m===c.cur?'cur':''}>{m}</span>)}</div></div>
          <div className="k-kick">{c.kick}</div><div className="k-title">{c.title}</div>
          <div className="k-stats">{c.st.map(([a,b])=><div key={a}><b>{a}</b><span>{b}</span></div>)}</div><Art k={c.art}/></div>)}</div>
        <canvas className="fx" ref={cv}/></div>
      <div className="scan" aria-hidden="true"><b/><i/></div>
      <div className="badge" aria-hidden="true"><span>Экономия токенов</span><div className="pill-c"><em ref={num}>−0</em><u ref={pct}>0% меньше</u></div></div>
    </div>
    <div className="sec" id="why"><h2>Зачем нужно машинное обучение</h2>
      <p className="lede">Модель находит закономерности в данных и принимает решения там, где правила невозможно прописать вручную. Поэтому эти навыки нужны специалистам самых разных отраслей.</p>
      <div className="grid">{SECTORS.map(([a,b])=><div className="tile" key={a}><b>{a}</b><span>{b}</span></div>)}</div></div>
    <div className="sec alt" id="program"><h2>Программа курса</h2>
      <div className="prog">{lectures.map(l=><button key={l.id} className="row-l" onClick={()=>open(l.id)}><span>{l.id}</span>{l.title}</button>)}</div>
      <div className="cta-row"><button className="pill hot" onClick={()=>open(1)}>Начать с лекции 1</button><button className="pill" onClick={()=>open(1,true)}>Сразу пройти тест</button></div></div>
    <footer className="foot">{BRAND.full}, {BRAND.city}</footer>
  </div>}
