// ============================================
// SYSTÈME DE POP-UPS WORKFLOWS
// Pop-up centrée avec bouton de fermeture
// ============================================

// Vérifier les notifications au chargement
async function checkWorkflowNotifications() {
  const token = localStorage.getItem('saboteur_token') || localStorage.getItem('token');
  if (!token) return;
  
  try {
    const response = await fetch('/api/notifications', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) return;
    
    const notifications = await response.json();
    
    // Afficher chaque notification avec un délai
    notifications.forEach((notif, index) => {
      setTimeout(() => {
        showWorkflowPopup(notif.message);
      }, index * 1500); // 1.5 seconde entre chaque
    });
    
  } catch (error) {
    console.error('[Workflows] Erreur notifications:', error);
  }
}

// Afficher un pop-up centré
function showWorkflowPopup(message) {
  // Créer le conteneur du pop-up
  const popup = document.createElement('div');
  popup.className = 'workflow-notification';
  popup.innerHTML = `
    <div class="workflow-notification-content">
      <div class="workflow-notification-icon">🎉</div>
      <div class="workflow-notification-message">${message}</div>
      <button class="workflow-notification-close">C'est parti ! 🚀</button>
    </div>
  `;
  
  // Ajouter au body
  document.body.appendChild(popup);
  
  // Fermer au clic sur le bouton
  popup.querySelector('.workflow-notification-close').addEventListener('click', () => {
    closeWorkflowPopup(popup);
  });
  
  // Fermer au clic sur l'overlay
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      closeWorkflowPopup(popup);
    }
  });
  
  // Animation d'entrée
  setTimeout(() => {
    popup.classList.add('show');
  }, 10);
  
  // Auto-fermer après 15 secondes
  setTimeout(() => {
    if (popup.parentNode) {
      closeWorkflowPopup(popup);
    }
  }, 15000);
}

// Fermer un pop-up
function closeWorkflowPopup(popup) {
  popup.classList.remove('show');
  popup.classList.add('hide');
  setTimeout(() => {
    if (popup.parentNode) {
      popup.remove();
    }
  }, 300);
}

// Appeler au chargement de la page (après login)
document.addEventListener('DOMContentLoaded', () => {
  // Attendre un peu que l'utilisateur soit connecté
  setTimeout(checkWorkflowNotifications, 1500);
});
