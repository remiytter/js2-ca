import { API_BASE, API_KEY} from "./config.js";

/**
 * Fetches one page of posts, including their authors
 * @param {number} page - The page number to fetch
 * @returns {Promise<object>} Posts and pagination information
 * @throws {Error} If the request fails
 */

export async function getPosts(page = 1) {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
        throw new Error("Please log in to view posts.");
    }

    const response = await fetch(
        `${API_BASE}/social/posts?_author=true&sort=created&sortOrder=desc&limit=20&page=${page}`,
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
            result.errors?.[0]?.message || "Could not load posts.",
        );
    }

    return result;
}

/**
 * Fetches a single post with author information
 * @param {string} id - The ID of the post
 * @returns {Promise<object>} The requested post
 * @throws {Error} If the request fails
 */

export async function getPost(id) {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
        throw new Error("Please log in to view this post.");
    }

    const response = await fetch(
        `${API_BASE}/social/posts/${encodeURIComponent(id)}?_author=true`,
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
            result.errors?.[0]?.message || "Could not load the post",
        );
    }

    return result.data;
}

/**
 * Creates a post for the user that is logged in.
 * @param {object} postData - The title, body and optional image
 * @returns {Promise<object>} The newly created post
 * @throws {Error} If the request fails
 */

export async function createPost(postData) {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
        throw new Error("Please log in to create a post");
    }

    const response = await fetch(`${API_BASE}/social/posts`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": API_KEY,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.errors?.[0]?.message || "Could not create the post",
        );
    }

    return result.data;
}