import React, { useState } from "react";
import FaceAuth from "../components/FaceAuth";

const FaceTest = () => {

    const [showFaceAuth, setShowFaceAuth] = useState(false);
    const [faceDetected, setFaceDetected] = useState(false);

    const handleFaceDetected = (descriptor) => {

        console.log("Face descriptor:", descriptor);

        setFaceDetected(true);

        setShowFaceAuth(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">

            <div className="bg-white p-10 rounded-3xl shadow-xl text-center">

                <h1 className="text-3xl font-bold mb-4">
                    Face Authentication Test
                </h1>

                <p className="text-gray-600 mb-6">
                    Let's test your camera and face detection.
                </p>

                {!faceDetected && (
                    <button
                        onClick={() => setShowFaceAuth(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700"
                    >
                        👤 Test Face Authentication
                    </button>
                )}

                {faceDetected && (
                    <div className="mt-5">

                        <p className="text-green-600 text-xl font-semibold">
                            Face detected successfully! ✅
                        </p>

                        <p className="text-gray-500 mt-2">
                            Face descriptor generated.
                        </p>

                    </div>
                )}

            </div>

            {showFaceAuth && (

                <FaceAuth
                    onFaceDetected={handleFaceDetected}
                    onClose={() => setShowFaceAuth(false)}
                />

            )}

        </div>
    );
};

export default FaceTest;