import { loginUser } from "../api/auth.js";

const form = document.querySelector("#login-form");
const message = document.querySelector("#form-message");
const submitButton = form.querySelector('button[type="submit"]');

async function handleLogin(event) {
    event.preventDefault();

    const formData = new FormData(form);

    const credentials = {
        email: formData.get("email").trim(),
        password: formData.get("password"),
    };

    message.textContent = "logging in...";
    submitButton.disabled = true;
    submitButton.textContent = "Logging in...";

    try {
        const user = await loginUser(credentials);

        sessionStorage.setItem("accessToken", user.accessToken);

        const profile = {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            banner: user.banner,
        };

        sessionStorage.setItem("profile", JSON.stringify(profile));

        window.location.href = "./index.html";
    } catch (error) {
        message.textContent = 
            error instanceof TypeError
            ? "Could not contact the service. Check your connection and try again."
            : error.message;
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Log in";
    }
}

form.addEventListener("submit", handleLogin);

submitButton.disabled = false;