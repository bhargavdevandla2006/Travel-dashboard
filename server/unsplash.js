require("dotenv").config();

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

async function searchUnsplashPhotos(query, page = 1) {
    try {
        const url =
            `https://api.unsplash.com/search/photos` +
            `?query=${encodeURIComponent(query)}` +
            `&page=${page}` +
            `&per_page=30` +
            `&orientation=landscape`;

        const response = await fetch(url, {
            headers: {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                "Accept-Version": "v1"
            }
        });

        if (!response.ok) {
            const errorText = await response.text();

            console.error("Unsplash error:", response.status);
            console.error(errorText);

            return [];
        }

        const data = await response.json();

        return data.results || [];

    } catch (error) {
        console.error("Unsplash request failed:", error);

        return [];
    }
}

module.exports = {
    searchUnsplashPhotos
};