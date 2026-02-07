/**
 * LiveKit Service - Server Side
 * Remplace daily-manager.js
 * 
 * Gère la création de tokens JWT pour les rooms LiveKit.
 * Compatible LiveKit Cloud (test) et LiveKit self-hosted (prod Hetzner).
 * 
 * La room LiveKit est créée automatiquement quand le 1er participant rejoint
 * (pas besoin de la créer via API comme Daily.co).
 */

const { AccessToken } = require('livekit-server-sdk');
const logger = require('./logger');

// --- Configuration ---
const LIVEKIT_API_KEY    = process.env.LIVEKIT_API_KEY    || '';
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || '';
const LIVEKIT_URL        = process.env.LIVEKIT_URL        || 'wss://your-project.livekit.cloud';

class LiveKitService {
  constructor() {
    // Cache des rooms actives (roomCode -> metadata)
    this.rooms = new Map();
    
    if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
      logger.warn('[LiveKit] ⚠️ LIVEKIT_API_KEY or LIVEKIT_API_SECRET not configured!');
    } else {
      logger.info('[LiveKit] ✅ Service initialized', { url: LIVEKIT_URL });
    }
  }

  /**
   * Génère un token JWT pour un participant.
   * La room est créée automatiquement par LiveKit quand le 1er participant rejoint.
   * 
   * @param {string} roomCode - Code de la room de jeu
   * @param {string} playerName - Nom affiché du joueur
   * @param {string} playerId - ID unique du joueur
   * @param {boolean} canPublish - Si le joueur peut publier audio/vidéo
   * @returns {Promise<{token: string, url: string, roomName: string}>}
   */
  async createToken(roomCode, playerName, playerId, canPublish = true) {
    if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
      throw new Error('LiveKit not configured: missing API key or secret');
    }

    const roomName = `saboteur-${roomCode}`;

    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: playerId,
      name: playerName,
      ttl: '6h',
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: canPublish,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();

    // Mettre en cache
    if (!this.rooms.has(roomCode)) {
      this.rooms.set(roomCode, {
        roomName,
        createdAt: Date.now(),
        expiresAt: Date.now() + 6 * 60 * 60 * 1000, // 6h
        participants: new Set()
      });
    }
    this.rooms.get(roomCode).participants.add(playerId);

    logger.info('[LiveKit] Token created', { roomName, playerId, canPublish });

    return { token, url: LIVEKIT_URL, roomName };
  }

  /**
   * Vérifie si une room existe dans le cache
   */
  getVideoRoom(roomCode) {
    const room = this.rooms.get(roomCode);
    if (!room) return null;
    if (Date.now() > room.expiresAt) {
      this.rooms.delete(roomCode);
      return null;
    }
    return room;
  }

  /**
   * Supprime une room du cache (la room LiveKit expire automatiquement quand tous quittent)
   */
  deleteVideoRoom(roomCode) {
    this.rooms.delete(roomCode);
    logger.info('[LiveKit] Room removed from cache:', roomCode);
  }

  /**
   * Nettoie les rooms expirées
   */
  cleanupExpiredRooms() {
    const now = Date.now();
    for (const [roomCode, room] of this.rooms.entries()) {
      if (now > room.expiresAt) {
        this.rooms.delete(roomCode);
      }
    }
  }

  /**
   * Info pour le dashboard admin
   */
  getStatus() {
    return {
      configured: !!(LIVEKIT_API_KEY && LIVEKIT_API_SECRET),
      url: LIVEKIT_URL,
      activeRooms: this.rooms.size,
      rooms: Array.from(this.rooms.entries()).map(([code, r]) => ({
        roomCode: code,
        roomName: r.roomName,
        participants: r.participants.size,
        createdAt: new Date(r.createdAt).toISOString()
      }))
    };
  }
}

// Singleton
const livekitService = new LiveKitService();

// Nettoyage automatique toutes les heures
setInterval(() => {
  livekitService.cleanupExpiredRooms();
}, 60 * 60 * 1000);

module.exports = livekitService;
module.exports.LIVEKIT_URL = LIVEKIT_URL;
