import express from 'express';
import cors from 'cors';
import { INITIAL_THEMES } from './words.js'; 
import customPairHandler from './custom-pair.js'; // <-- Import de ton fichier custom-pair

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// --- TES ROUTES ---
app.get('/api/themes', (req, res) => {
    const themeList = {};
    Object.entries(INITIAL_THEMES).forEach(([key, theme]) => {
        themeList[key] = { name: theme.name, icon: theme.icon, color: theme.color, count: theme.pairs.length };
    });
    res.json({ success: true, themes: themeList });
});

// Route dynamique sans les deux points (plus compatible Vercel)
app.get('/api/random-pair', (req, res) => {
    const { theme } = req.query; // On utilise req.query au lieu de req.params
    if (INITIAL_THEMES[theme]) {
        const pairs = INITIAL_THEMES[theme].pairs;
        const selectedPair = pairs[Math.floor(Math.random() * pairs.length)];
        res.json({ success: true, pair: selectedPair });
    } else {
        res.status(404).json({ success: false, error: "Thématique introuvable." });
    }
});

// Route d'ajout de mots personnalisés et validation IA
app.post('/api/custom-pair', customPairHandler); // <-- Liaison de la route avec le fichier

// --- DÉMARRAGE LOCAL UNIQUEMENT ---
if (process.env.NODE_ENV !== 'production') {
    const PORT = 3001;
    app.listen(PORT, () => {
        console.log(`✅ Serveur local actif sur http://localhost:${PORT}`);
    });
}

// Export pour Vercel
export default app;