import Head from "next/head";
import { FormEvent, useEffect, useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  // Déjà validé sur ce navigateur ?
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ok = window.localStorage.getItem("danseflix_access_ok");
    if (ok === "1") setUnlocked(true);
  }, []);

  // Blocage du clic droit (pour éviter le menu contextuel sur la vidéo)
  useEffect(() => {
    const blockCtx = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", blockCtx);
    return () => {
      document.removeEventListener("contextmenu", blockCtx);
    };
  }, []);

  // Vérification de l’email dans /public/allowlist.json
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
      const res = await fetch("/allowlist.json", { cache: "no-store" });
      if (!res.ok) throw new Error("allowlist introuvable");

      const data = await res.json();
      let list: string[] = [];

      if (Array.isArray(data)) {
        list = data;
      } else if (Array.isArray((data as any).emails)) {
        list = (data as any).emails;
      }

      const found = list.some(
        (entry) => String(entry).trim().toLowerCase() === clean
      );

      if (!found) {
        setError(
          "Cette adresse n’est pas reconnue. Vérifiez l’email utilisé lors du paiement ou contactez l’école."
        );
      } else {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("danseflix_access_ok", "1");
          window.localStorage.setItem("danseflix_email", clean);
        }
        setUnlocked(true);
      }
    } catch (err) {
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
        <title>DanseFlix — La Belle au Bois Dormant</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="Portail privé DanseFlix — captation HD/4K de La Belle au Bois Dormant."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="danseflix-body">
        <div className="df-backdrop">
          <div className="df-overlay-gradient" />

          <div className="wrap">
            {/* HEADER */}
            <header className="df-header">
              <div className="df-logo-wrapper">
                <img
                  src="/danseflix.png"
                  alt="DanseFlix - La chaîne vidéo du centre de danse Delphine Letort"
                  className="df-logo-main"
                />
              </div>
              <div className="df-subtitle">
                la plateforme de l&apos;école de danse Delphine Letort
              </div>
              <div className="df-subsubtitle">
                spectacle enregistré à la salle des concerts du Mans – Juin 2025
              </div>
            </header>

            {/* CONTENU (flouté tant que pas débloqué) */}
            <div
              className={
                unlocked
                  ? "df-content df-content-on"
                  : "df-content df-content-blur"
              }
            >
              <section className="df-intro">
                <p>
                  Accès réservé aux familles et élèves. Vous retrouvez ici la
                  captation de <strong>La Belle au Bois Dormant</strong> pour
                  les représentations du samedi et du dimanche.
                </p>
              </section>

              {/* SAMEDI */}
              <section className="df-video-block">
                <h2>Samedi — La Belle au bois dormant</h2>
                <div className="player">
                  <div className="yt-top-mask" />
                  <iframe
                    src="https://www.youtube-nocookie.com/embed/0euoXutCxYM?rel=0&modestbranding=1&showinfo=0&disablekb=1&iv_load_policy=3&vq=highres"
                    title="DanseFlix Samedi"
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </section>

              {/* DIMANCHE */}
              <section className="df-video-block">
                <h2>Dimanche — La Belle au bois dormant</h2>
                <div className="player">
                  <div className="yt-top-mask" />
                  <iframe
                    src="https://www.youtube-nocookie.com/embed/Ky6x74z20N8?rel=0&modestbranding=1&showinfo=0&disablekb=1&iv_load_policy=3&vq=highres"
                    title="DanseFlix Dimanche"
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </section>

              <p className="df-note-footer">
                Merci de ne pas partager ce lien publiquement. Cette page est
                réservée aux familles et danseurs ayant acquis la captation.
              </p>
            </div>
          </div>

          {/* OVERLAY LOGIN */}
          {!unlocked && (
            <div className="df-login-overlay">
              <div className="df-login-card">
                <h2>Accès privé DanseFlix</h2>
                <p>
                  Pour accéder aux vidéos, merci d&apos;entrer{" "}
                  <strong>l&apos;email utilisé lors de l&apos;achat</strong>.
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
                  Problème d&apos;accès ? Contactez l&apos;école ou
                  l&apos;organisateur en indiquant votre email.
                </p>

                {/* 💳 BOUTON STRIPE D’ACHAT */}
                <div
                  style={{
                    marginTop: 18,
                    paddingTop: 12,
                    borderTop: "1px solid rgba(191,219,254,0.35)",
                  }}
                >
                  <p
                    style={{
                      fontSize: 12,
                      margin: "0 0 8px",
                      opacity: 0.9,
                    }}
                  >
                    Vous n&apos;avez pas encore acheté l&apos;accès à la
                    plateforme ?
                  </p>
                  <a
                    href="https://buy.stripe.com/aFabITgIOg31euTe1w3ks01"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-block",
                      width: "100%",
                      textAlign: "center",
                      padding: "9px 14px",
                      borderRadius: 999,
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: 14,
                      background:
                        "linear-gradient(135deg,#22c55e,#16a34a,#15803d)",
                      color: "#0b1020",
                      boxShadow: "0 14px 40px rgba(15,23,42,0.85)",
                    }}
                  >
                    Achetez un accès à la plateforme
                  </a>
                  <p
                    style={{
                      fontSize: 11,
                      marginTop: 6,
                      opacity: 0.8,
                    }}
                  >
                    Après le paiement, votre email sera pris en compte pour
                    l&apos;accès aux vidéos.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* STYLES */}
        <style jsx global>{`
          :root {
            --bg: #050518;
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
            background:
              radial-gradient(
                  1200px 800px at 8% 10%,
                  rgba(255, 111, 179, 0.22),
                  transparent 55%
                ),
              radial-gradient(
                  1100px 700px at 92% 20%,
                  rgba(167, 139, 250, 0.18),
                  transparent 60%
                ),
              radial-gradient(
                  1000px 700px at 50% 95%,
                  rgba(0, 209, 255, 0.18),
                  transparent 65%
                ),
              url("/belle-poster.jpg") center/cover no-repeat;
          }

          .df-overlay-gradient {
            position: absolute;
            inset: 0;
            background: linear-gradient(
              180deg,
              rgba(5, 5, 20, 0.9),
              rgba(5, 5, 20, 0.98)
            );
            pointer-events: none;
          }

          .wrap {
            position: relative;
            z-index: 1;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
          }

          .df-header {
            margin-bottom: 24px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .df-logo-wrapper {
            width: 100%;
          }

          .df-logo-main {
            display: block;
            width: 100%;
            height: auto;
            border-radius: 12px;
            box-shadow: 0 18px 50px rgba(0, 0, 0, 0.9);
            margin: 0 0 10px;
          }

          .df-subtitle {
            font-size: clamp(16px, 2.5vw, 22px);
            font-weight: 600;
            color: rgba(241, 245, 249, 0.96);
            text-shadow: 0 12px 40px rgba(0, 0, 0, 0.9);
          }
          .df-subsubtitle {
            font-size: 14px;
            margin-top: 4px;
            color: rgba(209, 213, 219, 0.9);
            text-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
          }

          .df-content {
            margin-top: 20px;
            padding: 24px 20px 30px;
            border-radius: 22px;
            background: radial-gradient(
                1200px 800px at 0% 0%,
                rgba(148, 163, 184, 0.18),
                transparent 60%
              ),
              radial-gradient(
                1200px 800px at 100% 0%,
                rgba(59, 130, 246, 0.2),
                transparent 60%
              ),
              rgba(15, 23, 42, 0.96);
            border: 1px solid rgba(148, 163, 184, 0.7);
            box-shadow: 0 26px 70px rgba(15, 23, 42, 0.95);
          }
          .df-content-blur {
            filter: blur(4px);
            pointer-events: none;
          }
          .df-content-on {
            filter: none;
          }

          .df-intro {
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 22px;
            color: rgba(226, 232, 240, 0.95);
          }
          .df-intro p {
            margin: 0 0 10px;
          }

          .df-video-block {
            margin-bottom: 26px;
          }
          .df-video-block h2 {
            margin: 0 0 10px;
            font-size: 18px;
            font-weight: 700;
          }

          .player {
            position: relative;
            width: 100%;
            aspect-ratio: 16 / 9;
            background: #000;
            border-radius: 18px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.32);
          }

          .player iframe {
            width: 100%;
            height: 100%;
            border: 0;
            display: block;
          }

          /* Masque la zone du haut de YouTube (avatar, titre, "copier le lien") */
          .yt-top-mask {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            background: linear-gradient(
              180deg,
              rgba(15, 23, 42, 0.98),
              transparent
            );
            z-index: 2;
            pointer-events: auto;
          }

          .df-note-footer {
            margin-top: 10px;
            font-size: 12px;
            opacity: 0.8;
          }

          /* Overlay login */
          .df-login-overlay {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            z-index: 10;
            backdrop-filter: blur(6px);
          }
          .df-login-card {
            width: 100%;
            max-width: 420px;
            background: radial-gradient(
                900px 700px at 0% 0%,
                rgba(59, 130, 246, 0.4),
                transparent 60%
              ),
              radial-gradient(
                900px 700px at 100% 0%,
                rgba(14, 165, 233, 0.5),
                transparent 60%
              ),
              #0f172a;
            border-radius: 22px;
            padding: 24px 20px 20px;
            border: 1px solid rgba(191, 219, 254, 0.85);
            box-shadow: 0 26px 60px rgba(15, 23, 42, 0.95);
            color: #e5f2ff;
          }
          .df-login-card h2 {
            margin: 0 0 8px;
            font-size: 20px;
            font-weight: 800;
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
            padding: 10px 12px;
            border-radius: 10px;
            border: 1px solid rgba(191, 219, 254, 0.9);
            background: rgba(15, 23, 42, 0.96);
            color: #e5f2ff;
            font-size: 14px;
            outline: none;
          }
          .df-login-form input:focus {
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.8);
          }
          .df-login-form button {
            margin-top: 4px;
            padding: 10px 14px;
            border-radius: 999px;
            border: none;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            color: #0b1020;
            background: linear-gradient(135deg, #38bdf8, #4f46e5, #ec4899);
            box-shadow: 0 18px 50px rgba(15, 23, 42, 0.95);
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
            opacity: 0.85;
          }

          @media (max-width: 768px) {
            .df-backdrop {
              padding: 18px;
            }
            .df-content {
              padding: 18px 14px 22px;
              border-radius: 18px;
            }
            .player {
              border-radius: 14px;
            }
          }
        `}</style>
      </main>
    </>
  );
}
