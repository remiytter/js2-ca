import { getPosts, searchPosts } from "../api/posts.js";
import { createPostCard } from "../ui/postCard.js";

const postsContainer = document.querySelector("#posts-container");
const message = document.querySelector("#feed-message");
const loadMoreButton = document.querySelector("#load-more-button");
const logoutButton = document.querySelector("#logout-button");

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");

let nextPage = 1;
let isLoading = false;
let searchQuery = "";

async function loadPosts() {
    if (isLoading || nextPage === null) {
        return;
    }

    isLoading = true;
    loadMoreButton.disabled = true;
    searchButton.disabled = true;
    searchInput.disabled = true;
    message.textContent = "Loading posts...";

    try {
        let result;

        if (searchQuery) {
            result = await searchPosts(searchQuery, nextPage);
        } else {
            result = await getPosts(nextPage);
        }

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
    } catch (error) {
        message.textContent =
            error instanceof TypeError
                ? "Could not contact the service. Check your connection and try again."
                : error.message;

        loadMoreButton.hidden = false;
        loadMoreButton.textContent = "Try again";
    } finally {
        isLoading = false;
        loadMoreButton.disabled = false;
        searchButton.disabled = false;
        searchInput.disabled = false;
    }
}

function handleSearch(event) {
    event.preventDefault();

    if (isLoading) {
        return;
    }

    searchQuery = searchInput.value.trim();
    nextPage = 1;

    postsContainer.replaceChildren();
    loadMoreButton.hidden = true;

    loadPosts();
}

function logout() {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("profile");

    window.location.replace("./login.html");
}

logoutButton.addEventListener("click", logout);

if (!sessionStorage.getItem("accessToken")) {
    window.location.replace("./login.html");
} else {
    searchForm.addEventListener("submit", handleSearch);
    loadMoreButton.addEventListener("click", loadPosts);

    loadPosts();
}