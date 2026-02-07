/**
 * VIDEO BRIEFING UI - D5 V3.23 ULTIMATE FIX
 * ===========================================
 * 
 * VERSION: 3.23 ULTIMATE FIX
 * BUILD: 2026-01-15 23:00 UTC
 * 
 * Gère le DOM et le rendu du mode "Salle de Briefing".
 * Écoute les événements du VideoModeController et met à jour l'interface.
 * 
 * Responsabilités:
 * - Créer/détruire le DOM du mode briefing
 * - Attacher les flux vidéo aux éléments
 * - Gérer les interactions utilisateur (clic thumbnail, boutons)
 * - Synchroniser avec video-tracks.js
 * - [V3.21] COORDINATION avec client.js via flag global
 * - [V3.22] ABSOLUTE - Container vidéo ne POUSSE PAS le contenu
 * - [V3.23] ULTIMATE - TOUS les padding-top supprimés (desktop + mobile + tablette)
 */

(function() {
  'use strict';

  // V41: Logs de version conditionnels
  if (window.SABOTEUR_DEBUG) {
    console.log('%c🔥🔥🔥 VIDEO BRIEFING UI V3.23 ULTIMATE FIX LOADED 🔥🔥🔥', 
      'background: #ff00ff; color: #ffffff; font-size: 20px; font-weight: bold; padding: 10px;');
    console.log('%cBuild: 2026-01-15 23:00 UTC | Fix: TOUS padding-top supprimés (5 occurrences)', 
      'background: #0088ff; color: #ffffff; font-size: 14px; padding: 5px;');
  }

  // V41: Debug conditionnel
  const DEBUG = window.SABOTEUR_DEBUG || false;
  
  function log(...args) {
    if (DEBUG) console.log('[BriefingUI]', ...args);
  }

  // ============================================
  // DOM REFERENCES
  // ============================================
  
  let container = null;
  let focusWrapper = null;
  let focusMain = null;
  let focusNameEl = null;
  let thumbsSidebar = null;
  let headerEl = null;
  let exitBtn = null;
  let expandBtn = null; // Mobile expand button
  
  // Track elements
  const thumbElements = new Map(); // playerId -> DOM element
  let focusVideoEl = null;
  
  // State
  let isInitialized = false;
  let currentFocusId = null;

  // ============================================
  // INITIALIZATION
  // ============================================
  
  function init() {
    if (isInitialized) return;
    
    createDOM();
    bindEvents();
    
    isInitialized = true;
    log('UI initialized');
  }

  function createDOM() {
    // Main container
    container = document.createElement('div');
    container.className = 'video-briefing-container';
    container.id = 'videoBriefingContainer';
    
    // Header (sans les boutons - ils seront séparés pour éviter le problème z-index)
    headerEl = document.createElement('div');
    headerEl.className = 'video-briefing-header';
    headerEl.innerHTML = `
      <div class="video-briefing-title">
        <span class="icon">🎥</span>
        <span class="text" data-i18n="briefingTitle">SALLE DE BRIEFING</span>
        <span class="phase-badge" id="briefingPhaseBadge">DÉBAT</span>
      </div>
      <div class="video-briefing-actions-placeholder"></div>
    `;
    container.appendChild(headerEl);
    
    // V40: Boutons flottants HORS du container (pour éviter le problème de z-index avec transform)
    const floatingActions = document.createElement('div');
    floatingActions.id = 'floatingVideoActions';
    floatingActions.className = 'video-briefing-actions floating-actions';
    floatingActions.style.cssText = `
      position: fixed !important;
      top: 10px !important;
      right: 180px !important;
      z-index: 10700 !important;
      display: none;
      gap: 10px;
      background: rgba(0,0,0,0.8);
      padding: 6px 10px;
      border-radius: 12px;
      border: 1px solid rgba(0,255,255,0.3);
    `;
    floatingActions.innerHTML = `
      <button class="video-briefing-btn btn-expand" id="briefingExpandBtn" title="Plein écran">
        ⬆ Max
      </button>
      <button class="video-briefing-btn btn-split" id="briefingSplitBtn" title="Mode 50/50">
        ⬕ Split
      </button>
      <button class="video-briefing-btn btn-exit" id="briefingExitBtn" title="Fermer la visio">
        ✕ Fermer
      </button>
    `;
    document.body.appendChild(floatingActions);
    
    // V40: Media query pour mobile - CACHER les boutons (utiliser double-tap)
    const mobileStyle = document.createElement('style');
    mobileStyle.textContent = `
      @media (max-width: 768px) {
        #floatingVideoActions {
          display: none !important;
        }
      }
      @media (min-width: 769px) {
        #mobileCloseBtn {
          display: none !important;
        }
      }
      /* V40c: Indicateur de double-tap sur mobile */
      @media (max-width: 768px) {
        .video-briefing-container.active::after {
          content: "Double-tap = Max / Split";
          position: fixed;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.7);
          color: rgba(255,255,255,0.7);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          z-index: 10000;
          pointer-events: none;
          opacity: 0;
          animation: fadeHint 4s ease-in-out;
        }
        @keyframes fadeHint {
          0% { opacity: 0; }
          10% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
      }
    `;
    document.head.appendChild(mobileStyle);
    
    // V40: Bouton X pour fermer sur mobile - très petit, au-dessus du bouton Visio
    const mobileCloseBtn = document.createElement('button');
    mobileCloseBtn.id = 'mobileCloseBtn';
    mobileCloseBtn.innerHTML = '✕';
    mobileCloseBtn.title = 'Fermer la visio';
    mobileCloseBtn.style.cssText = `
      position: fixed !important;
      bottom: 65px !important;
      left: 12px !important;
      z-index: 10700 !important;
      display: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: rgba(255, 60, 60, 0.95);
      border: 1px solid rgba(255, 80, 80, 1);
      color: white;
      font-size: 0.65rem;
      font-weight: bold;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      padding: 0;
      line-height: 1;
    `;
    mobileCloseBtn.addEventListener('click', () => {
      log('Mobile close button clicked');
      if (window.videoModeCtrl) {
        window.videoModeCtrl.setInlineMode();
      }
    });
    document.body.appendChild(mobileCloseBtn);
    
    // Focus wrapper
    focusWrapper = document.createElement('div');
    focusWrapper.className = 'video-focus-wrapper';
    
    // Main focus video
    focusMain = document.createElement('div');
    focusMain.className = 'video-focus-main empty';
    focusMain.id = 'videoFocusMain';
    
    // Focus name overlay
    focusNameEl = document.createElement('div');
    focusNameEl.className = 'video-focus-name';
    focusNameEl.innerHTML = `
      <span class="name" id="focusPlayerName">—</span>
      <span class="badge-speaker" id="focusSpeakerBadge" style="display:none;">PARLE</span>
    `;
    focusMain.appendChild(focusNameEl);
    
    focusWrapper.appendChild(focusMain);
    container.appendChild(focusWrapper);
    
    // Thumbnails sidebar
    thumbsSidebar = document.createElement('div');
    thumbsSidebar.className = 'video-thumbs-sidebar';
    thumbsSidebar.id = 'videoThumbsSidebar';
    container.appendChild(thumbsSidebar);
    
    // Add to body
    document.body.appendChild(container);
    
    // Mobile expand button (separate from container)
    expandBtn = document.createElement('button');
    expandBtn.className = 'video-expand-btn';
    expandBtn.id = 'videoExpandBtn';
    expandBtn.innerHTML = `
      <span class="icon">⤢</span>
      <span class="text">Agrandir visio</span>
    `;
    document.body.appendChild(expandBtn);
    
    // Cache exit button reference
    exitBtn = document.getElementById('briefingExitBtn');
    
    log('DOM created');
  }

  function bindEvents() {
    // Exit button (fermer complètement)
    exitBtn = document.getElementById('briefingExitBtn');
    if (exitBtn) {
      exitBtn.addEventListener('click', () => {
        log('Exit button clicked');
        if (window.videoModeCtrl) {
          window.videoModeCtrl.setInlineMode();
        }
      });
    }
    
    // V32: Boutons mic/cam supprimés - utiliser les contrôles des mini-vidéos
    
    // Expand button (plein écran)
    const expandBtn2 = document.getElementById('briefingExpandBtn');
    if (expandBtn2) {
      expandBtn2.addEventListener('click', () => {
        log('Expand to full button clicked');
        if (window.videoModeCtrl) {
          window.videoModeCtrl.setFullMode();
        }
      });
    }
    
    // Split button (50/50)
    const splitBtn = document.getElementById('briefingSplitBtn');
    if (splitBtn) {
      splitBtn.addEventListener('click', () => {
        log('Split button clicked');
        if (window.videoModeCtrl) {
          window.videoModeCtrl.setSplitMode();
        }
      });
    }
    
    // Expand button (mobile - dans le jeu)
    if (expandBtn) {
      expandBtn.addEventListener('click', () => {
        log('Expand button clicked');
        if (window.videoModeCtrl) {
          // Par défaut, ouvrir en mode split
          window.videoModeCtrl.setSplitMode();
          window.videoModeCtrl.mobileManuallyActivated = true;
        }
      });
    }
    
    // ESC key to exit
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isVisible()) {
        log('ESC pressed, closing briefing');
        if (window.videoModeCtrl) {
          window.videoModeCtrl.setInlineMode();
        }
      }
    });
    
    // V40c: Double-tap sur mobile pour basculer Max <-> Split
    // Écouter sur document.body car le tap peut être sur un élément enfant
    let lastTap = 0;
    let tapTimeout = null;
    
    document.body.addEventListener('touchend', (e) => {
      // V40b: Ne réagir que si le container visio est actif
      if (!container || !container.classList.contains('active')) {
        return;
      }
      
      // Ignorer si on tape sur un bouton, une vidéo cliquable, ou en dehors du container
      if (e.target.closest('button') || 
          e.target.closest('.video-thumb') ||
          e.target.closest('#mobileCloseBtn') ||
          e.target.closest('#floatingVideoActions')) {
        return;
      }
      
      // Vérifier qu'on tape bien dans la zone vidéo
      const isInVideoArea = e.target.closest('.video-briefing-container') ||
                           e.target.closest('.video-focus-wrapper') ||
                           e.target.closest('.video-focus-main');
      if (!isInVideoArea) {
        return;
      }
      
      const now = Date.now();
      const timeSince = now - lastTap;
      
      if (timeSince < 300 && timeSince > 0) {
        // Double tap détecté !
        e.preventDefault();
        clearTimeout(tapTimeout);
        
        log('Double-tap detected - toggling Max <-> Split');
        
        if (window.videoModeCtrl) {
          // Détecter le mode actuel par la classe CSS
          const isSplitMode = container.classList.contains('mode-split');
          
          if (isSplitMode) {
            // Split → Max
            log('Switching from SPLIT to FULL');
            window.videoModeCtrl.setFullMode();
          } else {
            // Max → Split
            log('Switching from FULL to SPLIT');
            window.videoModeCtrl.setSplitMode();
          }
        }
      } else {
        // Premier tap - attendre un éventuel second tap
        tapTimeout = setTimeout(() => {
          // Simple tap - ne rien faire
        }, 300);
      }
      
      lastTap = now;
    }, { passive: false });
    
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
          // V41 FIX: Ne plus spammer la console - on log juste à la fin
        }
      }, 10); // Check toutes les 10ms
      
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
      console.log('[V3.21] 🎬 Appel show()...');
      show();
      console.log('[V3.21] ✓ show() terminé');
      
      updateExpandButton(false);
      
      // ÉTAPE 7: Restauration multi-tentatives + libération du flag
      
      // Tentative immédiate
      requestAnimationFrame(() => {
        forceScrollRestore('RAF-1');
        
        // Tentative après 1 frame
        requestAnimationFrame(() => {
          forceScrollRestore('RAF-2');
          
          // Tentative après 2 frames
          requestAnimationFrame(() => {
            forceScrollRestore('RAF-3');
            
            // Tentatives avec délais
            setTimeout(() => {
              forceScrollRestore('Timeout-10ms');
            }, 10);
            
            setTimeout(() => {
              forceScrollRestore('Timeout-50ms');
            }, 50);
            
            setTimeout(() => {
              forceScrollRestore('Timeout-100ms');
            }, 100);
            
            // ÉTAPE 8: Attendre 200ms PUIS libérer le flag (permet à client.js d'agir si nécessaire)
            setTimeout(() => {
              forceScrollRestore('Timeout-200ms-final');
              
              // LIBÉRER LE FLAG
              window.__briefingUIScrollLock = false;
              console.log('[V3.21] 🔓 Flag de coordination libéré - client.js peut agir');
              
              // Arrêter le monitoring
              // V41 FIX: Utiliser la variable de module
              if (activeScrollMonitor) {
                clearInterval(activeScrollMonitor);
                activeScrollMonitor = null;
              }
              
              const scrollEnd = window.pageYOffset || document.documentElement.scrollTop;
              console.log('%c📊 V3.21: RAPPORT FINAL COORDINATION', 
                'background: #0088ff; color: #ffffff; font-size: 14px; font-weight: bold; padding: 5px;');
              console.log('[V3.21] Position finale:', scrollEnd);
              console.log('[V3.21] Delta total:', scrollEnd - scrollStart);
              console.log('[V3.21] Changements détectés:', scrollChanges.length);
              // V41 FIX: Ne plus afficher la table complète (spam)
              // console.table est disponible en mode debug si nécessaire
              
              // Restaurer smooth scroll
              document.documentElement.style.scrollBehavior = originalScrollBehavior;
              document.body.style.scrollBehavior = originalScrollBehavior;
              
              if (scrollEnd === scrollStart) {
                console.log('%c✅ V3.21: SUCCÈS - SCROLL STABLE (COORDINATION)', 
                  'background: #00ff00; color: #000000; font-size: 16px; font-weight: bold; padding: 5px;');
              } else {
                console.error('%c❌ V3.21: ÉCHEC - SCROLL A BOUGÉ', 
                  'background: #ff0000; color: #ffffff; font-size: 16px; font-weight: bold; padding: 5px;');
              }
            }, 200);
          });
        });
      });
      
    } else {
      // ============================================
      // V3.21 COORDINATION: SCROLL FIX POUR HIDE
      // ============================================
      
      console.log('[V3.21] 🔽 MODE HIDE - Début fix scroll');
      
      // ACTIVER LE FLAG
      window.__briefingUIScrollLock = true;
      console.log('[V3.21] 🔒 Flag activé pour HIDE');
      
      const scrollStart = window.pageYOffset || document.documentElement.scrollTop;
      
      hide();
      
      // Show expand button if conditions allow advanced mode
      const ctrl = window.videoModeCtrl;
      if (ctrl && ctrl.canActivateAdvanced() && ctrl.isVideoJoined) {
        updateExpandButton(true);
      } else {
        updateExpandButton(false);
      }
      
      // Restauration pour hide + libération du flag
      requestAnimationFrame(() => {
        const scrollEnd = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollEnd !== scrollStart) {
          window.scrollTo(0, scrollStart);
          console.log('[V3.21] ✅ Scroll restauré après hide:', scrollStart);
        }
        
        // Libérer le flag après hide
        setTimeout(() => {
          window.__briefingUIScrollLock = false;
          console.log('[V3.21] 🔓 Flag libéré après HIDE');
        }, 100);
      });
    }
  }
  
  function updateModeButtons(mode) {
    const expandBtn2 = document.getElementById('briefingExpandBtn');
    const splitBtn = document.getElementById('briefingSplitBtn');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    
    if (expandBtn2) {
      expandBtn2.classList.toggle('active', mode === 'ADVANCED_FOCUS');
      expandBtn2.disabled = mode === 'ADVANCED_FOCUS';
    }
    if (splitBtn) {
      splitBtn.classList.toggle('active', mode === 'SPLIT');
      splitBtn.disabled = mode === 'SPLIT';
    }
    
    // V40b: Afficher le bouton X seulement en mode FULL ou SPLIT (pas en INLINE)
    if (mobileCloseBtn) {
      const isExpandedMode = (mode === 'ADVANCED_FOCUS' || mode === 'SPLIT' || mode === 'FULL');
      mobileCloseBtn.style.display = isExpandedMode ? 'flex' : 'none';
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
  
  function show() {
    if (!container) init();
    
    container.classList.add('active');
    // CAPTAIN_RESULT FIX: Remettre display pour afficher le container
    container.style.display = '';
    
    // V40: Afficher les boutons flottants (PC)
    const floatingActions = document.getElementById('floatingVideoActions');
    if (floatingActions) floatingActions.style.display = 'flex';
    // V40b: Le bouton X mobile est géré par updateModeButtons()
    
    refreshParticipants();
    syncControlStates(); // D4: Synchroniser l'état des boutons micro/caméra
    log('Briefing UI shown');
  }

  function hide() {
    if (!container) return;
    container.classList.remove('active');
    // CAPTAIN_RESULT FIX: Forcer display:none pour vraiment cacher le container
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
    
    log('Refreshing participants:', participants.length);
    
    // Clear existing thumbs
    thumbsSidebar.innerHTML = '';
    thumbElements.clear();
    
    // Create thumbnail for each participant
    participants.forEach(p => {
      if (p.playerId === currentFocus) return; // Skip focused player in thumbs
      
      const thumb = createThumbnail(p);
      thumbsSidebar.appendChild(thumb);
      thumbElements.set(p.playerId, thumb);
    });
    
    // Set focus
    if (currentFocus) {
      setFocus(currentFocus, false);
    } else if (participants.length > 0) {
      // Auto-focus first participant
      setFocus(participants[0].playerId, false);
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
    
    // Click to focus
    thumb.addEventListener('click', () => {
      log('Thumbnail clicked:', participant.playerId);
      if (window.videoModeCtrl) {
        window.videoModeCtrl.setManualFocus(participant.playerId);
      }
    });
    
    // Mark if dead (but not at GAME_OVER - everyone visible for debrief)
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
    
    // D5: Animation de transition si le focus change
    const isNewFocus = currentFocusId !== playerId;
    
    if (isNewFocus && focusMain) {
      // Ajouter la classe d'animation
      focusMain.classList.add('focus-changing');
      
      // Retirer après l'animation
      setTimeout(() => {
        focusMain.classList.remove('focus-changing');
      }, 400);
    }
    
    currentFocusId = playerId;
    
    // Update focus name
    const nameEl = document.getElementById('focusPlayerName');
    if (nameEl) {
      nameEl.textContent = focusedPlayer.name || 'Joueur';
    }
    
    // Update focus video
    focusMain.classList.remove('empty');
    attachFocusVideo(playerId);
    
    // Update thumbnail highlights
    thumbElements.forEach((el, id) => {
      el.classList.toggle('is-focused', id === playerId);
    });
    
    // Rebuild thumbs to exclude focused player
    rebuildThumbs(playerId);
    
    // D5: Log avec indication si manuel ou auto
    log('Focus set to:', playerId, focusedPlayer.name, isManual ? '(manual)' : '(auto-speaker)');
  }

  function rebuildThumbs(focusedId) {
    if (!window.videoModeCtrl) return;
    
    const participants = window.videoModeCtrl.getParticipants();
    
    // Clear
    thumbsSidebar.innerHTML = '';
    thumbElements.clear();
    
    // Recreate without focused player
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
    
    tracks.forEach((track, playerId) => {
      if (playerId === currentFocusId) {
        attachFocusVideo(playerId);
      } else {
        attachThumbVideo(playerId, track);
      }
    });
  }

  function getTracksFromGlobal() {
    // Fallback: try to find tracks from existing video-tracks.js internals
    // This is a compatibility layer
    const result = new Map();
    
    // Check for Daily participants
    const callObj = window.dailyVideo?.callObject;
    if (!callObj) return result;
    
    try {
      const participants = callObj.participants();
      Object.entries(participants).forEach(([key, p]) => {
        if (key === 'local') return;
        
        const userName = p.user_name || '';
        const idx = userName.lastIndexOf('#');
        const playerId = idx !== -1 ? userName.slice(idx + 1).trim() : '';
        
        if (playerId && p.tracks?.video?.track) {
          result.set(playerId, p.tracks.video.track);
        }
      });
    } catch (e) {
      log('Error getting tracks:', e);
    }
    
    return result;
  }

  function attachFocusVideo(playerId) {
    // Remove old video if exists
    if (focusVideoEl) {
      focusVideoEl.remove();
      focusVideoEl = null;
    }
    
    // LIVEKIT FIX: Try to get video element directly from LiveKit
    const liveKitVideo = getLiveKitVideoElement(playerId);
    if (liveKitVideo) {
      focusMain.classList.remove('empty');
      focusVideoEl = liveKitVideo;
      focusVideoEl.style.cssText = 'width:100%;height:100%;object-fit:contain;';
      focusVideoEl.muted = isLocalPlayer(playerId);
      focusMain.insertBefore(focusVideoEl, focusNameEl);
      focusVideoEl.play().catch(e => log('Focus video play error:', e));
      log('Focus video attached via LiveKit for:', playerId);
      return;
    }
    
    // Fallback: try old method
    const track = getTrackForPlayer(playerId);
    if (!track) {
      focusMain.classList.add('empty');
      return;
    }
    
    focusMain.classList.remove('empty');
    
    // Create new video element
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
    } else {
      console.warn('[BriefingUI] Cannot get stream from track for focus video');
    }
    
    // Insert before name overlay
    focusMain.insertBefore(focusVideoEl, focusNameEl);
    
    log('Focus video attached for:', playerId);
  }
  
  // LIVEKIT FIX: Get video element directly from LiveKit track.attach()
  function getLiveKitVideoElement(playerId) {
    const room = window.dailyVideo?.room;
    if (!room) return null;
    
    // Check local participant
    const localP = room.localParticipant;
    if (localP && localP.identity === playerId) {
      for (const [sid, pub] of localP.videoTrackPublications) {
        if (pub.track) {
          log('Found local LiveKit track for:', playerId);
          return pub.track.attach();
        }
      }
    }
    
    // Check remote participants
    for (const [id, participant] of room.remoteParticipants) {
      if (participant.identity === playerId) {
        for (const [sid, pub] of participant.videoTrackPublications) {
          if (pub.track) {
            log('Found remote LiveKit track for:', playerId);
            return pub.track.attach();
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
    
    // Remove existing video
    const existingVideo = thumb.querySelector('video');
    if (existingVideo) existingVideo.remove();
    
    // LIVEKIT FIX: Try to get video element directly from LiveKit
    const liveKitVideo = getLiveKitVideoElement(playerId);
    if (liveKitVideo) {
      liveKitVideo.muted = true; // Always mute thumbs
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
    video.muted = true; // Always mute thumbs
    
    const stream = window.getMediaStreamFromTrack ? window.getMediaStreamFromTrack(track) : new MediaStream([track]);
    if (stream) {
      try {
        video.srcObject = stream;
      } catch (e) {
        video.src = URL.createObjectURL(stream);
      }
    } else {
      console.warn('[BriefingUI] Cannot get stream from track for thumbnail');
    }
    
    // Insert before name label
    const nameEl = thumb.querySelector('.thumb-name');
    thumb.insertBefore(video, nameEl);
  }

  function getTrackForPlayer(playerId) {
    // LIVEKIT FIX: Utiliser VideoTracksRegistry en priorité
    // Car le callFrame de compatibilité LiveKit ne remplit pas tracks.video.track
    const registryTrack = window.VideoTracksRegistry?.get?.(playerId);
    if (registryTrack) {
      log('Track found in registry for:', playerId);
      return registryTrack;
    }
    
    // Fallback: ancienne méthode via callObj.participants() (Daily.co)
    const callObj = window.dailyVideo?.callObject;
    if (!callObj) return null;
    
    try {
      const participants = callObj.participants();
      
      // Check local first
      const local = participants.local;
      if (local) {
        const localId = getPlayerIdFromUserName(local.user_name);
        if (localId === playerId && local.tracks?.video?.track) {
          return local.tracks.video.track;
        }
      }
      
      // Check remotes
      for (const [key, p] of Object.entries(participants)) {
        if (key === 'local') continue;
        
        const pId = getPlayerIdFromUserName(p.user_name);
        if (pId === playerId && p.tracks?.video?.track) {
          return p.tracks.video.track;
        }
      }
    } catch (e) {
      log('Error getting track:', e);
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
    // D5: Update focus speaker badge (mode SPLIT/ADVANCED_FOCUS)
    const badge = document.getElementById('focusSpeakerBadge');
    if (badge) {
      badge.style.display = (speakerId === currentFocusId) ? 'inline-block' : 'none';
    }
    
    // D5: Update focus main speaking state (mode SPLIT/ADVANCED_FOCUS)
    focusMain?.classList.toggle('is-speaking', speakerId === currentFocusId);
    
    // D5: Update thumbnails in sidebar (mode SPLIT/ADVANCED_FOCUS)
    thumbElements.forEach((el, id) => {
      el.classList.toggle('is-speaking', id === speakerId);
    });
    
    // D5 NEW: Update player-item highlights in INLINE mode (lobby & game lists)
    updateInlineModeSpeakerHighlights(speakerId);
  }
  
  /**
   * D5: Gestion des highlights en mode INLINE
   * Ajoute/retire la classe .is-speaking sur les .player-item
   * V40 FIX: Logger uniquement si le speaker a changé
   */
  let lastLoggedSpeaker = null;
  function updateInlineModeSpeakerHighlights(speakerId) {
    // Retirer tous les anciens highlights
    document.querySelectorAll('.player-item.is-speaking').forEach(item => {
      item.classList.remove('is-speaking');
    });
    
    // Ajouter le nouveau highlight si un speaker est actif
    if (speakerId) {
      const playerItem = document.querySelector(`.player-item[data-player-id="${CSS.escape(speakerId)}"]`);
      if (playerItem) {
        playerItem.classList.add('is-speaking');
        // V40 FIX: Logger uniquement si le speaker a changé
        if (speakerId !== lastLoggedSpeaker) {
          log('🎙️ INLINE highlight added to:', speakerId.slice(0, 8));
          lastLoggedSpeaker = speakerId;
        }
      }
    } else if (lastLoggedSpeaker !== null) {
      // Reset si plus de speaker
      lastLoggedSpeaker = null;
    }
  }

  // ============================================
  // MICROPHONE / CAMERA CONTROLS
  // ============================================
  
  let isMicMuted = false;
  let isCamOff = false;
  
  // D6: Toast notification pour mute/unmute
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
  // D6: Exposer globalement pour le bouton inline
  window.showMuteToast = showMuteToast;

  async function toggleMicrophone() {
    const callObj = window.dailyVideo?.callFrame || window.dailyVideo?.callObject;
    if (!callObj) {
      log('No callObject for mic toggle');
      return;
    }
    
    try {
      const currentState = await callObj.localAudio();
      const newState = !currentState;
      await callObj.setLocalAudio(newState);
      isMicMuted = !newState; // muted = audio OFF
      
      // D4 v5.4: Mémoriser le choix manuel dans le registre
      if (window.VideoTracksRegistry?.setUserMutedAudio) {
        window.VideoTracksRegistry.setUserMutedAudio(isMicMuted);
      }
      
      updateMicButton();
      
      // D4 v5.4: Synchroniser le bouton inline
      const inlineMicBtn = document.getElementById('inlineMicBtn');
      if (inlineMicBtn) {
        if (isMicMuted) {
          inlineMicBtn.textContent = '🔇';
          inlineMicBtn.style.background = 'rgba(180, 50, 50, 0.7)';
        } else {
          inlineMicBtn.textContent = '🎤';
          inlineMicBtn.style.background = 'rgba(0, 100, 100, 0.5)';
        }
      }
      
      // D6: Afficher le toast de confirmation
      showMuteToast(isMicMuted);
      
      log('Microphone:', newState ? 'ON' : 'OFF', '(manual mute saved)');
    } catch (e) {
      log('Error toggling mic:', e);
    }
  }
  
  async function toggleCamera() {
    const callObj = window.dailyVideo?.callFrame || window.dailyVideo?.callObject;
    if (!callObj) {
      log('No callObject for camera toggle');
      return;
    }
    
    try {
      const currentState = await callObj.localVideo();
      const newState = !currentState;
      await callObj.setLocalVideo(newState);
      isCamOff = !newState; // off = video OFF
      
      // D4 v5.4: Mémoriser le choix manuel dans le registre
      if (window.VideoTracksRegistry?.setUserMutedVideo) {
        window.VideoTracksRegistry.setUserMutedVideo(isCamOff);
      }
      
      updateCamButton();
      
      // D4 v5.4: Synchroniser le bouton inline
      const inlineCamBtn = document.getElementById('inlineCamBtn');
      if (inlineCamBtn) {
        if (isCamOff) {
          inlineCamBtn.textContent = '📷';
          inlineCamBtn.style.background = 'rgba(180, 50, 50, 0.7)';
        } else {
          inlineCamBtn.textContent = '📹';
          inlineCamBtn.style.background = 'rgba(0, 100, 100, 0.5)';
        }
      }
      
      log('Camera:', newState ? 'ON' : 'OFF', '(manual mute saved)');
    } catch (e) {
      log('Error toggling camera:', e);
    }
  }
  
  // V32: Fonctions simplifiées - boutons briefing supprimés, utiliser mini-vidéos
  function updateMicButton() {
    // Bouton briefing supprimé - contrôles sur mini-vidéos uniquement
  }
  
  function updateCamButton() {
    // Bouton briefing supprimé - contrôles sur mini-vidéos uniquement
  }
  
  async function syncControlStates() {
    const callObj = window.dailyVideo?.callFrame || window.dailyVideo?.callObject;
    if (!callObj) return;
    
    try {
      isMicMuted = !(await callObj.localAudio());
      isCamOff = !(await callObj.localVideo());
      updateMicButton();
      updateCamButton();
    } catch (e) {
      log('Error syncing control states:', e);
    }
  }

  // ============================================
  // UTILITIES
  // ============================================
  
  function getPhaseLabel(phase) {
    const labels = {
      'DEBATE': 'DÉBAT',
      'VOTING': 'VOTE',
      'DAY_DEBATE': 'DISCUSSION',
      'DAY_VOTE': 'VOTE',
      'DISCUSSION': 'DISCUSSION',
      'GAME_OVER': 'FIN'
    };
    return labels[phase] || phase || 'BRIEFING';
  }

  // ============================================
  // PUBLIC API
  // ============================================
  
  window.VideoBriefingUI = {
    init,
    show,
    hide,
    isVisible,
    refreshParticipants,
    setFocus,
    
    // For external updates (e.g., from video-tracks.js)
    onTrackStarted: (playerId, track) => {
      if (isVisible()) {
        if (playerId === currentFocusId) {
          attachFocusVideo(playerId);
        } else {
          attachThumbVideo(playerId, track);
        }
      }
    },
    
    onTrackStopped: (playerId) => {
      if (playerId === currentFocusId) {
        focusMain?.classList.add('empty');
      } else {
        const thumb = thumbElements.get(playerId);
        if (thumb) {
          thumb.classList.add('empty');
          const video = thumb.querySelector('video');
          if (video) video.remove();
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

  console.log('[VideoBriefingUI] D4 Module loaded ✅');

})();
