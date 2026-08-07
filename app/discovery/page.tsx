'use client';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Info, Loader2, RotateCcw } from 'lucide-react';
import { departments, questions, type Department } from '@/lib/questions';

type FormState={businessName:string;contactName:string;email:string;department:Department|null;answers:Record<string,string>;approved:boolean};
type Analysis={summary:string;currentWorkflow:string[];problems:string[];recommendation:string;futureWorkflow:string[];included:string[];excluded:string[];assumptions:string[]};
const initial:FormState={businessName:'',contactName:'',email:'',department:null,answers:{},approved:false};

export default function Discovery(){
 const [step,setStep]=useState(0); const [form,setForm]=useState<FormState>(initial); const [analysis,setAnalysis]=useState<Analysis|null>(null); const [loading,setLoading]=useState(false); const [approving,setApproving]=useState(false); const [projectId,setProjectId]=useState<string|null>(null); const [error,setError]=useState('');
 useEffect(()=>{const saved=localStorage.getItem('aiautono-discovery-draft'); if(saved){try{setForm(JSON.parse(saved))}catch{}}},[]);
 useEffect(()=>{localStorage.setItem('aiautono-discovery-draft',JSON.stringify(form))},[form]);
 const qs=useMemo(()=>form.department?questions[form.department]:[],[form.department]);
 const canNext= step===0 ? !!(form.businessName.trim()&&form.contactName.trim()&&form.email.trim()) : step===1 ? !!form.department : step===2 ? qs.every(q=>(form.answers[q.id]||'').trim().length>1) : true;
 async function analyze(){
  setError('');
  if(!canNext){setError(`Please complete all ${qs.length} questions before generating the analysis.`);return;}
  setLoading(true);
  try{
   const r=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
   const data=await r.json();
   if(!r.ok) throw new Error(data.error||'Unable to generate analysis.');

   const save=await fetch('/api/projects',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,analysis:data})});
   const saved=await save.json();
   if(!save.ok) throw new Error(saved.error||'Analysis was generated, but the project could not be saved.');

   setAnalysis(data); setProjectId(saved.project.id); setStep(3);
  }catch(e){setError(e instanceof Error?e.message:'Unable to generate analysis.');}
  finally{setLoading(false)}
 }
 async function approve(){
  if(!projectId){setError('This discovery has not been saved yet. Please generate the analysis again.');return;}
  setError(''); setApproving(true);
  try{
   const r=await fetch(`/api/projects/${projectId}/approve`,{method:'POST'});
   const data=await r.json();
   if(!r.ok) throw new Error(data.error||'Unable to record approval.');
   setForm({...form,approved:true});
   localStorage.removeItem('aiautono-discovery-draft');
  }catch(e){setError(e instanceof Error?e.message:'Unable to record approval.');}
  finally{setApproving(false)}
 }
 function reset(){localStorage.removeItem('aiautono-discovery-draft');setForm(initial);setAnalysis(null);setProjectId(null);setError('');setStep(0)}
 return <main className="shell appShell"><header className="topbar"><div className="brand"><span className="brandMark">A</span><span>Discovery</span></div><button className="ghost" onClick={reset}><RotateCcw size={15}/> New</button></header>
 <div className="progress"><span style={{width:`${((step+1)/5)*100}%`}}/></div>
 <section className="panel">
  {step===0&&<><div className="eyebrow">STEP 1 OF 5</div><h2>Tell us about your business</h2><p className="muted">We’ll use this information to prepare the discovery report and project scope.</p><div className="formGrid">
   <label>Business name<input value={form.businessName} onChange={e=>setForm({...form,businessName:e.target.value})} placeholder="Your company name"/></label>
   <label>Your name<input value={form.contactName} onChange={e=>setForm({...form,contactName:e.target.value})} placeholder="Name of decision maker"/></label>
   <label className="wide">Email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="name@company.com"/></label>
  </div><p className="hint">Complete all three fields to continue.</p></>}
  {step===1&&<><div className="eyebrow">STEP 2 OF 5</div><h2>Choose one area to improve</h2><p className="muted">Focus on one department first. You can create another discovery later.</p><div className="deptGrid">{departments.map(d=><button key={d} onClick={()=>setForm({...form,department:d,answers:{}})} className={form.department===d?'dept active':'dept'}><span>{d}</span>{form.department===d&&<Check size={18}/>}</button>)}</div></>}
  {step===2&&<><div className="eyebrow">STEP 3 OF 5 · {form.department?.toUpperCase()}</div><h2>Show us how it works today</h2><p className="muted">No technical language needed. Answer as a business owner.</p><div className="questionList">{qs.map(q=><label key={q.id}><span className="qTitle">{q.label}<span className="tip" title={q.help}><Info size={15}/></span></span><small>{q.help}</small><textarea rows={3} value={form.answers[q.id]||''} onChange={e=>setForm({...form,answers:{...form.answers,[q.id]:e.target.value}})} placeholder={q.placeholder||'Type your answer here...'}/></label>)}</div>{error&&<div className="errorBox">{error}</div>}</>}
  {step===3&&analysis&&<><div className="eyebrow">STEP 4 OF 5</div><h2>Review our understanding</h2><p className="muted">This proposal is saved as project <strong>{projectId?.slice(0,8)}</strong>. Review it carefully before approval.</p><div className="report"><section><h3>Business summary</h3><p>{analysis.summary}</p></section><section><h3>Current workflow</h3><ol>{analysis.currentWorkflow.map(x=><li key={x}>{x}</li>)}</ol></section><section><h3>Problems found</h3><ul>{analysis.problems.map(x=><li key={x}>{x}</li>)}</ul></section><section><h3>Recommended automation</h3><p>{analysis.recommendation}</p></section><section><h3>Future workflow</h3><ol>{analysis.futureWorkflow.map(x=><li key={x}>{x}</li>)}</ol></section><div className="scopeCols"><section><h3>Included</h3><ul className="good">{analysis.included.map(x=><li key={x}>{x}</li>)}</ul></section><section><h3>Not included</h3><ul className="bad">{analysis.excluded.map(x=><li key={x}>{x}</li>)}</ul></section></div><section><h3>Assumptions</h3><ul>{analysis.assumptions.map(x=><li key={x}>{x}</li>)}</ul></section></div></>}
  {step===4&&analysis&&<><div className="eyebrow">STEP 5 OF 5</div><h2>Project scope confirmation</h2><div className="approvalBox"><p>I confirm that this discovery summary accurately represents the business process and expected automation scope. I understand that features not listed as included may require a separate change request or quotation.</p>{!form.approved&&<button className="primary" onClick={approve} disabled={approving}>{approving?<Loader2 className="spin" size={17}/>:<Check size={17}/>}Approve This Scope</button>}</div>{error&&<div className="errorBox">{error}</div>}{form.approved&&<div className="success"><Check size={24}/><div><strong>Approved and recorded</strong><p>The approval timestamp and project record are now saved for the AI AUTONO team.</p></div></div>}</>}
  <footer className="actions">{step>0&&!form.approved&&<button className="secondary" onClick={()=>{setError('');setStep(step-1)}}><ArrowLeft size={17}/> Back</button>}<div/>{step<2&&<button disabled={!canNext} className="primary" onClick={()=>setStep(step+1)}>Continue <ArrowRight size={17}/></button>}{step===2&&<button className="primary" onClick={analyze} disabled={loading}>{loading?<Loader2 className="spin" size={17}/>:null}Generate Analysis <ArrowRight size={17}/></button>}{step===3&&<button className="primary" onClick={()=>setStep(4)}>Continue to Approval <ArrowRight size={17}/></button>}</footer>
 </section></main>
}
