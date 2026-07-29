import { useState, useEffect } from "react";

export default function Comments({ tripId }) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    useEffect(() => {
        loadComments();
    }, [tripId]);

    async function loadComments() {

        try {

            const response = await fetch(
                `https://travel-dashboard-backend-2.onrender.com/comments/${tripId}`
            );

            const data = await response.json();

            setComments(data);

        } catch (err) {

            console.log(err);

        }

    }
    async function addComment() {

        console.log("Current comment:", comment);

        if (!comment.trim()) {
            console.log("Comment is empty");
            return;
        }

        try {

            const response = await fetch(
                `https://travel-dashboard-backend-2.onrender.com/comments/${tripId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        comment
                    })
                }
            );

            console.log("Status:", response.status);

            const data = await response.json();

            console.log("Response:", data);

            if (response.ok) {

                setComment("");

                loadComments();

            }

        } catch (err) {

            console.log("ERROR:", err);

        }

    }

    return (

        <div className="mt-4">

            <h2 className="font-bold text-lg">
                Comments
            </h2>

            <div className="flex gap-2 mt-4">

                <input
                    type="text"
                    value={comment}
                    onChange={(e) => {
                        console.log("Typing:", e.target.value);
                        setComment(e.target.value);
                    }}
                    placeholder="Write a comment..."
                    className="flex-1 border rounded-xl px-3 py-2"
                />

                <button
                    onClick={() => {
                        console.log("Current comment:", comment);
                        addComment();
                    }}
                    className="bg-blue-600 text-white px-5 rounded-xl"
                >
                    Post
                </button>

            </div>

            {
                comments.map((item) => (

                    <div
                        key={item.id}
                        className="flex gap-3 mt-4 border-b pb-3"
                    >

                        <img
                            src={item.photo}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                        />

                        <div>

                            <h3 className="font-bold">
                                {item.name}
                            </h3>

                            <p className="text-gray-600">
                                {item.comment}
                            </p>

                        </div>

                    </div>

                ))
            }

        </div>

    );

}