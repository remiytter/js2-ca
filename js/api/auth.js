import { API_BASE } from "./config.js";

/**
 * Registers a new user
 * @param {{name: string, email: string, password: string}} user
 * @returns {Promise<object>} The newly created user profile
 * @throws {Error} If registration fails.
 */

export async function registerUser(user) {
    const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });

    const result = await response.json();

    if (!response.ok) {
        const message = result.errors?.[0]?.message || "Registration failed. Please try again.";

        throw new Error(message);
    }

    return result.data;
}

/**
 * Logs in an existing user
 * @param {{email: string, password: string}} credentials
 * @returns {Promise<object>} The user profile and access token.
 * @throws {Error} if login fails.
 */

export async function loginUser(credentials) {
    const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    const result = await response.json();

    if (!response.ok) {
        const message = result.errors?.[0]?.message || "Login failed. Please try again.";

        throw new Error(message);
    }

    return result.data;
}