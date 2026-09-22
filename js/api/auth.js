const API_BASE = "https://v2.api.noroff.dev";

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