// 1. Show a welcome alert when the page loads
window.onload = function() {
    alert("Welcome to the Puzzles and Conquest Guide by Noyzzing! Let’s conquer together!");
    
    // Check if the user is logged in by checking localStorage
    if(localStorage.getItem('user')) {
        // Hide the sign-in form and show the comment section
        document.getElementById('signin-section').style.display = 'none';
        document.getElementById('comments').style.display = 'block';

        // Load Disqus comment section
        loadDisqus();
    }
};

// 2. Handle Sign-In Form Submission
document.getElementById('signin-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from refreshing the page
    
    // Get the email and password values from the form
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;

    // Simple validation (You can enhance this as needed)
    if (email && password) {
        // Store the user information in localStorage
        localStorage.setItem('user', JSON.stringify({ email, name: 'User' }));

        // Hide the sign-in form and show the comment section
        document.getElementById('signin-section').style.display = 'none';
        document.getElementById('comments').style.display = 'block';

        // Load Disqus comment section
        loadDisqus();
    } else {
        alert("Please enter a valid email and password.");
    }
});

// 3. Load the Disqus comment section
function loadDisqus() {
    const disqusConfig = function() {
        this.page.url = window.location.href;  // Set the page URL dynamically
        this.page.identifier = window.location.pathname;  // Set page identifier dynamically
    };

    (function() { // Don't edit below this line
        var d = document, s = d.createElement('script');
        s.src = 'https://noyzzing.disqus.com/embed.js';  // Disqus shortname
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    })();
}

// 4. Handle Comment Form Submission
document.getElementById('commentForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from refreshing the page
    
    // Get the name and comment values from the form
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;

    // Create a new div element to display the submitted comment
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment');
    commentDiv.innerHTML = `<strong>${name}</strong><p>${comment}</p>`;

    // Get the comment list and append the new comment to the bottom
    const commentsList = document.getElementById('commentsList');
    commentsList.appendChild(commentDiv);  // Appends the comment to the bottom

    // Save the comment to localStorage
    saveCommentToLocalStorage(name, comment);

    // Clear the form fields after submission
    document.getElementById('name').value = '';
    document.getElementById('comment').value = '';
});

// 5. Save the comment to localStorage
function saveCommentToLocalStorage(name, comment) {
    let comments = JSON.parse(localStorage.getItem('comments')) || []; // Retrieve existing comments or initialize as empty
    comments.push({ name, comment }); // Add the new comment to the array
    localStorage.setItem('comments', JSON.stringify(comments)); // Save the updated array to localStorage
}

// 6. Load the comments from localStorage when the page loads
function loadComments() {
    let comments = JSON.parse(localStorage.getItem('comments')) || []; // Retrieve the comments from localStorage
    const commentsList = document.getElementById('commentsList');
    
    // Loop through each comment and append it to the bottom of the list
    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        commentDiv.innerHTML = `<strong>${comment.name}</strong><p>${comment.comment}</p>`;
        commentsList.appendChild(commentDiv); // Appends to the bottom of the comments list
    });
}
