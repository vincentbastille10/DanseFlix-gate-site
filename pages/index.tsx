import Head from "next/head";
import Script from "next/script";
import { useEffect, useState, FormEvent } from "react";

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

  // Script vidéo YouTube + blocage clic droit
  useEffect(() => {
    if (!unlocked) return; // on ne monte les players qu’après login

    const players = new Map<Element, any>();

    function mountPlayer(container: Element, vid: string) {
      const iframe = container.querySelector("iframe") as HTMLIFrameElement | null;
      if (!iframe) return;

      const origin = window.location.origin;
      const params = new URLSearchParams({
        enablejsapi: "1",
        playsinline: "1",
        modestbranding: "1",
        rel: "0",
        iv_load_policy: "3",
        controls: "0",
        disablekb: "1",
        fs: "1",
        // qualité maximale suggérée
        vq: "highres",
        origin,
      });

      iframe.src = `https://www.youtube-nocookie.com/embed/${vid}?${params.toString()}`;
      iframe.style.display = "block";

      const poster = container.querySelector(".poster");
      const playBtn = container.querySelector(".play");
      poster && poster.remove();
      playBtn && playBtn.remove();

      const YT = (window as any).YT;
      if (!YT || !YT.Player) return;

      const player = new YT.Player(iframe, {
        events: {
          onReady: (e: any) => {
            try {
              // on force la qualité max dispo (4K quand possible)
              e.target.setPlaybackQuality("highres");
            } catch {}
            e.target.playVideo();
          },
        },
      });

      players.set(container, player);

      const tgl = container.querySelector(".js-toggle") as HTMLDivElement | null;
      const mut = container.querySelector(".js-mute") as HTMLDivElement | null;
      const ful = container.querySelector(".js-full") as HTMLDivElement | null;
      const prg = container.querySelector(".js-prog") as HTMLDivElement | null;
      const bar = container.querySelector(".bar") as HTMLDivElement | null;

      function tick() {
        if (player && player.getDuration) {
          const d = player.getDuration() || 0;
          const t = player.getCurrentTime ? player.getCurrentTime() : 0;
          if (bar) {
            bar.style.width = d ? ((t / d) * 100).toFixed(2) + "%" : "0%";
          }
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);

      if (tgl) {
        tgl.onclick = () => {
          const st = player.getPlayerState();
          if (st === YT.PlayerState.PLAYING) {
            player.pauseVideo();
            tgl.textContent = "Lecture";
          } else {
            player.playVideo();
            tgl.textContent = "Pause";
          }
        };
      }

      if (mut) {
        mut.onclick = () => {
          if (player.isMuted()) {
            player.unMute();
            mut.textContent = "Son";
          } else {
            player.mute();
            mut.textContent = "Muet";
          }
        };
      }

      if (ful) {
        ful.onclick = () => {
          if (iframe.requestFullscreen) iframe.requestFullscreen();
        };
      }

      if (prg) {
        prg.onclick = (e: MouseEvent) => {
          const r = prg.getBoundingClientRect();
          const p = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
          const d = player.getDuration();
          if (d) player.seekTo(d * p, true);
        };
      }
    }

    // API YouTube prête
    (window as any).onYouTubeIframeAPIReady = () => {
      document.querySelectorAll<HTMLElement>(".player").forEach((box) => {
        const id = box.getAttribute("data-yt");
        const playBtn = box.querySelector(".play");
        if (id && playBtn) {
          playBtn.addEventListener(
            "click",
            () => mountPlayer(box, id),
            { once: true }
          );
        }
      });
    };

    // Blocage clic droit global
    const blockCtx = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", blockCtx);
    return () => {
      document.removeEventListener("contextmenu", blockCtx);
    };
  }, [unlocked]);

  // Vérification de l’email dans allowlist.json
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
      if (!res.ok) throw new Error("Allowlist introuvable");

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
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
        />
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
            {/* Logo blanc + sous-titre */}
            <header className="df-header">
              <div className="df-logo-main">DanseFlix</div>
              <div className="df-subtitle">La Belle au Bois Dormant</div>
            </header>

            {/* Contenu vidéos flouté tant que non connecté */}
            <div
              className={
                unlocked ? "df-content df-content-on" : "df-content df-content-blur"
              }
            >
              <section className="df-intro">
                <p>
                  Accès réservé aux familles et élèves. Vous retrouvez ici la
                  captation de <strong>La Belle au Bois Dormant</strong>.
                </p>
                <p>
                  Les vidéos sont disponibles en{" "}
                  <strong>haute définition (jusqu&apos;en 4K selon votre appareil)</strong>.
                  Pour être sûr d&apos;avoir la meilleure qualité, ouvrez les
                  paramètres YouTube (roue dentée) et choisissez la définition la plus
                  élevée.
                </p>
              </section>

              {/* Samedi */}
              <section className="df-video-block">
                <h2>Samedi — La Belle au bois dormant</h2>
                <div className="player" data-yt="AI_UteIH42U">
                  <div
                    className="poster"
                    style={{
                      backgroundImage:
                        "url('https://img.youtube.com/vi/AI_UteIH42U/maxresdefault.jpg')",
                    }}
                  />
                  <button className="play" aria-label="Lire">
                    <svg viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                  <iframe
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    sandbox="allow-same-origin allow-scripts allow-presentation"
                  />
                  <div className="ctrls">
                    <div className="btn js-toggle">Lecture</div>
                    <div className="btn js-mute">Son</div>
                    <div className="prog js-prog">
                      <div className="bar"></div>
                    </div>
                    <div className="btn js-full">Plein écran</div>
                  </div>
                </div>
              </section>

              {/* Dimanche */}
              <section className="df-video-block">
                <h2>Dimanche — La Belle au bois dormant</h2>
                <div className="player" data-yt="Ky6x74z20N8">
                  <div
                    className="poster"
                    style={{
                      backgroundImage:
                        "url('https://img.youtube.com/vi/Ky6x74z20N8/maxresdefault.jpg')",
                    }}
                  />
                  <button className="play" aria-label="Lire">
                    <svg viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                  <iframe
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    sandbox="allow-same-origin allow-scripts allow-presentation"
                  />
                  <div className="ctrls">
                    <div className="btn js-toggle">Lecture</div>
                    <div className="btn js-mute">Son</div>
                    <div className="prog js-prog">
                      <div className="bar"></div>
                    </div>
                    <div className="btn js-full">Plein écran</div>
                  </div>
                </div>
              </section>

              <p className="df-note-footer">
                Merci de ne pas partager ce lien publiquement. Cette page est réservée
                aux familles et danseurs ayant acquis la captation.
              </p>
            </div>
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

        {/* Styles globaux */}
        <style jsx global>{`
          :root {
            --bg: #0b0a1a;
            --pink: #ff6fb3;
            --violet: #a78bfa;
            --cyan: #00d1ff;
            --glass: rgba(255, 255, 255, 0.06);
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
              url("/belle-poster.jpg") center/cover no-repeat;
          }

          .df-overlay-gradient {
            position: absolute;
            inset: 0;
            background: linear-gradient(
              180deg,
              rgba(5, 5, 20, 0.85),
              rgba(5, 5, 20, 0.95)
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
          }
          .df-logo-main {
            margin: 0 0 4px;
            font-size: clamp(42px, 8vw, 96px);
            letter-spacing: 0.1em;
            text-transform: uppercase;
            font-weight: 900;
            color: #ffffff;
            text-shadow: 0 18px 50px rgba(0, 0, 0, 0.9);
          }
          .df-subtitle {
            font-size: clamp(18px, 3vw, 28px);
            font-weight: 600;
            color: rgba(241, 245, 249, 0.95);
            text-shadow: 0 12px 40px rgba(0, 0, 0, 0.9);
          }

          .df-content {
            padding: 24px 20px 30px;
            border-radius: 22px;
            background: radial-gradient(
                1200px 800px at 0% 0%,
                rgba(148, 163, 184, 0.14),
                transparent 60%
              ),
              radial-gradient(
                1200px 800px at 100% 0%,
                rgba(59, 130, 246, 0.16),
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

          .poster {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
          }
          .poster::after {
            content: "";
            position: absolute;
            inset: 0;
            background: radial-gradient(
              75% 55% at 50% 50%,
              transparent 60%,
              rgba(0, 0, 0, 0.4)
            );
          }

          .play {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 96px;
            height: 96px;
            border-radius: 999px;
            background: linear-gradient(135deg, var(--violet), var(--pink));
            box-shadow: 0 18px 60px rgba(0, 0, 0, 0.8);
            display: grid;
            place-items: center;
            cursor: pointer;
            border: none;
          }
          .play svg {
            width: 40px;
            height: 40px;
            fill: #000;
          }

          iframe {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            border: 0;
            display: none;
          }

          .ctrls {
            position: absolute;
            left: 12px;
            right: 12px;
            bottom: 10px;
            display: flex;
            gap: 10px;
            align-items: center;
            opacity: 0;
            transition: opacity 0.25s;
          }
          .player:hover .ctrls {
            opacity: 1;
          }

          .btn {
            background: rgba(0, 0, 0, 0.55);
            border: 1px solid rgba(255, 255, 255, 0.18);
            border-radius: 12px;
            padding: 8px 12px;
            font-size: 0.85rem;
            cursor: pointer;
            user-select: none;
          }

          .prog {
            flex: 1;
            height: 6px;
            background: rgba(255, 255, 255, 0.18);
            border-radius: 9999px;
            position: relative;
            cursor: pointer;
          }
          .bar {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 0%;
            background: linear-gradient(90deg, var(--violet), var(--pink));
            border-radius: 9999px;
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
            background: linear-gradient(
              135deg,
              #38bdf8,
              #4f46e5,
              #ec4899
            );
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

      {/* Script YouTube API */}
      <Script
        src="https://www.youtube.com/iframe_api"
        strategy="afterInteractive"
      />
    </>
  );
}
