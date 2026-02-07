/**
 * VIDEO BRIEFING UI - D4 "Salle de Briefing"
 * ==========================================
 * 
 * Interface avancée de visioconférence style "réunion Zoom/Meet".
 * Focus sur l'active speaker + sidebar avec vignettes.
 * 
 * V3 GRILLE FIX: Correction du problème de miniaturisation en mode SPLIT
 * - Ne JAMAIS reconstruire les thumbs si ils existent déjà en mode SPLIT
 * - Réutiliser les éléments vidéo existants
 */

(function() {
  'use strict';

  const DEBUG = true;
  const log = (...args) => DEBUG && console.log('[BriefingUI]', ...args);

  // DOM Elements
  let container = null;
  let focusWrapper = null;
  let focusMain = null;
  let focusNameEl = null;
  let thumbsSidebar = null;
  let expandBtn = null;
  
  // State
  let currentFocusId = null;
  let focusVideoEl = null;
  let thumbElements = new Map(); // playerId -> thumb element
  
  // V3 GRILLE FIX: Tracker le dernier mode pour détecter les changements
  let lastKnownMode = null;
  // V3 GRILLE FIX: Tracker si les thumbs ont été initialisés pour ce mode
  let thumbsInitializedForSplit = false;

  // ============================================
  // INITIALIZATION
  // ============================================
  
  function init() {
    log('Initializing...');
    
    createContainer();
    bindEvents();
    
    log('Initialized');
  }

  function createContainer() {
    // Main container
    container = document.createElement('div');
    container.id = 'videoBriefingContainer';
    container.className = 'video-briefing-container';
    
    // Header
    const header = document.createElement('div');
    header.className = 'video-briefing-header';
    header.innerHTML = `
      <div class="video-briefing-title">
        <span class="icon">📹</span>
        <span class="text">SALLE DE BRIEFING</span>
        <span class="phase-badge" id="briefingPhaseBadge">DISCUSSION</span>
      </div>
      <div class="video-briefing-controls" id="briefingControls">
        <!-- Controls injected by video-tracks.js or here -->
      </div>
    `;
    container.appendChild(header);
    
    // Content wrapper (flexbox)
    const content = document.createElement('div');
    content.className = 'video-briefing-content';
    
    // Focus wrapper (large video)
    focusWrapper = document.createElement('div');
    focusWrapper.className = 'video-focus-wrapper';
    
    focusMain = document.createElement('div');
    focusMain.className = 'video-focus-main empty';
    focusMain.id = 'videoFocusMain';
    
    // Name overlay for focus
    focusNameEl = document.createElement('div');
    focusNameEl.className = 'video-focus-name';
    focusNameEl.innerHTML = `
      <span class="name" id="focusPlayerName">-</span>
      <span class="badge-speaker" id="focusSpeakerBadge" style="display:none;">🎙️ Parle</span>
    `;
    focusMain.appendChild(focusNameEl);
    
    focusWrapper.appendChild(focusMain);
    content.appendChild(focusWrapper);
    
    // Thumbnails sidebar
    thumbsSidebar = document.createElement('div');
    thumbsSidebar.className = 'video-thumbs-sidebar';
    thumbsSidebar.id = 'videoThumbsSidebar';
    content.appendChild(thumbsSidebar);
    
    container.appendChild(content);
    
    // Inject into DOM
    document.body.appendChild(container);
    
    // Create expand button (floating)
    createExpandButton();
    
    log('Container created');
  }

  function createExpandButton() {
    expandBtn = document.createElement('button');
    expandBtn.id = 'videoExpandBtn';
    expandBtn.className = 'video-expand-btn';
    expandBtn.innerHTML = '📹';
    expandBtn.title = 'Agrandir la visio';
    
    expandBtn.addEventListener('click', () => {
      if (window.videoModeCtrl) {
        if (window.videoModeCtrl.isBriefingActive()) {
          // Cycle through modes
          window.videoModeCtrl.cycleMode();
        } else {
          // Activate split mode
          window.videoModeCtrl.setSplitMode();
        }
      }
    });
    
    document.body.appendChild(expandBtn);
  }

  // ============================================
  // EVENT BINDING
  // ============================================
  
  function bindEvents() {
    // D5: Empêcher le scroll du body quand on scrolle dans la sidebar
    if (thumbsSidebar) {
      thumbsSidebar.addEventListener('wheel', (e) => {
        const { scrollTop, scrollHeight, clientHeight } = thumbsSidebar;
        const isAtTop = scrollTop === 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
        
        // Permettre le scroll seulement si pas aux limites
        if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
          e.preventDefault();
        }
      }, { passive: false });
    }
    
    // Listen to VideoModeController events
    if (window.videoModeCtrl) {
      window.videoModeCtrl.on('modeChange', handleModeChange);
      window.videoModeCtrl.on('focusChange', handleFocusChange);
      window.videoModeCtrl.on('activeSpeakerChange', handleActiveSpeakerChange);
    }
    
    log('Events bound');
  }

  // ============================================
  // MODE HANDLING
  // ============================================
  
  // V41: Variable module pour éviter les setIntervals multiples
  let activeScrollMonitor = null;
  
  function handleModeChange(data) {
    log('Mode change:', data);
    
    const { mode, phase } = data;
    
    // V3 GRILLE FIX: Détecter si le mode a vraiment changé
    const modeActuallyChanged = (lastKnownMode !== mode);
    lastKnownMode = mode;
    
    // Update phase badge
    const phaseBadge = document.getElementById('briefingPhaseBadge');
    if (phaseBadge) {
      phaseBadge.textContent = getPhaseLabel(phase);
    }
    
    // Update container class for mode
    if (container) {
      container.classList.remove('mode-full', 'mode-split');
      if (mode === 'ADVANCED_FOCUS') {
        container.classList.add('mode-full');
        thumbsInitializedForSplit = false; // Reset car on change de mode
      } else if (mode === 'SPLIT') {
        container.classList.add('mode-split');
      }
    }
    
    // Update body class for game content positioning
    updateBodyClass(mode);
    
    // Update button states
    updateModeButtons(mode);
    
    // Show/hide based on mode
    if (mode === 'ADVANCED_FOCUS' || mode === 'SPLIT') {
      // ============================================
      // V3.21 COORDINATION: SCROLL FIX AVEC FLAG
      // ============================================
      
      console.log('%c🎯 V3.21: MODE SPLIT ACTIVÉ - COORDINATION SCROLL', 
        'background: #00ff00; color: #000000; font-size: 16px; font-weight: bold; padding: 5px;');
      
      // ÉTAPE 1: ACTIVER LE FLAG pour bloquer client.js
      window.__briefingUIScrollLock = true;
      console.log('[V3.21] 🔒 Flag de coordination activé - client.js est bloqué');
      
      // ÉTAPE 2: Capturer position initiale
      const scrollStart = window.pageYOffset || document.documentElement.scrollTop;
      console.log('[V3.21] 📍 Position de départ:', scrollStart);
      
      // ÉTAPE 3: Désactiver smooth scroll temporairement
      const originalScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';
      
      // ÉTAPE 4: Monitorer le scroll en temps réel
      // V41 FIX: Arrêter l'ancien monitor s'il existe (évite les doublons)
      if (activeScrollMonitor) {
        clearInterval(activeScrollMonitor);
        activeScrollMonitor = null;
      }
      
      let scrollChanges = [];
      activeScrollMonitor = setInterval(() => {
        const current = window.pageYOffset || document.documentElement.scrollTop;
        if (current !== scrollStart) {
          scrollChanges.push({ time: Date.now(), position: current, delta: current - scrollStart });
        }
      }, 10);
      
      // ÉTAPE 5: Fonction de restauration agressive
      const forceScrollRestore = (reason) => {
        const current = window.pageYOffset || document.documentElement.scrollTop;
        if (current !== scrollStart) {
          window.scrollTo({ top: scrollStart, behavior: 'auto' });
          console.log(`[V3.21] ✅ Scroll restauré (${reason}):`, scrollStart, 'was:', current);
          return true;
        }
        return false;
      };
      
      // ÉTAPE 6: show() avec surveillance
      // V3 GRILLE FIX: Passer le flag modeActuallyChanged
      console.log('[V3.21] 🎬 Appel show()...');
      show(modeActuallyChanged);
      console.log('[V3.21] ✓ show() terminé');
      
      updateExpandButton(false);
      
      // ÉTAPE 7: Restauration multi-tentatives + libération du flag
      
      // Tentative immédiate
      requestAnimationFrame(() => {
        forceScrollRestore('RAF-1');
        
        // Tentative après 1 frame
        requestAnimationFrame(() => {
          forceScrollRestore('RAF-2');
          
          // Tentative finale + rapport
          setTimeout(() => {
            forceScrollRestore('timeout-50ms');
            
            // Arrêter le monitor
            if (activeScrollMonitor) {
              clearInterval(activeScrollMonitor);
              activeScrollMonitor = null;
            }
            
            // LIBÉRER LE FLAG
            window.__briefingUIScrollLock = false;
            console.log('[V3.21] 🔓 Flag de coordination libéré - client.js peut agir');
            
            // Rapport final
            console.log('%c📊 V3.21: RAPPORT FINAL COORDINATION', 'background: #0066ff; color: white; padding: 3px;');
            const scrollEnd = window.pageYOffset || document.documentElement.scrollTop;
            console.log('[V3.21] Position finale:', scrollEnd);
            console.log('[V3.21] Delta total:', scrollEnd - scrollStart);
            console.log('[V3.21] Changements détectés:', scrollChanges.length);
            
            if (Math.abs(scrollEnd - scrollStart) < 5) {
              console.log('%c✅ V3.21: SUCCÈS - SCROLL STABLE (COORDINATION)', 'background: green; color: white; padding: 5px;');
            } else {
              console.log('%c⚠️ V3.21: ATTENTION - SCROLL A BOUGÉ MALGRÉ COORDINATION', 'background: orange; color: black; padding: 5px;');
              // Restauration finale forcée
              window.scrollTo({ top: scrollStart, behavior: 'auto' });
            }
            
            // Restaurer smooth scroll
            document.documentElement.style.scrollBehavior = originalScrollBehavior;
            document.body.style.scrollBehavior = originalScrollBehavior;
            
          }, 50);
        });
      });
      
    } else if (mode === 'INLINE' || mode === 'OFF' || mode === 'HIDDEN') {
      hide();
      updateExpandButton(mode === 'INLINE');
      
      // V3 GRILLE FIX: Reset les flags quand on quitte le mode SPLIT
      thumbsInitializedForSplit = false;
    }
  }

  function getPhaseLabel(phase) {
    const labels = {
      'DEBATE': 'DÉBAT',
      'VOTING': 'VOTE',
      'DAY_DEBATE': 'DÉBAT',
      'DAY_VOTE': 'VOTE',
      'DISCUSSION': 'DISCUSSION',
      'GAME_OVER': 'FIN DE PARTIE',
      'ROLE_REVEAL': 'RÉVÉLATION',
      'CAPTAIN_CANDIDACY': 'CANDIDATURES',
      'CAPTAIN_VOTE': 'ÉLECTION',
      'CAPTAIN_RESULT': 'RÉSULTAT',
      'DAY': 'JOUR',
      'DAY_DISCUSSION': 'DISCUSSION',
      'EJECTION_REVEAL': 'ÉJECTION',
      'FINAL_VOTE': 'VOTE FINAL'
    };
    return labels[phase] || phase || 'BRIEFING';
  }

  function updateModeButtons(mode) {
    const maxBtn = document.getElementById('btnVideoMax');
    const splitBtn = document.getElementById('btnVideoSplit');
    const closeBtn = document.getElementById('btnVideoClose');
    
    // Update active states
    if (maxBtn) maxBtn.classList.toggle('active', mode === 'ADVANCED_FOCUS');
    if (splitBtn) splitBtn.classList.toggle('active', mode === 'SPLIT');
    
    // V40b: Gérer le bouton X mobile
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    if (mobileCloseBtn) {
      // Afficher seulement si en mode SPLIT ou ADVANCED_FOCUS
      if (mode === 'SPLIT' || mode === 'ADVANCED_FOCUS') {
        mobileCloseBtn.style.display = 'flex';
      } else {
        mobileCloseBtn.style.display = 'none';
      }
    }
  }

  function handleFocusChange(data) {
    log('Focus change:', data);
    setFocus(data.playerId, data.isManual);
  }

  function handleActiveSpeakerChange(data) {
    log('Active speaker:', data);
    // D6: Stocker le speaker actuel pour réapplication après re-render
    window.__currentActiveSpeaker = data.playerId;
    updateSpeakerHighlights(data.playerId);
  }
  
  // D6: Fonction globale pour réappliquer le highlight après un re-render
  window.reapplySpeakerHighlight = function() {
    if (window.__currentActiveSpeaker) {
      updateInlineModeSpeakerHighlights(window.__currentActiveSpeaker);
    }
  };

  // ============================================
  // VISIBILITY
  // ============================================
  
  // V3 GRILLE FIX: show() prend maintenant un paramètre pour indiquer si le mode a changé
  function show(forceRefresh = false) {
    if (!container) init();
    
    container.classList.add('active');
    container.style.display = '';
    
    // V40: Afficher les boutons flottants (PC)
    const floatingActions = document.getElementById('floatingVideoActions');
    if (floatingActions) floatingActions.style.display = 'flex';
    
    // V3 GRILLE FIX: Ne rafraîchir les participants que si nécessaire
    const isSplitMode = container.classList.contains('mode-split');
    
    if (isSplitMode) {
      // En mode SPLIT, ne rafraîchir que si:
      // 1. forceRefresh est true (changement de mode)
      // 2. Les thumbs n'ont jamais été initialisés pour ce mode SPLIT
      // 3. Le nombre de thumbs ne correspond pas au nombre de participants
      const participants = window.videoModeCtrl?.getParticipants() || [];
      const needsRefresh = forceRefresh || !thumbsInitializedForSplit || thumbElements.size !== participants.length;
      
      if (needsRefresh) {
        log('SPLIT MODE: Refreshing participants (forceRefresh:', forceRefresh, 'initialized:', thumbsInitializedForSplit, 'thumbs:', thumbElements.size, 'participants:', participants.length, ')');
        refreshParticipants();
        thumbsInitializedForSplit = true;
      } else {
        log('SPLIT MODE: Skipping refresh - thumbs already correct');
        // Juste réattacher les vidéos aux thumbs existants
        attachVideoTracks();
      }
    } else {
      // En mode MAX/FOCUS, toujours rafraîchir
      refreshParticipants();
    }
    
    syncControlStates();
    log('Briefing UI shown');
  }

  function hide() {
    if (!container) return;
    container.classList.remove('active');
    container.style.display = 'none';
    
    // V40: Cacher les boutons flottants (PC)
    const floatingActions = document.getElementById('floatingVideoActions');
    if (floatingActions) floatingActions.style.display = 'none';
    // V40b: Cacher le bouton X mobile
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    if (mobileCloseBtn) mobileCloseBtn.style.display = 'none';
    
    // Retirer la classe split du body
    document.body.classList.remove('video-split-active');
    log('Briefing UI hidden');
  }

  function isVisible() {
    return container && container.classList.contains('active');
  }
  
  function updateBodyClass(mode) {
    if (mode === 'SPLIT') {
      document.body.classList.add('video-split-active');
    } else {
      document.body.classList.remove('video-split-active');
    }
  }

  function updateExpandButton(visible) {
    if (!expandBtn) return;
    
    if (visible) {
      expandBtn.classList.add('visible');
    } else {
      expandBtn.classList.remove('visible');
    }
  }

  // ============================================
  // PARTICIPANTS MANAGEMENT
  // ============================================
  
  function refreshParticipants() {
    if (!window.videoModeCtrl) return;
    
    const participants = window.videoModeCtrl.getParticipants();
    const currentFocus = window.videoModeCtrl.getFocusedPlayerId();
    
    // Détecter si on est en mode SPLIT
    const isSplitMode = container && container.classList.contains('mode-split');
    
    log('Refreshing participants:', participants.length, 'mode:', isSplitMode ? 'SPLIT-GRID' : 'FOCUS');
    
    // Clear existing thumbs
    thumbsSidebar.innerHTML = '';
    thumbElements.clear();
    
    // Create thumbnail for each participant
    participants.forEach(p => {
      // En mode SPLIT, inclure TOUS les joueurs (y compris le focusé)
      if (!isSplitMode && p.playerId === currentFocus) return;
      
      const thumb = createThumbnail(p);
      thumbsSidebar.appendChild(thumb);
      thumbElements.set(p.playerId, thumb);
    });
    
    // Set focus (seulement si pas en mode SPLIT car pas de zone focus visible)
    if (!isSplitMode) {
      if (currentFocus) {
        setFocus(currentFocus, false);
      } else if (participants.length > 0) {
        setFocus(participants[0].playerId, false);
      }
    }
    
    // Attach video tracks
    attachVideoTracks();
  }

  function createThumbnail(participant) {
    const thumb = document.createElement('div');
    thumb.className = 'video-thumb empty';
    thumb.dataset.playerId = participant.playerId;
    
    // Name label
    const nameEl = document.createElement('div');
    nameEl.className = 'thumb-name';
    nameEl.textContent = participant.name || 'Joueur';
    thumb.appendChild(nameEl);
    
    // Click to focus (seulement en mode MAX)
    thumb.addEventListener('click', () => {
      const isSplitMode = container && container.classList.contains('mode-split');
      if (!isSplitMode) {
        log('Thumbnail clicked:', participant.playerId);
        if (window.videoModeCtrl) {
          window.videoModeCtrl.setManualFocus(participant.playerId);
        }
      }
    });
    
    // Mark if dead
    const state = window.lastKnownState;
    const isGameOver = state?.phase === 'GAME_OVER';
    if (!participant.alive && !isGameOver) {
      thumb.classList.add('is-dead');
    }
    
    return thumb;
  }

  // ============================================
  // FOCUS MANAGEMENT
  // ============================================
  
  function setFocus(playerId, isManual) {
    if (!playerId) return;
    
    const ctrl = window.videoModeCtrl;
    if (!ctrl) return;
    
    const participants = ctrl.getParticipants();
    const focusedPlayer = participants.find(p => p.playerId === playerId);
    
    if (!focusedPlayer) {
      log('Player not found for focus:', playerId);
      return;
    }
    
    // Détecter si on est en mode SPLIT
    const isSplitMode = container && container.classList.contains('mode-split');
    
    // Animation de transition (seulement en mode MAX)
    const isNewFocus = currentFocusId !== playerId;
    
    if (!isSplitMode && isNewFocus && focusMain) {
      focusMain.classList.add('focus-changing');
      setTimeout(() => {
        focusMain.classList.remove('focus-changing');
      }, 400);
    }
    
    currentFocusId = playerId;
    
    // En mode SPLIT, ne pas mettre à jour le focus (pas de zone focus visible)
    if (!isSplitMode) {
      const nameEl = document.getElementById('focusPlayerName');
      if (nameEl) {
        nameEl.textContent = focusedPlayer.name || 'Joueur';
      }
      
      focusMain.classList.remove('empty');
      attachFocusVideo(playerId);
    }
    
    // Update thumbnail highlights
    thumbElements.forEach((el, id) => {
      el.classList.toggle('is-focused', id === playerId);
    });
    
    // V3 GRILLE FIX: En mode SPLIT, ne PAS reconstruire les thumbs
    if (!isSplitMode) {
      rebuildThumbs(playerId);
    }
    
    log('Focus set to:', playerId, focusedPlayer.name, isManual ? '(manual)' : '(auto-speaker)', isSplitMode ? '[SPLIT-GRID]' : '[MAX]');
  }

  function rebuildThumbs(focusedId) {
    if (!window.videoModeCtrl) return;
    
    const participants = window.videoModeCtrl.getParticipants();
    
    // Détecter si on est en mode SPLIT
    const isSplitMode = container && container.classList.contains('mode-split');
    
    // V3 GRILLE FIX: Ne jamais reconstruire en mode SPLIT
    if (isSplitMode) {
      log('SPLIT MODE: Skipping rebuildThumbs');
      return;
    }
    
    // Clear
    thumbsSidebar.innerHTML = '';
    thumbElements.clear();
    
    // Recreate without focused player (mode MAX seulement)
    participants.forEach(p => {
      if (p.playerId === focusedId) return;
      
      const thumb = createThumbnail(p);
      thumbsSidebar.appendChild(thumb);
      thumbElements.set(p.playerId, thumb);
    });
    
    // Reattach tracks
    attachVideoTracks();
  }

  // ============================================
  // VIDEO TRACK ATTACHMENT
  // ============================================
  
  function attachVideoTracks() {
    // Get tracks from video-tracks.js registry
    const tracks = window.VideoTracksRegistry?.getAll() || getTracksFromGlobal();
    
    // Détecter si on est en mode SPLIT
    const isSplitMode = container && container.classList.contains('mode-split');
    
    tracks.forEach((track, playerId) => {
      // En mode SPLIT, TOUS les joueurs sont dans les thumbs
      if (!isSplitMode && playerId === currentFocusId) {
        attachFocusVideo(playerId);
      } else {
        attachThumbVideo(playerId, track);
      }
    });
  }

  function getTracksFromGlobal() {
    const result = new Map();
    
    // Check for LiveKit room
    const room = window.dailyVideo?.room;
    if (room) {
      // Local participant
      const localP = room.localParticipant;
      if (localP) {
        const localId = localP.identity;
        for (const [sid, pub] of localP.videoTrackPublications) {
          if (pub.track) {
            result.set(localId, pub.track);
          }
        }
      }
      
      // Remote participants
      for (const [id, participant] of room.remoteParticipants) {
        for (const [sid, pub] of participant.videoTrackPublications) {
          if (pub.track) {
            result.set(participant.identity, pub.track);
          }
        }
      }
    }
    
    return result;
  }

  function attachFocusVideo(playerId) {
    if (!focusMain) return;
    
    const track = getTrackForPlayer(playerId);
    if (!track) {
      log('No track for focus player:', playerId);
      return;
    }
    
    // Remove existing
    if (focusVideoEl && focusVideoEl.parentNode) {
      focusVideoEl.remove();
    }
    
    focusMain.classList.remove('empty');
    
    // LIVEKIT FIX: Use track.attach() for LiveKit tracks
    if (typeof track.attach === 'function') {
      focusVideoEl = track.attach();
      focusVideoEl.muted = isLocalPlayer(playerId);
      focusVideoEl.style.cssText = 'width:100%;height:100%;object-fit:contain;';
    } else {
      // Fallback: create video element
      focusVideoEl = document.createElement('video');
      focusVideoEl.autoplay = true;
      focusVideoEl.playsInline = true;
      focusVideoEl.muted = isLocalPlayer(playerId);
      focusVideoEl.style.cssText = 'width:100%;height:100%;object-fit:contain;';
      
      const stream = window.getMediaStreamFromTrack ? window.getMediaStreamFromTrack(track) : new MediaStream([track]);
      if (stream) {
        try {
          focusVideoEl.srcObject = stream;
        } catch (e) {
          focusVideoEl.src = URL.createObjectURL(stream);
        }
      }
    }
    
    // Insert before name overlay
    focusMain.insertBefore(focusVideoEl, focusNameEl);
    
    log('Focus video attached for:', playerId);
  }
  
  // V3 GRILLE FIX: Cache pour les éléments vidéo LiveKit
  const liveKitVideoCache = new Map();
  
  function getLiveKitVideoElement(playerId) {
    // V3 GRILLE FIX: Vérifier le cache d'abord
    if (liveKitVideoCache.has(playerId)) {
      const cached = liveKitVideoCache.get(playerId);
      // Vérifier que l'élément est toujours valide
      if (cached && cached.parentNode === null) {
        // L'élément existe mais n'est pas dans le DOM, on peut le réutiliser
        log('Using cached LiveKit video element for:', playerId);
        return cached;
      }
    }
    
    const room = window.dailyVideo?.room;
    if (!room) return null;
    
    // Check local participant
    const localP = room.localParticipant;
    if (localP && localP.identity === playerId) {
      for (const [sid, pub] of localP.videoTrackPublications) {
        if (pub.track) {
          log('Found local LiveKit track for:', playerId);
          const videoEl = pub.track.attach();
          liveKitVideoCache.set(playerId, videoEl);
          return videoEl;
        }
      }
    }
    
    // Check remote participants
    for (const [id, participant] of room.remoteParticipants) {
      if (participant.identity === playerId) {
        for (const [sid, pub] of participant.videoTrackPublications) {
          if (pub.track) {
            log('Found remote LiveKit track for:', playerId);
            const videoEl = pub.track.attach();
            liveKitVideoCache.set(playerId, videoEl);
            return videoEl;
          }
        }
      }
    }
    
    return null;
  }

  function attachThumbVideo(playerId, track) {
    const thumb = thumbElements.get(playerId);
    if (!thumb) return;
    
    thumb.classList.remove('empty');
    
    // V3 GRILLE FIX: Vérifier si une vidéo existe déjà et fonctionne
    const existingVideo = thumb.querySelector('video');
    if (existingVideo && existingVideo.srcObject && !existingVideo.paused) {
      // La vidéo existe et joue, ne pas la remplacer
      log('Thumb video already playing for:', playerId);
      return;
    }
    
    // Remove existing video if it exists but doesn't work
    if (existingVideo) existingVideo.remove();
    
    // LIVEKIT FIX: Try to get video element directly from LiveKit
    const liveKitVideo = getLiveKitVideoElement(playerId);
    if (liveKitVideo) {
      liveKitVideo.muted = true;
      liveKitVideo.style.cssText = 'width:100%;height:100%;object-fit:cover;';
      const nameEl = thumb.querySelector('.thumb-name');
      thumb.insertBefore(liveKitVideo, nameEl);
      liveKitVideo.play().catch(e => log('Thumb video play error:', e));
      log('Thumb video attached via LiveKit for:', playerId);
      return;
    }
    
    // Fallback: use provided track
    if (!track) return;
    
    // Create video
    const video = document.createElement('video');
    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;
    
    const stream = window.getMediaStreamFromTrack ? window.getMediaStreamFromTrack(track) : new MediaStream([track]);
    if (stream) {
      try {
        video.srcObject = stream;
      } catch (e) {
        video.src = URL.createObjectURL(stream);
      }
    }
    
    // Insert before name label
    const nameEl = thumb.querySelector('.thumb-name');
    thumb.insertBefore(video, nameEl);
  }

  function getTrackForPlayer(playerId) {
    // LIVEKIT FIX: Utiliser VideoTracksRegistry en priorité
    const registryTrack = window.VideoTracksRegistry?.get?.(playerId);
    if (registryTrack) {
      log('Track found in registry for:', playerId);
      return registryTrack;
    }
    
    // Fallback: get from LiveKit room directly
    const room = window.dailyVideo?.room;
    if (room) {
      // Local
      const localP = room.localParticipant;
      if (localP && localP.identity === playerId) {
        for (const [sid, pub] of localP.videoTrackPublications) {
          if (pub.track) return pub.track;
        }
      }
      
      // Remote
      for (const [id, participant] of room.remoteParticipants) {
        if (participant.identity === playerId) {
          for (const [sid, pub] of participant.videoTrackPublications) {
            if (pub.track) return pub.track;
          }
        }
      }
    }
    
    return null;
  }

  function isLocalPlayer(playerId) {
    const state = window.lastKnownState;
    const localId = state?.you?.playerId || window.playerId;
    return localId === playerId;
  }

  function getPlayerIdFromUserName(userName) {
    if (!userName) return '';
    const idx = userName.lastIndexOf('#');
    return idx !== -1 ? userName.slice(idx + 1).trim() : '';
  }

  // ============================================
  // SPEAKER HIGHLIGHTS
  // ============================================
  
  function updateSpeakerHighlights(speakerId) {
    // Update focus speaker badge
    const badge = document.getElementById('focusSpeakerBadge');
    if (badge) {
      badge.style.display = (speakerId === currentFocusId) ? 'inline-block' : 'none';
    }
    
    // Update focus main speaking state
    focusMain?.classList.toggle('is-speaking', speakerId === currentFocusId);
    
    // Update thumbnails in sidebar
    thumbElements.forEach((el, id) => {
      el.classList.toggle('is-speaking', id === speakerId);
    });
    
    // Update player-item highlights in INLINE mode
    updateInlineModeSpeakerHighlights(speakerId);
  }
  
  let lastLoggedSpeaker = null;
  function updateInlineModeSpeakerHighlights(speakerId) {
    // Retirer tous les anciens highlights
    document.querySelectorAll('.player-item.is-speaking').forEach(item => {
      item.classList.remove('is-speaking');
    });
    
    // Ajouter le nouveau highlight
    if (speakerId) {
      const playerItem = document.querySelector(`.player-item[data-player-id="${CSS.escape(speakerId)}"]`);
      if (playerItem) {
        playerItem.classList.add('is-speaking');
        if (speakerId !== lastLoggedSpeaker) {
          log('🎙️ INLINE highlight added to:', speakerId.slice(0, 8));
          lastLoggedSpeaker = speakerId;
        }
      }
    } else if (lastLoggedSpeaker !== null) {
      lastLoggedSpeaker = null;
    }
  }

  // ============================================
  // MICROPHONE / CAMERA CONTROLS
  // ============================================
  
  function syncControlStates() {
    // Sync with video-tracks.js button states
    const briefingMicBtn = document.getElementById('briefingMicBtn');
    const briefingCamBtn = document.getElementById('briefingCamBtn');
    const inlineMicBtn = document.getElementById('inlineMicBtn');
    const inlineCamBtn = document.getElementById('inlineCamBtn');
    
    if (briefingMicBtn && inlineMicBtn) {
      briefingMicBtn.textContent = inlineMicBtn.textContent;
      briefingMicBtn.style.background = inlineMicBtn.style.background;
    }
    
    if (briefingCamBtn && inlineCamBtn) {
      briefingCamBtn.textContent = inlineCamBtn.textContent;
      briefingCamBtn.style.background = inlineCamBtn.style.background;
    }
  }

  // ============================================
  // EXPORT API
  // ============================================
  
  window.VideoBriefingUI = {
    init,
    show,
    hide,
    isVisible,
    refreshParticipants,
    setFocus,
    
    // For external updates
    onTrackStarted: (playerId, track) => {
      if (isVisible()) {
        const isSplitMode = container && container.classList.contains('mode-split');
        // En mode SPLIT, toujours attacher aux thumbs
        if (isSplitMode || playerId !== currentFocusId) {
          attachThumbVideo(playerId, track);
        } else {
          attachFocusVideo(playerId);
        }
      }
    },
    
    onTrackStopped: (playerId) => {
      // V3 GRILLE FIX: Ne pas supprimer la vidéo, juste marquer comme empty
      if (playerId === currentFocusId) {
        focusMain?.classList.add('empty');
      } else {
        const thumb = thumbElements.get(playerId);
        if (thumb) {
          thumb.classList.add('empty');
          // Ne pas supprimer la vidéo - elle sera réattachée si le track revient
        }
      }
    }
  };

  // Auto-init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('[VideoBriefingUI] D4 Module loaded ✅ (V3 GRILLE FIX)');

})();
