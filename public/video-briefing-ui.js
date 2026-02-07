/**
 * VIDEO BRIEFING UI - V4 STABLE
 * =============================
 * 
 * FIX CRITIQUE: Les éléments vidéo LiveKit sont créés UNE SEULE FOIS
 * et réutilisés à chaque refresh. Plus de track.attach() multiples!
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
  
  // V4 STABLE: Cache PERSISTANT des éléments vidéo LiveKit
  // Clé: playerId, Valeur: HTMLVideoElement
  // Ces éléments ne sont JAMAIS supprimés, seulement déplacés dans le DOM
  const videoElementCache = new Map();
  
  // Mode tracking
  let lastKnownMode = null;
  let thumbsInitializedForSplit = false;

  // ============================================
  // INITIALIZATION
  // ============================================
  
  function init() {
    log('Initializing V4...');
    
    createContainer();
    bindEvents();
    
    log('Initialized V4');
  }

  function createContainer() {
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
      <div class="video-briefing-controls" id="briefingControls"></div>
    `;
    container.appendChild(header);
    
    // Content wrapper
    const content = document.createElement('div');
    content.className = 'video-briefing-content';
    
    // Focus wrapper
    focusWrapper = document.createElement('div');
    focusWrapper.className = 'video-focus-wrapper';
    
    focusMain = document.createElement('div');
    focusMain.className = 'video-focus-main empty';
    focusMain.id = 'videoFocusMain';
    
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
    document.body.appendChild(container);
    
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
          window.videoModeCtrl.cycleMode();
        } else {
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
    if (thumbsSidebar) {
      thumbsSidebar.addEventListener('wheel', (e) => {
        const { scrollTop, scrollHeight, clientHeight } = thumbsSidebar;
        const isAtTop = scrollTop === 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
        if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
          e.preventDefault();
        }
      }, { passive: false });
    }
    
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
  
  let activeScrollMonitor = null;
  
  function handleModeChange(data) {
    log('Mode change:', data);
    
    const { mode, phase } = data;
    const modeActuallyChanged = (lastKnownMode !== mode);
    lastKnownMode = mode;
    
    // Update phase badge
    const phaseBadge = document.getElementById('briefingPhaseBadge');
    if (phaseBadge) {
      phaseBadge.textContent = getPhaseLabel(phase);
    }
    
    // Update container class
    if (container) {
      container.classList.remove('mode-full', 'mode-split');
      if (mode === 'ADVANCED_FOCUS') {
        container.classList.add('mode-full');
        thumbsInitializedForSplit = false;
      } else if (mode === 'SPLIT') {
        container.classList.add('mode-split');
      }
    }
    
    updateBodyClass(mode);
    updateModeButtons(mode);
    
    if (mode === 'ADVANCED_FOCUS' || mode === 'SPLIT') {
      // Scroll coordination
      window.__briefingUIScrollLock = true;
      const scrollStart = window.pageYOffset || document.documentElement.scrollTop;
      
      const originalScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';
      
      if (activeScrollMonitor) {
        clearInterval(activeScrollMonitor);
        activeScrollMonitor = null;
      }
      
      // V4: Appeler show() - il gère la logique de refresh
      show(modeActuallyChanged);
      
      updateExpandButton(false);
      
      // Restore scroll
      requestAnimationFrame(() => {
        window.scrollTo({ top: scrollStart, behavior: 'auto' });
        requestAnimationFrame(() => {
          window.scrollTo({ top: scrollStart, behavior: 'auto' });
          setTimeout(() => {
            window.scrollTo({ top: scrollStart, behavior: 'auto' });
            window.__briefingUIScrollLock = false;
            document.documentElement.style.scrollBehavior = originalScrollBehavior;
            document.body.style.scrollBehavior = originalScrollBehavior;
          }, 50);
        });
      });
      
    } else if (mode === 'INLINE' || mode === 'OFF' || mode === 'HIDDEN') {
      hide();
      updateExpandButton(mode === 'INLINE');
      thumbsInitializedForSplit = false;
    }
  }

  function getPhaseLabel(phase) {
    const labels = {
      'DEBATE': 'DÉBAT', 'VOTING': 'VOTE', 'DAY_DEBATE': 'DÉBAT',
      'DAY_VOTE': 'VOTE', 'DISCUSSION': 'DISCUSSION', 'GAME_OVER': 'FIN',
      'ROLE_REVEAL': 'RÉVÉLATION', 'CAPTAIN_CANDIDACY': 'CANDIDATURES',
      'CAPTAIN_VOTE': 'ÉLECTION', 'CAPTAIN_RESULT': 'RÉSULTAT',
      'DAY': 'JOUR', 'DAY_DISCUSSION': 'DISCUSSION',
      'EJECTION_REVEAL': 'ÉJECTION', 'FINAL_VOTE': 'VOTE FINAL'
    };
    return labels[phase] || phase || 'BRIEFING';
  }

  function updateModeButtons(mode) {
    const maxBtn = document.getElementById('btnVideoMax');
    const splitBtn = document.getElementById('btnVideoSplit');
    
    if (maxBtn) maxBtn.classList.toggle('active', mode === 'ADVANCED_FOCUS');
    if (splitBtn) splitBtn.classList.toggle('active', mode === 'SPLIT');
    
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    if (mobileCloseBtn) {
      mobileCloseBtn.style.display = (mode === 'SPLIT' || mode === 'ADVANCED_FOCUS') ? 'flex' : 'none';
    }
  }

  function handleFocusChange(data) {
    log('Focus change:', data);
    setFocus(data.playerId, data.isManual);
  }

  function handleActiveSpeakerChange(data) {
    log('Active speaker:', data);
    window.__currentActiveSpeaker = data.playerId;
    updateSpeakerHighlights(data.playerId);
  }
  
  window.reapplySpeakerHighlight = function() {
    if (window.__currentActiveSpeaker) {
      updateInlineModeSpeakerHighlights(window.__currentActiveSpeaker);
    }
  };

  // ============================================
  // VISIBILITY
  // ============================================
  
  function show(forceRefresh = false) {
    if (!container) init();
    
    container.classList.add('active');
    container.style.display = '';
    
    const floatingActions = document.getElementById('floatingVideoActions');
    if (floatingActions) floatingActions.style.display = 'flex';
    
    const isSplitMode = container.classList.contains('mode-split');
    const participants = window.videoModeCtrl?.getParticipants() || [];
    
    // V4: Logique simplifiée - on refresh SEULEMENT si vraiment nécessaire
    if (isSplitMode) {
      const currentThumbCount = thumbElements.size;
      const participantCount = participants.length;
      const needsStructuralRefresh = forceRefresh || !thumbsInitializedForSplit || currentThumbCount !== participantCount;
      
      if (needsStructuralRefresh) {
        log('V4 SPLIT: Structural refresh needed (force:', forceRefresh, 'init:', thumbsInitializedForSplit, 'thumbs:', currentThumbCount, 'participants:', participantCount, ')');
        refreshParticipants();
        thumbsInitializedForSplit = true;
      } else {
        log('V4 SPLIT: Structure OK - just ensuring videos are attached');
        // V4: Ne PAS recréer les éléments vidéo, juste s'assurer qu'ils sont dans les bons thumbs
        ensureVideosInThumbs();
      }
    } else {
      refreshParticipants();
    }
    
    syncControlStates();
    log('Briefing UI shown');
  }

  function hide() {
    if (!container) return;
    container.classList.remove('active');
    container.style.display = 'none';
    
    const floatingActions = document.getElementById('floatingVideoActions');
    if (floatingActions) floatingActions.style.display = 'none';
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    if (mobileCloseBtn) mobileCloseBtn.style.display = 'none';
    
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
    expandBtn.classList.toggle('visible', visible);
  }

  // ============================================
  // PARTICIPANTS MANAGEMENT
  // ============================================
  
  function refreshParticipants() {
    if (!window.videoModeCtrl) return;
    
    const participants = window.videoModeCtrl.getParticipants();
    const currentFocus = window.videoModeCtrl.getFocusedPlayerId();
    const isSplitMode = container && container.classList.contains('mode-split');
    
    log('V4 Refreshing participants:', participants.length, 'mode:', isSplitMode ? 'SPLIT-GRID' : 'FOCUS');
    
    // Clear thumbs (mais PAS le cache vidéo!)
    thumbsSidebar.innerHTML = '';
    thumbElements.clear();
    
    // Create thumbs
    participants.forEach(p => {
      if (!isSplitMode && p.playerId === currentFocus) return;
      
      const thumb = createThumbnail(p);
      thumbsSidebar.appendChild(thumb);
      thumbElements.set(p.playerId, thumb);
    });
    
    // Focus (mode MAX only)
    if (!isSplitMode) {
      if (currentFocus) {
        setFocus(currentFocus, false);
      } else if (participants.length > 0) {
        setFocus(participants[0].playerId, false);
      }
    }
    
    // V4: Attacher les vidéos depuis le cache ou en créer de nouvelles
    attachAllVideos();
  }

  function createThumbnail(participant) {
    const thumb = document.createElement('div');
    thumb.className = 'video-thumb empty';
    thumb.dataset.playerId = participant.playerId;
    
    const nameEl = document.createElement('div');
    nameEl.className = 'thumb-name';
    nameEl.textContent = participant.name || 'Joueur';
    thumb.appendChild(nameEl);
    
    thumb.addEventListener('click', () => {
      const isSplitMode = container && container.classList.contains('mode-split');
      if (!isSplitMode && window.videoModeCtrl) {
        window.videoModeCtrl.setManualFocus(participant.playerId);
      }
    });
    
    const state = window.lastKnownState;
    const isGameOver = state?.phase === 'GAME_OVER';
    if (!participant.alive && !isGameOver) {
      thumb.classList.add('is-dead');
    }
    
    return thumb;
  }

  // ============================================
  // V4: VIDEO ELEMENT MANAGEMENT
  // ============================================
  
  /**
   * V4 CRITIQUE: Obtenir ou créer un élément vidéo pour un joueur
   * L'élément est créé UNE SEULE FOIS et réutilisé
   */
  function getOrCreateVideoElement(playerId) {
    // Vérifier le cache d'abord
    if (videoElementCache.has(playerId)) {
      const cached = videoElementCache.get(playerId);
      // Vérifier que l'élément est toujours valide (pas détruit)
      if (cached && cached.tagName === 'VIDEO') {
        log('V4: Using cached video element for:', playerId.slice(0,8));
        return cached;
      }
    }
    
    // Créer un nouvel élément via LiveKit
    const room = window.dailyVideo?.room;
    if (!room) {
      log('V4: No room available');
      return null;
    }
    
    let videoEl = null;
    
    // Check local participant
    const localP = room.localParticipant;
    if (localP && localP.identity === playerId) {
      for (const [sid, pub] of localP.videoTrackPublications) {
        if (pub.track) {
          videoEl = pub.track.attach();
          log('V4: Created NEW video element (local) for:', playerId.slice(0,8));
          break;
        }
      }
    }
    
    // Check remote participants
    if (!videoEl) {
      for (const [id, participant] of room.remoteParticipants) {
        if (participant.identity === playerId) {
          for (const [sid, pub] of participant.videoTrackPublications) {
            if (pub.track) {
              videoEl = pub.track.attach();
              log('V4: Created NEW video element (remote) for:', playerId.slice(0,8));
              break;
            }
          }
          if (videoEl) break;
        }
      }
    }
    
    // Stocker dans le cache si créé
    if (videoEl) {
      videoElementCache.set(playerId, videoEl);
      log('V4: Cached video element for:', playerId.slice(0,8), 'Total cached:', videoElementCache.size);
    }
    
    return videoEl;
  }
  
  /**
   * V4: Attacher toutes les vidéos aux thumbs
   */
  function attachAllVideos() {
    const isSplitMode = container && container.classList.contains('mode-split');
    const participants = window.videoModeCtrl?.getParticipants() || [];
    
    participants.forEach(p => {
      if (!isSplitMode && p.playerId === currentFocusId) {
        attachFocusVideo(p.playerId);
      } else {
        attachThumbVideoV4(p.playerId);
      }
    });
  }
  
  /**
   * V4: S'assurer que les vidéos sont dans les bons thumbs (sans recréer)
   */
  function ensureVideosInThumbs() {
    thumbElements.forEach((thumb, playerId) => {
      const existingVideo = thumb.querySelector('video');
      
      // Si une vidéo existe et joue, ne rien faire
      if (existingVideo && existingVideo.readyState >= 2 && !existingVideo.paused) {
        log('V4: Video already playing in thumb for:', playerId.slice(0,8));
        return;
      }
      
      // Sinon, attacher (ou réattacher) la vidéo
      attachThumbVideoV4(playerId);
    });
  }
  
  /**
   * V4: Attacher une vidéo à un thumb en utilisant le cache
   */
  function attachThumbVideoV4(playerId) {
    const thumb = thumbElements.get(playerId);
    if (!thumb) return;
    
    // Obtenir l'élément vidéo (depuis cache ou nouveau)
    const videoEl = getOrCreateVideoElement(playerId);
    if (!videoEl) {
      log('V4: No video element available for:', playerId.slice(0,8));
      return;
    }
    
    thumb.classList.remove('empty');
    
    // Vérifier si cette vidéo est déjà dans ce thumb
    const existingVideo = thumb.querySelector('video');
    if (existingVideo === videoEl) {
      log('V4: Video already in correct thumb for:', playerId.slice(0,8));
      // Juste s'assurer qu'elle joue
      if (videoEl.paused) {
        videoEl.play().catch(e => log('V4: Play error:', e));
      }
      return;
    }
    
    // Retirer l'ancienne vidéo si différente
    if (existingVideo && existingVideo !== videoEl) {
      existingVideo.remove();
    }
    
    // Configurer la vidéo
    videoEl.muted = true;
    videoEl.autoplay = true;
    videoEl.playsInline = true;
    videoEl.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    
    // Insérer avant le nom
    const nameEl = thumb.querySelector('.thumb-name');
    thumb.insertBefore(videoEl, nameEl);
    
    // Forcer la lecture
    videoEl.play().catch(e => log('V4: Play error:', e));
    
    log('V4: Video attached to thumb for:', playerId.slice(0,8));
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
    
    const isSplitMode = container && container.classList.contains('mode-split');
    const isNewFocus = currentFocusId !== playerId;
    
    if (!isSplitMode && isNewFocus && focusMain) {
      focusMain.classList.add('focus-changing');
      setTimeout(() => focusMain.classList.remove('focus-changing'), 400);
    }
    
    currentFocusId = playerId;
    
    if (!isSplitMode) {
      const nameEl = document.getElementById('focusPlayerName');
      if (nameEl) nameEl.textContent = focusedPlayer.name || 'Joueur';
      
      focusMain.classList.remove('empty');
      attachFocusVideo(playerId);
    }
    
    thumbElements.forEach((el, id) => {
      el.classList.toggle('is-focused', id === playerId);
    });
    
    if (!isSplitMode) {
      rebuildThumbs(playerId);
    }
    
    log('Focus set to:', playerId.slice(0,8), focusedPlayer.name, isManual ? '(manual)' : '(auto)', isSplitMode ? '[SPLIT]' : '[MAX]');
  }

  function rebuildThumbs(focusedId) {
    if (!window.videoModeCtrl) return;
    
    const isSplitMode = container && container.classList.contains('mode-split');
    if (isSplitMode) {
      log('V4: Skipping rebuildThumbs in SPLIT mode');
      return;
    }
    
    const participants = window.videoModeCtrl.getParticipants();
    
    thumbsSidebar.innerHTML = '';
    thumbElements.clear();
    
    participants.forEach(p => {
      if (p.playerId === focusedId) return;
      
      const thumb = createThumbnail(p);
      thumbsSidebar.appendChild(thumb);
      thumbElements.set(p.playerId, thumb);
    });
    
    attachAllVideos();
  }
  
  function attachFocusVideo(playerId) {
    if (!focusMain) return;
    
    const videoEl = getOrCreateVideoElement(playerId);
    if (!videoEl) {
      log('V4: No video for focus:', playerId);
      return;
    }
    
    // Remove existing if different
    if (focusVideoEl && focusVideoEl !== videoEl && focusVideoEl.parentNode) {
      focusVideoEl.remove();
    }
    
    focusMain.classList.remove('empty');
    
    // Check if local
    const state = window.lastKnownState;
    const localId = state?.you?.playerId || window.playerId;
    const isLocal = localId === playerId;
    
    videoEl.muted = isLocal;
    videoEl.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block;';
    
    focusMain.insertBefore(videoEl, focusNameEl);
    focusVideoEl = videoEl;
    
    videoEl.play().catch(e => log('V4: Focus play error:', e));
    
    log('V4: Focus video attached for:', playerId.slice(0,8));
  }

  // ============================================
  // SPEAKER HIGHLIGHTS
  // ============================================
  
  function updateSpeakerHighlights(speakerId) {
    const badge = document.getElementById('focusSpeakerBadge');
    if (badge) {
      badge.style.display = (speakerId === currentFocusId) ? 'inline-block' : 'none';
    }
    
    focusMain?.classList.toggle('is-speaking', speakerId === currentFocusId);
    
    thumbElements.forEach((el, id) => {
      el.classList.toggle('is-speaking', id === speakerId);
    });
    
    updateInlineModeSpeakerHighlights(speakerId);
  }
  
  let lastLoggedSpeaker = null;
  function updateInlineModeSpeakerHighlights(speakerId) {
    document.querySelectorAll('.player-item.is-speaking').forEach(item => {
      item.classList.remove('is-speaking');
    });
    
    if (speakerId) {
      const playerItem = document.querySelector(`.player-item[data-player-id="${CSS.escape(speakerId)}"]`);
      if (playerItem) {
        playerItem.classList.add('is-speaking');
        if (speakerId !== lastLoggedSpeaker) {
          log('🎙️ INLINE highlight:', speakerId.slice(0, 8));
          lastLoggedSpeaker = speakerId;
        }
      }
    } else if (lastLoggedSpeaker !== null) {
      lastLoggedSpeaker = null;
    }
  }

  // ============================================
  // CONTROLS SYNC
  // ============================================
  
  function syncControlStates() {
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
    
    // V4: API pour les événements externes
    onTrackStarted: (playerId, track) => {
      log('V4: onTrackStarted for:', playerId?.slice(0,8));
      
      // Invalider le cache pour ce joueur (nouvelle track)
      if (videoElementCache.has(playerId)) {
        log('V4: Invalidating cached video for new track:', playerId.slice(0,8));
        videoElementCache.delete(playerId);
      }
      
      if (isVisible()) {
        const isSplitMode = container && container.classList.contains('mode-split');
        if (isSplitMode || playerId !== currentFocusId) {
          attachThumbVideoV4(playerId);
        } else {
          attachFocusVideo(playerId);
        }
      }
    },
    
    onTrackStopped: (playerId) => {
      log('V4: onTrackStopped for:', playerId?.slice(0,8));
      
      // Invalider le cache
      videoElementCache.delete(playerId);
      
      if (playerId === currentFocusId) {
        focusMain?.classList.add('empty');
      } else {
        const thumb = thumbElements.get(playerId);
        if (thumb) {
          thumb.classList.add('empty');
        }
      }
    },
    
    // V4: Debug - voir l'état du cache
    getVideoCache: () => {
      return {
        size: videoElementCache.size,
        keys: Array.from(videoElementCache.keys()).map(k => k.slice(0,8))
      };
    }
  };

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('[VideoBriefingUI] D4 Module loaded ✅ (V4 STABLE)');

})();
