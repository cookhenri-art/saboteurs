/**
 * ============================================================================
 * VOICE MESSAGES MODULE - Saboteur Chat
 * ============================================================================
 * 
 * Permet d'enregistrer et d'envoyer des messages vocaux dans le chat.
 * Les autres joueurs peuvent les écouter avec un bouton play.
 * 
 * Stockage: Les fichiers audio sont uploadés sur le serveur et auto-supprimés après 24h.
 */

(function() {
  'use strict';

  // ============================================================================
  // CONFIGURATION
  // ============================================================================
  
  const CONFIG = {
    // Durée max d'enregistrement (secondes)
    maxDuration: 30,
    // Format audio
    mimeType: 'audio/webm;codecs=opus',
    fallbackMimeType: 'audio/webm',
    // Taille max fichier (5MB)
    maxFileSize: 5 * 1024 * 1024,
    // API endpoint
    uploadEndpoint: '/api/chat/voice-upload',
    // Délai minimum pour considérer un enregistrement valide (ms)
    minRecordingTime: 500
  };

  // ============================================================================
  // TRADUCTIONS UI
  // ============================================================================
  
  const UI_TEXTS = {
    fr: {
      holdToRecord: 'Maintenir pour enregistrer',
      recording: 'Enregistrement...',
      recordingTime: 'Enregistrement: {time}s',
      sending: 'Envoi...',
      tapToPlay: 'Appuyer pour écouter',
      playing: 'Lecture...',
      errorNoPermission: 'Microphone non autorisé',
      errorTooShort: 'Enregistrement trop court',
      errorTooLong: 'Enregistrement trop long (max {max}s)',
      errorUpload: 'Erreur d\'envoi',
      errorFormat: 'Format non supporté',
      voiceMessage: 'Message vocal',
      // Modal avantages
      createAccountTitle: 'Crée ton compte gratuit !',
      benefitsSubtitle: 'Profite de ces avantages exclusifs :',
      benefitVoice: 'Messages vocaux',
      benefitVoiceDesc: 'dans le chat',
      benefitVideo: '2 parties visio OFFERTES',
      benefitVideoDesc: "à l'inscription",
      benefitAvatars: '2 avatars IA OFFERTS',
      benefitAvatarsDesc: "à l'inscription",
      benefitMonthly: "Jusqu'à 30 avatars IA",
      benefitMonthlyDesc: '/ mois',
      benefitStats: 'Statistiques et badges',
      benefitStatsDesc: 'sauvegardés',
      benefitLeaderboard: 'Accès aux classements',
      createAccount: 'Créer mon compte',
      later: 'Plus tard'
    },
    en: {
      holdToRecord: 'Hold to record',
      recording: 'Recording...',
      recordingTime: 'Recording: {time}s',
      sending: 'Sending...',
      tapToPlay: 'Tap to play',
      playing: 'Playing...',
      errorNoPermission: 'Microphone not allowed',
      errorTooShort: 'Recording too short',
      errorTooLong: 'Recording too long (max {max}s)',
      errorUpload: 'Upload error',
      errorFormat: 'Format not supported',
      voiceMessage: 'Voice message',
      // Modal benefits
      createAccountTitle: 'Create your free account!',
      benefitsSubtitle: 'Enjoy these exclusive benefits:',
      benefitVoice: 'Voice messages',
      benefitVoiceDesc: 'in chat',
      benefitVideo: '2 FREE video games',
      benefitVideoDesc: 'on signup',
      benefitAvatars: '2 FREE AI avatars',
      benefitAvatarsDesc: 'on signup',
      benefitMonthly: 'Up to 30 AI avatars',
      benefitMonthlyDesc: '/ month',
      benefitStats: 'Stats and badges',
      benefitStatsDesc: 'saved',
      benefitLeaderboard: 'Leaderboard access',
      createAccount: 'Create my account',
      later: 'Later'
    },
    es: {
      holdToRecord: 'Mantener para grabar',
      recording: 'Grabando...',
      recordingTime: 'Grabando: {time}s',
      sending: 'Enviando...',
      tapToPlay: 'Tocar para escuchar',
      playing: 'Reproduciendo...',
      errorNoPermission: 'Micrófono no autorizado',
      errorTooShort: 'Grabación muy corta',
      errorTooLong: 'Grabación muy larga (máx {max}s)',
      errorUpload: 'Error de envío',
      errorFormat: 'Formato no soportado',
      voiceMessage: 'Mensaje de voz',
      createAccountTitle: '¡Crea tu cuenta gratis!',
      benefitsSubtitle: 'Disfruta de estas ventajas exclusivas:',
      benefitVoice: 'Mensajes de voz',
      benefitVoiceDesc: 'en el chat',
      benefitVideo: '2 partidas de video GRATIS',
      benefitVideoDesc: 'al registrarte',
      benefitAvatars: '2 avatares IA GRATIS',
      benefitAvatarsDesc: 'al registrarte',
      benefitMonthly: 'Hasta 30 avatares IA',
      benefitMonthlyDesc: '/ mes',
      benefitStats: 'Estadísticas y medallas',
      benefitStatsDesc: 'guardadas',
      benefitLeaderboard: 'Acceso a clasificaciones',
      createAccount: 'Crear mi cuenta',
      later: 'Más tarde'
    },
    de: {
      holdToRecord: 'Halten zum Aufnehmen',
      recording: 'Aufnahme...',
      recordingTime: 'Aufnahme: {time}s',
      sending: 'Senden...',
      tapToPlay: 'Tippen zum Abspielen',
      playing: 'Wiedergabe...',
      errorNoPermission: 'Mikrofon nicht erlaubt',
      errorTooShort: 'Aufnahme zu kurz',
      errorTooLong: 'Aufnahme zu lang (max {max}s)',
      errorUpload: 'Upload-Fehler',
      errorFormat: 'Format nicht unterstützt',
      voiceMessage: 'Sprachnachricht',
      createAccountTitle: 'Erstelle dein kostenloses Konto!',
      benefitsSubtitle: 'Genieße diese exklusiven Vorteile:',
      benefitVoice: 'Sprachnachrichten',
      benefitVoiceDesc: 'im Chat',
      benefitVideo: '2 KOSTENLOSE Videospiele',
      benefitVideoDesc: 'bei der Anmeldung',
      benefitAvatars: '2 KOSTENLOSE KI-Avatare',
      benefitAvatarsDesc: 'bei der Anmeldung',
      benefitMonthly: 'Bis zu 30 KI-Avatare',
      benefitMonthlyDesc: '/ Monat',
      benefitStats: 'Statistiken und Abzeichen',
      benefitStatsDesc: 'gespeichert',
      benefitLeaderboard: 'Zugang zu Ranglisten',
      createAccount: 'Mein Konto erstellen',
      later: 'Später'
    },
    it: {
      holdToRecord: 'Tieni premuto per registrare',
      recording: 'Registrazione...',
      recordingTime: 'Registrazione: {time}s',
      sending: 'Invio...',
      tapToPlay: 'Tocca per ascoltare',
      playing: 'Riproduzione...',
      errorNoPermission: 'Microfono non autorizzato',
      errorTooShort: 'Registrazione troppo breve',
      errorTooLong: 'Registrazione troppo lunga (max {max}s)',
      errorUpload: 'Errore di invio',
      errorFormat: 'Formato non supportato',
      voiceMessage: 'Messaggio vocale',
      createAccountTitle: 'Crea il tuo account gratuito!',
      benefitsSubtitle: 'Goditi questi vantaggi esclusivi:',
      benefitVoice: 'Messaggi vocali',
      benefitVoiceDesc: 'nella chat',
      benefitVideo: '2 partite video GRATIS',
      benefitVideoDesc: "all'iscrizione",
      benefitAvatars: '2 avatar IA GRATIS',
      benefitAvatarsDesc: "all'iscrizione",
      benefitMonthly: 'Fino a 30 avatar IA',
      benefitMonthlyDesc: '/ mese',
      benefitStats: 'Statistiche e badge',
      benefitStatsDesc: 'salvati',
      benefitLeaderboard: 'Accesso alle classifiche',
      createAccount: 'Crea il mio account',
      later: 'Più tardi'
    },
    pt: {
      holdToRecord: 'Segure para gravar',
      recording: 'Gravando...',
      recordingTime: 'Gravando: {time}s',
      sending: 'Enviando...',
      tapToPlay: 'Toque para ouvir',
      playing: 'Reproduzindo...',
      errorNoPermission: 'Microfone não autorizado',
      errorTooShort: 'Gravação muito curta',
      errorTooLong: 'Gravação muito longa (máx {max}s)',
      errorUpload: 'Erro de envio',
      errorFormat: 'Formato não suportado',
      voiceMessage: 'Mensagem de voz',
      createAccountTitle: 'Crie sua conta grátis!',
      benefitsSubtitle: 'Aproveite esses benefícios exclusivos:',
      benefitVoice: 'Mensagens de voz',
      benefitVoiceDesc: 'no chat',
      benefitVideo: '2 jogos de vídeo GRÁTIS',
      benefitVideoDesc: 'ao se inscrever',
      benefitAvatars: '2 avatares IA GRÁTIS',
      benefitAvatarsDesc: 'ao se inscrever',
      benefitMonthly: 'Até 30 avatares IA',
      benefitMonthlyDesc: '/ mês',
      benefitStats: 'Estatísticas e medalhas',
      benefitStatsDesc: 'salvos',
      benefitLeaderboard: 'Acesso aos rankings',
      createAccount: 'Criar minha conta',
      later: 'Mais tarde'
    },
    nl: {
      holdToRecord: 'Houd ingedrukt om op te nemen',
      recording: 'Opnemen...',
      recordingTime: 'Opnemen: {time}s',
      sending: 'Verzenden...',
      tapToPlay: 'Tik om af te spelen',
      playing: 'Afspelen...',
      errorNoPermission: 'Microfoon niet toegestaan',
      errorTooShort: 'Opname te kort',
      errorTooLong: 'Opname te lang (max {max}s)',
      errorUpload: 'Upload fout',
      errorFormat: 'Formaat niet ondersteund',
      voiceMessage: 'Spraakbericht',
      createAccountTitle: 'Maak je gratis account!',
      benefitsSubtitle: 'Geniet van deze exclusieve voordelen:',
      benefitVoice: 'Spraakberichten',
      benefitVoiceDesc: 'in chat',
      benefitVideo: '2 GRATIS videogames',
      benefitVideoDesc: 'bij aanmelding',
      benefitAvatars: '2 GRATIS AI-avatars',
      benefitAvatarsDesc: 'bij aanmelding',
      benefitMonthly: 'Tot 30 AI-avatars',
      benefitMonthlyDesc: '/ maand',
      benefitStats: 'Statistieken en badges',
      benefitStatsDesc: 'opgeslagen',
      benefitLeaderboard: 'Toegang tot ranglijsten',
      createAccount: 'Mijn account maken',
      later: 'Later'
    }
  };

  let currentLanguage = 'fr';

  function t(key, params = {}) {
    const lang = currentLanguage || 'fr';
    let text = UI_TEXTS[lang]?.[key] || UI_TEXTS['fr'][key] || key;
    
    // Remplacer les paramètres {param}
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
  }

  function detectLanguage() {
    if (typeof window.getCurrentLanguage === 'function') {
      currentLanguage = window.getCurrentLanguage();
    } else if (typeof window.currentLang !== 'undefined') {
      currentLanguage = window.currentLang;
    } else {
      currentLanguage = localStorage.getItem('saboteur_language') || 
                        navigator.language?.substring(0, 2) || 'fr';
    }
    if (!UI_TEXTS[currentLanguage]) {
      currentLanguage = 'fr';
    }
  }

  // ============================================================================
  // ÉTAT
  // ============================================================================
  
  let mediaRecorder = null;
  let audioChunks = [];
  let recordingStartTime = null;
  let recordingTimer = null;
  let isRecording = false;
  let voiceRecordButton = null;
  let recordingIndicator = null;
  let isUserVerified = false;  // V42: Compte certifié ?

  // ============================================================================
  // VÉRIFICATION SUPPORT
  // ============================================================================
  
  function isSupported() {
    return !!(navigator.mediaDevices && 
              navigator.mediaDevices.getUserMedia && 
              window.MediaRecorder);
  }

  if (!isSupported()) {
    console.warn('[VoiceMessages] ❌ MediaRecorder non supporté');
    return;
  }

  // ============================================================================
  // VÉRIFICATION COMPTE CERTIFIÉ
  // ============================================================================
  
  async function checkUserVerified() {
    const token = localStorage.getItem('saboteur_token');
    
    // Pas de token = invité
    if (!token) {
      console.log('[VoiceMessages] Invité détecté - messages vocaux désactivés');
      return false;
    }
    
    try {
      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        return false;
      }
      
      const data = await response.json();
      
      // La réponse est { user: { emailVerified: true/false, ... } }
      if (data.user && data.user.emailVerified === true) {
        console.log('[VoiceMessages] Compte certifié - messages vocaux activés');
        return true;
      } else {
        console.log('[VoiceMessages] Compte non vérifié - messages vocaux désactivés');
        return false;
      }
    } catch (err) {
      console.error('[VoiceMessages] Erreur vérification:', err);
      return false;
    }
  }

  // ============================================================================
  // INITIALISATION
  // ============================================================================
  
  async function init() {
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatInputContainer = document.querySelector('.chat-input-container');
    
    if (!chatInput || !chatSend || !chatInputContainer) {
      setTimeout(init, 500);
      return;
    }

    detectLanguage();
    
    // V42: Vérifier si l'utilisateur a un compte certifié
    isUserVerified = await checkUserVerified();
    
    // Créer le bouton seulement si compte certifié
    if (isUserVerified) {
      createRecordButton(chatInputContainer);
      addStyles();
      console.log('[VoiceMessages] ✅ Module initialisé (compte certifié)');
    } else {
      console.log('[VoiceMessages] ⚠️ Module désactivé (invité ou non vérifié)');
      // Afficher le modal d'avantages pour les invités (une seule fois)
      showAccountBenefitsModal();
    }
    
    // Intercepter l'affichage des messages vocaux (pour tous, même invités peuvent écouter)
    interceptMessageDisplay();
  }
  
  // V42: Modal d'avantages pour inciter à créer un compte
  function showAccountBenefitsModal() {
    // Ne montrer qu'une seule fois par session
    const shownKey = 'saboteur_benefits_modal_shown';
    if (sessionStorage.getItem(shownKey)) return;
    
    // Attendre un peu que la partie commence
    setTimeout(() => {
      // Vérifier qu'on est bien en jeu
      if (!document.getElementById('chatMessages')) return;
      
      sessionStorage.setItem(shownKey, 'true');
      
      const modal = document.createElement('div');
      modal.id = 'accountBenefitsModal';
      modal.innerHTML = `
        <div class="benefits-modal-overlay">
          <div class="benefits-modal-content">
            <h2>🎁 ${t('createAccountTitle') || 'Crée ton compte gratuit !'}</h2>
            <p class="benefits-subtitle">${t('benefitsSubtitle') || 'Profite de ces avantages exclusifs :'}</p>
            
            <ul class="benefits-list">
              <li>🎙️ <strong>${t('benefitVoice') || 'Messages vocaux'}</strong> ${t('benefitVoiceDesc') || 'dans le chat'}</li>
              <li>🎬 <strong>${t('benefitVideo') || '2 parties visio OFFERTES'}</strong> ${t('benefitVideoDesc') || "à l'inscription"}</li>
              <li>🎨 <strong>${t('benefitAvatars') || '2 avatars IA OFFERTS'}</strong> ${t('benefitAvatarsDesc') || "à l'inscription"}</li>
              <li>🖼️ <strong>${t('benefitMonthly') || "Jusqu'à 30 avatars IA"}</strong> ${t('benefitMonthlyDesc') || '/ mois'}</li>
              <li>📊 <strong>${t('benefitStats') || 'Statistiques et badges'}</strong> ${t('benefitStatsDesc') || 'sauvegardés'}</li>
              <li>🏆 <strong>${t('benefitLeaderboard') || 'Accès aux classements'}</strong></li>
            </ul>
            
            <div class="benefits-buttons">
              <a href="/index.html#register" class="benefits-btn primary">✨ ${t('createAccount') || 'Créer mon compte'}</a>
              <button class="benefits-btn secondary" onclick="this.closest('#accountBenefitsModal').remove()">
                ${t('later') || 'Plus tard'}
              </button>
            </div>
          </div>
        </div>
      `;
      
      // Styles du modal
      const style = document.createElement('style');
      style.textContent = `
        .benefits-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          z-index: 100000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .benefits-modal-content {
          background: linear-gradient(135deg, #1a1f35 0%, #0d1225 100%);
          border: 2px solid var(--neon-cyan, #00ffff);
          border-radius: 20px;
          padding: 30px;
          max-width: 450px;
          width: 100%;
          text-align: center;
          box-shadow: 0 0 40px rgba(0, 255, 255, 0.3);
          animation: slideUp 0.4s ease;
        }
        
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .benefits-modal-content h2 {
          color: var(--neon-cyan, #00ffff);
          font-size: 1.6rem;
          margin: 0 0 10px 0;
        }
        
        .benefits-subtitle {
          color: #a0a0a0;
          margin: 0 0 20px 0;
          font-size: 1rem;
        }
        
        .benefits-list {
          list-style: none;
          padding: 0;
          margin: 0 0 25px 0;
          text-align: left;
        }
        
        .benefits-list li {
          padding: 10px 15px;
          margin: 8px 0;
          background: rgba(0, 255, 255, 0.05);
          border-radius: 10px;
          color: #e0e0e0;
          font-size: 0.95rem;
          border-left: 3px solid var(--neon-cyan, #00ffff);
        }
        
        .benefits-list li strong {
          color: white;
        }
        
        .benefits-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .benefits-btn {
          padding: 14px 24px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: block;
        }
        
        .benefits-btn.primary {
          background: linear-gradient(135deg, var(--neon-cyan, #00ffff), var(--neon-green, #50fa7b));
          color: #0a0e1a;
          border: none;
        }
        
        .benefits-btn.primary:hover {
          transform: scale(1.03);
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        }
        
        .benefits-btn.secondary {
          background: transparent;
          color: #888;
          border: 1px solid #444;
        }
        
        .benefits-btn.secondary:hover {
          color: #aaa;
          border-color: #666;
        }
        
        @media (max-width: 480px) {
          .benefits-modal-content {
            padding: 20px;
          }
          .benefits-modal-content h2 {
            font-size: 1.3rem;
          }
          .benefits-list li {
            font-size: 0.85rem;
            padding: 8px 12px;
          }
        }
      `;
      
      document.head.appendChild(style);
      document.body.appendChild(modal);
      
    }, 5000); // Attendre 5 secondes après le chargement
  }

  // ============================================================================
  // UI - BOUTON ENREGISTREMENT
  // ============================================================================
  
  function createRecordButton(container) {
    // Créer le bouton d'enregistrement vocal
    voiceRecordButton = document.createElement('button');
    voiceRecordButton.id = 'chatVoiceRecord';
    voiceRecordButton.type = 'button';
    voiceRecordButton.innerHTML = '🎙️';
    voiceRecordButton.title = t('holdToRecord');
    voiceRecordButton.setAttribute('aria-label', t('holdToRecord'));
    
    // Trouver le bouton voice-to-text s'il existe, sinon le bouton send
    const voiceToTextBtn = document.getElementById('chatVoice');
    const chatSend = document.getElementById('chatSend');
    const referenceBtn = voiceToTextBtn || chatSend;
    
    // Insérer avant le bouton de référence
    container.insertBefore(voiceRecordButton, referenceBtn);

    // Créer l'indicateur d'enregistrement
    createRecordingIndicator(container);

    // Événements - Maintenir pour enregistrer
    voiceRecordButton.addEventListener('mousedown', startRecording);
    voiceRecordButton.addEventListener('mouseup', stopRecording);
    voiceRecordButton.addEventListener('mouseleave', stopRecording);
    
    // Support tactile
    voiceRecordButton.addEventListener('touchstart', handleTouchStart, { passive: false });
    voiceRecordButton.addEventListener('touchend', handleTouchEnd);
    voiceRecordButton.addEventListener('touchcancel', stopRecording);
  }

  function createRecordingIndicator(container) {
    recordingIndicator = document.createElement('div');
    recordingIndicator.id = 'voiceRecordingIndicator';
    recordingIndicator.className = 'voice-recording-indicator';
    recordingIndicator.innerHTML = `
      <span class="recording-dot"></span>
      <span class="recording-text">${t('recording')}</span>
      <span class="recording-time">0s</span>
    `;
    recordingIndicator.style.display = 'none';
    
    // Ajouter au-dessus de l'input container
    container.parentNode.insertBefore(recordingIndicator, container);
  }

  function addStyles() {
    if (document.getElementById('voice-messages-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'voice-messages-styles';
    style.textContent = `
      /* Bouton enregistrement */
      #chatVoiceRecord {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        background: rgba(255, 255, 255, 0.1);
        color: #e6e6e6;
        font-size: 1.1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        flex-shrink: 0;
        user-select: none;
        -webkit-user-select: none;
      }
      
      #chatVoiceRecord:hover {
        background: rgba(255, 71, 87, 0.2);
        transform: scale(1.05);
      }
      
      #chatVoiceRecord.recording {
        background: linear-gradient(135deg, #ff4757, #ff6b81);
        animation: pulse-record 0.8s ease-in-out infinite;
        color: white;
        transform: scale(1.1);
      }
      
      @keyframes pulse-record {
        0%, 100% { 
          box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.6);
        }
        50% { 
          box-shadow: 0 0 0 15px rgba(255, 71, 87, 0);
        }
      }
      
      /* Indicateur d'enregistrement */
      .voice-recording-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 8px 16px;
        background: linear-gradient(135deg, rgba(255, 71, 87, 0.9), rgba(255, 107, 129, 0.9));
        border-radius: 20px;
        margin: 8px 10px;
        animation: slideDown 0.2s ease;
      }
      
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .recording-dot {
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
        animation: blink 1s ease-in-out infinite;
      }
      
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      
      .recording-text {
        color: white;
        font-size: 0.85rem;
        font-weight: 600;
      }
      
      .recording-time {
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.8rem;
        font-family: monospace;
      }
      
      /* Message vocal dans le chat */
      .voice-message-player {
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 20px;
        padding: 8px 14px;
        min-width: 180px;
        max-width: 250px;
      }
      
      .voice-play-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: none;
        background: var(--neon-cyan, #00ffff);
        color: #0a0e1a;
        font-size: 1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        flex-shrink: 0;
      }
      
      .voice-play-btn:hover {
        transform: scale(1.1);
        background: var(--neon-green, #50fa7b);
      }
      
      .voice-play-btn.playing {
        background: #ff4757;
      }
      
      .voice-waveform {
        flex: 1;
        height: 24px;
        display: flex;
        align-items: center;
        gap: 2px;
      }
      
      .voice-waveform-bar {
        width: 3px;
        background: var(--neon-cyan, #00ffff);
        border-radius: 2px;
        opacity: 0.5;
        transition: height 0.1s, opacity 0.1s;
      }
      
      .voice-waveform-bar.active {
        opacity: 1;
      }
      
      .voice-duration {
        font-size: 0.75rem;
        color: var(--text-secondary, #8892b0);
        font-family: monospace;
        min-width: 35px;
        text-align: right;
      }
      
      /* Animation de chargement */
      .voice-message-player.loading .voice-play-btn {
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      /* Mobile */
      @media (max-width: 480px) {
        #chatVoiceRecord {
          width: 44px;
          height: 44px;
          font-size: 1.2rem;
        }
        
        .voice-message-player {
          min-width: 150px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ============================================================================
  // ENREGISTREMENT
  // ============================================================================
  
  let touchStarted = false;

  function handleTouchStart(e) {
    e.preventDefault();
    touchStarted = true;
    startRecording();
  }

  function handleTouchEnd(e) {
    if (touchStarted) {
      touchStarted = false;
      stopRecording();
    }
  }

  async function startRecording() {
    if (isRecording) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,  // V42: Désactiver l'ajustement auto du volume
          sampleRate: 44100
        }
      });
      
      // Déterminer le format supporté
      let mimeType = CONFIG.mimeType;
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = CONFIG.fallbackMimeType;
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = ''; // Laisser le navigateur choisir
          }
        }
      }
      
      const options = mimeType ? { mimeType } : {};
      mediaRecorder = new MediaRecorder(stream, options);
      audioChunks = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = onRecordingStop;
      
      mediaRecorder.start(100); // Collecter toutes les 100ms
      isRecording = true;
      recordingStartTime = Date.now();
      
      // UI
      voiceRecordButton.classList.add('recording');
      recordingIndicator.style.display = 'flex';
      
      // Timer pour afficher le temps
      updateRecordingTime();
      recordingTimer = setInterval(updateRecordingTime, 100);
      
      // Vibration feedback
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      console.log('[VoiceMessages] 🎙️ Enregistrement démarré');
      
      // Auto-stop après durée max
      setTimeout(() => {
        if (isRecording) {
          stopRecording();
          showError(t('errorTooLong', { max: CONFIG.maxDuration }));
        }
      }, CONFIG.maxDuration * 1000);
      
    } catch (err) {
      console.error('[VoiceMessages] Erreur micro:', err);
      showError(t('errorNoPermission'));
    }
  }

  function stopRecording() {
    if (!isRecording || !mediaRecorder) return;
    
    const recordingDuration = Date.now() - recordingStartTime;
    
    // Arrêter le timer
    if (recordingTimer) {
      clearInterval(recordingTimer);
      recordingTimer = null;
    }
    
    // UI
    voiceRecordButton.classList.remove('recording');
    recordingIndicator.style.display = 'none';
    
    // Vérifier durée minimum
    if (recordingDuration < CONFIG.minRecordingTime) {
      console.log('[VoiceMessages] Enregistrement trop court, annulé');
      isRecording = false;
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      audioChunks = [];
      return;
    }
    
    try {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error('[VoiceMessages] Erreur arrêt:', err);
    }
    
    isRecording = false;
    console.log('[VoiceMessages] 🛑 Enregistrement arrêté (' + Math.round(recordingDuration/1000) + 's)');
  }

  function updateRecordingTime() {
    if (!recordingStartTime) return;
    
    const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
    const timeSpan = recordingIndicator.querySelector('.recording-time');
    if (timeSpan) {
      timeSpan.textContent = elapsed + 's / ' + CONFIG.maxDuration + 's';
    }
  }

  async function onRecordingStop() {
    if (audioChunks.length === 0) return;
    
    const mimeType = mediaRecorder.mimeType || 'audio/webm';
    const audioBlob = new Blob(audioChunks, { type: mimeType });
    
    // Vérifier taille
    if (audioBlob.size > CONFIG.maxFileSize) {
      showError(t('errorTooLong', { max: CONFIG.maxDuration }));
      return;
    }
    
    // Calculer la durée approximative
    const duration = Math.round((Date.now() - recordingStartTime) / 1000);
    
    // Upload
    await uploadAndSendVoiceMessage(audioBlob, duration);
  }

  // ============================================================================
  // UPLOAD & ENVOI
  // ============================================================================
  
  async function uploadAndSendVoiceMessage(audioBlob, duration) {
    // Afficher indicateur de chargement
    voiceRecordButton.disabled = true;
    voiceRecordButton.innerHTML = '⏳';
    
    try {
      const formData = new FormData();
      const extension = audioBlob.type.includes('webm') ? 'webm' : 
                        audioBlob.type.includes('mp4') ? 'm4a' : 'audio';
      formData.append('audio', audioBlob, `voice.${extension}`);
      formData.append('duration', duration);
      
      // V42: Ajouter le roomCode pour associer le fichier à la room (nettoyage automatique en fin de partie)
      if (window.roomCode) {
        formData.append('roomCode', window.roomCode);
      } else if (window.socket && window.socket.roomCode) {
        formData.append('roomCode', window.socket.roomCode);
      }
      
      const response = await fetch(CONFIG.uploadEndpoint, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed: ' + response.status);
      }
      
      const data = await response.json();
      
      if (data.ok && data.audioUrl) {
        // Envoyer le message via socket
        if (window.socket) {
          window.socket.emit('chatMessage', {
            message: `🎙️ ${t('voiceMessage')}`,
            voiceMessage: {
              url: data.audioUrl,
              duration: duration
            }
          }, (res) => {
            if (res && res.ok) {
              console.log('[VoiceMessages] ✅ Message vocal envoyé');
            } else {
              console.error('[VoiceMessages] Erreur envoi:', res?.error);
              showError(t('errorUpload'));
            }
          });
        }
      } else {
        throw new Error(data.error || 'Unknown error');
      }
      
    } catch (err) {
      console.error('[VoiceMessages] Erreur upload:', err);
      showError(t('errorUpload'));
    } finally {
      voiceRecordButton.disabled = false;
      voiceRecordButton.innerHTML = '🎙️';
    }
  }

  // ============================================================================
  // AFFICHAGE DES MESSAGES VOCAUX
  // ============================================================================
  
  function interceptMessageDisplay() {
    // Intercepter la fonction addMessageToUI si elle existe
    const checkInterval = setInterval(() => {
      const chatMessages = document.getElementById('chatMessages');
      if (!chatMessages) return;
      
      // Observer les nouveaux messages pour transformer les messages vocaux
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && node.classList.contains('chat-msg')) {
              transformVoiceMessage(node);
            }
          });
        });
      });
      
      observer.observe(chatMessages, { childList: true });
      clearInterval(checkInterval);
      
      console.log('[VoiceMessages] 👀 Observer actif');
    }, 500);
  }

  function transformVoiceMessage(messageNode) {
    const textDiv = messageNode.querySelector('.chat-msg-text');
    if (!textDiv) return;
    
    // Chercher si c'est un message vocal (contient l'URL audio dans un data attribute ou le texte)
    const text = textDiv.textContent;
    
    // Pattern pour détecter un message vocal
    if (text.includes('🎙️') && text.includes(t('voiceMessage'))) {
      // Trouver les données du message vocal (stockées dans un attribut data)
      const audioUrl = messageNode.dataset.voiceUrl;
      const duration = parseInt(messageNode.dataset.voiceDuration) || 0;
      
      if (audioUrl) {
        textDiv.innerHTML = createVoicePlayerHTML(audioUrl, duration);
        initVoicePlayer(textDiv.querySelector('.voice-message-player'));
      }
    }
  }

  function createVoicePlayerHTML(audioUrl, duration) {
    const formattedDuration = formatDuration(duration);
    const bars = Array(12).fill(0).map((_, i) => {
      const height = 4 + Math.random() * 16;
      return `<div class="voice-waveform-bar" style="height: ${height}px" data-index="${i}"></div>`;
    }).join('');
    
    return `
      <div class="voice-message-player" data-audio-url="${audioUrl}">
        <button class="voice-play-btn" aria-label="${t('tapToPlay')}">▶</button>
        <div class="voice-waveform">${bars}</div>
        <span class="voice-duration">${formattedDuration}</span>
      </div>
    `;
  }

  function initVoicePlayer(playerElement) {
    if (!playerElement) return;
    
    const playBtn = playerElement.querySelector('.voice-play-btn');
    const waveform = playerElement.querySelector('.voice-waveform');
    const durationSpan = playerElement.querySelector('.voice-duration');
    const audioUrl = playerElement.dataset.audioUrl;
    
    let audio = null;
    let isPlaying = false;
    let animationFrame = null;
    
    playBtn.addEventListener('click', async () => {
      if (isPlaying) {
        // Stop
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
        stopPlayback();
      } else {
        // Play
        if (!audio) {
          audio = new Audio(audioUrl);
          audio.addEventListener('ended', stopPlayback);
          audio.addEventListener('error', () => {
            console.error('[VoiceMessages] Erreur lecture audio');
            stopPlayback();
          });
        }
        
        try {
          await audio.play();
          isPlaying = true;
          playBtn.classList.add('playing');
          playBtn.textContent = '⏸';
          animateWaveform();
        } catch (err) {
          console.error('[VoiceMessages] Erreur play:', err);
        }
      }
    });
    
    function stopPlayback() {
      isPlaying = false;
      playBtn.classList.remove('playing');
      playBtn.textContent = '▶';
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      // Reset waveform
      waveform.querySelectorAll('.voice-waveform-bar').forEach(bar => {
        bar.classList.remove('active');
      });
    }
    
    function animateWaveform() {
      if (!isPlaying || !audio) return;
      
      const progress = audio.currentTime / audio.duration;
      const bars = waveform.querySelectorAll('.voice-waveform-bar');
      const activeIndex = Math.floor(progress * bars.length);
      
      bars.forEach((bar, i) => {
        bar.classList.toggle('active', i <= activeIndex);
      });
      
      // Update duration display
      durationSpan.textContent = formatDuration(Math.floor(audio.currentTime));
      
      animationFrame = requestAnimationFrame(animateWaveform);
    }
  }

  function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // ============================================================================
  // HELPERS
  // ============================================================================
  
  function showError(message) {
    // Supprimer l'ancien message
    const oldError = document.querySelector('.voice-error-msg');
    if (oldError) oldError.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'voice-error-msg';
    errorDiv.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: #ff4757;
      color: white;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 0.9rem;
      z-index: 10000;
      animation: fadeInUp 0.3s ease;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => errorDiv.remove(), 3000);
  }

  // ============================================================================
  // API PUBLIQUE
  // ============================================================================
  
  window.VoiceMessages = {
    isSupported,
    isRecording: () => isRecording,
    
    // Pour créer un player manuellement (utilisé par le serveur)
    createPlayer: (audioUrl, duration) => {
      const container = document.createElement('div');
      container.innerHTML = createVoicePlayerHTML(audioUrl, duration);
      const player = container.firstElementChild;
      initVoicePlayer(player);
      return player;
    },
    
    // Pour transformer un message existant
    transformMessage: (messageNode, audioUrl, duration) => {
      const textDiv = messageNode.querySelector('.chat-msg-text');
      if (textDiv) {
        textDiv.innerHTML = createVoicePlayerHTML(audioUrl, duration);
        initVoicePlayer(textDiv.querySelector('.voice-message-player'));
      }
    }
  };

  // ============================================================================
  // DÉMARRAGE
  // ============================================================================
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 200));
  } else {
    setTimeout(init, 200);
  }

})();
