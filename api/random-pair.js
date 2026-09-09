import { INITIAL_THEMES } from './words.js';

export default function handler(req, res) {
    // On récupère le thème via l'URL classique
    const theme = req.query.theme; 
    
    if (INITIAL_THEMES[theme]) {
        const pairs = INITIAL_THEMES[theme].pairs;
        res.status(200).json({ success: true, pair: pairs[Math.floor(Math.random() * pairs.length)] });
    } else {
        res.status(404).json({ success: false, error: "Thème non trouvé" });
    }
}