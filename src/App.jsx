import React, { useState, useMemo, useEffect } from 'react';
import { Search, Users, Monitor, Smartphone, Globe, Gamepad2, Tag, ShoppingCart, Info, List, Grid, ExternalLink, Play, ChevronLeft, ChevronRight, X } from 'lucide-react';

// --- CONFIGURAÇÃO DE IMAGENS ---
// PARA O SEU SERVIDOR ES2020: Descomente o bloco abaixo.
// (Mantive comentado aqui apenas para evitar erro no visualizador do chat)

const allGameImages = {}; 

allGameImages = import.meta.glob('/src/assets/games/**/*.{png,jpg,jpeg,webp,gif}', {
  eager: true,
  import: 'default',
  query: '?url'
});

// Função inteligente que busca imagens na pasta correta
const getImagesForGame = (folderName, gameTitle) => {
  // 1. Tenta filtrar as imagens reais (quando a automação estiver ativa)
  const images = Object.keys(allGameImages)
    .filter((path) => path.includes(`/${folderName}/`))
    .map((path) => allGameImages[path]);

  // 2. Se achou imagens reais, retorna elas
  if (images.length > 0) {
    return images;
  }

  // 3. Fallback: Placeholders
  return [
    `https://placehold.co/1920x1080/2563eb/ffffff?text=${encodeURIComponent(gameTitle)}+Gameplay`,
    `https://placehold.co/1920x1080/1e40af/ffffff?text=${encodeURIComponent(gameTitle)}+Lobby`,
    `https://placehold.co/1920x1080/172554/ffffff?text=${encodeURIComponent(gameTitle)}+Win`
  ];
};

const gamesData = [
  // --- PARTY GAMES ---
  { id: 1, title: "Fall Guys", folder: "fall-guys", players: "Até 60", genre: "Party / Battle Royale", platforms: ["PC", "Console", "Switch"], price: "Grátis", description: "Gincanas caóticas com jujubas. Obrigatório para grupos grandes.", linkName: "Epic Games", url: "https://store.epicgames.com/pt-BR/p/fall-guys" },
  { id: 2, title: "Stumble Guys", folder: "stumble-guys", players: "Até 32", genre: "Party / Battle Royale", platforms: ["PC", "Mobile", "Console"], price: "Grátis", description: "A versão leve do Fall Guys. Roda em qualquer celular e PC.", linkName: "Steam", url: "https://store.steampowered.com/app/1677740/Stumble_Guys/" },
  { id: 3, title: "Pico Park", folder: "pico-park", players: "Até 8", genre: "Puzzle Cooperativo", platforms: ["PC", "Switch"], price: "R$ 16,99", description: "Teste de amizade. Coordenação total ou caos absoluto.", linkName: "Steam", url: "https://store.steampowered.com/app/1509960/PICO_PARK/" },
  { id: 4, title: "Crab Game", folder: "crab-game", players: "Até 40", genre: "Survival", platforms: ["PC"], price: "Grátis", description: "Inspirado em Round 6. Chat de proximidade é a alma do jogo.", linkName: "Steam", url: "https://store.steampowered.com/app/1782210/Crab_Game/" },
  // --- DEDUÇÃO SOCIAL ---
  { id: 5, title: "Among Us", folder: "among-us", players: "4-15", genre: "Dedução Social", platforms: ["PC", "Mobile", "Console"], price: "R$ 16,99 / Grátis", description: "O clássico. Descubra o impostor ou morra tentando.", linkName: "Steam", url: "https://store.steampowered.com/app/945360/Among_Us/" },
  { id: 6, title: "Goose Goose Duck", folder: "goose-goose-duck", players: "16+", genre: "Dedução Social", platforms: ["PC", "Mobile"], price: "Grátis", description: "Among Us com patos e chat de voz embutido. Muito caótico.", linkName: "Steam", url: "https://store.steampowered.com/app/1568590/Goose_Goose_Duck/" },
  { id: 7, title: "Dale & Dawson Stationery", folder: "dale-dawson", players: "Até 21", genre: "Roleplay / Dedução", platforms: ["PC"], price: "R$ 26,49", description: "Simulador de escritório. Quem está trabalhando e quem está fingindo?", linkName: "Steam", url: "https://store.steampowered.com/app/2920570/Dale__Dawson_Stationery_Supplies/" },
  { id: 8, title: "Lockdown Protocol", folder: "lockdown-protocol", players: "3-8", genre: "Dedução / Sci-Fi", platforms: ["PC"], price: "R$ 32,99", description: "Dedução em primeira pessoa onde você precisa matar os traidores.", linkName: "Steam", url: "https://store.steampowered.com/app/2780980/LOCKDOWN_Protocol/" },
  { id: 9, title: "Town of Salem 2", folder: "town-of-salem-2", players: "Até 15", genre: "Dedução / Lógica", platforms: ["PC"], price: "Grátis", description: "Um xadrez social. Minta, julgue e enforque os culpados.", linkName: "Steam", url: "https://store.steampowered.com/app/2140510/Town_of_Salem_2/" },
  { id: 27, title: "Feign", folder: "feign", players: "4-12", genre: "Dedução", platforms: ["PC", "Mobile"], price: "R$ 16,99", description: "Dedução onde você pode ser 'louco' e receber informações falsas.", linkName: "Steam", url: "https://store.steampowered.com/app/1436990/Feign/" },
  // --- SOBREVIVÊNCIA ---
  { id: 10, title: "Minecraft", folder: "minecraft", players: "Ilimitado", genre: "Sandbox", platforms: ["Todas"], price: "R$ 99,00", description: "O maior sandbox do mundo. Requer servidor para muitos players.", linkName: "Site Oficial", url: "https://www.minecraft.net/pt-br/store/minecraft-java-bedrock-edition-pc" },
  { id: 11, title: "Lethal Company", folder: "lethal-company", players: "4+", genre: "Terror Coop", platforms: ["PC"], price: "R$ 32,99", description: "Bata metas de lucro coletando sucata em luas de terror.", linkName: "Steam", url: "https://store.steampowered.com/app/1966720/Lethal_Company/" },
  { id: 12, title: "Content Warning", folder: "content-warning", players: "4+", genre: "Terror / Youtuber", platforms: ["PC"], price: "R$ 26,49", description: "Filme seus amigos morrendo para monstros e viralize na internet.", linkName: "Steam", url: "https://store.steampowered.com/app/2881650/Content_Warning/" },
  { id: 13, title: "Valheim", folder: "valheim", players: "1-10", genre: "Sobrevivência Viking", platforms: ["PC", "Xbox"], price: "R$ 37,99", description: "Explore o purgatório viking. Construa barcos e enfrente chefes.", linkName: "Steam", url: "https://store.steampowered.com/app/892970/Valheim/" },
  { id: 14, title: "Don't Starve Together", folder: "dont-starve", players: "1-6+", genre: "Sobrevivência", platforms: ["PC", "Console"], price: "R$ 27,99", description: "Não morra de fome. Estilo gótico e muito difícil.", linkName: "Steam", url: "https://store.steampowered.com/app/322330/Dont_Starve_Together/" },
  { id: 15, title: "Project Zomboid", folder: "project-zomboid", players: "Até 32+", genre: "Simulador Zumbi", platforms: ["PC"], price: "R$ 59,99", description: "O simulador de apocalipse zumbi mais detalhado que existe.", linkName: "Steam", url: "https://store.steampowered.com/app/108600/Project_Zomboid/" },
  { id: 28, title: "Barotrauma", folder: "barotrauma", players: "Até 16", genre: "Simulador Submarino", platforms: ["PC"], price: "R$ 99,99", description: "Gerencie um submarino no espaço. Complexo e claustrofóbico.", linkName: "Steam", url: "https://store.steampowered.com/app/602960/Barotrauma/" },
  // --- NAVEGADOR ---
  { id: 16, title: "Gartic Phone", folder: "gartic-phone", players: "Até 30", genre: "Desenho / Casual", platforms: ["Web"], price: "Grátis", description: "Telefone sem fio desenhado. Garantia de risadas.", linkName: "Jogar Agora", url: "https://garticphone.com" },
  { id: 17, title: "JKLM.fun", folder: "jklm", players: "16+", genre: "Palavras / Party", platforms: ["Web"], price: "Grátis", description: "O jogo da bomba, mas com digitação de palavras.", linkName: "Jogar Agora", url: "https://jklm.fun" },
  { id: 18, title: "Make It Meme", folder: "make-it-meme", players: "Até 15", genre: "Criatividade", platforms: ["Web"], price: "Grátis", description: "Crie legendas engraçadas para memes e vote nos amigos.", linkName: "Jogar Agora", url: "https://makeitmeme.com" },
  { id: 19, title: "Board Game Arena", folder: "board-game-arena", players: "Varia", genre: "Jogos de Tabuleiro", platforms: ["Web"], price: "Grátis", description: "Centenas de jogos de tabuleiro (Uno, Saboteur) no navegador.", linkName: "Acessar Site", url: "https://boardgamearena.com" },
  { id: 20, title: "StopotS", folder: "stopots", players: "Ilimitado", genre: "Palavras / Stop", platforms: ["Web", "Mobile"], price: "Grátis", description: "O famoso 'Adedonha' ou 'Stop' online.", linkName: "Jogar Agora", url: "https://stopots.com.br" },
  { id: 21, title: "Codenames Online", folder: "codenames", players: "Ilimitado", genre: "Palavras / Times", platforms: ["Web"], price: "Grátis", description: "Jogo de espiões e dicas de palavras em times.", linkName: "Jogar Agora", url: "https://codenames.game" },
  // --- SHOOTERS ---
  { id: 22, title: "Team Fortress 2", folder: "tf2", players: "Até 32", genre: "FPS de Classe", platforms: ["PC"], price: "Grátis", description: "O pai dos hero shooters. Caótico e divertido.", linkName: "Steam", url: "https://store.steampowered.com/app/440/Team_Fortress_2/" },
  { id: 23, title: "Sven Co-op", folder: "sven-coop", players: "Até 32", genre: "FPS Cooperativo", platforms: ["PC"], price: "Grátis", description: "Half-Life cooperativo para jogar a campanha com a galera.", linkName: "Steam", url: "https://store.steampowered.com/app/225840/Sven_Coop/" },
  { id: 24, title: "Halo Infinite", folder: "halo-infinite", players: "Até 28", genre: "FPS Arena", platforms: ["PC", "Xbox"], price: "Grátis", description: "Multiplayer gratuito. Crie salas privadas para batalhas épicas.", linkName: "Steam", url: "https://store.steampowered.com/app/1240440/Halo_Infinite/" },
  { id: 25, title: "Unfortunate Spacemen", folder: "unfortunate-spacemen", players: "Até 16", genre: "FPS / Terror", platforms: ["PC"], price: "Grátis", description: "Mistura de Among Us com tiroteio e monstros.", linkName: "Steam", url: "https://store.steampowered.com/app/408900/Unfortunate_Spacemen/" },
  { id: 26, title: "Unturned", folder: "unturned", players: "Até 24+", genre: "Sobrevivência / FPS", platforms: ["PC"], price: "Grátis", description: "Sobrevivência zumbi com visual simples (blocos).", linkName: "Steam", url: "https://store.steampowered.com/app/304930/Unturned/" }
];

// --- COMPONENTE: MODAL FULLSCREEN ---
const ImageModal = ({ isOpen, imageUrl, onClose }) => {
  if (!isOpen || !imageUrl) return null;

  return (
    // Overlay Escuro (Fundo)
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose} // Fecha ao clicar no fundo
    >
      {/* Botão de Fechar */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all z-50"
      >
        <X size={32} />
      </button>

      {/* Imagem (Clicar nela NÃO fecha) */}
      <img 
        src={imageUrl} 
        alt="Full screen view" 
        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl scale-100 animate-scaleIn"
        onClick={(e) => e.stopPropagation()} // Impede que o clique na imagem feche o modal
      />
    </div>
  );
};

const FilterButton = ({ active, onClick, children, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
      active 
        ? 'bg-blue-600 text-white shadow-md transform scale-105' 
        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
    }`}
  >
    {Icon && <Icon size={16} />}
    {children}
  </button>
);

const GameCard = ({ game, onImageClick }) => {
  const isWeb = game.platforms.includes("Web");
  const images = useMemo(() => getImagesForGame(game.folder, game.title), [game.folder, game.title]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden flex flex-col h-full animate-fadeIn group">
      {/* Área da Imagem (Carrossel) */}
      <div 
        className="relative h-48 w-full bg-gray-200 overflow-hidden cursor-zoom-in"
        onClick={() => onImageClick(images[currentImgIndex])} // Abre o Modal
      >
        <img 
          src={images[currentImgIndex]} 
          alt={`${game.title} screenshot`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        
        {/* Botões de Navegação (Só aparecem no hover e se tiver mais de 1 imagem) */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button 
              onClick={prevImage}
              className="p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextImage}
              className="p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Indicadores (Bolinhas) */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all ${
                  idx === currentImgIndex ? 'bg-white scale-110' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800 leading-tight">{game.title}</h3>
          {game.price.includes("Grátis") ? (
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold whitespace-nowrap">
              Grátis
            </span>
          ) : (
            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-bold whitespace-nowrap">
              {game.price}
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{game.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-500 text-xs">
            <Users size={14} className="mr-2 text-blue-500" />
            <span className="font-semibold text-gray-700 mr-1">Jogadores:</span> {game.players}
          </div>
          <div className="flex items-center text-gray-500 text-xs">
            <Tag size={14} className="mr-2 text-purple-500" />
            <span className="font-semibold text-gray-700 mr-1">Gênero:</span> {game.genre}
          </div>
          <div className="flex items-start text-gray-500 text-xs">
            <Monitor size={14} className="mr-2 mt-0.5 text-indigo-500 flex-shrink-0" />
            <div>
              <span className="font-semibold text-gray-700 mr-1">Plat:</span>
              {game.platforms.join(", ")}
            </div>
          </div>
        </div>

        <a 
          href={game.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`flex items-center justify-center w-full gap-2 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors mt-auto ${
            isWeb ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isWeb ? <Play size={16} /> : <ShoppingCart size={16} />}
          {isWeb ? game.linkName : `Baixar na ${game.linkName}`}
        </a>
      </div>
    </div>
  );
};

const GamesTable = ({ games }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fadeIn">
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 font-bold text-gray-800">Jogo</th>
            <th className="px-6 py-4 font-bold text-gray-800">Jogadores</th>
            <th className="px-6 py-4 font-bold text-gray-800">Preço (BR)</th>
            <th className="px-6 py-4 font-bold text-gray-800">Plataformas</th>
            <th className="px-6 py-4 font-bold text-gray-800">Gênero</th>
            <th className="px-6 py-4 font-bold text-gray-800">Ação</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game, index) => {
            const isWeb = game.platforms.includes("Web");
            const images = getImagesForGame(game.folder, game.title);
            
            return (
              <tr key={game.id} className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <td className="px-6 py-4 font-bold text-gray-800 whitespace-nowrap flex items-center gap-3">
                  <img src={images[0]} alt="" className="w-10 h-10 rounded object-cover border border-gray-200" />
                  {game.title}
                </td>
                <td className="px-6 py-4 text-blue-600 font-medium">{game.players}</td>
                <td className="px-6 py-4">
                  {game.price.includes("Grátis") ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Grátis</span>
                  ) : (
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">{game.price}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {game.platforms.map(p => (
                      <span key={p} className="bg-gray-100 border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-xs">{p}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{game.genre}</td>
                <td className="px-6 py-4">
                  <a 
                    href={game.url}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className={`${isWeb ? 'text-emerald-600 hover:text-emerald-800' : 'text-blue-600 hover:text-blue-800'} font-medium hover:underline flex items-center gap-1`}
                  >
                    {isWeb ? <Play size={12} /> : <ShoppingCart size={12} />}
                    {isWeb ? game.linkName : `Baixar`} <ExternalLink size={10} />
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("Todas");
  const [priceFilter, setPriceFilter] = useState("Todos");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            game.genre.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPlatform = platformFilter === "Todas" || 
        (platformFilter === "Web" && game.platforms.includes("Web")) ||
        (platformFilter === "Mobile" && game.platforms.includes("Mobile")) ||
        (platformFilter === "Console" && (game.platforms.includes("Console") || game.platforms.includes("Xbox") || game.platforms.includes("Switch")));

      const matchesPrice = priceFilter === "Todos" || 
        (priceFilter === "Grátis" && game.price.includes("Grátis")) ||
        (priceFilter === "Pago" && !game.price.includes("Grátis"));

      return matchesSearch && matchesPlatform && matchesPrice;
    });
  }, [searchTerm, platformFilter, priceFilter]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
      
      <ImageModal 
        isOpen={!!selectedImage} 
        imageUrl={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />

      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-blue-700 flex items-center gap-2">
                <Gamepad2 className="text-blue-600" />
                Galera Gamer 10+
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Catálogo de jogos com preços (Brasil) e links diretos
              </p>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <input
                    type="text"
                    placeholder="Buscar jogo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
                
                <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                   <button 
                     onClick={() => setViewMode('grid')}
                     className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                     title="Visualização em Cards"
                   >
                     <Grid size={20} />
                   </button>
                   <button 
                     onClick={() => setViewMode('table')}
                     className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                     title="Visualização em Tabela"
                   >
                     <List size={20} />
                   </button>
                </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 pt-2 border-t border-gray-100 overflow-x-auto pb-2 scrollbar-hide">
            <FilterButton active={platformFilter === "Todas"} onClick={() => setPlatformFilter("Todas")} icon={Gamepad2}>Todas</FilterButton>
            <FilterButton active={platformFilter === "Web"} onClick={() => setPlatformFilter("Web")} icon={Globe}>Web</FilterButton>
            <FilterButton active={platformFilter === "Mobile"} onClick={() => setPlatformFilter("Mobile")} icon={Smartphone}>Mobile</FilterButton>
            <FilterButton active={platformFilter === "Console"} onClick={() => setPlatformFilter("Console")} icon={Monitor}>Console</FilterButton>
            <div className="w-px h-6 bg-gray-300 mx-2 self-center hidden md:block"></div>
            <FilterButton active={priceFilter === "Todos"} onClick={() => setPriceFilter("Todos")}>Todos Preços</FilterButton>
            <FilterButton active={priceFilter === "Grátis"} onClick={() => setPriceFilter("Grátis")}>Grátis</FilterButton>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-700">{filteredGames.length} Jogos Encontrados</h2>
          {filteredGames.length === 0 && (
             <button onClick={() => {setPlatformFilter("Todas"); setPriceFilter("Todos"); setSearchTerm("")}} className="text-blue-600 text-sm hover:underline">Limpar filtros</button>
          )}
        </div>

        {filteredGames.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map(game => (
                  <GameCard 
                    key={game.id} 
                    game={game} 
                    onImageClick={(imgUrl) => setSelectedImage(imgUrl)} 
                  />
                ))}
              </div>
            ) : (
              <GamesTable games={filteredGames} />
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <Gamepad2 size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-600">Nenhum jogo encontrado</h3>
          </div>
        )}
      </main>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out forwards; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
