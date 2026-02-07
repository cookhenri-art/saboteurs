/**
 * LiveKit Video Component - Client Side
 * Remplace daily-video.js (v5.2-ui)
 *
 * INTERFACE COMPATIBLE: Expose window.dailyVideo + .callFrame
 * pour que video-integration-client.js et video-tracks.js fonctionnent
 * sans modification majeure.
 *
 * Fonctionnalités :
 * - joinRoom(url, userName, permissions) : rejoint via token LiveKit
 * - updatePermissions(permissions)       : applique les permissions par phase
 * - leave() / destroy()                  : quitte / détruit
 * - toggleCamera() / toggleMicrophone()  : toggle local (si autorisé)
 * - deafenRemotes(on)                    : coupe/remet l'audio distant (phase privée)
 *
 * Le .callFrame expose une couche de compatibilité Daily :
 * - .participants()          → retourne un objet au format Daily
 * - .setLocalVideo(bool)     → setCameraEnabled
 * - .setLocalAudio(bool)     → setMicrophoneEnabled
 * - .localVideo()            → état caméra
 * - .localAudio()            → état micro
 * - .on(event, handler)      → mappage d'événements Daily → LiveKit
 * - .meetingState()          → retourne l'état de la room
 */

class LiveKitVideoManager {
  // Log conditionnel
  static log(...args) {
    if (window.SABOTEUR_DEBUG) {
      console.log('[LiveKit]', ...args);
    }
  }

  constructor() {
    this.__version = "livekit-v1.0";
    this.__provider = "livekit";

    // LiveKit Room
    this.room = null;

    // UI state (repris de daily-video.js pour compatibilité)
    this.container = null;
    this.grid = null;
    this.statusMessage = null;
    this.overlay = null;
    this.launcher = null;
    this._drag = { active: false, startX: 0, startY: 0, startTop: 0, startLeft: 0 };

    this.uiStateKey = "saboteur.dailyVideo.uiState.v1";
    this.uiState = {
      visible: true, minimized: false, dock: null,
      left: null, top: null, width: null, height: null,
      bubbleDock: "br", bubbleLeft: null, bubbleTop: null
    };

    this._pointerDrag = { active: false, pointerId: null, startX: 0, startY: 0, startLeft: 0, startTop: 0 };
    this._pinch = { active: false, startDist: 0, startW: 0, startH: 0 };

    this.camButton = null;
    this.micButton = null;

    // Permissions (phase)
    this.allowed = { video: true, audio: true, reason: "init" };
    this.userPref = { video: null, audio: null };

    this.isMobile = window.innerWidth < 768;
    this.headless = true; // Toujours headless (on utilise video-tracks.js pour l'UI)

    this.safeInset = { top: 0, right: 0, bottom: 0, left: 0 };

    // Deafen
    this._remoteVolumes = new Map();
    this._isDeafened = false;
    this._detachedAudioElements = new Map(); // pid -> HTMLAudioElement[]

    // Écran phase privée
    this.privatePhaseScreen = null;

    // État local caméra/micro
    this._localVideoEnabled = false;
    this._localAudioEnabled = false;

    // Couche de compatibilité callFrame (accédée par video-tracks.js et video-integration-client.js)
    this.callFrame = null;
    this.callObject = null;

    // Mapping LiveKit identity → Daily-style session_id
    this._identityToSessionId = new Map();
    this._sessionIdCounter = 0;

    // Event handlers Daily-style
    this._eventHandlers = {};
  }

  // =============================================
  // COMPATIBILITÉ CALLFRAME (Daily → LiveKit)
  // =============================================

  /**
   * Crée un objet callFrame compatible Daily qui wrappe la LiveKit Room.
   * video-tracks.js et video-integration-client.js accèdent à :
   *   window.dailyVideo.callFrame.participants()
   *   window.dailyVideo.callFrame.setLocalVideo(bool)
   *   window.dailyVideo.callFrame.setLocalAudio(bool)
   *   window.dailyVideo.callFrame.localVideo()
   *   window.dailyVideo.callFrame.localAudio()
   *   window.dailyVideo.callFrame.on('event', handler)
   *   window.dailyVideo.callFrame.meetingState()
   */
  _createCallFrameCompat() {
    const self = this;
    
    const compat = {
      // --- participants() au format Daily ---
      participants() {
        if (!self.room) return {};
        const result = {};
        
        // Local participant
        const local = self.room.localParticipant;
        if (local) {
          const localSessionId = 'local-' + local.identity;
          result.local = {
            local: true,
            session_id: localSessionId,
            sessionId: localSessionId,
            user_name: local.name || local.identity,
            user_id: local.identity,
            audio: self._localAudioEnabled,
            video: self._localVideoEnabled,
            tracks: {}
          };
        }
        
        // Remote participants
        for (const [, participant] of self.room.remoteParticipants) {
          const sessionId = self._getSessionId(participant.identity);
          result[sessionId] = {
            local: false,
            session_id: sessionId,
            sessionId: sessionId,
            user_name: participant.name || participant.identity,
            user_id: participant.identity,
            audio: participant.isMicrophoneEnabled,
            video: participant.isCameraEnabled,
            tracks: {}
          };
        }
        
        return result;
      },
      
      // --- Contrôle local ---
      async setLocalVideo(enabled) {
        if (!self.room?.localParticipant) return;
        try {
          await self.room.localParticipant.setCameraEnabled(enabled);
          self._localVideoEnabled = enabled;
        } catch (e) {
          console.warn('[LiveKit] setLocalVideo error:', e);
        }
      },
      
      async setLocalAudio(enabled) {
        if (!self.room?.localParticipant) return;
        try {
          await self.room.localParticipant.setMicrophoneEnabled(enabled);
          self._localAudioEnabled = enabled;
        } catch (e) {
          console.warn('[LiveKit] setLocalAudio error:', e);
        }
      },
      
      localVideo() {
        return self._localVideoEnabled;
      },
      
      localAudio() {
        return self._localAudioEnabled;
      },
      
      // --- État ---
      meetingState() {
        if (!self.room) return 'new';
        switch (self.room.state) {
          case 'connected': return 'joined-meeting';
          case 'reconnecting': return 'joined-meeting';
          case 'disconnected': return 'left-meeting';
          default: return 'new';
        }
      },
      
      // --- Événements (mapping Daily → LiveKit) ---
      // video-tracks.js utilise : participant-joined, participant-updated, participant-left,
      // track-started, track-stopped, active-speaker-change
      on(eventName, handler) {
        if (!self._eventHandlers[eventName]) {
          self._eventHandlers[eventName] = [];
        }
        self._eventHandlers[eventName].push(handler);
      },
      
      off(eventName, handler) {
        if (!self._eventHandlers[eventName]) return;
        self._eventHandlers[eventName] = self._eventHandlers[eventName].filter(h => h !== handler);
      },

      // --- Volume distant (pour deafen) ---
      // Daily avait setParticipantVolume - on ne l'utilise pas directement avec LiveKit
      // Le deafen est géré via detach/reattach des éléments audio
      setParticipantVolume(pid, volume) {
        // Géré par deafenRemotes() via detach/reattach
      },
      
      // --- Destroy ---
      async destroy() {
        if (self.room) {
          await self.room.disconnect();
          self.room = null;
        }
      }
    };
    
    return compat;
  }

  /**
   * Émet un événement Daily-style vers les handlers enregistrés
   */
  _emitDailyEvent(eventName, data) {
    const handlers = this._eventHandlers[eventName];
    if (!handlers || handlers.length === 0) return;
    for (const handler of handlers) {
      try {
        handler(data);
      } catch (e) {
        console.error(`[LiveKit] Error in ${eventName} handler:`, e);
      }
    }
  }

  /**
   * Génère un session_id stable pour une identity LiveKit
   */
  _getSessionId(identity) {
    if (!this._identityToSessionId.has(identity)) {
      this._identityToSessionId.set(identity, `lk-session-${++this._sessionIdCounter}-${identity}`);
    }
    return this._identityToSessionId.get(identity);
  }

  // =============================================
  // JOINROOM - Point d'entrée principal
  // =============================================

  /**
   * Rejoint une room LiveKit.
   * 
   * CHANGEMENT vs Daily: roomUrl ici est ignoré (c'est un reliquat Daily).
   * On fait plutôt un appel API pour obtenir le token LiveKit.
   * 
   * @param {string} roomUrl - (ignoré, compatibilité Daily)
   * @param {string} userName - "NomJoueur#playerId"
   * @param {object} permissions - { video: bool, audio: bool, reason: string }
   */
  async joinRoom(roomUrl, userName, permissions = { video: true, audio: true }) {
    LiveKitVideoManager.log('joinRoom called', { userName, permissions, headless: this.headless });

    // Reset prefs
    this.userPref = { video: null, audio: null };
    this.allowed = { ...permissions };

    // Détruire l'ancienne room si elle existe
    if (this.room) {
      try { await this.room.disconnect(); } catch {}
      this.room = null;
    }

    // Charger le SDK LiveKit si pas déjà fait
    if (!window.LivekitClient) {
      await this._loadLiveKitSDK();
    }

    // Extraire roomCode et playerId depuis le state du jeu
    const gameState = window.lastKnownState;
    const roomCode = gameState?.roomCode;
    const playerId = gameState?.you?.playerId || window.playerId || sessionStorage.getItem('is_playerId');

    if (!roomCode || !playerId) {
      console.error('[LiveKit] Missing roomCode or playerId', { roomCode, playerId });
      throw new Error('Missing roomCode or playerId');
    }

    // Demander un token au serveur
    const response = await fetch('/api/livekit/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomCode, playerName: userName, playerId })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Token request failed: ${response.status} - ${err}`);
    }

    const { token, url } = await response.json();
    LiveKitVideoManager.log('Token received, connecting to:', url);

    // Optimisation mobile
    const isMobile = this.isMobile;
    const roomOptions = {
      adaptiveStream: true,
      dynacast: true,
    };

    if (isMobile) {
      roomOptions.videoCaptureDefaults = {
        resolution: { width: 320, height: 240, frameRate: 10 }
      };
      LiveKitVideoManager.log('📊 MOBILE quality: 320x240 @ 10fps');
    } else {
      roomOptions.videoCaptureDefaults = {
        resolution: { width: 640, height: 480, frameRate: 24 }
      };
      LiveKitVideoManager.log('📊 DESKTOP quality: 640x480 @ 24fps');
    }

    // Créer la room LiveKit
    this.room = new window.LivekitClient.Room(roomOptions);

    // Créer le callFrame de compatibilité
    this.callFrame = this._createCallFrameCompat();
    this.callObject = this.callFrame;

    // Installer les event listeners LiveKit → Daily events
    this._setupLiveKitEvents();

    // Connexion
    const startVideoOff = !permissions.video;
    const startAudioOff = !permissions.audio;

    await this.room.connect(url, token, {
      autoSubscribe: true,
    });

    // Appliquer l'état initial caméra/micro selon les permissions
    // LIVEKIT FIX: try/catch pour éviter que l'échec micro/caméra ne bloque toute la connexion
    if (!startVideoOff) {
      try {
        await this.room.localParticipant.setCameraEnabled(true);
        this._localVideoEnabled = true;
      } catch (e) {
        LiveKitVideoManager.log('⚠️ Camera enable failed (may be in use):', e.message);
        this._localVideoEnabled = false;
      }
    }
    if (!startAudioOff) {
      try {
        await this.room.localParticipant.setMicrophoneEnabled(true);
        this._localAudioEnabled = true;
      } catch (e) {
        LiveKitVideoManager.log('⚠️ Microphone enable failed (may be in use):', e.message);
        this._localAudioEnabled = false;
      }
    }

    this.updateStatus("✅ Connecté");
    LiveKitVideoManager.log('Connected to room:', roomCode);

    // Appliquer les permissions initiales
    await this.applyPermissions(permissions, { phaseChanged: true });
    await this.updateButtonStates();

    // Émettre joined-meeting
    this._emitDailyEvent('joined-meeting', {});

    // Déclencher video-tracks.js
    if (typeof window.VideoTracksStartWaiting === 'function') {
      window.VideoTracksStartWaiting();
    }

    // LIVEKIT FIX: Émettre les tracks déjà souscrites (elles ont été reçues AVANT le binding de video-tracks.js)
    // On attend un court délai pour que video-tracks.js ait le temps de binder ses handlers
    setTimeout(() => {
      this._emitExistingTracks();
    }, 100);

    LiveKitVideoManager.log('Joined room (LiveKit v1).');
  }

  /**
   * LIVEKIT FIX: Émet des événements track-started pour toutes les tracks déjà souscrites.
   * Nécessaire car LiveKit souscrit aux tracks pendant room.connect(), AVANT que 
   * video-tracks.js n'ait bindé ses handlers.
   */
  _emitExistingTracks() {
    if (!this.room) return;

    LiveKitVideoManager.log('📣 Emitting existing tracks to video-tracks.js...');

    // Local tracks
    const localP = this.room.localParticipant;
    if (localP) {
      const localSessionId = 'local-' + localP.identity;
      
      localP.videoTrackPublications.forEach((pub) => {
        if (pub.track) {
          const element = pub.track.attach();
          LiveKitVideoManager.log('📣 Emitting existing LOCAL video track');
          this._emitDailyEvent('track-started', {
            participant: {
              local: true,
              session_id: localSessionId,
              sessionId: localSessionId,
              peerId: localSessionId,
              id: localSessionId,
              user_name: localP.name || localP.identity,
              user_id: localP.identity
            },
            track: {
              kind: 'video',
              _liveKitTrack: pub.track,
              _element: element
            }
          });
        }
      });

      localP.audioTrackPublications.forEach((pub) => {
        if (pub.track) {
          const element = pub.track.attach();
          LiveKitVideoManager.log('📣 Emitting existing LOCAL audio track');
          this._emitDailyEvent('track-started', {
            participant: {
              local: true,
              session_id: localSessionId,
              sessionId: localSessionId,
              peerId: localSessionId,
              id: localSessionId,
              user_name: localP.name || localP.identity,
              user_id: localP.identity
            },
            track: {
              kind: 'audio',
              _liveKitTrack: pub.track,
              _element: element
            }
          });
        }
      });
    }

    // Remote tracks
    for (const [, participant] of this.room.remoteParticipants) {
      const sessionId = this._getSessionId(participant.identity);

      participant.videoTrackPublications.forEach((pub) => {
        if (pub.track && pub.isSubscribed) {
          const element = pub.track.attach();
          LiveKitVideoManager.log('📣 Emitting existing REMOTE video track from:', participant.name);
          this._emitDailyEvent('track-started', {
            participant: {
              local: false,
              session_id: sessionId,
              sessionId: sessionId,
              peerId: sessionId,
              id: sessionId,
              user_name: participant.name || participant.identity,
              user_id: participant.identity
            },
            track: {
              kind: 'video',
              _liveKitTrack: pub.track,
              _element: element
            }
          });
        }
      });

      participant.audioTrackPublications.forEach((pub) => {
        if (pub.track && pub.isSubscribed) {
          const element = pub.track.attach();
          LiveKitVideoManager.log('📣 Emitting existing REMOTE audio track from:', participant.name);
          this._emitDailyEvent('track-started', {
            participant: {
              local: false,
              session_id: sessionId,
              sessionId: sessionId,
              peerId: sessionId,
              id: sessionId,
              user_name: participant.name || participant.identity,
              user_id: participant.identity
            },
            track: {
              kind: 'audio',
              _liveKitTrack: pub.track,
              _element: element
            }
          });
        }
      });
    }

    LiveKitVideoManager.log('📣 Finished emitting existing tracks');
  }

  // =============================================
  // EVENT MAPPING : LiveKit → Daily format
  // =============================================

  _setupLiveKitEvents() {
    if (!this.room) return;
    const RoomEvent = window.LivekitClient.RoomEvent;

    // --- Participant connected ---
    this.room.on(RoomEvent.ParticipantConnected, (participant) => {
      const sessionId = this._getSessionId(participant.identity);
      LiveKitVideoManager.log('participant-joined:', participant.name, participant.identity);

      this._emitDailyEvent('participant-joined', {
        participant: {
          local: false,
          session_id: sessionId,
          sessionId: sessionId,
          peerId: sessionId,
          id: sessionId,
          user_name: participant.name || participant.identity,
          user_id: participant.identity
        }
      });

      // Ré-appliquer deafen si actif
      if (this._isDeafened) {
        setTimeout(() => this._deafenParticipant(participant, true), 500);
      }
    });

    // --- Participant disconnected ---
    this.room.on(RoomEvent.ParticipantDisconnected, (participant) => {
      const sessionId = this._getSessionId(participant.identity);
      LiveKitVideoManager.log('participant-left:', participant.name);

      this._emitDailyEvent('participant-left', {
        participant: {
          local: false,
          session_id: sessionId,
          sessionId: sessionId,
          peerId: sessionId,
          id: sessionId,
          user_name: participant.name || participant.identity,
          user_id: participant.identity
        }
      });

      this._identityToSessionId.delete(participant.identity);
    });

    // --- Track subscribed (on reçoit une track d'un remote) ---
    this.room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
      const sessionId = this._getSessionId(participant.identity);
      const isLocal = false;

      LiveKitVideoManager.log('track-started:', track.kind, 'from', participant.name, 'local:', isLocal);

      // Créer l'élément HTML pour la track
      const element = track.attach();
      
      this._emitDailyEvent('track-started', {
        participant: {
          local: isLocal,
          session_id: sessionId,
          sessionId: sessionId,
          peerId: sessionId,
          id: sessionId,
          user_name: participant.name || participant.identity,
          user_id: participant.identity
        },
        track: {
          kind: track.kind, // 'video' ou 'audio'
          _liveKitTrack: track,
          _element: element
        }
      });

      // Si deafened et que c'est audio, détacher immédiatement
      if (this._isDeafened && track.kind === 'audio') {
        track.detach();
      }
    });

    // --- Track unsubscribed ---
    this.room.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
      const sessionId = this._getSessionId(participant.identity);

      LiveKitVideoManager.log('track-stopped:', track.kind, 'from', participant.name);

      track.detach();

      this._emitDailyEvent('track-stopped', {
        participant: {
          local: false,
          session_id: sessionId,
          sessionId: sessionId,
          peerId: sessionId,
          id: sessionId,
          user_name: participant.name || participant.identity,
          user_id: participant.identity
        },
        track: {
          kind: track.kind
        }
      });
    });

    // --- Local track published ---
    this.room.on(RoomEvent.LocalTrackPublished, (publication) => {
      const track = publication.track;
      if (!track) return;

      const localP = this.room.localParticipant;
      const sessionId = 'local-' + localP.identity;

      LiveKitVideoManager.log('track-started (local):', track.kind);

      const element = track.attach();

      this._emitDailyEvent('track-started', {
        participant: {
          local: true,
          session_id: sessionId,
          sessionId: sessionId,
          peerId: sessionId,
          id: sessionId,
          user_name: localP.name || localP.identity,
          user_id: localP.identity
        },
        track: {
          kind: track.kind,
          _liveKitTrack: track,
          _element: element
        }
      });
    });

    // --- Local track unpublished ---
    this.room.on(RoomEvent.LocalTrackUnpublished, (publication) => {
      const track = publication.track;
      if (!track) return;

      const localP = this.room.localParticipant;
      const sessionId = 'local-' + localP.identity;

      LiveKitVideoManager.log('track-stopped (local):', track.kind);
      track.detach();

      this._emitDailyEvent('track-stopped', {
        participant: {
          local: true,
          session_id: sessionId,
          sessionId: sessionId,
          peerId: sessionId,
          id: sessionId,
          user_name: localP.name || localP.identity,
          user_id: localP.identity
        },
        track: {
          kind: track.kind
        }
      });
    });

    // --- Active speaker ---
    this.room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
      if (speakers.length > 0) {
        const speaker = speakers[0];
        const isLocal = speaker === this.room.localParticipant;
        const sessionId = isLocal
          ? 'local-' + speaker.identity
          : this._getSessionId(speaker.identity);

        this._emitDailyEvent('active-speaker-change', {
          peerId: sessionId,
          activeSpeaker: { peerId: sessionId }
        });
      }
    });

    // --- Reconnection ---
    this.room.on(RoomEvent.Reconnecting, () => {
      LiveKitVideoManager.log('Reconnecting...');
      this.updateStatus("🔄 Reconnexion...");
    });

    this.room.on(RoomEvent.Reconnected, () => {
      LiveKitVideoManager.log('Reconnected!');
      this.updateStatus("✅ Reconnecté");
    });

    this.room.on(RoomEvent.Disconnected, () => {
      LiveKitVideoManager.log('Disconnected');
      this._emitDailyEvent('left-meeting', {});
    });
  }

  // =============================================
  // PERMISSIONS PAR PHASE
  // =============================================

  async updatePermissions(permissions) {
    if (!permissions || !this.room) return;
    await this.applyPermissions(permissions, { phaseChanged: true });
  }

  async applyPermissions(permissions, { phaseChanged } = { phaseChanged: false }) {
    this.allowed = {
      video: !!permissions.video,
      audio: !!permissions.audio,
      reason: permissions.reason || ""
    };

    // V11: DISABLED -     // Reset overrides utilisateur au changement de phase
    // V11: DISABLED -     if (phaseChanged) {
    // V11: DISABLED -       this.userPref = { video: null, audio: null };
    // V11: DISABLED -     }

    // UI lock/unlock boutons
    this.setButtonEnabled(this.camButton, this.allowed.video,
      this.allowed.video ? "" : "Caméra interdite: " + (this.allowed.reason || "phase"));
    this.setButtonEnabled(this.micButton, this.allowed.audio,
      this.allowed.audio ? "" : "Micro interdit: " + (this.allowed.reason || "phase"));

    // Overlay quand rien n'est autorisé
    const shouldOverlay = !this.allowed.video && !this.allowed.audio;
    this.setOverlay(shouldOverlay, this.allowed.reason);

    // === ENFORCE : couper si interdit ===
    if (!this.allowed.video) {
      try {
        await this.room?.localParticipant?.setCameraEnabled(false);
        this._localVideoEnabled = false;
      } catch (e) { console.warn("[LiveKit] setCameraEnabled(false) failed", e); }
    }
    if (!this.allowed.audio) {
      try {
        await this.room?.localParticipant?.setMicrophoneEnabled(false);
        this._localAudioEnabled = false;
      } catch (e) { console.warn("[LiveKit] setMicrophoneEnabled(false) failed", e); }
      // 🔇 DEAFEN : couper l'audio distant (phase privée / nuit silencieuse)
      await this.deafenRemotes(true);
    } else {
      // 🔊 Remettre l'audio distant
      await this.deafenRemotes(false);
    }

    // V11: NE PLUS réactiver automatiquement l'AUDIO
    // La gestion audio est centralisée dans video-integration-client.js
    // MAIS on réactive la VIDÉO normalement
    if (this.allowed.video) {
      const desiredVideo = (this.userPref.video !== null) ? this.userPref.video : true;
      try {
        await this.room?.localParticipant?.setCameraEnabled(desiredVideo);
        this._localVideoEnabled = desiredVideo;
      } catch (e) { console.warn("[LiveKit] setCameraEnabled(desired) failed", e); }
    }
    // V11: Audio géré par video-integration-client.js uniquement
    /*
    if (this.allowed.audio) {
      const desiredAudio = (this.userPref.audio !== null) ? this.userPref.audio : true;
      try {
        await this.room?.localParticipant?.setMicrophoneEnabled(desiredAudio);
        this._localAudioEnabled = desiredAudio;
      } catch (e) { console.warn("[LiveKit] setMicrophoneEnabled(desired) failed", e); }
    }
    */

    // Message status
    if (!this.allowed.video && this.allowed.audio) this.updateStatus("🎧 Audio only");
    if (this.allowed.video && this.allowed.audio) this.updateStatus("✅ Vidéo + audio");
    if (!this.allowed.video && !this.allowed.audio) this.updateStatus("😴 Phase privée");

    // Écran phase privée
    if (this.privatePhaseScreen) {
      if (!this.allowed.video && !this.allowed.audio) {
        this.privatePhaseScreen.style.display = "flex";
        if (this.grid) this.grid.style.display = "none";
      } else {
        this.privatePhaseScreen.style.display = "none";
        if (this.grid) this.grid.style.display = "block";
      }
    }

    await this.updateButtonStates();
  }

  // =============================================
  // DEAFEN REMOTES (isolation audio phase privée)
  // =============================================

  /**
   * Coupe ou remet l'audio de tous les participants distants.
   * Utilisé pendant les phases privées (NIGHT_SABOTEURS etc.)
   * où seuls certains joueurs doivent s'entendre.
   *
   * Stratégie LiveKit : on détache les éléments <audio> du DOM
   * pour que le son ne soit plus diffusé, puis on les réattache.
   */
  async deafenRemotes(on) {
    if (!this.room) return;

    try {
      if (on) {
        if (this._isDeafened) return; // Déjà deaf
        this._isDeafened = true;
        LiveKitVideoManager.log('🔇 Deafening all remotes (phase privée)');

        for (const [, participant] of this.room.remoteParticipants) {
          this._deafenParticipant(participant, true);
        }
      } else {
        if (!this._isDeafened) return;
        this._isDeafened = false;
        LiveKitVideoManager.log('🔊 Undeafening all remotes');

        for (const [, participant] of this.room.remoteParticipants) {
          this._deafenParticipant(participant, false);
        }
        this._detachedAudioElements.clear();
      }
    } catch (e) {
      console.warn("[LiveKit] deafenRemotes error:", e);
    }
  }

  /**
   * Coupe/remet l'audio d'un participant spécifique
   */
  _deafenParticipant(participant, mute) {
    try {
      for (const [, pub] of participant.audioTrackPublications) {
        const track = pub.track;
        if (!track) continue;

        if (mute) {
          // Détacher les éléments audio (le son s'arrête)
          const elements = track.detach();
          this._detachedAudioElements.set(participant.identity, elements);
        } else {
          // Réattacher les éléments audio
          const elements = this._detachedAudioElements.get(participant.identity);
          if (elements) {
            elements.forEach(el => {
              document.body.appendChild(el);
              el.play().catch(() => {});
            });
            this._detachedAudioElements.delete(participant.identity);
          } else {
            // Fallback : réattacher via la track
            const el = track.attach();
            document.body.appendChild(el);
            el.play().catch(() => {});
          }
        }
      }
    } catch (e) {
      console.warn("[LiveKit] _deafenParticipant error:", e);
    }
  }

  // =============================================
  // TOGGLE CAMERA / MICROPHONE
  // =============================================

  async toggleCamera() {
    if (!this.room) return;
    if (!this.allowed.video) {
      this.updateStatus("⚠️ Caméra interdite pour cette phase");
      return;
    }
    try {
      const next = !this._localVideoEnabled;
      this.userPref.video = next;
      await this.room.localParticipant.setCameraEnabled(next);
      this._localVideoEnabled = next;
      await this.updateButtonStates();
    } catch (e) {
      console.error("[LiveKit] toggleCamera error:", e);
    }
  }

  async toggleMicrophone() {
    if (!this.room) return;
    if (!this.allowed.audio) {
      this.updateStatus("⚠️ Micro interdit pour cette phase");
      return;
    }
    try {
      const next = !this._localAudioEnabled;
      this.userPref.audio = next;
      await this.room.localParticipant.setMicrophoneEnabled(next);
      this._localAudioEnabled = next;
      await this.updateButtonStates();
    } catch (e) {
      console.error("[LiveKit] toggleMicrophone error:", e);
    }
  }

  // =============================================
  // LEAVE / DESTROY
  // =============================================

  async leave() {
    if (!this.room) return;
    try {
      await this.room.disconnect();
    } catch (e) {
      console.warn("[LiveKit] leave error:", e);
    }
    this._cleanup();
  }

  async destroy() {
    if (this.room) {
      try { await this.room.disconnect(); } catch {}
    }
    this._cleanup();
  }

  _cleanup() {
    this.room = null;
    this.callFrame = null;
    this.callObject = null;
    this._localVideoEnabled = false;
    this._localAudioEnabled = false;
    this._isDeafened = false;
    this._detachedAudioElements.clear();
    this._identityToSessionId.clear();
    this._eventHandlers = {};
  }

  // =============================================
  // UI HELPERS (compatibilité daily-video.js)
  // =============================================

  updateStatus(msg) {
    if (this.statusMessage) {
      this.statusMessage.textContent = msg;
    }
    LiveKitVideoManager.log('Status:', msg);
  }

  setButtonEnabled(btn, enabled, titleWhenDisabled = "") {
    if (!btn) return;
    btn.disabled = !enabled;
    btn.style.opacity = enabled ? "1" : "0.35";
    btn.style.cursor = enabled ? "pointer" : "not-allowed";
    btn.title = enabled ? btn.title.replace(/^⛔\s*/, "") : ("⛔ " + titleWhenDisabled);
  }

  setOverlay(show, reason) {
    if (!this.overlay) return;
    this.overlay.style.display = show ? "flex" : "none";
    const reasonEl = this.overlay.querySelector("#dailyOverlayReason");
    if (reasonEl) reasonEl.textContent = reason || "";
  }

  async updateButtonStates() {
    if (!this.camButton || !this.micButton) return;
    try {
      const videoOn = this._localVideoEnabled;
      const audioOn = this._localAudioEnabled;

      this.camButton.style.background = videoOn ? "rgba(0, 255, 255, 0.18)" : "rgba(255, 0, 0, 0.18)";
      this.camButton.style.borderColor = videoOn ? "rgba(0, 255, 255, 0.35)" : "rgba(255, 0, 0, 0.35)";

      this.micButton.style.background = audioOn ? "rgba(0, 255, 255, 0.18)" : "rgba(255, 0, 0, 0.18)";
      this.micButton.style.borderColor = audioOn ? "rgba(0, 255, 255, 0.35)" : "rgba(255, 0, 0, 0.35)";
    } catch (e) {
      // ignore
    }
  }

  toggleMinimize() {
    // Pas d'UI native LiveKit, tout est géré par video-tracks.js / video-briefing-ui.js
  }

  showWindow() {}
  hideWindow() {}
  initContainer() {}

  // =============================================
  // CHARGEMENT SDK
  // =============================================

  _loadLiveKitSDK() {
    return new Promise((resolve, reject) => {
      if (window.LivekitClient) return resolve();
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/livekit-client@2/dist/livekit-client.umd.js";
      script.onload = () => {
        LiveKitVideoManager.log('SDK loaded ✅');
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load LiveKit SDK'));
      document.head.appendChild(script);
    });
  }
}

// Instancier et exposer sous window.dailyVideo (COMPATIBILITÉ)
window.dailyVideo = new LiveKitVideoManager();
LiveKitVideoManager.log("LiveKit video manager ready ✅", window.dailyVideo.__version);
