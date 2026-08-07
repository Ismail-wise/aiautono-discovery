'use client';
import Link from 'next/link';
import { ClipboardList, Clock3, CheckCircle2, ArrowUpRight } from 'lucide-react';

export default function Admin(){
  return <main className="shell admin">
    <nav className="nav"><div className="brand"><span className="brandMark">A</span><span>AI AUTONO · Admin</span></div><Link className="ghost" href="/">Home</Link></nav>
    <section className="adminHead"><div><div className="eyebrow">DISCOVERY DASHBOARD</div><h1>Client discoveries</h1><p className="muted">Database storage is the next production step. Submitted discoveries will appear here once connected.</p></div><Link href="/discovery" className="primary">New Discovery <ArrowUpRight size={17}/></Link></section>
    <div className="stats"><article><ClipboardList/><div><strong>0</strong><span>Total discoveries</span></div></article><article><Clock3/><div><strong>0</strong><span>Awaiting approval</span></div></article><article><CheckCircle2/><div><strong>0</strong><span>Approved</span></div></article></div>
    <section className="empty"><ClipboardList size={30}/><h3>No submitted discoveries yet</h3><p>Once database storage is connected, submitted customer discoveries will appear here.</p></section>
  </main>
}
