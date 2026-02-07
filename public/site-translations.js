/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║         🌍 RORONOA GAMES - SITE TRANSLATIONS V1.0                         ║
 * ║                                                                           ║
 * ║  Langues supportées : FR, EN, ES, IT, DE, PT, NL                         ║
 * ║  Pages concernées : index-site, products, account, pages légales         ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

const SITE_TRANSLATIONS = {
  // ============================================================================
  // LANGUES DISPONIBLES
  // ============================================================================
  _languages: {
    fr: { name: "Français", flag: "🇫🇷" },
    en: { name: "English", flag: "🇬🇧" },
    es: { name: "Español", flag: "🇪🇸" },
    de: { name: "Deutsch", flag: "🇩🇪" },
    it: { name: "Italiano", flag: "🇮🇹" },
    pt: { name: "Português", flag: "🇵🇹" },
    nl: { name: "Nederlands", flag: "🇳🇱" }
  },

  // ============================================================================
  // NAVIGATION (Header)
  // ============================================================================
  nav: {
    home: {
      fr: "Accueil", en: "Home", es: "Inicio", de: "Startseite", it: "Home", pt: "Início", nl: "Home"
    },
    about: {
      fr: "À Propos", en: "About", es: "Acerca de", de: "Über uns", it: "Chi siamo", pt: "Sobre", nl: "Over ons"
    },
    products: {
      fr: "Produits", en: "Products", es: "Productos", de: "Produkte", it: "Prodotti", pt: "Produtos", nl: "Producten"
    },
    contact: {
      fr: "Contact", en: "Contact", es: "Contacto", de: "Kontakt", it: "Contatto", pt: "Contato", nl: "Contact"
    },
    login: {
      fr: "Se Connecter", en: "Log In", es: "Iniciar Sesión", de: "Anmelden", it: "Accedi", pt: "Entrar", nl: "Inloggen"
    },
    logout: {
      fr: "Déconnexion", en: "Log Out", es: "Cerrar Sesión", de: "Abmelden", it: "Esci", pt: "Sair", nl: "Uitloggen"
    },
    my_account: {
      fr: "Mon Compte", en: "My Account", es: "Mi Cuenta", de: "Mein Konto", it: "Il Mio Account", pt: "Minha Conta", nl: "Mijn Account"
    }
  },

  // ============================================================================
  // PAGE D'ACCUEIL (index-site.html)
  // ============================================================================
  home: {
    // Hero Section
    hero_badge: {
      fr: "Studio de Création Vidéoludique",
      en: "Video Game Creation Studio",
      es: "Estudio de Creación de Videojuegos",
      de: "Videospiel-Entwicklungsstudio",
      it: "Studio di Creazione Videoludica",
      pt: "Estúdio de Criação de Videogames",
      nl: "Videogame Creatie Studio"
    },
    hero_title_1: {
      fr: "L'Art du Combat",
      en: "The Art of Combat",
      es: "El Arte del Combate",
      de: "Die Kunst des Kampfes",
      it: "L'Arte del Combattimento",
      pt: "A Arte do Combate",
      nl: "De Kunst van het Gevecht"
    },
    hero_title_2: {
      fr: "Rencontre le Jeu",
      en: "Meets Gaming",
      es: "Encuentra el Juego",
      de: "Trifft das Spiel",
      it: "Incontra il Gioco",
      pt: "Encontra o Jogo",
      nl: "Ontmoet het Spel"
    },
    hero_title_full: {
      fr: "L'Art du Combat<br>Rencontre le Jeu",
      en: "The Art of Combat<br>Meets Gaming",
      es: "El Arte del Combate<br>Encuentra el Juego",
      de: "Die Kunst des Kampfes<br>Trifft das Spiel",
      it: "L'Arte del Combattimento<br>Incontra il Gioco",
      pt: "A Arte do Combate<br>Encontra o Jogo",
      nl: "De Kunst van de Strijd<br>Ontmoet Gaming"
    },
    hero_description: {
      fr: "Créateur d'expériences vidéoludiques uniques • Applications Web & Mobile • Jeux de Société Nouvelle Génération",
      en: "Creator of unique gaming experiences • Web & Mobile Apps • Next Generation Board Games",
      es: "Creador de experiencias de juego únicas • Apps Web y Móvil • Juegos de Mesa Nueva Generación",
      de: "Schöpfer einzigartiger Spielerlebnisse • Web & Mobile Apps • Brettspiele der neuen Generation",
      it: "Creatore di esperienze videoludiche uniche • App Web e Mobile • Giochi da Tavolo di Nuova Generazione",
      pt: "Criador de experiências de jogo únicas • Apps Web e Mobile • Jogos de Tabuleiro de Nova Geração",
      nl: "Maker van unieke game-ervaringen • Web & Mobiele Apps • Bordspellen van de Nieuwe Generatie"
    },
    hero_cta: {
      fr: "Découvrir nos Jeux",
      en: "Discover Our Games",
      es: "Descubrir Nuestros Juegos",
      de: "Unsere Spiele Entdecken",
      it: "Scopri i Nostri Giochi",
      pt: "Descobrir Nossos Jogos",
      nl: "Ontdek Onze Spellen"
    },
    stat_game: {
      fr: "Jeu Phare", en: "Flagship Game", es: "Juego Estrella", de: "Flaggschiff-Spiel", it: "Gioco di Punta", pt: "Jogo Principal", nl: "Vlaggenschip"
    },
    stat_universes: {
      fr: "Univers", en: "Universes", es: "Universos", de: "Universen", it: "Universi", pt: "Universos", nl: "Universums"
    },
    stat_possibilities: {
      fr: "Possibilités", en: "Possibilities", es: "Posibilidades", de: "Möglichkeiten", it: "Possibilità", pt: "Possibilidades", nl: "Mogelijkheden"
    },

    // About Section
    about_badge: {
      fr: "Notre Mission", en: "Our Mission", es: "Nuestra Misión", de: "Unsere Mission", it: "La Nostra Missione", pt: "Nossa Missão", nl: "Onze Missie"
    },
    about_title: {
      fr: "Créateur de Contenu Vidéoludique",
      en: "Video Game Content Creator",
      es: "Creador de Contenido Videoludico",
      de: "Videospiel-Inhalte-Ersteller",
      it: "Creatore di Contenuti Videoludici",
      pt: "Criador de Conteúdo de Videogames",
      nl: "Videogame Content Creator"
    },
    about_card1_title: {
      fr: "Applications Web & Mobile", en: "Web & Mobile Apps", es: "Apps Web y Móvil", de: "Web & Mobile Apps", it: "App Web e Mobile", pt: "Apps Web e Mobile", nl: "Web & Mobiele Apps"
    },
    about_card1_desc: {
      fr: "Des expériences de jeu accessibles partout, sur tous vos appareils. Technologies modernes pour une fluidité optimale.",
      en: "Gaming experiences accessible everywhere, on all your devices. Modern technologies for optimal fluidity.",
      es: "Experiencias de juego accesibles en todas partes, en todos tus dispositivos. Tecnologías modernas para una fluidez óptima.",
      de: "Spielerlebnisse überall zugänglich, auf allen Ihren Geräten. Moderne Technologien für optimale Flüssigkeit.",
      it: "Esperienze di gioco accessibili ovunque, su tutti i tuoi dispositivi. Tecnologie moderne per una fluidità ottimale.",
      pt: "Experiências de jogo acessíveis em qualquer lugar, em todos os seus dispositivos. Tecnologias modernas para fluidez ideal.",
      nl: "Game-ervaringen overal toegankelijk, op al je apparaten. Moderne technologieën voor optimale vloeiendheid."
    },
    about_card2_title: {
      fr: "Jeux de Société Digitaux", en: "Digital Board Games", es: "Juegos de Mesa Digitales", de: "Digitale Brettspiele", it: "Giochi da Tavolo Digitali", pt: "Jogos de Tabuleiro Digitais", nl: "Digitale Bordspellen"
    },
    about_card2_desc: {
      fr: "L'esprit convivial des jeux de société combiné à la puissance du digital. Jouez avec vos amis où que vous soyez.",
      en: "The friendly spirit of board games combined with digital power. Play with your friends wherever you are.",
      es: "El espíritu amigable de los juegos de mesa combinado con el poder digital. Juega con tus amigos donde quiera que estés.",
      de: "Der freundschaftliche Geist von Brettspielen kombiniert mit digitaler Kraft. Spielen Sie mit Ihren Freunden, wo immer Sie sind.",
      it: "Lo spirito conviviale dei giochi da tavolo combinato con la potenza del digitale. Gioca con i tuoi amici ovunque tu sia.",
      pt: "O espírito amigável dos jogos de tabuleiro combinado com o poder digital. Jogue com seus amigos onde quer que esteja.",
      nl: "De gezellige sfeer van bordspellen gecombineerd met digitale kracht. Speel met je vrienden waar je ook bent."
    },
    about_card3_title: {
      fr: "Univers Immersifs", en: "Immersive Universes", es: "Universos Inmersivos", de: "Immersive Universen", it: "Universi Immersivi", pt: "Universos Imersivos", nl: "Meeslepende Universums"
    },
    about_card3_desc: {
      fr: "4 thèmes riches avec <strong>visio intégrée</strong> : Spatial, Loup-Garou, Académie des Sorciers, Royaumes Mythiques. Rejoignez des <strong>salles publiques</strong> ou créez des <strong>parties privées</strong> avec vos amis !",
      en: "4 rich themes with <strong>integrated video</strong>: Space, Werewolf, Wizard Academy, Mythic Realms. Join <strong>public rooms</strong> or create <strong>private games</strong> with your friends!",
      es: "4 temas ricos con <strong>video integrado</strong>: Espacial, Hombre Lobo, Academia de Magos, Reinos Míticos. ¡Únete a <strong>salas públicas</strong> o crea <strong>partidas privadas</strong> con tus amigos!",
      de: "4 reichhaltige Themen mit <strong>integriertem Video</strong>: Weltraum, Werwolf, Zaubererakademie, Mythische Reiche. Treten Sie <strong>öffentlichen Räumen</strong> bei oder erstellen Sie <strong>private Spiele</strong> mit Ihren Freunden!",
      it: "4 temi ricchi con <strong>video integrato</strong>: Spaziale, Lupo Mannaro, Accademia dei Maghi, Regni Mitici. Unisciti a <strong>stanze pubbliche</strong> o crea <strong>partite private</strong> con i tuoi amici!",
      pt: "4 temas ricos com <strong>vídeo integrado</strong>: Espacial, Lobisomem, Academia de Bruxos, Reinos Míticos. Junte-se a <strong>salas públicas</strong> ou crie <strong>jogos privados</strong> com seus amigos!",
      nl: "4 rijke thema's met <strong>geïntegreerde video</strong>: Ruimte, Weerwolf, Tovenaarsacademie, Mythische Rijken. Sluit je aan bij <strong>openbare kamers</strong> of maak <strong>privéspellen</strong> met je vrienden!"
    },
    philosophy_title: {
      fr: "Notre Philosophie", en: "Our Philosophy", es: "Nuestra Filosofía", de: "Unsere Philosophie", it: "La Nostra Filosofia", pt: "Nossa Filosofia", nl: "Onze Filosofie"
    },
    philosophy_text1: {
      fr: "Comme un guerrier qui perfectionne son art à travers trois sabres, nous créons des expériences à travers trois piliers : <strong>Innovation</strong>, <strong>Qualité</strong>, et <strong>Communauté</strong>.",
      en: "Like a warrior who perfects their art through three swords, we create experiences through three pillars: <strong>Innovation</strong>, <strong>Quality</strong>, and <strong>Community</strong>.",
      es: "Como un guerrero que perfecciona su arte a través de tres espadas, creamos experiencias a través de tres pilares: <strong>Innovación</strong>, <strong>Calidad</strong> y <strong>Comunidad</strong>.",
      de: "Wie ein Krieger, der seine Kunst durch drei Schwerter perfektioniert, erschaffen wir Erlebnisse durch drei Säulen: <strong>Innovation</strong>, <strong>Qualität</strong> und <strong>Gemeinschaft</strong>.",
      it: "Come un guerriero che perfeziona la sua arte attraverso tre spade, creiamo esperienze attraverso tre pilastri: <strong>Innovazione</strong>, <strong>Qualità</strong> e <strong>Comunità</strong>.",
      pt: "Como um guerreiro que aperfeiçoa sua arte através de três espadas, criamos experiências através de três pilares: <strong>Inovação</strong>, <strong>Qualidade</strong> e <strong>Comunidade</strong>.",
      nl: "Zoals een krijger die zijn kunst perfectioneert door drie zwaarden, creëren wij ervaringen door drie pijlers: <strong>Innovatie</strong>, <strong>Kwaliteit</strong> en <strong>Gemeenschap</strong>."
    },
    philosophy_text2: {
      fr: "Chaque jeu est conçu pour rassembler, divertir et créer des moments inoubliables. Notre ambition : devenir le studio de référence pour les jeux sociaux nouvelle génération.",
      en: "Each game is designed to bring together, entertain and create unforgettable moments. Our ambition: to become the reference studio for next-generation social games.",
      es: "Cada juego está diseñado para reunir, entretener y crear momentos inolvidables. Nuestra ambición: convertirnos en el estudio de referencia para juegos sociales de nueva generación.",
      de: "Jedes Spiel ist darauf ausgelegt, zusammenzubringen, zu unterhalten und unvergessliche Momente zu schaffen. Unser Ziel: das Referenzstudio für Social Games der nächsten Generation zu werden.",
      it: "Ogni gioco è progettato per riunire, intrattenere e creare momenti indimenticabili. La nostra ambizione: diventare lo studio di riferimento per i giochi sociali di nuova generazione.",
      pt: "Cada jogo é projetado para reunir, entreter e criar momentos inesquecíveis. Nossa ambição: tornar-se o estúdio de referência para jogos sociais de nova geração.",
      nl: "Elk spel is ontworpen om samen te brengen, te vermaken en onvergetelijke momenten te creëren. Onze ambitie: het referentiestudio worden voor sociale spellen van de nieuwe generatie."
    },

    // Featured Game
    featured_badge: {
      fr: "Jeu Phare", en: "Flagship Game", es: "Juego Estrella", de: "Flaggschiff-Spiel", it: "Gioco di Punta", pt: "Jogo Principal", nl: "Vlaggenschip"
    },
    featured_title: {
      fr: "Saboteurs : Le Jeu Social Ultime",
      en: "Saboteurs: The Ultimate Social Game",
      es: "Saboteadores: El Juego Social Definitivo",
      de: "Saboteure: Das ultimative Soziale Spiel",
      it: "Sabotatori: Il Gioco Sociale Definitivo",
      pt: "Sabotadores: O Jogo Social Definitivo",
      nl: "Saboteurs: Het Ultieme Sociale Spel"
    },
    featured_subtitle: {
      fr: "4 Univers • Stratégie & Déduction",
      en: "4 Universes • Strategy & Deduction",
      es: "4 Universos • Estrategia y Deducción",
      de: "4 Universen • Strategie & Deduktion",
      it: "4 Universi • Strategia e Deduzione",
      pt: "4 Universos • Estratégia e Dedução",
      nl: "4 Universums • Strategie & Deductie"
    },
    featured_desc: {
      fr: "Infiltrez-vous dans une équipe, déjouez les saboteurs, et menez votre camp à la victoire. Un jeu de rôle social addictif avec <strong>visioconférence intégrée</strong> (aucun logiciel tiers requis) et <strong>avatars IA personnalisés</strong> créés face-to-face pour une immersion totale.",
      en: "Infiltrate a team, outsmart the saboteurs, and lead your side to victory. An addictive social role-playing game with <strong>integrated video conferencing</strong> (no third-party software required) and <strong>personalized AI avatars</strong> created face-to-face for total immersion.",
      es: "Infiltra un equipo, supera a los saboteadores y lleva a tu bando a la victoria. Un juego de rol social adictivo con <strong>videoconferencia integrada</strong> (sin software de terceros) y <strong>avatares IA personalizados</strong> creados cara a cara para una inmersión total.",
      de: "Infiltrieren Sie ein Team, überlisten Sie die Saboteure und führen Sie Ihre Seite zum Sieg. Ein süchtig machendes soziales Rollenspiel mit <strong>integrierter Videokonferenz</strong> (keine Drittanbieter-Software erforderlich) und <strong>personalisierten KI-Avataren</strong>, die von Angesicht zu Angesicht für totale Immersion erstellt werden.",
      it: "Infiltrati in una squadra, supera in astuzia i sabotatori e porta la tua parte alla vittoria. Un gioco di ruolo sociale avvincente con <strong>videoconferenza integrata</strong> (nessun software di terze parti richiesto) e <strong>avatar IA personalizzati</strong> creati faccia a faccia per un'immersione totale.",
      pt: "Infiltre-se em uma equipe, supere os sabotadores e leve seu lado à vitória. Um jogo de RPG social viciante com <strong>videoconferência integrada</strong> (sem software de terceiros) e <strong>avatares de IA personalizados</strong> criados cara a cara para imersão total.",
      nl: "Infiltreer een team, slim de saboteurs af en leid je kant naar de overwinning. Een verslavend sociaal rollenspel met <strong>geïntegreerde videoconferentie</strong> (geen software van derden vereist) en <strong>gepersonaliseerde AI-avatars</strong> die face-to-face zijn gemaakt voor totale onderdompeling."
    },
    
    // Avatar IA
    create_avatar_ia: {
      fr: "✨ Créez votre avatar face-to-face avec l'IA",
      en: "✨ Create your avatar face-to-face with AI",
      es: "✨ Crea tu avatar cara a cara con IA",
      de: "✨ Erstellen Sie Ihren Avatar face-to-face mit KI",
      it: "✨ Crea il tuo avatar faccia a faccia con l'IA",
      pt: "✨ Crie seu avatar face a face com IA",
      nl: "✨ Maak je avatar face-to-face met AI"
    },
    
    // Universe Features
    universe_spatial: {
      fr: "Univers Spatial", en: "Space Universe", es: "Universo Espacial", de: "Weltraum-Universum", it: "Universo Spaziale", pt: "Universo Espacial", nl: "Ruimte Universum"
    },
    universe_werewolf: {
      fr: "Village Loups-Garous", en: "Werewolf Village", es: "Aldea Hombre Lobo", de: "Werwolf-Dorf", it: "Villaggio Lupi Mannari", pt: "Aldeia Lobisomem", nl: "Weerwolf Dorp"
    },
    universe_academy: {
      fr: "Académie de Magie", en: "Magic Academy", es: "Academia de Magia", de: "Magie-Akademie", it: "Accademia di Magia", pt: "Academia de Magia", nl: "Magie Academie"
    },
    universe_mythic: {
      fr: "Royaumes Mythiques", en: "Mythic Realms", es: "Reinos Míticos", de: "Mythische Reiche", it: "Regni Mitici", pt: "Reinos Míticos", nl: "Mythische Rijken"
    },
    
    // CTA Buttons
    learn_more_btn: {
      fr: "En Savoir Plus", en: "Learn More", es: "Saber Más", de: "Mehr Erfahren", it: "Scopri di Più", pt: "Saiba Mais", nl: "Meer Weten"
    },
    play_now_btn: {
      fr: "Jouer Maintenant", en: "Play Now", es: "Jugar Ahora", de: "Jetzt Spielen", it: "Gioca Ora", pt: "Jogar Agora", nl: "Nu Spelen"
    },
    
    // Contact Section
    contact_badge: {
      fr: "Nous Contacter", en: "Contact Us", es: "Contáctanos", de: "Kontaktieren Sie uns", it: "Contattaci", pt: "Contate-nos", nl: "Neem Contact Op"
    },
    contact_title: {
      fr: "Rejoignez l'Aventure", en: "Join the Adventure", es: "Únete a la Aventura", de: "Treten Sie dem Abenteuer bei", it: "Unisciti all'Avventura", pt: "Junte-se à Aventura", nl: "Sluit je aan bij het Avontuur"
    }
  },

  // ============================================================================
  // PAGE PRODUITS (products.html)
  // ============================================================================
  products: {
    hero_badge: {
      fr: "Notre Jeu Phare", en: "Our Flagship Game", es: "Nuestro Juego Estrella", de: "Unser Flaggschiff-Spiel", it: "Il Nostro Gioco di Punta", pt: "Nosso Jogo Principal", nl: "Ons Vlaggenschip"
    },
    hero_title: {
      fr: "LES SABOTEURS", en: "THE SABOTEURS", es: "LOS SABOTEADORES", de: "DIE SABOTEURE", it: "I SABOTATORI", pt: "OS SABOTADORES", nl: "DE SABOTEURS"
    },
    hero_tagline: {
      fr: "Infiltration • Déduction • Multijoueur",
      en: "Infiltration • Deduction • Multiplayer",
      es: "Infiltración • Deducción • Multijugador",
      de: "Infiltration • Deduktion • Mehrspieler",
      it: "Infiltrazione • Deduzione • Multigiocatore",
      pt: "Infiltração • Dedução • Multijogador",
      nl: "Infiltratie • Deductie • Multiplayer"
    },
    play_now: {
      fr: "🎮 Jouer Maintenant", en: "🎮 Play Now", es: "🎮 Jugar Ahora", de: "🎮 Jetzt Spielen", it: "🎮 Gioca Ora", pt: "🎮 Jogar Agora", nl: "🎮 Nu Spelen"
    },
    discover_packs: {
      fr: "💎 Découvrir les Packs", en: "💎 Discover Packs", es: "💎 Descubrir Packs", de: "💎 Packs Entdecken", it: "💎 Scopri i Pack", pt: "💎 Descobrir Packs", nl: "💎 Packs Ontdekken"
    },
    the_game: {
      fr: "Le Jeu", en: "The Game", es: "El Juego", de: "Das Spiel", it: "Il Gioco", pt: "O Jogo", nl: "Het Spel"
    },
    game_desc_1: {
      fr: "Les Saboteurs est un jeu de déduction sociale multijoueur qui plonge les joueurs dans une station spatiale en perdition.",
      en: "The Saboteurs is a multiplayer social deduction game that immerses players in a distressed space station.",
      es: "Los Saboteadores es un juego de deducción social multijugador que sumerge a los jugadores en una estación espacial en peligro.",
      de: "Die Saboteure ist ein Multiplayer-Sozialdeduktionsspiel, das Spieler in eine notleidende Raumstation eintauchen lässt.",
      it: "I Sabotatori è un gioco di deduzione sociale multiplayer che immerge i giocatori in una stazione spaziale in difficoltà.",
      pt: "Os Sabotadores é um jogo de dedução social multiplayer que mergulha os jogadores em uma estação espacial em perigo.",
      nl: "De Saboteurs is een multiplayer sociaal deductiespel dat spelers onderdompelt in een ruimtestation in nood."
    },
    
    // Features
    feature_players: { fr: "6-12 Joueurs", en: "6-12 Players", es: "6-12 Jugadores", de: "6-12 Spieler", it: "6-12 Giocatori", pt: "6-12 Jogadores", nl: "6-12 Spelers" },
    feature_players_desc: { fr: "6-9 sur mobile / 6-12 sur PC", en: "6-9 on mobile / 6-12 on PC", es: "6-9 en móvil / 6-12 en PC", de: "6-9 auf Handy / 6-12 auf PC", it: "6-9 su mobile / 6-12 su PC", pt: "6-9 no celular / 6-12 no PC", nl: "6-9 op mobiel / 6-12 op PC" },
    feature_themes: { fr: "Thèmes & Rôles", en: "Themes & Roles", es: "Temas y Roles", de: "Themen & Rollen", it: "Temi e Ruoli", pt: "Temas e Funções", nl: "Thema's & Rollen" },
    feature_themes_desc: { fr: "4 univers, rôles variés et spéciaux", en: "4 universes, varied and special roles", es: "4 universos, roles variados y especiales", de: "4 Universen, vielfältige und spezielle Rollen", it: "4 universi, ruoli vari e speciali", pt: "4 universos, funções variadas e especiais", nl: "4 universums, gevarieerde en speciale rollen" },
    feature_video: { fr: "Visio Intégrée", en: "Integrated Video", es: "Video Integrado", de: "Integriertes Video", it: "Video Integrato", pt: "Vídeo Integrado", nl: "Geïntegreerde Video" },
    feature_video_desc: { fr: "Sans téléchargement, mobile & PC", en: "No download, mobile & PC", es: "Sin descarga, móvil y PC", de: "Kein Download, Handy & PC", it: "Senza download, mobile e PC", pt: "Sem download, celular e PC", nl: "Geen download, mobiel & PC" },
    feature_duration: { fr: "15-45 Minutes", en: "15-45 Minutes", es: "15-45 Minutos", de: "15-45 Minuten", it: "15-45 Minuti", pt: "15-45 Minutos", nl: "15-45 Minuten" },
    feature_duration_desc: { fr: "Parties rapides et dynamiques", en: "Fast and dynamic games", es: "Partidas rápidas y dinámicas", de: "Schnelle und dynamische Spiele", it: "Partite veloci e dinamiche", pt: "Partidas rápidas e dinâmicas", nl: "Snelle en dynamische spellen" },
    feature_languages: { fr: "7 Langues", en: "7 Languages", es: "7 Idiomas", de: "7 Sprachen", it: "7 Lingue", pt: "7 Idiomas", nl: "7 Talen" },
    
    // Themes
    themes_badge: { fr: "Univers", en: "Universes", es: "Universos", de: "Universen", it: "Universi", pt: "Universos", nl: "Universums" },
    themes_title: { fr: "4 Thèmes Immersifs", en: "4 Immersive Themes", es: "4 Temas Inmersivos", de: "4 Immersive Themen", it: "4 Temi Immersivi", pt: "4 Temas Imersivos", nl: "4 Meeslepende Thema's" },
    theme_space_title: { fr: "Infiltration Spatiale", en: "Space Infiltration", es: "Infiltración Espacial", de: "Weltraum-Infiltration", it: "Infiltrazione Spaziale", pt: "Infiltração Espacial", nl: "Ruimte-Infiltratie" },
    theme_space_desc: {
      fr: "L'univers classique : une station spatiale, des astronautes, des saboteurs. Réparez la station avant qu'il ne soit trop tard !",
      en: "The classic universe: a space station, astronauts, saboteurs. Repair the station before it's too late!",
      es: "El universo clásico: una estación espacial, astronautas, saboteadores. ¡Repara la estación antes de que sea tarde!",
      de: "Das klassische Universum: eine Raumstation, Astronauten, Saboteure. Reparieren Sie die Station, bevor es zu spät ist!",
      it: "L'universo classico: una stazione spaziale, astronauti, sabotatori. Ripara la stazione prima che sia troppo tardi!",
      pt: "O universo clássico: uma estação espacial, astronautas, sabotadores. Repare a estação antes que seja tarde!",
      nl: "Het klassieke universum: een ruimtestation, astronauten, saboteurs. Repareer het station voordat het te laat is!"
    },
    theme_werewolf_title: { fr: "Loup-Garou", en: "Werewolf", es: "Hombre Lobo", de: "Werwolf", it: "Lupo Mannaro", pt: "Lobisomem", nl: "Weerwolf" },
    theme_werewolf_desc: {
      fr: "Un village médiéval hanté par les loups-garous. Villageois contre créatures de la nuit.",
      en: "A medieval village haunted by werewolves. Villagers against creatures of the night.",
      es: "Un pueblo medieval embrujado por hombres lobo. Aldeanos contra criaturas de la noche.",
      de: "Ein mittelalterliches Dorf, das von Werwölfen heimgesucht wird. Dorfbewohner gegen Kreaturen der Nacht.",
      it: "Un villaggio medievale infestato dai lupi mannari. Villici contro creature della notte.",
      pt: "Uma aldeia medieval assombrada por lobisomens. Aldeões contra criaturas da noite.",
      nl: "Een middeleeuws dorp achtervolgd door weerwolven. Dorpelingen tegen wezens van de nacht."
    },
    theme_wizard_title: { fr: "Académie des Sorciers", en: "Wizard Academy", es: "Academia de Magos", de: "Zaubererakademie", it: "Accademia dei Maghi", pt: "Academia de Bruxos", nl: "Tovenaarsacademie" },
    theme_wizard_desc: {
      fr: "Une école de magie infiltrée par des sorciers noirs. Maîtrisez la magie pour démasquer les traîtres !",
      en: "A magic school infiltrated by dark wizards. Master magic to unmask the traitors!",
      es: "Una escuela de magia infiltrada por magos oscuros. ¡Domina la magia para desenmascarar a los traidores!",
      de: "Eine Zauberschule, die von dunklen Zauberern infiltriert wurde. Beherrsche die Magie, um die Verräter zu entlarven!",
      it: "Una scuola di magia infiltrata da maghi oscuri. Padroneggia la magia per smascherare i traditori!",
      pt: "Uma escola de magia infiltrada por bruxos das trevas. Domine a magia para desmascarar os traidores!",
      nl: "Een magische school geïnfiltreerd door duistere tovenaars. Beheers magie om de verraders te ontmaskeren!"
    },
    theme_mythic_title: { fr: "Royaumes Mythiques", en: "Mythic Realms", es: "Reinos Míticos", de: "Mythische Reiche", it: "Regni Mitici", pt: "Reinos Míticos", nl: "Mythische Rijken" },
    theme_mythic_desc: {
      fr: "L'Olympe est menacé par les Titans. Dieux et héros doivent identifier les traîtres.",
      en: "Olympus is threatened by the Titans. Gods and heroes must identify the traitors.",
      es: "El Olimpo está amenazado por los Titanes. Dioses y héroes deben identificar a los traidores.",
      de: "Der Olymp wird von den Titanen bedroht. Götter und Helden müssen die Verräter identifizieren.",
      it: "L'Olimpo è minacciato dai Titani. Dei ed eroi devono identificare i traditori.",
      pt: "O Olimpo está ameaçado pelos Titãs. Deuses e heróis devem identificar os traidores.",
      nl: "De Olympus wordt bedreigd door de Titanen. Goden en helden moeten de verraders identificeren."
    },
    
    // Pricing Section
    pricing_badge: { fr: "Nos Offres", en: "Our Offers", es: "Nuestras Ofertas", de: "Unsere Angebote", it: "Le Nostre Offerte", pt: "Nossas Ofertas", nl: "Onze Aanbiedingen" },
    pricing_title: { fr: "Plans Tarifaires", en: "Pricing Plans", es: "Planes de Precios", de: "Preispläne", it: "Piani Tariffari", pt: "Planos de Preços", nl: "Prijsplannen" },
    
    // Free Plan
    plan_free_name: { fr: "Gratuit", en: "Free", es: "Gratis", de: "Kostenlos", it: "Gratuito", pt: "Grátis", nl: "Gratis" },
    plan_free_price: { fr: "0€", en: "€0", es: "0€", de: "0€", it: "0€", pt: "0€", nl: "€0" },
    plan_free_period: { fr: "/mois", en: "/month", es: "/mes", de: "/Monat", it: "/mese", pt: "/mês", nl: "/maand" },
    plan_free_feat1: { fr: "✅ Parties illimitées", en: "✅ Unlimited games", es: "✅ Partidas ilimitadas", de: "✅ Unbegrenzte Spiele", it: "✅ Partite illimitate", pt: "✅ Partidas ilimitadas", nl: "✅ Onbeperkte spellen" },
    plan_free_feat2: { fr: "✅ 2 avatars IA/mois", en: "✅ 2 AI avatars/month", es: "✅ 2 avatares IA/mes", de: "✅ 2 KI-Avatare/Monat", it: "✅ 2 avatar IA/mese", pt: "✅ 2 avatares IA/mês", nl: "✅ 2 AI-avatars/maand" },
    plan_free_feat3: { fr: "✅ 2 parties vidéo/mois", en: "✅ 2 video games/month", es: "✅ 2 partidas video/mes", de: "✅ 2 Video-Spiele/Monat", it: "✅ 2 partite video/mese", pt: "✅ 2 partidas vídeo/mês", nl: "✅ 2 videospellen/maand" },
    plan_free_feat4: { fr: "✅ Tous les thèmes", en: "✅ All themes", es: "✅ Todos los temas", de: "✅ Alle Themen", it: "✅ Tutti i temi", pt: "✅ Todos os temas", nl: "✅ Alle thema's" },
    plan_free_feat5: { fr: "✅ Mode hors ligne", en: "✅ Offline mode", es: "✅ Modo sin conexión", de: "✅ Offline-Modus", it: "✅ Modalità offline", pt: "✅ Modo offline", nl: "✅ Offline modus" },
    plan_free_cta: { fr: "Commencer Gratuitement", en: "Start Free", es: "Empezar Gratis", de: "Kostenlos Starten", it: "Inizia Gratis", pt: "Começar Grátis", nl: "Gratis Starten" },
    
    // Pack 50+50 Plan
    plan_pack_name: { fr: "Pack 50+50", en: "Pack 50+50", es: "Pack 50+50", de: "Pack 50+50", it: "Pack 50+50", pt: "Pack 50+50", nl: "Pack 50+50" },
    plan_pack_price: { fr: "4,99€", en: "€4.99", es: "4,99€", de: "4,99€", it: "4,99€", pt: "4,99€", nl: "€4,99" },
    plan_pack_period: { fr: "unique", en: "one-time", es: "único", de: "einmalig", it: "una tantum", pt: "único", nl: "eenmalig" },
    plan_pack_feat1: { fr: "✅ 50 avatars IA", en: "✅ 50 AI avatars", es: "✅ 50 avatares IA", de: "✅ 50 KI-Avatare", it: "✅ 50 avatar IA", pt: "✅ 50 avatares IA", nl: "✅ 50 AI-avatars" },
    plan_pack_feat2: { fr: "✅ 50 crédits vidéo", en: "✅ 50 video credits", es: "✅ 50 créditos video", de: "✅ 50 Video-Credits", it: "✅ 50 crediti video", pt: "✅ 50 créditos vídeo", nl: "✅ 50 video credits" },
    plan_pack_feat3: { fr: "✅ Valables 12 mois", en: "✅ Valid 12 months", es: "✅ Válidos 12 meses", de: "✅ 12 Monate gültig", it: "✅ Validi 12 mesi", pt: "✅ Válidos 12 meses", nl: "✅ 12 maanden geldig" },
    plan_pack_feat4: { fr: "✅ Tous les avantages Free", en: "✅ All Free benefits", es: "✅ Todos los beneficios Free", de: "✅ Alle Free-Vorteile", it: "✅ Tutti i vantaggi Free", pt: "✅ Todos os benefícios Free", nl: "✅ Alle Free-voordelen" },
    plan_pack_feat5: { fr: "✅ Support prioritaire", en: "✅ Priority support", es: "✅ Soporte prioritario", de: "✅ Prioritäts-Support", it: "✅ Supporto prioritario", pt: "✅ Suporte prioritário", nl: "✅ Prioriteitsondersteuning" },
    plan_pack_cta: { fr: "Acheter le Pack", en: "Buy Pack", es: "Comprar Pack", de: "Pack Kaufen", it: "Acquista Pack", pt: "Comprar Pack", nl: "Pack Kopen" },
    
    // Premium Plan
    plan_premium_badge: { fr: "Le Plus Populaire", en: "Most Popular", es: "El Más Popular", de: "Am Beliebtesten", it: "Il Più Popolare", pt: "Mais Popular", nl: "Meest Populair" },
    plan_premium_name: { fr: "Premium", en: "Premium", es: "Premium", de: "Premium", it: "Premium", pt: "Premium", nl: "Premium" },
    plan_premium_price: { fr: "1,49€", en: "€1.49", es: "1,49€", de: "1,49€", it: "1,49€", pt: "1,49€", nl: "€1,49" },
    plan_premium_feat1: { fr: "✅ Avatars IA illimités", en: "✅ Unlimited AI avatars", es: "✅ Avatares IA ilimitados", de: "✅ Unbegrenzte KI-Avatare", it: "✅ Avatar IA illimitati", pt: "✅ Avatares IA ilimitados", nl: "✅ Onbeperkte AI-avatars" },
    plan_premium_feat2: { fr: "✅ Parties vidéo illimitées", en: "✅ Unlimited video games", es: "✅ Partidas video ilimitadas", de: "✅ Unbegrenzte Video-Spiele", it: "✅ Partite video illimitate", pt: "✅ Partidas vídeo ilimitadas", nl: "✅ Onbeperkte videospellen" },
    plan_premium_feat3: { fr: "✅ Badge exclusif", en: "✅ Exclusive badge", es: "✅ Insignia exclusiva", de: "✅ Exklusives Abzeichen", it: "✅ Badge esclusivo", pt: "✅ Distintivo exclusivo", nl: "✅ Exclusieve badge" },
    plan_premium_feat4: { fr: "✅ Accès anticipé nouveautés", en: "✅ Early access to new features", es: "✅ Acceso anticipado novedades", de: "✅ Früher Zugang zu Neuheiten", it: "✅ Accesso anticipato novità", pt: "✅ Acesso antecipado novidades", nl: "✅ Vroege toegang tot nieuws" },
    plan_premium_feat5: { fr: "✅ Support VIP 24/7", en: "✅ VIP support 24/7", es: "✅ Soporte VIP 24/7", de: "✅ VIP-Support 24/7", it: "✅ Supporto VIP 24/7", pt: "✅ Suporte VIP 24/7", nl: "✅ VIP-ondersteuning 24/7" },
    plan_premium_cta: { fr: "Devenir Premium", en: "Go Premium", es: "Ser Premium", de: "Premium Werden", it: "Diventa Premium", pt: "Tornar-se Premium", nl: "Premium Worden" },
    
    // Family Plan
    plan_family_name: { fr: "Pack Famille", en: "Family Pack", es: "Pack Familia", de: "Familienpaket", it: "Pack Famiglia", pt: "Pack Família", nl: "Familiepakket" },
    plan_family_price: { fr: "9,99€", en: "€9.99", es: "9,99€", de: "9,99€", it: "9,99€", pt: "9,99€", nl: "€9,99" },
    plan_family_feat1: { fr: "✅ Jusqu'à 9 comptes", en: "✅ Up to 9 accounts", es: "✅ Hasta 9 cuentas", de: "✅ Bis zu 9 Konten", it: "✅ Fino a 9 account", pt: "✅ Até 9 contas", nl: "✅ Tot 9 accounts" },
    plan_family_feat2: { fr: "✅ Avantages Premium pour tous", en: "✅ Premium benefits for all", es: "✅ Beneficios Premium para todos", de: "✅ Premium-Vorteile für alle", it: "✅ Vantaggi Premium per tutti", pt: "✅ Benefícios Premium para todos", nl: "✅ Premium-voordelen voor iedereen" },
    plan_family_feat3: { fr: "✅ Gestion centralisée", en: "✅ Centralized management", es: "✅ Gestión centralizada", de: "✅ Zentrale Verwaltung", it: "✅ Gestione centralizzata", pt: "✅ Gestão centralizada", nl: "✅ Gecentraliseerd beheer" },
    plan_family_feat4: { fr: "✅ Économie de 60%", en: "✅ 60% savings", es: "✅ Ahorro del 60%", de: "✅ 60% Ersparnis", it: "✅ Risparmio del 60%", pt: "✅ Economia de 60%", nl: "✅ 60% besparing" },
    plan_family_feat5: { fr: "✅ Support prioritaire", en: "✅ Priority support", es: "✅ Soporte prioritario", de: "✅ Prioritäts-Support", it: "✅ Supporto prioritario", pt: "✅ Suporte prioritário", nl: "✅ Prioriteitsondersteuning" },
    plan_family_cta: { fr: "Pack Famille", en: "Family Pack", es: "Pack Familia", de: "Familienpaket", it: "Pack Famiglia", pt: "Pack Família", nl: "Familiepakket" },
    
    // CTA Section
    cta_title: { fr: "Prêt à Jouer ?", en: "Ready to Play?", es: "¿Listo para Jugar?", de: "Bereit zu Spielen?", it: "Pronto a Giocare?", pt: "Pronto para Jogar?", nl: "Klaar om te Spelen?" },
    cta_subtitle: { fr: "Rejoignez des milliers de joueurs dans l'aventure la plus intense !", en: "Join thousands of players in the most intense adventure!", es: "¡Únete a miles de jugadores en la aventura más intensa!", de: "Schließen Sie sich Tausenden von Spielern im intensivsten Abenteuer an!", it: "Unisciti a migliaia di giocatori nell'avventura più intensa!", pt: "Junte-se a milhares de jogadores na aventura mais intensa!", nl: "Sluit je aan bij duizenden spelers in het meest intense avontuur!" },
    cta_offers: { fr: "💎 Voir les Offres Premium", en: "💎 View Premium Offers", es: "💎 Ver Ofertas Premium", de: "💎 Premium-Angebote Ansehen", it: "💎 Vedi Offerte Premium", pt: "💎 Ver Ofertas Premium", nl: "💎 Premium-aanbiedingen Bekijken" },
    
    // Footer Products
    footer_creator: { fr: "Créateur d'expériences vidéoludiques", en: "Creator of video game experiences", es: "Creador de experiencias de videojuegos", de: "Schöpfer von Videospielerlebnissen", it: "Creatore di esperienze videoludiche", pt: "Criador de experiências de videogames", nl: "Maker van videogame-ervaringen" }
  },

  // ============================================================================
  // PACKS & TARIFS
  // ============================================================================
  packs: {
    title: { fr: "💎 Nos Packs Premium", en: "💎 Our Premium Packs", es: "💎 Nuestros Packs Premium", de: "💎 Unsere Premium-Pakete", it: "💎 I Nostri Pack Premium", pt: "💎 Nossos Packs Premium", nl: "💎 Onze Premium Packs" },
    verified_required: {
      fr: "Compte vérifié requis pour accéder aux packs",
      en: "Verified account required to access packs",
      es: "Cuenta verificada requerida para acceder a los packs",
      de: "Verifiziertes Konto erforderlich, um auf Pakete zuzugreifen",
      it: "Account verificato richiesto per accedere ai pack",
      pt: "Conta verificada necessária para acessar os packs",
      nl: "Geverifieerd account vereist om toegang te krijgen tot packs"
    },
    
    // Pack 50+50
    pack50_badge: { fr: "PONCTUEL", en: "ONE-TIME", es: "PUNTUAL", de: "EINMALIG", it: "UNA TANTUM", pt: "PONTUAL", nl: "EENMALIG" },
    pack50_title: { fr: "Pack 50+50", en: "Pack 50+50", es: "Pack 50+50", de: "Pack 50+50", it: "Pack 50+50", pt: "Pack 50+50", nl: "Pack 50+50" },
    pack50_price: { fr: "4,99€", en: "€4.99", es: "4,99€", de: "4,99€", it: "4,99€", pt: "4,99€", nl: "€4,99" },
    pack50_period: { fr: "une fois", en: "one-time", es: "una vez", de: "einmalig", it: "una volta", pt: "uma vez", nl: "eenmalig" },
    pack50_feature1: { fr: "✅ 50 crédits vidéo", en: "✅ 50 video credits", es: "✅ 50 créditos de video", de: "✅ 50 Video-Credits", it: "✅ 50 crediti video", pt: "✅ 50 créditos de vídeo", nl: "✅ 50 video credits" },
    pack50_feature2: { fr: "✅ 50 avatars IA", en: "✅ 50 AI avatars", es: "✅ 50 avatares IA", de: "✅ 50 KI-Avatare", it: "✅ 50 avatar IA", pt: "✅ 50 avatares IA", nl: "✅ 50 AI-avatars" },
    pack50_feature3: { fr: "✅ Valables 12 mois", en: "✅ Valid 12 months", es: "✅ Válidos 12 meses", de: "✅ 12 Monate gültig", it: "✅ Validi 12 mesi", pt: "✅ Válidos por 12 meses", nl: "✅ 12 maanden geldig" },
    pack50_feature4: { fr: "✅ Tous les thèmes", en: "✅ All themes", es: "✅ Todos los temas", de: "✅ Alle Themen", it: "✅ Tutti i temi", pt: "✅ Todos os temas", nl: "✅ Alle thema's" },
    pack50_feature5: { fr: "✅ Support prioritaire", en: "✅ Priority support", es: "✅ Soporte prioritario", de: "✅ Prioritäts-Support", it: "✅ Supporto prioritario", pt: "✅ Suporte prioritário", nl: "✅ Prioriteitsondersteuning" },
    pack50_cta: { fr: "🛒 Acheter maintenant", en: "🛒 Buy now", es: "🛒 Comprar ahora", de: "🛒 Jetzt kaufen", it: "🛒 Acquista ora", pt: "🛒 Comprar agora", nl: "🛒 Nu kopen" },
    
    // Premium
    premium_badge: { fr: "⭐ POPULAIRE", en: "⭐ POPULAR", es: "⭐ POPULAR", de: "⭐ BELIEBT", it: "⭐ POPOLARE", pt: "⭐ POPULAR", nl: "⭐ POPULAIR" },
    premium_title: { fr: "Premium", en: "Premium", es: "Premium", de: "Premium", it: "Premium", pt: "Premium", nl: "Premium" },
    premium_price: { fr: "1,49€", en: "€1.49", es: "1,49€", de: "1,49€", it: "1,49€", pt: "1,49€", nl: "€1,49" },
    premium_period: { fr: "/mois", en: "/month", es: "/mes", de: "/Monat", it: "/mese", pt: "/mês", nl: "/maand" },
    premium_feature1: { fr: "✅ Visio illimitée", en: "✅ Unlimited video", es: "✅ Video ilimitado", de: "✅ Unbegrenztes Video", it: "✅ Video illimitato", pt: "✅ Vídeo ilimitado", nl: "✅ Onbeperkte video" },
    premium_feature2: { fr: "✅ 30 avatars IA/mois", en: "✅ 30 AI avatars/month", es: "✅ 30 avatares IA/mes", de: "✅ 30 KI-Avatare/Monat", it: "✅ 30 avatar IA/mese", pt: "✅ 30 avatares IA/mês", nl: "✅ 30 AI-avatars/maand" },
    premium_feature3: { fr: "✅ 4 thèmes complets", en: "✅ 4 complete themes", es: "✅ 4 temas completos", de: "✅ 4 vollständige Themen", it: "✅ 4 temi completi", pt: "✅ 4 temas completos", nl: "✅ 4 volledige thema's" },
    premium_feature4: { fr: "✅ Badge exclusif", en: "✅ Exclusive badge", es: "✅ Insignia exclusiva", de: "✅ Exklusives Abzeichen", it: "✅ Badge esclusivo", pt: "✅ Distintivo exclusivo", nl: "✅ Exclusieve badge" },
    premium_feature5: { fr: "✅ Support VIP 24/7", en: "✅ VIP support 24/7", es: "✅ Soporte VIP 24/7", de: "✅ VIP-Support 24/7", it: "✅ Supporto VIP 24/7", pt: "✅ Suporte VIP 24/7", nl: "✅ VIP-ondersteuning 24/7" },
    premium_cta: { fr: "🚀 S'abonner", en: "🚀 Subscribe", es: "🚀 Suscribirse", de: "🚀 Abonnieren", it: "🚀 Abbonati", pt: "🚀 Assinar", nl: "🚀 Abonneren" },
    
    // Pack Famille
    family_badge: { fr: "FAMILLE", en: "FAMILY", es: "FAMILIA", de: "FAMILIE", it: "FAMIGLIA", pt: "FAMÍLIA", nl: "FAMILIE" },
    family_title: { fr: "Pack Famille", en: "Family Pack", es: "Pack Familia", de: "Familienpaket", it: "Pack Famiglia", pt: "Pack Família", nl: "Familiepakket" },
    family_price: { fr: "9,99€", en: "€9.99", es: "9,99€", de: "9,99€", it: "9,99€", pt: "9,99€", nl: "€9,99" },
    family_feature1: { fr: "✅ Jusqu'à 9 comptes", en: "✅ Up to 9 accounts", es: "✅ Hasta 9 cuentas", de: "✅ Bis zu 9 Konten", it: "✅ Fino a 9 account", pt: "✅ Até 9 contas", nl: "✅ Tot 9 accounts" },
    family_feature2: { fr: "✅ Visio illimitée pour tous", en: "✅ Unlimited video for all", es: "✅ Video ilimitado para todos", de: "✅ Unbegrenztes Video für alle", it: "✅ Video illimitato per tutti", pt: "✅ Vídeo ilimitado para todos", nl: "✅ Onbeperkte video voor iedereen" },
    family_feature3: { fr: "✅ 30 avatars/mois par utilisateur", en: "✅ 30 avatars/month per user", es: "✅ 30 avatares/mes por usuario", de: "✅ 30 Avatare/Monat pro Benutzer", it: "✅ 30 avatar/mese per utente", pt: "✅ 30 avatares/mês por usuário", nl: "✅ 30 avatars/maand per gebruiker" },
    family_feature4: { fr: "✅ Gestion centralisée", en: "✅ Centralized management", es: "✅ Gestión centralizada", de: "✅ Zentrale Verwaltung", it: "✅ Gestione centralizzata", pt: "✅ Gestão centralizada", nl: "✅ Gecentraliseerd beheer" },
    family_feature5: { fr: "✅ Économie de 85%", en: "✅ 85% savings", es: "✅ Ahorro del 85%", de: "✅ 85% Ersparnis", it: "✅ Risparmio dell'85%", pt: "✅ Economia de 85%", nl: "✅ 85% besparing" },
    family_cta: { fr: "👨‍👩‍👧‍👦 S'abonner en famille", en: "👨‍👩‍👧‍👦 Subscribe as family", es: "👨‍👩‍👧‍👦 Suscribirse en familia", de: "👨‍👩‍👧‍👦 Als Familie abonnieren", it: "👨‍👩‍👧‍👦 Abbonati in famiglia", pt: "👨‍👩‍👧‍👦 Assinar em família", nl: "👨‍👩‍👧‍👦 Abonneren als familie" },
    
    // Promo code
    promo_label: { fr: "🎁 Tu as un code promo ?", en: "🎁 Do you have a promo code?", es: "🎁 ¿Tienes un código promocional?", de: "🎁 Hast du einen Promo-Code?", it: "🎁 Hai un codice promozionale?", pt: "🎁 Você tem um código promocional?", nl: "🎁 Heb je een promotiecode?" },
    promo_placeholder: { fr: "Entre ton code ici", en: "Enter your code here", es: "Ingresa tu código aquí", de: "Gib deinen Code hier ein", it: "Inserisci il tuo codice qui", pt: "Digite seu código aqui", nl: "Voer je code hier in" },
    promo_validate: { fr: "Valider", en: "Validate", es: "Validar", de: "Bestätigen", it: "Convalida", pt: "Validar", nl: "Valideren" },
    
    // Footer modal
    footer_verified_required: {
      fr: "💡 <strong>Compte vérifié requis</strong> pour accéder aux packs.",
      en: "💡 <strong>Verified account required</strong> to access packs.",
      es: "💡 <strong>Cuenta verificada requerida</strong> para acceder a los packs.",
      de: "💡 <strong>Verifiziertes Konto erforderlich</strong>, um auf Pakete zuzugreifen.",
      it: "💡 <strong>Account verificato richiesto</strong> per accedere ai pack.",
      pt: "💡 <strong>Conta verificada necessária</strong> para acessar os packs.",
      nl: "💡 <strong>Geverifieerd account vereist</strong> om toegang te krijgen tot packs."
    },
    footer_login_or_register: {
      fr: "Se connecter",
      en: "Log in",
      es: "Iniciar sesión",
      de: "Anmelden",
      it: "Accedi",
      pt: "Fazer login",
      nl: "Inloggen"
    },
    footer_or: {
      fr: "ou",
      en: "or",
      es: "o",
      de: "oder",
      it: "o",
      pt: "ou",
      nl: "of"
    },
    footer_create_account: {
      fr: "créer un compte",
      en: "create an account",
      es: "crear una cuenta",
      de: "Konto erstellen",
      it: "crea un account",
      pt: "criar uma conta",
      nl: "account aanmaken"
    },
    payment_secure: {
      fr: "🔒 Paiement sécurisé via Stripe • 💳 CB, Apple Pay, Google Pay acceptés • 🔄 Annulation à tout moment",
      en: "🔒 Secure payment via Stripe • 💳 Card, Apple Pay, Google Pay accepted • 🔄 Cancel anytime",
      es: "🔒 Pago seguro vía Stripe • 💳 Tarjeta, Apple Pay, Google Pay aceptados • 🔄 Cancelar en cualquier momento",
      de: "🔒 Sichere Zahlung über Stripe • 💳 Karte, Apple Pay, Google Pay akzeptiert • 🔄 Jederzeit kündbar",
      it: "🔒 Pagamento sicuro tramite Stripe • 💳 Carta, Apple Pay, Google Pay accettati • 🔄 Annulla in qualsiasi momento",
      pt: "🔒 Pagamento seguro via Stripe • 💳 Cartão, Apple Pay, Google Pay aceitos • 🔄 Cancelar a qualquer momento",
      nl: "🔒 Veilige betaling via Stripe • 💳 Kaart, Apple Pay, Google Pay geaccepteerd • 🔄 Op elk moment opzeggen"
    }
  },

  // ============================================================================
  // AUTHENTIFICATION (Login/Register)
  // ============================================================================
  auth: {
    login_title: { fr: "Connexion", en: "Login", es: "Iniciar Sesión", de: "Anmeldung", it: "Accesso", pt: "Login", nl: "Inloggen" },
    login_subtitle: {
      fr: "Accédez à votre compte RORONOA GAMES",
      en: "Access your RORONOA GAMES account",
      es: "Accede a tu cuenta RORONOA GAMES",
      de: "Greifen Sie auf Ihr RORONOA GAMES-Konto zu",
      it: "Accedi al tuo account RORONOA GAMES",
      pt: "Acesse sua conta RORONOA GAMES",
      nl: "Toegang tot je RORONOA GAMES-account"
    },
    register_title: { fr: "Inscription", en: "Sign Up", es: "Registro", de: "Registrierung", it: "Registrazione", pt: "Cadastro", nl: "Registratie" },
    tab_login: { fr: "Connexion", en: "Login", es: "Iniciar Sesión", de: "Anmelden", it: "Accesso", pt: "Entrar", nl: "Inloggen" },
    tab_register: { fr: "Inscription", en: "Sign Up", es: "Registro", de: "Registrieren", it: "Registrati", pt: "Cadastrar", nl: "Registreren" },
    email_placeholder: { fr: "Email", en: "Email", es: "Correo electrónico", de: "E-Mail", it: "Email", pt: "E-mail", nl: "E-mail" },
    confirm_email_placeholder: { fr: "Confirmer email", en: "Confirm email", es: "Confirmar correo", de: "E-Mail bestätigen", it: "Conferma email", pt: "Confirmar e-mail", nl: "E-mail bevestigen" },
    password_placeholder: { fr: "Mot de passe", en: "Password", es: "Contraseña", de: "Passwort", it: "Password", pt: "Senha", nl: "Wachtwoord" },
    username_placeholder: { fr: "Pseudo", en: "Username", es: "Nombre de usuario", de: "Benutzername", it: "Nome utente", pt: "Nome de usuário", nl: "Gebruikersnaam" },
    confirm_password_placeholder: { fr: "Confirmer mot de passe", en: "Confirm password", es: "Confirmar contraseña", de: "Passwort bestätigen", it: "Conferma password", pt: "Confirmar senha", nl: "Wachtwoord bevestigen" },
    login_btn: { fr: "Se Connecter", en: "Log In", es: "Iniciar Sesión", de: "Anmelden", it: "Accedi", pt: "Entrar", nl: "Inloggen" },
    register_btn: { fr: "S'Inscrire", en: "Sign Up", es: "Registrarse", de: "Registrieren", it: "Registrati", pt: "Cadastrar", nl: "Registreren" },
    forgot_password: { fr: "Mot de passe oublié ?", en: "Forgot password?", es: "¿Olvidaste tu contraseña?", de: "Passwort vergessen?", it: "Password dimenticata?", pt: "Esqueceu a senha?", nl: "Wachtwoord vergeten?" },
    account_created_info: { fr: "Compte créé pour accéder aux produits", en: "Account created to access products", es: "Cuenta creada para acceder a los productos", de: "Konto erstellt, um auf Produkte zuzugreifen", it: "Account creato per accedere ai prodotti", pt: "Conta criada para acessar os produtos", nl: "Account aangemaakt om toegang te krijgen tot producten" }
  },

  // ============================================================================
  // V42: AVANTAGES COMPTE GRATUIT
  // ============================================================================
  freeBenefits: {
    title: { 
      fr: "Avantages du compte gratuit", 
      en: "Free account benefits", 
      es: "Ventajas de la cuenta gratuita", 
      de: "Vorteile des kostenlosen Kontos", 
      it: "Vantaggi dell'account gratuito", 
      pt: "Benefícios da conta gratuita", 
      nl: "Voordelen van het gratis account" 
    },
    voiceMessages: { 
      fr: "Messages vocaux dans le chat", 
      en: "Voice messages in chat", 
      es: "Mensajes de voz en el chat", 
      de: "Sprachnachrichten im Chat", 
      it: "Messaggi vocali in chat", 
      pt: "Mensagens de voz no chat", 
      nl: "Spraakberichten in chat" 
    },
    freeVideo: { 
      fr: "2 parties visio OFFERTES", 
      en: "2 FREE video games", 
      es: "2 partidas de video GRATIS", 
      de: "2 KOSTENLOSE Videospiele", 
      it: "2 partite video GRATIS", 
      pt: "2 jogos de vídeo GRÁTIS", 
      nl: "2 GRATIS videogames" 
    },
    freeAvatars: { 
      fr: "2 avatars IA OFFERTS", 
      en: "2 FREE AI avatars", 
      es: "2 avatares IA GRATIS", 
      de: "2 KOSTENLOSE KI-Avatare", 
      it: "2 avatar IA GRATIS", 
      pt: "2 avatares IA GRÁTIS", 
      nl: "2 GRATIS AI-avatars" 
    },
    monthlyAvatars: { 
      fr: "Jusqu'à 30 avatars IA / mois", 
      en: "Up to 30 AI avatars / month", 
      es: "Hasta 30 avatares IA / mes", 
      de: "Bis zu 30 KI-Avatare / Monat", 
      it: "Fino a 30 avatar IA / mese", 
      pt: "Até 30 avatares IA / mês", 
      nl: "Tot 30 AI-avatars / maand" 
    },
    stats: { 
      fr: "Stats & badges sauvegardés", 
      en: "Stats & badges saved", 
      es: "Estadísticas y medallas guardadas", 
      de: "Statistiken & Abzeichen gespeichert", 
      it: "Statistiche e badge salvati", 
      pt: "Estatísticas e medalhas salvas", 
      nl: "Statistieken & badges opgeslagen" 
    },
    leaderboard: { 
      fr: "Accès aux classements", 
      en: "Leaderboard access", 
      es: "Acceso a clasificaciones", 
      de: "Zugang zu Ranglisten", 
      it: "Accesso alle classifiche", 
      pt: "Acesso aos rankings", 
      nl: "Toegang tot ranglijsten" 
    }
  },

  // ============================================================================
  // FOOTER
  // ============================================================================
  footer: {
    description: {
      fr: "Studio indépendant de création de jeux sociaux nouvelle génération.",
      en: "Independent studio creating next-generation social games.",
      es: "Estudio independiente de creación de juegos sociales de nueva generación.",
      de: "Unabhängiges Studio für Social Games der neuen Generation.",
      it: "Studio indipendente di creazione di giochi sociali di nuova generazione.",
      pt: "Estúdio independente de criação de jogos sociais de nova geração.",
      nl: "Onafhankelijke studio voor sociale spellen van de nieuwe generatie."
    },
    quick_links: { fr: "Navigation", en: "Quick Links", es: "Enlaces Rápidos", de: "Schnelllinks", it: "Link Rapidi", pt: "Links Rápidos", nl: "Snelle Links" },
    legal: { fr: "Légal", en: "Legal", es: "Legal", de: "Rechtliches", it: "Legale", pt: "Legal", nl: "Juridisch" },
    privacy_policy: { fr: "Politique de Confidentialité", en: "Privacy Policy", es: "Política de Privacidad", de: "Datenschutzrichtlinie", it: "Informativa sulla Privacy", pt: "Política de Privacidade", nl: "Privacybeleid" },
    terms_of_service: { fr: "Conditions d'Utilisation", en: "Terms of Service", es: "Términos de Servicio", de: "Nutzungsbedingungen", it: "Termini di Servizio", pt: "Termos de Serviço", nl: "Servicevoorwaarden" },
    legal_notice: { fr: "Mentions Légales", en: "Legal Notice", es: "Aviso Legal", de: "Impressum", it: "Note Legali", pt: "Aviso Legal", nl: "Juridische Kennisgeving" },
    copyright: {
      fr: "© 2026 RORONOA GAMES. Tous droits réservés.",
      en: "© 2026 RORONOA GAMES. All rights reserved.",
      es: "© 2026 RORONOA GAMES. Todos los derechos reservados.",
      de: "© 2026 RORONOA GAMES. Alle Rechte vorbehalten.",
      it: "© 2026 RORONOA GAMES. Tutti i diritti riservati.",
      pt: "© 2026 RORONOA GAMES. Todos os direitos reservados.",
      nl: "© 2026 RORONOA GAMES. Alle rechten voorbehouden."
    }
  },

  // ============================================================================
  // CONTACT
  // ============================================================================
  contact: {
    title: { fr: "Contact", en: "Contact", es: "Contacto", de: "Kontakt", it: "Contatto", pt: "Contato", nl: "Contact" },
    subtitle: {
      fr: "Une question ? Un partenariat ? Contactez-nous !",
      en: "A question? A partnership? Contact us!",
      es: "¿Una pregunta? ¿Una asociación? ¡Contáctanos!",
      de: "Eine Frage? Eine Partnerschaft? Kontaktieren Sie uns!",
      it: "Una domanda? Una partnership? Contattaci!",
      pt: "Uma pergunta? Uma parceria? Entre em contato!",
      nl: "Een vraag? Een partnerschap? Neem contact met ons op!"
    },
    address_title: { fr: "Adresse", en: "Address", es: "Dirección", de: "Adresse", it: "Indirizzo", pt: "Endereço", nl: "Adres" },
    email_title: { fr: "Email", en: "Email", es: "Correo", de: "E-Mail", it: "Email", pt: "E-mail", nl: "E-mail" },
    social_title: { fr: "Réseaux Sociaux", en: "Social Networks", es: "Redes Sociales", de: "Soziale Netzwerke", it: "Social Network", pt: "Redes Sociais", nl: "Sociale Media" },
    name_placeholder: { fr: "Votre nom", en: "Your name", es: "Tu nombre", de: "Ihr Name", it: "Il tuo nome", pt: "Seu nome", nl: "Je naam" },
    email_placeholder: { fr: "Votre email", en: "Your email", es: "Tu correo", de: "Ihre E-Mail", it: "La tua email", pt: "Seu e-mail", nl: "Je e-mail" },
    subject_placeholder: { fr: "Sujet du message", en: "Message subject", es: "Asunto del mensaje", de: "Betreff", it: "Oggetto del messaggio", pt: "Assunto da mensagem", nl: "Onderwerp" },
    subject_support: { fr: "Support technique", en: "Technical support", es: "Soporte técnico", de: "Technischer Support", it: "Supporto tecnico", pt: "Suporte técnico", nl: "Technische ondersteuning" },
    subject_commercial: { fr: "Question commerciale", en: "Commercial question", es: "Pregunta comercial", de: "Kommerzielle Frage", it: "Domanda commerciale", pt: "Pergunta comercial", nl: "Commerciële vraag" },
    subject_partnership: { fr: "Partenariat", en: "Partnership", es: "Asociación", de: "Partnerschaft", it: "Partnership", pt: "Parceria", nl: "Partnerschap" },
    subject_other: { fr: "Autre", en: "Other", es: "Otro", de: "Andere", it: "Altro", pt: "Outro", nl: "Anders" },
    message_placeholder: { fr: "Votre message", en: "Your message", es: "Tu mensaje", de: "Ihre Nachricht", it: "Il tuo messaggio", pt: "Sua mensagem", nl: "Je bericht" },
    send_btn: { fr: "Envoyer", en: "Send", es: "Enviar", de: "Senden", it: "Invia", pt: "Enviar", nl: "Verzenden" },
    success_message: { fr: "Message envoyé avec succès !", en: "Message sent successfully!", es: "¡Mensaje enviado con éxito!", de: "Nachricht erfolgreich gesendet!", it: "Messaggio inviato con successo!", pt: "Mensagem enviada com sucesso!", nl: "Bericht succesvol verzonden!" }
  },

  // ============================================================================
  // PAGE MON COMPTE (account.html)
  // ============================================================================
  account: {
    page_title: { fr: "Mon Compte - RORONOA GAMES", en: "My Account - RORONOA GAMES", es: "Mi Cuenta - RORONOA GAMES", de: "Mein Konto - RORONOA GAMES", it: "Il Mio Account - RORONOA GAMES", pt: "Minha Conta - RORONOA GAMES", nl: "Mijn Account - RORONOA GAMES" },
    welcome: { fr: "Bienvenue", en: "Welcome", es: "Bienvenido", de: "Willkommen", it: "Benvenuto", pt: "Bem-vindo", nl: "Welkom" },
    my_profile: { fr: "Mon Profil", en: "My Profile", es: "Mi Perfil", de: "Mein Profil", it: "Il Mio Profilo", pt: "Meu Perfil", nl: "Mijn Profiel" },
    my_subscription: { fr: "Mon Abonnement", en: "My Subscription", es: "Mi Suscripción", de: "Mein Abonnement", it: "Il Mio Abbonamento", pt: "Minha Assinatura", nl: "Mijn Abonnement" },
    my_avatars: { fr: "Mes Avatars", en: "My Avatars", es: "Mis Avatares", de: "Meine Avatare", it: "I Miei Avatar", pt: "Meus Avatares", nl: "Mijn Avatars" },
    my_stats: { fr: "Mes Statistiques", en: "My Statistics", es: "Mis Estadísticas", de: "Meine Statistiken", it: "Le Mie Statistiche", pt: "Minhas Estatísticas", nl: "Mijn Statistieken" },
    video_credits: { fr: "Crédits Vidéo", en: "Video Credits", es: "Créditos de Video", de: "Video-Credits", it: "Crediti Video", pt: "Créditos de Vídeo", nl: "Video Credits" },
    avatar_credits: { fr: "Crédits Avatars", en: "Avatar Credits", es: "Créditos de Avatares", de: "Avatar-Credits", it: "Crediti Avatar", pt: "Créditos de Avatares", nl: "Avatar Credits" },
    games_played: { fr: "Parties Jouées", en: "Games Played", es: "Partidas Jugadas", de: "Gespielte Spiele", it: "Partite Giocate", pt: "Partidas Jogadas", nl: "Gespeelde Spellen" },
    account_type: { fr: "Type de Compte", en: "Account Type", es: "Tipo de Cuenta", de: "Kontotyp", it: "Tipo di Account", pt: "Tipo de Conta", nl: "Accounttype" },
    free: { fr: "Gratuit", en: "Free", es: "Gratis", de: "Kostenlos", it: "Gratuito", pt: "Grátis", nl: "Gratis" },
    premium: { fr: "Premium", en: "Premium", es: "Premium", de: "Premium", it: "Premium", pt: "Premium", nl: "Premium" },
    family: { fr: "Famille", en: "Family", es: "Familia", de: "Familie", it: "Famiglia", pt: "Família", nl: "Familie" },
    manage_subscription: { fr: "Gérer mon abonnement", en: "Manage my subscription", es: "Gestionar mi suscripción", de: "Mein Abonnement verwalten", it: "Gestisci il mio abbonamento", pt: "Gerenciar minha assinatura", nl: "Mijn abonnement beheren" },
    upgrade: { fr: "Passer Premium", en: "Upgrade to Premium", es: "Pasar a Premium", de: "Auf Premium upgraden", it: "Passa a Premium", pt: "Fazer upgrade para Premium", nl: "Upgraden naar Premium" },
    email_verified: { fr: "Email vérifié", en: "Email verified", es: "Email verificado", de: "E-Mail verifiziert", it: "Email verificata", pt: "E-mail verificado", nl: "E-mail geverifieerd" },
    email_not_verified: { fr: "Email non vérifié", en: "Email not verified", es: "Email no verificado", de: "E-Mail nicht verifiziert", it: "Email non verificata", pt: "E-mail não verificado", nl: "E-mail niet geverifieerd" },
    resend_verification: { fr: "Renvoyer l'email de vérification", en: "Resend verification email", es: "Reenviar email de verificación", de: "Bestätigungs-E-Mail erneut senden", it: "Rinvia email di verifica", pt: "Reenviar e-mail de verificação", nl: "Verificatie-e-mail opnieuw verzenden" },
    change_password: { fr: "Changer le mot de passe", en: "Change password", es: "Cambiar contraseña", de: "Passwort ändern", it: "Cambia password", pt: "Alterar senha", nl: "Wachtwoord wijzigen" },
    delete_account: { fr: "Supprimer mon compte", en: "Delete my account", es: "Eliminar mi cuenta", de: "Mein Konto löschen", it: "Elimina il mio account", pt: "Excluir minha conta", nl: "Mijn account verwijderen" },
    
    // Tabs
    tab_profile: { fr: "👤 Profil", en: "👤 Profile", es: "👤 Perfil", de: "👤 Profil", it: "👤 Profilo", pt: "👤 Perfil", nl: "👤 Profiel" },
    tab_subscriptions: { fr: "💎 Abonnements", en: "💎 Subscriptions", es: "💎 Suscripciones", de: "💎 Abonnements", it: "💎 Abbonamenti", pt: "💎 Assinaturas", nl: "💎 Abonnementen" },
    tab_credits: { fr: "🎬 Crédits & Packs", en: "🎬 Credits & Packs", es: "🎬 Créditos y Packs", de: "🎬 Credits & Packs", it: "🎬 Crediti e Pack", pt: "🎬 Créditos e Packs", nl: "🎬 Credits & Packs" },
    tab_avatars: { fr: "🎨 Avatars", en: "🎨 Avatars", es: "🎨 Avatares", de: "🎨 Avatare", it: "🎨 Avatar", pt: "🎨 Avatares", nl: "🎨 Avatars" },
    tab_stats: { fr: "📊 Stats", en: "📊 Stats", es: "📊 Stats", de: "📊 Stats", it: "📊 Stats", pt: "📊 Stats", nl: "📊 Stats" },
    tab_history: { fr: "📜 Historique", en: "📜 History", es: "📜 Historial", de: "📜 Verlauf", it: "📜 Cronologia", pt: "📜 Histórico", nl: "📜 Geschiedenis" },
    
    // Avatars IA Section
    my_avatars_title: { fr: "🎨 Mes Avatars IA", en: "🎨 My AI Avatars", es: "🎨 Mis Avatares IA", de: "🎨 Meine KI-Avatare", it: "🎨 I Miei Avatar IA", pt: "🎨 Meus Avatares IA", nl: "🎨 Mijn AI-Avatars" },
    avatars_description: {
      fr: "Vos avatars générés par IA sont disponibles ici. Vous pouvez les télécharger pour les utiliser dans d'autres jeux ou applications.",
      en: "Your AI-generated avatars are available here. You can download them for use in other games or applications.",
      es: "Tus avatares generados por IA están disponibles aquí. Puedes descargarlos para usarlos en otros juegos o aplicaciones.",
      de: "Ihre KI-generierten Avatare sind hier verfügbar. Sie können sie für andere Spiele oder Anwendungen herunterladen.",
      it: "I tuoi avatar generati dall'IA sono disponibili qui. Puoi scaricarli per usarli in altri giochi o applicazioni.",
      pt: "Seus avatares gerados por IA estão disponíveis aqui. Você pode baixá-los para usar em outros jogos ou aplicativos.",
      nl: "Je AI-gegenereerde avatars zijn hier beschikbaar. Je kunt ze downloaden voor gebruik in andere spellen of applicaties."
    },
    loading: { fr: "Chargement...", en: "Loading...", es: "Cargando...", de: "Laden...", it: "Caricamento...", pt: "Carregando...", nl: "Laden..." },
    no_avatars: { fr: "Vous n'avez pas encore d'avatar.", en: "You don't have any avatars yet.", es: "Aún no tienes avatares.", de: "Sie haben noch keine Avatare.", it: "Non hai ancora avatar.", pt: "Você ainda não tem avatares.", nl: "Je hebt nog geen avatars." },
    create_first_avatar: { fr: "Créez votre premier avatar dans le jeu →", en: "Create your first avatar in the game →", es: "Crea tu primer avatar en el juego →", de: "Erstellen Sie Ihren ersten Avatar im Spiel →", it: "Crea il tuo primo avatar nel gioco →", pt: "Crie seu primeiro avatar no jogo →", nl: "Maak je eerste avatar in het spel →" },
    
    // Subscriptions Section
    pack_premium: { fr: "Pack Premium", en: "Premium Pack", es: "Pack Premium", de: "Premium-Paket", it: "Pack Premium", pt: "Pack Premium", nl: "Premium Pack" },
    pack_family: { fr: "Pack Famille", en: "Family Pack", es: "Pack Familia", de: "Familienpaket", it: "Pack Famiglia", pt: "Pack Família", nl: "Familiepakket" },
    not_active: { fr: "Non actif", en: "Not active", es: "No activo", de: "Nicht aktiv", it: "Non attivo", pt: "Não ativo", nl: "Niet actief" },
    active: { fr: "Actif", en: "Active", es: "Activo", de: "Aktiv", it: "Attivo", pt: "Ativo", nl: "Actief" },
    feat_unlimited_video: { fr: "Vidéo illimitée", en: "Unlimited video", es: "Video ilimitado", de: "Unbegrenztes Video", it: "Video illimitato", pt: "Vídeo ilimitado", nl: "Onbeperkte video" },
    feat_30_avatars: { fr: "30 avatars IA / mois", en: "30 AI avatars / month", es: "30 avatares IA / mes", de: "30 KI-Avatare / Monat", it: "30 avatar IA / mese", pt: "30 avatares IA / mês", nl: "30 AI-avatars / maand" },
    feat_all_themes: { fr: "Tous les thèmes", en: "All themes", es: "Todos los temas", de: "Alle Themen", it: "Tutti i temi", pt: "Todos os temas", nl: "Alle thema's" },
    feat_premium_badge: { fr: "Badge Premium", en: "Premium Badge", es: "Insignia Premium", de: "Premium-Abzeichen", it: "Badge Premium", pt: "Distintivo Premium", nl: "Premium Badge" },
    feat_priority_support: { fr: "Support prioritaire", en: "Priority support", es: "Soporte prioritario", de: "Prioritäts-Support", it: "Supporto prioritario", pt: "Suporte prioritário", nl: "Prioriteitsondersteuning" },
    feat_8_accounts: { fr: "Jusqu'à 8 comptes", en: "Up to 8 accounts", es: "Hasta 8 cuentas", de: "Bis zu 8 Konten", it: "Fino a 8 account", pt: "Até 8 contas", nl: "Tot 8 accounts" },
    feat_video_all: { fr: "Vidéo illimitée pour tous", en: "Unlimited video for all", es: "Video ilimitado para todos", de: "Unbegrenztes Video für alle", it: "Video illimitato per tutti", pt: "Vídeo ilimitado para todos", nl: "Onbeperkte video voor iedereen" },
    feat_30_avatars_each: { fr: "30 avatars IA / mois chacun", en: "30 AI avatars / month each", es: "30 avatares IA / mes cada uno", de: "30 KI-Avatare / Monat pro Person", it: "30 avatar IA / mese ciascuno", pt: "30 avatares IA / mês cada", nl: "30 AI-avatars / maand per persoon" },
    feat_member_management: { fr: "Gestion des membres", en: "Member management", es: "Gestión de miembros", de: "Mitgliederverwaltung", it: "Gestione dei membri", pt: "Gestão de membros", nl: "Ledenbeheer" },
    family_code_share: { fr: "Code famille à partager :", en: "Family code to share:", es: "Código familiar para compartir:", de: "Familiencode zum Teilen:", it: "Codice famiglia da condividere:", pt: "Código familiar para compartilhar:", nl: "Familiecode om te delen:" },
    btn_subscribe: { fr: "S'abonner", en: "Subscribe", es: "Suscribirse", de: "Abonnieren", it: "Abbonati", pt: "Assinar", nl: "Abonneren" },
    btn_cancel: { fr: "❌ Résilier l'abonnement", en: "❌ Cancel subscription", es: "❌ Cancelar suscripción", de: "❌ Abo kündigen", it: "❌ Annulla abbonamento", pt: "❌ Cancelar assinatura", nl: "❌ Abonnement opzeggen" },
    
    // Manage Payments
    manage_payments: { fr: "📋 Gérer mes paiements", en: "📋 Manage my payments", es: "📋 Gestionar mis pagos", de: "📋 Meine Zahlungen verwalten", it: "📋 Gestisci i miei pagamenti", pt: "📋 Gerenciar meus pagamentos", nl: "📋 Mijn betalingen beheren" },
    billing_portal_desc: {
      fr: "Accédez au portail Stripe pour modifier votre moyen de paiement, télécharger vos factures ou gérer votre abonnement.",
      en: "Access the Stripe portal to modify your payment method, download invoices, or manage your subscription.",
      es: "Accede al portal de Stripe para modificar tu método de pago, descargar facturas o gestionar tu suscripción.",
      de: "Greifen Sie auf das Stripe-Portal zu, um Ihre Zahlungsmethode zu ändern, Rechnungen herunterzuladen oder Ihr Abonnement zu verwalten.",
      it: "Accedi al portale Stripe per modificare il metodo di pagamento, scaricare fatture o gestire l'abbonamento.",
      pt: "Acesse o portal Stripe para modificar seu método de pagamento, baixar faturas ou gerenciar sua assinatura.",
      nl: "Toegang tot het Stripe-portaal om je betaalmethode te wijzigen, facturen te downloaden of je abonnement te beheren."
    },
    btn_billing_portal: { fr: "🔗 Accéder au portail de paiement", en: "🔗 Access payment portal", es: "🔗 Acceder al portal de pago", de: "🔗 Zum Zahlungsportal", it: "🔗 Accedi al portale pagamenti", pt: "🔗 Acessar portal de pagamento", nl: "🔗 Naar betalingsportaal" },
    
    // Credits & Pack 50+50 Section
    bonus_avatars: { fr: "Avatars Bonus", en: "Bonus Avatars", es: "Avatares Bonus", de: "Bonus-Avatare", it: "Avatar Bonus", pt: "Avatares Bônus", nl: "Bonus Avatars" },
    monthly_avatars: { fr: "Avatars ce mois", en: "Avatars this month", es: "Avatares este mes", de: "Avatare diesen Monat", it: "Avatar questo mese", pt: "Avatares este mês", nl: "Avatars deze maand" },
    pack_5050_title: { fr: "🎁 Pack 50+50", en: "🎁 Pack 50+50", es: "🎁 Pack 50+50", de: "🎁 Pack 50+50", it: "🎁 Pack 50+50", pt: "🎁 Pack 50+50", nl: "🎁 Pack 50+50" },
    pack_5050_desc: {
      fr: "Achat unique : <strong>50 crédits vidéo</strong> + <strong>50 avatars bonus</strong>",
      en: "One-time purchase: <strong>50 video credits</strong> + <strong>50 bonus avatars</strong>",
      es: "Compra única: <strong>50 créditos de video</strong> + <strong>50 avatares bonus</strong>",
      de: "Einmaliger Kauf: <strong>50 Video-Credits</strong> + <strong>50 Bonus-Avatare</strong>",
      it: "Acquisto unico: <strong>50 crediti video</strong> + <strong>50 avatar bonus</strong>",
      pt: "Compra única: <strong>50 créditos de vídeo</strong> + <strong>50 avatares bônus</strong>",
      nl: "Eenmalige aankoop: <strong>50 video credits</strong> + <strong>50 bonus avatars</strong>"
    },
    pack_5050_ideal: {
      fr: "Idéal pour compléter votre abonnement ou offrir en cadeau !",
      en: "Ideal to complement your subscription or give as a gift!",
      es: "¡Ideal para complementar tu suscripción o regalar!",
      de: "Ideal zur Ergänzung Ihres Abonnements oder als Geschenk!",
      it: "Ideale per integrare il tuo abbonamento o da regalare!",
      pt: "Ideal para complementar sua assinatura ou dar de presente!",
      nl: "Ideaal als aanvulling op je abonnement of als cadeau!"
    },
    promo_label: { fr: "🎁 Code promo ?", en: "🎁 Promo code?", es: "🎁 ¿Código promocional?", de: "🎁 Promo-Code?", it: "🎁 Codice promo?", pt: "🎁 Código promocional?", nl: "🎁 Promotiecode?" },
    promo_placeholder: { fr: "Entre ton code", en: "Enter your code", es: "Ingresa tu código", de: "Gib deinen Code ein", it: "Inserisci il tuo codice", pt: "Digite seu código", nl: "Voer je code in" },
    promo_validate: { fr: "Valider", en: "Validate", es: "Validar", de: "Bestätigen", it: "Convalida", pt: "Validar", nl: "Valideren" },
    btn_buy_pack: { fr: "🛒 Acheter le Pack", en: "🛒 Buy the Pack", es: "🛒 Comprar el Pack", de: "🛒 Pack kaufen", it: "🛒 Acquista il Pack", pt: "🛒 Comprar o Pack", nl: "🛒 Pack kopen" },
    
    // Purchase History
    purchase_history: { fr: "📜 Historique des achats", en: "📜 Purchase History", es: "📜 Historial de compras", de: "📜 Kaufverlauf", it: "📜 Cronologia acquisti", pt: "📜 Histórico de compras", nl: "📜 Aankoopgeschiedenis" },
    no_purchases: { fr: "Aucun achat pour le moment.", en: "No purchases yet.", es: "Sin compras por el momento.", de: "Noch keine Käufe.", it: "Nessun acquisto al momento.", pt: "Nenhuma compra ainda.", nl: "Nog geen aankopen." },
    future_purchases: { fr: "Vos futurs achats apparaîtront ici.", en: "Your future purchases will appear here.", es: "Tus futuras compras aparecerán aquí.", de: "Ihre zukünftigen Käufe werden hier angezeigt.", it: "I tuoi futuri acquisti appariranno qui.", pt: "Suas futuras compras aparecerão aqui.", nl: "Je toekomstige aankopen verschijnen hier." },
    
    // Profile Section
    page_title_h1: { fr: "⚔️ Mon Compte", en: "⚔️ My Account", es: "⚔️ Mi Cuenta", de: "⚔️ Mein Konto", it: "⚔️ Il Mio Account", pt: "⚔️ Minha Conta", nl: "⚔️ Mijn Account" },
    personal_info: { fr: "👤 Informations personnelles", en: "👤 Personal Information", es: "👤 Información personal", de: "👤 Persönliche Informationen", it: "👤 Informazioni personali", pt: "👤 Informações pessoais", nl: "👤 Persoonlijke Informatie" },
    label_email: { fr: "Email", en: "Email", es: "Correo electrónico", de: "E-Mail", it: "Email", pt: "E-mail", nl: "E-mail" },
    label_username: { fr: "Pseudo", en: "Username", es: "Nombre de usuario", de: "Benutzername", it: "Nome utente", pt: "Nome de usuário", nl: "Gebruikersnaam" },
    label_account_type: { fr: "Type de compte", en: "Account type", es: "Tipo de cuenta", de: "Kontotyp", it: "Tipo di account", pt: "Tipo de conta", nl: "Accounttype" },
    btn_save: { fr: "💾 Sauvegarder", en: "💾 Save", es: "💾 Guardar", de: "💾 Speichern", it: "💾 Salva", pt: "💾 Salvar", nl: "💾 Opslaan" },
    
    // Change Password Section
    change_password_title: { fr: "🔒 Changer le mot de passe", en: "🔒 Change Password", es: "🔒 Cambiar contraseña", de: "🔒 Passwort ändern", it: "🔒 Cambia password", pt: "🔒 Alterar senha", nl: "🔒 Wachtwoord wijzigen" },
    label_current_password: { fr: "Mot de passe actuel", en: "Current password", es: "Contraseña actual", de: "Aktuelles Passwort", it: "Password attuale", pt: "Senha atual", nl: "Huidig wachtwoord" },
    label_new_password: { fr: "Nouveau mot de passe", en: "New password", es: "Nueva contraseña", de: "Neues Passwort", it: "Nuova password", pt: "Nova senha", nl: "Nieuw wachtwoord" },
    label_confirm_password: { fr: "Confirmer le nouveau mot de passe", en: "Confirm new password", es: "Confirmar nueva contraseña", de: "Neues Passwort bestätigen", it: "Conferma nuova password", pt: "Confirmar nova senha", nl: "Nieuw wachtwoord bevestigen" },
    btn_change_password: { fr: "🔐 Modifier le mot de passe", en: "🔐 Change password", es: "🔐 Modificar contraseña", de: "🔐 Passwort ändern", it: "🔐 Modifica password", pt: "🔐 Modificar senha", nl: "🔐 Wachtwoord wijzigen" }
  },

  // ============================================================================
  // PARRAINAGE / REFERRAL (account.html)
  // ============================================================================
  referral: {
    tab_title: { fr: "👥 Parrainage", en: "👥 Referral", es: "👥 Referido", de: "👥 Empfehlung", it: "👥 Referral", pt: "👥 Indicação", nl: "👥 Doorverwijzing" },
    program_title: { fr: "👥 Programme de Parrainage", en: "👥 Referral Program", es: "👥 Programa de Referidos", de: "👥 Empfehlungsprogramm", it: "👥 Programma Referral", pt: "👥 Programa de Indicação", nl: "👥 Doorverwijzingsprogramma" },
    your_code: { fr: "🎁 TON CODE PARRAIN", en: "🎁 YOUR REFERRAL CODE", es: "🎁 TU CÓDIGO DE REFERIDO", de: "🎁 DEIN EMPFEHLUNGSCODE", it: "🎁 IL TUO CODICE REFERRAL", pt: "🎁 SEU CÓDIGO DE INDICAÇÃO", nl: "🎁 JOUW DOORVERWIJZINGSCODE" },
    copy: { fr: "📋 Copier", en: "📋 Copy", es: "📋 Copiar", de: "📋 Kopieren", it: "📋 Copia", pt: "📋 Copiar", nl: "📋 Kopiëren" },
    share_link: { fr: "🔗 Partager le lien", en: "🔗 Share link", es: "🔗 Compartir enlace", de: "🔗 Link teilen", it: "🔗 Condividi link", pt: "🔗 Compartilhar link", nl: "🔗 Link delen" },
    code_description: { 
      fr: "Partage ce code avec tes amis. Quand ils s'inscrivent et font leur 1er achat, tu reçois une récompense !", 
      en: "Share this code with your friends. When they sign up and make their 1st purchase, you get a reward!", 
      es: "Comparte este código con tus amigos. ¡Cuando se registren y hagan su 1ª compra, recibes una recompensa!", 
      de: "Teile diesen Code mit deinen Freunden. Wenn sie sich anmelden und ihren 1. Kauf tätigen, erhältst du eine Belohnung!", 
      it: "Condividi questo codice con i tuoi amici. Quando si registrano e fanno il loro 1° acquisto, ricevi una ricompensa!", 
      pt: "Compartilhe este código com seus amigos. Quando eles se inscreverem e fizerem sua 1ª compra, você recebe uma recompensa!", 
      nl: "Deel deze code met je vrienden. Wanneer zij zich aanmelden en hun 1e aankoop doen, krijg je een beloning!" 
    },
    your_link: { fr: "🔗 Ton lien de parrainage", en: "🔗 Your referral link", es: "🔗 Tu enlace de referido", de: "🔗 Dein Empfehlungslink", it: "🔗 Il tuo link referral", pt: "🔗 Seu link de indicação", nl: "🔗 Jouw doorverwijzingslink" },
    loading: { fr: "Chargement...", en: "Loading...", es: "Cargando...", de: "Laden...", it: "Caricamento...", pt: "Carregando...", nl: "Laden..." },
    stat_completed: { fr: "Parrainages validés", en: "Completed referrals", es: "Referidos validados", de: "Abgeschlossene Empfehlungen", it: "Referral completati", pt: "Indicações validadas", nl: "Voltooide doorverwijzingen" },
    stat_pending: { fr: "En attente d'achat", en: "Pending purchase", es: "Pendiente de compra", de: "Ausstehender Kauf", it: "In attesa di acquisto", pt: "Aguardando compra", nl: "In afwachting van aankoop" },
    stat_total: { fr: "Total invités", en: "Total invited", es: "Total invitados", de: "Insgesamt eingeladen", it: "Totale invitati", pt: "Total convidados", nl: "Totaal uitgenodigd" },
    how_it_works: { fr: "❓ Comment ça marche ?", en: "❓ How does it work?", es: "❓ ¿Cómo funciona?", de: "❓ Wie funktioniert es?", it: "❓ Come funziona?", pt: "❓ Como funciona?", nl: "❓ Hoe werkt het?" },
    step1: { fr: "Partage ton code ou lien avec un ami", en: "Share your code or link with a friend", es: "Comparte tu código o enlace con un amigo", de: "Teile deinen Code oder Link mit einem Freund", it: "Condividi il tuo codice o link con un amico", pt: "Compartilhe seu código ou link com um amigo", nl: "Deel je code of link met een vriend" },
    step2: { fr: "Ton ami s'inscrit sur Saboteur avec ton code", en: "Your friend signs up on Saboteur with your code", es: "Tu amigo se registra en Saboteur con tu código", de: "Dein Freund meldet sich bei Saboteur mit deinem Code an", it: "Il tuo amico si iscrive su Saboteur con il tuo codice", pt: "Seu amigo se inscreve no Saboteur com seu código", nl: "Je vriend meldt zich aan bij Saboteur met jouw code" },
    step3: { fr: "Quand ton ami fait son 1er achat, le parrainage est", en: "When your friend makes their 1st purchase, the referral is", es: "Cuando tu amigo hace su 1ª compra, el referido es", de: "Wenn dein Freund seinen 1. Kauf tätigt, ist die Empfehlung", it: "Quando il tuo amico fa il suo 1° acquisto, il referral è", pt: "Quando seu amigo faz sua 1ª compra, a indicação é", nl: "Wanneer je vriend zijn 1e aankoop doet, is de doorverwijzing" },
    step3_validated: { fr: "validé", en: "validated", es: "validado", de: "bestätigt", it: "convalidato", pt: "validada", nl: "gevalideerd" },
    step4: { fr: "Tu reçois ta récompense automatiquement ! 🎉", en: "You receive your reward automatically! 🎉", es: "¡Recibes tu recompensa automáticamente! 🎉", de: "Du erhältst deine Belohnung automatisch! 🎉", it: "Ricevi la tua ricompensa automaticamente! 🎉", pt: "Você recebe sua recompensa automaticamente! 🎉", nl: "Je ontvangt je beloning automatisch! 🎉" }
  },

  // ============================================================================
  // PAGE STATS & BADGES (player-stats.html)
  // ============================================================================
  stats: {
    // Page title & header
    page_title: { fr: "📊 STATS & BADGES", en: "📊 STATS & BADGES", es: "📊 STATS & INSIGNIAS", de: "📊 STATS & ABZEICHEN", it: "📊 STATS & BADGE", pt: "📊 STATS & INSÍGNIAS", nl: "📊 STATS & BADGES" },
    back_to_game: { fr: "🎮 Retour à la partie", en: "🎮 Back to game", es: "🎮 Volver al juego", de: "🎮 Zurück zum Spiel", it: "🎮 Torna al gioco", pt: "🎮 Voltar ao jogo", nl: "🎮 Terug naar spel" },
    explanations: { fr: "❓ Explications", en: "❓ Explanations", es: "❓ Explicaciones", de: "❓ Erklärungen", it: "❓ Spiegazioni", pt: "❓ Explicações", nl: "❓ Uitleg" },
    home: { fr: "🏠 Accueil", en: "🏠 Home", es: "🏠 Inicio", de: "🏠 Startseite", it: "🏠 Home", pt: "🏠 Início", nl: "🏠 Home" },
    refresh: { fr: "🔄 Actualiser", en: "🔄 Refresh", es: "🔄 Actualizar", de: "🔄 Aktualisieren", it: "🔄 Aggiorna", pt: "🔄 Atualizar", nl: "🔄 Vernieuwen" },
    
    // Tabs
    tab_profile: { fr: "👤 Mon Profil", en: "👤 My Profile", es: "👤 Mi Perfil", de: "👤 Mein Profil", it: "👤 Il Mio Profilo", pt: "👤 Meu Perfil", nl: "👤 Mijn Profiel" },
    tab_postgame: { fr: "🏆 Fin de Partie", en: "🏆 End Game", es: "🏆 Fin de Partida", de: "🏆 Spielende", it: "🏆 Fine Partita", pt: "🏆 Fim de Jogo", nl: "🏆 Einde Spel" },
    tab_leaderboards: { fr: "📈 Classements", en: "📈 Leaderboards", es: "📈 Clasificaciones", de: "📈 Ranglisten", it: "📈 Classifiche", pt: "📈 Classificações", nl: "📈 Ranglijsten" },
    tab_archives: { fr: "📅 Archives", en: "📅 Archives", es: "📅 Archivos", de: "📅 Archiv", it: "📅 Archivi", pt: "📅 Arquivos", nl: "📅 Archieven" },
    
    // Profile
    loading: { fr: "Chargement...", en: "Loading...", es: "Cargando...", de: "Laden...", it: "Caricamento...", pt: "Carregando...", nl: "Laden..." },
    loading_powers: { fr: "Chargement des pouvoirs...", en: "Loading powers...", es: "Cargando poderes...", de: "Lade Kräfte...", it: "Caricamento poteri...", pt: "Carregando poderes...", nl: "Krachten laden..." },
    login_to_see_stats: { fr: "Connecte-toi pour voir tes stats", en: "Log in to see your stats", es: "Inicia sesión para ver tus estadísticas", de: "Melde dich an, um deine Stats zu sehen", it: "Accedi per vedere le tue statistiche", pt: "Faça login para ver suas estatísticas", nl: "Log in om je stats te zien" },
    verified_account: { fr: "✅ Compte vérifié", en: "✅ Verified account", es: "✅ Cuenta verificada", de: "✅ Verifiziertes Konto", it: "✅ Account verificato", pt: "✅ Conta verificada", nl: "✅ Geverifieerd account" },
    unverified_email: { fr: "⚠️ Email non vérifié", en: "⚠️ Unverified email", es: "⚠️ Email no verificado", de: "⚠️ E-Mail nicht verifiziert", it: "⚠️ Email non verificata", pt: "⚠️ E-mail não verificado", nl: "⚠️ E-mail niet geverifieerd" },
    persistent_stats_info: { fr: "Connecte-toi pour des stats persistantes", en: "Log in for persistent stats", es: "Inicia sesión para estadísticas persistentes", de: "Melde dich an für dauerhafte Stats", it: "Accedi per statistiche permanenti", pt: "Faça login para estatísticas persistentes", nl: "Log in voor permanente stats" },
    not_logged_in: { fr: "Non connecté", en: "Not logged in", es: "No conectado", de: "Nicht angemeldet", it: "Non connesso", pt: "Não conectado", nl: "Niet ingelogd" },
    no_data: { fr: "Aucune donnée disponible", en: "No data available", es: "Sin datos disponibles", de: "Keine Daten verfügbar", it: "Nessun dato disponibile", pt: "Nenhum dado disponível", nl: "Geen gegevens beschikbaar" },
    play_first_game: { fr: "Joue ta 1ère partie !", en: "Play your 1st game!", es: "¡Juega tu 1ª partida!", de: "Spiele dein 1. Spiel!", it: "Gioca la tua 1ª partita!", pt: "Jogue sua 1ª partida!", nl: "Speel je 1e spel!" },
    
    // Badges
    badge_iron: { fr: "Fer", en: "Iron", es: "Hierro", de: "Eisen", it: "Ferro", pt: "Ferro", nl: "IJzer" },
    badge_bronze: { fr: "Bronze", en: "Bronze", es: "Bronce", de: "Bronze", it: "Bronzo", pt: "Bronze", nl: "Brons" },
    badge_silver: { fr: "Argent", en: "Silver", es: "Plata", de: "Silber", it: "Argento", pt: "Prata", nl: "Zilver" },
    badge_gold: { fr: "Or", en: "Gold", es: "Oro", de: "Gold", it: "Oro", pt: "Ouro", nl: "Goud" },
    badge_platinum: { fr: "Platine", en: "Platinum", es: "Platino", de: "Platin", it: "Platino", pt: "Platina", nl: "Platina" },
    unranked: { fr: "🔒 Non classé", en: "🔒 Unranked", es: "🔒 Sin clasificar", de: "🔒 Nicht platziert", it: "🔒 Non classificato", pt: "🔒 Não classificado", nl: "🔒 Niet gerangschikt" },
    
    // Powers
    power_champion: { fr: "Champion", en: "Champion", es: "Campeón", de: "Champion", it: "Campione", pt: "Campeão", nl: "Kampioen" },
    power_champion_desc: { fr: "Moyenne × Win Rate (6/8 pouvoirs)", en: "Average × Win Rate (6/8 powers)", es: "Promedio × Win Rate (6/8 poderes)", de: "Durchschnitt × Siegquote (6/8 Kräfte)", it: "Media × Win Rate (6/8 poteri)", pt: "Média × Win Rate (6/8 poderes)", nl: "Gemiddelde × Win Rate (6/8 krachten)" },
    power_doctor: { fr: "Docteur / Sorcière", en: "Doctor / Witch", es: "Doctor / Bruja", de: "Arzt / Hexe", it: "Dottore / Strega", pt: "Doutor / Bruxa", nl: "Dokter / Heks" },
    power_doctor_desc: { fr: "Soins astro + potions mort saboteurs", en: "Astro heals + saboteur death potions", es: "Curación astro + pociones de muerte saboteadores", de: "Astro-Heilung + Saboteur-Todesränke", it: "Cure astro + pozioni morte sabotatori", pt: "Curas astro + poções morte sabotadores", nl: "Astro genezingen + saboteur doodsdrankjes" },
    power_bluffer: { fr: "Bluffer (Incognito)", en: "Bluffer (Incognito)", es: "Farol (Incógnito)", de: "Bluffer (Inkognito)", it: "Bluffer (Incognito)", pt: "Bluffer (Incógnito)", nl: "Bluffer (Incognito)" },
    power_bluffer_desc: { fr: "Victoire saboteur + 0 vote contre toi", en: "Saboteur win + 0 votes against you", es: "Victoria saboteador + 0 votos en tu contra", de: "Saboteur-Sieg + 0 Stimmen gegen dich", it: "Vittoria sabotatore + 0 voti contro di te", pt: "Vitória sabotador + 0 votos contra você", nl: "Saboteur overwinning + 0 stemmen tegen je" },
    power_resistant: { fr: "Le plus Résistant", en: "Most Resistant", es: "Más Resistente", de: "Widerstandsfähigste", it: "Più Resistente", pt: "Mais Resistente", nl: "Meest Resistent" },
    power_resistant_desc: { fr: "Taux de survie en fin de partie", en: "Survival rate at end of game", es: "Tasa de supervivencia al final", de: "Überlebensrate am Spielende", it: "Tasso di sopravvivenza a fine partita", pt: "Taxa de sobrevivência no final", nl: "Overlevingspercentage aan het einde" },
    power_investigator: { fr: "Enquêteur", en: "Investigator", es: "Investigador", de: "Ermittler", it: "Investigatore", pt: "Investigador", nl: "Onderzoeker" },
    power_investigator_desc: { fr: "Votes justes vs saboteurs", en: "Correct votes vs saboteurs", es: "Votos correctos vs saboteadores", de: "Richtige Stimmen gegen Saboteure", it: "Voti corretti vs sabotatori", pt: "Votos corretos vs sabotadores", nl: "Correcte stemmen vs saboteurs" },
    power_captain: { fr: "Chef de station", en: "Station Chief", es: "Jefe de estación", de: "Stationsleiter", it: "Capo stazione", pt: "Chefe de estação", nl: "Stationschef" },
    power_captain_desc: { fr: "Départages + transferts pro-astro", en: "Tiebreaks + pro-astro transfers", de: "Stichentscheide + Pro-Astro-Transfers", es: "Desempates + transferencias pro-astro", it: "Spareggi + trasferimenti pro-astro", pt: "Desempates + transferências pro-astro", nl: "Stemmingen + pro-astro transfers" },
    power_security: { fr: "Chef de sécurité", en: "Security Chief", es: "Jefe de seguridad", de: "Sicherheitschef", it: "Capo sicurezza", pt: "Chefe de segurança", nl: "Beveiligingschef" },
    power_security_desc: { fr: "Vengeance efficace vs saboteur", en: "Effective revenge vs saboteur", es: "Venganza efectiva vs saboteador", de: "Effektive Rache gegen Saboteur", it: "Vendetta efficace vs sabotatore", pt: "Vingança eficaz vs sabotador", nl: "Effectieve wraak vs saboteur" },
    power_streak: { fr: "Série de Victoires", en: "Win Streak", es: "Racha de Victorias", de: "Siegesserie", it: "Serie di Vittorie", pt: "Sequência de Vitórias", nl: "Winnende Reeks" },
    power_streak_desc: { fr: "Meilleure streak (tous rôles)", en: "Best streak (all roles)", es: "Mejor racha (todos los roles)", de: "Beste Serie (alle Rollen)", it: "Miglior serie (tutti i ruoli)", pt: "Melhor sequência (todos os papéis)", nl: "Beste reeks (alle rollen)" },
    power_exterminator: { fr: "Exterminateur", en: "Exterminator", es: "Exterminador", de: "Ausrotter", it: "Sterminatore", pt: "Exterminador", nl: "Verdelger" },
    power_exterminator_desc: { fr: "Potions mort sur astronautes", en: "Death potions on astronauts", es: "Pociones de muerte en astronautas", de: "Todesränke auf Astronauten", it: "Pozioni morte su astronauti", pt: "Poções morte em astronautas", nl: "Doodsdrankjes op astronauten" },
    
    // Postgame
    no_game: { fr: "Aucune partie en cours. Cette page affiche les stats après une partie.", en: "No game in progress. This page shows stats after a game.", es: "Sin partida en curso. Esta página muestra estadísticas después de una partida.", de: "Kein Spiel läuft. Diese Seite zeigt Stats nach einem Spiel.", it: "Nessuna partita in corso. Questa pagina mostra le statistiche dopo una partita.", pt: "Nenhum jogo em andamento. Esta página mostra estatísticas após um jogo.", nl: "Geen spel bezig. Deze pagina toont stats na een spel." },
    play_a_game: { fr: "🎮 Jouer une partie", en: "🎮 Play a game", es: "🎮 Jugar una partida", de: "🎮 Ein Spiel spielen", it: "🎮 Gioca una partita", pt: "🎮 Jogar uma partida", nl: "🎮 Speel een spel" },
    loading_report: { fr: "Chargement du rapport...", en: "Loading report...", es: "Cargando informe...", de: "Bericht laden...", it: "Caricamento rapporto...", pt: "Carregando relatório...", nl: "Rapport laden..." },
    report_not_found: { fr: "Rapport introuvable", en: "Report not found", es: "Informe no encontrado", de: "Bericht nicht gefunden", it: "Rapporto non trovato", pt: "Relatório não encontrado", nl: "Rapport niet gevonden" },
    astronauts_win: { fr: "Victoire des Astronautes !", en: "Astronauts Win!", es: "¡Victoria de los Astronautas!", de: "Astronauten gewinnen!", it: "Vittoria degli Astronauti!", pt: "Vitória dos Astronautas!", nl: "Astronauten Winnen!" },
    saboteurs_win: { fr: "Victoire des Saboteurs !", en: "Saboteurs Win!", es: "¡Victoria de los Saboteadores!", de: "Saboteure gewinnen!", it: "Vittoria dei Sabotatori!", pt: "Vitória dos Sabotadores!", nl: "Saboteurs Winnen!" },
    lovers_win: { fr: "Victoire des Amoureux !", en: "Lovers Win!", es: "¡Victoria de los Enamorados!", de: "Verliebte gewinnen!", it: "Vittoria degli Innamorati!", pt: "Vitória dos Apaixonados!", nl: "Geliefden Winnen!" },
    game_ended: { fr: "Partie terminée", en: "Game ended", es: "Partida terminada", de: "Spiel beendet", it: "Partita terminata", pt: "Jogo terminado", nl: "Spel geëindigd" },
    duration: { fr: "Durée", en: "Duration", es: "Duración", de: "Dauer", it: "Durata", pt: "Duração", nl: "Duur" },
    
    // Leaderboards
    loading_leaderboards: { fr: "Chargement des classements...", en: "Loading leaderboards...", es: "Cargando clasificaciones...", de: "Ranglisten laden...", it: "Caricamento classifiche...", pt: "Carregando classificações...", nl: "Ranglijsten laden..." },
    view_leaderboard: { fr: "Voir le classement →", en: "View leaderboard →", es: "Ver clasificación →", de: "Rangliste ansehen →", it: "Vedi classifica →", pt: "Ver classificação →", nl: "Bekijk ranglijst →" },
    no_players_ranked: { fr: "Aucun joueur classé", en: "No players ranked", es: "Sin jugadores clasificados", de: "Keine Spieler platziert", it: "Nessun giocatore classificato", pt: "Nenhum jogador classificado", nl: "Geen spelers gerangschikt" },
    rank: { fr: "#", en: "#", es: "#", de: "#", it: "#", pt: "#", nl: "#" },
    player: { fr: "Joueur", en: "Player", es: "Jugador", de: "Spieler", it: "Giocatore", pt: "Jogador", nl: "Speler" },
    badge: { fr: "Badge", en: "Badge", es: "Insignia", de: "Abzeichen", it: "Badge", pt: "Insígnia", nl: "Badge" },
    score: { fr: "Score", en: "Score", es: "Puntuación", de: "Punktzahl", it: "Punteggio", pt: "Pontuação", nl: "Score" },
    lb_global: { fr: "Classement global", en: "Global ranking", es: "Clasificación global", de: "Globale Rangliste", it: "Classifica globale", pt: "Classificação global", nl: "Globale ranglijst" },
    lb_heals: { fr: "Soins + potions", en: "Heals + potions", es: "Curación + pociones", de: "Heilung + Tränke", it: "Cure + pozioni", pt: "Curas + poções", nl: "Genezingen + drankjes" },
    lb_incognito: { fr: "Incognito saboteur", en: "Incognito saboteur", es: "Saboteador incógnito", de: "Inkognito Saboteur", it: "Sabotatore incognito", pt: "Sabotador incógnito", nl: "Incognito saboteur" },
    lb_alive_time: { fr: "Temps vivant", en: "Time alive", es: "Tiempo vivo", de: "Überlebenszeit", it: "Tempo vivo", pt: "Tempo vivo", nl: "Tijd levend" },
    
    // V42: Traductions cards classements
    lb_champion: { fr: "Champion", en: "Champion", es: "Campeón", de: "Champion", it: "Campione", pt: "Campeão", nl: "Kampioen" },
    lb_champion_desc: { fr: "Classement global", en: "Overall ranking", es: "Clasificación global", de: "Gesamtranking", it: "Classifica globale", pt: "Classificação geral", nl: "Algemeen klassement" },
    lb_doctor: { fr: "Docteur", en: "Doctor", es: "Doctor", de: "Arzt", it: "Dottore", pt: "Doutor", nl: "Dokter" },
    lb_doctor_desc: { fr: "Soins + potions", en: "Heals + potions", es: "Curas + pociones", de: "Heilungen + Tränke", it: "Cure + pozioni", pt: "Curas + poções", nl: "Genezingen + drankjes" },
    lb_bluffer: { fr: "Bluffer", en: "Bluffer", es: "Farol", de: "Bluffer", it: "Bluffer", pt: "Bluffer", nl: "Bluffer" },
    lb_bluffer_desc: { fr: "Incognito saboteur", en: "Incognito saboteur", es: "Saboteador incógnito", de: "Inkognito-Saboteur", it: "Sabotatore in incognito", pt: "Sabotador incógnito", nl: "Incognito saboteur" },
    lb_resistant: { fr: "Résistant", en: "Survivor", es: "Resistente", de: "Überlebender", it: "Resistente", pt: "Resistente", nl: "Overlever" },
    lb_resistant_desc: { fr: "Taux de survie", en: "Survival rate", es: "Tasa de supervivencia", de: "Überlebensrate", it: "Tasso di sopravvivenza", pt: "Taxa de sobrevivência", nl: "Overlevingspercentage" },
    lb_investigator: { fr: "Enquêteur", en: "Investigator", es: "Investigador", de: "Ermittler", it: "Investigatore", pt: "Investigador", nl: "Onderzoeker" },
    lb_investigator_desc: { fr: "Votes justes", en: "Correct votes", es: "Votos correctos", de: "Richtige Stimmen", it: "Voti corretti", pt: "Votos corretos", nl: "Correcte stemmen" },
    lb_chief: { fr: "Chef station", en: "Station chief", es: "Jefe de estación", de: "Stationsleiter", it: "Capo stazione", pt: "Chefe de estação", nl: "Stationschef" },
    lb_chief_desc: { fr: "Décisions capitaine", en: "Captain decisions", es: "Decisiones capitán", de: "Kapitänsentscheidungen", it: "Decisioni capitano", pt: "Decisões capitão", nl: "Kapiteinsbeslissingen" },
    lb_security: { fr: "Sécurité", en: "Security", es: "Seguridad", de: "Sicherheit", it: "Sicurezza", pt: "Segurança", nl: "Beveiliging" },
    lb_security_desc: { fr: "Vengeance", en: "Revenge", es: "Venganza", de: "Rache", it: "Vendetta", pt: "Vingança", nl: "Wraak" },
    lb_streak: { fr: "Streak", en: "Streak", es: "Racha", de: "Serie", it: "Streak", pt: "Sequência", nl: "Reeks" },
    lb_streak_desc: { fr: "Série victoires", en: "Win streak", es: "Racha de victorias", de: "Siegesserie", it: "Serie di vittorie", pt: "Sequência de vitórias", nl: "Winstreek" },
    lb_exterminator: { fr: "Exterminateur", en: "Exterminator", es: "Exterminador", de: "Vernichter", it: "Sterminatore", pt: "Exterminador", nl: "Vernietiger" },
    lb_exterminator_desc: { fr: "Potions sur astronautes", en: "Potions on astronauts", es: "Pociones sobre astronautas", de: "Tränke auf Astronauten", it: "Pozioni sugli astronauti", pt: "Poções em astronautas", nl: "Drankjes op astronauten" },
    lb_view: { fr: "Voir le classement", en: "View ranking", es: "Ver clasificación", de: "Ranking ansehen", it: "Vedi classifica", pt: "Ver classificação", nl: "Bekijk klassement" },
    
    // V42: Traductions colonnes volume classements
    lb_vol_games: { fr: "Parties", en: "Games", es: "Partidas", de: "Spiele", it: "Partite", pt: "Partidas", nl: "Wedstrijden" },
    lb_vol_actions: { fr: "Actions", en: "Actions", es: "Acciones", de: "Aktionen", it: "Azioni", pt: "Ações", nl: "Acties" },
    lb_vol_sab_games: { fr: "Parties sab.", en: "Sab. games", es: "Partidas sab.", de: "Sab.-Spiele", it: "Partite sab.", pt: "Partidas sab.", nl: "Sab. wedstrijden" },
    lb_vol_potions: { fr: "Potions", en: "Potions", es: "Pociones", de: "Tränke", it: "Pozioni", pt: "Poções", nl: "Drankjes" },
    lb_vol_votes: { fr: "Votes", en: "Votes", es: "Votos", de: "Stimmen", it: "Voti", pt: "Votos", nl: "Stemmen" },
    lb_vol_decisions: { fr: "Décisions", en: "Decisions", es: "Decisiones", de: "Entscheidungen", it: "Decisioni", pt: "Decisões", nl: "Beslissingen" },
    lb_vol_shots: { fr: "Tirs", en: "Shots", es: "Disparos", de: "Schüsse", it: "Colpi", pt: "Tiros", nl: "Schoten" },
    lb_vol_streak: { fr: "Série", en: "Streak", es: "Racha", de: "Serie", it: "Serie", pt: "Sequência", nl: "Reeks" },
    lb_correct_votes: { fr: "Votes justes", en: "Correct votes", es: "Votos correctos", de: "Richtige Stimmen", it: "Voti corretti", pt: "Votos corretos", nl: "Correcte stemmen" },
    lb_captain_decisions: { fr: "Décisions capitaine", en: "Captain decisions", es: "Decisiones del capitán", de: "Kapitän-Entscheidungen", it: "Decisioni capitano", pt: "Decisões do capitão", nl: "Kapiteinsbeslissingen" },
    lb_revenge: { fr: "Vengeance", en: "Revenge", es: "Venganza", de: "Rache", it: "Vendetta", pt: "Vingança", nl: "Wraak" },
    lb_win_streak: { fr: "Série victoires", en: "Win streak", es: "Racha de victorias", de: "Siegesserie", it: "Serie di vittorie", pt: "Sequência de vitórias", nl: "Winnende reeks" },
    lb_potions_astro: { fr: "Potions sur astronautes", en: "Potions on astronauts", es: "Pociones en astronautas", de: "Tränke auf Astronauten", it: "Pozioni su astronauti", pt: "Poções em astronautas", nl: "Drankjes op astronauten" },
    
    // Archives
    loading_archives: { fr: "Chargement...", en: "Loading...", es: "Cargando...", de: "Laden...", it: "Caricamento...", pt: "Carregando...", nl: "Laden..." },
    no_monthly_snapshot: { fr: "Aucun snapshot mensuel disponible", en: "No monthly snapshot available", es: "Sin snapshot mensual disponible", de: "Kein monatlicher Snapshot verfügbar", it: "Nessun snapshot mensile disponibile", pt: "Nenhum snapshot mensal disponível", nl: "Geen maandelijkse snapshot beschikbaar" },
    official_monthly_ranking: { fr: "Classement officiel du mois", en: "Official monthly ranking", es: "Clasificación oficial del mes", de: "Offizielle monatliche Rangliste", it: "Classifica ufficiale del mese", pt: "Classificação oficial do mês", nl: "Officiële maandelijkse ranglijst" },
    view: { fr: "Voir →", en: "View →", es: "Ver →", de: "Ansehen →", it: "Vedi →", pt: "Ver →", nl: "Bekijk →" },
    ranking_for: { fr: "Classement", en: "Ranking", es: "Clasificación", de: "Rangliste", it: "Classifica", pt: "Classificação", nl: "Ranglijst" },
    snapshot_not_found: { fr: "Snapshot introuvable", en: "Snapshot not found", es: "Snapshot no encontrado", de: "Snapshot nicht gefunden", it: "Snapshot non trovato", pt: "Snapshot não encontrado", nl: "Snapshot niet gevonden" },
    no_ranked: { fr: "Aucun classé", en: "No one ranked", es: "Nadie clasificado", de: "Niemand platziert", it: "Nessuno classificato", pt: "Ninguém classificado", nl: "Niemand gerangschikt" },
    empty_data: { fr: "Données vides", en: "Empty data", es: "Datos vacíos", de: "Leere Daten", it: "Dati vuoti", pt: "Dados vazios", nl: "Lege gegevens" },
    loading_error: { fr: "Erreur de chargement", en: "Loading error", es: "Error de carga", de: "Ladefehler", it: "Errore di caricamento", pt: "Erro de carregamento", nl: "Laadfout" },
    
    // Explanations Modal
    how_stats_work: { fr: "❓ Comment fonctionnent les Stats & Badges", en: "❓ How Stats & Badges Work", es: "❓ Cómo funcionan las Stats e Insignias", de: "❓ Wie Stats & Abzeichen funktionieren", it: "❓ Come funzionano Stats e Badge", pt: "❓ Como funcionam as Stats e Insígnias", nl: "❓ Hoe Stats & Badges werken" },
    badge_acquisition: { fr: "🏅 Obtention des Badges", en: "🏅 Badge Acquisition", es: "🏅 Obtención de Insignias", de: "🏅 Abzeichen erhalten", it: "🏅 Ottenimento Badge", pt: "🏅 Obtenção de Insígnias", nl: "🏅 Badges verkrijgen" },
    score_0_60: { fr: "Score de 0% à 59%", en: "Score from 0% to 59%", es: "Puntuación de 0% a 59%", de: "Punktzahl von 0% bis 59%", it: "Punteggio da 0% a 59%", pt: "Pontuação de 0% a 59%", nl: "Score van 0% tot 59%" },
    score_60_70: { fr: "Score de 60% à 69%", en: "Score from 60% to 69%", es: "Puntuación de 60% a 69%", de: "Punktzahl von 60% bis 69%", it: "Punteggio da 60% a 69%", pt: "Pontuação de 60% a 69%", nl: "Score van 60% tot 69%" },
    score_70_80: { fr: "Score de 70% à 79%", en: "Score from 70% to 79%", es: "Puntuación de 70% a 79%", de: "Punktzahl von 70% bis 79%", it: "Punteggio da 70% a 79%", pt: "Pontuação de 70% a 79%", nl: "Score van 70% tot 79%" },
    score_80_90: { fr: "Score de 80% à 89%", en: "Score from 80% to 89%", es: "Puntuación de 80% a 89%", de: "Punktzahl von 80% bis 89%", it: "Punteggio da 80% a 89%", pt: "Pontuação de 80% a 89%", nl: "Score van 80% tot 89%" },
    score_90_100: { fr: "Score de 90% à 100%", en: "Score from 90% to 100%", es: "Puntuación de 90% a 100%", de: "Punktzahl von 90% bis 100%", it: "Punteggio da 90% a 100%", pt: "Pontuação de 90% a 100%", nl: "Score van 90% tot 100%" },
    power_calculation: { fr: "📊 Calcul des Pouvoirs (Score 0-100%)", en: "📊 Power Calculation (Score 0-100%)", es: "📊 Cálculo de Poderes (Puntuación 0-100%)", de: "📊 Kraft-Berechnung (Punktzahl 0-100%)", it: "📊 Calcolo dei Poteri (Punteggio 0-100%)", pt: "📊 Cálculo dos Poderes (Pontuação 0-100%)", nl: "📊 Krachtberekening (Score 0-100%)" },
    champion_calc: { fr: "Moyenne pondérée des 8 pouvoirs, ajustée par ton win rate", en: "Weighted average of all 8 powers, adjusted by your win rate", es: "Promedio ponderado de los 8 poderes, ajustado por tu tasa de victoria", de: "Gewichteter Durchschnitt aller 8 Kräfte, angepasst an deine Siegquote", it: "Media ponderata di tutti gli 8 poteri, adattata al tuo win rate", pt: "Média ponderada dos 8 poderes, ajustada pela sua taxa de vitória", nl: "Gewogen gemiddelde van alle 8 krachten, aangepast aan je win rate" },
    champion_winrate_info: { fr: "⚠️ Score multiplié par ton taux de victoire (×0.7 à ×1.0). Nécessite 6 pouvoirs sur 8 enclenchés.", en: "⚠️ Score multiplied by your win rate (×0.7 to ×1.0). Requires 6 out of 8 powers activated.", es: "⚠️ Puntuación multiplicada por tu tasa de victoria (×0.7 a ×1.0). Requiere 6 de 8 poderes activados.", de: "⚠️ Punktzahl multipliziert mit deiner Siegquote (×0.7 bis ×1.0). Erfordert 6 von 8 aktivierten Kräften.", it: "⚠️ Punteggio moltiplicato per il tuo win rate (×0.7 a ×1.0). Richiede 6 poteri su 8 attivati.", pt: "⚠️ Pontuação multiplicada pela sua taxa de vitória (×0.7 a ×1.0). Requer 6 de 8 poderes ativados.", nl: "⚠️ Score vermenigvuldigd met je win rate (×0.7 tot ×1.0). Vereist 6 van de 8 krachten geactiveerd." },
    doctor_calc_1: { fr: "60% : Taux de soins réussis sur astronautes", en: "60%: Successful heal rate on astronauts", es: "60%: Tasa de curación exitosa en astronautas", de: "60%: Erfolgreiche Heilungsrate bei Astronauten", it: "60%: Tasso di cure riuscite su astronauti", pt: "60%: Taxa de cura bem-sucedida em astronautas", nl: "60%: Succesvolle genezingsratio op astronauten" },
    doctor_calc_2: { fr: "40% : Potions mortelles utilisées sur saboteurs", en: "40%: Death potions used on saboteurs", es: "40%: Pociones mortales usadas en saboteadores", de: "40%: Todesränke auf Saboteure verwendet", it: "40%: Pozioni mortali usate su sabotatori", pt: "40%: Poções mortais usadas em sabotadores", nl: "40%: Doodsdrankjes gebruikt op saboteurs" },
    bluffer_calc: { fr: "Victoires en tant que saboteur sans recevoir aucun vote contre toi", en: "Wins as saboteur without receiving any votes against you", es: "Victorias como saboteador sin recibir ningún voto en tu contra", de: "Siege als Saboteur ohne Stimmen gegen dich", it: "Vittorie come sabotatore senza ricevere voti contro di te", pt: "Vitórias como sabotador sem receber votos contra você", nl: "Overwinningen als saboteur zonder stemmen tegen je" },
    resistant_calc: { fr: "Temps passé vivant / Temps total de tes parties", en: "Time spent alive / Total time of your games", es: "Tiempo vivo / Tiempo total de tus partidas", de: "Überlebenszeit / Gesamtzeit deiner Spiele", it: "Tempo passato vivo / Tempo totale delle tue partite", pt: "Tempo passado vivo / Tempo total das suas partidas", nl: "Tijd levend / Totale tijd van je spellen" },
    investigator_calc: { fr: "Votes corrects contre saboteurs vs votes erronés", en: "Correct votes against saboteurs vs wrong votes", es: "Votos correctos contra saboteadores vs votos erróneos", de: "Richtige Stimmen gegen Saboteure vs falsche Stimmen", it: "Voti corretti contro sabotatori vs voti errati", pt: "Votos corretos contra sabotadores vs votos errados", nl: "Correcte stemmen tegen saboteurs vs foute stemmen" },
    captain_calc: { fr: "Départages du maire tuant un saboteur + Transferts de capitaine vers un astronaute", en: "Mayor tiebreaks killing a saboteur + Captain transfers to an astronaut", es: "Desempates del alcalde matando a un saboteador + Transferencias de capitán a un astronauta", de: "Bürgermeister-Stichentscheide die Saboteur töten + Kapitän-Transfers an Astronaut", it: "Spareggi del sindaco che uccidono un sabotatore + Trasferimenti del capitano a un astronauta", pt: "Desempates do prefeito matando um sabotador + Transferências de capitão para um astronauta", nl: "Burgemeester stemmingen die saboteur doden + Kapitein transfers naar astronaut" },
    security_calc: { fr: "Vengeance efficace : tirs mortels sur saboteurs vs tirs amis", en: "Effective revenge: deadly shots on saboteurs vs friendly fire", es: "Venganza efectiva: disparos mortales a saboteadores vs fuego amigo", de: "Effektive Rache: tödliche Schüsse auf Saboteure vs Eigenbeschuss", it: "Vendetta efficace: colpi mortali su sabotatori vs fuoco amico", pt: "Vingança eficaz: tiros mortais em sabotadores vs fogo amigo", nl: "Effectieve wraak: dodelijke schoten op saboteurs vs friendly fire" },
    streak_calc: { fr: "Ta plus longue série de victoires consécutives", en: "Your longest consecutive win streak", es: "Tu racha más larga de victorias consecutivas", de: "Deine längste Serie aufeinanderfolgender Siege", it: "La tua serie più lunga di vittorie consecutive", pt: "Sua maior sequência de vitórias consecutivas", nl: "Je langste opeenvolgende winnende reeks" },
    exterminator_calc: { fr: "Potions mortelles utilisées sur astronautes (rôle saboteur uniquement)", en: "Death potions used on astronauts (saboteur role only)", es: "Pociones mortales usadas en astronautas (solo rol saboteador)", de: "Todesränke auf Astronauten verwendet (nur Saboteur-Rolle)", it: "Pozioni mortali usate su astronauti (solo ruolo sabotatore)", pt: "Poções mortais usadas em astronautas (apenas função sabotador)", nl: "Doodsdrankjes gebruikt op astronauten (alleen saboteur rol)" },
    ranking_info: { fr: "📈 Classement", en: "📈 Ranking", es: "📈 Clasificación", de: "📈 Rangliste", it: "📈 Classifica", pt: "📈 Classificação", nl: "📈 Ranglijst" },
    ranking_details: { fr: "Seuls les comptes vérifiés (email confirmé) sont pris en compte dans les classements. Le badge principal correspond au classement Champion (moyenne globale). Le numéro affiché (#12) est ton rang parmi tous les joueurs éligibles.", en: "Only verified accounts (confirmed email) are counted in rankings. The main badge corresponds to the Champion ranking (overall average). The number displayed (#12) is your rank among all eligible players.", es: "Solo las cuentas verificadas (email confirmado) cuentan en las clasificaciones. La insignia principal corresponde a la clasificación Campeón (promedio global). El número mostrado (#12) es tu rango entre todos los jugadores elegibles.", de: "Nur verifizierte Konten (bestätigte E-Mail) werden in Ranglisten gezählt. Das Hauptabzeichen entspricht der Champion-Rangliste (Gesamtdurchschnitt). Die angezeigte Nummer (#12) ist dein Rang unter allen berechtigten Spielern.", it: "Solo gli account verificati (email confermata) vengono conteggiati nelle classifiche. Il badge principale corrisponde alla classifica Campione (media globale). Il numero visualizzato (#12) è il tuo rango tra tutti i giocatori idonei.", pt: "Apenas contas verificadas (email confirmado) são contadas nas classificações. A insígnia principal corresponde à classificação Campeão (média geral). O número exibido (#12) é sua posição entre todos os jogadores elegíveis.", nl: "Alleen geverifieerde accounts (bevestigde e-mail) worden meegeteld in ranglijsten. De hoofdbadge komt overeen met de Kampioen-ranglijst (totaal gemiddelde). Het weergegeven nummer (#12) is je rang onder alle in aanmerking komende spelers." },
    minimum_games_title: { fr: "⚠️ Minimum requis", en: "⚠️ Minimum required", es: "⚠️ Mínimo requerido", de: "⚠️ Mindestanforderung", it: "⚠️ Minimo richiesto", pt: "⚠️ Mínimo necessário", nl: "⚠️ Minimum vereist" },
    minimum_games_text: { fr: "Pour apparaître dans les classements, tu dois avoir joué au moins 10 parties. Cela permet d'avoir des statistiques représentatives de ton niveau réel.", en: "To appear in the rankings, you must have played at least 10 games. This ensures statistics are representative of your actual level.", es: "Para aparecer en las clasificaciones, debes haber jugado al menos 10 partidas. Esto permite tener estadísticas representativas de tu nivel real.", de: "Um in den Ranglisten zu erscheinen, musst du mindestens 10 Spiele gespielt haben. Dies ermöglicht repräsentative Statistiken deines tatsächlichen Niveaus.", it: "Per apparire nelle classifiche, devi aver giocato almeno 10 partite. Questo permette di avere statistiche rappresentative del tuo livello reale.", pt: "Para aparecer nas classificações, você deve ter jogado pelo menos 10 partidas. Isso permite ter estatísticas representativas do seu nível real.", nl: "Om in de ranglijsten te verschijnen, moet je minstens 10 games hebben gespeeld. Dit zorgt voor representatieve statistieken van je werkelijke niveau." },
    coverage_title: { fr: "📊 Pondération (Coverage)", en: "📊 Weighting (Coverage)", es: "📊 Ponderación (Coverage)", de: "📊 Gewichtung (Coverage)", it: "📊 Ponderazione (Coverage)", pt: "📊 Ponderação (Coverage)", nl: "📊 Weging (Coverage)" },
    coverage_text: { fr: "Ton score est pondéré par le nombre d'actions réalisées (max 10). Exemple : 100% de précision avec 2 actions = 20% final. Avec 10+ actions = 100%.", en: "Your score is weighted by the number of actions performed (max 10). Example: 100% accuracy with 2 actions = 20% final. With 10+ actions = 100%.", es: "Tu puntuación se pondera por el número de acciones realizadas (máx 10). Ejemplo: 100% de precisión con 2 acciones = 20% final. Con 10+ acciones = 100%.", de: "Deine Punktzahl wird durch die Anzahl der durchgeführten Aktionen gewichtet (max 10). Beispiel: 100% Genauigkeit mit 2 Aktionen = 20% Endergebnis. Mit 10+ Aktionen = 100%.", it: "Il tuo punteggio è ponderato dal numero di azioni eseguite (max 10). Esempio: 100% di precisione con 2 azioni = 20% finale. Con 10+ azioni = 100%.", pt: "Sua pontuação é ponderada pelo número de ações realizadas (máx 10). Exemplo: 100% de precisão com 2 ações = 20% final. Com 10+ ações = 100%.", nl: "Je score wordt gewogen op basis van het aantal uitgevoerde acties (max 10). Voorbeeld: 100% nauwkeurigheid met 2 acties = 20% eindresultaat. Met 10+ acties = 100%." },
    // V42: Quick stats
    total_games: { fr: "Parties", en: "Games", es: "Partidas", de: "Spiele", it: "Partite", pt: "Partidas", nl: "Games" },
    wins: { fr: "Victoires", en: "Wins", es: "Victorias", de: "Siege", it: "Vittorie", pt: "Vitórias", nl: "Overwinningen" },
    win_rate: { fr: "Win Rate", en: "Win Rate", es: "% Victorias", de: "Siegquote", it: "Win Rate", pt: "Taxa Vitória", nl: "Win Rate" },
    astronaut_games: { fr: "Astronaute", en: "Astronaut", es: "Astronauta", de: "Astronaut", it: "Astronauta", pt: "Astronauta", nl: "Astronaut" },
    saboteur_games: { fr: "Saboteur", en: "Saboteur", es: "Saboteador", de: "Saboteur", it: "Sabotatore", pt: "Sabotador", nl: "Saboteur" },
    total_time: { fr: "Temps joué", en: "Time played", es: "Tiempo jugado", de: "Spielzeit", it: "Tempo giocato", pt: "Tempo jogado", nl: "Speeltijd" },
    // V42: Historique de partie
    no_game_history: { fr: "Aucun historique de partie disponible. Joue une partie pour voir tes stats ici !", en: "No game history available. Play a game to see your stats here!", es: "No hay historial de partidas. ¡Juega una partida para ver tus estadísticas aquí!", de: "Kein Spielverlauf verfügbar. Spiele ein Spiel, um deine Statistiken hier zu sehen!", it: "Nessuno storico partite disponibile. Gioca una partita per vedere le tue statistiche qui!", pt: "Nenhum histórico de partidas disponível. Jogue uma partida para ver suas estatísticas aqui!", nl: "Geen spelgeschiedenis beschikbaar. Speel een game om je statistieken hier te zien!" },
    last_game: { fr: "Dernière partie", en: "Last game", es: "Última partida", de: "Letztes Spiel", it: "Ultima partita", pt: "Última partida", nl: "Laatste game" },
    victory: { fr: "Victoire !", en: "Victory!", es: "¡Victoria!", de: "Sieg!", it: "Vittoria!", pt: "Vitória!", nl: "Overwinning!" },
    defeat: { fr: "Défaite", en: "Defeat", es: "Derrota", de: "Niederlage", it: "Sconfitta", pt: "Derrota", nl: "Nederlaag" },
    played_as: { fr: "Joué en tant que", en: "Played as", es: "Jugado como", de: "Gespielt als", it: "Giocato come", pt: "Jogou como", nl: "Gespeeld als" },
    duration: { fr: "Durée", en: "Duration", es: "Duración", de: "Dauer", it: "Durata", pt: "Duração", nl: "Duur" },
    players: { fr: "Joueurs", en: "Players", es: "Jugadores", de: "Spieler", it: "Giocatori", pt: "Jogadores", nl: "Spelers" },
    play_again: { fr: "🎮 Rejouer", en: "🎮 Play again", es: "🎮 Jugar de nuevo", de: "🎮 Nochmal spielen", it: "🎮 Gioca ancora", pt: "🎮 Jogar novamente", nl: "🎮 Opnieuw spelen" },
    
    // Index.html stats button
    my_stats_badges: { fr: "MES STATS & BADGES", en: "MY STATS & BADGES", es: "MIS STATS E INSIGNIAS", de: "MEINE STATS & ABZEICHEN", it: "LE MIE STATS & BADGE", pt: "MINHAS STATS & INSÍGNIAS", nl: "MIJN STATS & BADGES" },
    
    // Badge popup
    first_badge_obtained: { fr: "🎉 Premier Badge Obtenu !", en: "🎉 First Badge Obtained!", es: "🎉 ¡Primera Insignia Obtenida!", de: "🎉 Erstes Abzeichen erhalten!", it: "🎉 Primo Badge Ottenuto!", pt: "🎉 Primeira Insígnia Obtida!", nl: "🎉 Eerste Badge Verkregen!" },
    badge_promotion: { fr: "🚀 Promotion !", en: "🚀 Promotion!", es: "🚀 ¡Promoción!", de: "🚀 Beförderung!", it: "🚀 Promozione!", pt: "🚀 Promoção!", nl: "🚀 Promotie!" },
    badge_change: { fr: "📉 Changement de Badge", en: "📉 Badge Change", es: "📉 Cambio de Insignia", de: "📉 Abzeichen-Änderung", it: "📉 Cambio Badge", pt: "📉 Mudança de Insígnia", nl: "📉 Badge Wijziging" },
    see_stats: { fr: "Voir mes stats →", en: "See my stats →", es: "Ver mis estadísticas →", de: "Meine Stats sehen →", it: "Vedi le mie statistiche →", pt: "Ver minhas estatísticas →", nl: "Bekijk mijn stats →" }
  },

  // ============================================================================
  // MESSAGES D'ERREUR & SUCCÈS
  // ============================================================================
  messages: {
    login_success: { fr: "Connexion réussie !", en: "Login successful!", es: "¡Inicio de sesión exitoso!", de: "Anmeldung erfolgreich!", it: "Accesso riuscito!", pt: "Login bem-sucedido!", nl: "Inloggen succesvol!" },
    register_success: { fr: "Inscription réussie ! Vérifiez votre email.", en: "Registration successful! Check your email.", es: "¡Registro exitoso! Verifica tu correo.", de: "Registrierung erfolgreich! Überprüfen Sie Ihre E-Mail.", it: "Registrazione riuscita! Controlla la tua email.", pt: "Cadastro bem-sucedido! Verifique seu e-mail.", nl: "Registratie succesvol! Controleer je e-mail." },
    logout_success: { fr: "Déconnexion réussie", en: "Logout successful", es: "Cierre de sesión exitoso", de: "Abmeldung erfolgreich", it: "Disconnessione riuscita", pt: "Logout bem-sucedido", nl: "Uitloggen succesvol" },
    error_generic: { fr: "Une erreur est survenue", en: "An error occurred", es: "Ocurrió un error", de: "Ein Fehler ist aufgetreten", it: "Si è verificato un errore", pt: "Ocorreu um erro", nl: "Er is een fout opgetreden" },
    error_login: { fr: "Email ou mot de passe incorrect", en: "Incorrect email or password", es: "Correo o contraseña incorrectos", de: "Falsche E-Mail oder Passwort", it: "Email o password errati", pt: "E-mail ou senha incorretos", nl: "Onjuiste e-mail of wachtwoord" },
    error_email_exists: { fr: "Cet email est déjà utilisé", en: "This email is already in use", es: "Este correo ya está en uso", de: "Diese E-Mail wird bereits verwendet", it: "Questa email è già in uso", pt: "Este e-mail já está em uso", nl: "Dit e-mailadres is al in gebruik" },
    error_password_mismatch: { fr: "Les mots de passe ne correspondent pas", en: "Passwords do not match", es: "Las contraseñas no coinciden", de: "Passwörter stimmen nicht überein", it: "Le password non corrispondono", pt: "As senhas não coincidem", nl: "Wachtwoorden komen niet overeen" },
    error_network: { fr: "Erreur de connexion au serveur", en: "Server connection error", es: "Error de conexión al servidor", de: "Server-Verbindungsfehler", it: "Errore di connessione al server", pt: "Erro de conexão com o servidor", nl: "Server verbindingsfout" },
    promo_applied: { fr: "Code promo appliqué !", en: "Promo code applied!", es: "¡Código promocional aplicado!", de: "Promo-Code angewendet!", it: "Codice promozionale applicato!", pt: "Código promocional aplicado!", nl: "Promotiecode toegepast!" },
    promo_invalid: { fr: "Code promo invalide", en: "Invalid promo code", es: "Código promocional inválido", de: "Ungültiger Promo-Code", it: "Codice promozionale non valido", pt: "Código promocional inválido", nl: "Ongeldige promotiecode" }
  },

  // ============================================================================
  // PAGES LÉGALES
  // ============================================================================
  legal: {
    privacy_title: { fr: "Politique de Confidentialité", en: "Privacy Policy", es: "Política de Privacidad", de: "Datenschutzrichtlinie", it: "Informativa sulla Privacy", pt: "Política de Privacidade", nl: "Privacybeleid" },
    terms_title: { fr: "Conditions Générales d'Utilisation", en: "Terms of Service", es: "Términos de Servicio", de: "Nutzungsbedingungen", it: "Termini di Servizio", pt: "Termos de Serviço", nl: "Servicevoorwaarden" },
    legal_notice_title: { fr: "Mentions Légales", en: "Legal Notice", es: "Aviso Legal", de: "Impressum", it: "Note Legali", pt: "Aviso Legal", nl: "Juridische Kennisgeving" },
    last_updated: { fr: "Dernière mise à jour", en: "Last updated", es: "Última actualización", de: "Zuletzt aktualisiert", it: "Ultimo aggiornamento", pt: "Última atualização", nl: "Laatst bijgewerkt" }
  },

  // ============================================================================
  // PAGES PAIEMENT
  // ============================================================================
  payment: {
    success_title: { fr: "Paiement Réussi !", en: "Payment Successful!", es: "¡Pago Exitoso!", de: "Zahlung Erfolgreich!", it: "Pagamento Riuscito!", pt: "Pagamento Bem-sucedido!", nl: "Betaling Geslaagd!" },
    success_message: {
      fr: "Merci pour votre achat ! Votre compte a été mis à jour.",
      en: "Thank you for your purchase! Your account has been updated.",
      es: "¡Gracias por tu compra! Tu cuenta ha sido actualizada.",
      de: "Vielen Dank für Ihren Kauf! Ihr Konto wurde aktualisiert.",
      it: "Grazie per il tuo acquisto! Il tuo account è stato aggiornato.",
      pt: "Obrigado pela sua compra! Sua conta foi atualizada.",
      nl: "Bedankt voor je aankoop! Je account is bijgewerkt."
    },
    cancel_title: { fr: "Paiement Annulé", en: "Payment Cancelled", es: "Pago Cancelado", de: "Zahlung Abgebrochen", it: "Pagamento Annullato", pt: "Pagamento Cancelado", nl: "Betaling Geannuleerd" },
    cancel_message: {
      fr: "Votre paiement a été annulé. Aucun montant n'a été débité.",
      en: "Your payment has been cancelled. No amount has been charged.",
      es: "Tu pago ha sido cancelado. No se ha cobrado ningún monto.",
      de: "Ihre Zahlung wurde abgebrochen. Es wurde kein Betrag belastet.",
      it: "Il tuo pagamento è stato annullato. Nessun importo è stato addebitato.",
      pt: "Seu pagamento foi cancelado. Nenhum valor foi cobrado.",
      nl: "Je betaling is geannuleerd. Er is geen bedrag in rekening gebracht."
    },
    back_to_home: { fr: "Retour à l'accueil", en: "Back to home", es: "Volver al inicio", de: "Zurück zur Startseite", it: "Torna alla home", pt: "Voltar ao início", nl: "Terug naar home" },
    try_again: { fr: "Réessayer", en: "Try again", es: "Intentar de nuevo", de: "Erneut versuchen", it: "Riprova", pt: "Tentar novamente", nl: "Opnieuw proberen" }
  },

  // ============================================================================
  // EMAIL VERIFICATION & PASSWORD RESET
  // ============================================================================
  email_verification: {
    title: { fr: "Vérification de l'email", en: "Email Verification", es: "Verificación de correo", de: "E-Mail-Verifizierung", it: "Verifica email", pt: "Verificação de e-mail", nl: "E-mailverificatie" },
    verifying: { fr: "Vérification en cours...", en: "Verifying...", es: "Verificando...", de: "Verifizierung läuft...", it: "Verifica in corso...", pt: "Verificando...", nl: "Verifiëren..." },
    success: { fr: "Email vérifié avec succès !", en: "Email verified successfully!", es: "¡Correo verificado con éxito!", de: "E-Mail erfolgreich verifiziert!", it: "Email verificata con successo!", pt: "E-mail verificado com sucesso!", nl: "E-mail succesvol geverifieerd!" },
    error: { fr: "Le lien de vérification est invalide ou a expiré.", en: "The verification link is invalid or has expired.", es: "El enlace de verificación es inválido o ha expirado.", de: "Der Verifizierungslink ist ungültig oder abgelaufen.", it: "Il link di verifica non è valido o è scaduto.", pt: "O link de verificação é inválido ou expirou.", nl: "De verificatielink is ongeldig of verlopen." }
  },
  reset_password: {
    title: { fr: "Réinitialiser le mot de passe", en: "Reset password", es: "Restablecer contraseña", de: "Passwort zurücksetzen", it: "Reimposta password", pt: "Redefinir senha", nl: "Wachtwoord resetten" },
    new_password: { fr: "Nouveau mot de passe", en: "New password", es: "Nueva contraseña", de: "Neues Passwort", it: "Nuova password", pt: "Nova senha", nl: "Nieuw wachtwoord" },
    confirm_new_password: { fr: "Confirmer le nouveau mot de passe", en: "Confirm new password", es: "Confirmar nueva contraseña", de: "Neues Passwort bestätigen", it: "Conferma nuova password", pt: "Confirmar nova senha", nl: "Nieuw wachtwoord bevestigen" },
    submit: { fr: "Réinitialiser", en: "Reset", es: "Restablecer", de: "Zurücksetzen", it: "Reimposta", pt: "Redefinir", nl: "Resetten" },
    success: { fr: "Mot de passe réinitialisé avec succès !", en: "Password reset successfully!", es: "¡Contraseña restablecida con éxito!", de: "Passwort erfolgreich zurückgesetzt!", it: "Password reimpostata con successo!", pt: "Senha redefinida com sucesso!", nl: "Wachtwoord succesvol gereset!" }
  },
  forgot_password: {
    title: { fr: "Mot de passe oublié", en: "Forgot password", es: "Olvidé mi contraseña", de: "Passwort vergessen", it: "Password dimenticata", pt: "Esqueci a senha", nl: "Wachtwoord vergeten" },
    description: {
      fr: "Entrez votre email pour recevoir un lien de réinitialisation.",
      en: "Enter your email to receive a reset link.",
      es: "Ingresa tu correo para recibir un enlace de restablecimiento.",
      de: "Geben Sie Ihre E-Mail ein, um einen Reset-Link zu erhalten.",
      it: "Inserisci la tua email per ricevere un link di reimpostazione.",
      pt: "Digite seu e-mail para receber um link de redefinição.",
      nl: "Voer je e-mail in om een resetlink te ontvangen."
    },
    submit: { fr: "Envoyer le lien", en: "Send link", es: "Enviar enlace", de: "Link senden", it: "Invia link", pt: "Enviar link", nl: "Link verzenden" },
    back_to_login: { fr: "Retour à la connexion", en: "Back to login", es: "Volver al inicio de sesión", de: "Zurück zur Anmeldung", it: "Torna al login", pt: "Voltar ao login", nl: "Terug naar inloggen" }
  }
};

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Obtient la langue actuelle
 */
function getSiteLanguage() {
  // Vérifier saboteur_language (utilisé par translations.js sur index/game)
  const storedGame = localStorage.getItem('saboteur_language');
  if (storedGame && SITE_TRANSLATIONS._languages[storedGame]) return storedGame;
  // Fallback sur saboteur_lang (ancienne clé)
  const storedOld = localStorage.getItem('saboteur_lang');
  if (storedOld && SITE_TRANSLATIONS._languages[storedOld]) return storedOld;
  // Fallback sur site_language
  const stored = localStorage.getItem('site_language');
  if (stored && SITE_TRANSLATIONS._languages[stored]) return stored;
  // Détection navigateur
  const browserLang = navigator.language.split('-')[0];
  if (SITE_TRANSLATIONS._languages[browserLang]) return browserLang;
  return 'fr';
}

/**
 * Définit la langue du site
 */
function setSiteLanguage(lang) {
  if (SITE_TRANSLATIONS._languages[lang]) {
    localStorage.setItem('site_language', lang);
    localStorage.setItem('saboteur_language', lang); // Synchroniser avec translations.js
    localStorage.setItem('saboteur_lang', lang); // Ancienne clé (compatibilité)
    applySiteTranslations(lang);
    return true;
  }
  return false;
}

/**
 * Obtient une traduction par clé
 */
function getSiteText(key, lang) {
  lang = lang || getSiteLanguage();
  const keys = key.split('.');
  let result = SITE_TRANSLATIONS;
  for (const k of keys) {
    if (result && result[k]) result = result[k];
    else return key;
  }
  return (typeof result === 'object' && result[lang]) ? result[lang] : key;
}

/**
 * Applique les traductions à tous les éléments
 */
function applySiteTranslations(lang) {
  lang = lang || getSiteLanguage();
  document.documentElement.lang = lang;
  
  document.querySelectorAll('[data-i18n-site]').forEach(el => {
    const key = el.getAttribute('data-i18n-site');
    const text = getSiteText(key, lang);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = text;
    } else if (el.tagName === 'OPTION' && el.value === '') {
      el.textContent = text;
    } else {
      el.textContent = text;
    }
  });
  
  document.querySelectorAll('[data-i18n-site-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-site-html');
    el.innerHTML = getSiteText(key, lang);
  });
  
  const selector = document.getElementById('site-language-selector');
  if (selector) selector.value = lang;
  
  console.log('✅ Site translations applied:', lang);
}

/**
 * Crée le sélecteur de langue
 */
function createLanguageSelector() {
  const current = getSiteLanguage();
  let html = '<select id="site-language-selector" onchange="setSiteLanguage(this.value)" class="language-selector">';
  for (const [code, info] of Object.entries(SITE_TRANSLATIONS._languages)) {
    html += `<option value="${code}" ${code === current ? 'selected' : ''}>${info.flag} ${info.name}</option>`;
  }
  return html + '</select>';
}

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => applySiteTranslations());
} else {
  applySiteTranslations();
}

// ============================================================================
// ACCOUNT PAGE - ADDITIONAL TRANSLATIONS
// ============================================================================

// Ajouter ces clés dans la section account de SITE_TRANSLATIONS
SITE_TRANSLATIONS.account = {
  ...SITE_TRANSLATIONS.account,
  
  // Page
  page_title_h1: { fr: "⚔️ Mon Compte", en: "⚔️ My Account", es: "⚔️ Mi Cuenta", de: "⚔️ Mein Konto", it: "⚔️ Il Mio Account", pt: "⚔️ Minha Conta", nl: "⚔️ Mijn Account" },
  
  // Tabs
  tab_profile: { fr: "👤 Profil", en: "👤 Profile", es: "👤 Perfil", de: "👤 Profil", it: "👤 Profilo", pt: "👤 Perfil", nl: "👤 Profiel" },
  tab_avatars: { fr: "🎨 Avatars", en: "🎨 Avatars", es: "🎨 Avatares", de: "🎨 Avatare", it: "🎨 Avatar", pt: "🎨 Avatares", nl: "🎨 Avatars" },
  tab_subscriptions: { fr: "💎 Abonnements", en: "💎 Subscriptions", es: "💎 Suscripciones", de: "💎 Abonnements", it: "💎 Abbonamenti", pt: "💎 Assinaturas", nl: "💎 Abonnementen" },
  tab_credits: { fr: "📦 Crédits", en: "📦 Credits", es: "📦 Créditos", de: "📦 Credits", it: "📦 Crediti", pt: "📦 Créditos", nl: "📦 Credits" },
  tab_history: { fr: "📜 Historique", en: "📜 History", es: "📜 Historial", de: "📜 Verlauf", it: "📜 Cronologia", pt: "📜 Histórico", nl: "📜 Geschiedenis" },
  
  // Card titles
  personal_info: { fr: "👤 Informations personnelles", en: "👤 Personal Information", es: "👤 Información Personal", de: "👤 Persönliche Informationen", it: "👤 Informazioni Personali", pt: "👤 Informações Pessoais", nl: "👤 Persoonlijke Informatie" },
  change_password_title: { fr: "🔒 Changer le mot de passe", en: "🔒 Change Password", es: "🔒 Cambiar Contraseña", de: "🔒 Passwort ändern", it: "🔒 Cambia Password", pt: "🔒 Alterar Senha", nl: "🔒 Wachtwoord Wijzigen" },
  my_avatars_title: { fr: "🎨 Mes Avatars IA", en: "🎨 My AI Avatars", es: "🎨 Mis Avatares IA", de: "🎨 Meine KI-Avatare", it: "🎨 I Miei Avatar IA", pt: "🎨 Meus Avatares IA", nl: "🎨 Mijn AI Avatars" },
  manage_payments: { fr: "📋 Gérer mes paiements", en: "📋 Manage Payments", es: "📋 Gestionar Pagos", de: "📋 Zahlungen verwalten", it: "📋 Gestisci Pagamenti", pt: "📋 Gerenciar Pagamentos", nl: "📋 Betalingen Beheren" },
  pack_5050_title: { fr: "🎁 Pack 50+50", en: "🎁 Pack 50+50", es: "🎁 Pack 50+50", de: "🎁 Pack 50+50", it: "🎁 Pack 50+50", pt: "🎁 Pack 50+50", nl: "🎁 Pack 50+50" },
  purchase_history: { fr: "📜 Historique des achats", en: "📜 Purchase History", es: "📜 Historial de Compras", de: "📜 Kaufverlauf", it: "📜 Cronologia Acquisti", pt: "📜 Histórico de Compras", nl: "📜 Aankoopgeschiedenis" },
  
  // Form labels
  label_email: { fr: "Email", en: "Email", es: "Correo electrónico", de: "E-Mail", it: "Email", pt: "E-mail", nl: "E-mail" },
  label_username: { fr: "Pseudo", en: "Username", es: "Nombre de usuario", de: "Benutzername", it: "Nome utente", pt: "Nome de usuário", nl: "Gebruikersnaam" },
  label_account_type: { fr: "Type de compte", en: "Account Type", es: "Tipo de Cuenta", de: "Kontotyp", it: "Tipo di Account", pt: "Tipo de Conta", nl: "Accounttype" },
  label_current_password: { fr: "Mot de passe actuel", en: "Current Password", es: "Contraseña Actual", de: "Aktuelles Passwort", it: "Password Attuale", pt: "Senha Atual", nl: "Huidig Wachtwoord" },
  label_new_password: { fr: "Nouveau mot de passe", en: "New Password", es: "Nueva Contraseña", de: "Neues Passwort", it: "Nuova Password", pt: "Nova Senha", nl: "Nieuw Wachtwoord" },
  label_confirm_password: { fr: "Confirmer le nouveau mot de passe", en: "Confirm New Password", es: "Confirmar Nueva Contraseña", de: "Neues Passwort bestätigen", it: "Conferma Nuova Password", pt: "Confirmar Nova Senha", nl: "Nieuw Wachtwoord Bevestigen" },
  
  // Buttons
  btn_save: { fr: "💾 Sauvegarder", en: "💾 Save", es: "💾 Guardar", de: "💾 Speichern", it: "💾 Salva", pt: "💾 Salvar", nl: "💾 Opslaan" },
  btn_change_password: { fr: "🔐 Modifier le mot de passe", en: "🔐 Change Password", es: "🔐 Cambiar Contraseña", de: "🔐 Passwort ändern", it: "🔐 Cambia Password", pt: "🔐 Alterar Senha", nl: "🔐 Wachtwoord Wijzigen" },
  btn_subscribe: { fr: "S'abonner", en: "Subscribe", es: "Suscribirse", de: "Abonnieren", it: "Abbonati", pt: "Assinar", nl: "Abonneren" },
  btn_cancel: { fr: "❌ Résilier l'abonnement", en: "❌ Cancel Subscription", es: "❌ Cancelar Suscripción", de: "❌ Abonnement kündigen", it: "❌ Annulla Abbonamento", pt: "❌ Cancelar Assinatura", nl: "❌ Abonnement Opzeggen" },
  btn_billing_portal: { fr: "🔗 Accéder au portail de paiement", en: "🔗 Access Billing Portal", es: "🔗 Acceder al Portal de Pago", de: "🔗 Zum Zahlungsportal", it: "🔗 Accedi al Portale Pagamenti", pt: "🔗 Acessar Portal de Pagamento", nl: "🔗 Naar Betaalportaal" },
  btn_buy_pack: { fr: "🛒 Acheter le Pack", en: "🛒 Buy Pack", es: "🛒 Comprar Pack", de: "🛒 Pack kaufen", it: "🛒 Acquista Pack", pt: "🛒 Comprar Pack", nl: "🛒 Pack Kopen" },
  
  // Subscription names
  pack_premium: { fr: "Pack Premium", en: "Premium Pack", es: "Pack Premium", de: "Premium-Paket", it: "Pack Premium", pt: "Pack Premium", nl: "Premium Pack" },
  pack_family: { fr: "Pack Famille", en: "Family Pack", es: "Pack Familia", de: "Familienpaket", it: "Pack Famiglia", pt: "Pack Família", nl: "Familiepakket" },
  
  // Features
  feat_unlimited_video: { fr: "Vidéo illimitée", en: "Unlimited Video", es: "Video Ilimitado", de: "Unbegrenztes Video", it: "Video Illimitato", pt: "Vídeo Ilimitado", nl: "Onbeperkte Video" },
  feat_30_avatars: { fr: "30 avatars IA / mois", en: "30 AI avatars / month", es: "30 avatares IA / mes", de: "30 KI-Avatare / Monat", it: "30 avatar IA / mese", pt: "30 avatares IA / mês", nl: "30 AI avatars / maand" },
  feat_all_themes: { fr: "Tous les thèmes", en: "All themes", es: "Todos los temas", de: "Alle Themen", it: "Tutti i temi", pt: "Todos os temas", nl: "Alle thema's" },
  feat_premium_badge: { fr: "Badge Premium", en: "Premium Badge", es: "Insignia Premium", de: "Premium-Abzeichen", it: "Badge Premium", pt: "Distintivo Premium", nl: "Premium Badge" },
  feat_priority_support: { fr: "Support prioritaire", en: "Priority Support", es: "Soporte Prioritario", de: "Prioritäts-Support", it: "Supporto Prioritario", pt: "Suporte Prioritário", nl: "Prioriteitsondersteuning" },
  feat_8_accounts: { fr: "Jusqu'à 8 comptes", en: "Up to 8 accounts", es: "Hasta 8 cuentas", de: "Bis zu 8 Konten", it: "Fino a 8 account", pt: "Até 8 contas", nl: "Tot 8 accounts" },
  feat_video_all: { fr: "Vidéo illimitée pour tous", en: "Unlimited video for all", es: "Video ilimitado para todos", de: "Unbegrenztes Video für alle", it: "Video illimitato per tutti", pt: "Vídeo ilimitado para todos", nl: "Onbeperkte video voor iedereen" },
  feat_30_avatars_each: { fr: "30 avatars IA / mois chacun", en: "30 AI avatars / month each", es: "30 avatares IA / mes cada uno", de: "30 KI-Avatare / Monat pro Person", it: "30 avatar IA / mese ciascuno", pt: "30 avatares IA / mês cada", nl: "30 AI avatars / maand elk" },
  feat_member_management: { fr: "Gestion des membres", en: "Member Management", es: "Gestión de Miembros", de: "Mitgliederverwaltung", it: "Gestione Membri", pt: "Gestão de Membros", nl: "Ledenbeheer" },
  
  // Family code
  family_code_share: { fr: "Code famille à partager :", en: "Family code to share:", es: "Código familiar para compartir:", de: "Familiencode zum Teilen:", it: "Codice famiglia da condividere:", pt: "Código família para compartilhar:", nl: "Familiecode om te delen:" }
};

// ============================================================================
// LEGAL PAGES - COMPLETE TRANSLATIONS
// ============================================================================

SITE_TRANSLATIONS.legal_pages = {
  // Common
  back_to_home: {
    fr: "← Retour à l'accueil",
    en: "← Back to Home",
    es: "← Volver al Inicio",
    de: "← Zurück zur Startseite",
    it: "← Torna alla Home",
    pt: "← Voltar ao Início",
    nl: "← Terug naar Home"
  },
  last_updated: {
    fr: "Dernière mise à jour : Janvier 2025",
    en: "Last updated: January 2025",
    es: "Última actualización: Enero 2025",
    de: "Zuletzt aktualisiert: Januar 2025",
    it: "Ultimo aggiornamento: Gennaio 2025",
    pt: "Última atualização: Janeiro 2025",
    nl: "Laatst bijgewerkt: Januari 2025"
  },

  // PRIVACY POLICY
  privacy: {
    title: {
      fr: "🔒 Politique de Confidentialité",
      en: "🔒 Privacy Policy",
      es: "🔒 Política de Privacidad",
      de: "🔒 Datenschutzrichtlinie",
      it: "🔒 Informativa sulla Privacy",
      pt: "🔒 Política de Privacidade",
      nl: "🔒 Privacybeleid"
    },
    commitment_title: {
      fr: "🛡️ Notre engagement",
      en: "🛡️ Our Commitment",
      es: "🛡️ Nuestro Compromiso",
      de: "🛡️ Unsere Verpflichtung",
      it: "🛡️ Il Nostro Impegno",
      pt: "🛡️ Nosso Compromisso",
      nl: "🛡️ Onze Toezegging"
    },
    commitment_text: {
      fr: "Vos données ne sont jamais vendues, jamais partagées à des fins commerciales, jamais utilisées pour de la publicité ciblée.",
      en: "Your data is never sold, never shared for commercial purposes, never used for targeted advertising.",
      es: "Sus datos nunca se venden, nunca se comparten con fines comerciales, nunca se utilizan para publicidad dirigida.",
      de: "Ihre Daten werden niemals verkauft, niemals für kommerzielle Zwecke weitergegeben, niemals für gezielte Werbung verwendet.",
      it: "I tuoi dati non vengono mai venduti, mai condivisi per scopi commerciali, mai utilizzati per pubblicità mirata.",
      pt: "Seus dados nunca são vendidos, nunca compartilhados para fins comerciais, nunca usados para publicidade direcionada.",
      nl: "Uw gegevens worden nooit verkocht, nooit gedeeld voor commerciële doeleinden, nooit gebruikt voor gerichte advertenties."
    },
    section1_title: { fr: "1. Responsable du traitement", en: "1. Data Controller", es: "1. Responsable del Tratamiento", de: "1. Verantwortlicher", it: "1. Titolare del Trattamento", pt: "1. Responsável pelo Tratamento", nl: "1. Verwerkingsverantwoordelijke" },
    section1_text: { fr: "Le responsable du traitement des données personnelles est :", en: "The data controller is:", es: "El responsable del tratamiento de datos personales es:", de: "Der Verantwortliche für die Verarbeitung personenbezogener Daten ist:", it: "Il titolare del trattamento dei dati personali è:", pt: "O responsável pelo tratamento de dados pessoais é:", nl: "De verwerkingsverantwoordelijke is:" },
    section2_title: { fr: "2. Données collectées", en: "2. Data Collected", es: "2. Datos Recopilados", de: "2. Erfasste Daten", it: "2. Dati Raccolti", pt: "2. Dados Coletados", nl: "2. Verzamelde Gegevens" },
    section2_text: { fr: "Nous collectons uniquement les données strictement nécessaires au fonctionnement de nos services :", en: "We only collect data strictly necessary for the operation of our services:", es: "Recopilamos únicamente los datos estrictamente necesarios para el funcionamiento de nuestros servicios:", de: "Wir erfassen nur die für den Betrieb unserer Dienste unbedingt erforderlichen Daten:", it: "Raccogliamo solo i dati strettamente necessari per il funzionamento dei nostri servizi:", pt: "Coletamos apenas os dados estritamente necessários para o funcionamento dos nossos serviços:", nl: "We verzamelen alleen gegevens die strikt noodzakelijk zijn voor de werking van onze diensten:" },
    table_data: { fr: "Donnée", en: "Data", es: "Dato", de: "Daten", it: "Dato", pt: "Dado", nl: "Gegeven" },
    table_purpose: { fr: "Finalité", en: "Purpose", es: "Finalidad", de: "Zweck", it: "Finalità", pt: "Finalidade", nl: "Doel" },
    table_retention: { fr: "Conservation", en: "Retention", es: "Conservación", de: "Aufbewahrung", it: "Conservazione", pt: "Retenção", nl: "Bewaartermijn" },
    section3_title: { fr: "3. Base légale du traitement", en: "3. Legal Basis", es: "3. Base Legal", de: "3. Rechtsgrundlage", it: "3. Base Giuridica", pt: "3. Base Legal", nl: "3. Rechtsgrondslag" },
    section4_title: { fr: "4. Ce que nous ne faisons PAS", en: "4. What We Do NOT Do", es: "4. Lo que NO Hacemos", de: "4. Was wir NICHT tun", it: "4. Cosa NON Facciamo", pt: "4. O que NÃO Fazemos", nl: "4. Wat We NIET Doen" },
    section5_title: { fr: "5. Partage des données", en: "5. Data Sharing", es: "5. Compartir Datos", de: "5. Datenweitergabe", it: "5. Condivisione Dati", pt: "5. Compartilhamento de Dados", nl: "5. Gegevens Delen" },
    section6_title: { fr: "6. Sécurité des données", en: "6. Data Security", es: "6. Seguridad de Datos", de: "6. Datensicherheit", it: "6. Sicurezza dei Dati", pt: "6. Segurança de Dados", nl: "6. Gegevensbeveiliging" },
    section7_title: { fr: "7. Vos droits (RGPD)", en: "7. Your Rights (GDPR)", es: "7. Sus Derechos (RGPD)", de: "7. Ihre Rechte (DSGVO)", it: "7. I Tuoi Diritti (GDPR)", pt: "7. Seus Direitos (RGPD)", nl: "7. Uw Rechten (AVG)" },
    section8_title: { fr: "8. Cookies", en: "8. Cookies", es: "8. Cookies", de: "8. Cookies", it: "8. Cookie", pt: "8. Cookies", nl: "8. Cookies" },
    section9_title: { fr: "9. Conservation des données", en: "9. Data Retention", es: "9. Conservación de Datos", de: "9. Datenaufbewahrung", it: "9. Conservazione dei Dati", pt: "9. Retenção de Dados", nl: "9. Gegevensbewaring" },
    section10_title: { fr: "10. Transferts internationaux", en: "10. International Transfers", es: "10. Transferencias Internacionales", de: "10. Internationale Übermittlungen", it: "10. Trasferimenti Internazionali", pt: "10. Transferências Internacionais", nl: "10. Internationale Overdrachten" },
    section11_title: { fr: "11. Protection des mineurs", en: "11. Protection of Minors", es: "11. Protección de Menores", de: "11. Schutz von Minderjährigen", it: "11. Protezione dei Minori", pt: "11. Proteção de Menores", nl: "11. Bescherming van Minderjarigen" },
    section12_title: { fr: "12. Réclamation", en: "12. Complaints", es: "12. Reclamación", de: "12. Beschwerde", it: "12. Reclamo", pt: "12. Reclamação", nl: "12. Klachten" },
    section13_title: { fr: "13. Modifications", en: "13. Changes", es: "13. Modificaciones", de: "13. Änderungen", it: "13. Modifiche", pt: "13. Modificações", nl: "13. Wijzigingen" },
    section14_title: { fr: "14. Contact", en: "14. Contact", es: "14. Contacto", de: "14. Kontakt", it: "14. Contatto", pt: "14. Contato", nl: "14. Contact" }
  },

  // LEGAL NOTICE
  legal_notice: {
    title: {
      fr: "📋 Mentions Légales",
      en: "📋 Legal Notice",
      es: "📋 Aviso Legal",
      de: "📋 Impressum",
      it: "📋 Note Legali",
      pt: "📋 Aviso Legal",
      nl: "📋 Juridische Kennisgeving"
    },
    section1_title: { fr: "1. Éditeur du site", en: "1. Website Publisher", es: "1. Editor del Sitio", de: "1. Herausgeber", it: "1. Editore del Sito", pt: "1. Editor do Site", nl: "1. Website Uitgever" },
    section2_title: { fr: "2. Hébergeur", en: "2. Host", es: "2. Alojamiento", de: "2. Hosting", it: "2. Hosting", pt: "2. Hospedagem", nl: "2. Hosting" },
    section3_title: { fr: "3. Propriété intellectuelle", en: "3. Intellectual Property", es: "3. Propiedad Intelectual", de: "3. Geistiges Eigentum", it: "3. Proprietà Intellettuale", pt: "3. Propriedade Intelectual", nl: "3. Intellectueel Eigendom" },
    section4_title: { fr: "4. Responsabilité", en: "4. Liability", es: "4. Responsabilidad", de: "4. Haftung", it: "4. Responsabilità", pt: "4. Responsabilidade", nl: "4. Aansprakelijkheid" },
    section5_title: { fr: "5. Droit applicable", en: "5. Applicable Law", es: "5. Ley Aplicable", de: "5. Anwendbares Recht", it: "5. Legge Applicabile", pt: "5. Lei Aplicável", nl: "5. Toepasselijk Recht" },
    section6_title: { fr: "6. Contact", en: "6. Contact", es: "6. Contacto", de: "6. Kontakt", it: "6. Contatto", pt: "6. Contato", nl: "6. Contact" }
  },

  // TERMS OF SERVICE
  terms: {
    title: {
      fr: "📜 Conditions Générales d'Utilisation",
      en: "📜 Terms of Service",
      es: "📜 Términos de Servicio",
      de: "📜 Nutzungsbedingungen",
      it: "📜 Termini di Servizio",
      pt: "📜 Termos de Serviço",
      nl: "📜 Servicevoorwaarden"
    },
    section1_title: { fr: "1. Objet", en: "1. Purpose", es: "1. Objeto", de: "1. Gegenstand", it: "1. Oggetto", pt: "1. Objeto", nl: "1. Doel" },
    section2_title: { fr: "2. Accès aux services", en: "2. Access to Services", es: "2. Acceso a los Servicios", de: "2. Zugang zu den Diensten", it: "2. Accesso ai Servizi", pt: "2. Acesso aos Serviços", nl: "2. Toegang tot Diensten" },
    section3_title: { fr: "3. Inscription et compte", en: "3. Registration and Account", es: "3. Registro y Cuenta", de: "3. Registrierung und Konto", it: "3. Registrazione e Account", pt: "3. Registro e Conta", nl: "3. Registratie en Account" },
    section4_title: { fr: "4. Services gratuits", en: "4. Free Services", es: "4. Servicios Gratuitos", de: "4. Kostenlose Dienste", it: "4. Servizi Gratuiti", pt: "4. Serviços Gratuitos", nl: "4. Gratis Diensten" },
    section5_title: { fr: "5. Services payants", en: "5. Paid Services", es: "5. Servicios de Pago", de: "5. Kostenpflichtige Dienste", it: "5. Servizi a Pagamento", pt: "5. Serviços Pagos", nl: "5. Betaalde Diensten" },
    section6_title: { fr: "6. Règles de conduite", en: "6. Code of Conduct", es: "6. Reglas de Conducta", de: "6. Verhaltensregeln", it: "6. Regole di Condotta", pt: "6. Regras de Conduta", nl: "6. Gedragsregels" },
    section7_title: { fr: "7. Propriété intellectuelle", en: "7. Intellectual Property", es: "7. Propiedad Intelectual", de: "7. Geistiges Eigentum", it: "7. Proprietà Intellettuale", pt: "7. Propriedade Intelectual", nl: "7. Intellectueel Eigendom" },
    section8_title: { fr: "8. Limitation de responsabilité", en: "8. Limitation of Liability", es: "8. Limitación de Responsabilidad", de: "8. Haftungsbeschränkung", it: "8. Limitazione di Responsabilità", pt: "8. Limitação de Responsabilidade", nl: "8. Beperking van Aansprakelijkheid" },
    section9_title: { fr: "9. Suspension et résiliation", en: "9. Suspension and Termination", es: "9. Suspensión y Terminación", de: "9. Aussetzung und Kündigung", it: "9. Sospensione e Risoluzione", pt: "9. Suspensão e Rescisão", nl: "9. Schorsing en Beëindiging" },
    section10_title: { fr: "10. Modifications des CGU", en: "10. Changes to Terms", es: "10. Cambios en los Términos", de: "10. Änderungen der AGB", it: "10. Modifiche ai Termini", pt: "10. Alterações nos Termos", nl: "10. Wijzigingen in Voorwaarden" },
    section11_title: { fr: "11. Droit applicable", en: "11. Applicable Law", es: "11. Ley Aplicable", de: "11. Anwendbares Recht", it: "11. Legge Applicabile", pt: "11. Lei Aplicável", nl: "11. Toepasselijk Recht" },
    section12_title: { fr: "12. Contact", en: "12. Contact", es: "12. Contacto", de: "12. Kontakt", it: "12. Contatto", pt: "12. Contato", nl: "12. Contact" }
  }
};
