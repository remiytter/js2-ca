import { API_BASE, API_KEY } from "./config.js";

/**
 * Fetches a profile by username
 * @param {string} name - The username
 * @returns {Promise<object>} The requested profile
 * @throws {Error} If the request fails
 */

export async function getProfile(name) {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
        throw new Error("Please log in to view profile");
    }

    const response = await fetch(
        `${API_BASE}/social/profiles/${encodeURIComponent(name)}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "X-Noroff-API-Key": API_KEY,
            },
        },
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.errors?.[0]?.message || "Could not load the profile",
        );
    }

    return result.data;
}

/**
 * Fetches one page of posts by a specific user
 * @param {string} name - The username
 * @param {number} page - The page number
 * @returns {Promise<object>} Posts and pagination info
 * @throws {Error} If the request fails
 */

export async function getProfilePosts(name, page = 1) {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
        throw new Error("Please log in to view posts");
    }

    const response = await fetch(`${API_BASE}/social/profiles/${encodeURIComponent(name)}/posts?_author=true&sort=created&sortOrder=desc&limit=20&page=${page}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "X-Noroff-API-Key": API_KEY,
            },
        },
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.errors?.[0]?.message || "Could not load this user's post",
        );
    }

    return result;
}