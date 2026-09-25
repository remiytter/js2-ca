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
        `${API_BASE}/social/profiles/${encodeURIComponent(name)}?_followers=true`,
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

/**
 * Follows or unfollows a profile
 * @param {string} name - The username of the profile
 * @param {boolean} shouldFollow - True to follow, false to unfollow
 * @returns {Promise<void>}
 * @throws {Error} If the request fails
 */

export async function setFollow(name, shouldFollow) {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
        throw new Error("Please log in to follow users");
    }

    let action = "follow";

    if(!shouldFollow) {
        action = "unfollow";
    }

    const response = await fetch(
        `${API_BASE}/social/profiles/${encodeURIComponent(name)}/${action}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "X-Noroff-API-Key": API_KEY,
            },
        },
    );

    if (!response.ok) {
        const result = await response.json();

        throw new Error(
            result.errors?.[0]?.message || "Could not update follow status",
        );
    }
}