import { useState, useEffect } from 'react';
import { FaPizzaSlice, FaFilm, FaPlane, FaFutbol, FaPalette, FaTools, FaFolder, FaGamepad, FaHome, FaGlassCheers, FaTv, FaMusic, FaCocktail, FaBriefcase, FaLaptop, FaPaw, FaStar, FaBrain, FaLayerGroup, FaDice } from 'react-icons/fa';

// En production (Vercel), l'API est sur la même URL (/api). En local, on interroge le port 3001.
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

// Génération d'un pool d'avatars très inclusifs, ultra colorés et premium (Style Micah de DiceBear)
const AVATARS_POOL = [
    "Alex", "Sam", "Charlie", "Jordan", "Taylor", "Casey", "Riley", "Morgan", 
    "Avery", "Quinn", "Parker", "Reese", "Rowan", "Blake", "Emerson", "Finley"
].map(seed => `https://api.dicebear.com/9.x/micah/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc,b3e5fc,c8e6c9`);

const CATEGORY_STYLES = {
    "nourriture": { icon: FaPizzaSlice, bg: "from-orange-400 via-orange-500 to-red-500", glow: "shadow-orange-500/40" },
    "boissons": { icon: FaCocktail, bg: "from-pink-400 via-pink-500 to-rose-500", glow: "shadow-pink-500/40" },
    "cinema": { icon: FaFilm, bg: "from-indigo-400 via-indigo-500 to-purple-600", glow: "shadow-indigo-500/40" },
    "series": { icon: FaTv, bg: "from-violet-400 via-violet-500 to-fuchsia-600", glow: "shadow-violet-500/40" },
    "jeux_video": { icon: FaGamepad, bg: "from-blue-400 via-blue-500 to-cyan-500", glow: "shadow-blue-500/40" },
    "musique": { icon: FaMusic, bg: "from-amber-400 via-amber-500 to-orange-500", glow: "shadow-amber-500/40" },
    "voyage": { icon: FaPlane, bg: "from-sky-400 via-sky-500 to-blue-600", glow: "shadow-sky-500/40" },
    "sport": { icon: FaFutbol, bg: "from-green-400 via-emerald-500 to-teal-600", glow: "shadow-emerald-500/40" },
    "animaux": { icon: FaPaw, bg: "from-yellow-500 via-yellow-600 to-amber-700", glow: "shadow-yellow-600/40" },
    "metiers": { icon: FaBriefcase, bg: "from-slate-400 via-slate-500 to-slate-700", glow: "shadow-slate-500/40" },
    "culture": { icon: FaPalette, bg: "from-pink-400 via-rose-500 to-red-500", glow: "shadow-rose-500/40" },
    "technologie": { icon: FaLaptop, bg: "from-blue-500 via-blue-600 to-indigo-700", glow: "shadow-blue-600/40" },
    "custom": { icon: FaTools, bg: "from-yellow-400 via-amber-500 to-orange-500", glow: "shadow-amber-600/40" },
    "hardcore": { icon: FaBrain, bg: "from-purple-400 via-purple-500 to-indigo-600", glow: "shadow-purple-500/40" },
    "quotidien": { icon: FaHome, bg: "from-teal-400 via-teal-500 to-emerald-600", glow: "shadow-teal-500/40" },
    "soiree": { icon: FaGlassCheers, bg: "from-rose-400 via-rose-500 to-pink-600", glow: "shadow-rose-500/40" },
    "divers": { icon: FaLayerGroup, bg: "from-slate-500 via-slate-600 to-slate-800", glow: "shadow-slate-600/40" },
    "default": { icon: FaStar, bg: "from-fuchsia-400 via-fuchsia-500 to-purple-600", glow: "shadow-fuchsia-500/40" }
};

const getCategoryStyles = (key, name = "") => {
    const textToSearch = `${key} ${name}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    if (textToSearch.includes('hardcore') || textToSearch.includes('abstrait')) return CATEGORY_STYLES.hardcore;
    if (textToSearch.includes('quotidienne') || textToSearch.includes('vie')) return CATEGORY_STYLES.quotidien;
    if (textToSearch.includes('soiree') || textToSearch.includes('fun')) return CATEGORY_STYLES.soiree;
    if (textToSearch.includes('divers') || textToSearch.includes('autre')) return CATEGORY_STYLES.divers;
    
    if (textToSearch.includes('nourriture') || textToSearch.includes('food')) return CATEGORY_STYLES.nourriture;
    if (textToSearch.includes('boisson') || textToSearch.includes('drink')) return CATEGORY_STYLES.boissons;
    if (textToSearch.includes('cinema') || textToSearch.includes('pop')) return CATEGORY_STYLES.cinema;
    if (textToSearch.includes('serie') || textToSearch.includes('tv')) return CATEGORY_STYLES.series;
    if (textToSearch.includes('geek') || textToSearch.includes('jeu')) return CATEGORY_STYLES.jeux_video;
    if (textToSearch.includes('musique') || textToSearch.includes('music')) return CATEGORY_STYLES.musique;
    if (textToSearch.includes('voyage') || textToSearch.includes('travel')) return CATEGORY_STYLES.voyage;
    if (textToSearch.includes('sport')) return CATEGORY_STYLES.sport;
    if (textToSearch.includes('animaux') || textToSearch.includes('animal')) return CATEGORY_STYLES.animaux;
    if (textToSearch.includes('metier') || textToSearch.includes('job')) return CATEGORY_STYLES.metiers;
    if (textToSearch.includes('culture') || textToSearch.includes('art')) return CATEGORY_STYLES.culture;
    if (textToSearch.includes('techno') || textToSearch.includes('tech')) return CATEGORY_STYLES.technologie;
    if (textToSearch.includes('custom')) return CATEGORY_STYLES.custom;

    return CATEGORY_STYLES.default; 
};

function App() {
    const [screen, setScreen] = useState('home'); 
    const [setupStep, setSetupStep] = useState('category'); 
    const [themes, setThemes] = useState({});
    
    const [defaultPlayers, setDefaultPlayers] = useState(() => {
        const saved = localStorage.getItem('undercover_default_players_v2');
        return saved ? JSON.parse(saved) : [];
    });

    const [localCustomPairs, setLocalCustomPairs] = useState(() => {
        const saved = localStorage.getItem('undercover_local_custom_pairs');
        return saved ? JSON.parse(saved) : [];
    });

    const [players, setPlayers] = useState(() => {
        const saved = localStorage.getItem('undercover_default_players_v2');
        return saved ? JSON.parse(saved) : [];
    });

    const [newPlayerName, setNewPlayerName] = useState("");
    const [selectedAvatar, setSelectedAvatar] = useState(AVATARS_POOL[0]); 
    const [selectedTheme, setSelectedTheme] = useState("random"); 
    const [playedThemeName, setPlayedThemeName] = useState("");
    
    const [undercoverCount, setUndercoverCount] = useState(1);
    const [mrWhiteCount, setMrWhiteCount] = useState(0);

    const [activeWordPair, setActiveWordPair] = useState({ civil: "", undercover: "" });
    const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
    const [revealStep, setRevealStep] = useState('pass'); 
    const [startingPlayer, setStartingPlayer] = useState("");
    const [startingPlayerAvatar, setStartingPlayerAvatar] = useState("");
    const [eliminatedPlayer, setEliminatedPlayer] = useState(null);
    const [winner, setWinner] = useState(null); 

    const [customCivil, setCustomCivil] = useState("");
    const [customUndercover, setCustomUndercover] = useState("");
    const [showCustomManager, setShowCustomManager] = useState(false);
    const [customAlert, setCustomAlert] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const fetchThemes = async () => {
        try {
            const response = await fetch(`${API_URL}/themes?_t=${Date.now()}`);
            const data = await response.json();

            if (data.success) {
                const mergedThemes = { ...data.themes };
                
                localCustomPairs.forEach(pair => {
                    const cat = pair.category || 'autre';
                    if (mergedThemes[cat]) {
                        mergedThemes[cat].count = (mergedThemes[cat].count || 0) + 1;
                    }
                });

                mergedThemes['custom'] = {
                    name: "Vos Mots",
                    icon: "fa-star",
                    color: "from-yellow-500 to-amber-600",
                    count: localCustomPairs.length
                };

                setThemes(mergedThemes);
            }
        } catch (error) {
            triggerAlert("Impossible de se connecter au serveur backend.", "Erreur Réseau");
        }
    };

    useEffect(() => {
        fetchThemes();
    }, [localCustomPairs]);

    // --- CORRECTION : AJUSTEMENT AUTOMATIQUE EN ARRIÈRE-PLAN ---
    useEffect(() => {
        if (players.length > 0) {
            const maxUndercover = Math.max(1, Math.floor((players.length - 1) / 3));
            let newUc = undercoverCount;
            
            // Rabaisse automatiquement les imposteurs si on supprime des joueurs
            if (undercoverCount > maxUndercover) {
                newUc = maxUndercover;
                setUndercoverCount(maxUndercover);
            }
            
            // Retire Mr White automatiquement s'il n'y a plus assez de civils
            if (mrWhiteCount === 1 && (players.length - newUc < 3)) {
                setMrWhiteCount(0);
            }
        }
    }, [players.length]);
    // -----------------------------------------------------------

    const triggerAlert = (message, title = "Info") => {
        setCustomAlert({ title, message });
    };

    const addPlayer = () => {
        if (!newPlayerName.trim()) return;
        const newId = players.length > 0 ? Math.max(...players.map(p => p.id)) + 1 : 1;
        setPlayers([...players, { id: newId, name: newPlayerName.trim(), avatar: selectedAvatar, role: "", word: "", isEliminated: false }]);
        setNewPlayerName("");
        
        const currentIdx = AVATARS_POOL.indexOf(selectedAvatar);
        const nextIdx = (currentIdx + 1) % AVATARS_POOL.length;
        setSelectedAvatar(AVATARS_POOL[nextIdx]);
    };

    const removePlayer = (id) => {
        setPlayers(players.filter(p => p.id !== id));
    };

    const resetPlayersToSavedDefault = () => {
        if (defaultPlayers.length === 0) {
            triggerAlert("Vous n'avez pas encore enregistré de liste par défaut. Ajoutez des joueurs puis cliquez sur 'Enregistrer'.", "Aucune liste");
            return;
        }
        setPlayers(defaultPlayers.map(p => ({ ...p, role: "", word: "", isEliminated: false })));
        setNewPlayerName("");
    };

    const saveCurrentListAsDefault = () => {
        if (players.length < 3) {
            triggerAlert("Il faut au moins 3 joueurs pour enregistrer une configuration !", "Action Impossible");
            return;
        }
        const cleanList = players.map((p, idx) => ({ id: idx + 1, name: p.name, avatar: p.avatar, role: "", word: "", isEliminated: false }));
        setDefaultPlayers(cleanList);
        localStorage.setItem('undercover_default_players_v2', JSON.stringify(cleanList));
    };

    const deleteDefaultList = () => {
        setDefaultPlayers([]);
        localStorage.removeItem('undercover_default_players_v2');
    };

    const clearPlayersList = () => {
        setPlayers([]);
        setNewPlayerName("");
    };

    const resetGameToSetup = () => {
        setPlayers(defaultPlayers.map(p => ({ ...p, role: "", word: "", isEliminated: false })));
        setNewPlayerName("");
        setSelectedTheme("random");
        setUndercoverCount(1);
        setMrWhiteCount(0);
        setWinner(null);
        setEliminatedPlayer(null);
        setSetupStep('category');
        setScreen('setup');
    };

    // --- CORRECTION : LOGIQUE DES ALERTES POUR LES ROLES ---
    const handleAddUndercover = () => {
        const maxUndercover = Math.max(1, Math.floor((players.length - 1) / 3));
        if (undercoverCount >= maxUndercover) {
            triggerAlert(`Avec <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500 font-black">${players.length} joueurs</span>, vous avez atteint le maximum d'<span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500 font-black">Infiltrés</span> pour un jeu équilibré.`, "Limite Atteinte");
        } else {
            setUndercoverCount(undercoverCount + 1);
        }
    };

    const handleRemoveUndercover = () => {
        if (undercoverCount <= 1) {
            triggerAlert(`Il faut au minimum <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500 font-black">1 Imposteur</span> pour lancer la partie !`, "Minimum Requis");
        } else {
            setUndercoverCount(undercoverCount - 1);
        }
    };

    const handleSetMrWhite = (value) => {
        if (value === 1) {
            if (players.length - undercoverCount < 3) {
                triggerAlert(`Il faut suffisamment de civils pour ajouter <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500 font-black">Mr. White</span>. Rajoutez des joueurs ou diminuez les infiltrés !`, "Action Impossible");
                return;
            }
        }
        setMrWhiteCount(value);
    };
    // -------------------------------------------------------

    const addCustomWordPair = async () => {
        if (!customCivil.trim() || !customUndercover.trim()) {
            triggerAlert("Veuillez remplir les deux cases pour valider votre paire !", "Erreur");
            return;
        }
        setIsAnalyzing(true);
        try {
            const response = await fetch(`${API_URL}/custom-pair`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ civil: customCivil, undercover: customUndercover })
            });
            const data = await response.json();
            setIsAnalyzing(false);

            if (data.success) {
                if (data.valid) {
                    const validatedCategory = data.category || 'autre';
                    const newPair = { civil: customCivil.trim(), undercover: customUndercover.trim(), category: validatedCategory };
                    const updatedPairs = [...localCustomPairs, newPair];
                    setLocalCustomPairs(updatedPairs);
                    localStorage.setItem('undercover_local_custom_pairs', JSON.stringify(updatedPairs));
                    setCustomCivil("");
                    setCustomUndercover("");
                    
                } else {
                    triggerAlert(`Rejeté par la validation : "${data.reason}"`, "Paire Refusée");
                }
            } else {
                triggerAlert(data.error || "Erreur d'enregistrement.", "Erreur");
            }
        } catch (error) {
            setIsAnalyzing(false);
            triggerAlert("Connexion impossible avec le serveur.", "Erreur");
        }
    };

    const clearCustomWords = () => {
        setLocalCustomPairs([]);
        localStorage.removeItem('undercover_local_custom_pairs');
    };

    const startGame = async () => {
        if (players.length < 3) {
            triggerAlert("Il faut au moins 3 joueurs pour lancer la partie !", "Démarrage Impossible");
            return;
        }

        // --- CORRECTION : VERROUILLAGE FINAL DE SÉCURITÉ ---
        const maxUndercoverSafe = Math.max(1, Math.floor((players.length - 1) / 3));
        if (undercoverCount > maxUndercoverSafe || (mrWhiteCount === 1 && players.length - undercoverCount < 3)) {
            triggerAlert(`Mise à jour de sécurité : Avec <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500 font-black">${players.length} joueurs</span>, les rôles ont été réajustés pour garder le jeu équilibré.`, "Rééquilibrage");
            setUndercoverCount(Math.min(undercoverCount, maxUndercoverSafe));
            if (mrWhiteCount === 1 && players.length - Math.min(undercoverCount, maxUndercoverSafe) < 3) setMrWhiteCount(0);
            return; 
        }
        // ---------------------------------------------------

        let themeToFetch = selectedTheme;
        if (selectedTheme === 'random') {
            const availableKeys = Object.keys(themes).filter(k => k !== 'custom');
            if (availableKeys.length > 0) {
                themeToFetch = availableKeys[Math.floor(Math.random() * availableKeys.length)];
            } else {
                themeToFetch = 'nourriture';
            }
        }

        const localPairsForTheme = localCustomPairs.filter(p => p.category === themeToFetch);
        const serverThemeCount = themes[themeToFetch]?.count - localPairsForTheme.length;

        let chosenPair = null;

        if (themeToFetch === 'custom') {
            if (localCustomPairs.length === 0) {
                triggerAlert("Votre stockage de mots personnalisés est vide ! Ajoutez-en d'abord.", "Attention");
                return;
            }
            chosenPair = localCustomPairs[Math.floor(Math.random() * localCustomPairs.length)];
        } else {
            const totalWords = (serverThemeCount || 0) + localPairsForTheme.length;
            if (totalWords === 0) {
                triggerAlert("Cette thématique est vide.", "Attention");
                return;
            }
            const randIndex = Math.floor(Math.random() * totalWords);
            if (randIndex < localPairsForTheme.length) {
                chosenPair = localPairsForTheme[randIndex];
            } else {
                try {
                    const response = await fetch(`${API_URL}/random-pair?theme=${themeToFetch}&_t=${Date.now()}`);
                    const data = await response.json();
                    if (data.success) {
                        chosenPair = data.pair;
                    }
                } catch (err) {
                    console.warn("Échec de connexion serveur.");
                }
            }
        }

        if (!chosenPair) {
            triggerAlert("Erreur de récupération d'une paire de mots.", "Erreur");
            return;
        }

        setActiveWordPair(chosenPair);
        
        const themeName = themes[themeToFetch]?.name || "Aléatoire";
        const emojiIndex = themeName.indexOf(' ');
        setPlayedThemeName(emojiIndex !== -1 ? themeName.substring(emojiIndex + 1) : themeName);

        // Lancement avec les bonnes variables
        let rolesPool = [];
        for (let i = 0; i < undercoverCount; i++) rolesPool.push('undercover');
        for (let i = 0; i < mrWhiteCount; i++) rolesPool.push('mr_white');
        const civilCount = players.length - undercoverCount - mrWhiteCount;
        for (let i = 0; i < civilCount; i++) rolesPool.push('civilian');
        rolesPool.sort(() => Math.random() - 0.5);

        const updatedPlayers = players.map((player, index) => {
            const role = rolesPool[index];
            let word = "";
            if (role === 'civilian') word = chosenPair.civil;
            else if (role === 'undercover') word = chosenPair.undercover;
            else word = "???";

            return { ...player, role, word, isEliminated: false };
        });

        setPlayers(updatedPlayers);
        setCurrentRevealIndex(0);
        setRevealStep('pass');

        const civilians = updatedPlayers.filter(p => p.role === 'civilian');
        const randomCivil = civilians[Math.floor(Math.random() * civilians.length)];
        setStartingPlayer(randomCivil.name);
        setStartingPlayerAvatar(randomCivil.avatar);
        setScreen('reveal');
    };

    const handleRevealWord = () => setRevealStep('show');
    const handleNextReveal = () => {
        if (currentRevealIndex < players.length - 1) {
            setCurrentRevealIndex(currentRevealIndex + 1);
            setRevealStep('pass');
        } else setScreen('gameplay');
    };

    const eliminatePlayerAction = (player) => {
        const updatedPlayers = players.map(p => p.id === player.id ? { ...p, isEliminated: true } : p);
        setPlayers(updatedPlayers);
        setEliminatedPlayer(player);
        
        // Au lieu de vérifier la victoire direct, on affiche le rôle avec suspense !
        setTimeout(() => {
            setScreen('eliminated_role');
        }, 800);
    };

    const handleMrWhiteGuess = (isCorrect) => {
        if (isCorrect) {
            setWinner('undercovers_and_white');
            setScreen('gameover');
        } else {
            triggerAlert(`Ce n'était pas le mot des civils. Mr. White est éliminé ! Le mot était : "${activeWordPair.civil}"`, "Fin");
            checkWinConditions(players);
        }
    };

    const checkWinConditions = (currentPlayers) => {
        const survivors = currentPlayers.filter(p => !p.isEliminated);
        const activeCivilians = survivors.filter(p => p.role === 'civilian').length;
        const activeUndercovers = survivors.filter(p => p.role === 'undercover').length;
        const activeMrWhites = survivors.filter(p => p.role === 'mr_white').length;

        if (activeUndercovers === 0 && activeMrWhites === 0) {
            setWinner('civilians'); setScreen('gameover'); return;
        }
        if (activeUndercovers + activeMrWhites >= activeCivilians) {
            setWinner('undercovers_and_white'); setScreen('gameover'); return;
        }

        const survivorsList = survivors.filter(p => p.role === 'civilian');
        if (survivorsList.length > 0) {
            const nextStarter = survivorsList[Math.floor(Math.random() * survivorsList.length)];
            setStartingPlayer(nextStarter.name);
            setStartingPlayerAvatar(nextStarter.avatar);
        }
        setScreen('gameplay');
    };

    return (
        <div className="w-full max-w-md h-screen sm:h-[820px] bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden relative shadow-2xl sm:rounded-[40px] sm:border-[12px] sm:border-slate-800 animate-fade-in">
            
            <style>{`
                @keyframes eliminateCard {
                    0% { transform: scale(1); filter: grayscale(0%); opacity: 1; }
                    100% { transform: scale(0.95); filter: grayscale(100%); opacity: 0.4; border-color: #450a0a; }
                }
                .animate-eliminate-card { animation: eliminateCard 0.4s ease-out forwards; }
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>

            {/* ALERTS (Design Blanc Premium avec gradient Bleu/Émeraude) */}
            {customAlert && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in">
                    <div className="bg-white rounded-[32px] p-6 w-full max-w-xs text-center space-y-5 shadow-2xl">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-full flex items-center justify-center mx-auto text-3xl border border-emerald-100/50 shadow-inner">
                            <i className="fa-solid fa-circle-info text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-emerald-400"></i>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xl font-black text-slate-900 tracking-tight">{customAlert.title}</h4>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: customAlert.message }}></p>
                        </div>
                        <button onClick={() => setCustomAlert(null)} className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-400 hover:to-emerald-400 text-white py-4 rounded-2xl text-sm font-black transition-all active:scale-95 shadow-lg shadow-emerald-500/30">
                            C'est compris
                        </button>
                    </div>
                </div>
            )}

            {/* SCREEN ACCUEIL */}
            {screen === 'home' && (
                <div className="flex-1 flex flex-col justify-between p-6 relative">
                    <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none"></div>

                    <div className="flex flex-col items-center justify-center flex-1 space-y-12 z-10">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <div className="absolute inset-0 border border-slate-700/50 rounded-full animate-[spin_10s_linear_infinite] border-t-indigo-500/80"></div>
                            <div className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/10 z-10">
                                <i className="fa-solid fa-user-secret text-4xl text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]"></i>
                            </div>
                        </div>

                        <div className="text-center space-y-4">
                            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white">
                                IMPOSTEUR
                            </h1>
                            <p className="text-slate-400 text-sm font-medium px-4 leading-relaxed max-w-[280px] mx-auto">
                                Un téléphone. Un mot secret.<br/>
                                <span className="text-indigo-400 font-bold">Qui saura bluffer ?</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex h-24 gap-3 z-10 w-full pb-2">
                        <button onClick={() => setShowCustomManager(true)} className="group relative w-24 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700/50 rounded-[28px] flex flex-col items-center justify-center gap-2.5 transition-all active:scale-[0.95]">
                            <div className="relative">
                                <i className="fa-solid fa-pen-nib text-slate-400 group-hover:text-indigo-400 transition-colors text-xl"></i>
                                {localCustomPairs.length > 0 && (
                                    <span className="absolute -top-2.5 -right-3 min-w-[20px] h-[20px] bg-indigo-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-slate-900 shadow-sm px-1">
                                        {localCustomPairs.length}
                                    </span>
                                )}
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center">Mots</span>
                        </button>

                        <button onClick={() => { setScreen('setup'); setSetupStep('category'); }} className="group relative flex-1 bg-white hover:bg-slate-50 text-slate-950 rounded-[28px] p-5 flex items-center justify-between transition-all active:scale-[0.97] shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden">
                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-slate-200/60 rounded-full blur-2xl group-hover:bg-indigo-200/50 transition-colors duration-500"></div>
                            <div className="text-left relative z-10">
                                <span className="block text-[11px] font-bold text-slate-400 mb-0.5 uppercase tracking-widest">Nouvelle Partie</span>
                                <span className="block text-2xl font-black tracking-tight leading-none text-slate-900">Jouer</span>
                            </div>
                            <div className="relative z-10 w-14 h-14 bg-slate-950 rounded-[20px] flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:-rotate-3 group-hover:shadow-indigo-500/30 transition-all duration-300">
                                <i className="fa-solid fa-play text-white ml-1 text-lg"></i>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {/* SCREEN GESTION DES MOTS SECRETS */}
            {showCustomManager && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl z-50 flex flex-col justify-between p-6 animate-fade-in">
                    <div className="flex-1 overflow-y-auto pb-4 scrollbar-none">
                        <div className="flex items-start justify-between mb-10">
                            <div>
                                <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                                    Vos Mots
                                </h3>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                                    Ajoutez vos paires au jeu
                                </p>
                            </div>
                            <button onClick={() => setShowCustomManager(false)} className="w-10 h-10 bg-white hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-950 transition-all active:scale-90 shadow-lg shadow-white/10">
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {isAnalyzing ? (
                                <div className="py-12 flex flex-col items-center justify-center space-y-5 animate-pulse">
                                    <div className="relative flex items-center justify-center w-16 h-16">
                                        <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
                                        <i className="fa-solid fa-wand-magic-sparkles text-amber-500 text-xl"></i>
                                    </div>
                                    <div className="text-center space-y-1">
                                        <h4 className="text-sm font-bold text-white">Validation par l'IA...</h4>
                                        <p className="text-xs text-slate-400 max-w-[200px] mx-auto leading-relaxed">Vérification de l'équilibre et de la jouabilité du doublon.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-300 ml-2">Mot du Civil</label>
                                        <input 
                                            type="text" 
                                            placeholder="Ex: Coca-Cola" 
                                            value={customCivil} 
                                            onChange={(e) => setCustomCivil(e.target.value)} 
                                            className="w-full bg-transparent border-2 border-white/20 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:bg-amber-500/5 text-base font-bold transition-all" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-300 ml-2">Mot de l'Imposteur</label>
                                        <input 
                                            type="text" 
                                            placeholder="Ex: Pepsi" 
                                            value={customUndercover} 
                                            onChange={(e) => setCustomUndercover(e.target.value)} 
                                            className="w-full bg-transparent border-2 border-white/20 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:bg-orange-500/5 text-base font-bold transition-all" 
                                        />
                                    </div>
                                    <button onClick={addCustomWordPair} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-black py-4 rounded-2xl text-sm active:scale-[0.98] transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 mt-4">
                                        <i className="fa-solid fa-plus text-xs"></i> Injecter dans le jeu
                                    </button>
                                </div>
                            )}

                            <div className="pt-8 flex items-center justify-between border-t border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-transparent text-amber-400 rounded-xl flex items-center justify-center border-2 border-amber-500/30">
                                        <i className="fa-solid fa-database"></i>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">En mémoire</p>
                                        <p className="text-sm font-black text-white">{localCustomPairs.length} paires perso</p>
                                    </div>
                                </div>
                                {localCustomPairs.length > 0 && (
                                    <button onClick={clearCustomWords} className="w-10 h-10 bg-transparent text-red-400 hover:text-red-300 rounded-xl flex items-center justify-center transition-all active:scale-90 border-2 border-red-500/30 hover:border-red-400">
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={() => setShowCustomManager(false)} className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl text-sm active:scale-[0.98] transition-all shadow-lg shrink-0">
                        Fermer
                    </button>
                </div>
            )}

            {/* SCREEN SETUP */}
            {screen === 'setup' && (
                <div className="flex-1 flex flex-col justify-between p-5 overflow-hidden animate-fade-in">
                    
                    <div className="flex items-center justify-between pb-4">
                        <button onClick={() => {
                            if (setupStep === 'category') setScreen('home');
                            else if (setupStep === 'players') setSetupStep('category');
                            else if (setupStep === 'roles') setSetupStep('players');
                        }} className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-slate-400 active:scale-90 transition-transform">
                            <i className="fa-solid fa-chevron-left text-sm"></i>
                        </button>
                        <div className="text-center">
                            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-0.5">Étape {setupStep === 'category' ? '1' : setupStep === 'players' ? '2' : '3'}/3</p>
                            <h2 className="text-sm font-black text-white">
                                {setupStep === 'category' && "Choix du Thème"}
                                {setupStep === 'players' && "Les Joueurs"}
                                {setupStep === 'roles' && "Équilibrage"}
                            </h2>
                        </div>
                        <div className="w-10 h-10"></div>
                    </div>

                    {/* ÉTAPE 1 : CATÉGORIES */}
                    {setupStep === 'category' && (
                        <div className="flex-1 flex flex-col justify-between py-4 overflow-hidden">
                            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                                <div className="grid grid-cols-2 gap-3 pb-4 px-2">
                                    <button onClick={() => setSelectedTheme("random")} className={`relative overflow-hidden h-40 p-3 rounded-[24px] flex flex-col items-center justify-center gap-3 transition-all active:scale-[0.95] shadow-lg shadow-cyan-950/50 bg-gradient-to-br from-slate-900 via-slate-950 to-black before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/15 before:to-transparent before:h-1/2 border-t border-white/15 border-x border-white/5 border-b border-black/40 ${selectedTheme === "random" ? 'ring-4 ring-white scale-[1.02] z-20' : 'z-10'}`}>
                                        <FaDice className="text-5xl text-cyan-400 drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)] z-10 shrink-0" />
                                        <div className="text-center z-10 px-1">
                                            <p className="text-[14px] font-bold text-white leading-tight drop-shadow-sm">Aléatoire</p>
                                            <p className="text-[11px] text-cyan-400/80 font-bold uppercase mt-1">Toutes</p>
                                        </div>
                                    </button>

                                    {Object.entries(themes).map(([key, theme]) => {
                                        if (theme.count === 0 && key !== 'custom') return null;
                                        const style = getCategoryStyles(key, theme.name);
                                        const IconComponent = style.icon;
                                        let cleanName = (theme.name || key).replace(/[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/gu, '').trim();
                                        if (cleanName.toLowerCase().includes('hardcore') || cleanName.toLowerCase().includes('abstrait')) cleanName = "Abstrait";

                                        return (
                                            <button key={key} onClick={() => setSelectedTheme(key)} className={`relative overflow-hidden h-40 p-3 rounded-[24px] flex flex-col items-center justify-center gap-3 transition-all active:scale-[0.95] shadow-lg ${style.glow} bg-gradient-to-br ${style.bg} before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:h-1/2 border-t border-white/15 border-x border-white/5 border-b border-black/40 ${selectedTheme === key ? 'ring-4 ring-white scale-[1.02] z-20' : 'z-10'}`}>
                                                <IconComponent className="text-5xl text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)] z-10 shrink-0" />
                                                <div className="text-center z-10 px-1 w-full">
                                                    <p className="text-[14px] font-bold text-white leading-tight drop-shadow-sm text-balance">{cleanName}</p>
                                                    <p className="text-[11px] text-white/80 font-bold uppercase mt-1">{theme.count} paires</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            <button onClick={() => setSetupStep('players')} className="w-full bg-white hover:bg-slate-200 text-slate-950 font-black py-4 rounded-2xl active:scale-[0.98] transition-all text-sm mt-4 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 shrink-0">
                                Continuer <i className="fa-solid fa-arrow-right text-xs"></i>
                            </button>
                        </div>
                    )}

                    {/* ÉTAPE 2 : JOUEURS */}
                    {setupStep === 'players' && (
                        <div className="flex-1 flex flex-col justify-between py-4 overflow-hidden">
                            <div className="flex-1 flex flex-col overflow-hidden space-y-6 pr-1">
                                
                                <div className="px-1">
                                    <h3 className="text-sm font-black uppercase tracking-wider flex items-center text-white">
                                        <i className="fa-solid fa-users mr-2 text-slate-400"></i> Équipe ({players.length})
                                    </h3>
                                </div>
                                
                                <div className="flex flex-col gap-2 px-1">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                                <i className="fa-solid fa-star text-white text-[10px]"></i>
                                            </div>
                                            <span className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 uppercase tracking-widest">
                                                Habitués
                                            </span>
                                            
                                            <details className="relative group">
                                                <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors active:scale-90">
                                                    <i className="fa-solid fa-info text-[9px]"></i>
                                                </summary>
                                                
                                                <div className="absolute top-8 left-0 z-50 w-[280px] bg-white rounded-[20px] p-4 shadow-[0_15px_40px_rgba(0,0,0,0.6)] border border-slate-200 animate-fade-in cursor-default">
                                                    <div className="flex items-start gap-3.5">
                                                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center shrink-0 shadow-inner mt-0.5">
                                                            <i className="fa-solid fa-lightbulb text-yellow-500 text-sm"></i>
                                                        </div>
                                                        <p className="text-[12px] leading-relaxed text-slate-900 font-medium">
                                                            Gagnez du temps ! Cliquez sur <strong className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500">Sauver</strong> pour mémoriser l'équipe, et utilisez <strong className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500">Charger</strong> pour les retrouver plus tard.
                                                        </p>
                                                    </div>
                                                </div>
                                            </details>
                                        </div>
                                        
                                        <div className="flex items-center gap-1">
                                            <button onClick={resetPlayersToSavedDefault} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 text-[10px] font-black uppercase tracking-wider transition-colors active:scale-95">
                                                <i className="fa-solid fa-cloud-arrow-down text-[11px]"></i> Charger
                                            </button>
                                            <button onClick={saveCurrentListAsDefault} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 text-[10px] font-black uppercase tracking-wider transition-colors active:scale-95">
                                                <i className="fa-solid fa-floppy-disk text-[11px]"></i> Sauver
                                            </button>
                                            {players.length > 0 && (
                                                <button onClick={clearPlayersList} className="flex items-center justify-center px-2 py-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors active:scale-95">
                                                    <i className="fa-solid fa-trash-can text-sm"></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 px-2 shrink-0 pt-2">
                                    <div className="flex items-end gap-4">
                                        <input 
                                            type="text" 
                                            value={newPlayerName} 
                                            onChange={(e) => setNewPlayerName(e.target.value)} 
                                            onKeyDown={(e) => e.key === 'Enter' && addPlayer()} 
                                            placeholder="Ajoute un joueur..." 
                                            maxLength="14" 
                                            className="flex-1 bg-transparent border-b-2 border-white/20 px-1 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-white text-base font-bold transition-colors" 
                                        />
                                        <button onClick={addPlayer} className="w-11 h-11 bg-white hover:bg-slate-200 active:scale-95 text-slate-950 rounded-full font-black text-lg shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center shrink-0">
                                            <i className="fa-solid fa-plus"></i>
                                        </button>
                                    </div>
                                    
                                    <div className="flex gap-3 overflow-x-auto py-2 scrollbar-none snap-x">
                                        {AVATARS_POOL.map((avatar) => (
                                            <button key={avatar} onClick={() => setSelectedAvatar(avatar)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all snap-center shrink-0 border-[3px] overflow-hidden ${selectedAvatar === avatar ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`}>
                                                <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto">
                                    <div className="grid grid-cols-2 gap-3 pb-2 px-1">
                                        {players.length === 0 && (
                                            <div className="col-span-2 text-center py-8 text-slate-500 text-sm font-medium">
                                                Ajoutez vos amis pour commencer...
                                            </div>
                                        )}
                                        
                                        {players.map((player, index) => {
                                            const cardColors = [
                                                "from-cyan-400 to-blue-500 shadow-cyan-500/30",
                                                "from-fuchsia-400 to-purple-500 shadow-fuchsia-500/30",
                                                "from-emerald-400 to-teal-500 shadow-emerald-500/30",
                                                "from-rose-400 to-orange-500 shadow-rose-500/30",
                                                "from-indigo-400 to-violet-500 shadow-violet-500/30"
                                            ];
                                            const colorTheme = cardColors[index % cardColors.length];

                                            return (
                                                <div key={player.id} className={`relative overflow-hidden bg-gradient-to-br rounded-[24px] p-4 flex flex-col items-center justify-center gap-2 shadow-lg animate-fade-in group ${colorTheme} border-t border-white/30 border-x border-white/10 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:h-1/2`}>
                                                    <button 
                                                        onClick={() => removePlayer(player.id)} 
                                                        className="absolute top-2 right-2 w-7 h-7 bg-black/20 hover:bg-red-500 text-white/90 hover:text-white rounded-full flex items-center justify-center text-[10px] shadow-sm backdrop-blur-sm transition-all active:scale-90 z-20 border border-white/10"
                                                    >
                                                        <i className="fa-solid fa-xmark"></i>
                                                    </button>
                                                    <img src={player.avatar || AVATARS_POOL[0]} alt={player.name} className="w-16 h-16 object-cover rounded-full drop-shadow-xl z-10 border-2 border-white/30" />
                                                    <span className="font-black text-[14px] text-white truncate w-full text-center px-1 drop-shadow-md z-10 mt-1">{player.name}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => {
                                if (players.length < 3) return triggerAlert("Il vous faut au moins 3 joueurs pour continuer !", "Action Impossible");
                                setSetupStep('roles');
                            }} className="w-full bg-white hover:bg-slate-200 text-slate-950 font-black py-4 rounded-2xl active:scale-[0.98] transition-all text-sm mt-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 shrink-0">
                                Continuer <i className="fa-solid fa-arrow-right text-xs"></i>
                            </button>
                        </div>
                    )}

                    {/* ÉTAPE 3 : RÔLES */}
                    {setupStep === 'roles' && (
                        <div className="flex-1 flex flex-col justify-between py-4 overflow-hidden">
                            <div className="px-1 mb-2 shrink-0">
                                <h3 className="text-sm font-black uppercase tracking-wider flex items-center text-white">
                                    <i className="fa-solid fa-scale-balanced mr-2 text-slate-400"></i> Équilibrage
                                </h3>
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center gap-6 px-1 my-auto">
                                <div className="relative overflow-hidden w-full max-w-[240px] aspect-square bg-gradient-to-br from-amber-400 to-orange-500 rounded-[32px] p-5 shadow-lg shadow-orange-500/30 flex flex-col items-center justify-between text-center group before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:h-1/2 border-t border-white/50 border-x border-white/20">
                                    <div className="w-14 h-14 bg-white/25 rounded-2xl flex items-center justify-center text-2xl text-white shadow-inner shrink-0 z-10 border border-white/40 backdrop-blur-sm mt-2">
                                        <i className="fa-solid fa-user-secret drop-shadow-md"></i>
                                    </div>
                                    <div className="z-10 flex flex-col items-center justify-center">
                                        <p className="text-lg font-black text-white drop-shadow-md leading-tight">Imposteur</p>
                                        <p className="text-[11px] text-white/90 font-bold mt-1 px-1 leading-tight uppercase tracking-wider">Mot alternatif</p>
                                    </div>
                                    <div className="flex items-center justify-between w-full bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 z-10 shrink-0 shadow-inner">
                                        <button onClick={handleRemoveUndercover} className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xl font-black transition-all active:scale-90 flex items-center justify-center shadow-sm">
                                            -
                                        </button>
                                        <span className="font-black text-white text-xl w-6 text-center drop-shadow-md">{undercoverCount}</span>
                                        <button onClick={handleAddUndercover} className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xl font-black transition-all active:scale-90 flex items-center justify-center shadow-sm">
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="relative overflow-hidden w-full max-w-[240px] aspect-square bg-gradient-to-br from-rose-400 to-red-500 rounded-[32px] p-5 shadow-lg shadow-red-500/30 flex flex-col items-center justify-between text-center group before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:h-1/2 border-t border-white/50 border-x border-white/20">
                                    <div className="w-14 h-14 bg-white/25 rounded-2xl flex items-center justify-center text-2xl text-white shadow-inner shrink-0 z-10 border border-white/40 backdrop-blur-sm mt-2">
                                        <i className="fa-solid fa-masks-theater drop-shadow-md"></i>
                                    </div>
                                    <div className="z-10 flex flex-col items-center justify-center">
                                        <p className="text-lg font-black text-white drop-shadow-md leading-tight">Mr. White</p>
                                        <p className="text-[11px] text-white/90 font-bold mt-1 px-1 leading-tight uppercase tracking-wider">Sans mot secret</p>
                                    </div>
                                    <div className="flex items-center w-full bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 z-10 shrink-0 shadow-inner gap-1.5">
                                        <button onClick={() => handleSetMrWhite(0)} className={`flex-1 py-2.5 rounded-xl font-bold text-[12px] uppercase tracking-wider transition-all active:scale-95 ${mrWhiteCount === 0 ? 'bg-white text-red-500 shadow-md font-black' : 'text-white hover:bg-white/20'}`}>
                                            Sans
                                        </button>
                                        <button onClick={() => handleSetMrWhite(1)} className={`flex-1 py-2.5 rounded-xl font-bold text-[12px] uppercase tracking-wider transition-all active:scale-95 ${mrWhiteCount === 1 ? 'bg-white text-red-500 shadow-md font-black' : 'text-white hover:bg-white/20'}`}>
                                            Avec
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button onClick={startGame} className="w-full bg-white hover:bg-slate-200 text-slate-950 font-black py-4 rounded-2xl active:scale-[0.98] transition-all text-sm mt-4 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 shrink-0">
                                <i className="fa-solid fa-play text-xs"></i> Lancer la Partie
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* SCREEN REVEAL (Distribution des rôles avec belles cartes colorées) */}
            {screen === 'reveal' && (
                <div className="flex-1 flex flex-col justify-between p-6 text-center animate-fade-in">
                    <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Distribution secrète</div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden shadow-inner border border-white/5">
                            <div className="bg-gradient-to-r from-violet-400 to-fuchsia-500 h-full transition-all duration-300" style={{ width: `${((currentRevealIndex + (revealStep === 'show' ? 1 : 0.5)) / players.length) * 100}%` }}></div>
                        </div>
                    </div>

                    {revealStep === 'pass' && (
                        <div className="my-auto flex flex-col items-center gap-6">
                            <div className="relative overflow-hidden w-36 h-36 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full p-2 shadow-[0_0_30px_rgba(99,102,241,0.5)] flex items-center justify-center animate-bounce border-t border-white/40 border-b border-black/20 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:h-1/2">
                                <div className="w-full h-full bg-slate-900 rounded-full overflow-hidden z-10 border-4 border-white/20">
                                    <img src={players[currentRevealIndex].avatar || AVATARS_POOL[0]} alt="avatar" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-fuchsia-300 drop-shadow-md">Passe le téléphone</h3>
                                <p className="text-slate-300 text-sm font-medium">À remettre en secret à :</p>
                                <div className="text-2xl font-black text-white bg-white/10 border border-white/20 backdrop-blur-md py-3 px-8 rounded-[24px] inline-block shadow-lg">
                                    {players[currentRevealIndex].name}
                                </div>
                            </div>
                        </div>
                    )}

                    {revealStep === 'show' && (
                        <div className="my-auto space-y-6 animate-scale-up">
                            <div className="text-slate-300 text-sm font-medium">À toi de jouer, <span className="text-white font-extrabold text-base">{players[currentRevealIndex].name}</span></div>
                            
                            {players[currentRevealIndex].role === 'mr_white' ? (
                                <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 to-red-600 rounded-[32px] p-8 shadow-2xl shadow-red-500/40 space-y-5 border-t border-white/50 border-x border-white/20 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:h-1/2">
                                    <div className="z-10 relative flex flex-col items-center">
                                        <span className="px-4 py-2 bg-black/20 text-white rounded-full text-[10px] font-black tracking-widest border border-white/20 backdrop-blur-sm shadow-inner uppercase mb-4"><i className="fa-solid fa-masks-theater mr-2"></i> MR. WHITE</span>
                                        <div className="text-5xl font-black tracking-widest text-white py-4 drop-shadow-lg animate-pulse">???</div>
                                        <p className="text-white/95 text-sm max-w-[220px] mx-auto leading-relaxed bg-black/20 p-4 rounded-2xl border border-white/10 backdrop-blur-sm shadow-inner mt-4">Tu n'as <strong>aucun mot</strong> secret. Écoute attentivement les autres pour bluffer !</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[32px] p-8 shadow-2xl shadow-teal-500/40 space-y-5 border-t border-white/50 border-x border-white/20 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:h-1/2">
                                    <div className="z-10 relative flex flex-col items-center">
                                        <span className="px-4 py-2 bg-black/20 text-white rounded-full text-[10px] font-black tracking-widest border border-white/20 backdrop-blur-sm shadow-inner uppercase mb-4"><i className="fa-solid fa-lock mr-2"></i> MOT SECRET</span>
                                        <div className="text-4xl font-black tracking-tight text-white py-4 drop-shadow-lg">{players[currentRevealIndex].word}</div>
                                        <p className="text-white/95 text-sm max-w-[220px] mx-auto leading-relaxed bg-black/20 p-4 rounded-2xl border border-white/10 backdrop-blur-sm shadow-inner mt-4">Mémorise bien ce mot et <strong>ne le montre à personne</strong> !</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {revealStep === 'pass' ? (
                        <button onClick={handleRevealWord} className="w-full relative overflow-hidden bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white font-black py-4 px-6 rounded-2xl shadow-[0_0_20px_rgba(217,70,239,0.4)] active:scale-95 transition-all text-sm border-t border-white/30 shrink-0">
                            <i className="fa-solid fa-eye mr-2"></i> Révéler mon rôle
                        </button>
                    ) : (
                        <button onClick={handleNextReveal} className="w-full bg-white hover:bg-slate-200 text-slate-950 font-black py-4 px-6 rounded-2xl active:scale-95 transition-all text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)] shrink-0 flex items-center justify-center gap-2">
                            C'est mémorisé <i className="fa-solid fa-check"></i>
                        </button>
                    )}
                </div>
            )}

            {/* SCREEN GAMEPLAY DEBATS (Le grand retour de la couleur !) */}
            {screen === 'gameplay' && (
                <div className="flex-1 flex flex-col justify-between py-6 overflow-hidden animate-fade-in">
                    <div className="space-y-5 flex flex-col flex-1 overflow-hidden px-2">
                        <div className="text-center">
                            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 mb-4 tracking-tight drop-shadow-sm">Débattez !</h2>
                            
                            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-[28px] text-center shadow-lg shadow-purple-500/30 border-t border-white/30 border-x border-white/10 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:h-1/2">
                                <div className="z-10 relative">
                                    <p className="text-[10px] text-white/80 uppercase tracking-widest font-black mb-2.5 drop-shadow-md">Le premier à parler est :</p>
                                    <div className="inline-flex items-center gap-3 bg-black/20 py-2 pl-2 pr-5 rounded-[20px] border border-white/20 backdrop-blur-sm shadow-inner">
                                        <img src={startingPlayerAvatar || AVATARS_POOL[0]} alt="avatar" className="w-10 h-10 rounded-full border-2 border-white/50 object-cover" />
                                        <span className="text-lg font-black text-white drop-shadow-sm">{startingPlayer}</span>
                                    </div>
                                    <div className="text-[12px] font-bold text-cyan-200 flex items-center justify-center gap-1.5 mt-3">
                                        <i className="fa-solid fa-tag"></i> Thème : {playedThemeName}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-3 pb-2 px-1">
                                {players.map((player, index) => {
                                    const cardColors = [
                                        "from-cyan-400 to-blue-500 shadow-cyan-500/30",
                                        "from-fuchsia-400 to-purple-500 shadow-fuchsia-500/30",
                                        "from-emerald-400 to-teal-500 shadow-emerald-500/30",
                                        "from-rose-400 to-orange-500 shadow-rose-500/30",
                                        "from-indigo-400 to-violet-500 shadow-violet-500/30"
                                    ];
                                    const colorTheme = cardColors[index % cardColors.length];

                                    return (
                                        <div key={player.id} className={`relative overflow-hidden rounded-[24px] p-4 flex flex-col items-center justify-between gap-3 transition-all group
                                            ${player.isEliminated 
                                                ? 'bg-slate-900 border border-red-900/40 animate-eliminate-card' 
                                                : `bg-gradient-to-br ${colorTheme} shadow-lg border-t border-white/40 border-x border-white/20 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/25 before:to-transparent before:h-1/2`
                                            }`}
                                        >
                                            {player.isEliminated && (
                                                <div className="absolute inset-0 bg-red-950/80 flex flex-col items-center justify-center backdrop-blur-[2px] z-30 rounded-[24px]">
                                                    <i className="fa-solid fa-skull text-red-500 text-[40px] drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pop"></i>
                                                    <span className="text-red-400 font-black text-[10px] uppercase tracking-widest mt-1">Éliminé</span>
                                                </div>
                                            )}

                                            <img src={player.avatar || AVATARS_POOL[0]} alt={player.name} className={`w-16 h-16 object-cover rounded-full z-10 ${player.isEliminated ? 'opacity-30' : 'border-2 border-white/30 drop-shadow-xl'}`} />
                                            
                                            <span className={`font-black text-[15px] text-center px-1 truncate w-full z-10 ${player.isEliminated ? 'text-slate-500 line-through' : 'text-white drop-shadow-md'}`}>
                                                {player.name}
                                            </span>

                                            {!player.isEliminated && (
                                                <button onClick={() => eliminatePlayerAction(player)} className="w-full bg-black/20 hover:bg-red-500 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-white/20 hover:border-red-400 transition-all active:scale-95 z-20 backdrop-blur-sm flex items-center justify-center gap-1.5 mt-1">
                                                    <i className="fa-solid fa-skull"></i> Éliminer
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
{/* SCREEN REVELATION DU ROLE DE L'ELIMINE */}
            {screen === 'eliminated_role' && eliminatedPlayer && (
                <div className="flex-1 flex flex-col justify-between p-6 text-center animate-fade-in">
                    <div className="my-auto w-full max-w-sm mx-auto">
                        {(() => {
                            const isCivil = eliminatedPlayer.role === 'civilian';
                            const isUndercover = eliminatedPlayer.role === 'undercover';
                            
                            // Couleurs selon le rôle révélé
                            const bgTheme = isCivil ? 'from-emerald-400 to-teal-500 shadow-teal-500/40' :
                                            isUndercover ? 'from-amber-400 to-orange-500 shadow-orange-500/40' :
                                            'from-rose-500 to-red-600 shadow-red-500/40';
                            
                            const icon = isCivil ? 'fa-user' : isUndercover ? 'fa-user-secret' : 'fa-masks-theater';
                            const iconColor = isCivil ? 'text-teal-500' : isUndercover ? 'text-orange-500' : 'text-red-500';
                            const roleName = isCivil ? 'Civil' : isUndercover ? 'Imposteur' : 'Mr. White';

                            return (
                                <div className={`relative overflow-hidden bg-gradient-to-br ${bgTheme} rounded-[32px] p-8 shadow-2xl border-t border-white/50 border-x border-white/20 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:h-1/2 animate-scale-up`}>
                                    <div className="z-10 relative space-y-6">
                                        
                                        {/* Avatar avec badge du rôle */}
                                        <div className="w-24 h-24 mx-auto relative">
                                            <div className="absolute inset-0 bg-white/20 rounded-full border-4 border-white/40 shadow-inner overflow-hidden">
                                                <img src={eliminatedPlayer.avatar || AVATARS_POOL[0]} alt="avatar" className="w-full h-full object-cover" />
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-xl ${iconColor}`}>
                                                <i className={`fa-solid ${icon}`}></i>
                                            </div>
                                        </div>
                                        
                                        {/* Révélation du texte */}
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-bold text-white/90 drop-shadow-md">{eliminatedPlayer.name} était...</h3>
                                            <div className="text-4xl font-black text-white drop-shadow-xl uppercase tracking-widest">
                                                {roleName}
                                            </div>
                                        </div>

                                        <div className="bg-black/20 p-4 rounded-2xl border border-white/20 backdrop-blur-sm shadow-inner">
                                            <p className="text-sm font-black text-white/90 uppercase tracking-widest">
                                                {isCivil && "Aïe, un innocent de moins !"}
                                                {isUndercover && "Bien joué ! L'imposteur est démasqué."}
                                                {!isCivil && !isUndercover && "Mr. White a été débusqué !"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                    
                    {/* Bouton pour passer à la suite de la logique du jeu */}
                    <button onClick={() => {
                        if (eliminatedPlayer.role === 'mr_white') setScreen('guess_white');
                        else checkWinConditions(players);
                    }} className="w-full bg-white hover:bg-slate-200 text-slate-950 font-black py-4 rounded-2xl active:scale-[0.98] transition-all text-sm mt-4 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 shrink-0">
                        Continuer <i className="fa-solid fa-arrow-right text-xs"></i>
                    </button>
                </div>
            )}
            
            {/* SCREEN GUESS WHITE */}
            {screen === 'guess_white' && (
                <div className="flex-1 flex flex-col justify-between p-6 text-center animate-fade-in">
                    <div className="my-auto w-full max-w-sm mx-auto">
                        <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 to-red-600 rounded-[32px] p-8 shadow-2xl shadow-red-500/40 border-t border-white/50 border-x border-white/20 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:h-1/2">
                            <div className="z-10 relative space-y-6">
                                <div className="w-20 h-20 bg-white/20 rounded-[24px] flex items-center justify-center mx-auto text-white text-4xl border border-white/30 shadow-inner backdrop-blur-sm">
                                    <i className="fa-solid fa-masks-theater drop-shadow-md"></i>
                                </div>
                                
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-white drop-shadow-md">Dernière Chance !</h3>
                                    <p className="text-white/95 text-sm leading-relaxed max-w-[250px] mx-auto font-medium">
                                        <strong className="font-black">{eliminatedPlayer?.name}</strong> était Mr. White ! S'il trouve le mot des civils, il gagne immédiatement.
                                    </p>
                                </div>

                                <div className="bg-black/20 p-5 rounded-[24px] border border-white/20 backdrop-blur-sm shadow-inner space-y-4">
                                    <p className="text-[11px] text-white/90 uppercase tracking-widest font-black">A-t-il deviné ?</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button onClick={() => handleMrWhiteGuess(false)} className="bg-white/10 hover:bg-white/20 text-white font-black py-4 rounded-[16px] text-sm active:scale-95 border border-white/20 transition-all shadow-sm">
                                            Faux
                                        </button>
                                        <button onClick={() => handleMrWhiteGuess(true)} className="bg-white text-red-600 font-black py-4 rounded-[16px] text-sm shadow-lg active:scale-95 transition-all">
                                            Exact !
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SCREEN GAME OVER */}
            {screen === 'gameover' && (
                <div className="flex-1 flex flex-col justify-between p-5 text-center animate-fade-in overflow-hidden">
                    <div className="flex-1 overflow-y-auto space-y-6 pr-1">
                        
                        <div className={`relative overflow-hidden rounded-[32px] p-6 shadow-2xl border-t border-white/40 border-x border-white/20 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:h-1/2 ${winner === 'civilians' ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-teal-500/40' : 'bg-gradient-to-br from-rose-500 to-red-600 shadow-red-500/40'}`}>
                            <div className="z-10 relative flex flex-col items-center gap-4">
                                <div className="w-20 h-20 bg-white/25 rounded-3xl flex items-center justify-center text-white text-4xl border border-white/40 shadow-inner backdrop-blur-sm">
                                    <i className={`fa-solid drop-shadow-md ${winner === 'civilians' ? 'fa-trophy' : 'fa-user-ninja'}`}></i>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-white drop-shadow-md tracking-tight mb-1">
                                        {winner === 'civilians' ? 'Victoire des Civils !' : 'Victoire des Imposteurs !'}
                                    </h2>
                                    <p className="text-white/90 text-sm font-bold mt-1 drop-shadow-sm">
                                        {winner === 'civilians' ? 'Le secret est resté bien gardé.' : 'Le bluff a parfaitement fonctionné.'}
                                    </p>
                                </div>
                                <div className="mt-2 bg-black/20 py-3 px-5 rounded-2xl border border-white/20 backdrop-blur-sm shadow-inner w-full">
                                    <p className="text-[10px] text-white/80 uppercase tracking-widest font-black mb-1.5">Mots de la partie</p>
                                    <p className="text-lg font-black text-white drop-shadow-sm"><span className="text-emerald-200">{activeWordPair.civil}</span> <span className="text-white/50 text-sm font-medium mx-1">vs</span> <span className="text-amber-200">{activeWordPair.undercover}</span></p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2 text-left">Répartition finale :</p>
                            <div className="grid grid-cols-2 gap-3">
                                {players.map(p => {
                                    const roleColor = p.role === 'civilian' ? 'from-emerald-400 to-teal-500 shadow-teal-500/30' : p.role === 'undercover' ? 'from-amber-400 to-orange-500 shadow-orange-500/30' : 'from-rose-500 to-red-600 shadow-red-500/30';
                                    return (
                                        <div key={p.id} className={`relative overflow-hidden bg-gradient-to-br ${roleColor} rounded-[24px] p-3 flex items-center gap-3 shadow-lg border-t border-white/40 border-x border-white/20 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/25 before:to-transparent before:h-1/2`}>
                                            <div className="relative w-12 h-12 bg-white/20 rounded-full overflow-hidden border-2 border-white/40 shrink-0 z-10 shadow-inner">
                                                <img src={p.avatar} alt="avatar" className={`w-full h-full object-cover ${p.isEliminated ? 'opacity-30' : ''}`} />
                                                {p.isEliminated && <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center backdrop-blur-[1px]"><i className="fa-solid fa-skull text-white text-xs drop-shadow-md"></i></div>}
                                            </div>
                                            <div className="flex flex-col z-10 overflow-hidden text-left flex-1">
                                                <span className={`font-black text-[13px] truncate drop-shadow-md ${p.isEliminated ? 'text-white/60 line-through' : 'text-white'}`}>{p.name}</span>
                                                <span className="text-[10px] font-black text-white/90 uppercase tracking-widest mt-0.5 drop-shadow-md">
                                                    {p.role === 'civilian' ? 'Civil' : p.role === 'undercover' ? 'Imposteur' : 'Mr. White'}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <button onClick={resetGameToSetup} className="w-full bg-white hover:bg-slate-200 text-slate-950 font-black py-4 rounded-2xl active:scale-[0.98] transition-all text-sm mt-4 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 shrink-0">
                        <i className="fa-solid fa-rotate-right"></i> Relancer une partie
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;