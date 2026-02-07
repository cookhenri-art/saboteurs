/* =========================================================
   D4 BRIEFING MODE - Inline video thumbnails per player (Daily CallObject)
   - NO Daily floating UI
   - Attach video tracks into .player-video-slot[data-player-id]
   - Attach audio tracks for conference sound
   - Re-attach if players list re-renders
   - Active speaker highlight (.is-speaking on .player-item)
   - D4: Integration with VideoModeController and BriefingUI
   - D4 v5.4: Manual mute state preservation
========================================================= */
(function () {
  "use strict";

  // V41: Debug conditionnel - activer avec ?debug=true dans l'URL
  const DEBUG = window.SABOTEUR_DEBUG || false;

  const peerToPlayerId = new Map();  // session_id/peerId -> playerId
  const videoTracks = new Map();     // playerId -> MediaStreamTrack
  const audioTracks = new Map();     // playerId -> MediaStreamTrack
  const videoEls = new Map();        // playerId -> <video>
  const audioEls = new Map();        // playerId -> <audio>
  let currentSpeaking = null;
  let bound = false;
  
  // D4 v5.4: État manuel du mute (prioritaire sur les permissions serveur)
  let userMutedAudio = false;  // L'utilisateur a manuellement coupé son micro
  let userMutedVideo = false;  // L'utilisateur a manuellement coupé sa caméra
  let lastManualMuteTime = 0;  // Timestamp du dernier mute manuel

  function log(...args) { if (DEBUG) console.log("[VideoTracks]", ...args); }
  /**
   * Helper: extraire un MediaStream depuis une track (Daily ou LiveKit)
   * - Daily:   track est un MediaStreamTrack natif → new MediaStream([track])
   * - LiveKit: track a ._liveKitTrack (objet LiveKit) → .attach() retourne un élément avec .srcObject
   * 
   * LIVEKIT FIX: Utiliser track._element si déjà créé pour éviter les appels multiples à attach()
   */
  function getMediaStreamFromTrack(track) {
    // LiveKit: objet avec _liveKitTrack
    if (track && track._liveKitTrack) {
      try {
        // LIVEKIT FIX: Préférer l'élément déjà créé par livekit-video.js
        if (track._element && track._element.srcObject) {
          return track._element.srcObject;
        }
        
        const el = track._liveKitTrack.attach();
        if (el && el.srcObject) {
          return el.srcObject;
        }
        // Fallback: la track LiveKit expose .mediaStreamTrack
        if (track._liveKitTrack.mediaStreamTrack) {
          return new MediaStream([track._liveKitTrack.mediaStreamTrack]);
        }
      } catch (e) {
        console.warn('[VideoTracks] LiveKit track attach error:', e);
      }
    }
    
    // Daily: MediaStreamTrack natif
    if (track instanceof MediaStreamTrack) {
      return new MediaStream([track]);
    }
    
    // Fallback
    try {
      return new MediaStream([track]);
    } catch (e) {
      console.warn('[VideoTracks] Cannot create MediaStream from track:', e);
      return null;
    }
  }

  // Rendre le helper accessible globalement pour video-briefing-ui.js
  window.getMediaStreamFromTrack = getMediaStreamFromTrack;

  // D6: Définir showMuteToast ici car video-tracks.js est chargé avant video-briefing-ui.js
  function showMuteToast(isMuted) {
    // Supprimer toast existant
    const existing = document.querySelector('.mute-toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'mute-toast';
    toast.textContent = isMuted ? '🔇 Micro coupé' : '🎤 Micro activé';
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: ${isMuted ? '#ff4444' : '#00cc88'};
      color: white;
      padding: 12px 24px;
      border-radius: 25px;
      font-weight: bold;
      z-index: 10000;
      animation: toastSlide 0.3s ease;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }
  // D6: Exposer globalement
  window.showMuteToast = showMuteToast;

  // D4 v5.4: Exposer les fonctions de contrôle manuel
  window.VideoTracksRegistry = {
    getAll: () => new Map(videoTracks),
    get: (playerId) => videoTracks.get(playerId),
    has: (playerId) => videoTracks.has(playerId),
    getAudio: (playerId) => audioTracks.get(playerId),
    // Nouvelles fonctions pour le mute manuel
    setUserMutedAudio: (muted) => {
      userMutedAudio = muted;
      lastManualMuteTime = Date.now();
      log("User manually set audio mute:", muted);
    },
    setUserMutedVideo: (muted) => {
      userMutedVideo = muted;
      lastManualMuteTime = Date.now();
      log("User manually set video mute:", muted);
    },
    getUserMutedAudio: () => userMutedAudio,
    getUserMutedVideo: () => userMutedVideo,
    // Réinitialiser le mute manuel (pour les changements de phase importants)
    resetManualMute: () => {
      userMutedAudio = false;
      userMutedVideo = false;
      lastManualMuteTime = 0;
      log("Manual mute state reset");
    },
    // D5: Fonction de nettoyage global pour libérer les ressources
    cleanupUnusedResources: () => {
      cleanupUnusedMediaElements();
    },
    // D11: Fonction de réparation de l'affichage du lobby
    repairLobbyDisplay: () => {
      log("D11: Repairing lobby display...");
      
      // D11: Supprimer inlineVideoBar qui ne devrait pas exister dans le lobby
      const inlineBar = document.getElementById('inlineVideoBar');
      if (inlineBar) {
        log("D11: Removing inlineVideoBar during repair");
        inlineBar.remove();
      }
      
      const playersList = document.getElementById('playersList');
      if (playersList) {
        // D11: Supprimer les éléments orphelins (slots vidéo en dehors de player-left)
        playersList.querySelectorAll('.player-video-slot').forEach(slot => {
          const parent = slot.parentElement;
          if (!parent || !parent.classList.contains('player-left')) {
            log("D11: Removing orphan video slot");
            slot.remove();
          }
        });
        
        // D11: Forcer l'affichage des player-info
        playersList.querySelectorAll('.player-info').forEach(info => {
          info.style.display = 'flex';
          info.style.visibility = 'visible';
          info.style.opacity = '1';
          info.style.flexDirection = 'column';
          void info.offsetHeight;
        });
        playersList.querySelectorAll('.player-left').forEach(left => {
          left.style.display = 'flex';
          left.style.gap = '10px';
          left.style.alignItems = 'center';
          left.style.flexDirection = 'row';
          void left.offsetHeight;
        });
        playersList.querySelectorAll('.player-name').forEach(name => {
          name.style.display = 'flex';
          name.style.visibility = 'visible';
          void name.offsetHeight;
        });
        
        log("D11: Lobby display repaired, triggering video refresh");
      }
      
      // D11: Forcer le réattachement des vidéos via l'API publique
      if (window.VideoTracksRefresh) {
        setTimeout(() => window.VideoTracksRefresh(), 100);
      }
    },
    // D5: Stats pour debug
    getStats: () => ({
      videoTracks: videoTracks.size,
      audioTracks: audioTracks.size,
      videoEls: videoEls.size,
      audioEls: audioEls.size,
      peerMappings: peerToPlayerId.size
    })
  };
  
  // D5: Constante pour limiter le nombre de WebMediaPlayers
  const MAX_VIDEO_ELEMENTS = 12;
  const MAX_AUDIO_ELEMENTS = 15;
  
  // D5: Fonction de nettoyage des éléments média inutilisés
  function cleanupUnusedMediaElements() {
    const state = window.lastKnownState;
    if (!state || !state.players) return;
    
    // Liste des playerIds actifs (vivants et dans la room)
    const activePlayerIds = new Set(
      state.players
        .filter(p => p.status === 'alive' || p.alive !== false)
        .map(p => p.playerId)
    );
    
    log("🧹 Cleanup: active players:", activePlayerIds.size, "video elements:", videoEls.size);
    
    // Nettoyer les vidéos des joueurs qui ne sont plus actifs
    for (const [pid, videoEl] of videoEls.entries()) {
      if (!activePlayerIds.has(pid)) {
        log("🧹 Removing video element for inactive player:", pid);
        videoEl.srcObject = null;
        videoEl.load();
        if (videoEl.parentNode) {
          videoEl.parentNode.removeChild(videoEl);
        }
        videoEls.delete(pid);
        videoTracks.delete(pid);
      }
    }
    
    // Nettoyer les audios des joueurs qui ne sont plus actifs
    for (const [pid, audioEl] of audioEls.entries()) {
      if (!activePlayerIds.has(pid)) {
        log("🧹 Removing audio element for inactive player:", pid);
        audioEl.srcObject = null;
        audioEl.load();
        audioEl.remove();
        audioEls.delete(pid);
        audioTracks.delete(pid);
      }
    }
    
    // Si on dépasse encore la limite, garder seulement les N premiers
    if (videoEls.size > MAX_VIDEO_ELEMENTS) {
      log("⚠️ Too many video elements:", videoEls.size, "- limiting to", MAX_VIDEO_ELEMENTS);
      const entries = Array.from(videoEls.entries());
      const toRemove = entries.slice(MAX_VIDEO_ELEMENTS);
      for (const [pid, videoEl] of toRemove) {
        videoEl.srcObject = null;
        videoEl.load();
        if (videoEl.parentNode) {
          videoEl.parentNode.removeChild(videoEl);
        }
        videoEls.delete(pid);
        videoTracks.delete(pid);
        log("🧹 Force removed excess video:", pid);
      }
    }
    
    log("🧹 Cleanup complete. Videos:", videoEls.size, "Audios:", audioEls.size);
  }

  function parsePlayerIdFromUserName(userName) {
    if (!userName) return "";
    const idx = userName.lastIndexOf("#");
    if (idx === -1) return "";
    return userName.slice(idx + 1).trim();
  }

  function getLocalPlayerId() {
    // Prefer lastKnownState, then window.playerId (debug), then empty
    const st = window.lastKnownState;
    return st?.you?.playerId || window.playerId || "";
  }

  function getSlot(playerId) {
    if (!playerId) return null;
    
    // D6 V2.1: Vérifier si le lobby est ACTIF
    const lobbyScreen = document.getElementById('lobbyScreen');
    const gameScreen = document.getElementById('gameScreen');
    const isLobbyActive = lobbyScreen && lobbyScreen.classList.contains('active');
    const isGameActive = gameScreen && gameScreen.classList.contains('active');
    
    // V41: Log uniquement si DEBUG actif et pas trop verbeux
    if (DEBUG && window.SABOTEUR_DEBUG_VERBOSE) {
      log("getSlot check:", playerId.slice(0,8), "isLobbyActive:", isLobbyActive, "isGameActive:", isGameActive);
    }
    
    // Si le lobby est actif, TOUJOURS utiliser les slots du lobby
    if (isLobbyActive) {
      // D6 V2.1: Supprimer inlineVideoBar quand on est dans le lobby
      const inlineBar = document.getElementById('inlineVideoBar');
      if (inlineBar) {
        log("Removing inlineVideoBar (we're in lobby)");
        inlineBar.remove();
      }
      
      // D6 V2.1: Chercher SEULEMENT dans le playersList du lobby
      const playersList = document.getElementById('playersList');
      if (playersList) {
        let slot = playersList.querySelector(`.player-video-slot[data-player-id="${CSS.escape(playerId)}"]`);
        if (slot) {
          log("Using lobby slot for:", playerId.slice(0,8));
          return slot;
        }
      }
      // Pas de slot trouvé - le joueur n'est peut-être pas encore dans la liste
      log("No lobby slot found for:", playerId.slice(0,8));
      return null;
    }
    
    // Si on est dans le gameScreen, utiliser les slots du gameScreen
    if (isGameActive) {
      return ensureGameScreenSlot(playerId);
    }
    
    // Fallback: chercher n'importe quel slot
    let slot = document.querySelector(`.player-video-slot[data-player-id="${CSS.escape(playerId)}"]`);
    if (slot) return slot;
    
    return null;
  }
  
  // D4: Créer les slots vidéo dans le gameScreen quand le lobby est caché
  function ensureGameScreenSlot(playerId) {
    if (!playerId) return null;
    
    // V11: Mode SPLIT/MAX actif = pas de slots inline du tout
    // Les vidéos sont gérées uniquement par le briefing UI
    const controller = window.VideoModeController;
    const currentMode = controller?.getState?.()?.currentMode;
    
    // En mode SPLIT ou ADVANCED_FOCUS, ne rien créer
    if (currentMode === 'SPLIT' || currentMode === 'ADVANCED_FOCUS') {
      // Supprimer la barre inline si elle existe
      const existingBar = document.getElementById('inlineVideoBar');
      if (existingBar) {
        existingBar.remove();
        log("Removed inlineVideoBar (SPLIT/MAX mode)");
      }
      return null;
    }
    
    // V11: Ne plus créer de barre inline avec vidéos
    // Retourner null pour tous les modes
    return null;
  }

  function getPlayerRow(playerId) {
    if (!playerId) return null;
    return document.querySelector(`.player-item[data-player-id="${CSS.escape(playerId)}"]`);
  }

  function ensureVideoEl(playerId, isLocal) {
    if (videoEls.has(playerId)) return videoEls.get(playerId);
    
    // D5: Check si on approche de la limite de WebMediaPlayers
    if (videoEls.size >= MAX_VIDEO_ELEMENTS) {
      log("⚠️ Approaching video element limit, running cleanup...");
      cleanupUnusedMediaElements();
    }
    
    // Si toujours au-dessus de la limite après cleanup, ne pas créer
    if (videoEls.size >= MAX_VIDEO_ELEMENTS) {
      log("❌ Cannot create video element - limit reached:", MAX_VIDEO_ELEMENTS);
      return null;
    }
    
    const v = document.createElement("video");
    v.className = "player-video"; // D4: Classe pour le CSS
    v.autoplay = true;
    v.playsInline = true;
    v.muted = true; // ALWAYS muted - audio is handled separately
    v.setAttribute("webkit-playsinline", "true");
    // Styles inline en backup du CSS
    v.style.width = "100%";
    v.style.height = "100%";
    v.style.objectFit = "cover";
    v.style.display = "block";
    videoEls.set(playerId, v);
    log("📹 Created video element for:", playerId, "Total:", videoEls.size);
    return v;
  }

  // D4: Create audio element for a remote participant
  function ensureAudioEl(playerId) {
    if (audioEls.has(playerId)) return audioEls.get(playerId);
    
    // D5: Check limite audio
    if (audioEls.size >= MAX_AUDIO_ELEMENTS) {
      log("⚠️ Approaching audio element limit, running cleanup...");
      cleanupUnusedMediaElements();
    }
    
    if (audioEls.size >= MAX_AUDIO_ELEMENTS) {
      log("❌ Cannot create audio element - limit reached:", MAX_AUDIO_ELEMENTS);
      return null;
    }
    
    const a = document.createElement("audio");
    a.autoplay = true;
    a.id = `d4-audio-${playerId}`;
    // Hidden but functional
    a.style.cssText = "position:absolute;left:-9999px;";
    document.body.appendChild(a);
    audioEls.set(playerId, a);
    log("Created audio element for:", playerId);
    return a;
  }

  // D4 v5.5: Vérifier si on a le droit de voir/entendre ce joueur selon les permissions de phase
  function canReceiveFromPlayer(playerId) {
    const state = window.lastKnownState;
    if (!state) return true; // Par défaut, autoriser
    
    const myId = getLocalPlayerId();
    const phase = state.phase;
    
    // D4 v5.6: Vérifier d'abord si on est dans une phase privée où on n'est PAS concerné
    const privateStatus = getPrivatePhaseStatus(state, myId);
    
    if (privateStatus.isPrivate && !privateStatus.iAmInvolved) {
      // On est en phase privée et on n'est pas concerné - bloquer TOUT
      log("🔒 Private phase, I'm not involved, blocking:", playerId);
      return false;
    }
    
    if (privateStatus.isPrivate && privateStatus.iAmInvolved) {
      // On est en phase privée ET on est concerné - vérifier si l'autre est concerné
      if (!privateStatus.allowedPlayerIds.includes(playerId)) {
        log("🔒 Private phase, other player not in my group, blocking:", playerId);
        return false;
      }
    }
    
    // Vérifications classiques basées sur les permissions
    const myPermissions = state.videoPermissions?.[myId];
    const theirPermissions = state.videoPermissions?.[playerId];
    
    // Si pas de permissions définies, utiliser la logique de phase
    if (!myPermissions || !theirPermissions) return true;
    
    // Si je n'ai pas le droit d'avoir vidéo/audio, je suis en mode "isolé"
    if (!myPermissions.video && !myPermissions.audio) {
      log("🔒 I'm in silent mode (permissions), blocking receive from:", playerId);
      return false;
    }
    
    // Si l'autre n'a pas le droit d'émettre, ne pas le recevoir
    if (!theirPermissions.video && !theirPermissions.audio) {
      log("🔒 Player in silent mode (permissions), blocking receive:", playerId);
      return false;
    }
    
    return true;
  }
  
  // D4 v5.6: Déterminer le statut de phase privée
  function getPrivatePhaseStatus(state, myId) {
    const result = {
      isPrivate: false,
      iAmInvolved: false,
      allowedPlayerIds: [],
      message: ""
    };
    
    if (!state || !state.phase) return result;
    
    const phase = state.phase;
    const myPlayer = state.players?.find(p => p.playerId === myId);
    const phaseData = state.phaseData || {};
    
    // V35: Helper pour les traductions des messages overlay
    const tr = (key, fallback) => {
      if (typeof window.i18n === 'function') {
        const result = window.i18n(key);
        if (result && result !== key) return result;
      }
      return fallback;
    };
    
    // V35: NIGHT_CHAMELEON - Caméléon seul voit son écran
    if (phase === 'NIGHT_CHAMELEON') {
      result.isPrivate = true;
      const chameleonName = window.tRole ? window.tRole('chameleon') : 'Caméléon';
      result.message = tr('overlay.chameleon', `🔒 ${chameleonName} fait son choix...`).replace('{role}', chameleonName);
      
      if (phaseData.actorId) {
        result.allowedPlayerIds = [phaseData.actorId];
        result.iAmInvolved = (myId === phaseData.actorId);
      } else {
        // Fallback: chercher le caméléon
        const chameleon = state.players?.find(p => p.role === 'chameleon' && p.status === 'alive');
        if (chameleon) {
          result.allowedPlayerIds = [chameleon.playerId];
          result.iAmInvolved = (myId === chameleon.playerId);
        }
      }
      log("NIGHT_CHAMELEON check: myId=", myId, "involved=", result.iAmInvolved);
      return result;
    }
    
    // V35: NIGHT_RADAR - Officier radar seul voit son écran
    if (phase === 'NIGHT_RADAR') {
      result.isPrivate = true;
      const radarName = window.tRole ? window.tRole('radar') : 'Officier Radar';
      result.message = tr('overlay.radar', `🔒 ${radarName} scanne la zone...`).replace('{role}', radarName);
      
      if (phaseData.actorId) {
        result.allowedPlayerIds = [phaseData.actorId];
        result.iAmInvolved = (myId === phaseData.actorId);
      } else {
        // Fallback: chercher le radar
        const radar = state.players?.find(p => p.role === 'radar' && p.status === 'alive');
        if (radar) {
          result.allowedPlayerIds = [radar.playerId];
          result.iAmInvolved = (myId === radar.playerId);
        }
      }
      log("NIGHT_RADAR check: myId=", myId, "involved=", result.iAmInvolved);
      return result;
    }
    
    // V35: NIGHT_DOCTOR - Médecin seul voit son écran
    if (phase === 'NIGHT_DOCTOR') {
      result.isPrivate = true;
      const doctorName = window.tRole ? window.tRole('doctor') : 'Médecin';
      result.message = tr('overlay.doctor', `🔒 ${doctorName} choisit qui protéger...`).replace('{role}', doctorName);
      
      if (phaseData.actorId) {
        result.allowedPlayerIds = [phaseData.actorId];
        result.iAmInvolved = (myId === phaseData.actorId);
      } else {
        // Fallback: chercher le médecin
        const doctor = state.players?.find(p => p.role === 'doctor' && p.status === 'alive');
        if (doctor) {
          result.allowedPlayerIds = [doctor.playerId];
          result.iAmInvolved = (myId === doctor.playerId);
        }
      }
      log("NIGHT_DOCTOR check: myId=", myId, "involved=", result.iAmInvolved);
      return result;
    }
    
    // V35: NIGHT_SECURITY - Agent sécurité seul (pour revenge éventuelle)
    if (phase === 'NIGHT_SECURITY' || phase === 'REVENGE') {
      result.isPrivate = true;
      const securityName = window.tRole ? window.tRole('security') : 'Agent Sécurité';
      result.message = tr('overlay.security', `🔒 ${securityName} agit...`).replace('{role}', securityName);
      
      if (phaseData.actorId) {
        result.allowedPlayerIds = [phaseData.actorId];
        result.iAmInvolved = (myId === phaseData.actorId);
      } else {
        // Fallback: chercher l'agent sécurité
        const security = state.players?.find(p => p.role === 'security' && p.status === 'alive');
        if (security) {
          result.allowedPlayerIds = [security.playerId];
          result.iAmInvolved = (myId === security.playerId);
        }
      }
      log("NIGHT_SECURITY/REVENGE check: myId=", myId, "involved=", result.iAmInvolved);
      return result;
    }
    
    // V35: NIGHT_START - Tout le monde en overlay pendant la transition
    if (phase === 'NIGHT_START') {
      result.isPrivate = true;
      result.message = tr('overlay.nightStart', `🌙 La nuit tombe sur la station...`);
      result.iAmInvolved = false; // Personne ne voit/entend pendant la transition
      result.allowedPlayerIds = [];
      log("NIGHT_START: everyone in private overlay");
      return result;
    }
    
    // NIGHT_AI_EXCHANGE : phase privée Agent IA + partenaire lié
    if (phase === 'NIGHT_AI_EXCHANGE') {
      result.isPrivate = true;
      // D11: Utiliser la traduction dynamique du rôle
      const aiAgentName = window.tRole ? window.tRole('ai_agent') : 'Agent IA';
      result.message = tr('overlay.aiExchange', `🔒 Échange ${aiAgentName} privé en cours...`).replace('{role}', aiAgentName);
      
      // D4 v5.7: Utiliser phaseData qui contient iaId et partnerId
      const iaId = phaseData.iaId;
      const partnerId = phaseData.partnerId;
      
      if (iaId && partnerId) {
        result.allowedPlayerIds = [iaId, partnerId];
        result.iAmInvolved = (myId === iaId || myId === partnerId);
        log("NIGHT_AI_EXCHANGE check: myId=", myId, "iaId=", iaId, "partnerId=", partnerId, "involved=", result.iAmInvolved);
      } else {
        // Fallback: chercher via linkedTo
        const iaPlayer = state.players?.find(p => p.role === 'ai_agent' && p.status === 'alive');
        if (iaPlayer) {
          const fallbackIaId = iaPlayer.playerId;
          const fallbackLinkedId = iaPlayer.linkedTo;
          result.allowedPlayerIds = [fallbackIaId, fallbackLinkedId].filter(Boolean);
          result.iAmInvolved = (myId === fallbackIaId || myId === fallbackLinkedId);
          log("NIGHT_AI_EXCHANGE fallback: myId=", myId, "iaId=", fallbackIaId, "linkedTo=", fallbackLinkedId, "involved=", result.iAmInvolved);
        }
        
        // Double fallback: vérifier si MOI j'ai linkedTo (le partenaire a aussi linkedTo)
        if (!result.iAmInvolved && myPlayer?.linkedTo) {
          result.iAmInvolved = true;
          result.allowedPlayerIds.push(myId);
          log("NIGHT_AI_EXCHANGE double fallback: I have linkedTo, so I'm involved");
        }
      }
      return result;
    }
    
    // NIGHT_SABOTEURS : phase privée saboteurs entre eux
    if (phase === 'NIGHT_SABOTEURS') {
      result.isPrivate = true;
      // D11: Utiliser la traduction dynamique
      const saboName = window.t ? window.t('saboteurs') : 'saboteurs';
      result.message = tr('overlay.saboteurs', `🔒 Les ${saboName.toLowerCase()} communiquent...`).replace('{team}', saboName.toLowerCase());
      
      // D4 v5.7: Utiliser phaseData.actorIds
      if (phaseData.actorIds && phaseData.actorIds.length > 0) {
        result.allowedPlayerIds = phaseData.actorIds;
        result.iAmInvolved = phaseData.actorIds.includes(myId);
        log("NIGHT_SABOTEURS check: myId=", myId, "actorIds=", phaseData.actorIds, "involved=", result.iAmInvolved);
      } else {
        // Fallback: chercher tous les saboteurs
        const saboteurs = state.players?.filter(p => p.role === 'saboteur' && p.status === 'alive') || [];
        result.allowedPlayerIds = saboteurs.map(p => p.playerId);
        result.iAmInvolved = myPlayer?.role === 'saboteur';
        log("NIGHT_SABOTEURS fallback: role check, involved=", result.iAmInvolved);
      }
      
      return result;
    }
    
    // NIGHT_AI_AGENT : Agent IA choisit (pas de visio pour les autres)
    if (phase === 'NIGHT_AI_AGENT') {
      result.isPrivate = true;
      // D11: Utiliser la traduction dynamique du rôle
      const aiAgentName = window.tRole ? window.tRole('ai_agent') : 'Agent IA';
      result.message = tr('overlay.aiAgent', `🔒 ${aiAgentName} choisit son partenaire...`).replace('{role}', aiAgentName);
      
      const iaPlayer = state.players?.find(p => p.role === 'ai_agent' && p.status === 'alive');
      if (iaPlayer) {
        result.allowedPlayerIds = [iaPlayer.playerId];
        result.iAmInvolved = (myId === iaPlayer.playerId);
      }
      return result;
    }
    
    return result;
  }
  
  // D4 v5.6: Exposer le statut de phase privée pour l'UI
  window.getPrivatePhaseStatus = function() {
    const state = window.lastKnownState;
    const myId = getLocalPlayerId();
    return getPrivatePhaseStatus(state, myId);
  };

  function attachTrackToPlayer(playerId, track, isLocal) {
    if (!playerId || !track) return;
    
    // D4 v5.5: Vérifier les permissions avant d'attacher
    if (!isLocal && !canReceiveFromPlayer(playerId)) {
      log("🚫 Blocked video track from:", playerId, "(permissions)");
      return;
    }
    
    // V41 FIX: Vérifier si cette track est déjà attachée (évite AbortError)
    const existingVideo = videoEls.get(playerId);
    if (existingVideo && existingVideo.srcObject) {
      const existingTracks = existingVideo.srcObject.getVideoTracks();
      const trackId = track.mediaStreamTrack?.id || track._liveKitTrack?.mediaStreamTrack?.id || track.id;
      if (existingTracks.length > 0 && existingTracks[0].id === trackId) {
        // Track déjà attachée, ne rien faire
        return;
      }
    }
    
    const slot = getSlot(playerId);
    if (!slot) {
      log("No slot found for player:", playerId);
      // Debug: lister tous les slots disponibles
      const allSlots = document.querySelectorAll('.player-video-slot');
      log("Available slots:", allSlots.length, Array.from(allSlots).map(s => s.dataset.playerId));
      return;
    }
    
    // V41 FIX: Ne pas attacher si le slot n'est pas visible (dimensions 0x0)
    const rect = slot.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      // Le slot n'est pas encore rendu, reporter l'attachement
      if (!slot._pendingAttach) {
        slot._pendingAttach = true;
        setTimeout(() => {
          slot._pendingAttach = false;
          attachTrackToPlayer(playerId, track, isLocal);
        }, 100);
      }
      return;
    }
    
    // D11: Vérifier que le slot est bien un conteneur dédié et pas le player-left
    if (slot.classList.contains('player-left')) {
      log("ERROR: slot is player-left, not video-slot!", playerId);
      return;
    }

    let v;
    let stream;
    
    // LIVEKIT FIX: Utiliser track.attach() si c'est une track LiveKit
    if (typeof track.attach === 'function') {
      log("LIVEKIT: Using track.attach() for:", playerId.slice(0,8));
      v = track.attach();
      v.muted = isLocal; // Mute local to avoid echo
      videoEls.set(playerId, v);
    } else {
      // Fallback: méthode classique
      v = ensureVideoEl(playerId, isLocal);
      stream = getMediaStreamFromTrack(track);
      if (stream) {
        try { v.srcObject = stream; } catch { v.src = URL.createObjectURL(stream); }
      } else {
        log("⚠️ Cannot get stream from track for:", playerId);
      }
    }

    if (!slot.contains(v)) {
      slot.innerHTML = "";
      slot.appendChild(v);
    }
    
    // D11: Après attachement, s'assurer que le sibling player-info est visible
    const playerLeft = slot.parentElement;
    if (playerLeft && playerLeft.classList.contains('player-left')) {
      const playerInfo = playerLeft.querySelector('.player-info');
      if (playerInfo) {
        playerInfo.style.display = 'flex';
        playerInfo.style.visibility = 'visible';
        playerInfo.style.opacity = '1';
      }
    }
    
    // D6: Vérifier si le joueur est mort via lastKnownState
    const state = window.lastKnownState;
    const player = state?.players?.find(p => p.playerId === playerId);
    const isEliminated = player?.status === 'dead' || player?.status === 'left';
    
    // GAME_OVER FIX: Ne pas griser les morts en fin de partie
    const isGameOver = state?.phase === 'GAME_OVER';
    const shouldGray = isEliminated && !isGameOver;
    
    // D4: Forcer les styles inline pour s'assurer de la visibilité
    // D6: Ajouter grayscale SEULEMENT si joueur mort ET pas en GAME_OVER
    // V11: Ne plus forcer 64px - laisser le CSS gérer la taille
    const grayFilter = shouldGray ? 'filter:grayscale(100%) brightness(0.5)!important;opacity:0.6!important;' : '';
    const borderColor = shouldGray ? '#666' : '#00ffff';
    // V11: Garder juste le border et le grayFilter, pas la taille forcée
    slot.style.borderColor = borderColor;
    if (grayFilter) {
      slot.style.cssText += grayFilter;
    }
    v.style.cssText = "width:100%!important;height:100%!important;object-fit:cover!important;display:block!important;" + grayFilter;
    
    log("Video attached to slot for:", playerId.slice(0,8), "slot size:", rect.width + "x" + rect.height, isEliminated ? "(ELIMINATED)" : "", isGameOver ? "(GAME_OVER - no gray)" : "");
    
    // V41 FIX: Ne pas appeler play() si la vidéo joue déjà (évite AbortError)
    if (v.paused || v.ended) {
      v.play().catch(e => {
        // V41: Les AbortError sont normales si on change de source rapidement
        if (e.name !== 'AbortError') {
          log("Video play error:", e.message || e);
        }
      });
    }
  }

  // D4: Attach audio track for a remote participant
  function attachAudioTrack(playerId, track, isLocal) {
    if (!playerId || !track) return;
    
    // Don't play our own audio (echo)
    if (isLocal) {
      log("Skipping local audio for:", playerId);
      return;
    }
    
    // D4 v5.5: Vérifier les permissions avant d'attacher l'audio
    if (!canReceiveFromPlayer(playerId)) {
      log("🚫 Blocked audio track from:", playerId, "(permissions)");
      // S'assurer qu'on n'a pas d'audio résiduel
      const existingAudio = audioEls.get(playerId);
      if (existingAudio) {
        existingAudio.pause();
        existingAudio.srcObject = null;
      }
      return;
    }
    
    let a;
    
    // LIVEKIT FIX: Utiliser track.attach() si c'est une track LiveKit
    if (typeof track.attach === 'function') {
      log("LIVEKIT: Using track.attach() for audio:", playerId.slice(0,8));
      a = track.attach();
      a.id = `audio-${playerId}`;
      audioEls.set(playerId, a);
      
      // S'assurer que l'élément est dans le DOM
      if (!document.body.contains(a)) {
        document.body.appendChild(a);
      }
      
      a.play().then(() => {
        log("LIVEKIT: Audio playing for:", playerId.slice(0,8));
      }).catch(e => {
        log("LIVEKIT: Audio play error for", playerId.slice(0,8), ":", e.message);
      });
      return;
    }
    
    // Fallback: méthode classique
    a = ensureAudioEl(playerId);
    const stream = getMediaStreamFromTrack(track);
    if (!stream) { log("⚠️ Cannot get audio stream for:", playerId); return; }
    try { 
      a.srcObject = stream;
      a.play().then(() => {
        log("Audio playing for:", playerId);
      }).catch(e => {
        log("Audio play error for", playerId, ":", e);
      });
    } catch (e) {
      log("Error attaching audio for", playerId, ":", e);
    }
  }

  // D11 V9: Debounce pour éviter les appels en cascade
  let reattachTimeout = null;
  let reattachPending = false;
  
  function reattachAllDebounced() {
    // D11 V10: Ne pas exécuter si renderLobby est en cours
    if (window._renderingLobby) {
      log("⏸️ Skipping reattach - renderLobby in progress");
      return;
    }
    
    if (reattachTimeout) {
      reattachPending = true;
      return;
    }
    
    reattachAllImmediate();
    
    reattachTimeout = setTimeout(() => {
      reattachTimeout = null;
      if (reattachPending && !window._renderingLobby) {
        reattachPending = false;
        reattachAllImmediate();
      }
    }, 200); // 200ms debounce
  }

  function reattachAllImmediate() {
    // D11 V18: Ne rien faire si le lobby est en cours de reconstruction
    if (window._lobbyRebuildInProgress) {
      log("V18: ⏳ Skipping reattach - lobby rebuild in progress");
      return;
    }
    
    log("Reattaching all tracks...");
    const localId = getLocalPlayerId();
    const state = window.lastKnownState;
    
    // LIVEKIT FIX: Récupérer les tracks depuis LiveKit Room en priorité
    const liveKitRoom = window.dailyVideo?.room;
    if (liveKitRoom && liveKitRoom.remoteParticipants) {
      log("LIVEKIT: Recovering tracks from LiveKit Room...");
      
      // Local participant
      const localP = liveKitRoom.localParticipant;
      if (localP && localId) {
        for (const [sid, pub] of localP.videoTrackPublications) {
          if (pub.track) {
            if (!videoTracks.has(localId)) {
              log("LIVEKIT: Recovered local video track");
            }
            videoTracks.set(localId, pub.track);
          }
        }
        for (const [sid, pub] of localP.audioTrackPublications) {
          if (pub.track) {
            audioTracks.set(localId, pub.track);
          }
        }
      }
      
      // Remote participants
      for (const [id, participant] of liveKitRoom.remoteParticipants) {
        const pid = participant.identity;
        if (!pid) continue;
        
        // Récupérer la video track
        for (const [sid, pub] of participant.videoTrackPublications) {
          if (pub.track && pub.isSubscribed) {
            if (!videoTracks.has(pid)) {
              log("LIVEKIT: Recovered video track for:", pid.slice(0,8));
            }
            videoTracks.set(pid, pub.track);
          }
        }
        
        // Récupérer la audio track
        for (const [sid, pub] of participant.audioTrackPublications) {
          if (pub.track && pub.isSubscribed) {
            if (!audioTracks.has(pid)) {
              log("LIVEKIT: Recovered audio track for:", pid.slice(0,8));
            }
            audioTracks.set(pid, pub.track);
          }
        }
      }
    }
    // Fallback: D11 V14: Récupérer les tracks directement depuis Daily.co
    else {
      const callObj = window.dailyVideo?.callFrame || window.dailyVideo?.callObject;
      if (callObj && typeof callObj.participants === 'function') {
        const participants = callObj.participants();
        for (const [sessionId, participant] of Object.entries(participants)) {
          if (participant.local) continue; // Skip local
          
          const pid = parsePlayerIdFromUserName(participant.user_name) || "";
          if (!pid) continue;
          
          // Récupérer la video track si disponible
          const videoTrack = participant.tracks?.video?.track;
          if (videoTrack && videoTrack.readyState === 'live') {
            if (!videoTracks.has(pid)) {
              log("D11 V14: Recovered video track from Daily for:", pid.slice(0,8));
            }
            videoTracks.set(pid, videoTrack);
          }
          
          // Récupérer la audio track si disponible
          const audioTrack = participant.tracks?.audio?.track;
          if (audioTrack && audioTrack.readyState === 'live') {
            if (!audioTracks.has(pid)) {
              log("D11 V14: Recovered audio track from Daily for:", pid.slice(0,8));
            }
            audioTracks.set(pid, audioTrack);
          }
          
          // Stocker le mapping peer -> playerId
          if (participant.session_id) {
            peerToPlayerId.set(participant.session_id, pid);
          }
        }
      }
    }
    
    // D4 v5.6: Vérifier si on est en phase privée
    const privateStatus = getPrivatePhaseStatus(state, localId);
    updatePrivatePhaseOverlay(privateStatus);
    
    // Si on n'est pas concerné par la phase privée, bloquer tout
    if (privateStatus.isPrivate && !privateStatus.iAmInvolved) {
      log("🔒 Not involved in private phase - blocking all tracks");
      // Couper tous les audios
      for (const [pid, audioEl] of audioEls.entries()) {
        if (pid !== localId) {
          audioEl.pause();
          audioEl.srcObject = null;
        }
      }
      // Cacher toutes les vidéos (ne pas supprimer les éléments, juste les cacher)
      hideAllVideoSlots();
      return;
    }
    
    // Réattacher les vidéos (avec filtrage des permissions)
    for (const [pid, track] of videoTracks.entries()) {
      attachTrackToPlayer(pid, track, pid === localId);
    }
    
    // Réattacher les audios (avec filtrage des permissions)
    for (const [pid, track] of audioTracks.entries()) {
      attachAudioTrack(pid, track, pid === localId);
    }
    
    // Couper l'audio des joueurs qu'on ne doit pas entendre
    for (const [pid, audioEl] of audioEls.entries()) {
      if (pid !== localId && !canReceiveFromPlayer(pid)) {
        audioEl.pause();
        audioEl.srcObject = null;
        log("🔇 Muted audio from blocked player:", pid);
      }
    }
    
    // restore speaking highlight
    if (currentSpeaking) {
      const row = getPlayerRow(currentSpeaking);
      if (row) row.classList.add("is-speaking");
    }
    
    // D11 V18: Forcer UNIQUEMENT l'affichage des éléments existants
    // NE JAMAIS reconstruire la structure HTML - c'est le rôle de client.js
    const lobbyScreen = document.getElementById('lobbyScreen');
    if (lobbyScreen && lobbyScreen.classList.contains('active')) {
      requestAnimationFrame(() => {
        // V18: Vérifier à nouveau le verrou dans le callback
        if (window._lobbyRebuildInProgress) {
          log("V18: ⏳ Skipping repaint - lobby rebuild still in progress");
          return;
        }
        
        const playersList = document.getElementById('playersList');
        if (playersList) {
          // V18: Ne faire QUE forcer l'affichage, jamais de reconstruction
          playersList.querySelectorAll('.player-item').forEach(item => {
            const left = item.querySelector('.player-left');
            const info = left?.querySelector('.player-info');
            
            if (left && info) {
              // Structure OK, forcer l'affichage
              info.style.display = 'flex';
              info.style.visibility = 'visible';
              info.style.opacity = '1';
              left.style.display = 'flex';
            }
            // V18: Si structure corrompue, on ne fait RIEN - client.js va la recréer
          });
          
          log("D11 V18: Forced visibility on existing player-info elements");
        }
      });
    }
  }
  
  // D11 V9: Alias pour compatibilité - tous les appels passent par le debounce
  function reattachAll() {
    reattachAllDebounced();
  }
  
  // D4 v5.6: Cacher tous les slots vidéo
  function hideAllVideoSlots() {
    const container = document.getElementById('inlineVideoBar');
    if (container) {
      container.style.display = 'none';
    }
    // Cacher aussi les slots du lobby si visibles
    document.querySelectorAll('.player-video-slot video').forEach(v => {
      v.style.display = 'none';
    });
  }
  
  // D4 v5.6: Afficher/Cacher l'overlay de phase privée
  function updatePrivatePhaseOverlay(privateStatus) {
    let overlay = document.getElementById('privatePhaseOverlay');
    
    if (privateStatus.isPrivate && !privateStatus.iAmInvolved) {
      // Créer l'overlay si nécessaire
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'privatePhaseOverlay';
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          color: #fff;
          font-family: 'Orbitron', sans-serif;
        `;
        
        // V35: Traductions overlay
        const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'fr';
        const overlayTexts = {
          pleaseWait: {
            fr: 'Veuillez patienter...',
            en: 'Please wait...',
            es: 'Por favor espere...',
            de: 'Bitte warten...',
            it: 'Attendere prego...',
            pt: 'Por favor aguarde...'
          },
          micOff: {
            fr: '🎤 Micro désactivé',
            en: '🎤 Microphone disabled',
            es: '🎤 Micrófono desactivado',
            de: '🎤 Mikrofon deaktiviert',
            it: '🎤 Microfono disattivato',
            pt: '🎤 Microfone desativado'
          },
          camOff: {
            fr: '📹 Caméra désactivée',
            en: '📹 Camera disabled',
            es: '📹 Cámara desactivada',
            de: '📹 Kamera deaktiviert',
            it: '📹 Fotocamera disattivata',
            pt: '📹 Câmera desativada'
          }
        };
        
        overlay.innerHTML = `
          <div style="font-size: 3rem; margin-bottom: 20px;">🔒</div>
          <div id="privatePhaseMessage" style="font-size: 1.5rem; text-align: center; max-width: 80%; margin-bottom: 20px;"></div>
          <div style="font-size: 1rem; opacity: 0.7;">${overlayTexts.pleaseWait[lang] || overlayTexts.pleaseWait.fr}</div>
          <div style="margin-top: 30px; padding: 20px; background: rgba(255,100,100,0.2); border: 2px solid rgba(255,100,100,0.5); border-radius: 12px;">
            <div style="font-size: 0.9rem; opacity: 0.8;">${overlayTexts.micOff[lang] || overlayTexts.micOff.fr}</div>
            <div style="font-size: 0.9rem; opacity: 0.8; margin-top: 5px;">${overlayTexts.camOff[lang] || overlayTexts.camOff.fr}</div>
          </div>
        `;
        document.body.appendChild(overlay);
        log("📢 Private phase overlay shown");
        
        // Couper aussi le micro et la caméra local
        forceLocalMute();
      }
      
      // Mettre à jour le message
      const msgEl = overlay.querySelector('#privatePhaseMessage');
      if (msgEl) {
        msgEl.textContent = privateStatus.message;
      }
      
      overlay.style.display = 'flex';
      
      // Cacher la barre inline
      const inlineBar = document.getElementById('inlineVideoBar');
      if (inlineBar) inlineBar.style.display = 'none';
      
    } else {
      // Cacher l'overlay
      if (overlay) {
        overlay.style.display = 'none';
        log("📢 Private phase overlay hidden");
      }
      
      // Réafficher la barre inline si on est en mode INLINE
      const controller = window.VideoModeController;
      const currentMode = controller?.getState?.()?.currentMode;
      if (currentMode === 'INLINE') {
        const inlineBar = document.getElementById('inlineVideoBar');
        if (inlineBar) inlineBar.style.display = 'flex';
      }
    }
  }
  
  // D4 v5.6: Forcer le mute local quand on n'est pas concerné par une phase privée
  function forceLocalMute() {
    const callObj = window.dailyVideo?.callFrame || window.dailyVideo?.callObject;
    if (callObj) {
      try {
        callObj.setLocalAudio(false);
        callObj.setLocalVideo(false);
        log("🔇 Forced local mute for private phase");
      } catch (e) {
        log("Error forcing local mute:", e);
      }
    }
  }
  
  // V11: Restaurer la VIDÉO aux moments clés (phases publiques uniquement)
  // L'AUDIO est géré par video-integration-client.js
  function restoreLocalTracks() {
    const callObj = window.dailyVideo?.callFrame || window.dailyVideo?.callObject;
    if (!callObj) return;
    
    // Vérifier qu'on n'est PAS en phase privée non-concerné
    const state = window.lastKnownState;
    const localId = getLocalPlayerId();
    const privateStatus = getPrivatePhaseStatus(state, localId);
    
    if (privateStatus.isPrivate && !privateStatus.iAmInvolved) {
      log("🔒 restoreLocalTracks blocked - still in private phase");
      return;
    }
    
    try {
      // V11: Restaurer uniquement la VIDÉO (pas l'audio - géré ailleurs)
      if (!userMutedVideo) {
        callObj.setLocalVideo(true);
        log("📹 Restored local video");
      }
      // V11: NE PAS toucher à l'audio ici - géré par video-integration-client.js
    } catch (e) {
      log("Error restoring local tracks:", e);
    }
  }
  
  // V35: Exposer la fonction pour client.js
  window.restoreLocalTracks = restoreLocalTracks;
  
  // D4 v5.5: Exposer une fonction pour forcer le recalcul des permissions
  // Appelée quand les permissions changent (changement de phase)
  window.VideoTracksRefresh = function() {
    log("🔄 Permissions refresh requested");
    reattachAll();
    
    // GAME_OVER FIX: Mettre à jour le grayscale de toutes les vidéos existantes
    updateAllVideoGrayscale();
  };
  
  // Fonction pour mettre à jour le grayscale de toutes les vidéos
  function updateAllVideoGrayscale() {
    const state = window.lastKnownState;
    const isGameOver = state?.phase === 'GAME_OVER';
    
    if (isGameOver) {
      log("🎮 GAME_OVER detected - removing grayscale from all videos");
    }
    
    // Parcourir tous les slots vidéo et mettre à jour leur style
    const slots = document.querySelectorAll('.player-video-slot');
    slots.forEach(slot => {
      const playerId = slot.dataset.playerId;
      if (!playerId) return;
      
      const player = state?.players?.find(p => p.playerId === playerId);
      const isEliminated = player?.status === 'dead' || player?.status === 'left';
      const shouldGray = isEliminated && !isGameOver;
      
      const grayFilter = shouldGray ? 'filter:grayscale(100%) brightness(0.5)!important;opacity:0.6!important;' : '';
      const borderColor = shouldGray ? '#666' : '#00ffff';
      
      // V11: Ne plus forcer 64px - juste le border et le grayFilter
      slot.style.borderColor = borderColor;
      if (grayFilter) {
        slot.style.cssText += grayFilter;
      }
      
      // Mettre à jour le style de la vidéo
      const video = slot.querySelector('video');
      if (video) {
        video.style.cssText = "width:100%!important;height:100%!important;object-fit:cover!important;display:block!important;" + grayFilter;
      }
    });
    
    // V5 FIX: Aussi mettre à jour les thumbnails de la sidebar (video-briefing-ui)
    if (isGameOver) {
      const thumbs = document.querySelectorAll('.video-thumb.is-dead');
      thumbs.forEach(thumb => {
        thumb.classList.remove('is-dead');
        // Retirer le filtre grayscale inline si présent
        thumb.style.filter = '';
        thumb.style.opacity = '';
        const video = thumb.querySelector('video');
        if (video) {
          video.style.filter = '';
          video.style.opacity = '';
        }
      });
      log("🎮 Removed is-dead class from", thumbs.length, "sidebar thumbnails");
    }
  }
  
  // Exposer globalement pour que client.js puisse l'appeler
  window.VideoTracksUpdateGrayscale = updateAllVideoGrayscale;

  function setSpeaking(playerId) {
    // clear previous
    document.querySelectorAll(".player-item.is-speaking").forEach(el => el.classList.remove("is-speaking"));
    currentSpeaking = playerId || null;
    if (!currentSpeaking) return;
    const row = getPlayerRow(currentSpeaking);
    if (row) row.classList.add("is-speaking");
  }

  function bindToCallObject(callObject) {
    if (!callObject || bound) return;
    bound = true;

    log("Binding to callObject ✅");

    callObject.on("participant-joined", (ev) => {
      const p = ev?.participant;
      const peerKey = p?.session_id || p?.peerId || p?.id || "";
      const pid = parsePlayerIdFromUserName(p?.user_name);
      log("participant-joined:", p?.user_name, "pid:", pid);
      if (peerKey && pid) peerToPlayerId.set(peerKey, pid);
      
      // V11: Rafraîchir la grille du briefing UI quand un participant rejoint
      setTimeout(() => {
        if (window.VideoBriefingUI?.refreshParticipants) {
          log("Refreshing briefing grid after participant joined:", pid);
          window.VideoBriefingUI.refreshParticipants();
        }
      }, 500);
    });

    callObject.on("participant-updated", (ev) => {
      const p = ev?.participant;
      const peerKey = p?.session_id || p?.peerId || p?.id || "";
      const pid = parsePlayerIdFromUserName(p?.user_name);
      if (peerKey && pid) peerToPlayerId.set(peerKey, pid);
    });

    // D5: Handler pour participant qui quitte - nettoyage complet
    callObject.on("participant-left", (ev) => {
      const p = ev?.participant;
      const peerKey = p?.session_id || p?.peerId || p?.id || "";
      const pid = peerToPlayerId.get(peerKey) || parsePlayerIdFromUserName(p?.user_name) || "";
      
      log("🚪 participant-left:", p?.user_name, "pid:", pid);
      
      if (pid) {
        // Nettoyer la vidéo
        videoTracks.delete(pid);
        const videoEl = videoEls.get(pid);
        if (videoEl) {
          videoEl.srcObject = null;
          videoEl.load();
          if (videoEl.parentNode) {
            videoEl.parentNode.removeChild(videoEl);
          }
          videoEls.delete(pid);
          log("🧹 Cleaned video for left participant:", pid);
        }
        
        // Nettoyer l'audio
        audioTracks.delete(pid);
        const audioEl = audioEls.get(pid);
        if (audioEl) {
          audioEl.srcObject = null;
          audioEl.load();
          audioEl.remove();
          audioEls.delete(pid);
          log("🧹 Cleaned audio for left participant:", pid);
        }
        
        // Nettoyer le slot
        const slot = getSlot(pid);
        if (slot) {
          slot.innerHTML = "";
        }
        
        // Retirer du mapping
        peerToPlayerId.delete(peerKey);
        
        // Notifier le Briefing UI
        if (window.VideoBriefingUI) {
          window.VideoBriefingUI.onTrackStopped(pid);
          // V11: Rafraîchir la grille après qu'un participant quitte
          setTimeout(() => {
            if (window.VideoBriefingUI?.refreshParticipants) {
              window.VideoBriefingUI.refreshParticipants();
            }
          }, 300);
        }
      }
    });

    callObject.on("track-started", (ev) => {
      const p = ev?.participant;
      const isLocal = !!p?.local;
      const peerKey = p?.session_id || p?.peerId || p?.id || "";
      const pid =
        (isLocal ? getLocalPlayerId() : "") ||
        peerToPlayerId.get(peerKey) ||
        parsePlayerIdFromUserName(p?.user_name) ||
        "";

      log("track-started:", ev?.track?.kind, "from", p?.user_name, "pid:", pid, "isLocal:", isLocal);

      if (!pid) return;

      if (ev?.track?.kind === "video") {
        videoTracks.set(pid, ev.track);
        
        // V11: Vérifier si on est en mode SPLIT/MAX - si oui, laisser briefing UI gérer
        const controller = window.VideoModeController;
        const currentMode = controller?.getState?.()?.currentMode;
        const isAdvancedMode = (currentMode === 'SPLIT' || currentMode === 'ADVANCED_FOCUS');
        
        // V11: Vérifier si on est dans le lobby
        const lobbyScreen = document.getElementById('lobbyScreen');
        const isInLobby = lobbyScreen && lobbyScreen.classList.contains('active');
        
        // Attacher au slot SEULEMENT si dans le lobby (pas en mode avancé)
        if (isInLobby && !isAdvancedMode) {
          attachTrackToPlayer(pid, ev.track, isLocal);
        }
        
        // D4: Notifier le Briefing UI (il gère les vidéos en mode SPLIT/MAX)
        if (window.VideoBriefingUI) {
          window.VideoBriefingUI.onTrackStarted(pid, ev.track);
        }
      } else if (ev?.track?.kind === "audio") {
        // D4: Handle audio tracks
        audioTracks.set(pid, ev.track);
        attachAudioTrack(pid, ev.track, isLocal);
      }
    });

    callObject.on("track-stopped", (ev) => {
      const p = ev?.participant;
      const peerKey = p?.session_id || p?.peerId || p?.id || "";
      const pid = peerToPlayerId.get(peerKey) || parsePlayerIdFromUserName(p?.user_name) || "";
      
      log("track-stopped:", ev?.track?.kind, "from", p?.user_name, "pid:", pid);
      
      if (!pid) return;

      // D11 V13: Vérifier si le joueur est toujours dans la partie via lastKnownState
      // C'est plus fiable que callObject.participants() qui peut être désynchronisé
      const gameState = window.lastKnownState;
      const isStillInGame = gameState?.players?.some(player => 
        player.playerId === pid && player.connected !== false && player.status !== 'left'
      );
      
      // D11 V13: Dans le lobby, ne jamais supprimer les vidéos si le joueur est toujours dans la partie
      const lobbyScreen = document.getElementById('lobbyScreen');
      const isInLobby = lobbyScreen && lobbyScreen.classList.contains('active');
      
      if (isStillInGame && isInLobby) {
        log("⏸️ track-stopped in lobby but player still in game, not cleaning:", pid.slice(0,8));
        // Juste supprimer la track de la Map, mais garder le slot et l'élément vidéo intacts
        if (ev?.track?.kind === "video") {
          videoTracks.delete(pid);
        } else if (ev?.track?.kind === "audio") {
          audioTracks.delete(pid);
        }
        return;
      }

      if (ev?.track?.kind === "video") {
        videoTracks.delete(pid);
        const slot = getSlot(pid);
        if (slot) slot.innerHTML = "";
        
        // D5: Nettoyer aussi l'élément vidéo pour libérer les ressources
        const videoEl = videoEls.get(pid);
        if (videoEl) {
          videoEl.srcObject = null;
          videoEl.load(); // Force le navigateur à libérer les ressources
          if (videoEl.parentNode) {
            videoEl.parentNode.removeChild(videoEl);
          }
          videoEls.delete(pid);
          log("🧹 Cleaned up video element for:", pid);
        }
        
        // D4: Notifier le Briefing UI
        if (window.VideoBriefingUI) {
          window.VideoBriefingUI.onTrackStopped(pid);
        }
      } else if (ev?.track?.kind === "audio") {
        audioTracks.delete(pid);
        const audioEl = audioEls.get(pid);
        if (audioEl) {
          audioEl.srcObject = null;
          audioEl.load(); // D5: Force libération ressources
          audioEl.remove();
          audioEls.delete(pid);
          log("🧹 Cleaned up audio element for:", pid);
        }
      }
    });

    callObject.on("active-speaker-change", (ev) => {
      const peerId = ev?.peerId || ev?.activeSpeaker?.peerId || "";
      const pid = peerToPlayerId.get(peerId) || "";
      
      // D5: Log amélioré
      log("🎙️ active-speaker-change event:", { peerId, playerId: pid, raw: ev });
      
      setSpeaking(pid);
      
      // D5: Notifier le VideoModeController avec validation
      if (window.videoModeCtrl && pid) {
        log("🎙️ Notifying VideoModeController of active speaker:", pid);
        window.videoModeCtrl.setActiveSpeaker(pid);
      } else if (!pid) {
        log("🎙️ No playerId found for peerId:", peerId);
      }
    });

    // D11 V10: MutationObserver SUPPRIMÉ - causait des appels en cascade
    // Le reattach est maintenant géré proprement par client.js après renderLobby

    // Initial reattach after a short delay (slots may appear after bind)
    // D11 V10: Réduit à un seul appel
    setTimeout(reattachAll, 1000);
  }

  // V41: Compteur et contrôle de la boucle
  let waitForCallObjectCount = 0;
  let waitForCallObjectActive = false;
  let waitForCallObjectTimeout = null;
  const MAX_WAIT_ATTEMPTS = 120; // 60 secondes max (120 x 500ms)
  
  function waitForCallObject() {
    // V41: Ne rien faire si la recherche n'est pas active
    if (!waitForCallObjectActive) {
      return;
    }
    
    // D4: Check both callObject and callFrame (they're the same in headless mode)
    const co = window.dailyVideo && (window.dailyVideo.callObject || window.dailyVideo.callFrame);
    if (co) {
      log("✅ Found callObject after", waitForCallObjectCount, "attempts, binding...");
      waitForCallObjectActive = false;
      waitForCallObjectCount = 0;
      bindToCallObject(co);
      return;
    }
    
    waitForCallObjectCount++;
    
    // V41: Timeout après MAX_WAIT_ATTEMPTS
    if (waitForCallObjectCount >= MAX_WAIT_ATTEMPTS) {
      log("⚠️ Timeout waiting for callObject after", waitForCallObjectCount, "attempts (", MAX_WAIT_ATTEMPTS * 0.5, "s). Video not active?");
      waitForCallObjectActive = false;
      waitForCallObjectCount = 0;
      return;
    }
    
    // V41: Logger seulement au début et toutes les 20 tentatives
    if (waitForCallObjectCount === 1 || waitForCallObjectCount % 20 === 0) {
      log("Waiting for callObject... (attempt " + waitForCallObjectCount + "/" + MAX_WAIT_ATTEMPTS + ")");
    }
    
    waitForCallObjectTimeout = setTimeout(waitForCallObject, 500);
  }
  
  // V41: Fonction pour démarrer la recherche (appelée quand vidéo demandée)
  function startWaitingForCallObject() {
    if (waitForCallObjectActive) {
      log("Already waiting for callObject");
      return;
    }
    
    // Vérifier si déjà présent
    const co = window.dailyVideo && (window.dailyVideo.callObject || window.dailyVideo.callFrame);
    if (co) {
      log("✅ callObject already available, binding immediately");
      bindToCallObject(co);
      return;
    }
    
    log("🔍 Starting to wait for callObject...");
    waitForCallObjectActive = true;
    waitForCallObjectCount = 0;
    waitForCallObject();
  }
  
  // V41: Fonction pour arrêter la recherche
  function stopWaitingForCallObject() {
    if (waitForCallObjectTimeout) {
      clearTimeout(waitForCallObjectTimeout);
      waitForCallObjectTimeout = null;
    }
    waitForCallObjectActive = false;
    waitForCallObjectCount = 0;
  }
  
  // V41: Exposer globalement pour que daily-video.js puisse déclencher
  window.VideoTracksStartWaiting = startWaitingForCallObject;
  window.VideoTracksStopWaiting = stopWaitingForCallObject;

  function mountButton() {
    // Keep existing UI button if present; only add fallback on mobile
    const existing = document.querySelector("#videoToggleButton");
    if (existing) {
      // V27: Mettre à jour le bouton existant si videoDisabled change
      updateVideoButtonState(existing);
      return;
    }

    // V32: Ne pas créer le bouton sur PC (visio se lance automatiquement)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) {
      log('PC detected - skipping video toggle button');
      return;
    }

    // Fallback button bottom-left (mobile only, compact)
    const btn = document.createElement("button");
    btn.id = "videoToggleButton";
    btn.style.cssText = `
      position: fixed;
      left: 14px;
      bottom: 14px;
      z-index: 2147483647;
      padding: 8px 10px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.18);
      background: rgba(0,0,0,0.55);
      color: #fff;
      font-size: 12px;
      cursor: pointer;
      backdrop-filter: blur(8px);
    `;
    document.body.appendChild(btn);

    // V27: Mettre à jour l'état initial du bouton
    updateVideoButtonState(btn);

    btn.onclick = () => {
      // V27: Vérifier si le mode sans vidéo est activé AVANT d'activer la visio
      // V32: Aussi vérifier si le joueur a les crédits vidéo
      const state = window.lastKnownState;
      if (state?.videoDisabled) {
        log('⛔ Video disabled for this game - ignoring video activation request');
        btn.textContent = "🚫 Visio désactivée";
        btn.style.background = "rgba(100,50,50,0.7)";
        return;
      }
      
      // V32: Bloquer si pas de crédits vidéo
      if (state?.you?.canBroadcastVideo === false) {
        log('⛔ Player has no video credits - ignoring video activation request');
        btn.textContent = "🚫 Crée un compte";
        btn.style.background = "rgba(100,50,50,0.7)";
        return;
      }
      
      if (window.VideoIntegration && typeof window.VideoIntegration.requestVideoStart === "function") {
        window.VideoIntegration.requestVideoStart();
        btn.textContent = "🎥 ...";
        setTimeout(() => { 
          // V27: Re-vérifier après le délai
          const currentState = window.lastKnownState;
          if (currentState?.videoDisabled || currentState?.you?.canBroadcastVideo === false) {
            btn.textContent = currentState?.you?.canBroadcastVideo === false ? "🚫 Compte" : "🚫 Off";
            btn.style.background = "rgba(100,50,50,0.7)";
          } else {
            btn.textContent = "🎥 Visio";
            btn.style.background = "rgba(0,100,0,0.55)";
          }
        }, 1200);
      } else {
        console.warn("[VideoTracks] VideoIntegration API not ready yet");
      }
    };
  }

  // V27: Fonction pour mettre à jour l'état du bouton vidéo selon videoDisabled
  // V32: Aussi vérifier canBroadcastVideo + texte raccourci pour mobile
  function updateVideoButtonState(btn) {
    if (!btn) return;
    
    const state = window.lastKnownState;
    const videoDisabled = state?.videoDisabled;
    const canBroadcastVideo = state?.you?.canBroadcastVideo;
    
    // V32: Si joueur n'a pas les crédits, traiter comme videoDisabled
    if (videoDisabled || canBroadcastVideo === false) {
      const message = canBroadcastVideo === false ? "🚫 Compte" : "🚫 Off";
      btn.textContent = message;
      btn.style.background = "rgba(100,50,50,0.7)";
      btn.style.cursor = "not-allowed";
      btn.style.opacity = "0.7";
      log('⛔ Video button disabled (videoDisabled=' + videoDisabled + ', canBroadcast=' + canBroadcastVideo + ')');
    } else {
      btn.textContent = "🎥 Visio";
      btn.style.background = "rgba(0,0,0,0.55)";
      btn.style.cursor = "pointer";
      btn.style.opacity = "1";
    }
  }

  // V27: Observer les changements d'état pour mettre à jour le bouton
  // V32: Aussi observer canBroadcastVideo
  function setupVideoDisabledWatcher() {
    // Vérifier périodiquement si videoDisabled ou canBroadcastVideo a changé
    let lastVideoDisabled = null;
    let lastCanBroadcast = null;
    setInterval(() => {
      const state = window.lastKnownState;
      const currentVideoDisabled = state?.videoDisabled;
      const currentCanBroadcast = state?.you?.canBroadcastVideo;
      
      if (currentVideoDisabled !== lastVideoDisabled || currentCanBroadcast !== lastCanBroadcast) {
        lastVideoDisabled = currentVideoDisabled;
        lastCanBroadcast = currentCanBroadcast;
        const btn = document.querySelector("#videoToggleButton");
        if (btn) {
          updateVideoButtonState(btn);
        }
      }
    }, 1000);
  }

  // D4 v5.4: Fonctions toggle pour les boutons de la barre inline
  async function toggleInlineMic(btn) {
    const callObj = window.dailyVideo?.callFrame || window.dailyVideo?.callObject;
    if (!callObj) {
      log('No callObject for inline mic toggle');
      return;
    }
    
    try {
      const currentState = await callObj.localAudio();
      const newState = !currentState;
      await callObj.setLocalAudio(newState);
      
      // Mémoriser le choix manuel
      userMutedAudio = !newState;
      if (window.VideoTracksRegistry?.setUserMutedAudio) {
        window.VideoTracksRegistry.setUserMutedAudio(userMutedAudio);
      }
      
      // Mettre à jour le bouton
      if (btn) {
        if (userMutedAudio) {
          btn.textContent = '🔇';
          btn.style.background = 'rgba(180, 50, 50, 0.7)';
          btn.title = 'Activer le micro';
        } else {
          btn.textContent = '🎤';
          btn.style.background = 'rgba(0, 100, 100, 0.5)';
          btn.title = 'Couper le micro';
        }
      }
      
      // Synchroniser avec le bouton du briefing UI si présent
      syncBriefingMicButton(userMutedAudio);
      
      // D6: Afficher le toast de confirmation
      if (typeof window.showMuteToast === 'function') {
        window.showMuteToast(userMutedAudio);
      }
      
      log('Inline Microphone:', newState ? 'ON' : 'OFF');
    } catch (e) {
      log('Error toggling inline mic:', e);
    }
  }
  
  async function toggleInlineCam(btn) {
    const callObj = window.dailyVideo?.callFrame || window.dailyVideo?.callObject;
    if (!callObj) {
      log('No callObject for inline cam toggle');
      return;
    }
    
    try {
      const currentState = await callObj.localVideo();
      const newState = !currentState;
      await callObj.setLocalVideo(newState);
      
      // Mémoriser le choix manuel
      userMutedVideo = !newState;
      if (window.VideoTracksRegistry?.setUserMutedVideo) {
        window.VideoTracksRegistry.setUserMutedVideo(userMutedVideo);
      }
      
      // Mettre à jour le bouton
      if (btn) {
        if (userMutedVideo) {
          btn.textContent = '📷';
          btn.style.background = 'rgba(180, 50, 50, 0.7)';
          btn.title = 'Activer la caméra';
        } else {
          btn.textContent = '📹';
          btn.style.background = 'rgba(0, 100, 100, 0.5)';
          btn.title = 'Couper la caméra';
        }
      }
      
      // Synchroniser avec le bouton du briefing UI si présent
      syncBriefingCamButton(userMutedVideo);
      
      log('Inline Camera:', newState ? 'ON' : 'OFF');
    } catch (e) {
      log('Error toggling inline cam:', e);
    }
  }
  
  // Synchroniser l'état des boutons entre inline et briefing
  function syncBriefingMicButton(muted) {
    const briefingBtn = document.getElementById('briefingMicBtn');
    if (briefingBtn) {
      if (muted) {
        briefingBtn.textContent = '🔇';
        briefingBtn.classList.add('is-off');
      } else {
        briefingBtn.textContent = '🎤';
        briefingBtn.classList.remove('is-off');
      }
    }
  }
  
  function syncBriefingCamButton(off) {
    const briefingBtn = document.getElementById('briefingCamBtn');
    if (briefingBtn) {
      if (off) {
        briefingBtn.textContent = '📷';
        briefingBtn.classList.add('is-off');
      } else {
        briefingBtn.textContent = '📹';
        briefingBtn.classList.remove('is-off');
      }
    }
  }
  
  // D4 v5.4: Mettre à jour les boutons inline quand l'état change
  function updateInlineButtons() {
    const micBtn = document.getElementById('inlineMicBtn');
    const camBtn = document.getElementById('inlineCamBtn');
    
    if (micBtn) {
      if (userMutedAudio) {
        micBtn.textContent = '🔇';
        micBtn.style.background = 'rgba(180, 50, 50, 0.7)';
      } else {
        micBtn.textContent = '🎤';
        micBtn.style.background = 'rgba(0, 100, 100, 0.5)';
      }
    }
    
    if (camBtn) {
      if (userMutedVideo) {
        camBtn.textContent = '📷';
        camBtn.style.background = 'rgba(180, 50, 50, 0.7)';
      } else {
        camBtn.textContent = '📹';
        camBtn.style.background = 'rgba(0, 100, 100, 0.5)';
      }
    }
  }

  // D6: Fonction globale pour synchroniser le grayscale des joueurs éliminés
  // Appelée après chaque roomState pour s'assurer que l'affichage est correct
  // V40 FIX: Logger uniquement si le nombre de joueurs éliminés a changé
  let lastEliminatedCount = 0;
  window.syncEliminatedPlayersGrayscale = function() {
    const state = window.lastKnownState;
    if (!state?.players) return;
    
    // V6 FIX: Ne pas griser en GAME_OVER (débrief - tout le monde visible)
    const isGameOver = state?.phase === 'GAME_OVER';
    
    // Parcourir tous les joueurs et appliquer/retirer le grayscale
    state.players.forEach(player => {
      const isEliminated = player.status === 'dead' || player.status === 'left';
      const shouldGray = isEliminated && !isGameOver; // V6 FIX
      const slots = document.querySelectorAll(`[data-player-id="${player.playerId}"]`);
      
      slots.forEach(slot => {
        const video = slot.querySelector('video');
        if (!video) return;
        
        const grayFilter = shouldGray ? 'filter:grayscale(100%) brightness(0.5)!important;opacity:0.6!important;' : '';
        const borderColor = shouldGray ? '#666' : '#00ffff';
        
        // V11: Ne plus forcer 64px - juste le border et le grayFilter
        slot.style.borderColor = borderColor;
        if (grayFilter) {
          slot.style.cssText += grayFilter;
        }
        
        // Appliquer les styles à la vidéo
        video.style.cssText = "width:100%!important;height:100%!important;object-fit:cover!important;display:block!important;" + grayFilter;
      });
    });
    
    // V40 FIX: Logger uniquement si le nombre d'éliminés a changé
    const currentEliminatedCount = state.players.filter(p => p.status === 'dead' || p.status === 'left').length;
    if (currentEliminatedCount !== lastEliminatedCount) {
      log('🎬 Grayscale sync completed for', currentEliminatedCount, 'eliminated players');
      lastEliminatedCount = currentEliminatedCount;
    }
  };

  // Boot
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      mountButton();
      // V41: Ne plus démarrer waitForCallObject automatiquement
      // Elle sera démarrée par daily-video.js quand la vidéo est lancée
      // OU par le socket event 'roomState' si vidéo active
      startPeriodicCleanup(); // D5: Démarrer le nettoyage périodique
      setupVideoDisabledWatcher(); // V27: Observer videoDisabled
    });
  } else {
    mountButton();
    // V41: Idem - ne plus démarrer automatiquement
    startPeriodicCleanup(); // D5: Démarrer le nettoyage périodique
    setupVideoDisabledWatcher(); // V27: Observer videoDisabled
  }
  
  // D5: Nettoyage périodique automatique
  function startPeriodicCleanup() {
    const CLEANUP_INTERVAL = 30000; // Vérifier toutes les 30 secondes
    const CLEANUP_THRESHOLD = 8; // Déclencher si > 8 vidéos
    
    setInterval(() => {
      const stats = window.VideoTracksRegistry.getStats();
      
      if (stats.videoEls > CLEANUP_THRESHOLD) {
        log('🧹 Periodic cleanup triggered - videoEls:', stats.videoEls, 'threshold:', CLEANUP_THRESHOLD);
        cleanupUnusedMediaElements();
        
        // Log final stats
        const newStats = window.VideoTracksRegistry.getStats();
        log('🧹 Cleanup complete - new stats:', newStats);
      }
    }, CLEANUP_INTERVAL);
    
    log('🧹 Periodic cleanup started (every 30s, threshold:', CLEANUP_THRESHOLD, ')');
  }
  
  log("Module loaded ✅");
})();
