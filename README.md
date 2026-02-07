# 🚀 MIGRATION LIVEKIT - 7 FICHIERS À REMPLACER

> **Version 2 - Bugs vidéo corrigés !**

---

## 📦 STRUCTURE DES FICHIERS

```
RACINE DU PROJET :
├── server.js                    ← REMPLACER ton fichier
├── package.json                 ← REMPLACER ton fichier
└── livekit-service.js           ← NOUVEAU fichier

public/ :
├── game.html                    ← REMPLACER ton fichier
├── video-tracks.js              ← REMPLACER ton fichier
├── video-briefing-ui.js         ← REMPLACER ton fichier (⚠️ IMPORTANT)
└── livekit-video.js             ← NOUVEAU fichier
```

**2 fichiers à ajouter (nouveaux) :**
- `livekit-service.js` → à la racine
- `public/livekit-video.js` → dans public/

**5 fichiers à remplacer :**
- `server.js`
- `package.json`
- `public/game.html`
- `public/video-tracks.js`
- `public/video-briefing-ui.js` ← **⚠️ AJOUTÉ dans V2**

---

## 🐛 CORRECTIONS V2

### Bug 1 : server.js ligne 8464 ✅
**Problème** : SyntaxError objet `result` mal fermé  
**Correction** : Objet `result` complété avec propriété `replicate`

### Bug 2 : video-briefing-ui.js ✅
**Problème** : `TypeError: Failed to construct 'MediaStream'`  
**Cause** : Incompatibilité tracks LiveKit  
**Correction** : Utilisation du helper `getMediaStreamFromTrack()` (2 occurrences)

### Bug 3 : video-tracks.js ✅
**Amélioration** : Helper rendu global avec `window.getMediaStreamFromTrack`

---

## ⚡ DÉPLOIEMENT (10 min)

### 1️⃣ Créer compte LiveKit Cloud (5 min)

1. Va sur **https://cloud.livekit.io**
2. Sign Up (gratuit, pas de CB)
3. Créer un projet : `saboteur`
4. **Noter ces 3 valeurs** :
   ```
   API Key:        APIxxxxxxxx
   API Secret:     xxxxxxxxxxxxxxxxxxxxxxxx
   WebSocket URL:  wss://saboteur-xxxxxx.livekit.cloud
   ```

---

### 2️⃣ Configurer Render (2 min)

Sur **Render.com** → Dashboard → Ton service → Environment :

**Ajouter ces 3 variables :**

```bash
LIVEKIT_API_KEY=APIxxxxxxxx
LIVEKIT_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
LIVEKIT_URL=wss://saboteur-xxxxxx.livekit.cloud
```

> ⚠️ **NE PAS supprimer** `DAILY_API_KEY` (pour rollback si besoin)

---

### 3️⃣ Remplacer les fichiers (3 min)

**RACINE :**
1. Remplace `server.js`
2. Remplace `package.json`
3. Ajoute `livekit-service.js`

**public/ :**
1. Remplace `game.html`
2. Remplace `video-tracks.js`
3. Remplace `video-briefing-ui.js` ← **⚠️ NE PAS OUBLIER**
4. Ajoute `livekit-video.js`

```bash
git add .
git commit -m "Migration LiveKit V2 - Bugs corrigés"
git push
```

---

## ✅ VÉRIFICATION

### Logs Render
```
[LiveKit] ✅ Service initialized
```

### Tests avec 4 joueurs

**PHASE NUIT :**
- ✅ Saboteurs se voient
- ✅ Innocents voient "😴 Phase privée"
- ✅ Vidéo fonctionne sans erreur MediaStream

**PHASE JOUR :**
- ✅ Tout le monde se voit

---

## 💰 ÉCONOMIES

| Parties/mois | Daily.co | LiveKit | Économie |
|--------------|----------|---------|----------|
| 500 | ~400€ | **0€** | **400€/mois** |
| 1000 | ~800€ | **~25€** | **775€/mois** |

---

## 🔄 ROLLBACK

1. Render → Supprimer `LIVEKIT_*`
2. Redéployer
3. ✅ Retour à Daily

---

## 🎯 RÉSUMÉ RAPIDE

```bash
# 1. LiveKit Cloud
https://cloud.livekit.io → noter credentials

# 2. Render Variables
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...
LIVEKIT_URL=wss://...

# 3. Remplacer 7 fichiers
RACINE: server.js, package.json, livekit-service.js
public/: game.html, video-tracks.js, video-briefing-ui.js, livekit-video.js

# 4. Push
git add . && git commit -m "LiveKit V2" && git push

# 5. Tester
✅ 4 joueurs + phases privées
```

---

**🎉 Version 2 - Prêt à déployer !**

Créé le 6 février 2026 - Saboteur / RORONOA GAMES  
Migration Daily.co → LiveKit V2 (bugs vidéo corrigés)
