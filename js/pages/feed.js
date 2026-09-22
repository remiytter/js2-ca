import { getPosts } from "../api/posts.js";

const postsContainer = document.querySelector("#posts-container");
const message = document.querySelector("#feed-message");
const loadMoreButton = document.querySelector("#load-more-button");
const logoutButton = document.querySelector("#logout-button");

let nextPage = 1;
let isLoading = false;

function createPostCard(post) {
    const article = document.createElement("article");
    article.classList.add("post-card");

    const heading = document.createElement("h2");
    const link = document.createElement("a");

    link.textContent = post.title || "Untitled post";
    link.href = `./post.html?id=${encodeURIComponent(post.id)}`;

    heading.append(link);

    const author = document.createElement("p");
    author.classList.add("post-author");
    author.textContent = `By ${post.author?.name || "Unknown author"}`;

    const excerpt = document.createElement("p");
    const body = post.body || "";

    excerpt.textContent = body.length > 160 ? `${body.slice(0, 160)}...` : body;

    article.append(heading, author, excerpt);

    return article;
}

async function loadPosts() {
    if (isLoading || nextPage === null) {
        return;
    }

    isLoading = true;
    loadMoreButton.disabled = true;
    message.textContent = "Loading posts...";

    try {
        const result = await getPosts(nextPage);

        result.data.forEach((post) => {
            const card = createPostCard(post);
            postsContainer.append(card);
        });

        message.textContent = 
            postsContainer.childElementCount === 0
            ? "No posts found."
            : "";
        
        nextPage = result.meta.nextPage;

        loadMoreButton.hidden = result.meta.isLastPage;
        loadMoreButton.textContent = "Load more";
    } catch(error) {
        message.textContent =
            error instanceof TypeError
                ? "Could not contact the service. Check your connection and try again."
                : error.message;

        loadMoreButton.hidden = false;
        loadMoreButton.textContent = "Try again";
    } finally {
        isLoading = false;
        loadMoreButton.disabled = false;
    }
}

function logout() {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("profile");

    window.location.replace("./login.html");
}

logoutButton.addEventListener("click", logout);

if (!sessionStorage.getItem("accessToken")) {
    window.location.replace(".login.html");
} else {
    loadMoreButton.addEventListener("click", loadPosts);
    loadPosts();
}