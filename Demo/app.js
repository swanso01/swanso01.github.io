document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('posts-container');

    // Fetching data from the API
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(data => {
            // Loop through each post and display it
            data.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                
                // Add content to the post
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.body}</p>
                `;
                
                postsContainer.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

let currentPage = 1;
const postsPerPage = 5;

function loadMorePosts() {
    const postsContainer = document.getElementById('posts-container');

    currentPage++;
    fetch(`https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=${postsPerPage}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.body}</p>
                `;
                postsContainer.appendChild(postElement);
            });
        });
}
