import { useState } from "react";
import url from "../services/api";

export default function EditProfile({
    user,
    onClose,
    onUpdate
}) {

    const [name, setName] = useState(user.name);
    const [state, setState] = useState(user.state)
    const [city, setCity] = useState(user.city)
    const [country, setCountry] = useState(user.country)
    const [photo, setPhoto] = useState(user.photo)
    const [loadingLocation,  setLoadingLocation] = useState(false);


    async function uploadImage(e) {

    const image = e.target.files[0];

    if (!image) return;

    const formData = new FormData();

    formData.append("file", image);
    formData.append("upload_preset", "travel_dashboard");

    try {

        const response = await fetch(
            "https://api.cloudinary.com/v1_1/da8eeq1bi/image/upload",
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await response.json();

        setPhoto(data.secure_url);

    } catch (err) {

        console.log(err);

        alert("Image Upload Failed");

    }

}




    async function savePrf() {
        try {
            const response = await fetch(
                `${url}/profile`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        city,
                        state,
                        country,
                        photo,
                    }),
                }
            )
            const data = await response.json();
            alert(data.message);
            onUpdate();
            onClose();

        } catch (err) {
            console.log(err);
            alert("Something went wrong")
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

            <div className="bg-white rounded-3xl w-[500px] p-8">

                <h1 className="text-3xl font-bold mb-6">
                    Edit Profile
                </h1>

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border p-3 rounded-xl mb-4"
                />

                <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border p-3 rounded-xl mb-4"
                />

                <input
                    type="text"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full border p-3 rounded-xl mb-4"
                />

                <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full border p-3 rounded-xl mb-4"
                />

                <label className="block font-semibold mb-2">
                    Profile Photo
                </label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={uploadImage}
                    className="w-full border p-3 rounded-xl mb-4"
                />

                {
                    photo && (
                        <img
                            src={photo}
                            alt=""
                            className="w-32 h-32 rounded-full object-cover mx-auto mb-6"
                        />
                    )
                }

                <div className="flex justify-end gap-4">

                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-300 rounded-xl"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={savePrf}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl"
                    >
                        Save
                    </button>

                </div>



            </div>
        </div>
    )
}
