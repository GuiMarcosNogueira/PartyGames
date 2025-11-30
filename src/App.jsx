import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Users, Monitor, Smartphone, Globe, Gamepad2, Tag, ShoppingCart, Info, List, Grid, ExternalLink, Play, ChevronLeft, ChevronRight, X, Dices, RotateCw, Filter, Swords, Handshake, BrainCircuit, PartyPopper, UsersRound, Ghost, Hammer, Crown, DollarSign, Sun, Moon } from 'lucide-react';

// --- CONFIGURAÇÃO DE IMAGENS ---
let allGameImages = {};

// NO SEU SERVIDOR: Descomente para imagens reais
allGameImages = import.meta.glob('/src/assets/games/**/*.{png,jpg,jpeg,webp,gif}', {
  eager: true,
  import: 'default',
  query: '?url'
});

const getImagesForGame = (folderName, gameTitle) => {
  const images = Object.keys(allGameImages)
    .filter((path) => path.includes(`/${folderName}/`))
    .map((path) => allGameImages[path]);

  if (images.length > 0) return images;

  return [
    `https://placehold.co/1920x1080/2563eb/ffffff?text=${encodeURIComponent(gameTitle)}+Cover`,
    `https://placehold.co/1920x1080/1e40af/ffffff?text=${encodeURIComponent(gameTitle)}+Game`,
    `https://placehold.co/1920x1080/172554/ffffff?text=${encodeURIComponent(gameTitle)}+Win`
  ];
};

// --- HELPER FUNCTIONS ---
const parsePrice = (priceStr) => {
  if (!priceStr) return 999;
  const lower = priceStr.toLowerCase();
  if (lower.includes('grátis') || lower.includes('free')) return 0;
  const match = priceStr.match(/(\d+[.,]?\d*)/);
  if (match) return parseFloat(match[0].replace(',', '.'));
  return 999; 
};

const getMaxPlayers = (playerStr) => {
  if (typeof playerStr !== 'string') return 0;
  if (playerStr.toLowerCase().includes('ilimitado') || playerStr.toLowerCase().includes('mmo') || playerStr.toLowerCase().includes('massivo')) return 999;
  const numbers = playerStr.match(/(\d+)/g);
  if (!numbers) return 0;
  return Math.max(...numbers.map(Number));
};

const getStyleIcon = (style) => {
  switch(style) {
    case 'Competitivo': return <Swords size={14} className="text-red-500 dark:text-red-400" />;
    case 'Cooperativo': return <Handshake size={14} className="text-green-500 dark:text-green-400" />;
    case 'Dedução Social': return <BrainCircuit size={14} className="text-purple-500 dark:text-purple-400" />;
    case 'Casual': return <PartyPopper size={14} className="text-orange-500 dark:text-orange-400" />;
    case 'Times': return <UsersRound size={14} className="text-blue-500 dark:text-blue-400" />;
    case 'Terror': return <Ghost size={14} className="text-gray-700 dark:text-gray-300" />;
    case 'Survival': return <Hammer size={14} className="text-yellow-600 dark:text-yellow-400" />;
    case 'MMO': return <Crown size={14} className="text-amber-500 dark:text-amber-400" />;
    default: return <Tag size={14} className="text-gray-500 dark:text-gray-400" />;
  }
};

const gamesData = [
  // --- PARTY & CASUAL ---
  { id: 1, title: "Fall Guys", folder: "fall-guys", players: "Até 60", genre: "Battle Royale", style: "Competitivo", platforms: ["PC", "Console", "Switch"], price: "Grátis", description: "Gincanas caóticas com jujubas. Obrigatório para grupos grandes.", linkName: "Epic Games", url: "https://store.epicgames.com/pt-BR/p/fall-guys" },
  { id: 2, title: "Stumble Guys", folder: "stumble-guys", players: "Até 32", genre: "Battle Royale", style: "Competitivo", platforms: ["PC", "Mobile", "Console"], price: "Grátis", description: "Versão leve do Fall Guys.", linkName: "Steam", url: "https://store.steampowered.com/app/1677740/Stumble_Guys/" },
  { id: 3, title: "Pico Park", folder: "pico-park", players: "2-8", genre: "Puzzle", style: "Cooperativo", platforms: ["PC", "Switch"], price: "R$ 16,99", description: "Teste de amizade. Coordenação total ou caos.", linkName: "Steam", url: "https://store.steampowered.com/app/1509960/PICO_PARK/" },
  { id: 4, title: "Crab Game", folder: "crab-game", players: "Até 40", genre: "Survival", style: "Competitivo", platforms: ["PC"], price: "Grátis", description: "Inspirado em Round 6 com chat de voz.", linkName: "Steam", url: "https://store.steampowered.com/app/1782210/Crab_Game/" },
  { id: 30, title: "Gang Beasts", folder: "gang-beasts", players: "4-8", genre: "Luta / Physics", style: "Competitivo", platforms: ["PC", "Console"], price: "R$ 36,99", description: "Bonecos de gelatina brigando em cenários perigosos.", linkName: "Steam", url: "https://store.steampowered.com/app/285900/Gang_Beasts/" },
  { id: 31, title: "Human: Fall Flat", folder: "human-fall-flat", players: "Até 8", genre: "Puzzle / Physics", style: "Cooperativo", platforms: ["PC", "Console", "Mobile"], price: "R$ 37,99", description: "Resolva puzzles com física desengonçada.", linkName: "Steam", url: "https://store.steampowered.com/app/477160/Human_Fall_Flat/" },
  { id: 32, title: "Overcooked! 2", folder: "overcooked-2", players: "4", genre: "Simulador", style: "Cooperativo", platforms: ["PC", "Console"], price: "R$ 59,90", description: "Cozinhe sob pressão extrema sem incendiar a cozinha.", linkName: "Steam", url: "https://store.steampowered.com/app/728880/Overcooked_2/" },
  { id: 33, title: "Pummel Party", folder: "pummel-party", players: "4-8", genre: "Tabuleiro / Minigames", style: "Competitivo", platforms: ["PC", "Console"], price: "R$ 29,99", description: "Mario Party para adultos, com sangue e armas.", linkName: "Steam", url: "https://store.steampowered.com/app/880940/Pummel_Party/" },
  { id: 34, title: "Golf With Your Friends", folder: "golf-friends", players: "Até 12", genre: "Esporte", style: "Competitivo", platforms: ["PC", "Console"], price: "R$ 29,99", description: "Minigolfe rápido e furioso com os amigos.", linkName: "Steam", url: "https://store.steampowered.com/app/431240/Golf_With_Your_Friends/" },
  { id: 35, title: "Ultimate Chicken Horse", folder: "chicken-horse", players: "4", genre: "Plataforma", style: "Competitivo", platforms: ["PC", "Console"], price: "R$ 28,99", description: "Construa a fase para ferrar seus amigos, mas tente passar.", linkName: "Steam", url: "https://store.steampowered.com/app/386940/Ultimate_Chicken_Horse/" },
  { id: 36, title: "Uno", folder: "uno", players: "4", genre: "Cartas", style: "Competitivo", platforms: ["PC", "Console", "Mobile"], price: "R$ 29,99 / Grátis (Mob)", description: "O clássico destruidor de amizades.", linkName: "Ubisoft/Stores", url: "https://store.steampowered.com/app/470220/UNO/" },
  { id: 37, title: "Stick Fight: The Game", folder: "stick-fight", players: "2-4", genre: "Luta", style: "Competitivo", platforms: ["PC", "Mobile"], price: "R$ 10,89", description: "Luta de bonecos palito com física hilária.", linkName: "Steam", url: "https://store.steampowered.com/app/674940/Stick_Fight_The_Game/" },

  // --- DEDUÇÃO SOCIAL ---
  { id: 5, title: "Among Us", folder: "among-us", players: "4-15", genre: "Dedução", style: "Dedução Social", platforms: ["PC", "Mobile", "Console"], price: "R$ 16,99 / Grátis", description: "Descubra o impostor.", linkName: "Steam", url: "https://store.steampowered.com/app/945360/Among_Us/" },
  { id: 6, title: "Goose Goose Duck", folder: "goose-goose-duck", players: "16+", genre: "Dedução", style: "Dedução Social", platforms: ["PC", "Mobile"], price: "Grátis", description: "Among Us com patos e chat de voz.", linkName: "Steam", url: "https://store.steampowered.com/app/1568590/Goose_Goose_Duck/" },
  { id: 7, title: "Dale & Dawson", folder: "dale-dawson", players: "Até 21", genre: "Roleplay", style: "Dedução Social", platforms: ["PC"], price: "R$ 26,49", description: "Quem trabalha e quem finge no escritório?", linkName: "Steam", url: "https://store.steampowered.com/app/2920570/Dale__Dawson_Stationery_Supplies/" },
  { id: 8, title: "Lockdown Protocol", folder: "lockdown-protocol", players: "3-8", genre: "Sci-Fi", style: "Dedução Social", platforms: ["PC"], price: "R$ 32,99", description: "Mate os traidores antes que seja tarde.", linkName: "Steam", url: "https://store.steampowered.com/app/2780980/LOCKDOWN_Protocol/" },
  { id: 9, title: "Town of Salem 2", folder: "town-of-salem-2", players: "Até 15", genre: "Estratégia", style: "Dedução Social", platforms: ["PC"], price: "Grátis", description: "Enforque os culpados na vila.", linkName: "Steam", url: "https://store.steampowered.com/app/2140510/Town_of_Salem_2/" },
  { id: 27, title: "Feign", folder: "feign", players: "4-12", genre: "Estratégia", style: "Dedução Social", platforms: ["PC", "Mobile"], price: "R$ 16,99", description: "Dedução onde você pode estar louco.", linkName: "Steam", url: "https://store.steampowered.com/app/1436990/Feign/" },
  { id: 38, title: "Deceit 2", folder: "deceit-2", players: "6-9", genre: "Terror", style: "Dedução Social", platforms: ["PC", "Console"], price: "Grátis", description: "Terror social com infectados entre os inocentes.", linkName: "Steam", url: "https://store.steampowered.com/app/2064870/Deceit_2/" },
  { id: 39, title: "Secret Neighbor", folder: "secret-neighbor", players: "6", genre: "Terror", style: "Dedução Social", platforms: ["PC", "Console", "Mobile"], price: "R$ 39,99", description: "Crianças invadem a casa, mas uma é o vizinho disfarçado.", linkName: "Steam", url: "https://store.steampowered.com/app/859570/Secret_Neighbor/" },
  { id: 25, title: "Unfortunate Spacemen", folder: "unfortunate-spacemen", players: "Até 16", genre: "FPS / Terror", style: "Dedução Social", platforms: ["PC"], price: "Grátis", description: "Mistura de Among Us com tiroteio e monstros.", linkName: "Steam", url: "https://store.steampowered.com/app/408900/Unfortunate_Spacemen/" },

  // --- SOBREVIVÊNCIA & SANDBOX ---
  { id: 10, title: "Minecraft", folder: "minecraft", players: "Ilimitado", genre: "Sandbox", style: "Survival", platforms: ["Todas"], price: "R$ 99,00", description: "Construa e sobreviva.", linkName: "Site Oficial", url: "https://www.minecraft.net/" },
  { id: 13, title: "Valheim", folder: "valheim", players: "1-10", genre: "Sobrevivência", style: "Survival", platforms: ["PC", "Xbox"], price: "R$ 37,99", description: "Vikings no purgatório.", linkName: "Steam", url: "https://store.steampowered.com/app/892970/Valheim/" },
  { id: 14, title: "Don't Starve Together", folder: "dont-starve", players: "1-6+", genre: "Sobrevivência", style: "Survival", platforms: ["PC", "Console"], price: "R$ 27,99", description: "Não morra de fome.", linkName: "Steam", url: "https://store.steampowered.com/app/322330/Dont_Starve_Together/" },
  { id: 15, title: "Project Zomboid", folder: "project-zomboid", players: "Até 32+", genre: "Sobrevivência", style: "Survival", platforms: ["PC"], price: "R$ 59,99", description: "Hardcore Zombie Survival.", linkName: "Steam", url: "https://store.steampowered.com/app/108600/Project_Zomboid/" },
  { id: 28, title: "Barotrauma", folder: "barotrauma", players: "Até 16", genre: "Simulador", style: "Cooperativo", platforms: ["PC"], price: "R$ 99,99", description: "Submarino no espaço.", linkName: "Steam", url: "https://store.steampowered.com/app/602960/Barotrauma/" },
  { id: 40, title: "Terraria", folder: "terraria", players: "Até 8", genre: "Sandbox", style: "Survival", platforms: ["PC", "Console", "Mobile"], price: "R$ 19,99", description: "Minecraft 2D com muito mais chefes e itens.", linkName: "Steam", url: "https://store.steampowered.com/app/105600/Terraria/" },
  { id: 41, title: "Rust", folder: "rust", players: "Ilimitado", genre: "Sobrevivência", style: "Competitivo", platforms: ["PC", "Console"], price: "R$ 103,49", description: "Sobrevivência brutal PvP. Construa bases e ataque.", linkName: "Steam", url: "https://store.steampowered.com/app/252490/Rust/" },
  { id: 42, title: "Raft", folder: "raft", players: "4-8", genre: "Sobrevivência", style: "Cooperativo", platforms: ["PC"], price: "R$ 36,99", description: "Sobreviva em uma jangada no meio do oceano.", linkName: "Steam", url: "https://store.steampowered.com/app/648800/Raft/" },
  { id: 43, title: "The Forest", folder: "the-forest", players: "4-8", genre: "Terror", style: "Survival", platforms: ["PC", "Console"], price: "R$ 37,99", description: "Sobreviva a canibais na floresta.", linkName: "Steam", url: "https://store.steampowered.com/app/242760/The_Forest/" },
  { id: 44, title: "Palworld", folder: "palworld", players: "4-32", genre: "Sobrevivência", style: "Survival", platforms: ["PC", "Xbox"], price: "R$ 88,99", description: "Pokémons com armas e construção de base.", linkName: "Steam", url: "https://store.steampowered.com/app/1623730/Palworld/" },
  { id: 45, title: "7 Days to Die", folder: "7-days", players: "Ilimitado", genre: "Sobrevivência", style: "Survival", platforms: ["PC", "Console"], price: "R$ 44,99", description: "Sobreviva a hordas de zumbis a cada 7 dias.", linkName: "Steam", url: "https://store.steampowered.com/app/251570/7_Days_to_Die/" },
  { id: 46, title: "LEGO Fortnite", folder: "lego-fortnite", players: "Até 8", genre: "Sandbox", style: "Survival", platforms: ["PC", "Console"], price: "Grátis", description: "Minecraft dentro do Fortnite. Muito polido.", linkName: "Epic Games", url: "https://www.fortnite.com/" },
  { id: 26, title: "Unturned", folder: "unturned", players: "Até 24+", genre: "FPS", style: "Survival", platforms: ["PC"], price: "Grátis", description: "Sobrevivência zumbi com visual simples (blocos).", linkName: "Steam", url: "https://store.steampowered.com/app/304930/Unturned/" },

  // --- TERROR COOPERATIVO ---
  { id: 11, title: "Lethal Company", folder: "lethal-company", players: "4+", genre: "Terror", style: "Cooperativo", platforms: ["PC"], price: "R$ 32,99", description: "Colete sucata e morra rindo.", linkName: "Steam", url: "https://store.steampowered.com/app/1966720/Lethal_Company/" },
  { id: 12, title: "Content Warning", folder: "content-warning", players: "4+", genre: "Terror", style: "Cooperativo", platforms: ["PC"], price: "R$ 26,49", description: "Filme monstros para viralizar.", linkName: "Steam", url: "https://store.steampowered.com/app/2881650/Content_Warning/" },
  { id: 47, title: "Phasmophobia", folder: "phasmophobia", players: "4", genre: "Terror", style: "Cooperativo", platforms: ["PC", "Console"], price: "R$ 27,89", description: "Investigação paranormal. Fale com os fantasmas.", linkName: "Steam", url: "https://store.steampowered.com/app/739630/Phasmophobia/" },
  { id: 48, title: "Dead by Daylight", folder: "dbd", players: "5 (4vs1)", genre: "Terror", style: "Competitivo", platforms: ["PC", "Console", "Mobile"], price: "R$ 49,99", description: "4 Sobreviventes tentam fugir de 1 Assassino.", linkName: "Steam", url: "https://store.steampowered.com/app/381210/Dead_by_Daylight/" },

  // --- SHOOTERS & AÇÃO (FPS/TPS) ---
  { id: 22, title: "Team Fortress 2", folder: "tf2", players: "Até 32", genre: "FPS", style: "Times", platforms: ["PC"], price: "Grátis", description: "O pai dos hero shooters.", linkName: "Steam", url: "https://store.steampowered.com/app/440/Team_Fortress_2/" },
  { id: 23, title: "Sven Co-op", folder: "sven-coop", players: "Até 32", genre: "FPS", style: "Cooperativo", platforms: ["PC"], price: "Grátis", description: "Half-Life cooperativo.", linkName: "Steam", url: "https://store.steampowered.com/app/225840/Sven_Coop/" },
  { id: 24, title: "Halo Infinite", folder: "halo-infinite", players: "Até 28", genre: "FPS", style: "Times", platforms: ["PC", "Xbox"], price: "Grátis", description: "Multiplayer gratuito de arena.", linkName: "Steam", url: "https://store.steampowered.com/app/1240440/Halo_Infinite/" },
  { id: 49, title: "Counter-Strike 2", folder: "cs2", players: "10 (5v5)", genre: "FPS", style: "Times", platforms: ["PC"], price: "Grátis", description: "O FPS tático mais jogado do mundo.", linkName: "Steam", url: "https://store.steampowered.com/app/730/CounterStrike_2/" },
  { id: 50, title: "Valorant", folder: "valorant", players: "10 (5v5)", genre: "FPS", style: "Times", platforms: ["PC", "Console"], price: "Grátis", description: "Tático com poderes.", linkName: "Riot Games", url: "https://playvalorant.com/" },
  { id: 51, title: "Overwatch 2", folder: "overwatch-2", players: "10 (5v5)", genre: "FPS", style: "Times", platforms: ["PC", "Console"], price: "Grátis", description: "Heróis batalhando em objetivos.", linkName: "Steam", url: "https://store.steampowered.com/app/2357570/Overwatch_2/" },
  { id: 52, title: "Left 4 Dead 2", folder: "l4d2", players: "4-8", genre: "FPS", style: "Cooperativo", platforms: ["PC", "Xbox"], price: "R$ 32,99", description: "O rei dos shooters de zumbi.", linkName: "Steam", url: "https://store.steampowered.com/app/550/Left_4_Dead_2/" },
  { id: 53, title: "Deep Rock Galactic", folder: "deep-rock", players: "4", genre: "FPS", style: "Cooperativo", platforms: ["PC", "Console"], price: "R$ 57,99", description: "Anões espaciais, mineração e muitos insetos. Rock & Stone!", linkName: "Steam", url: "https://store.steampowered.com/app/548430/Deep_Rock_Galactic/" },
  { id: 54, title: "Payday 2", folder: "payday-2", players: "4", genre: "FPS", style: "Cooperativo", platforms: ["PC", "Console"], price: "R$ 23,99", description: "Assalte bancos com os amigos.", linkName: "Steam", url: "https://store.steampowered.com/app/218620/PAYDAY_2/" },
  { id: 55, title: "Helldivers 2", folder: "helldivers-2", players: "4", genre: "TPS", style: "Cooperativo", platforms: ["PC", "PS5"], price: "R$ 199,00", description: "Espalhe a democracia pela galáxia explodindo tudo.", linkName: "Steam", url: "https://store.steampowered.com/app/553850/HELLDIVERS_2/" },
  { id: 56, title: "Apex Legends", folder: "apex", players: "60 (3-man)", genre: "Battle Royale", style: "Times", platforms: ["PC", "Console"], price: "Grátis", description: "Battle Royale rápido e fluido.", linkName: "Steam", url: "https://store.steampowered.com/app/1172470/Apex_Legends/" },
  { id: 57, title: "Fortnite", folder: "fortnite", players: "100", genre: "Battle Royale", style: "Competitivo", platforms: ["Todas"], price: "Grátis", description: "Construção, tiro e shows ao vivo.", linkName: "Epic Games", url: "https://www.fortnite.com/" },
  
  // --- MMORPGs ---
  { id: 66, title: "World of Warcraft", folder: "wow", players: "Massivo", genre: "MMORPG", style: "MMO", platforms: ["PC"], price: "Pago (Sub)", description: "O maior MMORPG de todos. Dungeons e Raids épicas.", linkName: "Battle.net", url: "https://worldofwarcraft.blizzard.com/" },
  { id: 67, title: "Final Fantasy XIV", folder: "ffxiv", players: "Massivo", genre: "MMORPG", style: "MMO", platforms: ["PC", "Console"], price: "Pago (Sub)", description: "História incrível e comunidade acolhedora. Tem trial grátis.", linkName: "Site Oficial", url: "https://freetrial.finalfantasyxiv.com/" },
  { id: 68, title: "Elder Scrolls Online", folder: "eso", players: "Massivo", genre: "MMORPG", style: "MMO", platforms: ["PC", "Console"], price: "Pago", description: "O mundo de Skyrim e Oblivion online com amigos.", linkName: "Steam", url: "https://store.steampowered.com/app/306130/The_Elder_Scrolls_Online/" },
  { id: 69, title: "Guild Wars 2", folder: "gw2", players: "Massivo", genre: "MMORPG", style: "MMO", platforms: ["PC"], price: "Grátis (Base)", description: "Mundo dinâmico e combate fluido sem mensalidade.", linkName: "Site Oficial", url: "https://www.guildwars2.com/" },
  { id: 70, title: "Albion Online", folder: "albion", players: "Massivo", genre: "MMORPG", style: "MMO", platforms: ["PC", "Mobile"], price: "Grátis", description: "Você é o que você veste. Full loot PvP e economia player-driven.", linkName: "Steam", url: "https://store.steampowered.com/app/761890/Albion_Online/" },
  { id: 71, title: "Lost Ark", folder: "lost-ark", players: "Massivo", genre: "MMORPG", style: "MMO", platforms: ["PC"], price: "Grátis", description: "Visão isométrica (Diablo) com raids insanas.", linkName: "Steam", url: "https://store.steampowered.com/app/1599340/Lost_Ark/" },

  // --- ESTRATÉGIA, MOBA & OUTROS ---
  { id: 58, title: "League of Legends", folder: "lol", players: "10 (5v5)", genre: "MOBA", style: "Times", platforms: ["PC", "Mac"], price: "Grátis", description: "O MOBA mais popular.", linkName: "Riot Games", url: "https://www.leagueoflegends.com/" },
  { id: 59, title: "Dota 2", folder: "dota-2", players: "10 (5v5)", genre: "MOBA", style: "Times", platforms: ["PC"], price: "Grátis", description: "Complexo, profundo e gratuito.", linkName: "Steam", url: "https://store.steampowered.com/app/570/Dota_2/" },
  { id: 60, title: "Rocket League", folder: "rocket-league", players: "4-8", genre: "Esporte", style: "Times", platforms: ["PC", "Console"], price: "Grátis", description: "Futebol com carros. Simples e genial.", linkName: "Epic Games", url: "https://www.rocketleague.com/" },
  { id: 61, title: "Brawlhalla", folder: "brawlhalla", players: "Até 8", genre: "Luta", style: "Competitivo", platforms: ["PC", "Console", "Mobile"], price: "Grátis", description: "Estilo Smash Bros, mas grátis e leve.", linkName: "Steam", url: "https://store.steampowered.com/app/291550/Brawlhalla/" },
  { id: 62, title: "Sid Meier's Civ VI", folder: "civ-6", players: "Até 12", genre: "Estratégia", style: "Competitivo", platforms: ["PC", "Console", "Mobile"], price: "R$ 129,00", description: "Apenas mais um turno... até as 4 da manhã.", linkName: "Steam", url: "https://store.steampowered.com/app/289070/Sid_Meiers_Civilization_VI/" },

  // --- NAVEGADOR & MOBILE ---
  { id: 16, title: "Gartic Phone", folder: "gartic-phone", players: "Até 30", genre: "Casual", style: "Casual", platforms: ["Web"], price: "Grátis", description: "Telefone sem fio desenhado.", linkName: "Jogar Agora", url: "https://garticphone.com" },
  { id: 17, title: "JKLM.fun", folder: "jklm", players: "16+", genre: "Casual", style: "Casual", platforms: ["Web"], price: "Grátis", description: "Jogo da bomba de palavras.", linkName: "Jogar Agora", url: "https://jklm.fun" },
  { id: 18, title: "Make It Meme", folder: "make-it-meme", players: "Até 15", genre: "Casual", style: "Casual", platforms: ["Web"], price: "Grátis", description: "Crie legendas engraçadas para memes e vote nos amigos.", linkName: "Jogar Agora", url: "https://makeitmeme.com" },
  { id: 19, title: "Board Game Arena", folder: "board-game-arena", players: "Varia", genre: "Casual", style: "Casual", platforms: ["Web"], price: "Grátis", description: "Centenas de jogos de tabuleiro (Uno, Saboteur) no navegador.", linkName: "Acessar Site", url: "https://boardgamearena.com" },
  { id: 20, title: "StopotS", folder: "stopots", players: "Ilimitado", genre: "Casual", style: "Casual", platforms: ["Web", "Mobile"], price: "Grátis", description: "Adedonha online.", linkName: "Jogar Agora", url: "https://stopots.com.br" },
  { id: 21, title: "Codenames Online", folder: "codenames", players: "Ilimitado", genre: "Casual", style: "Times", platforms: ["Web"], price: "Grátis", description: "Jogo de espiões e dicas de palavras em times.", linkName: "Jogar Agora", url: "https://codenames.game" },
  { id: 63, title: "Free Fire", folder: "free-fire", players: "50", genre: "Battle Royale", style: "Competitivo", platforms: ["Mobile"], price: "Grátis", description: "Battle Royale leve e popular.", linkName: "Google Play", url: "https://ff.garena.com/" },
  { id: 64, title: "Brawl Stars", folder: "brawl-stars", players: "6 (3v3)", genre: "Ação", style: "Times", platforms: ["Mobile"], price: "Grátis", description: "Tiroteio rápido e divertido.", linkName: "App Store", url: "https://supercell.com/en/games/brawlstars/" },
  { id: 65, title: "Ludo King", folder: "ludo", players: "4-6", genre: "Tabuleiro", style: "Casual", platforms: ["Mobile", "Web"], price: "Grátis", description: "O clássico Ludo.", linkName: "Google Play", url: "https://ludoking.com/" }
];

const RouletteWheel = ({ items, onSpinEnd }) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

  const startSpin = () => {
    if (spinning) return;
    setSpinning(true);
    const newWinnerIndex = Math.floor(Math.random() * items.length);
    const sliceAngle = 360 / items.length;
    const spinAmount = 1800 + (360 - (newWinnerIndex * sliceAngle)) - (sliceAngle / 2); 
    setRotation(rotation + spinAmount);
    setTimeout(() => { setSpinning(false); onSpinEnd(items[newWinnerIndex]); }, 4000);
  };

  const getCoordinatesForPercent = (percent, radius = 1) => {
    const x = radius * Math.cos(2 * Math.PI * percent);
    const y = radius * Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-80 h-80 md:w-96 md:h-96 mb-8">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20 drop-shadow-xl"><div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-red-600"></div></div>
        <div className="w-full h-full rounded-full border-4 border-white dark:border-zinc-800 shadow-2xl overflow-hidden transition-transform duration-[4000ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]" style={{ transform: `rotate(${rotation}deg)` }}>
          <svg viewBox="-1 -1 2 2" className="w-full h-full transform -rotate-90">
            <defs><clipPath id="circleClip"><circle cx="0" cy="0" r="0.18" /></clipPath></defs>
            {items.map((item, index) => {
              const sliceAngle = 1 / items.length;
              const startAngle = index * sliceAngle;
              const endAngle = startAngle + sliceAngle;
              const midAngle = startAngle + sliceAngle / 2;
              const [startX, startY] = getCoordinatesForPercent(startAngle);
              const [endX, endY] = getCoordinatesForPercent(endAngle);
              const largeArcFlag = sliceAngle > 0.5 ? 1 : 0;
              const pathData = `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;
              const [imgX, imgY] = getCoordinatesForPercent(midAngle, 0.65);
              const imgRotation = (midAngle * 360) + 90;
              const gameImg = getImagesForGame(item.folder, item.title)[0];
              return (
                <g key={item.id}>
                  <path d={pathData} fill={colors[index % colors.length]} stroke="white" strokeWidth="0.01" />
                  <g transform={`translate(${imgX}, ${imgY}) rotate(${imgRotation})`}>
                    <circle cx="0" cy="0" r="0.20" fill="white" />
                    <image href={gameImg} x="-0.18" y="-0.18" width="0.36" height="0.36" preserveAspectRatio="xMidYMid slice" clipPath="url(#circleClip)"/>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      <button onClick={startSpin} disabled={spinning} className={`px-8 py-3 rounded-full font-black text-white text-lg shadow-lg transform transition-all ${spinning ? 'bg-zinc-400 cursor-not-allowed scale-95' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 active:scale-95'}`}>{spinning ? 'GIRANDO...' : 'GIRAR ROLETA!'}</button>
    </div>
  );
};

const RaffleModal = ({ isOpen, onClose, allGames }) => {
  const [step, setStep] = useState('filters'); 
  const [filteredList, setFilteredList] = useState([]);
  const [winnerGame, setWinnerGame] = useState(null);
  const [filters, setFilters] = useState({ platform: [], price: 'Todos', style: [], playerCount: 'Qualquer' });
  const [maxPrice, setMaxPrice] = useState(300);

  const toggleSelection = (list, setList, value) => {
    if (list.includes(value)) setList(list.filter(item => item !== value));
    else setList([...list, value]);
  };

  const applyFilters = () => {
    const result = allGames.filter(game => {
      const matchPlat = filters.platform.length === 0 || filters.platform.some(p => game.platforms.includes(p) || (p === 'Web' && game.platforms.includes('Web')) || (p === 'PC' && game.platforms.includes('PC')) || (p === 'Mobile' && game.platforms.includes('Mobile')) || (p === 'Console' && (game.platforms.includes('Console') || game.platforms.includes('Xbox') || game.platforms.includes('Switch'))));
      const matchPrice = filters.price === 'Todos' || (filters.price === 'Grátis' && game.price.includes('Grátis')) || (filters.price === 'Pago' && !game.price.includes('Grátis'));
      const matchStyle = filters.style.length === 0 || filters.style.includes(game.style);
      let matchPlayers = true;
      const maxP = getMaxPlayers(game.players);
      if (filters.playerCount === 'Pequeno') matchPlayers = maxP <= 8;
      if (filters.playerCount === 'Médio') matchPlayers = maxP >= 8 && maxP <= 16;
      if (filters.playerCount === 'Grande') matchPlayers = maxP > 16;
      
      // CORREÇÃO: Aceita 999 (jogos caros/assinatura) quando o slider é 300 (Ilimitado)
      const priceVal = parsePrice(game.price);
      const matchSlider = maxPrice >= 300 ? true : (maxPrice === 0 ? priceVal === 0 : priceVal <= maxPrice);

      return matchPlat && matchPrice && matchStyle && matchPlayers && matchSlider;
    });
    setFilteredList(result);
    setStep('roulette');
  };

  const resetRaffle = () => { setStep('filters'); setWinnerGame(null); };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto border border-zinc-200 dark:border-zinc-800">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10"><X size={24} /></button>
        {step === 'filters' && (
          <div className="p-8">
            <h2 className="text-2xl font-black text-blue-700 dark:text-blue-400 flex items-center gap-2 mb-6"><Dices size={28} /> Configurar Sorteio</h2>
            <div className="space-y-6">
              <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Estilos (Vazio = Todos)</label><div className="flex flex-wrap gap-2">{['Competitivo', 'Cooperativo', 'Times', 'Dedução Social', 'Casual', 'Terror', 'Survival', 'MMO'].map(opt => (<button key={opt} onClick={() => toggleSelection(filters.style, (v) => setFilters({...filters, style: v}), opt)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${filters.style.includes(opt) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700'}`}>{opt}</button>))}</div></div>
              <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tamanho do Grupo</label><div className="flex flex-wrap gap-2">{[{l:'Qualquer',v:'Qualquer'},{l:'Pequeno (até 8)',v:'Pequeno'},{l:'Médio (8-16)',v:'Médio'},{l:'Grande (17+)',v:'Grande'}].map(opt => (<button key={opt.v} onClick={() => setFilters({...filters, playerCount: opt.v})} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${filters.playerCount === opt.v ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700'}`}>{opt.l}</button>))}</div></div>
              <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Plataformas</label><div className="flex flex-wrap gap-2">{['PC', 'Web', 'Mobile', 'Console'].map(p => (<button key={p} onClick={() => toggleSelection(filters.platform, (v) => setFilters({...filters, platform: v}), p)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${filters.platform.includes(p) ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700'}`}>{p}</button>))}</div></div>
              {/* SLIDER DE PREÇO NO MODAL */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Preço Máximo</label>
                  <span className="text-sm font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                    {maxPrice === 0 ? "Apenas Grátis" : maxPrice >= 300 ? "Qualquer Valor" : `Até R$ ${maxPrice},00`}
                  </span>
                </div>
                <input type="range" min="0" max="300" step="10" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              </div>
            </div>
            <button onClick={applyFilters} className="w-full mt-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg transition-colors shadow-lg">Continuar para Roleta</button>
          </div>
        )}
        {step === 'roulette' && (
          <div className="p-8 text-center bg-slate-50 dark:bg-zinc-950 min-h-[400px] flex flex-col items-center justify-center">
            {filteredList.length === 0 ? (<div className="text-center"><p className="text-gray-500 dark:text-gray-400 mb-4">Nenhum jogo encontrado com esses filtros.</p><button onClick={() => setStep('filters')} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Voltar</button></div>) : winnerGame ? (
              <div className="animate-scaleIn w-full">
                <h3 className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-sm mb-2">O Vencedor é:</h3>
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">{winnerGame.title}</h2>
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-700 max-w-sm mx-auto mb-8 transform hover:scale-105 transition-transform"><div className="h-40 w-full bg-gray-200 dark:bg-zinc-700 rounded-lg mb-4 overflow-hidden"><img src={getImagesForGame(winnerGame.folder, winnerGame.title)[0]} alt={winnerGame.title} className="w-full h-full object-cover" /></div><p className="text-gray-600 dark:text-gray-300 text-sm mb-6">{winnerGame.description}</p><a href={winnerGame.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-md"><ExternalLink size={20} /> Baixar Agora</a></div>
                <button onClick={resetRaffle} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm font-medium flex items-center justify-center gap-1 mx-auto"><RotateCw size={16} /> Sortear Novamente</button>
              </div>
            ) : (<><h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">Sorteando entre {filteredList.length} jogos...</h3><RouletteWheel items={filteredList} onSpinEnd={(winner) => setWinnerGame(winner)} /><button onClick={() => setStep('filters')} className="mt-6 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline">Alterar Filtros</button></>)}
          </div>
        )}
      </div>
    </div>
  );
};

const ImageModal = ({ isOpen, images, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  useEffect(() => { if (isOpen) setCurrentIndex(startIndex); }, [isOpen, startIndex]);
  useEffect(() => { if (!isOpen) return; const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') nextImage(e); if (e.key === 'ArrowLeft') prevImage(e); }; window.addEventListener('keydown', handleKeyDown); return () => window.removeEventListener('keydown', handleKeyDown); }, [isOpen, currentIndex]);
  if (!isOpen || !images || images.length === 0) return null;
  const nextImage = (e) => { e?.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % images.length); };
  const prevImage = (e) => { e?.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + images.length) % images.length); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"><X size={28} /></button>
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white/80 text-sm font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm select-none">{currentIndex + 1} / {images.length}</div>
      {images.length > 1 && (<button onClick={prevImage} className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md hover:scale-110 z-50"><ChevronLeft size={32} /></button>)}
      <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center p-4 md:p-8" onClick={(e) => e.stopPropagation()}><img src={images[currentIndex]} alt={`Full view ${currentIndex}`} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-scaleIn select-none"/></div>
      {images.length > 1 && (<button onClick={nextImage} className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md hover:scale-110 z-50"><ChevronRight size={32} /></button>)}
      {images.length > 1 && (<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full px-4 py-2 z-50" onClick={(e) => e.stopPropagation()}>{images.map((img, idx) => (<button key={idx} onClick={() => setCurrentIndex(idx)} className={`w-12 h-12 md:w-16 md:h-16 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${idx === currentIndex ? 'border-white scale-110 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}><img src={img} alt="thumb" className="w-full h-full object-cover" /></button>))}</div>)}
    </div>
  );
};

const FilterButton = ({ active, onClick, children, icon: Icon }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${active ? 'bg-blue-600 text-white shadow-md transform scale-105' : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700'}`}>{Icon && <Icon size={16} />}{children}</button>
);

const GameCard = ({ game, onImageClick }) => {
  const isWeb = game.platforms.includes("Web");
  const images = useMemo(() => getImagesForGame(game.folder, game.title), [game.folder, game.title]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const nextImage = (e) => { e.preventDefault(); e.stopPropagation(); setCurrentImgIndex((prev) => (prev + 1) % images.length); };
  const prevImage = (e) => { e.preventDefault(); e.stopPropagation(); setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length); };
  
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-zinc-800 overflow-hidden flex flex-col h-full animate-fadeIn group">
      <div className="relative h-48 w-full bg-gray-200 dark:bg-zinc-800 overflow-hidden cursor-zoom-in" onClick={() => onImageClick(images, currentImgIndex)}>
        <img src={images[currentImgIndex]} alt={`${game.title} screenshot`} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"/>
        {images.length > 1 && (<div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"><button onClick={prevImage} className="p-1 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"><ChevronLeft size={20} /></button><button onClick={nextImage} className="p-1 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"><ChevronRight size={20} /></button></div>)}
        {images.length > 1 && (<div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">{images.map((_, idx) => (<div key={idx} className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all ${idx === currentImgIndex ? 'bg-white scale-110' : 'bg-white/50'}`}/>))}</div>)}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3"><h3 className="text-xl font-bold text-gray-800 dark:text-white leading-tight">{game.title}</h3>{game.price.includes("Grátis") ? (<span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded-full font-bold whitespace-nowrap">Grátis</span>) : (<span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs px-2 py-1 rounded-full font-bold whitespace-nowrap">{game.price}</span>)}</div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1">{game.description}</p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs"><Users size={14} className="mr-2 text-blue-500 dark:text-blue-400" /><span className="font-semibold text-gray-700 dark:text-gray-200 mr-1">Jogadores:</span> {game.players}</div>
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">{getStyleIcon(game.style)}<span className="ml-2 font-semibold text-gray-700 dark:text-gray-200 mr-1">Estilo:</span> {game.style}</div>
          <div className="flex items-start text-gray-500 dark:text-gray-400 text-xs"><Monitor size={14} className="mr-2 mt-0.5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" /><div><span className="font-semibold text-gray-700 dark:text-gray-200 mr-1">Plat:</span>{game.platforms.join(", ")}</div></div>
        </div>
        <a href={game.url} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center w-full gap-2 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors mt-auto ${isWeb ? 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800' : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'}`}>{isWeb ? <Play size={16} /> : <ShoppingCart size={16} />}{isWeb ? game.linkName : `Baixar na ${game.linkName}`}</a>
      </div>
    </div>
  );
};

const GamesTable = ({ games }) => (
  <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden animate-fadeIn">
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
          <tr><th className="px-6 py-4 font-bold">Jogo</th><th className="px-6 py-4 font-bold">Estilo</th><th className="px-6 py-4 font-bold">Jogadores</th><th className="px-6 py-4 font-bold">Preço (BR)</th><th className="px-6 py-4 font-bold">Plataformas</th><th className="px-6 py-4 font-bold">Ação</th></tr>
        </thead>
        <tbody className="text-gray-800 dark:text-gray-200">
          {games.map((game, index) => {
            const isWeb = game.platforms.includes("Web");
            const images = getImagesForGame(game.folder, game.title);
            return (
              <tr key={game.id} className={`border-b border-gray-100 dark:border-zinc-800 hover:bg-blue-50 dark:hover:bg-zinc-800 transition-colors ${index % 2 === 0 ? 'bg-white dark:bg-zinc-900' : 'bg-gray-50/50 dark:bg-zinc-900/50'}`}>
                <td className="px-6 py-4 font-bold whitespace-nowrap flex items-center gap-3"><img src={images[0]} alt="" className="w-10 h-10 rounded object-cover border border-gray-200 dark:border-zinc-700" />{game.title}</td><td className="px-6 py-4 text-gray-600 dark:text-gray-400"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-zinc-700 text-gray-800 dark:text-gray-200">{game.style}</span></td><td className="px-6 py-4 text-blue-600 dark:text-blue-400 font-medium">{game.players}</td><td className="px-6 py-4">{game.price.includes("Grátis") ? (<span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-bold">Grátis</span>) : (<span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">{game.price}</span>)}</td><td className="px-6 py-4"><div className="flex flex-wrap gap-1">{game.platforms.map(p => (<span key={p} className="bg-gray-100 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded text-xs">{p}</span>))}</div></td><td className="px-6 py-4"><a href={game.url} target="_blank" rel="noopener noreferrer" className={`${isWeb ? 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-800' : 'text-blue-600 dark:text-blue-400 hover:text-blue-800'} font-medium hover:underline flex items-center gap-1`}>{isWeb ? <Play size={12} /> : <ShoppingCart size={12} />}{isWeb ? game.linkName : `Baixar`} <ExternalLink size={10} /></a></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

// --- APP PRINCIPAL ---
export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [modalData, setModalData] = useState(null);
  const [raffleOpen, setRaffleOpen] = useState(false);
  
  // DARK MODE INTELIGENTE
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) setDarkMode(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // FILTROS
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [maxPrice, setMaxPrice] = useState(300);

  const toggleSelection = (list, setList, value) => {
    if (list.includes(value)) setList(list.filter(item => item !== value));
    else setList([...list, value]);
  };

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) || game.genre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlatform = selectedPlatforms.length === 0 || selectedPlatforms.some(p => game.platforms.includes(p) || (p === 'Web' && game.platforms.includes('Web')) || (p === 'PC' && game.platforms.includes('PC')) || (p === 'Mobile' && game.platforms.includes('Mobile')) || (p === 'Console' && (game.platforms.includes('Console') || game.platforms.includes('Xbox') || game.platforms.includes('Switch'))));
      const matchesStyle = selectedStyles.length === 0 || selectedStyles.includes(game.style);
      
      // CORREÇÃO: Aceita "Pago (Sub)" (999) quando o slider está no máximo (300)
      const priceVal = parsePrice(game.price);
      const matchesPrice = maxPrice >= 300 ? true : (maxPrice === 0 ? priceVal === 0 : priceVal <= maxPrice);
      
      return matchesSearch && matchesPlatform && matchesPrice && matchesStyle;
    });
  }, [searchTerm, selectedPlatforms, selectedStyles, maxPrice]);

  const handleOpenModal = (images, index) => {
    setModalData({ images, startIndex: index });
  };

  const clearFilters = () => {
    setSelectedPlatforms([]);
    setSelectedStyles([]);
    setMaxPrice(300);
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans text-gray-800 dark:text-slate-100 transition-colors duration-300">
      <ImageModal isOpen={!!modalData} images={modalData?.images || []} startIndex={modalData?.startIndex || 0} onClose={() => setModalData(null)} />
      <RaffleModal isOpen={raffleOpen} onClose={() => setRaffleOpen(false)} allGames={gamesData} />

      <button onClick={() => setRaffleOpen(true)} className="fixed bottom-8 right-8 z-30 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-all flex items-center gap-2 group animate-bounce-slow">
        <Dices size={28} className="animate-pulse" />
        <span className="font-bold text-lg hidden group-hover:block pr-2">Sortear Jogo!</span>
      </button>

      <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-20 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div><h1 className="text-2xl font-black text-blue-700 dark:text-blue-400 flex items-center gap-2"><Gamepad2 className="text-blue-600 dark:text-blue-400" /> Galera Gamer 10+</h1><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Catálogo de jogos com preços e links diretos</p></div>
            
            <div className="flex gap-2 w-full md:w-auto items-center">
                {/* DARK MODE TOGGLE */}
                <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all">
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <div className="relative flex-1 md:w-80"><input type="text" placeholder="Buscar jogo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-zinc-800 border-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-zinc-900 text-gray-800 dark:text-white transition-all outline-none placeholder-gray-400" /><Search className="absolute left-3 top-2.5 text-gray-400" size={18} /></div>
                <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-lg p-1 gap-1"><button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-700 shadow text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`} title="Visualização em Cards"><Grid size={20} /></button><button onClick={() => setViewMode('table')} className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-white dark:bg-zinc-700 shadow text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`} title="Visualização em Tabela"><List size={20} /></button></div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 mt-4 pt-2 border-t border-gray-100 dark:border-zinc-800">
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mr-2">Plataformas:</span>
              {['PC', 'Web', 'Mobile', 'Console'].map(p => (
                <FilterButton key={p} active={selectedPlatforms.includes(p)} onClick={() => toggleSelection(selectedPlatforms, setSelectedPlatforms, p)} icon={p === 'PC' ? Monitor : p === 'Web' ? Globe : p === 'Mobile' ? Smartphone : Gamepad2}>{p}</FilterButton>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mr-2">Estilos:</span>
              {['Competitivo', 'Cooperativo', 'MMO', 'Dedução Social', 'Times'].map(style => (
                 <FilterButton key={style} active={selectedStyles.includes(style)} onClick={() => toggleSelection(selectedStyles, setSelectedStyles, style)} icon={getStyleIcon(style).type}>{style}</FilterButton>
              ))}
            </div>
            <div className="flex items-center gap-4 py-2 border-t border-gray-100 dark:border-zinc-800">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Preço Máx:</span>
              <div className="flex-1 max-w-xs flex items-center gap-3">
                <input type="range" min="0" max="300" step="10" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                <span className="text-sm font-bold text-blue-700 dark:text-blue-400 whitespace-nowrap min-w-[80px]">{maxPrice === 0 ? "Grátis" : maxPrice >= 300 ? "Ilimitado" : `R$ ${maxPrice}`}</span>
              </div>
              <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-red-500 underline ml-auto">Limpar Tudo</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
        <div className="flex justify-between items-center mb-6"><h2 className="text-lg font-bold text-gray-700 dark:text-gray-200">{filteredGames.length} Jogos Encontrados</h2>{filteredGames.length === 0 && (<button onClick={clearFilters} className="text-blue-600 dark:text-blue-400 text-sm hover:underline">Limpar filtros</button>)}</div>
        {filteredGames.length > 0 ? (<>{viewMode === 'grid' ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{filteredGames.map(game => (<GameCard key={game.id} game={game} onImageClick={handleOpenModal} />))}</div>) : (<GamesTable games={filteredGames} />)}</>) : (<div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700"><Gamepad2 size={48} className="mx-auto text-gray-300 dark:text-zinc-600 mb-4" /><h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">Nenhum jogo encontrado</h3></div>)}
      </main>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out forwards; }
        .animate-bounce-slow { animation: bounce-slow 2s infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
