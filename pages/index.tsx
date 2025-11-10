<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>DanseFlix — La Belle au Bois Dormant</title>
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
<style>
  :root{--bg:#0B0A1A;--pink:#ff6fb3;--violet:#a78bfa;--cyan:#00d1ff;--glass:rgba(255,255,255,.06)}
  *{box-sizing:border-box} html,body{height:100%}
  body{margin:0;font-family:Inter,system-ui,sans-serif;color:#fff;background:
    radial-gradient(1200px 800px at 8% 10%, rgba(255,111,179,.14), transparent 50%),
    radial-gradient(1100px 700px at 92% 20%, rgba(167,139,250,.12), transparent 55%),
    radial-gradient(1000px 700px at 50% 95%, rgba(0,209,255,.10), transparent 60%),#0B0A1A}
  .wrap{max-width:1200px;margin:0 auto;padding:28px}
  h1{margin:8px 0 18px;font-size:clamp(40px,10vw,96px);letter-spacing:-.02em;text-transform:uppercase;
     background:linear-gradient(90deg,var(--pink),var(--violet),var(--cyan));-webkit-background-clip:text;background-clip:text;color:transparent}
  .grid{display:grid;gap:26px;grid-template-columns:1fr} @media(min-width:960px){.grid{grid-template-columns:1fr 1fr}}
  .card{border:1px solid rgba(255,255,255,.12);border-radius:20px;background:var(--glass);backdrop-filter:blur(10px);overflow:hidden}
  .head{padding:16px 18px;font-weight:700}
  .player{position:relative;aspect-ratio:16/9;background:#000}
  .poster{position:absolute;inset:0;background-size:cover;background-position:center}
  .poster::after{content:"";position:absolute;inset:0;background:radial-gradient(75% 55% at 50% 50%, transparent 60%, rgba(0,0,0,.35))}
  .play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:90px;height:90px;border-radius:999px;
        background:linear-gradient(90deg,var(--violet),var(--pink));box-shadow:0 14px 40px rgba(0,0,0,.45);display:grid;place-items:center;cursor:pointer}
  .play svg{width:34px;height:34px;fill:#000}
  iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:none}
  .ctrls{position:absolute;left:12px;right:12px;bottom:10px;display:flex;gap:10px;align-items:center;opacity:0;transition:opacity .25s}
  .player:hover .ctrls{opacity:1}
  .btn{background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:8px 12px;font-size:.85rem;cursor:pointer;user-select:none}
  .prog{flex:1;height:6px;background:rgba(255,255,255,.18);border-radius:9999px;position:relative;cursor:pointer}
  .bar{position:absolute;left:0;top:0;bottom:0;width:0%;background:linear-gradient(90deg,var(--violet),var(--pink));border-radius:9999px}
</style>
</head>
<body oncontextmenu="return false">
  <div class="wrap">
    <h1>DanseFlix</h1>
    <div class="grid">
      <!-- Samedi -->
      <div class="card">
        <div class="head">Samedi — La Belle au bois dormant</div>
        <div class="player" data-yt="AI_UteIH42U">
          <div class="poster" style="background-image:url('https://img.youtube.com/vi/AI_UteIH42U/maxresdefault.jpg')"></div>
          <button class="play" aria-label="Lire">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <iframe allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
                  sandbox="allow-same-origin allow-scripts allow-presentation"></iframe>
          <div class="ctrls">
            <div class="btn js-toggle">Lecture</div>
            <div class="btn js-mute">Son</div>
            <div class="prog js-prog"><div class="bar"></div></div>
            <div class="btn js-full">Plein écran</div>
          </div>
        </div>
      </div>
      <!-- Dimanche -->
      <div class="card">
        <div class="head">Dimanche — La Belle au bois dormant</div>
        <div class="player" data-yt="Ky6x74z20N8">
          <div class="poster" style="background-image:url('https://img.youtube.com/vi/Ky6x74z20N8/maxresdefault.jpg')"></div>
          <button class="play" aria-label="Lire">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <iframe allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
                  sandbox="allow-same-origin allow-scripts allow-presentation"></iframe>
          <div class="ctrls">
            <div class="btn js-toggle">Lecture</div>
            <div class="btn js-mute">Son</div>
            <div class="prog js-prog"><div class="bar"></div></div>
            <div class="btn js-full">Plein écran</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- API YouTube -->
  <script src="https://www.youtube.com/iframe_api"></script>
  <script>
    const players = new Map();

    function mountPlayer(container, vid){
      const iframe = container.querySelector('iframe');
      const origin = location.origin;
      const params = new URLSearchParams({
        enablejsapi:'1', playsinline:'1', modestbranding:'1', rel:'0', iv_load_policy:'3',
        controls:'0', disablekb:'1', fs:'1', vq:'hd1080', origin
      });
      iframe.src = `https://www.youtube-nocookie.com/embed/${vid}?${params.toString()}`;
      iframe.style.display = 'block';
      container.querySelector('.poster')?.remove();
      container.querySelector('.play')?.remove();

      const player = new YT.Player(iframe, {
        events: { onReady: e => e.target.playVideo() }
      });
      players.set(container, player);

      // Custom controls
      const tgl = container.querySelector('.js-toggle');
      const mut = container.querySelector('.js-mute');
      const ful = container.querySelector('.js-full');
      const prg = container.querySelector('.js-prog');
      const bar = container.querySelector('.bar');

      function tick(){
        if (player && player.getDuration){
          const d = player.getDuration() || 0;
          const t = player.getCurrentTime ? player.getCurrentTime() : 0;
          bar.style.width = d ? ((t/d)*100).toFixed(2)+'%' : '0%';
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);

      tgl.onclick = () => {
        const st = player.getPlayerState();
        if (st === YT.PlayerState.PLAYING){ player.pauseVideo(); tgl.textContent='Lecture'; }
        else { player.playVideo(); tgl.textContent='Pause'; }
      };
      mut.onclick = () => {
        if (player.isMuted()){ player.unMute(); mut.textContent='Son'; }
        else { player.mute(); mut.textContent='Muet'; }
      };
      ful.onclick = () => { iframe.requestFullscreen && iframe.requestFullscreen(); };
      prg.onclick = (e) => {
        const r = prg.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
        const d = player.getDuration();
        if (d) player.seekTo(d*p, true);
      };
    }

    window.onYouTubeIframeAPIReady = () => {
      document.querySelectorAll('.player').forEach(box => {
        const id = box.getAttribute('data-yt');
        box.querySelector('.play').addEventListener('click', () => mountPlayer(box, id), { once:true });
      });
    };

    // blocage clic droit global (limite l'accès contextuel)
    document.addEventListener('contextmenu', e => e.preventDefault());
  </script>
</body>
</html>
