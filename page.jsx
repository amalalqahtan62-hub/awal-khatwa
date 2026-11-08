'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/client';
import '../admin.css';

function Login() {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const next = useSearchParams().get('next') || '/admin';
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr('');
    const r = await api('/api/admin/login', { password: pw });
    setBusy(false);
    if (r.ok) router.replace(next.startsWith('/') ? next : '/admin');
    else setErr('كلمة المرور غير صحيحة.');
  };
  return (
    <div className="a-login">
      <form onSubmit={submit} className="a-card" style={{ width: 380, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="a-k">لوحة المدربة</div>
        <h1 style={{ fontSize: 26 }}>أول خطوة في عالم التصميم</h1>
        <input className="a-in" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="كلمة المرور" autoFocus />
        {err && <div style={{ color: '#c0264b' }}>{err}</div>}
        <button className="a-btn big" disabled={busy}>{busy ? '…' : 'دخول'}</button>
      </form>
    </div>
  );
}

export default function Page() {
  return <Suspense><Login /></Suspense>;
}
