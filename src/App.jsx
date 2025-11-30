import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Users, Monitor, Smartphone, Globe, Gamepad2, Tag, ShoppingCart, Info, List, Grid, ExternalLink, Play, ChevronLeft, ChevronRight, X, Dices, RotateCw, Filter, Swords, Handshake, BrainCircuit, PartyPopper, UsersRound } from 'lucide-react';

// --- CONFIGURAÇÃO DE IMAGENS ---
// 1. Inicializa vazio (Fallback para o chat)
let allGameImages = {};

// 2. NO SEU SERVIDOR (Vite/Vercel com ES2020):
// Remova as barras (//) das linhas abaixo para ativar a leitura automática.

allGameImages = import.meta.glob('/src/assets/games/**/*.{png,jpg,jpeg,webp,gif}', {
  eager: true,
  import: 'default',
  query: '?url'
});


// Função para buscar imagens
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

// Helper para extrair número máximo de jogadores
const getMaxPlayers = (playerStr) => {
  if (typeof playerStr !== 'string') return 0;
  if (playerStr.toLowerCase().includes('ilimitado')) return 999;
  const numbers = playerStr.match(/(\d+)/g);
  if (!numbers) return 0;
  return Math.max(...numbers.map(Number));
};

// --- DADOS DOS JOGOS (COM NOVO ATRIBUTO 'STYLE') ---
const gamesData = [
  // --- PARTY GAMES ---
  { id: 1, title: "Fall Guys", folder: "fall-guys", players: "Até 60", genre: "Battle Royale", style: "Competitivo", platforms: ["PC", "Console", "Switch"], price: "Grátis", description: "Gincanas caóticas com jujubas. Obrigatório para grupos grandes.", linkName: "Epic Games", url: "https://store.epicgames.com/pt-BR/p/fall-guys" },
  { id: 2, title: "Stumble Guys", folder: "stumble-guys", players: "Até 32", genre: "Battle Royale", style: "Competitivo", platforms: ["PC", "Mobile", "Console"], price: "Grátis", description: "A versão leve do Fall Guys. Roda em qualquer celular e PC.", linkName: "Steam", url: "https://store.steampowered.com/app/1677740/Stumble_Guys/" },
  { id: 3, title: "Pico Park", folder: "pico-park", players: "Até 8", genre: "Puzzle", style: "Cooperativo", platforms: ["PC", "Switch"], price: "R$ 16,99", description: "Teste de amizade. Coordenação total ou caos absoluto.", linkName: "Steam", url: "https://store.steampowered.com/app/1509960/PICO_PARK/" },
  { id: 4, title: "Crab Game", folder: "crab-game", players: "Até 40", genre: "Survival", style: "Competitivo", platforms: ["PC"], price: "Grátis", description: "Inspirado em Round 6. Chat de proximidade é a alma do jogo.", linkName: "Steam", url: "https://store.steampowered.com/app/1782210/Crab_Game/" },
  // --- DEDUÇÃO SOCIAL ---
  { id: 5, title: "Among Us", folder: "among-us", players: "4-15", genre: "Dedução", style: "Dedução Social", platforms: ["PC", "Mobile", "Console"], price: "R$ 16,99 / Grátis", description: "O clássico. Descubra o impostor ou morra tentando.", linkName: "Steam", url: "https://store.steampowered.com/app/945360/Among_Us/" },
  { id: 6, title: "Goose Goose Duck", folder: "goose-goose-duck", players: "16+", genre: "Dedução", style: "Dedução Social", platforms: ["PC", "Mobile"], price: "Grátis", description: "Among Us com patos e chat de voz embutido. Muito caótico.", linkName: "Steam", url: "https://store.steampowered.com/app/1568590/Goose_Goose_Duck/" },
  { id: 7, title: "Dale & Dawson Stationery", folder: "dale-dawson", players: "Até 21", genre: "Roleplay", style: "Dedução Social", platforms: ["PC"], price: "R$ 26,49", description: "Simulador de escritório. Quem está trabalhando e quem está fingindo?", linkName: "Steam", url: "https://store.steampowered.com/app/2920570/Dale__Dawson_Stationery_Supplies/" },
  { id: 8, title: "Lockdown Protocol", folder: "lockdown-protocol", players: "3-8", genre: "Sci-Fi", style: "Dedução Social", platforms: ["PC"], price: "R$ 32,99", description: "Dedução em primeira pessoa onde você precisa matar os traidores.", linkName: "Steam", url: "https://store.steampowered.com/app/2780980/LOCKDOWN_Protocol/" },
  { id: 9, title: "Town of Salem 2", folder: "town-of-salem-2", players: "Até 15", genre: "Estratégia", style: "Dedução Social", platforms: ["PC"], price: "Grátis", description: "Um xadrez social. Minta, julgue e enforque os culpados.", linkName: "Steam", url: "https://store.steampowered.com/app/2140510/Town_of_Salem_2/" },
  { id: 27, title: "Feign", folder: "feign", players: "4-12", genre: "Estratégia", style: "Dedução Social", platforms: ["PC", "Mobile"], price: "R$ 16,99", description: "Dedução onde você pode ser 'louco' e receber informações falsas.", linkName: "Steam", url: "https://store.steampowered.com/app/1436990/Feign/" },
  // --- SOBREVIVÊNCIA ---
  { id: 10, title: "Minecraft", folder: "minecraft", players: "Ilimitado", genre: "Sandbox", style: "Cooperativo", platforms: ["Todas"], price: "R$ 99,00", description: "O maior sandbox do mundo. Requer servidor para muitos players.", linkName: "Site Oficial", url: "https://www.minecraft.net/pt-br/store/minecraft-java-bedrock-edition-pc" },
  { id: 11, title: "Lethal Company", folder: "lethal-company", players: "4+", genre: "Terror", style: "Cooperativo", platforms: ["PC"], price: "R$ 32,99", description: "Bata metas de lucro coletando sucata em luas de terror.", linkName: "Steam", url: "https://store.steampowered.com/app/1966720/Lethal_Company/" },
  { id: 12, title: "Content Warning", folder: "content-warning", players: "4+", genre: "Terror", style: "Cooperativo", platforms: ["PC"], price: "R$ 26,49", description: "Filme seus amigos morrendo para monstros e viralize na internet.", linkName: "Steam", url: "https://store.steampowered.com/app/2881650/Content_Warning/" },
  { id: 13, title: "Valheim", folder: "valheim", players: "1-10", genre: "Sobrevivência", style: "Cooperativo", platforms: ["PC", "Xbox"], price: "R$ 37,99", description: "Explore o purgatório viking. Construa barcos e enfrente chefes.", linkName: "Steam", url: "https://store.steampowered.com/app/892970/Valheim/" },
  { id: 14, title: "Don't Starve Together", folder: "dont-starve", players: "1-6+", genre: "Sobrevivência", style: "Cooperativo", platforms: ["PC", "Console"], price: "R$ 27,99", description: "Não morra de fome. Estilo gótico e muito difícil.", linkName: "Steam", url: "https://store.steampowered.com/app/322330/Dont_Starve_Together/" },
  { id: 15, title: "Project Zomboid", folder: "project-zomboid", players: "Até 32+", genre: "Sobrevivência", style: "Cooperativo", platforms: ["PC"], price: "R$ 59,99", description: "O simulador de apocalipse zumbi mais detalhado que existe.", linkName: "Steam", url: "https://store.steampowered.com/app/108600/Project_Zomboid/" },
  { id: 28, title: "Barotrauma", folder: "barotrauma", players: "Até 16", genre: "Simulador", style: "Cooperativo", platforms: ["PC"], price: "R$ 99,99", description: "Gerencie um submarino no espaço. Complexo e claustrofóbico.", linkName: "Steam", url: "https://store.steampowered.com/app/602960/Barotrauma/" },
  // --- NAVEGADOR ---
  { id: 16, title: "Gartic Phone", folder: "gartic-phone", players: "Até 30", genre: "Casual", style: "Casual", platforms: ["Web"], price: "Grátis", description: "Telefone sem fio desenhado. Garantia de risadas.", linkName: "Jogar Agora", url: "https://garticphone.com" },
  { id: 17, title: "JKLM.fun", folder: "jklm", players: "16+", genre: "Casual", style: "Casual", platforms: ["Web"], price: "Grátis", description: "O jogo da bomba, mas com digitação de palavras.", linkName: "Jogar Agora", url: "https://jklm.fun" },
  { id: 18, title: "Make It Meme", folder: "make-it-meme", players: "Até 15", genre: "Casual", style: "Casual", platforms: ["Web"], price: "Grátis", description: "Crie legendas engraçadas para memes e vote nos amigos.", linkName: "Jogar Agora", url: "https://makeitmeme.com" },
  { id: 19, title: "Board Game Arena", folder: "board-game-arena", players: "Varia", genre: "Tabuleiro", style: "Casual", platforms: ["Web"], price: "Grátis", description: "Centenas de jogos de tabuleiro (Uno, Saboteur) no navegador.", linkName: "Acessar Site", url: "https://boardgamearena.com" },
  { id: 20, title: "StopotS", folder: "stopots", players: "Ilimitado", genre: "Casual", style: "Casual", platforms: ["Web", "Mobile"], price: "Grátis", description: "O famoso 'Adedonha' ou 'Stop' online.", linkName: "Jogar Agora", url: "https://stopots.com.br" },
  { id: 21, title: "Codenames Online", folder: "codenames", players: "Ilimitado", genre: "Palavras", style: "Times", platforms: ["Web"], price: "Grátis", description: "Jogo de espiões e dicas de palavras em times.", linkName: "Jogar Agora", url: "https://codenames.game" },
  // --- SHOOTERS ---
  { id: 22, title: "Team Fortress 2", folder: "tf2", players: "Até 32", genre: "FPS", style: "Times", platforms: ["PC"], price: "Grátis", description: "O pai dos hero shooters. Caótico e divertido.", linkName: "Steam", url: "https://store.steampowered.com/app/440/Team_Fortress_2/" },
  { id: 23, title: "Sven Co-op", folder: "sven-coop", players: "Até 32", genre: "FPS", style: "Cooperativo", platforms: ["PC"], price: "Grátis", description: "Half-Life cooperativo para jogar a campanha com a galera.", linkName: "Steam", url: "https://store.steampowered.com/app/225840/Sven_Coop/" },
  { id: 24, title: "Halo Infinite", folder: "halo-infinite", players: "Até 28", genre: "FPS", style: "Times", platforms: ["PC"], price: "Grátis", description: "Multiplayer gratuito. Crie salas privadas para batalhas épicas.", linkName: "Steam", url: "https://store.steampowered.com/app/1240440/Halo_Infinite/" },
  { id: 25, title: "Unfortunate Spacemen", folder: "unfortunate-spacemen", players: "Até 16", genre: "FPS", style: "Dedução Social", platforms: ["PC"], price: "Grátis", description: "Mistura de Among Us com tiroteio e monstros.", linkName: "Steam", url: "https://store.steampowered.com/app/408900/Unfortunate_Spacemen/" },
  { id: 26, title: "Unturned", folder: "unturned", players: "Até 24+", genre: "FPS", style: "Cooperativo", platforms: ["PC"], price: "Grátis", description: "Sobrevivência zumbi com visual simples (blocos).", linkName: "Steam", url: "https://store.steampowered.com/app/304930/Unturned/" }
];

// --- COMPONENTE: RULETA SVG COM IMAGENS ---
const RouletteWheel = ({ items, onSpinEnd }) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);

  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

  const startSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setWinner(null);

    const newWinnerIndex = Math.floor(Math.random() * items.length);
    const sliceAngle = 360 / items.length;
    const spinAmount = 1800 + (360 - (newWinnerIndex * sliceAngle)) - (sliceAngle / 2); 
    
    setRotation(rotation + spinAmount);

    setTimeout(() => {
      setSpinning(false);
      setWinner(items[newWinnerIndex]);
      onSpinEnd(items[newWinnerIndex]);
    }, 4000);
  };

  const getCoordinatesForPercent = (percent, radius = 1) => {
    const x = radius * Math.cos(2 * Math.PI * percent);
    const y = radius * Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-80 h-80 md:w-96 md:h-96 mb-8">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20 drop-shadow-xl">
          <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-red-600"></div>
        </div>
        <div className="w-full h-full rounded-full border-4 border-white shadow-2xl overflow-hidden transition-transform duration-[4000ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]" style={{ transform: `rotate(${rotation}deg)` }}>
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
      <button onClick={startSpin} disabled={spinning} className={`px-8 py-3 rounded-full font-black text-white text-lg shadow-lg transform transition-all ${spinning ? 'bg-gray-400 cursor-not-allowed scale-95' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 active:scale-95'}`}>{spinning ? 'GIRANDO...' : 'GIRAR ROLETA!'}</button>
    </div>
  );
};

// --- MODAL DE SORTEIO ATUALIZADO ---
const RaffleModal = ({ isOpen, onClose, allGames }) => {
  const [step, setStep] = useState('filters'); 
  const [filteredList, setFilteredList] = useState([]);
  const [winnerGame, setWinnerGame] = useState(null);
  
  // FILTROS (Adicionado 'style')
  const [filters, setFilters] = useState({
    platform: 'Todas',
    price: 'Todos',
    style: 'Todos',
    playerCount: 'Qualquer'
  });

  const applyFilters = () => {
    const result = allGames.filter(game => {
      const matchPlat = filters.platform === 'Todas' || game.platforms.includes(filters.platform) || (filters.platform === 'Web' && game.platforms.includes('Web')) || (filters.platform === 'PC' && game.platforms.includes('PC'));
      const matchPrice = filters.price === 'Todos' || (filters.price === 'Grátis' && game.price.includes('Grátis')) || (filters.price === 'Pago' && !game.price.includes('Grátis'));
      
      // Filtro Estilo
      const matchStyle = filters.style === 'Todos' || game.style === filters.style;

      // Filtro Capacidade
      let matchPlayers = true;
      const maxP = getMaxPlayers(game.players);
      if (filters.playerCount === 'Pequeno') matchPlayers = maxP <= 8;
      if (filters.playerCount === 'Médio') matchPlayers = maxP >= 8 && maxP <= 16;
      if (filters.playerCount === 'Grande') matchPlayers = maxP > 16;

      return matchPlat && matchPrice && matchStyle && matchPlayers;
    });
    setFilteredList(result);
    setStep('roulette');
  };

  const resetRaffle = () => {
    setStep('filters');
    setWinnerGame(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"><X size={24} /></button>
        
        {step === 'filters' && (
          <div className="p-8">
            <h2 className="text-2xl font-black text-blue-700 flex items-center gap-2 mb-6"><Dices size={28} /> Configurar Sorteio</h2>
            <div className="space-y-6">
              
              {/* Filtro: Estilo (NOVO) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Estilo de Jogo</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Todos', value: 'Todos' },
                    { label: 'Competitivo', value: 'Competitivo' },
                    { label: 'Cooperativo', value: 'Cooperativo' },
                    { label: 'Times', value: 'Times' },
                    { label: 'Dedução', value: 'Dedução Social' },
                    { label: 'Casual', value: 'Casual' }
                  ].map(opt => (
                    <button key={opt.value} onClick={() => setFilters({...filters, style: opt.value})} className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${filters.style === opt.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtro: Capacidade */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tamanho do Grupo</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Qualquer', value: 'Qualquer' },
                    { label: 'Pequeno (até 8)', value: 'Pequeno' },
                    { label: 'Médio (8-16)', value: 'Médio' },
                    { label: 'Grande (17+)', value: 'Grande' }
                  ].map(opt => (
                    <button key={opt.value} onClick={() => setFilters({...filters, playerCount: opt.value})} className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${filters.playerCount === opt.value ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Plataforma</label>
                  <select value={filters.platform} onChange={(e) => setFilters({...filters, platform: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50">
                    {['Todas', 'PC', 'Web', 'Mobile', 'Console'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Preço</label>
                  <select value={filters.price} onChange={(e) => setFilters({...filters, price: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50">
                    {['Todos', 'Grátis', 'Pago'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <button onClick={applyFilters} className="w-full mt-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg transition-colors shadow-lg">Continuar para Roleta</button>
          </div>
        )}

        {step === 'roulette' && (
          <div className="p-8 text-center bg-slate-50 min-h-[400px] flex flex-col items-center justify-center">
            {filteredList.length === 0 ? (
              <div className="text-center"><p className="text-gray-500 mb-4">Nenhum jogo encontrado com esses filtros.</p><button onClick={() => setStep('filters')} className="text-blue-600 font-bold hover:underline">Voltar</button></div>
            ) : winnerGame ? (
              <div className="animate-scaleIn w-full">
                <h3 className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-2">O Vencedor é:</h3>
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">{winnerGame.title}</h2>
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-sm mx-auto mb-8 transform hover:scale-105 transition-transform">
                  <div className="h-40 w-full bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    <img src={getImagesForGame(winnerGame.folder, winnerGame.title)[0]} alt={winnerGame.title} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-gray-600 text-sm mb-6">{winnerGame.description}</p>
                  <a href={winnerGame.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-md">
                    <ExternalLink size={20} /> Baixar Agora
                  </a>
                </div>
                <button onClick={resetRaffle} className="text-gray-400 hover:text-gray-600 text-sm font-medium flex items-center justify-center gap-1 mx-auto"><RotateCw size={16} /> Sortear Novamente</button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Sorteando entre {filteredList.length} jogos...</h3>
                <RouletteWheel items={filteredList} onSpinEnd={(winner) => setWinnerGame(winner)} />
                <button onClick={() => setStep('filters')} className="mt-6 text-sm text-gray-400 hover:text-gray-600 underline">Alterar Filtros</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- COMPONENTES AUXILIARES ---
const ImageModal = ({ isOpen, images, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  useEffect(() => { if (isOpen) setCurrentIndex(startIndex); }, [isOpen, startIndex]);
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextImage(e);
      if (e.key === 'ArrowLeft') prevImage(e);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);
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
  <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${active ? 'bg-blue-600 text-white shadow-md transform scale-105' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>{Icon && <Icon size={16} />}{children}</button>
);

const GameCard = ({ game, onImageClick }) => {
  const isWeb = game.platforms.includes("Web");
  const images = useMemo(() => getImagesForGame(game.folder, game.title), [game.folder, game.title]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const nextImage = (e) => { e.preventDefault(); e.stopPropagation(); setCurrentImgIndex((prev) => (prev + 1) % images.length); };
  const prevImage = (e) => { e.preventDefault(); e.stopPropagation(); setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length); };
  
  const getStyleIcon = (style) => {
    switch(style) {
      case 'Competitivo': return <Swords size={14} className="text-red-500" />;
      case 'Cooperativo': return <Handshake size={14} className="text-green-500" />;
      case 'Dedução Social': return <BrainCircuit size={14} className="text-purple-500" />;
      case 'Casual': return <PartyPopper size={14} className="text-orange-500" />;
      case 'Times': return <UsersRound size={14} className="text-blue-500" />;
      default: return <Tag size={14} className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden flex flex-col h-full animate-fadeIn group">
      <div className="relative h-48 w-full bg-gray-200 overflow-hidden cursor-zoom-in" onClick={() => onImageClick(images, currentImgIndex)}>
        <img src={images[currentImgIndex]} alt={`${game.title} screenshot`} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"/>
        {images.length > 1 && (<div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"><button onClick={prevImage} className="p-1 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"><ChevronLeft size={20} /></button><button onClick={nextImage} className="p-1 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"><ChevronRight size={20} /></button></div>)}
        {images.length > 1 && (<div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">{images.map((_, idx) => (<div key={idx} className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all ${idx === currentImgIndex ? 'bg-white scale-110' : 'bg-white/50'}`}/>))}</div>)}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3"><h3 className="text-xl font-bold text-gray-800 leading-tight">{game.title}</h3>{game.price.includes("Grátis") ? (<span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold whitespace-nowrap">Grátis</span>) : (<span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-bold whitespace-nowrap">{game.price}</span>)}</div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{game.description}</p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-500 text-xs"><Users size={14} className="mr-2 text-blue-500" /><span className="font-semibold text-gray-700 mr-1">Jogadores:</span> {game.players}</div>
          <div className="flex items-center text-gray-500 text-xs">{getStyleIcon(game.style)}<span className="ml-2 font-semibold text-gray-700 mr-1">Estilo:</span> {game.style}</div>
          <div className="flex items-start text-gray-500 text-xs"><Monitor size={14} className="mr-2 mt-0.5 text-indigo-500 flex-shrink-0" /><div><span className="font-semibold text-gray-700 mr-1">Plat:</span>{game.platforms.join(", ")}</div></div>
        </div>
        <a href={game.url} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center w-full gap-2 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors mt-auto ${isWeb ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'}`}>{isWeb ? <Play size={16} /> : <ShoppingCart size={16} />}{isWeb ? game.linkName : `Baixar na ${game.linkName}`}</a>
      </div>
    </div>
  );
};

const GamesTable = ({ games }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fadeIn">
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
          <tr><th className="px-6 py-4 font-bold text-gray-800">Jogo</th><th className="px-6 py-4 font-bold text-gray-800">Estilo</th><th className="px-6 py-4 font-bold text-gray-800">Jogadores</th><th className="px-6 py-4 font-bold text-gray-800">Preço (BR)</th><th className="px-6 py-4 font-bold text-gray-800">Plataformas</th><th className="px-6 py-4 font-bold text-gray-800">Ação</th></tr>
        </thead>
        <tbody>
          {games.map((game, index) => {
            const isWeb = game.platforms.includes("Web");
            const images = getImagesForGame(game.folder, game.title);
            return (
              <tr key={game.id} className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <td className="px-6 py-4 font-bold text-gray-800 whitespace-nowrap flex items-center gap-3"><img src={images[0]} alt="" className="w-10 h-10 rounded object-cover border border-gray-200" />{game.title}</td><td className="px-6 py-4 text-gray-600"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{game.style}</span></td><td className="px-6 py-4 text-blue-600 font-medium">{game.players}</td><td className="px-6 py-4">{game.price.includes("Grátis") ? (<span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Grátis</span>) : (<span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">{game.price}</span>)}</td><td className="px-6 py-4"><div className="flex flex-wrap gap-1">{game.platforms.map(p => (<span key={p} className="bg-gray-100 border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-xs">{p}</span>))}</div></td><td className="px-6 py-4"><a href={game.url} target="_blank" rel="noopener noreferrer" className={`${isWeb ? 'text-emerald-600 hover:text-emerald-800' : 'text-blue-600 hover:text-blue-800'} font-medium hover:underline flex items-center gap-1`}>{isWeb ? <Play size={12} /> : <ShoppingCart size={12} />}{isWeb ? game.linkName : `Baixar`} <ExternalLink size={10} /></a></td>
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
  const [platformFilter, setPlatformFilter] = useState("Todas");
  const [priceFilter, setPriceFilter] = useState("Todos");
  const [styleFilter, setStyleFilter] = useState("Todos"); // Novo filtro principal
  const [viewMode, setViewMode] = useState("grid");
  const [modalData, setModalData] = useState(null);
  const [raffleOpen, setRaffleOpen] = useState(false);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) || game.genre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlatform = platformFilter === "Todas" || (platformFilter === "Web" && game.platforms.includes("Web")) || (platformFilter === "Mobile" && game.platforms.includes("Mobile")) || (platformFilter === "Console" && (game.platforms.includes("Console") || game.platforms.includes("Xbox") || game.platforms.includes("Switch")));
      const matchesPrice = priceFilter === "Todos" || (priceFilter === "Grátis" && game.price.includes("Grátis")) || (priceFilter === "Pago" && !game.price.includes("Grátis"));
      const matchesStyle = styleFilter === "Todos" || game.style === styleFilter;
      
      return matchesSearch && matchesPlatform && matchesPrice && matchesStyle;
    });
  }, [searchTerm, platformFilter, priceFilter, styleFilter]);

  const handleOpenModal = (images, index) => {
    setModalData({ images, startIndex: index });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
      <ImageModal isOpen={!!modalData} images={modalData?.images || []} startIndex={modalData?.startIndex || 0} onClose={() => setModalData(null)} />
      <RaffleModal isOpen={raffleOpen} onClose={() => setRaffleOpen(false)} allGames={gamesData} />

      <button onClick={() => setRaffleOpen(true)} className="fixed bottom-8 right-8 z-30 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-all flex items-center gap-2 group animate-bounce-slow">
        <Dices size={28} className="animate-pulse" />
        <span className="font-bold text-lg hidden group-hover:block pr-2">Sortear Jogo!</span>
      </button>

      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div><h1 className="text-2xl font-black text-blue-700 flex items-center gap-2"><Gamepad2 className="text-blue-600" /> Galera Gamer 10+</h1><p className="text-xs text-gray-500 mt-1">Catálogo de jogos com preços (Brasil) e links diretos</p></div>
            <div className="flex gap-2 w-full md:w-auto"><div className="relative flex-1 md:w-80"><input type="text" placeholder="Buscar jogo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" /><Search className="absolute left-3 top-2.5 text-gray-400" size={18} /></div><div className="flex bg-gray-100 rounded-lg p-1 gap-1"><button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`} title="Visualização em Cards"><Grid size={20} /></button><button onClick={() => setViewMode('table')} className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`} title="Visualização em Tabela"><List size={20} /></button></div></div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 pt-2 border-t border-gray-100 overflow-x-auto pb-2 scrollbar-hide">
            <FilterButton active={platformFilter === "Todas"} onClick={() => setPlatformFilter("Todas")} icon={Gamepad2}>Todas</FilterButton>
            <FilterButton active={platformFilter === "Web"} onClick={() => setPlatformFilter("Web")} icon={Globe}>Web</FilterButton>
            <FilterButton active={platformFilter === "Mobile"} onClick={() => setPlatformFilter("Mobile")} icon={Smartphone}>Mobile</FilterButton>
            <FilterButton active={platformFilter === "Console"} onClick={() => setPlatformFilter("Console")} icon={Monitor}>Console</FilterButton>
            
            <div className="w-px h-6 bg-gray-300 mx-2 self-center hidden md:block"></div>
            
            {/* Filtros de Estilo (NOVO) */}
            <FilterButton active={styleFilter === "Competitivo"} onClick={() => setStyleFilter(styleFilter === "Competitivo" ? "Todos" : "Competitivo")} icon={Swords}>Competitivo</FilterButton>
            <FilterButton active={styleFilter === "Cooperativo"} onClick={() => setStyleFilter(styleFilter === "Cooperativo" ? "Todos" : "Cooperativo")} icon={Handshake}>Cooperativo</FilterButton>
            <FilterButton active={styleFilter === "Dedução Social"} onClick={() => setStyleFilter(styleFilter === "Dedução Social" ? "Todos" : "Dedução Social")} icon={BrainCircuit}>Dedução</FilterButton>
            
            <div className="w-px h-6 bg-gray-300 mx-2 self-center hidden md:block"></div>
            
            <FilterButton active={priceFilter === "Todos"} onClick={() => setPriceFilter("Todos")}>Todos Preços</FilterButton>
            <FilterButton active={priceFilter === "Grátis"} onClick={() => setPriceFilter("Grátis")}>Grátis</FilterButton>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
        <div className="flex justify-between items-center mb-6"><h2 className="text-lg font-bold text-gray-700">{filteredGames.length} Jogos Encontrados</h2>{filteredGames.length === 0 && (<button onClick={() => {setPlatformFilter("Todas"); setPriceFilter("Todos"); setStyleFilter("Todos"); setSearchTerm("")}} className="text-blue-600 text-sm hover:underline">Limpar filtros</button>)}</div>
        {filteredGames.length > 0 ? (<>{viewMode === 'grid' ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{filteredGames.map(game => (<GameCard key={game.id} game={game} onImageClick={handleOpenModal} />))}</div>) : (<GamesTable games={filteredGames} />)}</>) : (<div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300"><Gamepad2 size={48} className="mx-auto text-gray-300 mb-4" /><h3 className="text-xl font-medium text-gray-600">Nenhum jogo encontrado</h3></div>)}
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
