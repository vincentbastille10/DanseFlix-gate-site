
import { useState } from "react";
import Head from "next/head";

export default function Login() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const r = await fetch("/api/auth-email", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ email })
    });
    const j = await r.json();
    if (j.ok) {
      window.location.href = "/";
    } else {
      setErr("Adresse non autorisée.");
    }
  }

  return (
    <>
      <Head>
        <title>Accès DanseFlix</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>
      <div className="min-h-dvh grid place-items-center bg-[#0b0c1a] text-white">
        <form onSubmit={onSubmit} className="bg-[#111528] p-6 rounded-2xl max-w-[360px] w-[90%] shadow-[0_10px_30px_rgba(0,0,0,.4)]">
          <h1 className="m-0 mb-3 text-[22px] font-semibold">Accès DanseFlix</h1>
          <p className="m-0 mb-4 opacity-80 text-[14px]">Entrez l’email utilisé lors du paiement.</p>
          <input
            type="email"
            required
            value={email}
            onChange={e=>setEmail(e.target.value)}
            placeholder="prenom.nom@email.com"
            className="w-full px-3 py-2 rounded-xl border border-[#26304a] bg-[#0f1429] text-white mb-3"
          />
          {err ? <div className="text-[#ff8a8a] mb-3 text-[14px]">{err}</div> : null}
          <button type="submit" className="w-full px-3 py-2 rounded-xl bg-[#2563eb] text-white font-semibold">
            Valider
          </button>
        </form>
      </div>
    </>
  );
}
