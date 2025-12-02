// Serverless endpoint to forward requests to your Discord webhook URL (keeps webhook secret off the client)
export default async function handler(req, res) {
    // Basic CORS handling
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK;
    if (!webhookUrl) {
        res.status(500).json({ error: 'Discord webhook not configured on server' });
        return;
    }

    try {
        const body = req.body;
        // Forward the JSON to the Discord webhook
        const resp = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!resp.ok) {
            const text = await resp.text();
            return res.status(resp.status).json({ error: text });
        }

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('discord proxy error', err);
        return res.status(500).json({ error: 'Failed to forward webhook' });
    }
}
