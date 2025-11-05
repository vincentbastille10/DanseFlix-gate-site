
# DanseFlix (protégé par email allowlist)

Ce projet Next.js protège l'accès via une liste blanche d'emails (CSV -> SHA-256) + cookie signé.

## Déploiement — garder **la même URL** `danseflix.vercel.app`

1. **Créer un nouveau repo GitHub** et pousser ce projet :
   ```bash
   npm i
   git init
   git add .
   git commit -m "DanseFlix sécurisé"
   git branch -M main
   git remote add origin https://github.com/<ton-user>/<ton-repo>.git
   git push -u origin main
   ```

2. **Dans Vercel**, ouvre le **projet existant** `danseflix` (celui qui a déjà l'URL `danseflix.vercel.app`).
   - Settings → **Git Integration** → **Link** ce projet Vercel au **nouveau repo** GitHub créé ci-dessus.
   - Framework Preset : **Next.js** (auto).
   - Ajouter la variable d'env **AUTH_SECRET** (Project Settings → Environment Variables). Valeur = longue chaîne aléatoire.

3. **Allowlist** : le fichier `lib/allowlist.json` est déjà rempli (hashes). Pour mettre à jour :
   ```bash
   node -e "const fs=require('fs');const crypto=require('crypto');const rows=fs.readFileSync('emails.csv','utf8').split(/\r?\n/).filter(Boolean);const emails=rows.map(l=>l.split(',')[0]).filter(Boolean).map(e=>e.trim().toLowerCase());const uniq=[...new Set(emails)];const hashes=uniq.map(e=>crypto.createHash('sha256').update(e).digest('hex'));fs.writeFileSync('lib/allowlist.json',JSON.stringify(hashes,null,2));console.log('ok:',hashes.length)"
   ```
   puis commit & push → Vercel redeploie automatiquement.

4. **Résultat** :
   - Sans cookie valide, redirection vers `/login`.
   - Email autorisé → cookie signé → accès à la page d'accueil (ton DanseFlix intégré).

> Note : on n'a **pas** besoin de `vercel.json` dans un projet Next.js avec middleware.
