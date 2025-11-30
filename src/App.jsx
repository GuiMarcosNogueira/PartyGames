import React, { useState, useMemo } from 'react';
import { Search, Users, Monitor, Smartphone, Globe, Gamepad2, Tag, ShoppingCart, Info, List, Grid } from 'lucide-react';

const gamesData = [
  // 1. Party Games & Battle Royales
  {
    id: 1,
    title: "Fall Guys: Ultimate Knockout",
    players: "Até 32 (Lobbies Personalizados)",
    genre: "Party / Battle Royale",
    platforms: ["PC", "Console", "Mobile"],
    price: "Grátis",
    description: "Gincanas caóticas com jujubas. Ideal para torneios rápidos.",
    link: "Epic Games / Lojas de Apps"
  },
  {
    id: 2,
    title: "Stumble Guys",
    players: "Até 32",
    genre: "Party / Battle Royale",
    platforms: ["PC", "Mobile", "Console"],
    price: "Grátis",
    description: "Alternativa leve ao Fall Guys, roda bem em qualquer celular.",
    link: "Steam / Google Play / App Store"
  },
  {
    id: 3,
    title: "Pico Park",
    players: "10 (Classic) / 8 (Novo)",
    genre: "Puzzle Cooperativo",
    platforms: ["PC", "Switch"],
    price: "Pago / Grátis (Classic)",
    description: "Teste de amizade. Coordenação total ou caos absoluto.",
    link: "Steam"
  },
  {
    id: 4,
    title: "Crab Game",
    players: "35-40+",
    genre: "Survival / Minigames",
    platforms: ["PC"],
    price: "Grátis",
    description: "Inspirado em Round 6. Chat de proximidade essencial.",
    link: "Steam"
  },
  // 2. Dedução Social
  {
    id: 5,
    title: "Among Us",
    players: "15 (até 100 com Mods)",
    genre: "Dedução Social",
    platforms: ["PC", "Mobile", "Console"],
    price: "Pago (PC) / Grátis (Mobile)",
    description: "Descubra o impostor antes que ele elimine a tripulação.",
    link: "Steam / Lojas de Apps"
  },
  {
    id: 6,
    title: "Goose Goose Duck",
    players: "16+",
    genre: "Dedução Social",
    platforms: ["PC", "Mobile"],
    price: "Grátis",
    description: "Similar ao Among Us, mas com patos e chat de voz nativo.",
    link: "Steam / Mobile"
  },
  {
    id: 7,
    title: "Dale & Dawson Stationery Supplies",
    players: "Até 21",
    genre: "Roleplay / Dedução",
    platforms: ["PC"],
    price: "Pago",
    description: "Simulador de escritório. Quem trabalha e quem finge (Slackers)?",
    link: "Steam"
  },
  {
    id: 8,
    title: "Lockdown Protocol",
    players: "Até 16",
    genre: "Dedução / FPS",
    platforms: ["PC"],
    price: "Pago",
    description: "Tarefas cooperativas com traidores armados em primeira pessoa.",
    link: "Steam"
  },
  {
    id: 9,
    title: "Town of Salem 2",
    players: "15",
    genre: "Dedução / Lógica",
    platforms: ["PC"],
    price: "Grátis (Limitado) / Pago",
    description: "Xadrez social com muitos papéis e habilidades complexas.",
    link: "Steam"
  },
  // 3. Sobrevivência e Sandbox
  {
    id: 10,
    title: "Minecraft (Java)",
    players: "Ilimitado (Servidor Dedicado)",
    genre: "Sandbox / Sobrevivência",
    platforms: ["PC", "Console", "Mobile"],
    price: "Pago",
    description: "Construa e sobreviva. Requer servidor próprio para muitos jogadores.",
    link: "Site Oficial"
  },
  {
    id: 11,
    title: "Lethal Company",
    players: "32-50 (Com Mod)",
    genre: "Terror Cooperativo",
    platforms: ["PC"],
    price: "Pago",
    description: "Colete sucata em luas perigosas. Requer mod 'MoreCompany'.",
    link: "Steam"
  },
  {
    id: 12,
    title: "Content Warning",
    players: "16+ (Com Mod)",
    genre: "Terror / Comédia",
    platforms: ["PC"],
    price: "Pago",
    description: "Filme monstros para viralizar no SpookTube.",
    link: "Steam"
  },
  {
    id: 13,
    title: "Valheim",
    players: "10+ (Com Mod)",
    genre: "Sobrevivência Viking",
    platforms: ["PC", "Xbox"],
    price: "Pago",
    description: "Explore o purgatório viking. Mods ajudam a passar de 10 players.",
    link: "Steam"
  },
  {
    id: 14,
    title: "Don't Starve Together",
    players: "6 (20-64 Com Mod)",
    genre: "Sobrevivência",
    platforms: ["PC", "Console"],
    price: "Pago",
    description: "Sobrevivência gótica e difícil. Mods expandem o limite facilmente.",
    link: "Steam"
  },
  {
    id: 15,
    title: "Project Zomboid",
    players: "32-100",
    genre: "Sobrevivência Hardcore",
    platforms: ["PC"],
    price: "Pago",
    description: "Simulador de apocalipse zumbi extremamente detalhado.",
    link: "Steam"
  },
  // 4. Navegador
  {
    id: 16,
    title: "Gartic Phone",
    players: "Até 30",
    genre: "Casual / Desenho",
    platforms: ["Web"],
    price: "Grátis",
    description: "O telefone sem fio desenhado. Garantia de risadas.",
    link: "garticphone.com"
  },
  {
    id: 17,
    title: "JKLM.fun",
    players: "16+ (Fila)",
    genre: "Palavras / Party",
    platforms: ["Web"],
    price: "Grátis",
    description: "Jogo da bomba com palavras e conhecimentos gerais.",
    link: "jklm.fun"
  },
  {
    id: 18,
    title: "Make It Meme",
    players: "15+",
    genre: "Criatividade",
    platforms: ["Web"],
    price: "Grátis",
    description: "Crie legendas para memes e vote nos melhores.",
    link: "makeitmeme.com"
  },
  {
    id: 19,
    title: "Board Game Arena",
    players: "10-12",
    genre: "Jogos de Tabuleiro",
    platforms: ["Web"],
    price: "Grátis / Freemium",
    description: "Versões digitais de jogos como Saboteur e 6 nimmt!.",
    link: "boardgamearena.com"
  },
  {
    id: 25,
    title: "StopotS",
    players: "Ilimitado",
    genre: "Palavras / Adedonha",
    platforms: ["Web", "Mobile"],
    price: "Grátis",
    description: "O famoso Stop online. Categorias personalizáveis.",
    link: "stopots.com.br"
  },
  {
    id: 26,
    title: "Codenames Online",
    players: "Ilimitado",
    genre: "Palavras / Times",
    platforms: ["Web"],
    price: "Grátis",
    description: "Jogo de espionagem e palavras em times.",
    link: "codenames.game"
  },
  // 5. Shooters
  {
    id: 20,
    title: "Team Fortress 2",
    players: "32-100",
    genre: "FPS",
    platforms: ["PC"],
    price: "Grátis",
    description: "O clássico hero shooter. Servidores comunitários suportam caos total.",
    link: "Steam"
  },
  {
    id: 21,
    title: "Sven Co-op",
    players: "Até 32",
    genre: "FPS Cooperativo",
    platforms: ["PC"],
    price: "Grátis",
    description: "Half-Life cooperativo. Roda em qualquer computador.",
    link: "Steam"
  },
  {
    id: 22,
    title: "Halo Infinite",
    players: "Até 28",
    genre: "FPS Arena",
    platforms: ["PC", "Xbox"],
    price: "Grátis (Multiplayer)",
    description: "Partidas personalizadas (Custom Games) suportam grandes times.",
    link: "Steam / Xbox App"
  },
  {
    id: 23,
    title: "Unfortunate Spacemen",
    players: "Até 16",
    genre: "FPS / Dedução",
    platforms: ["PC"],
    price: "Grátis",
    description: "Mistura de tiroteio com a paranóia de Among Us.",
    link: "Steam"
  },
  {
    id: 24,
    title: "Unturned",
    players: "24+",
    genre: "Sobrevivência / FPS",
    platforms: ["PC", "Console"],
    price: "Grátis",
    description: "Sobrevivência zumbi com visual simples estilo bloco.",
    link: "Steam"
  }
];

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

const GameCard = ({ game }) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col h-full animate-fadeIn">
    <div className="p-5 flex-1">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-800 leading-tight">{game.title}</h3>
        {game.price === "Grátis" ? (
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold whitespace-nowrap">
            Grátis
          </span>
        ) : (
          <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-bold whitespace-nowrap">
            {game.price}
          </span>
        )}
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{game.description}</p>
      
      <div className="space-y-2">
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
    </div>
    
    <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center">
      <div className="flex items-center text-xs text-gray-500">
        <ShoppingCart size={14} className="mr-1" />
        {game.link}
      </div>
    </div>
  </div>
);

const GamesTable = ({ games }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fadeIn">
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 font-bold text-gray-800">Jogo</th>
            <th className="px-6 py-4 font-bold text-gray-800">Jogadores (Max)</th>
            <th className="px-6 py-4 font-bold text-gray-800">Preço</th>
            <th className="px-6 py-4 font-bold text-gray-800">Plataformas</th>
            <th className="px-6 py-4 font-bold text-gray-800">Gênero</th>
            <th className="px-6 py-4 font-bold text-gray-800">Onde Adquirir</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game, index) => (
            <tr key={game.id} className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
              <td className="px-6 py-4 font-bold text-gray-800 whitespace-nowrap">{game.title}</td>
              <td className="px-6 py-4 text-blue-600 font-medium">{game.players}</td>
              <td className="px-6 py-4">
                {game.price === "Grátis" ? (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Grátis</span>
                ) : (
                  <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold">{game.price}</span>
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
              <td className="px-6 py-4 text-gray-500 italic">{game.link}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("Todas");
  const [priceFilter, setPriceFilter] = useState("Todos");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'

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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-blue-700 flex items-center gap-2">
                <Gamepad2 className="text-blue-600" />
                Galera Gamer 10+
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Catálogo de jogos para grupos grandes (baseado no relatório técnico)
              </p>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <input
                    type="text"
                    placeholder="Buscar jogo ou gênero..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
                
                {/* View Toggles */}
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
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-4 pt-2 border-t border-gray-100 overflow-x-auto pb-2 scrollbar-hide">
            <FilterButton 
              active={platformFilter === "Todas"} 
              onClick={() => setPlatformFilter("Todas")}
              icon={Gamepad2}
            >
              Todas Plats
            </FilterButton>
            <FilterButton 
              active={platformFilter === "Web"} 
              onClick={() => setPlatformFilter("Web")}
              icon={Globe}
            >
              Navegador (Web)
            </FilterButton>
            <FilterButton 
              active={platformFilter === "Mobile"} 
              onClick={() => setPlatformFilter("Mobile")}
              icon={Smartphone}
            >
              Celular
            </FilterButton>
            <FilterButton 
              active={platformFilter === "Console"} 
              onClick={() => setPlatformFilter("Console")}
              icon={Monitor}
            >
              Consoles
            </FilterButton>
            
            <div className="w-px h-6 bg-gray-300 mx-2 self-center hidden md:block"></div>
            
            <FilterButton 
              active={priceFilter === "Todos"} 
              onClick={() => setPriceFilter("Todos")}
            >
              Todos Preços
            </FilterButton>
            <FilterButton 
              active={priceFilter === "Grátis"} 
              onClick={() => setPriceFilter("Grátis")}
            >
              Apenas Grátis
            </FilterButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-700">
            {filteredGames.length} Jogos Encontrados
          </h2>
          {filteredGames.length === 0 && (
             <button 
               onClick={() => {setPlatformFilter("Todas"); setPriceFilter("Todos"); setSearchTerm("")}}
               className="text-blue-600 text-sm hover:underline"
             >
               Limpar filtros
             </button>
          )}
        </div>

        {filteredGames.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map(game => (
                  <GameCard key={game.id} game={game} />
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
            <p className="text-gray-400 mt-2">Tente ajustar seus filtros de busca.</p>
          </div>
        )}
        
        <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-start gap-4">
            <Info className="text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-blue-800 mb-2">Dica para o Organizador</h3>
              <p className="text-sm text-blue-700">
                Lembre-se: Mesmo em jogos que suportam 100 pessoas (como os Battle Royales), para garantir que todos caiam na mesma partida, você geralmente precisa criar um "Lobby Privado" (Custom Game). Verifique sempre se o jogo oferece essa opção (Custom Games/Private Match) antes de reunir todo mundo.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-auto py-8 text-center text-sm text-gray-500">
        <p>© 2025 Guia de Jogos Multiplayer. Dados baseados no relatório técnico.</p>
      </footer>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
