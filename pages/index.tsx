
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>DanseFlix — La Belle au Bois Dormant</title>
        <meta name="description" content="DanseFlix — Les captations HD du spectacle 'La Belle au bois dormant' du Centre de Danse Delphine Letort. Découvrez les représentations du samedi et du dimanche en haute définition." />
        <meta property="og:title" content="DanseFlix — La Belle au Bois Dormant" />
        <meta property="og:description" content="Captations HD de l'École de danse Delphine Letort — Samedi et Dimanche." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="https://i.postimg.cc/jjTjB78d/logo-delph-trans-copie.jpg" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{__html:`
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  rosefluo: '#ff6fb3',
                  violetsoft: '#a78bfa',
                  midnight: '#0f0a25',
                },
                fontFamily: {
                  sans: ['Inter', 'system-ui', 'sans-serif']
                },
                boxShadow: {
                  soft: '0 15px 40px rgba(0,0,0,0.3)'
                }
              }
            }
          }
        `}} />
      </Head>

      <body className="bg-gradient-to-b from-midnight via-slate-900 to-black text-white font-sans min-h-screen flex flex-col items-center">
        {/* Header */}
        <header className="text-center py-12">
          <img src="https://i.postimg.cc/jjTjB78d/logo-delph-trans-copie.jpg" alt="Logo Centre de Danse Delphine Letort" className="mx-auto w-44 drop-shadow-xl" />
          <h1 className="text-6xl font-extrabold mt-6 bg-gradient-to-r from-rosefluo via-violetsoft to-rosefluo bg-clip-text text-transparent tracking-wide animate-pulse">DanseFlix</h1>
          <p className="mt-3 text-lg text-gray-300 italic">La Belle au bois dormant — Spectacle 2025</p>
        </header>

        {/* Affiche principale */}
        <section className="w-full max-w-3xl px-4 mb-10">
          <figure className="rounded-2xl overflow-hidden shadow-[0_20px_55px_rgba(0,0,0,0.4)] border border-slate-800">
            <img src="https://i.postimg.cc/vmXGjSxR/La-Belle-Affiche-copie.jpg" alt="Affiche du spectacle La Belle au Bois Dormant – Delphine Letort" loading="lazy" className="w-full h-auto object-cover" />
            <figcaption className="text-center text-gray-400 text-sm py-2 bg-slate-900/60">Samedi 28 & Dimanche 29 juin 2025 — Salle des Concerts du Mans</figcaption>
          </figure>
        </section>

        {/* Vidéos */}
        <main id="contenu" className="flex flex-col items-center w-full max-w-5xl gap-10 px-4 pb-20">
          <section className="w-full bg-gradient-to-r from-slate-800/70 to-slate-900/60 backdrop-blur-md rounded-2xl shadow-soft p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold mb-4 text-center text-rosefluo">Samedi après-midi — La Belle au bois dormant</h2>
            <div className="aspect-video rounded-xl overflow-hidden border border-slate-700">
              <iframe src="https://archive.org/embed/ok-dljuin-2025-sam-15h-rush-serre.mov-sam-am-multicam-dim-16h-1" title="Samedi Après-midi" className="w-full h-full" allowFullScreen></iframe>
            </div>
          </section>

          <section className="w-full bg-gradient-to-r from-slate-800/70 to-slate-900/60 backdrop-blur-md rounded-2xl shadow-soft p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold mb-4 text-center text-rosefluo">Samedi soir — La Belle au bois dormant</h2>
            <div className="aspect-video rounded-xl overflow-hidden border border-slate-700">
              <iframe src="https://archive.org/embed/SAMSOOR" title="Samedi Soir" className="w-full h-full" allowFullScreen></iframe>
            </div>
          </section>

          <section className="w-full bg-gradient-to-r from-slate-800/70 to-slate-900/60 backdrop-blur-md rounded-2xl shadow-soft p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold mb-4 text-center text-rosefluo">Dimanche — La Belle au bois dormant</h2>
            <div className="aspect-video rounded-xl overflow-hidden border border-slate-700">
              <iframe src="https://archive.org/embed/dim_20250908" title="Dimanche" className="w-full h-full" allowFullScreen></iframe>
            </div>
          </section>

          <div className="text-center mt-10">
            <a href="https://www.dansedelphineletort.com/" target="_blank" className="inline-block bg-gradient-to-r from-violetsoft to-rosefluo text-black font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform">Visiter le site de l’école</a>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-8 text-gray-400 border-t border-slate-800 w-full mt-auto">
          © 2025 Centre de Danse Delphine Letort · Réalisation <span className="text-rosefluo">Spectra Media</span>
        </footer>
      </body>
    </>
  );
}
