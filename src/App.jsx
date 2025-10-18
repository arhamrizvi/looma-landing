import React, { useState } from "react";

const API = (import.meta.env.VITE_API_URL || "").replace(/\/$/,"");
const STREAMLIT = import.meta.env.VITE_STREAMLIT_URL || "";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!API || !STREAMLIT) {
      setErr("Missing env config. Set VITE_API_URL and VITE_STREAMLIT_URL.");
      return;
    }
    if (!email || password.length < 8) {
      setErr("Enter a valid email and 8+ character password.");
      return;
    }
    try {
      setBusy(true);
      const r = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const text = await r.text();
      let j;
      try { j = JSON.parse(text); } catch { throw new Error(`Unexpected response: ${text.slice(0,200)}`); }
      if (!r.ok) throw new Error(j.detail || `Login failed (${r.status})`);
      const token = j?.access_token;
      if (!token) throw new Error("No token returned.");
      const url = `${STREAMLIT}${STREAMLIT.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}`;
      window.location.href = url;
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:"24px"}}>
      <div style={{maxWidth:640,width:"100%",background:"#111827",borderRadius:16,padding:"28px",boxShadow:"0 10px 30px rgba(0,0,0,.35)"}}>
        <header style={{marginBottom:16}}>
          <h1 style={{margin:0,fontSize:28,color:"#fff"}}>Looma</h1>
          <p style={{margin:"6px 0 0",color:"#9ca3af"}}>Sign in to open your dashboard</p>
        </header>
        <form onSubmit={onSubmit} style={{display:"grid",gap:12}}>
          <label style={{display:"grid",gap:6,color:"#e5e7eb"}}>
            Email
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="you@example.com" required style={inputStyle}/>
          </label>
          <label style={{display:"grid",gap:6,color:"#e5e7eb"}}>
            Password
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="••••••••" required minLength={8} style={inputStyle}/>
          </label>
          <button disabled={busy} type="submit" style={btnStyle}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
          {err && <div style={errStyle}>{err}</div>}
          <small style={{color:"#9ca3af"}}>By continuing you agree to our terms.</small>
        </form>
      </div>
    </div>
  );
}

const inputStyle = { width:"100%", padding:"12px 14px", borderRadius:10, border:"1px solid #374151", background:"#0b1220", color:"#e5e7eb", outline:"none" };
const btnStyle = { padding:"12px 14px", borderRadius:10, border:"1px solid #2563eb", background:"#2563eb", color:"#fff", fontWeight:600, cursor:"pointer" };
const errStyle = { marginTop:8, padding:"10px 12px", borderRadius:10, background:"#3f1d1d", color:"#fca5a5", border:"1px solid #7f1d1d" };
