document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM fully loaded.");

    const chatbox = document.getElementById('chatbox');
    const openChatBtn = document.getElementById('open-chat-btn');
    const closeChatBtn = document.querySelector('#chat-header button');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    function toggleChat() {
        chatbox.style.display = 'block';  // ✅ Ensure chatbox opens properly
    }

    function fetchIntroMessage() {
        fetch("https://noyzbot-production.up.railway.app/chat", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_input: "intro" })
        })
        .then(response => response.json())
        .then(data => {
            chatMessages.innerHTML += `
                <div class="bot-message">
                    <img src="assets/images/noyzbot-logo.png" alt="NoyzBot" class="bot-icon">
                    <p>${data.response}</p>
                </div>
            `;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        })
        .catch(error => console.error("❌ Error fetching intro message:", error));
    }

    // ✅ Define sendMessage function BEFORE calling it
    window.sendMessage = function() {
    console.log("📤 Sending message...");
    const userText = document.getElementById("user-input").value.trim();
    
    if (userText !== "") {
        const chatMessages = document.getElementById("chat-messages");
        
        chatMessages.innerHTML += `<p><b>You:</b> ${userText}</p>`;
        document.getElementById("user-input").value = '';

        fetch("http://127.0.0.1:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_input: userText })
        })
        .then(response => response.json())
        .then(data => {
            chatMessages.innerHTML += `
                <div class="bot-message">
                    <img src="assets/images/noyzbot-logo.png" alt="NoyzBot" class="bot-icon">
                    <p>${data.response}</p>
                </div>
            `;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        })
        .catch(error => console.error("❌ Error sending message:", error));
    }
}


// ✅ Ensure event listeners are AFTER defining sendMessage
document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("user-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

    openChatBtn.addEventListener('click', function () {
        console.log("💬 Chat button clicked.");
        toggleChat();
        fetchIntroMessage();
    });

    closeChatBtn.addEventListener('click', function () {
        console.log("❌ Chatbox closed.");
        chatbox.style.display = 'none';
    });

    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });


    


    // ✅ Assign Function to Send Button

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
