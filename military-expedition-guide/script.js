document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM fully loaded.");

    const openChatBtn = document.getElementById('open-chat-btn');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatbox = document.getElementById('chatbox');

    if (!openChatBtn || !chatbox) {
        console.error("❌ 'open-chat-btn' or 'chatbox' is missing in HTML.");
        return;
    }

    openChatBtn.addEventListener('click', function () {
        console.log("💬 Chat button clicked.");
        chatbox.style.display = 'flex';
        chatbox.style.zIndex = "9999";
        console.log("✅ Chatbox forced open.");
    });

    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', function () {
            chatbox.style.display = 'none';
            console.log("✅ Chatbox closed via close button.");
        });
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
                chatMessages.innerHTML += `<p><b>NoyzBot:</b> ${data.response}</p>`;
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
});
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM fully loaded.");

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


