// 1. Welcome Alert: Show a greeting when the page loads
window.onload = function() {
    alert("Welcome to the Puzzles and Conquest Guide by Noyzzing! Let’s conquer together!");

    // Load comments from local storage when the page loads
    loadComments();
};

// 2. Handle comment form submission
document.getElementById('commentForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from refreshing the page

    // Get the values from the form
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;

    // Create a new div element to display the submitted comment
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment');
    commentDiv.innerHTML = `<strong>${name}</strong><p>${comment}</p>`;

    // Get the comment list and append the new comment to the bottom
    const commentsList = document.getElementById('commentsList');
    commentsList.appendChild(commentDiv);  // Appends the comment to the bottom

    // Save the comment to local storage
    saveCommentToLocalStorage(name, comment);

    // Clear the form fields after submission
    document.getElementById('name').value = '';
    document.getElementById('comment').value = '';
});

// 3. Save the comment to local storage
function saveCommentToLocalStorage(name, comment) {
    let comments = JSON.parse(localStorage.getItem('comments')) || []; // Retrieve existing comments or initialize as empty
    comments.push({ name, comment }); // Add the new comment to the array
    localStorage.setItem('comments', JSON.stringify(comments)); // Save the updated array to localStorage
}

// 4. Load the comments from local storage when the page loads
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
