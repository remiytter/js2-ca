import { getPost, updatePost } from "../api/posts.js";

const form = document.querySelector("#edit-form");
const message = document.querySelector("#form-message");
const submitButton = form.querySelector('button[type="submit"]');
const cancelLink = document.querySelector("#cancel-link");

const titleInput = document.querySelector("#title");
const bodyInput = document.querySelector("#body");
const imageUrlInput = document.querySelector("#image-url");
const imageAltInput = document.querySelector("#image-alt");

const param = new URLSearchParams(window.location.search);
const id = param.get("id");

let canEdit = false;

async function loadEditForm() {
    if (!sessionStorage.getItem("accessToken")) {
        window.location.replace("./login.html");
        return;
    }

    if (!id || !/^[1-9]\d*$/.test(id)) {
        message.textContent = "Missing or invalid post ID";
        return;
    }

    message.textContent = "Loading post...";

    try {
        const post = await getPost(id);
        const profile = JSON.parse(sessionStorage.getItem("profile"));

        if (
            !profile ||
            !post.author ||
            profile.name !== post.author.name
        ) {
            message.textContent = "You can only edit your own posts";
            return;
        }

        titleInput.value = post.title || "";
        bodyInput.value = post.body || "";

        if (post.media) {
            imageUrlInput.value = post.media.url || "";
            imageAltInput.value = post.media.alt || "";
        }

        cancelLink.href = `./post.html?id=${encodeURIComponent(id)}`;

        canEdit = true;
        form.hidden = false;
        submitButton.disabled = false;
        message.textContent = "";
    } catch (error) {
        if (error instanceof TypeError) {
            message.textContent = "Could not contact the service. Check your connection and try again";
        } else {
            message.textContent = error.message;
        }
    }
}

async function handleEdit(event) {
    event.preventDefault();

    if (!canEdit || submitButton.disabled) {
        return;
    }

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
        media: null,
    };

    if (imageUrl) {
        postData.media = {
            url: imageUrl,
            alt: imageAlt,
        };
    }

    submitButton.disabled = true;
    submitButton.textContent = "Saving...";
    message.textContent = "Saving changes...";

    try {
        await updatePost(id, postData);

        window.location.href = `./post.html?id=${encodeURIComponent(id)}`;
    } catch (error) {
        if (error instanceof TypeError) {
            message.textContent = "Could not contact the service. Check your connection and try again";
        } else {
            message.textContent = error.message;
        }
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Save changes";
    }
}

form.addEventListener("submit", handleEdit);

loadEditForm();