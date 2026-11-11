import {useState} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App'
import Landing from './Landing'
function Root(){
  const[v,setV]=useState(()=>/^#\d+$/.test(location.hash)?'course':'home'),[q,setQ]=useState(false)
  const open=(n,quiz)=>{location.hash=n;setQ(!!quiz);setV('course');window.scrollTo(0,0)}
  const home=()=>{history.replaceState(null,'',location.pathname);setV('home');window.scrollTo(0,0)}
  return v==='home'?<Landing open={open}/>:<App onHome={home} toQuiz={q}/>
}
createRoot(document.getElementById('root')).render(<Root/>)
