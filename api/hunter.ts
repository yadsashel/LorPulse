import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // كياخد المعلومات اللي صيفطنا ليه من الشات
    const { niche, location } = req.body;

    if (!niche || !location) {
        return res.status(400).send("Niche and Location are required.");
    }

    const query = `site:linkedin.com/company "${niche}" ${location} "email"`;
    const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    
    try {
        const { data } = await axios.get(searchUrl);
        const emails = data.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];

        for (const email of emails) {
            await supabase.from('leads').upsert({ 
                email, 
                status: 'pending',
                source: `DDG_Hunter_${niche}_${location}`
            }, { onConflict: 'email' });
        }

        res.status(200).json({ message: "Hunting Session Complete.", found: emails.length });
    } catch (e) {
        res.status(500).send("Hunting Failed.");
    }
}