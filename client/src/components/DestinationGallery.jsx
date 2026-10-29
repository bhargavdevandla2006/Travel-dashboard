import { useEffect, useState } from "react";

export default function DestinationGallery({ place }) {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function fetchPhotos() {
      try {
        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(place)}&per_page=6`,
          {
            headers: {
              Authorization: import.meta.env.VITE_PEXELS_API_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Photo search failed: ${response.status}`);
        }

        const data = await response.json();
        if (!cancelled) {
          setPhotos(Array.isArray(data.photos) ? data.photos : []);
        }
      } catch (error) {
        console.error("Failed to load destination photos:", error);
        if (!cancelled) {
          setPhotos([]);
        }
      }
    }

    fetchPhotos();

    return () => {
      cancelled = true;
    };
  }, [place]);

  return (
    <div className="mt-12">
      <h1 className="mb-6 text-3xl font-bold">Destination Gallery</h1>
      <div className="grid grid-cols-3 gap-4">
        {photos.map((photo) => (
          <img
            key={photo.id}
            src={photo.src.large}
            alt={place}
            className="h-60 w-full rounded-3xl object-cover"
          />
        ))}
      </div>
    </div>
  );
}
