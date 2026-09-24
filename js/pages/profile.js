import { createPost } from "../api/posts.js";
import { getProfile, getProfilePosts } from "../api/profiles.js";
import { createPostCard } from "../ui/postCard.js";

const profileMessage = document.querySelector("#profile-message");
const profileContainer = document.querySelector("#profile-container");
const nameElement = document.querySelector("#profile-name");
const bioElement = document.querySelector("#profile-bio");
const statsElement = document.querySelector("#profile-stats");

const postsSection = document.querySelector("#profile-posts-section");
const postsMessage = document.querySelector("#posts-message");
const postsContainer = document.querySelector("#posts-container");
const loadMoreButton = document.querySelector("#load-more-button");

let profileName;
let nextPage = 1;
let isLoading = false;

async function loadProfile() {
    if (!sessionStorage.getItem("accessToken")) {
        window.location.replace("./login.html");
        return;
    }

    profileMessage.textContent = "Loading profile...";

    try {
        const param = new URLSearchParams(window.location.search);
        profileName = param.get("name");

        if (!profileName) {
            const storedProfile = JSON.parse(
                sessionStorage.getItem("profile"),
            );

            if (!storedProfile || !storedProfile.name) {
                profileMessage.textContent = "Please log in again";
                return;
            }

            profileName = storedProfile.name;
        }

        const profile = await getProfile(profileName);

        nameElement.textContent = profile.name;
        bioElement.textContent = profile.bio || "No bio yet";

        const postCount = profile._count?.posts || 0;
        const followerCount = profile._count?.followers || 0;
        const followingCount = profile._count?.following || 0;

        statsElement.textContent = `${postCount} posts · ${followerCount} followers · ${followingCount} following`;

        document.title = `${profile.name} | JSocial`;

        profileContainer.hidden = false;
        postsSection.hidden = false;
        profileMessage.textContent = "";

        await loadPosts();
    } catch (error) {
        profileMessage.textContent = error.message;
    }
}

async function loadPosts() {
    if (isLoading || nextPage === null || !profileName) {
        return;
    }

    isLoading = true;
    loadMoreButton.disabled = true;
    postsMessage.textContent = "Loading posts...";

    try {
        const result = await getProfilePosts(profileName, nextPage);

        result.data.forEach((post) => {
            const card = createPostCard(post);
            postsContainer.append(card);
        });

        if (postsContainer.childElementCount === 0) {
            postsMessage.textContent = "This user has no posts yet";
        } else {
            postsMessage.textContent = "";
        }

        nextPage = result.meta.nextPage;

        loadMoreButton.hidden = result.meta.isLastPage;
        loadMoreButton.textContent = "Load more";
    } catch (error) {
        postsMessage.textContent = error.message;
        loadMoreButton.hidden = false;
        loadMoreButton.textContent = "Try again";
    } finally {
        isLoading = false;
        loadMoreButton.disabled = false;
    }
}

loadMoreButton.addEventListener("click", loadPosts);

loadProfile();