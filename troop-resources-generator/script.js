// Google Analytics - For tracking site visitors
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-VYP41CV8E4');

// Main button to toggle "Troop Strength Guide" section (only sub-buttons)
const toggleButton = document.getElementById('toggle-troop-guide');
const troopImprovementGuide = document.getElementById('troop-improvement-guide');

toggleButton.addEventListener('click', function() {
    if (troopImprovementGuide.style.display === 'none') {
        troopImprovementGuide.style.display = 'block'; // Show sub-section buttons
    } else {
        troopImprovementGuide.style.display = 'none'; // Hide sub-section buttons
    }
});

// Function to toggle the visibility of individual content sections (sub-buttons)
function toggleContent(buttonId, contentId) {
    const button = document.getElementById(buttonId);
    const content = document.getElementById(contentId);

    button.addEventListener('click', function() {
        if (content.style.display === 'none') {
            content.style.display = 'block'; // Show the content section
        } else {
            content.style.display = 'none'; // Hide the content section
        }
    });
}

// Apply toggle functionality for each section
toggleContent('toggle-troop-types', 'troop-types');
toggleContent('toggle-building-castle', 'building-castle');
toggleContent('toggle-producing-troops', 'producing-troops');
toggleContent('toggle-increasing-troop-strength', 'increasing-troop-strength');
toggleContent('toggle-heroes-curios-runes', 'heroes-curios-runes');

// Disqus integration for comments
(function() {
    var d = document, s = d.createElement('script');
    s.src = 'https://noyzzing.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
})();

// Handle comment form submission
document.getElementById('commentForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form refresh
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;

    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment');
    commentDiv.innerHTML = `<strong>${name}</strong><p>${comment}</p>`;

    const commentsList = document.getElementById('commentsList');
    commentsList.appendChild(commentDiv);

    document.getElementById('name').value = '';  // Clear form after submission
    document.getElementById('comment').value = '';
});

// Sign-In Form Logic (added consolidated handling)
document.getElementById('signin-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from refreshing the page

    // Get email and password from the form
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;

    // Simple validation (expand as needed)
    if (email && password) {
        // Store the user in localStorage
        localStorage.setItem('user', JSON.stringify({ email, name: 'User' }));

        // Hide sign-in form and show comment section
        document.getElementById('signin-section').style.display = 'none';
        document.getElementById('comments').style.display = 'block';

        // Load Disqus comment section
        loadDisqus();
    } else {
        alert("Please enter valid email and password.");
    }
});

// Check if user is already logged in on page load (only once)
if (localStorage.getItem('user')) {
    // If user is logged in, hide the sign-in form and show the comment section
    document.getElementById('signin-section').style.display = 'none';
    document.getElementById('comments').style.display = 'block';
    loadDisqus(); // Load Disqus comments if user is logged in
}

// Handling visibility of sections for better user experience
document.querySelector('.button-selector').addEventListener('click', function () {
    document.querySelector('#target-section').classList.toggle('active');
});

document.querySelector('#talent-memory-guide-button').addEventListener('click', function () {
    document.querySelector('#talent-memory-guide').classList.toggle('active');
});

// Handling other buttons dynamically if needed
document.querySelector('.button-for-other-sections').addEventListener('click', function () {
    document.querySelector('#other-section').classList.toggle('active');
});

// Save comment to local storage
function saveCommentToLocalStorage(name, comment) {
    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments.push({ name, comment });
    localStorage.setItem('comments', JSON.stringify(comments));
}

// Load comments from local storage
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
