document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM fully loaded.");

    function fetchRandomIntro() {
        const chatMessages = document.getElementById('chat-messages');
    
        // Clear previous messages (optional)
        chatMessages.innerHTML = '';
    
        // Add a placeholder before the bot replies
        chatMessages.innerHTML += `
            <div class="bot-message">
                <img src="assets/images/noyzbot-logo.png" alt="NoyzBot" class="bot-icon">
                <p><b>NoyzBot:</b> Thinking... 🤔</p>
            </div>
        `;
    
        fetch("http://127.0.0.1:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_input: "intro" }) // Triggers bot intro
        })
        .then(response => response.json())
        .then(data => {
            // Replace placeholder with actual response
            chatMessages.innerHTML = `
                <div class="bot-message">
                    <img src="assets/images/noyzbot-logo.png" alt="NoyzBot" class="bot-icon">
                    <p><b>NoyzBot:</b> ${data.response}</p>
                </div>
            `;
            chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
        })
        .catch(error => console.error('❌ Error fetching intro:', error));
    }
    
    // ✅ Chatbox Toggle Function
    function toggleChat() {
        const chatbox = document.getElementById('chatbox');
        chatbox.style.display = chatbox.style.display === 'none' ? 'block' : 'none';
    }

    // ✅ Assign Chat Toggle to Open/Close Buttons
    const openChatBtn = document.getElementById('open-chat-btn');
    const closeChatBtn = document.querySelector('#chat-header button');

    if (openChatBtn) {
        openChatBtn.addEventListener('click', function () {
            console.log("💬 Chat button clicked.");
            chatbox.style.display = 'flex';  // Ensure visibility
            chatbox.style.zIndex = "9999";   // Make sure it's on top
            fetchRandomIntro();              // Fetch intro when chat opens
        });
        
    }

    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', function () {
            console.log("❌ Chatbox closed.");
            toggleChat();
        });
    }

    // ✅ Send Message Function
    function sendMessage() {
        const userInput = document.getElementById('user-input').value.trim();
        if (userInput !== '') {
            const chatMessages = document.getElementById('chat-messages');

            // Append User Message
            chatMessages.innerHTML += `<p><b>You:</b> ${userInput}</p>`;
            document.getElementById('user-input').value = '';  // Clear input field

            // Send message to NoyzBot API
            fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ user_input: userInput })
            })
            .then(response => response.json())
            .then(data => {
                // Append Bot Reply with Logo
                chatMessages.innerHTML += `
                    <div class="bot-message">
                        <img src="assets/images/noyzbot-logo.png" alt="NoyzBot" class="bot-icon">
                        <p><b>NoyzBot:</b> ${data.response}</p>
                    </div>
                `;
                chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
            })
            .catch(error => {
                console.error('❌ Error sending message:', error);
            });
        }
    }

    // ✅ Allow Enter Key to Send Message
    document.getElementById("user-input").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    // ✅ Assign Function to Send Button
    document.getElementById("send-btn").addEventListener("click", sendMessage);

    // ✅ Home Button Navigation Fix
    const homeBtn = document.querySelectorAll(".home-button");
    homeBtn.forEach(btn => {
        btn.addEventListener("click", function () {
            console.log("🏠 Home button clicked. Navigating...");
            window.location.href = "../index.html"; // Adjust based on folder structure
        });
    });

    // ✅ Military Expedition & Troop Calculator Buttons (For Subpages)
    const militaryBtn = document.querySelector(".military-button");
    const troopCalculatorBtn = document.querySelector(".troop-button");

    if (militaryBtn) {
        militaryBtn.addEventListener("click", function () {
            console.log("🛡️ Military Expedition button clicked.");
            window.location.href = "../military-expedition-guide/index.html";
        });
    } else {
        console.warn("⚠️ Military Expedition button not found, skipping.");
    }

    if (troopCalculatorBtn) {
        troopCalculatorBtn.addEventListener("click", function () {
            console.log("⚔️ Troop Calculator button clicked.");
            window.location.href = "../troop-resources-generator/index.html";
        });
    } else {
        console.warn("⚠️ Troop Calculator button not found, skipping.");
    }

    // ✅ Fix for Disqus Comment Count
    let d = document, s = d.createElement('script');
    s.src = 'https://noyzzing.disqus.com/count.js';
    s.setAttribute('id', 'dsq-count-scr');
    s.setAttribute('async', '');
    (d.head || d.body).appendChild(s);

    // ✅ Google Analytics Tracking
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-VYP41CV8E4');
});
