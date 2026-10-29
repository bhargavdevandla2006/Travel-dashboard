const { searchUnsplashPhotos } = require("./unsplash");

/* =========================================================
   GET UNIQUE HOTEL PHOTOS
========================================================= */

async function getUniqueHotelPhotos(city, count) {

    const photos = [];

    /* 
       IMPORTANT:
       This Set belongs to THIS request only.

       So if React loads the page twice,
       the second request can still get photos.
    */
    const usedPhotoIds = new Set();

    /* =====================================================
       DIFFERENT SEARCHES
       
       We use multiple searches so that if
       "hotel Oslo" gives only a few photos,
       we can collect more from other hotel-related
       searches.
    ===================================================== */

    const queries = [
        `hotel ${city}`,
        `hotels ${city}`,
        `luxury hotel ${city}`,
        `hotel room ${city}`,
        `hotel building ${city}`,
        `resort ${city}`,
        `hotel`,
        `luxury hotel`,
    ];

    /* =====================================================
       SEARCH EACH QUERY
    ===================================================== */

    for (
        let queryIndex = 0;
        queryIndex < queries.length &&
        photos.length < count;
        queryIndex++
    ) {

        const query = queries[queryIndex];

        console.log(
            `📸 Unsplash search ${queryIndex + 1}:`,
            query
        );

        /* =================================================
           TRY MULTIPLE PAGES
        ================================================= */

        for (
            let page = 1;
            page <= 3 &&
            photos.length < count;
            page++
        ) {

            const results =
                await searchUnsplashPhotos(
                    query,
                    page
                );

            console.log(
                `📸 Results for "${query}" page ${page}:`,
                results.length
            );

            /* =============================================
               ADD UNIQUE PHOTOS
            ============================================= */

            for (
                let i = 0;
                i < results.length &&
                photos.length < count;
                i++
            ) {

                const photo = results[i];

                if (!photo || !photo.id) {
                    continue;
                }

                /* -----------------------------------------
                   Skip duplicate photo
                ----------------------------------------- */

                if (
                    usedPhotoIds.has(
                        photo.id
                    )
                ) {
                    continue;
                }

                /* -----------------------------------------
                   Mark photo as used
                ----------------------------------------- */

                usedPhotoIds.add(
                    photo.id
                );

                /* -----------------------------------------
                   Add photo
                ----------------------------------------- */

                photos.push({
                    id:
                        photo.id,

                    url:
                        photo.urls?.regular ||
                        photo.urls?.small ||
                        null,

                    photographerName:
                        photo.user?.name ||
                        "Unsplash photographer",

                    photographerUsername:
                        photo.user?.username ||
                        "",

                    photographerUrl:
                        photo.user?.links?.html ||
                        "https://unsplash.com",

                    unsplashUrl:
                        photo.links?.html ||
                        "https://unsplash.com",
                });

                console.log(
                    `✅ Added hotel photo ${photos.length}/${count}:`,
                    photo.id
                );
            }
        }
    }

    /* =====================================================
       FINAL RESULT
    ===================================================== */

    console.log(
        `🏨 FINAL UNIQUE HOTEL PHOTOS: ${photos.length}/${count}`
    );

    return photos;
}


/* =========================================================
   EXPORT
========================================================= */

module.exports = {
    getUniqueHotelPhotos,
};