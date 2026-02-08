/**
 * VIDEO INTEGRATION - À ajouter dans public/client.js
 * 
 * Copiez ce code à la fin de votre fichier client.js
 */

// ============================================
// SECTION VIDEO - LIVEKIT INTEGRATION (was Daily.co)
// ============================================

console.log('[Video] build=PERF12-optimized-livekit');

// ═══════════════════════════════════════════════════════════════════════════
// PERF12: Optimisations pour réduire CPU/batterie sur mobile
// - Memoization des états pour éviter logs/actions redondants
// - Throttling renforcé des opérations coûteuses
// ═══════════════════════════════════════════════════════════════════════════
let _lastPermissionsHash = null;
let _lastPhaseLogged = null;
window.SABOTEUR_DEBUG = window.location.hostname === 'localhost' || 
                        window.location.hostname.includes('test') ||
                        window.location.search.includes('debug=1');

// ============================================
// D4: INTEGRATION WITH VideoModeController
// ============================================

/**
 * D4: Synchronise l'état avec le VideoModeController
 * Appelé à chaque roomState pour mettre à jour le contrôleur
 */
function syncWithVideoModeController(state) {
  if (!window.videoModeCtrl) return;
  
  // Mettre à jour l'état du contrôleur
  window.videoModeCtrl.updateFromRoomState(state);
  
  // Signaler si la vidéo est connectée
  window.videoModeCtrl.setVideoJoined(videoRoomJoined);
}

let videoRoomUrl = null;
let videoRoomJoined = false;
let isInitializingVideo = false; // Protection contre joins multiples
let isCreatingRoom = false;      // Protection contre create-room multiples

// V32: Variable globale pour bloquer les joueurs sans crédits vidéo
// Initialisée à null (inconnu), mise à jour dès le premier roomState
let playerCanBroadcastVideo = null;

// D3: Sur mobile, l'activation vidéo doit être déclenchée par une interaction utilisateur.
// IMPORTANT: on exige un geste utilisateur À CHAQUE chargement de page (session), pas un flag persistant.
const VIDEO_IS_MOBILE = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;

// Desktop: on peut mémoriser la préférence (auto = ok). Mobile: session-only.
let videoUserRequestedSession = (() => {
  try { return sessionStorage.getItem('videoUserRequestedSession') === '1'; } catch (e) { return false; }
})();

let videoUserRequestedPersisted = (() => {
  try { return localStorage.getItem('videoUserRequested') === '1'; } catch (e) { return false; }
})();

let isPreparingVideoRoom = false;

// Expose une API simple pour le bouton (video-tracks.js)
window.VideoIntegration = window.VideoIntegration || {};
window.VideoIntegration.requestVideoStart = function () {
  // Flag session (mobile) + préférence (desktop)
  videoUserRequestedSession = true;
  try { sessionStorage.setItem('videoUserRequestedSession', '1'); } catch (e) {}

  if (!VIDEO_IS_MOBILE) {
    videoUserRequestedPersisted = true;
    try { localStorage.setItem('videoUserRequested', '1'); } catch (e) {}
  }

  // IMPORTANT mobile: le join() doit être déclenché DIRECTEMENT ici (handler clic).
  // => on ne join que si la room est déjà préparée (URL connue).
  const st = window.lastKnownState;
  if (!st || !st.started || st.ended || st.aborted) {
    showVideoStatus('⚠️ Visio: état de partie indisponible', 'warning');
    return;
  }

  if (VIDEO_IS_MOBILE) {
    if (!videoRoomUrl) {
      showVideoStatus('⏳ Préparation de la visio… Réessaie dans 1s', 'info');
      // On prépare en arrière-plan via roomState (ou via prepareVideoRoom si dispo)
      try { prepareVideoRoom(st); } catch (e) {}
      return;
    }
    // Join DIRECT (pas de fetch / pas de chaîne async avant l'appel)
    joinVideoRoomNow(st);
    return;
  }

  // Desktop: ok de lancer (peut créer/join via async)
  initVideoForGame(st);
};


/**
 * Prépare la room Daily côté serveur (crée si besoin) SANS join().
 * Utilisé pour respecter la règle mobile "join seulement sur geste utilisateur".
 */
function prepareVideoRoom(state) {
  if (videoRoomUrl || isPreparingVideoRoom) return;
  if (!state?.started || state?.ended || state?.aborted) return;
  if (state?.videoDisabled) return;
  // V32: Bloquer si le joueur n'a pas les crédits vidéo (vérifier les deux sources)
  if (playerCanBroadcastVideo === false || state?.you?.canBroadcastVideo === false) {
    console.log('[Video] ⛔ Player has no video credits, skipping video entirely');
    return;
  }
  if (!state?.roomCode) return;

  isPreparingVideoRoom = true;
  const apiUrl = `/api/video/create-room/${state.roomCode}`;
  // V32: Envoyer le playerId pour vérification côté serveur
  const playerId = state?.you?.playerId || window.playerId || sessionStorage.getItem('is_playerId');
  console.log('[Video] 📡 Preparing room (no-join):', apiUrl, { playerId });

  fetch(apiUrl, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerId })
  })
    .then(res => res.json())
    .then(data => {
      if (data?.ok && data?.roomUrl) {
        videoRoomUrl = data.roomUrl;
        console.log('[Video] ✅ Room prepared:', videoRoomUrl);
      } else {
        console.warn('[Video] ⚠️ Room prepare failed:', data?.error || data);
      }
    })
    .catch(err => console.warn('[Video] ⚠️ Room prepare error:', err))
    .finally(() => { isPreparingVideoRoom = false; });
}

/**
 * Join la room Daily (DOIT être appelé directement depuis un handler utilisateur sur mobile).
 * N'appelle JAMAIS l'API create-room.
 */
function joinVideoRoomNow(state) {
  if (videoRoomJoined) {
    // PERF V10: Log supprimé (spam inutile)
    return;
  }
  if (isInitializingVideo) {
    console.log('[Video] Join already in progress, skipping');
    return;
  }
  // V32: Bloquer si le joueur n'a pas les crédits vidéo
  // Vérifier DEUX sources : la variable globale ET le state actuel
  const canBroadcast = playerCanBroadcastVideo !== false && state?.you?.canBroadcastVideo !== false;
  if (!canBroadcast) {
    console.log('[Video] ⛔ Player has no video credits, cannot join video', { 
      globalVar: playerCanBroadcastVideo, 
      stateVar: state?.you?.canBroadcastVideo 
    });
    showVideoStatus('⛔ Crée un compte pour la vidéo', 'error');
    return;
  }
  if (!videoRoomUrl) {
    console.warn('[Video] joinVideoRoomNow called but no videoRoomUrl yet');
    showVideoStatus('⏳ Visio pas prête. Réessaie.', 'info');
    return;
  }

  isInitializingVideo = true;

  const permissions = state.videoPermissions || { video: true, audio: true };
  const baseName = state.you?.name || 'Joueur';
  const youId = state.you?.playerId || window.playerId || state.you?.id || '';
  const userName = youId ? `${baseName}#${youId}` : baseName;

  console.log('[Video] 🚀 Joining prepared room (direct):', { userName, permissions });

  window.dailyVideo.joinRoom(videoRoomUrl, userName, permissions)
    .then(() => {
      videoRoomJoined = true;
      isInitializingVideo = false;
      console.log('[Video] ✅ Successfully joined room');
      showVideoStatus('✅ Visio activée', 'success');
      
      // 🔧 LIVEKIT FIX: Notifier immédiatement le VideoModeController
      // Sans cela, le mode SPLIT ne s'active jamais car setVideoJoined(true)
      // n'est appelé que lors d'un nouveau roomState
      syncWithVideoModeController(state);
      console.log('[Video] 🎯 VideoModeController notified of join');
      
      // Activer le boost audio pour compenser le volume "appel" sur mobile
      if (window.audioManager && window.audioManager.activateVideoBoost) {
        window.audioManager.activateVideoBoost();
      }
    })
    .catch(err => {
      console.error('[Video] ❌ Join error:', err);
      isInitializingVideo = false;
      showVideoStatus('❌ Erreur de connexion vidéo', 'error');
    });
}

/**

 * Initialise la vidéo quand la partie démarre
 */
function initVideoForGame(state) {
  // D3: Sécurité - sur mobile, ne jamais auto-join via initVideoForGame.
  if (VIDEO_IS_MOBILE) {
    prepareVideoRoom(state);
    console.log('[Video] Mobile: initVideoForGame blocked (use user gesture)');
    return;
  }

  // Ne rien faire si déjà initialisé ou si pas encore démarré
  if (videoRoomJoined) {
    // PERF V10: Log supprimé (spam inutile)
    return;
  }

  // Bloquer si une création de room est déjà en cours
  if (isCreatingRoom) {
    console.log('[Video] Room creation already in progress, skipping');
    return;
  }

  // Robustesse: si `started` manque mais que la `phase` n'est pas le lobby,
  // on considère que la partie est en cours (cas typique après refresh mobile).
  const phase = String(state?.phase || "");
  const effectiveStarted = (state?.started === true) || (!!phase && phase !== "LOBBY" && phase !== "GAME_ABORTED");
  if (!effectiveStarted) {
    console.log('[Video] Game not started yet, skipping');
    return;
  }
  
  // V9.3.1: Vérifier si la vidéo est désactivée pour cette partie
  if (state.videoDisabled) {
    console.log('[Video] Video disabled for this game, skipping initialization');
    return;
  }
  
  // V32: Bloquer si le joueur n'a pas les crédits vidéo (vérifier les deux sources)
  if (playerCanBroadcastVideo === false || state?.you?.canBroadcastVideo === false) {
    console.log('[Video] ⛔ Player has no video credits, skipping video entirely');
    return;
  }

  if (!state.roomCode) {
    console.error('[Video] No room code in state!', state);
    return;
  }

  // Si la room est déjà connue, on join directement (desktop)
  if (videoRoomUrl) {
    joinVideoRoomNow(state);
    return;
  }

  console.log('[Video] 🎬 Initializing video for game...', {
    roomCode: state.roomCode,
    phase: state.phase,
    started: state.started
  });

  // Demander la création de la room vidéo au serveur
  const apiUrl = `/api/video/create-room/${state.roomCode}`;
  // V32: Envoyer le playerId pour vérification côté serveur
  const playerId = state?.you?.playerId || window.playerId || sessionStorage.getItem('is_playerId');
  console.log('[Video] 📡 Fetching:', apiUrl, { playerId });

  isCreatingRoom = true;
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ playerId })
  })
    .then(res => {
      console.log('[Video] 📥 Response status:', res.status);
      return res.json();
    })
    .then(data => {
      console.log('[Video] 📦 Response data:', data);

      if (!data.ok) {
        console.error('[Video] ❌ Failed to create room:', data.error);
        showVideoStatus('❌ Impossible de créer la visio', 'error');
        isCreatingRoom = false;
        return;
      }

      videoRoomUrl = data.roomUrl;
      console.log('[Video] ✅ Room created:', videoRoomUrl);

      // Afficher un message d'info si c'est une room gratuite
      if (data.isFreeRoom) {
        console.log('[Video] ℹ️ Using FREE Daily.co room (10 participants max)');
      }

      // Desktop: join maintenant
      joinVideoRoomNow(state);
    })
    .catch(err => {
      console.error('[Video] ❌ API error:', err);
      isCreatingRoom = false;
      showVideoStatus('❌ Erreur serveur vidéo', 'error');
    })
    .finally(() => {
      isCreatingRoom = false;
    });
}

/**
 * Met à jour les permissions vidéo selon la phase
 * V11: Logique simplifiée
 * - Couper micro uniquement pendant : phases privées (si pas concerné), vote du jour
 * - Unmute automatique : réveil, après vote du jour, game over
 * - Sinon : laisser comme l'utilisateur l'a mis
 */
let lastForceUnmutePhase = null;
let lastForceMutePhase = null;

function updateVideoPermissions(state) {
  if (!videoRoomJoined || !window.dailyVideo.callFrame) {
    return;
  }

  const permissions = state.videoPermissions;
  if (!permissions) return;

  // PERF12: Créer un hash des permissions pour détecter les vrais changements
  const permHash = JSON.stringify({
    phase: state.phase,
    canBroadcast: permissions.canBroadcast,
    canReceive: permissions.canReceive,
    deafened: permissions.deafened
  });

  // PERF12: Ne logger que si la phase change
  if (_lastPhaseLogged !== state.phase) {
    _lastPhaseLogged = state.phase;
    console.log('[Video] V11 ULTRA-SIMPLE: Phase', state.phase, '- Audio géré uniquement par phases privées');
  }

  // PERF12: Ne rien faire si les permissions n'ont pas changé
  if (permHash === _lastPermissionsHash) {
    return;
  }
  _lastPermissionsHash = permHash;
  
  // V11 ULTRA-SIMPLE: NE RIEN FORCER sur le micro
  // Seule exception : phases privées gérées par video-tracks.js (forceLocalMute)
  // L'utilisateur contrôle son micro comme il veut le reste du temps
  
  // Appliquer les permissions de base (vidéo + deafen seulement)
  window.dailyVideo.updatePermissions(permissions);
  
  // PERF12: Throttle renforcé - 500ms minimum entre refreshs
  if (window.VideoTracksRefresh) {
    const now = Date.now();
    if (!window._lastTracksRefreshTime || (now - window._lastTracksRefreshTime) > 500) {
      window._lastTracksRefreshTime = now;
      setTimeout(() => {
        window.VideoTracksRefresh();
        // PERF12: Log uniquement en debug
        if (window.SABOTEUR_DEBUG) {
          console.log('[Video] 🔄 Tracks refreshed for new permissions');
        }
      }, 200);
    }
  }

  // Afficher le message de phase
  if (state.videoPhaseMessage) {
    showVideoStatus(state.videoPhaseMessage, 'info');
  }
}

/**
 * V11: Force le mute pendant le vote
 */
function forceMuteForVote(phase, registry) {
  try {
    const callFrame = window.dailyVideo?.callFrame || window.dailyVideo?.callObject;
    if (!callFrame) return;
    
    // Couper le micro seulement (garder la caméra)
    callFrame.setLocalAudio(false);
    console.log('[Video] 🔇 Mic muted for vote phase');
    
    // Mettre à jour les boutons UI
    updateMuteButtonsUI(true, false);
    
    // Afficher notification
    showMuteNotification(phase);
    
  } catch (e) {
    console.error('[Video] Error forcing mute:', e);
  }
}

/**
 * V11: Affiche notification de mute
 */
function showMuteNotification(phase) {
  const message = phase === 'FINAL_VOTE' 
    ? '🗳️ Vote final - Micro coupé pour le vote'
    : '🗳️ Vote - Micro coupé pendant le vote';
  
  let notif = document.getElementById('muteNotification');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'muteNotification';
    notif.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(180, 50, 50, 0.95);
      color: white;
      padding: 12px 24px;
      border-radius: 25px;
      font-weight: bold;
      z-index: 11000;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      animation: fadeInDown 0.3s ease;
    `;
    document.body.appendChild(notif);
  }
  
  notif.textContent = message;
  notif.style.display = 'block';
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    notif.style.display = 'none';
  }, 3000);
}

/**
 * V11: Force le démute du MICRO SEULEMENT avec notification visuelle
 * Respecte le choix manuel de l'utilisateur - ne touche pas à la caméra
 */
function forceUnmuteWithNotification(phase, registry) {
  try {
    const callFrame = window.dailyVideo?.callFrame || window.dailyVideo?.callObject;
    if (!callFrame) {
      console.warn('[Video] ⚠️ No callFrame available');
      return;
    }
    
    // V11: Vérifier si l'utilisateur avait manuellement coupé son micro
    const userMutedAudio = registry?.getUserMutedAudio?.();
    
    if (userMutedAudio) {
      // L'utilisateur avait volontairement coupé son micro - on respecte son choix
      console.log('[Video] ⏭️ Respecting user choice - mic stays muted');
      return;
    }
    
    // Réactiver seulement le micro (pas la caméra !)
    callFrame.setLocalAudio(true);
    console.log('[Video] 🔊 Mic enabled for phase:', phase);
    
    // Mettre à jour les boutons UI (seulement le micro)
    updateMuteButtonsUI(false, null); // null = ne pas changer la caméra
    
    // Notification visuelle
    showUnmuteNotification(phase);
    
  } catch (err) {
    console.warn('[Video] ⚠️ Could not enable mic:', err);
  }
}

/**
 * D4 v5.8: Met à jour visuellement les boutons mute
 * V11: Boutons inline supprimés - uniquement boutons briefing + mobile
 * V11: Si audioMuted ou videoMuted est null, ne pas changer cet état
 */
function updateMuteButtonsUI(audioMuted, videoMuted) {
  // Boutons du briefing UI (PC)
  const briefingMicBtn = document.getElementById('briefingMicBtn');
  const briefingCamBtn = document.getElementById('briefingCamBtn');
  
  // V11: Ne mettre à jour le micro que si audioMuted n'est pas null
  if (audioMuted !== null && briefingMicBtn) {
    if (audioMuted) {
      briefingMicBtn.textContent = '🔇';
      briefingMicBtn.style.background = 'rgba(180, 50, 50, 0.7)';
      briefingMicBtn.classList.add('is-off');
    } else {
      briefingMicBtn.textContent = '🎤';
      briefingMicBtn.style.background = '';
      briefingMicBtn.classList.remove('is-off');
    }
  }
  
  // V11: Ne mettre à jour la caméra que si videoMuted n'est pas null
  if (videoMuted !== null && briefingCamBtn) {
    if (videoMuted) {
      briefingCamBtn.textContent = '🚫';
      briefingCamBtn.style.background = 'rgba(180, 50, 50, 0.7)';
      briefingCamBtn.classList.add('is-off');
    } else {
      briefingCamBtn.textContent = '📹';
      briefingCamBtn.style.background = '';
      briefingCamBtn.classList.remove('is-off');
    }
  }
  
  // V11: Boutons mobile
  const mobileMicBtn = document.getElementById('mobileMicBtn');
  const mobileCamBtn = document.getElementById('mobileCamBtn');
  
  if (audioMuted !== null && mobileMicBtn) {
    if (audioMuted) {
      mobileMicBtn.textContent = '🔇';
      mobileMicBtn.classList.add('is-off');
    } else {
      mobileMicBtn.textContent = '🎤';
      mobileMicBtn.classList.remove('is-off');
    }
  }
  
  if (videoMuted !== null && mobileCamBtn) {
    if (videoMuted) {
      mobileCamBtn.textContent = '🚫';
      mobileCamBtn.classList.add('is-off');
    } else {
      mobileCamBtn.textContent = '📹';
      mobileCamBtn.classList.remove('is-off');
    }
  }
}

// V11: Exposer globalement pour synchronisation cross-module
window.updateMuteButtonsUI = updateMuteButtonsUI;

/**
 * D4 v5.8: Affiche une notification de démute
 */
function showUnmuteNotification(phase) {
  // Message selon la phase
  let message = '🔊 Micro et caméra réactivés';
  if (phase === 'GAME_OVER') {
    message = '🎉 Fin de partie - Micro et caméra réactivés pour le débrief !';
  } else if (phase === 'DAY_WAKE') {
    message = '☀️ Jour - Micro et caméra réactivés pour la discussion !';
  } else if (phase === 'NIGHT_RESULTS') {
    message = '🌙 Résultats - Micro et caméra réactivés !';
  } else if (phase === 'ROLE_REVEAL') {
    message = '🎭 Révélation des rôles - Micro et caméra réactivés !';
  }
  
  // Créer la notification
  let notif = document.getElementById('unmuteNotification');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'unmuteNotification';
    notif.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, rgba(0, 150, 100, 0.95), rgba(0, 100, 80, 0.95));
      color: #fff;
      padding: 12px 24px;
      border-radius: 12px;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.95rem;
      z-index: 10001;
      box-shadow: 0 4px 20px rgba(0, 255, 150, 0.3);
      border: 2px solid rgba(0, 255, 150, 0.5);
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(notif);
  }
  
  notif.textContent = message;
  notif.style.opacity = '1';
  
  // Cacher après 4 secondes
  setTimeout(() => {
    notif.style.opacity = '0';
  }, 4000);
  
  console.log('[Video] 📢 Unmute notification shown:', message);
}

/**
 * Quitte la room vidéo
 */
function leaveVideoRoom() {
  if (!videoRoomJoined) return;

  console.log('[Video] Leaving room...');
  window.dailyVideo.leave();
  videoRoomJoined = false;
  videoRoomUrl = null;
  showVideoStatus('📹 Visio terminée', 'info');
  
  // Désactiver le boost audio
  if (window.audioManager && window.audioManager.deactivateVideoBoost) {
    window.audioManager.deactivateVideoBoost();
  }
}

/**
 * Affiche un message de statut vidéo (optionnel - peut être adapté à votre UI)
 */
function showVideoStatus(message, type = 'info') {
  console.log(`[Video Status - ${type}]`, message);
  
  // Option 1: Afficher dans la console seulement
  // (Commentez cette partie si vous avez déjà un système de notifications)
  
  // Option 2: Créer une notification temporaire
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 120px;
    right: 20px;
    padding: 12px 20px;
    background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
    color: white;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    z-index: 9997;
    animation: slideInRight 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'all 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * Nettoie la vidéo (appelé lors de la déconnexion)
 */
function cleanupVideo() {
  if (videoRoomJoined) {
    window.dailyVideo.destroy();
    videoRoomJoined = false;
    videoRoomUrl = null;
  }
}

// ============================================
// HOOKS DANS LE CODE EXISTANT
// ============================================

// ============================================
// AUTO-ACTIVATION via Socket.IO
// ============================================

/**
 * Écoute automatique des événements Socket.IO
 * S'active dès que le module est chargé
 */
(function autoActivateVideo() {
  // Vérifier que Socket.IO est disponible
  if (typeof io === 'undefined') {
    console.warn('[Video] Socket.IO not loaded yet, retrying...');
    setTimeout(autoActivateVideo, 500);
    return;
  }

  // Vérifier qu'une socket existe
  if (typeof socket === 'undefined') {
    console.warn('[Video] Socket not initialized yet, retrying...');
    setTimeout(autoActivateVideo, 500);
    return;
  }

  console.log('[Video] Auto-activation enabled ✅');

  // Hook sur roomState (s'ajoute aux listeners existants)
  socket.on("roomState", (state) => {
    // Stocker l'état pour debug
    window.lastKnownState = state;
    
    // V32/PERF12: Mettre à jour SEULEMENT si la valeur change
    if (state?.you?.canBroadcastVideo !== undefined && 
        state.you.canBroadcastVideo !== playerCanBroadcastVideo) {
      playerCanBroadcastVideo = state.you.canBroadcastVideo;
      console.log('[Video] V32: canBroadcastVideo changed to:', playerCanBroadcastVideo);
    }

    // D4: Synchroniser avec le VideoModeController
    syncWithVideoModeController(state);
    
    // D5: Nettoyer les ressources média inutilisées périodiquement
    if (window.VideoTracksRegistry?.cleanupUnusedResources) {
      // Ne pas faire à chaque roomState, seulement si on a beaucoup d'éléments
      const stats = window.VideoTracksRegistry.getStats?.() || {};
      if (stats.videoEls > 8 || stats.audioEls > 10) {
        // PERF V10: Log supprimé (trop fréquent)
        window.VideoTracksRegistry.cleanupUnusedResources();
      }
    }

    // DEBUG : Logger l'état seulement si la phase change (PERF V10)
    if (window._lastLoggedPhase !== state.phase) {
      window._lastLoggedPhase = state.phase;
      console.log('[Video] 📥 roomState received:', {
        started: state.started,
        ended: state.ended,
        aborted: state.aborted,
        phase: state.phase,
        roomCode: state.roomCode,
        hasYou: !!state.you,
        hasVideoPermissions: !!state.videoPermissions
      });
    }

    // 🔧 Robustesse refresh mobile
    // Après un refresh (souvent Android Chrome), on peut recevoir un `roomState`
    // transitoire où `started` est absent / false alors que `phase` indique
    // clairement qu'on est déjà en partie. On dérive un "started" effectif.
    const phase = String(state.phase || '');
    const effectiveStarted = (state.started === true) || (!!phase && phase !== 'LOBBY' && phase !== 'GAME_ABORTED');

    // 1. Initialiser la vidéo au démarrage de la partie
    if (effectiveStarted && !state.ended && !state.aborted) {
      // D3: Sur mobile, attendre une action utilisateur explicite
      prepareVideoRoom(state);
      if (VIDEO_IS_MOBILE && !videoUserRequestedSession) {
        console.log('[Video] ⏸️ Mobile: waiting for user gesture (button)');
        showVideoStatus('📱 Appuie sur "Activer la visio"', 'info');
      } else {
        // Desktop: auto si préférence persistée, ou si non mobile
        // PERF12: Ne pas log/init si déjà initialisé ou en cours
        if (!VIDEO_IS_MOBILE && (videoUserRequestedPersisted || true)) {
          if (!videoRoomJoined && !isInitializingVideo) {
            console.log('[Video] 🎯 Conditions met for video initialization');
            initVideoForGame(state);
          }
        }
      }
    } else {
      console.log('[Video] ⏸️ Not starting video:', {
        started: state.started,
        ended: state.ended,
        aborted: state.aborted
      });
    }
    
    // 2. Mettre à jour les permissions selon la phase
    // V9.3.0.2: IMPORTANT - Appeler même en GAME_OVER (state.ended=true) pour réactiver les morts
    if (effectiveStarted) {
      updateVideoPermissions(state);

      // D3: Auto PiP en phase nuit/action (PC uniquement, jamais forcé mobile)
      try {
        const isNightLike = (
          state.phase === 'NIGHT' ||
          state.phase === 'ACTION' ||
          state.phase === 'SABOTEURS' ||
          state.phase === 'DOCTOR' ||
          state.phase === 'RADAR_OFFICER' ||
          state.phase === 'SECURITY'
        );

        if (!VIDEO_IS_MOBILE && isNightLike && document.pictureInPictureEnabled) {
          const youId = state.you?.playerId || window.playerId || state.you?.id || '';
          const selector = youId ? `.player-item[data-player-id="${youId}"] video` : '.player-item video';
          const el = document.querySelector(selector);

          if (el && document.pictureInPictureElement !== el) {
            el.requestPictureInPicture().catch(() => {});
          }
        }

        if (!VIDEO_IS_MOBILE && !isNightLike && document.pictureInPictureElement) {
          document.exitPictureInPicture().catch(() => {});
        }
      } catch (e) {}

    }
    
    // 3. Quitter la vidéo en fin de partie
    if (state.aborted) {
      leaveVideoRoom();
    }
    // ✅ V8.1: keep video running through GAME_OVER and end stats; server controls media permissions.
    // We intentionally do NOT leave on state.ended here.
  });

  // Hook sur disconnect
  socket.on("disconnect", () => {
    cleanupVideo();
  });

  console.log('[Video] Event listeners registered ✅');
})();

/**
 * À ajouter quand l'utilisateur quitte volontairement
 */
function onLeaveRoom() {
  // ... votre code existant ...
  
  // Quitter la vidéo
  leaveVideoRoom();
}

// ============================================
// CONTRÔLES UTILISATEUR (OPTIONNEL)
// ============================================

/**
 * Bouton pour toggle la vidéo manuellement
 * À ajouter dans votre UI si souhaité
 */
function createVideoToggleButton() {
  const button = document.createElement('button');
  button.id = 'videoToggleBtn';
  button.textContent = '📹';
  button.title = 'Activer/Désactiver la visioconférence';
  button.className = 'btn btn-secondary';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    font-size: 28px;
    z-index: 9996;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  `;
  
  button.onclick = () => {
    if (!videoRoomJoined) {
      // Tenter de rejoindre manuellement
      const state = window.lastKnownState; // Vous devez stocker state globalement
      const phase = String(state?.phase || "");
      const effectiveStarted = (state?.started === true) || (!!phase && phase !== "LOBBY" && phase !== "GAME_ABORTED");
      if (state && effectiveStarted) {
        initVideoForGame(state);
      } else {
        showVideoStatus('⚠️ Visio: état de partie indisponible', 'warning');
      }
    } else {
      // Toggle minimiser/maximiser
      window.dailyVideo.toggleMinimize();
    }
  };
  
  document.body.appendChild(button);
  
  return button;
}

// Créer le bouton au chargement (optionnel)
// window.addEventListener('DOMContentLoaded', () => {
//   createVideoToggleButton();
// });

// ============================================
// DEBUGGING
// ============================================

/**
 * Fonction de debug pour tester manuellement
 * Utilisez dans la console: testVideoConnection()
 */
window.testVideoConnection = function() {
  console.log('[Video Debug] Testing connection...');
  console.log('Room joined:', videoRoomJoined);
  console.log('Room URL:', videoRoomUrl);
  console.log('CallFrame exists:', !!window.dailyVideo.callFrame);
  
  if (window.dailyVideo.callFrame) {
    window.dailyVideo.callFrame.participants().then(participants => {
      console.log('Participants:', Object.keys(participants).length);
      console.log('Details:', participants);
    });
  }
};

/**
 * Logger les événements vidéo importants
 */
if (window.dailyVideo) {
  const originalJoin = window.dailyVideo.joinRoom;
  window.dailyVideo.joinRoom = async function(...args) {
    console.log('[Video] Joining room with args:', args);
    try {
      const result = await originalJoin.apply(this, args);
      console.log('[Video] Join successful');
      return result;
    } catch (error) {
      console.error('[Video] Join failed:', error);
      throw error;
    }
  };
}

console.log('[Video Integration] Module loaded successfully ✅');
