import Link from 'next/link';
import { ArrowRight, CheckCircle2, FileCheck2, Sparkles, Workflow } from 'lucide-react';

export default function Home(){
  return <main className="shell landing">
    <nav className="nav"><div className="brand"><span className="brandMark">A</span><span>AI AUTONO</span></div><Link href="/admin" className="ghost">Admin</Link></nav>
    <section className="hero">
      <div className="eyebrow">AI AUTONO DISCOVERY</div>
      <h1>Make the system clear <span>before</span> development starts.</h1>
      <p>Turn a business owner’s real workflow into a clear automation plan, scope, and approval record.</p>
      <div className="heroActions"><Link className="primary" href="/discovery">Start Discovery <ArrowRight size={18}/></Link><a className="secondary" href="#how">How it works</a></div>
      <div className="trust"><CheckCircle2 size={17}/> Built for non-technical SME business owners</div>
    </section>
    <section id="how" className="cards">
      <article><Workflow/><h3>1. Understand</h3><p>Choose one business area and describe the current process in plain language.</p></article>
      <article><Sparkles/><h3>2. Analyze</h3><p>Generate a structured view of problems, opportunities, and the proposed future workflow.</p></article>
      <article><FileCheck2/><h3>3. Approve</h3><p>Customer reviews included and excluded scope before the development team starts.</p></article>
    </section>
  </main>
}
