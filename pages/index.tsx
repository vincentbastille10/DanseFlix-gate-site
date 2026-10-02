import Head from "next/head";
import { FormEvent, useEffect, useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Déjà validé sur ce navigateur ?
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ok = window.localStorage.getItem("danseflix_access_ok");
    const saved = window.localStorage.getItem("danseflix_email");
    if (ok === "1") {
      setUnlocked(true);
      setUserEmail(saved);
    }
  }, []);

  // Blocage du clic droit (pour éviter le menu contextuel sur la vidéo)
  useEffect(() => {
    const blockCtx = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", blockCtx);
    return () => {
      document.removeEventListener("contextmenu", blockCtx);
    };
  }, []);

  // Logout
  function handleLogout() {
    window.localStorage.removeItem("danseflix_access_ok");
    window.localStorage.removeItem("danseflix_email");
    setUnlocked(false);
    setUserEmail(null);
    setEmail("");
  }

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
        {/* NAVBAR CONNEXION */}
        {unlocked && (
          <nav className="df-navbar">
            <div className="df-navbar-content">
              <div className="df-navbar-user">
                <span className="df-navbar-label">Connecté en tant que</span>
                <span className="df-navbar-email">{userEmail}</span>
              </div>
              <button className="df-navbar-logout" onClick={handleLogout}>
                Changer de compte
              </button>
            </div>
          </nav>
        )}

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
              <div className="df-subtitle">Captations 2025 & 2026</div>
              <div className="df-subsubtitle">
                Spectacles enregistrés à la salle des concerts du Mans
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
                  Bienvenue sur DanseFlix ! Vous avez accès aux captations des spectacles auxquels vous avez souscrit. Regardez en qualité HD, aussi souvent que vous le souhaitez.
                </p>
              </section>

              {/* ANNÉE 2025 */}
              <section className="df-year-section">
                <h3 className="df-year-title">Spectacles 2025</h3>
                <div className="df-videos-grid">
                  <div className="df-video-block">
                    <h4>Samedi — La Belle au bois dormant</h4>
                    <div className="player">
                      <iframe
                        src="https://www.youtube-nocookie.com/embed/0euoXutCxYM?rel=0&modestbranding=1&showinfo=0&disablekb=1&iv_load_policy=3&vq=highres"
                        title="DanseFlix Samedi 2025"
                        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>

                  <div className="df-video-block">
                    <h4>Dimanche — La Belle au bois dormant</h4>
                    <div className="player">
                      <iframe
                        src="https://www.youtube-nocookie.com/embed/Ky6x74z20N8?rel=0&modestbranding=1&showinfo=0&disablekb=1&iv_load_policy=3&vq=highres"
                        title="DanseFlix Dimanche 2025"
                        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
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
                <div className="df-login-header">
                  <h2>Se connecter à DanseFlix</h2>
                  <p className="df-login-subtitle">
                    Entrez votre email pour accéder à vos vidéos
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="df-login-form">
                  <div className="df-form-group">
                    <label htmlFor="email">Email utilisé lors du paiement</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="exemple@email.com"
                      autoFocus
                    />
                  </div>
                  {error && <div className="df-error">{error}</div>}
                  <button type="submit" disabled={checking} className="df-login-submit">
                    {checking ? "Vérification en cours…" : "Se connecter"}
                  </button>
                </form>

                <div className="df-login-help-section">
                  <p className="df-login-help">
                    <strong>Besoin d&apos;aide ?</strong><br />
                    Vérifiez que vous utilisez l&apos;email du paiement.<br />
                    Contactez : <a href="mailto:spectramediabots@gmail.com">spectramediabots@gmail.com</a>
                  </p>
                </div>

                {/* 💳 BOUTON STRIPE D’ACHAT */}
                <div className="df-purchase-section">
                  <p className="df-purchase-label">
                    Pas encore client DanseFlix ?
                  </p>
                  <a
                    href="https://buy.stripe.com/aFabITgIOg31euTe1w3ks01"
                    target="_blank"
                    rel="noreferrer"
                    className="df-purchase-btn"
                  >
                    Acheter l&apos;accès aux vidéos
                  </a>
                  <p className="df-purchase-note">
                    Après le paiement, utilisez votre email pour vous connecter.
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
            position: relative;
          }

          /* NAVBAR CONNEXION */
          .df-navbar {
            position: sticky;
            top: 0;
            z-index: 20;
            background: linear-gradient(
              180deg,
              rgba(5, 5, 20, 0.98),
              rgba(5, 5, 20, 0.95)
            );
            border-bottom: 1px solid rgba(59, 130, 246, 0.3);
            backdrop-filter: blur(10px);
            padding: 12px 0;
          }
          .df-navbar-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 28px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
          }
          .df-navbar-user {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
          }
          .df-navbar-label {
            opacity: 0.7;
            color: rgba(209, 213, 219, 0.8);
          }
          .df-navbar-email {
            font-weight: 600;
            color: rgba(59, 130, 246, 0.9);
            padding: 4px 8px;
            background: rgba(59, 130, 246, 0.15);
            border-radius: 6px;
          }
          .df-navbar-logout {
            padding: 6px 14px;
            font-size: 13px;
            font-weight: 600;
            background: rgba(239, 68, 68, 0.2);
            border: 1px solid rgba(239, 68, 68, 0.5);
            color: rgba(254, 178, 178, 0.95);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .df-navbar-logout:hover {
            background: rgba(239, 68, 68, 0.3);
            border-color: rgba(239, 68, 68, 0.7);
            color: rgba(254, 202, 202, 0.98);
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
            position: relative;
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

          .df-user-info {
            margin-top: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            justify-content: center;
            font-size: 13px;
            opacity: 0.85;
          }
          .df-user-email {
            padding: 6px 10px;
            background: rgba(59, 130, 246, 0.2);
            border-radius: 8px;
            border: 1px solid rgba(59, 130, 246, 0.5);
          }
          .df-logout-btn {
            padding: 6px 12px;
            background: rgba(239, 68, 68, 0.2);
            border: 1px solid rgba(239, 68, 68, 0.5);
            border-radius: 8px;
            color: rgba(254, 202, 202, 0.9);
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .df-logout-btn:hover {
            background: rgba(239, 68, 68, 0.3);
            border-color: rgba(239, 68, 68, 0.7);
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

          .df-year-section {
            margin-bottom: 32px;
          }
          .df-year-title {
            margin: 0 0 16px;
            font-size: 20px;
            font-weight: 800;
            color: rgba(255, 255, 255, 0.98);
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .df-year-title::before {
            content: "";
            width: 3px;
            height: 24px;
            background: linear-gradient(135deg, #ff6fb3, #a78bfa);
            border-radius: 2px;
          }

          .df-videos-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
          }

          .df-video-block {
            margin-bottom: 0;
          }
          .df-video-block h4 {
            margin: 0 0 10px;
            font-size: 16px;
            font-weight: 600;
            color: rgba(226, 232, 240, 0.95);
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
          .df-login-header {
            margin-bottom: 20px;
          }
          .df-login-card h2 {
            margin: 0 0 6px;
            font-size: 24px;
            font-weight: 800;
            color: #fff;
          }
          .df-login-subtitle {
            margin: 0;
            font-size: 14px;
            opacity: 0.85;
            color: rgba(226, 232, 240, 0.9);
          }

          .df-login-form {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin: 20px 0;
          }

          .df-form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .df-login-form label {
            font-size: 13px;
            font-weight: 600;
            opacity: 0.95;
            color: rgba(226, 232, 240, 0.9);
          }

          .df-login-form input {
            padding: 12px 14px;
            border-radius: 10px;
            border: 1px solid rgba(191, 219, 254, 0.5);
            background: rgba(15, 23, 42, 0.8);
            color: #e5f2ff;
            font-size: 14px;
            outline: none;
            transition: all 0.2s ease;
          }

          .df-login-form input:focus {
            border-color: rgba(59, 130, 246, 0.9);
            background: rgba(15, 23, 42, 0.95);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
          }

          .df-login-submit {
            padding: 12px 20px;
            border-radius: 999px;
            border: none;
            cursor: pointer;
            font-weight: 700;
            font-size: 15px;
            color: #0b1020;
            background: linear-gradient(135deg, #38bdf8, #4f46e5, #ec4899);
            box-shadow: 0 18px 50px rgba(15, 23, 42, 0.95);
            transition: all 0.2s ease;
            margin-top: 8px;
          }

          .df-login-submit:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 22px 60px rgba(15, 23, 42, 0.98);
          }

          .df-login-submit:disabled {
            opacity: 0.7;
            cursor: progress;
          }

          .df-error {
            font-size: 13px;
            color: #fecaca;
            background: rgba(127, 29, 29, 0.4);
            border: 1px solid rgba(254, 202, 202, 0.9);
            border-radius: 8px;
            padding: 10px 12px;
            margin-top: -8px;
          }

          .df-login-help-section {
            border-top: 1px solid rgba(191, 219, 254, 0.3);
            padding-top: 16px;
            margin-top: 16px;
          }

          .df-login-help {
            margin: 0;
            font-size: 12px;
            opacity: 0.8;
            line-height: 1.6;
            color: rgba(226, 232, 240, 0.85);
          }

          .df-login-help a {
            color: rgba(59, 130, 246, 0.9);
            text-decoration: none;
            font-weight: 600;
            transition: color 0.2s ease;
          }

          .df-login-help a:hover {
            color: rgba(59, 130, 246, 1);
            text-decoration: underline;
          }

          .df-purchase-section {
            border-top: 1px solid rgba(191, 219, 254, 0.3);
            padding-top: 16px;
            margin-top: 16px;
          }

          .df-purchase-label {
            margin: 0 0 10px;
            font-size: 13px;
            font-weight: 600;
            color: rgba(226, 232, 240, 0.9);
          }

          .df-purchase-btn {
            display: inline-block;
            width: 100%;
            text-align: center;
            padding: 11px 16px;
            border-radius: 999px;
            text-decoration: none;
            font-weight: 700;
            font-size: 14px;
            background: linear-gradient(135deg, #22c55e, #16a34a, #15803d);
            color: #0b1020;
            box-shadow: 0 14px 40px rgba(15, 23, 42, 0.85);
            transition: all 0.2s ease;
          }

          .df-purchase-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 18px 50px rgba(15, 23, 42, 0.95);
          }

          .df-purchase-note {
            margin: 8px 0 0;
            font-size: 11px;
            opacity: 0.75;
            color: rgba(209, 213, 219, 0.8);
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
