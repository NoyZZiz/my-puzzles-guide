// Google Analytics - For tracking site visitors
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-VYP41CV8E4');

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM fully loaded.");

    // ✅ Troop Guide Toggle Logic
    const toggleButton = document.getElementById('toggle-troop-guide');
    const troopImprovementGuide = document.getElementById('troop-improvement-guide');

    if (toggleButton && troopImprovementGuide) {
        toggleButton.addEventListener('click', function () {
            troopImprovementGuide.style.display = (troopImprovementGuide.style.display === 'none') ? 'block' : 'none';
        });
    } else {
        console.error("❌ Element 'toggle-troop-guide' not found in index.html!");
    }

    // ✅ Chatbox Toggle Logic
    const openChatBtn = document.getElementById('open-chat-btn');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatbox = document.getElementById('chatbox');

    if (openChatBtn && chatbox) {
        openChatBtn.addEventListener('click', function () {
            console.log("💬 Chat button clicked.");
            chatbox.style.display = (chatbox.style.display === 'none' || chatbox.style.display === '') ? 'flex' : 'none';
        });
    } else {
        console.error("❌ Chatbox or Chat button not found in index.html!");
    }

    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', function () {
            chatbox.style.display = 'none';
        });
    } else {
        console.error("❌ Close button 'close-chat-btn' not found in index.html!");
    }

    // ✅ Disqus Comment Count Fix
    let d = document, s = d.createElement('script');
    s.src = 'https://noyzzing.disqus.com/count.js';
    s.setAttribute('id', 'dsq-count-scr');
    s.setAttribute('async', '');
    (d.head || d.body).appendChild(s);
});

// ✅ Toggle Chatbox Function
function toggleChat() {
    const chatbox = document.getElementById('chatbox');
    if (chatbox) {
        chatbox.style.display = (chatbox.style.display === 'none' || chatbox.style.display === '') ? 'flex' : 'none';
    } else {
        console.error("❌ Chatbox not found in DOM!");
    }
}

// ✅ Send Message Function
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

// ✅ Save & Load Comments from Local Storage
function saveCommentToLocalStorage(name, comment) {
    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments.push({ name, comment });
    localStorage.setItem('comments', JSON.stringify(comments));
}

function loadComments() {
    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    const commentsList = document.getElementById('commentsList');

    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        commentDiv.innerHTML = `<strong>${comment.name}</strong><p>${comment.comment}</p>`;
        commentsList.appendChild(commentDiv);
    });
}

// ✅ Apply Toggle Functionality for Sections
toggleContent('toggle-troop-types', 'troop-types');
toggleContent('toggle-building-castle', 'building-castle');
toggleContent('toggle-producing-troops', 'producing-troops');
toggleContent('toggle-increasing-troop-strength', 'increasing-troop-strength');
toggleContent('toggle-heroes-curios-runes', 'heroes-curios-runes');

// ✅ Disqus Integration for Comments
(function () {
    var d = document, s = d.createElement('script');
    s.src = 'https://noyzzing.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
})();

// ✅ Sign-In Form Logic
document.addEventListener("DOMContentLoaded", function () {
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('signin-email').value;
            const password = document.getElementById('signin-password').value;
            if (email && password) {
                localStorage.setItem('user', JSON.stringify({ email, name: 'User' }));
                document.getElementById('signin-section').style.display = 'none';
                document.getElementById('comments').style.display = 'block';
                loadDisqus();
            } else {
                alert("Please enter a valid email and password.");
            }
        });
    }
});
