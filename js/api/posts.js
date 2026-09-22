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