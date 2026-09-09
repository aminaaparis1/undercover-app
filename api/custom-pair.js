import { INITIAL_THEMES } from './words.js';

const getCategoryByKeywords = (civil, undercover) => {
    const text = (civil + " " + undercover).toLowerCase();
    
    // On parcourt les thèmes pour voir si un mot correspond
    for (const [key, theme] of Object.entries(INITIAL_THEMES)) {
        // On vérifie si un des mots de la paire du thème est présent dans le texte
        const match = theme.pairs.some(p => 
            text.includes(p.civil.toLowerCase()) || text.includes(p.undercover.toLowerCase())
        );
        if (match) return key;
    }
    return "autre";
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ success: false, error: "Method not allowed" });

    const { civil, undercover } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Récupération des clés de catégories valides depuis words.js
    const allowedCategories = Object.keys(INITIAL_THEMES);
    const categoriesString = allowedCategories.join(", ");

    try {
        if (apiKey) {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    contents: [{ parts: [{ 
                        text: `Tu es le juge du jeu Undercover. Valide cette paire : Civil="${civil}", Infiltré="${undercover}".
Règles :
1. "valid": true si la paire est cohérente.
2. "category": DOIT être l'une de ces valeurs exactes : ${categoriesString}.
3. "reason": Explication courte (5 mots).
Réponds UNIQUEMENT en JSON brut.` 
                    }] }],
                    generationConfig: { responseMimeType: "application/json" }
                })
            });
            
            const data = await response.json();
            
            if (!response.ok || !data.candidates) {
                return res.status(200).json({ success: true, valid: true, category: getCategoryByKeywords(civil, undercover), reason: "Validation locale" });
            }

            let text = data.candidates[0].content.parts[0].text;
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            let parsedData = JSON.parse(text);

            // Sécurité : forcer la catégorie si l'IA délire
            if (!allowedCategories.includes(parsedData.category)) {
                parsedData.category = getCategoryByKeywords(civil, undercover);
            }
            
            return res.status(200).json({ success: true, ...parsedData });
            
        } else {
            return res.status(200).json({ 
                success: true, valid: true, 
                category: getCategoryByKeywords(civil, undercover), 
                reason: "Validation locale" 
            });
        }
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
}