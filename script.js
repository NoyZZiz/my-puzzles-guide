/*
 * Custom script for NoYzzing Puzzles & Conquest Guide
 *
 * This file extends the existing chat functionality, adds a simple
 * newsletter subscription handler using localStorage, and implements
 * a basic search utility to filter guides and tools on the home page.
 *
 * Note: The chat feature attempts to call a remote API defined in
 * `config.apiEndpoint`. If the request fails, a lightweight rule‑based
 * fallback is used to ensure the chatbot always provides a response.
 */

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM fully loaded and parsed");

    // DOM element references
    const elements = {
        chatbox: document.getElementById('chatbox'),
        openBtn: document.getElementById('open-chat-btn'),
        closeBtn: document.querySelector('.chat-close'),
        messages: document.getElementById('chat-messages'),
        userInput: document.getElementById('user-input'),
        sendBtn: document.querySelector('.chat-send'),
        typingText: document.getElementById('typing-text')
    };

    // Configuration settings
    const config = {
        // Remote API to fetch chatbot replies. If unreachable, fallback will be used.
        apiEndpoint: "https://my-puzzles-guide-production.up.railway.app/chat",
        // Text for the typing effect under the hero heading
        typingText: "Dominate the battlefield with our expert guides and powerful tools.",
        typingSpeed: 50
    };

    // Validate that all required elements exist before proceeding
    if (!validateElements(elements)) return;

    // Initialize modules
    initChat();
    initTypingEffect();
    initSmoothScrolling();
    initAnalytics();
    initNewsletterSubscription();
    initSearch();

    /**
     * Ensure all expected DOM elements exist.
     * Logs an error and aborts initialization if any are missing.
     */
    function validateElements(elements) {
        const required = ['chatbox', 'openBtn', 'closeBtn', 'messages', 'userInput', 'sendBtn'];
        const missing = required.filter(key => !elements[key]);
        if (missing.length) {
            console.error(`❌ Missing elements: ${missing.join(', ')}`);
            return false;
        }
        return true;
    }

    /**
     * Initialize the chatbot UI and event listeners.
     */
    function initChat() {
        // Default state: chat hidden
        elements.chatbox.classList.remove('active');
        elements.openBtn.style.display = 'block';
        // Event handlers to toggle chat and send messages
        elements.openBtn.addEventListener('click', toggleChat);
        elements.closeBtn.addEventListener('click', toggleChat);
        elements.sendBtn.addEventListener('click', sendMessage);
        elements.userInput.addEventListener('keydown', handleInputKeydown);
        document.addEventListener('keydown', handleEscapeKey);
    }

    /**
     * Show or hide the chatbox.
     */
    function toggleChat() {
        elements.chatbox.classList.toggle('active');
        elements.openBtn.style.display = elements.chatbox.classList.contains('active') ? 'none' : 'block';
        if (elements.chatbox.classList.contains('active')) {
            elements.userInput.focus();
        }
        console.log(`Chat ${elements.chatbox.classList.contains('active') ? 'opened' : 'closed'}`);
    }

    /**
     * Send a message from the user and request a response from the bot.
     */
    async function sendMessage() {
        const message = elements.userInput.value.trim();
        if (!message) return;
        // Display the user's message and reset input
        addMessage(message, 'user-message');
        elements.userInput.value = '';
        // Show a temporary loading indicator while awaiting a response
        const loadingId = 'loading-' + Date.now();
        addMessage('Thinking...', 'bot-message', loadingId);
        try {
            const botResponse = await fetchBotResponse(message);
            document.getElementById(loadingId)?.remove();
            showBotResponse(botResponse);
        } catch (error) {
            console.error("Chat error:", error);
            // Remove loading indicator and fall back to a simple response
            document.getElementById(loadingId)?.remove();
            showBotResponse({ response: fallbackResponse(message) });
        }
    }

    /**
     * Fetch a response from the server.
     * @param {string} message The user's question.
     * @returns {Promise<Object>} The server's JSON response.
     */
    async function fetchBotResponse(message) {
        const response = await fetch(config.apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_input: message })
        });
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        return await response.json();
    }

    /**
     * Provide a fallback response when the API is unreachable.
     * @param {string} message The user's input.
     * @returns {string} A simple reply.
     */
    function fallbackResponse(message) {
        const m = message.toLowerCase();
        if (m.includes('hello') || m.includes('hi')) {
            return "Hello! How can I help you with Puzzles and Conquest?";
        }
        if (m.includes('guide') || m.includes('how')) {
            return "You can explore our guides using the navigation links above!";
        }
        return "I'm sorry, I can't process that right now. Please try again later.";
    }

    /**
     * Insert a message into the chat log.
     * @param {string} content The message text or HTML.
     * @param {string} className CSS class indicating user/bot.
     * @param {string} id Optional ID for the message element.
     */
    function addMessage(content, className, id = '') {
        const message = document.createElement('div');
        message.className = `message ${className}`;
        if (id) message.id = id;
        message.innerHTML = content;
        elements.messages.appendChild(message);
        elements.messages.scrollTop = elements.messages.scrollHeight;
    }

    /**
     * Render the bot's reply to the chat.
     * @param {Object} data The data object with a response property and optional image_url.
     */
    function showBotResponse(data) {
        let content = `<p>${data.response}</p>`;
        if (data.image_url) {
            content += `<img src="${data.image_url}" alt="Bot response" class="bot-image">`;
        }
        addMessage(content, 'bot-message');
    }

    /**
     * Handle Enter key press inside the chat input.
     */
    function handleInputKeydown(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    }

    /**
     * Close chat when Escape key is pressed.
     */
    function handleEscapeKey(e) {
        if (e.key === 'Escape' && elements.chatbox.classList.contains('active')) {
            toggleChat();
        }
    }

    /**
     * Animate the hero subtitle text.
     */
    function initTypingEffect() {
        if (!elements.typingText) return;
        let i = 0;
        function typeWriter() {
            if (i < config.typingText.length) {
                elements.typingText.textContent += config.typingText.charAt(i);
                i++;
                setTimeout(typeWriter, config.typingSpeed);
            }
        }
        typeWriter();
    }

    /**
     * Enable smooth scrolling for anchor links.
     */
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    /**
     * Initialize Google Analytics tag.
     */
    function initAnalytics() {
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-VYP41CV8E4');
    }

    /**
     * Attach newsletter subscription form handler.
     * Stores email addresses locally and displays a confirmation message.
     */
    function initNewsletterSubscription() {
        const form = document.getElementById('newsletter-form');
        const emailInput = document.getElementById('newsletter-email');
        const messageDiv = document.getElementById('subscription-message');
        if (!form || !emailInput || !messageDiv) return;
        form.addEventListener('submit', e => {
            e.preventDefault();
            const email = emailInput.value.trim();
            if (!email) return;
            // Persist subscribers in localStorage
            const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
            subscribers.push({ email, subscribedAt: new Date().toISOString() });
            localStorage.setItem('subscribers', JSON.stringify(subscribers));
            // Show confirmation and reset form
            messageDiv.style.display = 'block';
            messageDiv.textContent = `Thank you for subscribing, ${email}!`;
            emailInput.value = '';
        });
    }

    /**
     * Set up search functionality to filter visible cards.
     */
    function initSearch() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;
        const guideCards = document.querySelectorAll('.guide-card');
        const toolCards = document.querySelectorAll('.tool-card');
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            // Filter guides
            guideCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                card.style.display = title.includes(query) ? '' : 'none';
            });
            // Filter tools
            toolCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                card.style.display = title.includes(query) ? '' : 'none';
            });
        });
    }
});