import { registerUser } from "../api/auth.js";

const form = document.querySelector("#register-form");
const message = document.querySelector("#form-message");
const submitButton = document.querySelector('button[type="submit"]');

async function handleRegister(event) {
    event.preventDefault();

    const formData = new FormData(form);

    const user = {
        name: formData.get("name").trim(),
        email: formData.get("email").trim(),
        password: formData.get("password"),
    };

    message.textContent = "Creating your account...";
    submitButton.disabled = true;
    submitButton.textContent = "Creating account...";

    try {
        await registerUser(user);

        form.reset();
        message.textContent = "Account created! You can now log in.";
    } catch (error) {
        message.textContent =
            error instanceof TypeError
            ? "Could not contact the service. Check your connection and try again."
            : error.message;
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Create account";
    }
}

form.addEventListener("submit", handleRegister);

submitButton.disabled = false;