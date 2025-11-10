from flask import Flask, render_template_string

app = Flask(__name__)

@app.route("/")
def home():
    return render_template_string("""
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DanseFlix — La Belle au Bois Dormant</title>
<link rel="icon" href="https://i.postimg.cc/jjTjB78d/logo-delph-trans-copie.jpg">
<style>
  body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    color: white;
    overflow-x: hidden;
    background: radial-gradient(circle at 30% 10%, rgba(255,111,179,0.15), transparent 40%),
                radial-gradient(circle at 70% 80%, rgba(167,139,250,0.15), transparent 40%),
                radial-gradient(circle at 50% 50%, rgba(0,209,255,0.12), transparent 40%),
                #0b0a1a;
    animation: glow 15s ease-in-out infinite alternate;
  }
  @keyframes glow {
    0% { background-position: 0% 0%; }
    100% { background-position: 100% 100%; }
  }
  header {
    text-align: center;
    padding: 60px 20px 30px;
  }
  h1 {
    font-size: clamp(3rem, 10vw, 6rem);
    background: linear-gradient(90deg, #ff6fb3, #a78bfa, #00d1ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 900;
    letter-spacing: -2px;
    text-transform: uppercase;
    animation: hueShift 8s ease-in-out infinite alternate;
  }
  @keyframes hueShift {
    from { filter: hue-rotate(0deg); }
    to { filter: hue-rotate(45deg); }
  }
  p.subtitle {
    color: rgba(255,255,255,0.7);
    font-style: italic;
    font-size: 1.2rem;
  }
  section.video {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
    padding: 60px 20px 100px;
  }
  .player {
    width: min(90vw, 900px);
    aspect-ratio: 16/9;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(8px);
  }
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  footer {
    text-align: center;
    padding: 40px 0;
    color: rgba(255,255,255,0.6);
    border-top: 1px solid rgba(255,255,255,0.1);
    font-size: 0.9rem;
  }
  a.button {
    display: inline-block;
    margin-top: 20px;
    background: linear-gradient(90deg, #a78bfa, #ff6fb3);
    color: #000;
    font-weight: 600;
    padding: 12px 28px;
    border-radius: 30px;
    text-decoration: none;
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    transition: transform 0.25s ease;
  }
  a.button:hover {
    transform: scale(1.05);
  }
</style>
</head>
<body oncontextmenu="return false">
  <header>
    <img src="https://i.postimg.cc/jjTjB78d/logo-delph-trans-copie.jpg" width="140" alt="Logo" style="filter: drop-shadow(0 0 10px rgba(255,255,255,0.3));">
    <h1>DanseFlix</h1>
    <p class="subtitle">La Belle au bois dormant — Spectacle 2025</p>
  </header>

  <section class="video">
    <div class="player">
      <video controls preload="metadata" poster="https://i.postimg.cc/vmXGjSxR/La-Belle-Affiche-copie.jpg">
        <source src="/static/samedi.mp4" type="video/mp4">
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>
    </div>
    <div class="player">
      <video controls preload="metadata" poster="https://i.postimg.cc/vmXGjSxR/La-Belle-Affiche-copie.jpg">
        <source src="/static/dimanche.mp4" type="video/mp4">
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>
    </div>

    <a class="button" href="https://www.dansedelphineletort.com/" target="_blank">Visiter le site de l'école</a>
  </section>

  <footer>
    © 2025 Centre de Danse Delphine Letort — Réalisation <span style="color:#ff6fb3">Spectra Media</span>
  </footer>
</body>
</html>
""")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
