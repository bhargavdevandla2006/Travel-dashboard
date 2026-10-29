require("dotenv").config();

async function testUnsplash() {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;

    console.log("Access key exists:", !!accessKey);
    console.log("Access key length:", accessKey ? accessKey.length : 0);

    if (!accessKey) {
        console.log("❌ UNSPLASH_ACCESS_KEY is missing from .env");
        return;
    }

    const response = await fetch(
        "https://api.unsplash.com/search/photos?query=hotel&per_page=5",
        {
            headers: {
                Authorization: `Client-ID ${accessKey}`,
                "Accept-Version": "v1"
            }
        }
    );

    console.log("Status:", response.status);

    const data = await response.json();

    console.log("Response:", JSON.stringify(data, null, 2));
}

testUnsplash();