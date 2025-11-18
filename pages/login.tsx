import Head from "next/head";
import Script from "next/script";
import { FormEvent, useEffect, useState } from "react";

export default function DanseFlixLogin() {
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  // Déjà validé sur ce navigateur ? -> redirige vers /
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ok = window.localStorage.getItem("danseflix_access_ok");
    if (ok === "1") {
      setUnlocked(true);
      window.location.href = "/";
    }
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const clean = email.trim().toLowerCase();
    if (!clean) {
      setError("Merci de saisir l’email utilisé lors de l’achat.");
      return;
    }

    setChecking(true);
    try {
      const res = await fetch("/api/auth-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clean }),
      });

      if (!res.ok) {
        throw new Error("Bad status");
      }

      const data = await res.json();
      if (!data || !data.ok) {
        setError(
          "Cette adresse n’est pas reconnue. Vérifiez l’email utilisé lors du paiement ou contactez l’école."
        );
        return;
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem("danseflix_access_ok", "1");
        window.localStorage.setItem("danseflix_email", clean);
      }
      setUnlocked(true);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setError(
        "Erreur lors de la vérification. Réessayez dans un instant ou contactez l’organisateur."
      );
    } finally {
      setChecking(false);
    }
  }

  return (
    <>
      <Head>
        <title>DanseFlix — Accès privé</title>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
        />
        <meta charSet="utf-8" />
      </Head>

      <main className="danseflix-body">
        <div className="df-backdrop">
          <div className="df-overlay-gradient" />

          {/* Contenu flouté derrière (juste un fake background ici) */}
          <div className="wrap">
            <header className="df-header">
              <div className="df-logo-main">DANSEFLIX</div>
              <div className="df-subtitle">
                la plateforme de l&apos;école de danse Delphine Letort
              </div>
              <div className="df-subsubtitle">
                Spectacle enregistré à la Salle des Concerts du Mans — juin 2025
              </div>
            </header>
          </div>

          {/* Overlay login bleu */}
          {!unlocked && (
            <div className="df-login-overlay">
              <div className="df-login-card">
                <h2>Accès privé DanseFlix</h2>
                <p>
                  Pour accéder aux vidéos, merci d&apos;entrer{" "}
                  <strong>l’email utilisé lors de l’achat</strong>.
                </p>
                <form onSubmit={handleSubmit} className="df-login-form">
                  <label htmlFor="email">Email utilisé lors du paiement</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="prenom.nom@email.com"
                  />
                  {error && <div className="df-error">{error}</div>}
                  <button type="submit" disabled={checking}>
                    {checking ? "Vérification en cours…" : "Accéder aux vidéos"}
                  </button>
                </form>
                <p className="df-login-help">
                  Problème d&apos;accès ? Contactez l&apos;école ou l&apos;organisateur
                  en indiquant votre email.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Styles globaux du portail */}
        <style jsx global>{`
          :root {
            --bg: #050614;
            --pink: #ff6fb3;
            --violet: #a78bfa;
            --cyan: #00d1ff;
          }
          * {
            box-sizing: border-box;
          }
          html,
          body {
            height: 100%;
          }
          body {
            margin: 0;
            font-family: Inter, system-ui, sans-serif;
            color: #fff;
            background: var(--bg);
          }
          .danseflix-body {
            min-height: 100vh;
          }
          .df-backdrop {
            position: relative;
            min-height: 100vh;
            padding: 28px;
            display: flex;
            justify-content: center;
            align-items: center;
            background:
              radial-gradient(
                  1200px 800px at 8% 10%,
                  rgba(255, 111, 179, 0.18),
                  transparent 50%
                ),
              radial-gradient(
                  1100px 700px at 92% 20%,
                  rgba(167, 139, 250, 0.16),
                  transparent 55%
                ),
              radial-gradient(
                  1000px 700px at 50% 95%,
                  rgba(0, 209, 255, 0.12),
                  transparent 60%
                ),
              url("/belle-poster.jpg") center/cover no-repeat fixed;
          }
          .df-overlay-gradient {
            position: absolute;
            inset: 0;
            background: radial-gradient(
                1200px 800px at 0 0,
                rgba(15, 23, 42, 0.92),
                transparent 65%
              ),
              linear-gradient(
                180deg,
                rgba(15, 23, 42, 0.96),
                rgba(15, 23, 42, 0.96)
              );
            backdrop-filter: blur(6px);
          }
          .wrap {
            position: absolute;
            top: 40px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1;
            max-width: 1200px;
            width: 100%;
            padding: 0 20px;
          }
          .df-header {
            text-align: left;
          }
          .df-logo-main {
            margin: 0 0 4px;
            font-size: clamp(42px, 8vw, 96px);
            letter-spacing: 0.18em;
            text-transform: uppercase;
            font-weight: 900;
            color: #ffffff;
            text-shadow: 0 18px 50px rgba(0, 0, 0, 0.9);
          }
          .df-subtitle {
            font-size: clamp(16px, 2.3vw, 22px);
            font-weight: 600;
            color: rgba(241, 245, 249, 0.96);
          }
          .df-subsubtitle {
            margin-top: 4px;
            font-size: 14px;
            opacity: 0.9;
            color: rgba(209, 213, 219, 0.96);
          }

          .df-login-overlay {
            position: relative;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            pointer-events: auto;
          }
          .df-login-card {
            width: 100%;
            max-width: 480px;
            background: radial-gradient(
                900px 700px at 0% 0%,
                rgba(59, 130, 246, 0.7),
                transparent 65%
              ),
              radial-gradient(
                900px 700px at 100% 0%,
                rgba(236, 72, 153, 0.6),
                transparent 65%
              ),
              #020617;
            border-radius: 26px;
            padding: 26px 24px 22px;
            border: 1px solid rgba(191, 219, 254, 0.9);
            box-shadow: 0 30px 80px rgba(15, 23, 42, 0.95);
            color: #e5f2ff;
          }
          .df-login-card h2 {
            margin: 0 0 8px;
            font-size: 22px;
            font-weight: 900;
          }
          .df-login-card p {
            margin: 0 0 12px;
            font-size: 14px;
            line-height: 1.5;
          }
          .df-login-form {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 4px;
          }
          .df-login-form label {
            font-size: 13px;
            opacity: 0.9;
          }
          .df-login-form input {
            padding: 11px 13px;
            border-radius: 12px;
            border: 1px solid rgba(191, 219, 254, 0.9);
            background: rgba(15, 23, 42, 0.96);
            color: #e5f2ff;
            font-size: 14px;
            outline: none;
          }
          .df-login-form input:focus {
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.9);
          }
          .df-login-form button {
            margin-top: 4px;
            padding: 12px 16px;
            border-radius: 999px;
            border: none;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            color: #0b1020;
            background: linear-gradient(
              135deg,
              #38bdf8,
              #4f46e5,
              #ec4899
            );
            box-shadow: 0 18px 55px rgba(15, 23, 42, 0.95);
          }
          .df-login-form button:disabled {
            opacity: 0.8;
            cursor: progress;
          }
          .df-error {
            font-size: 12px;
            color: #fecaca;
            background: rgba(127, 29, 29, 0.3);
            border: 1px solid rgba(254, 202, 202, 0.8);
            border-radius: 8px;
            padding: 8px 9px;
          }
          .df-login-help {
            margin-top: 8px;
            font-size: 12px;
            opacity: 0.9;
          }

          @media (max-width: 768px) {
            .df-backdrop {
              padding: 18px;
            }
            .df-login-card {
              padding: 22px 18px 18px;
            }
            .wrap {
              top: 20px;
            }
          }
        `}</style>
      </main>

      {/* Script YouTube API présent ici aussi pour que /login la précharge */}
      <Script src="https://www.youtube.com/iframe_api" strategy="afterInteractive" />
    </>
  );
}
