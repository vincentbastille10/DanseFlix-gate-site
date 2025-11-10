import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>DanseFlix — La Belle au Bois Dormant</title>
        <meta
          name="description"
          content="DanseFlix — Les captations HD du spectacle 'La Belle au bois dormant' du Centre de Danse Delphine Letort. Découvrez les représentations du samedi après-midi et du dimanche."
        />
        <meta property="og:title" content="DanseFlix — La Belle au Bois Dormant" />
        <meta property="og:description" content="Captations HD — Samedi (après-midi) et Dimanche." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="https://i.postimg.cc/jjTjB78d/logo-delph-trans-copie.jpg" />
        <link rel="preconnect" href="https://archive.org" />
        <link rel="dns-prefetch" href="https://archive.org" />
        <script src="https://cdn.tailwindcss.com" defer></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    colors: { rosefluo:'#ff6fb3', violetsoft:'#a78bfa', midnight:'#0f0a25' },
                    fontFamily: { sans:['Inter','system-ui','sans-serif'] },
                    boxShadow: { soft:'0 15px 40px rgba(0,0,0,0.3)' }
                  }
                }
              }`,
          }}
        />
      </Head>

      <body className="bg-gradient-to-b from-midnight via-slate-900 to-black text-white font-sans min-h-screen flex flex-col items-center">
        {/* Header */}
        <header className="text-center py-12">
          <img
            src="https://i.postimg.cc/jjTjB78d/logo-delph-trans-copie.jpg"
            alt="Logo Centre de Danse Delphine Letort"
            className="mx-auto w-44 drop-shadow-xl"
          />
          <h1 className="text-6xl font-extrabold mt-6 bg-gradient-to-r from-rosefluo via-violetsoft to-rosefluo bg-clip-text text-transparent tracking-wide animate-pulse">
            DanseFlix
          </h1>
          <p className="mt-3 text-lg text-gray-300 italic">
            La Belle au bois dormant — Spectacle 2025
          </p>
        </header>

        {/* Affiche */}
        <section className="w-full max-w-3xl px-4 mb-10">
          <figure className="rounded-2xl overflow-hidden shadow-[0_20px_55px_rgba(0,0,0,0.4)] border border-slate-800">
            <img
              src="https://i.postimg.cc/vmXGjSxR/La-Belle-Affiche-copie.jpg"
              alt="Affiche du spectacle La Belle au Bois Dormant – Delphine Letort"
              loading="lazy"
              className="w-full h-auto object-cover"
            />
            <figcaption className="text-center text-gray-400 text-sm py-2 bg-slate-900/60">
              Samedi 28 & Dimanche 29 juin 2025 — Salle des Concerts du Mans
            </figcaption>
          </figure>
        </section>

        {/* Liens vidéos — ouverture dans un nouvel onglet */}
        <main id="contenu" className="flex flex-col items-center w-full max-w-2xl gap-6 px-4 pb-20">
          <section className="w-full bg-gradient-to-r from-slate-800/70 to-slate-900/60 backdrop-blur-md rounded-2xl shadow-soft p-6 border border-slate-700/50 text-center">
            <h2 className="text-2xl font-semibold mb-3 text-rosefluo">
              Samedi après-midi — La Belle au bois dormant
            </h2>
            <p className="text-gray-300 mb-4">Ouverture dans un nouvel onglet pour une lecture plus fluide.</p>
            <a
              href="https://archive.org/download/ok-dljuin-2025-sam-15h-rush-serre.mov-sam-am-multicam-dim-16h-1/ok-dljuin-2025-sam-15h-rush-serre.mov-sam-am-multicam-dim-16h-1.mp4"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violetsoft to-rosefluo text-black font-semibold hover:scale-105 transition-transform"
            >
              ▶ Ouvrir la vidéo Samedi après-midi
            </a>
            <div className="mt-3 text-xs text-gray-400">
              Si le débit est faible, clic droit → “Enregistrer la vidéo sous…”
            </div>
          </section>

          <section className="w-full bg-gradient-to-r from-slate-800/70 to-slate-900/60 backdrop-blur-md rounded-2xl shadow-soft p-6 border border-slate-700/50 text-center">
            <h2 className="text-2xl font-semibold mb-3 text-rosefluo">
              Dimanche — La Belle au bois dormant
            </h2>
            <p className="text-gray-300 mb-4">Ouverture dans un nouvel onglet pour une lecture plus fluide.</p>
            <a
              href="https://archive.org/download/dim_20250908/dim_20250908.mp4"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violetsoft to-rosefluo text-black font-semibold hover:scale-105 transition-transform"
            >
              ▶ Ouvrir la vidéo Dimanche
            </a>
            <div className="mt-3 text-xs text-gray-400">
              Si le débit est faible, clic droit → “Enregistrer la vidéo sous…”
            </div>
          </section>

          {/* Lien site */}
          <div className="text-center mt-6">
            <a
              href="https://www.dansedelphineletort.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-violetsoft to-rosefluo text-black font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              Visiter le site de l’école
            </a>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-8 text-gray-400 border-t border-slate-800 w-full mt-auto">
          © 2025 Centre de Danse Delphine Letort · Réalisation{" "}
          <span className="text-rosefluo">Spectra Media</span>
        </footer>
      </body>
    </>
  );
}
