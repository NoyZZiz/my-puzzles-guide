<script>
    // 1. Google Analytics Script
    // Replace 'YOUR_TRACKING_ID' with your actual Google Analytics ID
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    
    ga('create', 'YOUR_TRACKING_ID', 'auto');
    ga('send', 'pageview');

    // 2. Google Analytics
    // Google Analytics snippet provided above.
    // Add the script as shown in your HTML file within <head> section.

    // 3. Disqus Setup
    /**
    * RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
    * LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables
    */
    /*
    var disqus_config = function () {
    this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
    this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
    */
    (function() { // DON'T EDIT BELOW THIS LINE
    var d = document, s = d.createElement('script');
    s.src = 'https://noyzzing.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
    })();

    // 4. Disqus Comment Section (you should also add the comment section's HTML code before this)
    <script id="dsq-count-scr" src="//noyzzing.disqus.com/count.js" async></script>

    // 5. Welcome Alert: Show a greeting when the page loads
    window.onload = function() {
        alert("Welcome to the Puzzles and Conquest Guide by Noyzzing! Let’s conquer together!");

        // Load comments from local storage when the page loads
        loadComments();
    };

    // 6. Handle comment form submission
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

    // 7. Save the comment to local storage
    function saveCommentToLocalStorage(name, comment) {
        let comments = JSON.parse(localStorage.getItem('comments')) || []; // Retrieve existing comments or initialize as empty
        comments.push({ name, comment }); // Add the new comment to the array
        localStorage.setItem('comments', JSON.stringify(comments)); // Save the updated array to localStorage
    }

    // 8. Load the comments from local storage when the page loads
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

    // 9. Toggle Visibility of the Troop Strength Guide Section
    // 1. Main button to toggle "Troop Strength Guide" section
const toggleButton = document.getElementById('toggle-troop-guide');
const troopImprovementGuide = document.getElementById('troop-improvement-guide');

// Toggle visibility of the "Troop Strength Guide" section (only sub-buttons)
toggleButton.addEventListener('click', function() {
    if (troopImprovementGuide.style.display === 'none') {
        troopImprovementGuide.style.display = 'block'; // Show the sub-section buttons
    } else {
        troopImprovementGuide.style.display = 'none'; // Hide the sub-section buttons
    }
});

// 2. Function to toggle visibility of individual sub-section buttons
function toggleButtonVisibility(buttonId) {
    const button = document.getElementById(buttonId);

    button.addEventListener('click', function() {
        if (this.nextElementSibling.style.display === 'none') {
            this.nextElementSibling.style.display = 'block'; // Show the content below
        } else {
            this.nextElementSibling.style.display = 'none'; // Hide the content below
        }
    });
}

// Apply to all sub-section buttons
toggleButtonVisibility('toggle-troop-types');
toggleButtonVisibility('toggle-building-castle');
toggleButtonVisibility('toggle-producing-troops');
toggleButtonVisibility('toggle-increasing-troop-strength');
toggleButtonVisibility('toggle-heroes-curios-runes');
