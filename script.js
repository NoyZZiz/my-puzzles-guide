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

// Load saved comments from local storage
window.onload = function() {
    alert("Welcome to the Puzzles and Conquest Guide by Noyzzing! Let’s conquer together!");
    loadComments();
};

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
