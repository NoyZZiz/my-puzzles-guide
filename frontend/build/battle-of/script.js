document.addEventListener("DOMContentLoaded", function() {
  console.log("✅ DOM fully loaded and parsed");

  // DOM Elements
  const elements = {
      chatbox: document.getElementById('chatbox'),
      openBtn: document.getElementById('open-chat-btn'),
      closeBtn: document.querySelector('.chat-close'),
      messages: document.getElementById('chat-messages'),
      userInput: document.getElementById('user-input'),
      sendBtn: document.querySelector('.chat-send'),
      typingText: document.getElementById('typing-text')
  };

  // Configuration
  const config = {
      apiEndpoint: "https://my-puzzles-guide-production.up.railway.app/chat",
      typingText: "Dominate the battlefield with our expert guides and powerful tools.",
      typingSpeed: 50
  };

  // Validate essential elements
  if (!validateElements(elements)) return;

  // Initialize application
  initChat();
  initTypingEffect();
  initSmoothScrolling();
  initAnalytics();

  // Core Functions
  function validateElements(elements) {
      const required = ['chatbox', 'openBtn', 'closeBtn', 'messages', 'userInput', 'sendBtn'];
      const missing = required.filter(key => !elements[key]);
      
      if (missing.length) {
          console.error(`❌ Missing elements: ${missing.join(', ')}`);
          return false;
      }
      return true;
  }

  function initChat() {
      // Initialize chat state
      elements.chatbox.classList.remove('active');
      elements.openBtn.style.display = 'block';

      // Event listeners
      elements.openBtn.addEventListener('click', toggleChat);
      elements.closeBtn.addEventListener('click', toggleChat);
      elements.sendBtn.addEventListener('click', sendMessage);
      elements.userInput.addEventListener('keydown', handleInputKeydown);
      document.addEventListener('keydown', handleEscapeKey);
  }

  function toggleChat() {
      elements.chatbox.classList.toggle('active');
      elements.openBtn.style.display = elements.chatbox.classList.contains('active') ? 'none' : 'block';
      
      if (elements.chatbox.classList.contains('active')) {
          elements.userInput.focus();
      }
      
      console.log(`Chat ${elements.chatbox.classList.contains('active') ? 'opened' : 'closed'}`);
  }

  async function sendMessage() {
      const message = elements.userInput.value.trim();
      if (!message) return;

      // Add user message and clear input
      addMessage(message, 'user-message');
      elements.userInput.value = '';

      try {
          // Show loading indicator
          const loadingId = 'loading-' + Date.now();
          addMessage('Thinking...', 'bot-message', loadingId);

          // Get bot response
          const botResponse = await fetchBotResponse(message);
          
          // Remove loading and show response
          document.getElementById(loadingId)?.remove();
          showBotResponse(botResponse);
          
      } catch (error) {
          console.error("Chat error:", error);
          showErrorMessage();
      }
  }

  async function fetchBotResponse(message) {
      const response = await fetch(config.apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_input: message })
      });
      
      if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
      }
      
      return await response.json();
  }

  function showBotResponse(data) {
      let content = `<p>${data.response}</p>`;
      if (data.image_url) {
          content += `<img src="${data.image_url}" alt="Bot response" class="bot-image">`;
      }
      addMessage(content, 'bot-message');
  }

  function showErrorMessage() {
      const errorId = 'error-' + Date.now();
      addMessage("❌ Sorry, I'm having trouble responding. Please try again later.", 'bot-message error', errorId);
  }

  function addMessage(content, className, id = '') {
      const message = document.createElement('div');
      message.className = `message ${className}`;
      if (id) message.id = id;
      message.innerHTML = content;
      elements.messages.appendChild(message);
      elements.messages.scrollTop = elements.messages.scrollHeight;
  }

  function handleInputKeydown(e) {
      if (e.key === "Enter") {
          sendMessage();
      }
  }

  function handleEscapeKey(e) {
      if (e.key === 'Escape' && elements.chatbox.classList.contains('active')) {
          toggleChat();
      }
  }

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

  function initAnalytics() {
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-VYP41CV8E4');
  }
});