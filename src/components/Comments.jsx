import { useState, useEffect } from "react";
import apiUrl from "../services/api";

export default function Comments({ tripId }) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");


    useEffect(() => {

        loadComments();

    }, [tripId]);



    async function loadComments() {

        try {

            const response = await fetch(
                `${apiUrl}/comments/${tripId}`
            );

            const data = await response.json();

            setComments(data);


        } catch (err) {

            console.log(err);

        }

    }




    async function addComment() {


        if (!comment.trim()) {
            return;
        }


        try {


            const response = await fetch(
                `${apiUrl}/comments/${tripId}`,
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


            if (response.ok) {

                setComment("");

                loadComments();

            }


        } catch (err) {

            console.log(err);

        }


    }





    return (

        <div className="mt-4">


            <h2
                className="
font-bold
text-lg

text-gray-900
dark:text-white
"
            >
                Comments
            </h2>




            <div className="flex gap-2 mt-4">


                <input

                    type="text"

                    value={comment}

                    onChange={(e) => setComment(e.target.value)}

                    placeholder="Write a comment..."

                    className="
flex-1

border
border-gray-300
dark:border-gray-700

rounded-xl

px-3
py-2

outline-none

bg-white
dark:bg-gray-800

text-gray-900
dark:text-white

placeholder:text-gray-400

"

                />



                <button

                    onClick={addComment}

                    className="
bg-blue-600

text-white

px-5

rounded-xl

hover:bg-blue-700

transition

"

                >

                    Post

                </button>


            </div>






            {
                comments.map((item) => (


                    <div

                        key={item.id}

                        className="
flex
gap-3

mt-4

border-b
border-gray-200
dark:border-gray-700

pb-3
"

                    >


                        <img

                            src={item.photo}

                            alt=""

                            className="
w-10
h-10

rounded-full

object-cover

"

                        />



                        <div>


                            <h3
                                className="
font-bold

text-gray-900
dark:text-white
"
                            >

                                {item.name}

                            </h3>




                            <p
                                className="
text-gray-600
dark:text-gray-300
"
                            >

                                {item.comment}

                            </p>



                        </div>


                    </div>


                ))
            }



        </div>

    );

}