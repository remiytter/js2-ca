import { createPost } from "../api/posts.js";

const form = document.querySelector("#create-form");
const message = document.querySelector("#form-message");
const submitButton = document.querySelector('button[type="submit"]');

async function handleCreate(event) {
    event.preventDefault();

    const formData = new FormData(form);

    const title = formData.get("title").trim();
    const body = formData.get("body").trim();
    const imageUrl = formData.get("imageUrl").trim();
    const imageAlt = formData.get("imageAlt").trim();

    if (!title) {
        message.textContent = "Please enter a title";
        return;
    }

    const postData = {
        title: title,
        body: body,
    };

    if (imageUrl) {
        postData.media = {
            url: imageUrl,
            alt: imageAlt,
        };
    }

    submitButton.disabled = true;
    submitButton.textContent = "Publishing...";
    message.textContent = "Publishing your post...";

    try {
        const post = await createPost(postData);

        window.location.href = `./post.html?id=${encodeURIComponent(post.id)}`;
    } catch (error) {
        if (error instanceof TypeError) {
            message.textContent = "Could not contact the service. Check your connection and try again";
        } else {
            message.textContent = error.message;
        }
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Publish post";
    }
}

if (!sessionStorage.getItem("accessToken")) {
    window.location.replace("./login.html");
} else {
    form.addEventListener("submit", handleCreate);
    submitButton.disabled = false;
}

