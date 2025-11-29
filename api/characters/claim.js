import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1390076169533259876/ikVQpovCgTazY1jaYOx0nmtXRPwSxLifM1U6PiAP44UdLAg_XTmuAvKigB6cfuLNCG3I';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { playerName, characterName, characterPool, sessionId } = req.body;

      // Insert into database
      const { data, error } = await supabase
        .from('characters')
        .insert([
          {
            character_name: characterName,
            player_name: playerName,
            character_pool: characterPool,
            session_id: sessionId
          }
        ])
        .select();

      if (error) {
        if (error.code === '23505') { // Unique violation
          return res.status(400).json({ 
            success: false, 
            error: 'Character already claimed!' 
          });
        }
        throw error;
      }

      // Send Discord notification
      await fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '🎭 ROL CHARACTER CLAIMED',
            description: `**${playerName}** claimed **${characterName}**`,
            fields: [
              { name: 'Player', value: playerName, inline: true },
              { name: 'Character', value: characterName, inline: true },
              { name: 'Pool', value: characterPool, inline: true }
            ],
            color: 13369344,
            timestamp: new Date().toISOString()
          }]
        })
      });

      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
