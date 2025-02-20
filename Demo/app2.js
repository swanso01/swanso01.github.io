let currentPage = 1;
const postsPerPage = 5;

loadMorePosts();

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
