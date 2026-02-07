/**
 * ============================================================================
 * VOICE-TO-TEXT MODULE - Saboteur Chat
 * ============================================================================
 * 
 * Utilise la Web Speech API native (gratuite) pour convertir la voix en texte.
 * Compatible: Chrome, Edge, Safari. Support limité sur Firefox.
 * 
 * Usage: Le script s'auto-initialise après le chargement du chat.
 */

(function() {
  'use strict';

  // ============================================================================
  // CONFIGURATION
  // ============================================================================
  
  const CONFIG = {
    // Langues supportées (code Web Speech API)
    languages: {
      fr: 'fr-FR',
      en: 'en-US',
      es: 'es-ES',
      de: 'de-DE',
      it: 'it-IT',
      pt: 'pt-PT',
      nl: 'nl-NL'
    },
    // Timeout si pas de parole détectée (ms)
    silenceTimeout: 5000,
    // Auto-envoyer après reconnaissance ?
    autoSend: false,
    // Afficher indicateur visuel pendant écoute
    showListeningIndicator: true
  };

  // ============================================================================
  // VÉRIFICATION SUPPORT
  // ============================================================================
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    console.warn('[VoiceToText] ❌ Web Speech API non supportée sur ce navigateur');
    return;
  }

  // ============================================================================
  // ÉTAT
  // ============================================================================
  
  let recognition = null;
  let isListening = false;
  let voiceButton = null;
  let chatInput = null;
  let currentLanguage = 'fr';

  // ============================================================================
  // TRADUCTIONS UI
  // ============================================================================
  
  const UI_TEXTS = {
    fr: {
      listening: '🎤 Écoute...',
      micTitle: 'Dicter un message',
      micTitleListening: 'Cliquer pour arrêter',
      errorNoPermission: 'Microphone non autorisé',
      errorNotSupported: 'Non supporté sur ce navigateur',
      errorNetwork: 'Erreur réseau',
      errorNoSpeech: 'Aucune parole détectée'
    },
    en: {
      listening: '🎤 Listening...',
      micTitle: 'Dictate a message',
      micTitleListening: 'Click to stop',
      errorNoPermission: 'Microphone not allowed',
      errorNotSupported: 'Not supported on this browser',
      errorNetwork: 'Network error',
      errorNoSpeech: 'No speech detected'
    },
    es: {
      listening: '🎤 Escuchando...',
      micTitle: 'Dictar un mensaje',
      micTitleListening: 'Clic para detener',
      errorNoPermission: 'Micrófono no autorizado',
      errorNotSupported: 'No soportado en este navegador',
      errorNetwork: 'Error de red',
      errorNoSpeech: 'No se detectó voz'
    },
    de: {
      listening: '🎤 Hören...',
      micTitle: 'Nachricht diktieren',
      micTitleListening: 'Klicken zum Stoppen',
      errorNoPermission: 'Mikrofon nicht erlaubt',
      errorNotSupported: 'Nicht unterstützt',
      errorNetwork: 'Netzwerkfehler',
      errorNoSpeech: 'Keine Sprache erkannt'
    },
    it: {
      listening: '🎤 Ascolto...',
      micTitle: 'Dettare un messaggio',
      micTitleListening: 'Clicca per fermare',
      errorNoPermission: 'Microfono non autorizzato',
      errorNotSupported: 'Non supportato',
      errorNetwork: 'Errore di rete',
      errorNoSpeech: 'Nessun discorso rilevato'
    },
    pt: {
      listening: '🎤 Ouvindo...',
      micTitle: 'Ditar uma mensagem',
      micTitleListening: 'Clique para parar',
      errorNoPermission: 'Microfone não autorizado',
      errorNotSupported: 'Não suportado',
      errorNetwork: 'Erro de rede',
      errorNoSpeech: 'Nenhuma fala detectada'
    },
    nl: {
      listening: '🎤 Luisteren...',
      micTitle: 'Bericht dicteren',
      micTitleListening: 'Klik om te stoppen',
      errorNoPermission: 'Microfoon niet toegestaan',
      errorNotSupported: 'Niet ondersteund',
      errorNetwork: 'Netwerkfout',
      errorNoSpeech: 'Geen spraak gedetecteerd'
    }
  };

  function t(key) {
    const lang = currentLanguage || 'fr';
    return UI_TEXTS[lang]?.[key] || UI_TEXTS['fr'][key] || key;
  }

  // ============================================================================
  // INITIALISATION
  // ============================================================================
  
  function init() {
    // Attendre que le chat soit chargé
    chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatInputContainer = document.querySelector('.chat-input-container');
    
    if (!chatInput || !chatSend || !chatInputContainer) {
      // Réessayer dans 500ms
      setTimeout(init, 500);
      return;
    }

    // Détecter la langue actuelle
    detectLanguage();

    // Créer le bouton micro
    createVoiceButton(chatInputContainer, chatSend);

    // Initialiser la reconnaissance vocale
    initRecognition();

    console.log('[VoiceToText] ✅ Module initialisé (langue:', currentLanguage, ')');
  }

  function detectLanguage() {
    // Essayer plusieurs sources pour la langue
    if (typeof window.getCurrentLanguage === 'function') {
      currentLanguage = window.getCurrentLanguage();
    } else if (typeof window.currentLang !== 'undefined') {
      currentLanguage = window.currentLang;
    } else {
      // Fallback: localStorage ou navigateur
      currentLanguage = localStorage.getItem('saboteur_language') || 
                        navigator.language?.substring(0, 2) || 'fr';
    }
    
    // Valider que la langue est supportée
    if (!CONFIG.languages[currentLanguage]) {
      currentLanguage = 'fr';
    }
  }

  // ============================================================================
  // UI - BOUTON MICRO
  // ============================================================================
  
  function createVoiceButton(container, chatSend) {
    voiceButton = document.createElement('button');
    voiceButton.id = 'chatVoice';
    voiceButton.type = 'button';
    voiceButton.innerHTML = '🎤';
    voiceButton.title = t('micTitle');
    voiceButton.setAttribute('aria-label', t('micTitle'));
    
    // Insérer avant le bouton envoyer
    container.insertBefore(voiceButton, chatSend);

    // Styles
    addStyles();

    // Événements
    voiceButton.addEventListener('click', toggleListening);
    
    // Support tactile (maintenir pour parler)
    voiceButton.addEventListener('touchstart', handleTouchStart, { passive: true });
    voiceButton.addEventListener('touchend', handleTouchEnd);
  }

  function addStyles() {
    const style = document.createElement('style');
    style.id = 'voice-to-text-styles';
    style.textContent = `
      #chatVoice {
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
      }
      
      #chatVoice:hover {
        background: rgba(0, 212, 255, 0.2);
        transform: scale(1.05);
      }
      
      #chatVoice.listening {
        background: linear-gradient(135deg, #ff4757, #ff6b81);
        animation: pulse-mic 1s ease-in-out infinite;
        color: white;
      }
      
      #chatVoice.listening:hover {
        background: linear-gradient(135deg, #ff6b81, #ff4757);
      }
      
      #chatVoice:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      @keyframes pulse-mic {
        0%, 100% { 
          box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.4);
          transform: scale(1);
        }
        50% { 
          box-shadow: 0 0 0 10px rgba(255, 71, 87, 0);
          transform: scale(1.05);
        }
      }
      
      /* Indicateur d'écoute dans le placeholder */
      #chatInput.voice-listening::placeholder {
        color: #ff4757;
      }
      
      /* Tooltip d'erreur */
      .voice-error-tooltip {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: #ff4757;
        color: white;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 0.75rem;
        white-space: nowrap;
        margin-bottom: 8px;
        animation: fadeInUp 0.3s ease;
        z-index: 1000;
      }
      
      .voice-error-tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 6px solid transparent;
        border-top-color: #ff4757;
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
      
      /* Mobile: bouton plus grand */
      @media (max-width: 480px) {
        #chatVoice {
          width: 44px;
          height: 44px;
          font-size: 1.2rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ============================================================================
  // RECONNAISSANCE VOCALE
  // ============================================================================
  
  function initRecognition() {
    recognition = new SpeechRecognition();
    
    // Configuration
    recognition.continuous = false;        // Arrêter après une phrase
    recognition.interimResults = true;     // Résultats intermédiaires
    recognition.maxAlternatives = 1;       // Une seule alternative
    recognition.lang = CONFIG.languages[currentLanguage] || 'fr-FR';

    // Événements
    recognition.onstart = onRecognitionStart;
    recognition.onend = onRecognitionEnd;
    recognition.onresult = onRecognitionResult;
    recognition.onerror = onRecognitionError;
    recognition.onspeechend = onSpeechEnd;
  }

  function toggleListening() {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  function startListening() {
    if (isListening) return;
    
    // Mettre à jour la langue avant de commencer
    detectLanguage();
    recognition.lang = CONFIG.languages[currentLanguage] || 'fr-FR';
    
    try {
      recognition.start();
    } catch (err) {
      console.error('[VoiceToText] Erreur démarrage:', err);
      // Si déjà en cours, arrêter et redémarrer
      if (err.name === 'InvalidStateError') {
        recognition.stop();
        setTimeout(() => recognition.start(), 100);
      }
    }
  }

  function stopListening() {
    if (!isListening) return;
    
    try {
      recognition.stop();
    } catch (err) {
      console.error('[VoiceToText] Erreur arrêt:', err);
    }
  }

  // ============================================================================
  // ÉVÉNEMENTS RECONNAISSANCE
  // ============================================================================
  
  function onRecognitionStart() {
    isListening = true;
    voiceButton.classList.add('listening');
    voiceButton.title = t('micTitleListening');
    chatInput.classList.add('voice-listening');
    
    // Sauvegarder le placeholder original
    chatInput._originalPlaceholder = chatInput.placeholder;
    chatInput.placeholder = t('listening');
    
    console.log('[VoiceToText] 🎤 Écoute démarrée (', recognition.lang, ')');
  }

  function onRecognitionEnd() {
    isListening = false;
    voiceButton.classList.remove('listening');
    voiceButton.title = t('micTitle');
    chatInput.classList.remove('voice-listening');
    
    // Restaurer le placeholder
    if (chatInput._originalPlaceholder) {
      chatInput.placeholder = chatInput._originalPlaceholder;
    }
    
    console.log('[VoiceToText] 🛑 Écoute terminée');
  }

  function onRecognitionResult(event) {
    let finalTranscript = '';
    let interimTranscript = '';
    
    console.log('[VoiceToText] 📝 onresult event:', event.results.length, 'résultats');
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      const confidence = event.results[i][0].confidence;
      
      console.log('[VoiceToText] Résultat', i, ':', transcript, 'final:', event.results[i].isFinal, 'confidence:', confidence);
      
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }
    
    // V11: Helper pour mettre à jour l'input (compatible mobile)
    function updateInput(text) {
      if (!chatInput) return;
      chatInput.value = text;
      // Force la mise à jour visuelle sur mobile
      chatInput.dispatchEvent(new Event('input', { bubbles: true }));
      console.log('[VoiceToText] Input mis à jour:', text);
    }
    
    // Afficher le résultat intermédiaire dans l'input
    if (interimTranscript) {
      updateInput(interimTranscript);
    }
    
    // Résultat final
    if (finalTranscript) {
      updateInput(finalTranscript);
      console.log('[VoiceToText] ✅ Texte reconnu:', finalTranscript);
      
      // Focus sur l'input pour que l'utilisateur puisse modifier/envoyer
      chatInput.focus();
      
      // Auto-envoyer si configuré
      if (CONFIG.autoSend && finalTranscript.trim()) {
        setTimeout(() => {
          const sendBtn = document.getElementById('chatSend');
          if (sendBtn) sendBtn.click();
        }, 300);
      }
    }
  }

  function onRecognitionError(event) {
    console.error('[VoiceToText] ❌ Erreur:', event.error, 'message:', event.message);
    
    let errorMessage = '';
    
    switch (event.error) {
      case 'not-allowed':
      case 'service-not-allowed':
        errorMessage = t('errorNoPermission');
        console.error('[VoiceToText] Microphone non autorisé - vérifiez les permissions');
        break;
      case 'no-speech':
        errorMessage = t('errorNoSpeech');
        break;
      case 'network':
        errorMessage = t('errorNetwork');
        console.error('[VoiceToText] Erreur réseau - la reconnaissance vocale nécessite une connexion internet');
        break;
      case 'audio-capture':
        errorMessage = t('errorNoPermission');
        console.error('[VoiceToText] Impossible de capturer l\'audio - microphone occupé ou non disponible');
        break;
      case 'aborted':
        // Ignoré - l'utilisateur a annulé
        console.log('[VoiceToText] Reconnaissance annulée');
        return;
      default:
        errorMessage = t('errorNotSupported');
        console.error('[VoiceToText] Erreur non gérée:', event.error);
    }
    
    if (errorMessage) {
      showErrorTooltip(errorMessage);
    }
  }

  function onSpeechEnd() {
    // Appelé quand l'utilisateur arrête de parler
    // La reconnaissance continue un peu pour finaliser
    console.log('[VoiceToText] Fin de parole détectée');
  }

  // ============================================================================
  // SUPPORT TACTILE (maintenir pour parler)
  // ============================================================================
  
  let touchTimer = null;
  let isTouchHolding = false;

  function handleTouchStart(event) {
    // Démarrer un timer pour détecter le "maintien"
    touchTimer = setTimeout(() => {
      isTouchHolding = true;
      startListening();
      // Vibration feedback (si supporté)
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 200); // 200ms pour distinguer du simple tap
  }

  function handleTouchEnd(event) {
    // Annuler le timer
    if (touchTimer) {
      clearTimeout(touchTimer);
      touchTimer = null;
    }
    
    // Si on maintenait, arrêter l'écoute
    if (isTouchHolding) {
      isTouchHolding = false;
      stopListening();
      event.preventDefault(); // Empêcher le click
    }
    // Sinon, le click normal sera déclenché (toggle)
  }

  // ============================================================================
  // UI HELPERS
  // ============================================================================
  
  function showErrorTooltip(message) {
    // Supprimer l'ancien tooltip s'il existe
    const oldTooltip = document.querySelector('.voice-error-tooltip');
    if (oldTooltip) oldTooltip.remove();
    
    // Créer le tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'voice-error-tooltip';
    tooltip.textContent = message;
    
    // Positionner par rapport au bouton
    voiceButton.style.position = 'relative';
    voiceButton.appendChild(tooltip);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
      tooltip.remove();
    }, 3000);
  }

  // ============================================================================
  // API PUBLIQUE
  // ============================================================================
  
  window.VoiceToText = {
    // Démarrer/arrêter manuellement
    start: startListening,
    stop: stopListening,
    toggle: toggleListening,
    
    // État
    isListening: () => isListening,
    isSupported: () => !!SpeechRecognition,
    
    // Configuration
    setAutoSend: (value) => { CONFIG.autoSend = !!value; },
    setLanguage: (lang) => {
      if (CONFIG.languages[lang]) {
        currentLanguage = lang;
        if (recognition) {
          recognition.lang = CONFIG.languages[lang];
        }
      }
    }
  };

  // ============================================================================
  // DÉMARRAGE
  // ============================================================================
  
  // Attendre que le DOM soit prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 100));
  } else {
    setTimeout(init, 100);
  }

})();
