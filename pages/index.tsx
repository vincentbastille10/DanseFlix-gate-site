import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>DanseFlix — La Belle au Bois Dormant</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="DanseFlix — Captations HD du spectacle 'La Belle au Bois Dormant' du Centre de Danse Delphine Letort. Couleur, mouvement, émotion."
        />
        <link rel="icon" href="https://i.postimg.cc/jjTjB78d/logo-delph-trans-copie.jpg" />
        {/* Tailwind via CDN */}
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    colors: {
                      midnight: '#0B0A1A',
                      fuchsia: '#ff49db',
                      aurora: '#8b5cf6',
                      coral: '#ff6b6b',
                      gold: '#ffd166',
                      ocean: '#00d1ff'
                    },
                    boxShadow: {
                      glass: '0 10px 40px rgba(0,0,0,.35)'
                    },
                    backdropBlur: {
                      xs: '2px'
                    }
                  }
                }
              }
            `,
          }}
        />
        {/* Styles d’animations custom */}
        <style>{`
          .hero-gradient {
            background: radial-gradient(1200px 800px at 10% 10%, rgba(255,105,180,.14), transparent 50%),
                        radial-gradient(1200px 700px at 90% 20%, rgba(0,209,255,.10), transparent 55%),
                        radial-gradient(1000px 700px at 50% 90%, rgba(139,92,246,.12), transparent 60%),
                        linear-gradient(180deg, #0B0A1A 0%, #020107 100%);
          }
          .blob {
            position: absolute; filter: blur(38px); opacity: .45; mix-blend-mode: screen; border-radius: 9999px;
            animation: float 18s ease-in-out infinite;
          }
          .blob--1 { width: 38rem; height: 38rem; left: -10%; top: -8%; background: radial-gradient(circle at 30% 30%, #ff6b6b, transparent 60%); animation-delay: 0s; }
          .blob--2 { width: 34rem; height: 34rem; right: -8%; top: 10%; background: radial-gradient(circle at 60% 40%, #8b5cf6, transparent 60%); animation-delay: 3s; }
          .blob--3 { width: 28rem; height: 28rem; left: 15%; bottom: -10%; background: radial-gradient(circle at 40% 60%, #00d1ff, transparent 60%); animation-delay: 6s; }
          @keyframes float {
            0%   { transform: translateY(0px) translateX(0px) scale(1); }
            33%  { transform: translateY(-18px) translateX(10px) scale(1.04); }
            66%  { transform: translateY(8px) translateX(-12px) scale(0.98); }
            100% { transform: translateY(0px) translateX(0px) scale(1); }
          }
          .shine {
            background: linear-gradient(90deg, rgba(255,255,255,.0) 0%, rgba(255,255,255,.28) 50%, rgba(255,255,255,.0) 100%);
            background-size: 300% 100%;
            animation: shine 3.8s ease-in-out infinite;
            mask-image: linear-gradient(180deg, transparent 0%, black 10%, black 90%, transparent 100%);
          }
          @keyframes shine {
            0% { background-position: 200% 0 }
            100% { background-position: -100% 0 }
          }
          .no-select { user-select: none; }
        `}</style>
      </Head>

      <body
        className="min-h-screen text-white hero-gradient relative overflow-x-hidden"
        onContextMenu={(e) => e.preventDefault()} // pas de clic droit (évite "télécharger")
      >
        {/* Blobs lumineux */}
        <div className="blob blob--1" />
        <div className="blob blob--2" />
        <div className="blob blob--3" />

        {/* NAV simple */}
        <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://i.postimg.cc/jjTjB78d/logo-delph-trans-copie.jpg"
              alt="Logo Delphine Letort"
              className="w-10 h-10 rounded-md shadow-glass no-select pointer-events-none"
            />
            <span className="text-sm tracking-widest text-white/70 uppercase">Centre de Danse Delphine Letort</span>
          </div>
          <a
            href="https://www.dansedelphineletort.com/"
            target="_blank"
            className="rounded-full bg-white/10 hover:bg-white/15 transition px-4 py-2 text-sm border border-white/10 shadow-glass"
          >
            Visiter l’école
          </a>
        </nav>

        {/* HERO */}
        <header className="relative z-10 max-w-7xl mx-auto px-6 pt-4 pb-12 md:pt-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <h1 className="no-select text-[12vw] md:text-7xl font-extrabold leading-[0.9] tracking-tight">
                <span className="bg-gradient-to-r from-coral via-aurora to-ocean bg-clip-text text-transparent">
                  DanseFlix
                </span>
              </h1>
              <div className="h-1 w-40 mt-5 bg-gradient-to-r from-fuchsia to-gold rounded-full shine" />
              <p className="mt-6 text-white/80 max-w-xl text-lg">
                <span className="font-semibold text-white">La Belle au Bois Dormant</span> — couleurs, souffle, et
                mouvement. Revivez le spectacle en haute définition.
              </p>

              {/* Badges */}
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10">1080p HD</span>
                <span className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10">Son stéréo</span>
                <span className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10">Multi-supports</span>
              </div>
            </div>

            <figure className="order-1 md:order-2 relative">
              <img
                src="https://i.postimg.cc/vmXGjSxR/La-Belle-Affiche-copie.jpg"
                alt="Affiche — La Belle au Bois Dormant"
                className="w-full rounded-3xl shadow-glass border border-white/10"
              />
              {/* halo */}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10 pointer-events-none" />
            </figure>
          </div>
        </header>

        {/* VIDO BOXES */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
          <section className="grid lg:grid-cols-2 gap-10">
            {/* Samedi */}
            <article className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-glass overflow-hidden">
              <div className="p-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  <span className="bg-gradient-to-r from-fuchsia to-aurora bg-clip-text text-transparent">Samedi</span>{" "}
                  — La Belle au bois dormant
                </h2>
                <span className="text-xs text-white/70">1080p</span>
              </div>
              <div className="aspect-video border-t border-white/10">
                <iframe
                  className="w-full h-full"
                  title="DanseFlix Samedi"
                  src="https://www.youtube.com/embed/AI_UteIH42U?rel=0&vq=hd1080&modestbranding=1&controls=1&disablekb=1"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  sandbox="allow-same-origin allow-scripts allow-presentation"
                />
              </div>
              <div className="p-6 pt-4 text-sm text-white/80">
                Captation HD — samedi · Salle des Concerts du Mans
              </div>
            </article>

            {/* Dimanche */}
            <article className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-glass overflow-hidden">
              <div className="p-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  <span className="bg-gradient-to-r from-gold to-coral bg-clip-text text-transparent">Dimanche</span>{" "}
                  — La Belle au bois dormant
                </h2>
                <span className="text-xs text-white/70">1080p</span>
              </div>
              <div className="aspect-video border-t border-white/10">
                <iframe
                  className="w-full h-full"
                  title="DanseFlix Dimanche"
                  src="https://www.youtube.com/embed/Ky6x74z20N8?rel=0&vq=hd1080&modestbranding=1&controls=1&disablekb=1"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  sandbox="allow-same-origin allow-scripts allow-presentation"
                />
              </div>
              <div className="p-6 pt-4 text-sm text-white/80">
                Captation HD — dimanche · Salle des Concerts du Mans
              </div>
            </article>
          </section>

          {/* Bandeau émotion */}
          <section className="mt-14 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-glass">
            <p className="text-center text-white/90 text-lg">
              Une école, des <span className="bg-gradient-to-r from-fuchsia to-aurora bg-clip-text text-transparent font-semibold">couleurs</span>, des{" "}
              <span className="bg-gradient-to-r from-ocean to-gold bg-clip-text text-transparent font-semibold">mouvements</span>, un
              <span className="bg-gradient-to-r from-coral to-gold bg-clip-text text-transparent font-semibold"> spectacle</span>.
            </p>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="relative z-10 max-w-7xl mx-auto px-6 pb-10 text-center text-white/70">
          © 2025 Centre de Danse Delphine Letort · Réalisation <span className="text-white">Spectra Media</span>
        </footer>
      </body>
    </>
  );
}
