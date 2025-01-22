document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM fully loaded.");

    const openChatBtn = document.getElementById('open-chat-btn');
    const closeChatBtn = document.querySelector('#chat-header button');
    const chatbox = document.getElementById('chatbox');
    const chatLogo = document.querySelector('.chat-logo');
    const closeChatText = document.getElementById('close-chat-text'); // Ensure this is correctly referenced

    if (!openChatBtn || !chatbox) {
        console.error("❌ 'open-chat-btn' or 'chatbox' is missing in HTML.");
        return;
    }

    openChatBtn.addEventListener('click', function () {
        console.log("💬 Chat button clicked.");
        chatbox.style.display = 'flex';
        chatbox.style.zIndex = "9999"; // Ensure it's on top
        console.log("✅ Chatbox opened.");
    });

    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', function () {
            console.log("❌ Chatbox closed via close button.");
            chatbox.style.display = 'none';
        });
    } else {
        console.warn("⚠️ 'close-chat-btn' not found, skipping.");
    }

    if (closeChatText) {
        closeChatText.addEventListener('click', function () {
            console.log("❌ Chatbox closed via close text.");
            chatbox.style.display = 'none';
        });
    } else {
        console.warn("⚠️ 'close-chat-text' not found, skipping.");
    }

    // ✅ Ensure Correct Logo Path for Chatbox
    if (chatLogo) {
        chatLogo.src = "../assets/images/noyzbot-logo.png"; // Adjusted for subfolder
        console.log("✅ Chat logo path set correctly.");
    } else {
        console.warn("⚠️ Chat logo not found.");
    }

    // ✅ Function to send messages in the chatbox
    function sendMessage() {
        const userInput = document.getElementById('user-input').value;
        if (userInput.trim() !== '') {
            const chatMessages = document.getElementById('chat-messages');
            chatMessages.innerHTML += `<p><b>You:</b> ${userInput}</p>`;
            document.getElementById('user-input').value = ''; // Clear input field

            fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_input: userInput })
            })
            .then(response => response.json())
            .then(data => {
                chatMessages.innerHTML += `
                    <div class="bot-message">
                        <img src="../assets/images/noyzbot-logo.png" alt="NoyzBot" class="bot-icon">
                        <p><b>NoyzBot:</b> ${data.response}</p>
                    </div>
                `;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            })
            .catch(error => console.error('Error sending message:', error));
        }
    }

    // ✅ Assign send message function to button
    const sendBtn = document.getElementById('send-btn');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    } else {
        console.warn("⚠️ 'send-btn' not found, skipping.");
    }

    // ✅ Fix Home Button Navigation
    const homeBtn = document.getElementById("home-btn");
    if (homeBtn) {
        homeBtn.addEventListener("click", function () {
            console.log("🏠 Home button clicked. Navigating...");
            window.location.href = "index.html"; // Adjust path if needed
        });
    } else {
        console.warn("⚠️ Home button not found on this page.");
    }
});
