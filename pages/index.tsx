# app.py — DanseFlix (Flask, page unique, design moderne + YouTube en 1080p minimal branding)
from flask import Flask, render_template_string

app = Flask(__name__)

# === Variables vidéos YouTube (IDs uniquement) ===
YT_SAMEDI_ID = "AI_UteIH42U"
YT_DIMANCHE_ID = "Ky6x74z20N8"

# Paramètres d’embed YouTube :
# - vq=hd1080 : demande 1080p quand dispo
# - modestbranding=1 : branding réduit
# - rel=0 : pas de vidéos suggérées d’autres chaînes
# - controls=1 : contrôles simples
# - disablekb=1 : bloque certains raccourcis (dont parfois “download” extensions)
YT_PARAMS = "rel=0&vq=hd1080&modestbranding=1&controls=1&disablekb=1"

PAGE = f"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>DanseFlix — La Belle au Bois Dormant</title>
<link rel="icon" href="https://i.postimg.cc/jjTjB78d/logo-delph-trans-copie.jpg" />
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap" rel="stylesheet">
<style>
  :root {{
    --bg:#0B0A1A; --pink:#ff6fb3; --violet:#a78bfa; --cyan:#00d1ff; --glass:rgba(255,255,255,.06);
  }}
  * {{ box-sizing: border-box }}
  html, body {{ height: 100% }}
  body {{
    margin:0; font-family: Inter, system-ui, Segoe UI, Roboto, Arial, sans-serif; color:#fff; overflow-x:hidden;
    background:
      radial-gradient(1200px 800px at 8% 10%, rgba(255,111,179,.14), transparent 50%),
      radial-gradient(1100px 700px at 92% 20%, rgba(167,139,250,.12), transparent 55%),
      radial-gradient(1000px 700px at 50% 95%, rgba(0,209,255,.10), transparent 60%),
      var(--bg);
    animation: gradientFloat 18s ease-in-out infinite alternate;
  }}
  @keyframes gradientFloat {{
    0% {{ background-position:0% 0% }}
    100% {{ background-position:100% 100% }}
  }}
  .wrap {{ max-width:1200px; margin:0 auto; padding:32px }}
  header {{ text-align:center; padding:48px 16px 16px; position:relative; }}
  header img.logo {{
    width:min(120px,22vw);
    filter: drop-shadow(0 6px 22px rgba(0,0,0,.5));
    user-select:none; pointer-events:none;
  }}
  h1 {{
    margin:16px 0 8px; line-height:.9;
    font-size:clamp(42px, 12vw, 128px);
    font-weight:900; letter-spacing:-.02em; text-transform:uppercase;
    background: linear-gradient(90deg, var(--pink), var(--violet), var(--cyan));
    -webkit-background-clip:text; background-clip:text; color:transparent;
    animation: hue 10s ease-in-out infinite alternate;
  }}
  @keyframes hue {{ from {{ filter:hue-rotate(0deg) }} to {{ filter:hue-rotate(30deg) }} }}
  .subtitle {{ color:rgba(255,255,255,.75); font-size:1.05rem; font-style:italic }}
  .shine {{ height:4px; width:180px; margin:22px auto 0; border-radius:9999px; overflow:hidden; position:relative }}
  .shine::before {{
    content:""; position:absolute; inset:0;
    background:linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent);
    transform:translateX(-100%); animation:shine 3.6s ease-in-out infinite;
  }}
  @keyframes shine {{ to {{ transform:translateX(100%) }} }}

  .grid {{ display:grid; gap:28px; grid-template-columns:1fr }}
  @media(min-width:960px) {{ .grid{{ grid-template-columns:1fr 1fr }} }}

  .card {{
    border:1px solid rgba(255,255,255,.12);
    border-radius:22px; background:var(--glass);
    backdrop-filter: blur(10px);
    box-shadow:0 24px 60px rgba(0,0,0,.35);
    overflow:hidden;
  }}
  .card-header {{ display:flex; align-items:center; justify-content:space-between; padding:18px 20px }}
  .badge {{ font-size:.75rem; padding:6px 10px; border-radius:999px; background:rgba(255,255,255,.10); border:1px solid rgba(255,255,255,.12) }}
  .title {{
    font-size:1.15rem; font-weight:700; margin:0;
    background:linear-gradient(90deg, var(--pink), var(--violet));
    -webkit-background-clip:text; background-clip:text; color:transparent;
  }}
  .title.dimanche {{
    background:linear-gradient(90deg, #ffd166, #ff6b6b);
    -webkit-background-clip:text; background-clip:text; color:transparent;
  }}

  .player {{ aspect-ratio:16/9; background:#000; border-top:1px solid rgba(255,255,255,.08) }}
  .player iframe {{ width:100%; height:100%; display:block; border:0; }}

  footer {{ text-align:center; margin:56px 0 24px; color:rgba(255,255,255,.65);
           border-top:1px solid rgba(255,255,255,.12); padding-top:18px; font-size:.95rem; }}
  a.button {{
    display:inline-block; margin-top:8px; background:linear-gradient(90deg,var(--violet),var(--pink));
    color:#000; font-weight:700; padding:12px 22px; border-radius:999px; text-decoration:none;
    box-shadow:0 10px 30px rgba(0,0,0,.35); transition:transform .25s ease;
  }}
  a.button:hover {{ transform:translateY(-2px) }}
</style>
</head>
<body oncontextmenu="return false">
  <div class="wrap">
    <header>
      <img class="logo" src="https://i.postimg.cc/jjTjB78d/logo-delph-trans-copie.jpg" alt="Logo Centre de Danse Delphine Letort">
      <h1>DanseFlix</h1>
      <p class="subtitle">La Belle au bois dormant — Spectacle 2025</p>
      <div class="shine" aria-hidden="true"></div>
    </header>

    <main class="grid" aria-label="Lecteurs vidéo">
      <!-- Samedi -->
      <article class="card">
        <div class="card-header">
          <h2 class="title">Samedi — La Belle au bois dormant</h2>
          <span class="badge">1080p</span>
        </div>
        <div class="player">
          <iframe
            src="https://www.youtube.com/embed/{YT_SAMEDI_ID}?{YT_PARAMS}"
            title="DanseFlix Samedi"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            sandbox="allow-same-origin allow-scripts allow-presentation"
          ></iframe>
        </div>
        <div class="card-header" style="border-top:1px solid rgba(255,255,255,.08)">
          <span class="badge">Salle des Concerts du Mans</span>
          <span class="badge">Son stéréo</span>
        </div>
      </article>

      <!-- Dimanche -->
      <article class="card">
        <div class="card-header">
          <h2 class="title dimanche">Dimanche — La Belle au bois dormant</h2>
          <span class="badge">1080p</span>
        </div>
        <div class="player">
          <iframe
            src="https://www.youtube.com/embed/{YT_DIMANCHE_ID}?{YT_PARAMS}"
            title="DanseFlix Dimanche"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            sandbox="allow-same-origin allow-scripts allow-presentation"
          ></iframe>
        </div>
        <div class="card-header" style="border-top:1px solid rgba(255,255,255,.08)">
          <span class="badge">Salle des Concerts du Mans</span>
          <span class="badge">Son stéréo</span>
        </div>
      </article>
    </main>

    <div style="text-align:center;margin-top:28px">
      <a class="button" href="https://www.dansedelphineletort.com/" target="_blank" rel="noreferrer">
        Visiter le site de l’école
      </a>
    </div>

    <footer>
      © 2025 Centre de Danse Delphine Letort · Réalisation <span style="color:var(--pink)">Spectra Media</span>
    </footer>
  </div>
</body>
</html>
"""

@app.route("/")
def index():
    return render_template_string(PAGE)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
