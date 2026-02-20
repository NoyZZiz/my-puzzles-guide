document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM fully loaded.");
  
    const chatbox = document.getElementById('chatbox');
    const openChatBtn = document.getElementById('open-chat-btn');
    const closeChatBtn = document.querySelector('.chat-close');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.querySelector('.chat-send');
  
    // ✅ Check if elements exist
    if (!chatbox || !openChatBtn || !closeChatBtn || !chatMessages || !userInput || !sendBtn) {
        console.error("❌ One or more chat elements not found!");
        return;
    }
  
    // ✅ Toggle chat function
    function toggleChat() {
        console.log("💬 Toggling chat.");
        chatbox.style.display = chatbox.style.display === 'none' ? 'flex' : 'none';
    }
  
    // ✅ Send message function
    function sendMessage() {
        console.log("📤 Sending message...");
        const userText = userInput.value.trim();
        if (userText === "") return;
  
        chatMessages.innerHTML += `
            <div class="message user-message">
                <p>${userText}</p>
            </div>
        `;
        userInput.value = '';
  
        fetch("http://127.0.0.1:5000/chat",  { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_input: userText })  
        })
        .then(response => response.json())
        .then(data => {
            let botReply = `<div class="message bot-message"><p>${data.response}</p>`;
            if (data.image_url) {
                botReply += `<img src="${data.image_url}" alt="Bot response image" class="bot-image">`;
            }
            botReply += `</div>`;
            chatMessages.innerHTML += botReply;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        })
        .catch(error => {
            console.error("❌ Error sending message:", error);
            chatMessages.innerHTML += `
                <div class="message bot-message">
                    <p>❌ Oops! Something went wrong. Try again later.</p>
                </div>
            `;
        });
    }
  
    // ✅ Attach event listeners
    openChatBtn.addEventListener("click", toggleChat);
    closeChatBtn.addEventListener("click", toggleChat);
    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") sendMessage();
    });
  
    // ✅ Typing effect for hero subtitle
    const typingText = document.getElementById('typing-text');
    const textToType = "Dominate the battlefield with our expert guides and powerful tools.";
    let i = 0;
    
    function typeWriter() {
      if (i < textToType.length) {
        typingText.innerHTML += textToType.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      }
    }
    
    typeWriter();
  
    // ✅ Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          e.preventDefault();
          document.querySelector(this.getAttribute('href')).scrollIntoView({
              behavior: 'smooth'
          });
      });
    });
  
    // ✅ Google Analytics Tracking
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-VYP41CV8E4');
  });