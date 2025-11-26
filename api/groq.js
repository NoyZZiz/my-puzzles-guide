// This code MUST be deployed to your serverless environment (e.g., Vercel, Cloudflare).
// It safely hides the API key in environment variables (process.env).

const GROQ_API_KEY = process.env.GROQ_API_KEY; 
const GROQ_MODEL = 'llama3-8b-8192'; 
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

export default async function handler(request) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405 });
    }

    // 1. Get data sent from the Noyzzing homepage (index.html)
    const clientData = await request.json();
    
    // 2. Validate API Key is available on the server
    if (!GROQ_API_KEY) {
        return new Response(JSON.stringify({ error: "Server Error: API Key not configured." }), { status: 500 });
    }

    // 3. Construct the official Groq API payload
    const groqPayload = {
        model: clientData.model || GROQ_MODEL,
        messages: clientData.messages,
        temperature: 0.7,
        max_tokens: 250 // Limit tokens to stay within free tier usage
    };

    try {
        // 4. Call the Groq API securely from the server
        const groqResponse = await fetch(GROQ_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}` // Key is securely used here
            },
            body: JSON.stringify(groqPayload)
        });

        const data = await groqResponse.json();

        if (!groqResponse.ok) {
            console.error("Groq upstream error:", data);
            return new Response(JSON.stringify({ text: "Error from AI service. Check proxy logs." }), { status: groqResponse.status });
        }

        // 5. Extract the response text
        const responseText = data.choices[0].message.content;

        // 6. Send the clean response back to the user's browser (index.html)
        return new Response(JSON.stringify({ text: responseText }), { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("Proxy execution failed:", error);
        return new Response(JSON.stringify({ text: "Proxy Network Failure. Check server logs." }), { status: 500 });
    }
}