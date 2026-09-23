import { getPost } from "../api/posts.js";

const message = document.querySelector("#post-message");
const container = document.querySelector("#post-container");
const title = document.querySelector("#post-title");
const author = document.querySelector("#post-author");
const body = document.querySelector("#post-body");
const image = document.querySelector("#post-image");

async function loadPost() {
    if (!sessionStorage.getItem("accessToken")) {
        window.location.replace("./login.html");
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id || !/^[1-9]\d*$/.test(id)) {
        message.textContent = "Missing or invalid post ID.";
        return;
    }

    message.textContent = "Loading post...";

    try {
        const post = await getPost(id);

        title.textContent = post.title || "Untitled post";
        author.textContent = `By ${post.author?.name || "Unknown author"}`;
        body.textContent = post.body || "";

        document.title = `${post.title || "Post"} | JSocial`;

        if (post.media?.url) {
            showPostImage(post.media);
        }

        container.hidden = false;
        message.textContent = "";
    } catch (error) {
        message.textContent = 
            error instanceof TypeError
                ? "Could not contact the service. Check your connection and try again."
                : error.message;
    }
}

function showPostImage(media) {
    try {
        const url = new URL(media.url);

        if (url.protocol !== "https:" && url.protocol !== "http:") {
            return;
        }

        image.alt = media.alt || "";
        image.addEventListener("error", () => {
            image.hidden = true;
        });

        image.src = url.href;
        image.hidden = false;
    } catch {
        image.hidden = true;
    }
}

loadPost();