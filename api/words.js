// Base de données locale de mots secrets pour le jeu Undercover.
export const INITIAL_THEMES = {
    nourriture: {
        name: "🍔 Nourriture & Boissons",
        icon: "fa-hamburger",
        color: "from-amber-500 to-orange-600",
        pairs: [
            { civil: "Coca-Cola", undercover: "Pepsi" },
            { civil: "Burger", undercover: "Kebab" },
            { civil: "Chocolat noir", undercover: "Chocolat au lait" },
            { civil: "Pizza", undercover: "Quiche" },
            { civil: "Café", undercover: "Thé" },
            { civil: "Raclette", undercover: "Fondue" },
            { civil: "Frites", undercover: "Potatoes" },
            { civil: "Croissant", undercover: "Pain au chocolat" },
            { civil: "Crêpe", undercover: "Gaufre" },
            { civil: "Pâtes", undercover: "Riz" },
            { civil: "Sel", undercover: "Poivre" },
            { civil: "Ketchup", undercover: "Mayonnaise" },
            { civil: "Fraise", undercover: "Framboise" },
            { civil: "Eau plate", undercover: "Eau gazeuse" },
            { civil: "Miel", undercover: "Sirop d'érable" },
            { civil: "Glace", undercover: "Sorbet" },
            { civil: "Lait", undercover: "Crème fraîche" },
            { civil: "Baguette", undercover: "Pain de mie" },
        ]
    },
    pop_culture: {
        name: "🎬 Pop Culture & Geek",
        icon: "fa-film",
        color: "from-purple-500 to-indigo-600",
        pairs: [
            { civil: "Batman", undercover: "Iron Man" },
            { civil: "Netflix", undercover: "Prime Video" },
            { civil: "TikTok", undercover: "Instagram" },
            { civil: "PlayStation", undercover: "Xbox" },
            { civil: "Mario", undercover: "Sonic" },
            { civil: "Apple", undercover: "Android" },
            { civil: "ChatGPT", undercover: "Google Gemini" },
            { civil: "Spotify", undercover: "Deezer" },
            { civil: "Fortnite", undercover: "Call of Duty" },
            { civil: "Naruto", undercover: "Sasuke" },
            { civil: "YouTube", undercover: "Twitch" },
            { civil: "Spider-Man", undercover: "Spider-Gwen" },
            { civil: "One Piece", undercover: "Dragon Ball" },
            { civil: "Elon Musk", undercover: "Mark Zuckerberg" }
        ]
    },
    hardcore: {
        name: "🧠 Mode Hardcore (Abstrait)",
        icon: "fa-brain",
        color: "from-rose-500 to-red-600",
        pairs: [
            { civil: "Temps", undercover: "Durée" },
            { civil: "Vide", undercover: "Néant" },
            { civil: "Confiance", undercover: "Naïveté" },
            { civil: "Mémoire", undercover: "Souvenir" },
            { civil: "Rêve", undercover: "Illusion" },
            { civil: "Liberté", undercover: "Indépendance" },
            { civil: "Justice", undercover: "Égalité" },
            { civil: "Peur", undercover: "Angoisse" },
            { civil: "Sagesse", undercover: "Intelligence" },
            { civil: "Secret", undercover: "Mystère" },
            { civil: "Hasard", undercover: "Destin" },
            { civil: "Espace", undercover: "Univers" },
            { civil: "Croyance", undercover: "Opinion" },

        ]
    },
    vie_quotidienne: {
        name: "🏡 Vie Quotidienne",
        icon: "fa-home",
        color: "from-emerald-500 to-teal-600",
        pairs: [
            { civil: "Lit", undercover: "Canapé" },
            { civil: "Ordinateur", undercover: "Téléphone" },
            { civil: "Voiture", undercover: "Moto" },
            { civil: "Stylo", undercover: "Crayon" },
            { civil: "Douche", undercover: "Bain" },
            { civil: "Montre", undercover: "Horloge" },
            { civil: "Porte", undercover: "Fenêtre" },
            { civil: "Clé", undercover: "Badge" },
            { civil: "Livre", undercover: "Magazine" },
            { civil: "Ciseaux", undercover: "Couteau" },
            { civil: "Sac à dos", undercover: "Valise" },
            { civil: "Chaussette", undercover: "Chaussure" },
            { civil: "Parapluie", undercover: "Manteau" },
            { civil: "Lunettes", undercover: "Lentilles" },
            { civil: "Oreiller", undercover: "Couette" },
            { civil: "Brosse à dents", undercover: "Dentifrice" },
            { civil: "Savon", undercover: "Gel douche" },
            { civil: "Balai", undercover: "Aspirateur" },
            { civil: "Frigo", undercover: "Congélateur" },
            { civil: "Serviette", undercover: "Gant de toilette" }
        ]
    },
    fun_soiree: {
        name: "🎉 Soirée & Fun",
        icon: "fa-glass-cheers",
        color: "from-pink-500 to-rose-600",
        pairs: [
            { civil: "Vérité ou Action", undercover: "Je n'ai jamais" },
            { civil: "Grasse matinée", undercover: "Sieste d'après-midi" },
            { civil: "Karaoké", undercover: "Blind test" },
            { civil: "Dragueur", undercover: "Romantique" },
            { civil: "DJ", undercover: "Playlist Spotify" },
            { civil: "Flirt", undercover: "Coup de foudre" },
        ]
    },
    autre: {
        name: "🌀 Autre & Divers",
        icon: "fa-folder-open",
        color: "from-slate-500 to-zinc-600",
        pairs: [
            { civil: "Soleil", undercover: "Lune" },
            { civil: "Chien", undercover: "Chat" },
            { civil: "Or", undercover: "Argent" },
            { civil: "Mer", undercover: "Océan" },
            { civil: "Guitare", undercover: "Piano" }
        ]
    }
};