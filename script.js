document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM fully loaded.");

    const chatbox = document.getElementById('chatbox');
    const chatMessages = document.getElementById('chat-messages');
    const openChatBtn = document.getElementById('open-chat-btn');
    const closeChatBtn = document.querySelector('#chat-header button');
    let playerName = ""; // Stores user's in-game name

    if (!chatbox || !chatMessages || !openChatBtn || !closeChatBtn) {
        console.error("❌ One or more required elements are missing in HTML.");
        return;
    }

    // ✅ Function to Ask for In-Game Name (Inside Chatbox)
    function askForGameName() {
        chatMessages.innerHTML += `
            <div class="bot-message">
                <img src="assets/images/noyzbot-logo.png" alt="NoyzBot" class="bot-icon">
                <p>Before we start, what’s your legendary in-game name? 🏆😏</p>
                <input type="text" id="player-name-input" placeholder="Type your name..." class="name-input">
                <button id="set-name-btn">Set Name</button>
            </div>
        `;

        document.getElementById("set-name-btn").addEventListener("click", function () {
            let nameInput = document.getElementById("player-name-input").value.trim();
            playerName = nameInput ? nameInput : "Nameless Hero";
            
            chatMessages.innerHTML += `
                <div class="bot-message">
                    <img src="assets/images/noyzbot-logo.png" alt="NoyzBot" class="bot-icon">
                    <p>Nice to meet you, <b>${playerName}</b>. Try not to embarrass yourself. 😎</p>
                </div>
            `;

            fetchRandomIntro(); // After name is set, display intro
        });
    }

    // ✅ Function to Fetch Random Sassy Intro (Only Once)
    function fetchRandomIntro() {
        chatMessages.innerHTML += `
            <div class="bot-message" id="thinking-message">
                <img src="assets/images/noyzbot-logo.png" alt="NoyzBot" class="bot-icon">
                <p>Thinking... 🤔</p>
            </div>
        `;

        fetch("http://127.0.0.1:5000/intro", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("thinking-message").remove(); // Remove "Thinking..."
            chatMessages.innerHTML += `
                <div class="bot-message">
                    <img src="assets/images/noyzbot-logo.png" alt="NoyzBot" class="bot-icon">
                    <p>${data.response}</p>
                </div>
            `;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        })
        .catch(error => console.error('❌ Error fetching intro:', error));
    }

    // ✅ Function to Toggle Chatbox Visibility (Fixing the Order)
    function toggleChat() {
        if (chatbox.style.display === 'none' || chatbox.style.display === '') {
            chatbox.style.display = 'flex';
            chatbox.style.zIndex = "9999";
            if (!playerName) {
                askForGameName(); // Ask for the name only once
            } else {
                fetchRandomIntro();
            }
        } else {
            chatbox.style.display = 'none';
        }
    }

    // ✅ Open Chatbox on Button Click
    openChatBtn.addEventListener('click', function () {
        console.log("💬 Chat button clicked.");
        toggleChat();
    });

    // ✅ Close Chatbox on 'X' Button Click
    closeChatBtn.addEventListener('click', function () {
        console.log("❌ Chatbox closed.");
        chatbox.style.display = 'none';
    });

    // ✅ Send Message Function
    function sendMessage() {
        const userInput = document.getElementById('user-input').value.trim();
        if (userInput !== '') {
            chatMessages.innerHTML += `<p><b>${playerName}:</b> ${userInput}</p>`;
            document.getElementById('user-input').value = '';

            chatMessages.innerHTML += `
                <div class="bot-message" id="thinking-message">
                    <img src="assets/images/noyzbot-logo.png" alt="NoyzBot" class="bot-icon">
                    <p>Thinking... 🤔</p>
                </div>
            `;

            fetch("http://127.0.0.1:5000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_input: userInput })
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById("thinking-message").remove(); // Remove "Thinking..."
                chatMessages.innerHTML += `
                    <div class="bot-message">
                        <img src="assets/images/noyzbot-logo.png" alt="NoyzBot" class="bot-icon">
                        <p>${data.response.replace("{player}", playerName)}</p>
                    </div>
                `;
                chatMessages.scrollTop = chatMessages.scrollHeight;
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
