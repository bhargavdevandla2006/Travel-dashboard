import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export default function FaceAuth({ onFaceDetected, onClose }) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const intervalRef = useRef(null);

    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);

    const [faceStatus, setFaceStatus] = useState("loading");

    const [faceMessage, setFaceMessage] = useState(
        "Preparing face scanner..."
    );

    const [faceCount, setFaceCount] = useState(0);

    const [faceBox, setFaceBox] = useState(null);

    const [processing, setProcessing] = useState(false);

    useEffect(() => {

        const loadModels = async () => {

            try {

                const MODEL_URL = "/models";


                await Promise.all([

                    faceapi.nets.tinyFaceDetector.loadFromUri(
                        MODEL_URL
                    ),

                    faceapi.nets.faceLandmark68Net.loadFromUri(
                        MODEL_URL
                    ),

                    faceapi.nets.faceRecognitionNet.loadFromUri(
                        MODEL_URL
                    ),

                ]);


                setModelsLoaded(true);

                setFaceMessage(
                    "Starting camera..."
                );

            } catch (error) {

                console.error(
                    "Model loading error:",
                    error
                );

                setFaceStatus("error");

                setFaceMessage(
                    "Unable to load face authentication."
                );

            }

        };


        loadModels();

    }, []);

    useEffect(() => {

        if (!modelsLoaded) {
            return;
        }


        const startCamera = async () => {

            try {

                const stream =
                    await navigator.mediaDevices.getUserMedia({
                        video: {
                            facingMode: "user",

                            width: {
                                ideal: 640
                            },

                            height: {
                                ideal: 480
                            },
                        },

                        audio: false,
                    });


                streamRef.current = stream;


                if (videoRef.current) {

                    videoRef.current.srcObject =
                        stream;

                    await videoRef.current.play();

                }


                setCameraReady(true);

                setFaceStatus("waiting");

                setFaceMessage(
                    "Position your face inside the frame"
                );

            } catch (error) {

                console.error(
                    "Camera error:",
                    error
                );

                setFaceStatus("error");

                setFaceMessage(
                    "Camera permission is required."
                );

            }

        };


        startCamera();


        return () => {

            if (intervalRef.current) {

                clearInterval(
                    intervalRef.current
                );

            }


            if (streamRef.current) {

                streamRef.current
                    .getTracks()
                    .forEach((track) => {
                        track.stop();
                    });

            }

        };

    }, [modelsLoaded]);

    const checkFacePosition = async () => {

        if (
            !videoRef.current ||
            !cameraReady ||
            processing
        ) {
            return;
        }


        const video =
            videoRef.current;


        if (
            video.readyState <
            2
        ) {
            return;
        }


        try {

            const detections =
                await faceapi
                    .detectAllFaces(
                        video,
                        new faceapi.TinyFaceDetectorOptions({
                            inputSize: 320,
                            scoreThreshold: 0.5,
                        })
                    )
                    .withFaceLandmarks();


            setFaceCount(
                detections.length
            );

            if (detections.length === 0) {

                setFaceStatus("no-face");

                setFaceMessage(
                    "No face detected"
                );

                setFaceBox(null);

                return;

            }

            if (detections.length > 1) {

                setFaceStatus(
                    "multiple"
                );

                setFaceMessage(
                    "Only one person should be inside the frame"
                );

                setFaceBox(null);

                return;

            }

            const detection =
                detections[0];


            const box =
                detection.detection.box;


            setFaceBox(box);


            const videoWidth =
                video.videoWidth;

            const videoHeight =
                video.videoHeight;

            const faceWidth =
                box.width;

            const faceHeight =
                box.height;


            const faceCenterX =
                box.x +
                faceWidth / 2;

            const faceCenterY =
                box.y +
                faceHeight / 2;

            const centerX =
                videoWidth / 2;

            const centerY =
                videoHeight / 2;

            const allowedX =
                videoWidth * 0.18;

            const allowedY =
                videoHeight * 0.20;


            const isCentered =
                Math.abs(
                    faceCenterX - centerX
                ) < allowedX &&
                Math.abs(
                    faceCenterY - centerY
                ) < allowedY;

            const minimumFaceWidth =
                videoWidth * 0.25;

            const maximumFaceWidth =
                videoWidth * 0.75;


            const correctSize =
                faceWidth >=
                    minimumFaceWidth &&
                faceWidth <=
                    maximumFaceWidth;

            if (
                isCentered &&
                correctSize
            ) {

                setFaceStatus("ready");

                setFaceMessage(
                    "Perfect! You are ready"
                );

            } else {

                setFaceStatus(
                    "position"
                );

                setFaceMessage(
                    "Move your face inside the frame"
                );

            }

        } catch (error) {

            console.error(
                "Face detection error:",
                error
            );

        }

    };

    useEffect(() => {

        if (
            !cameraReady ||
            !modelsLoaded
        ) {
            return;
        }


        intervalRef.current =
            setInterval(
                checkFacePosition,
                300
            );


        return () => {

            if (intervalRef.current) {

                clearInterval(
                    intervalRef.current
                );

            }

        };

    }, [
        cameraReady,
        modelsLoaded,
        processing
    ]);

    const handleFaceAuthentication =
        async () => {

            if (
                faceStatus !== "ready" ||
                processing
            ) {

                return;

            }


            setProcessing(true);

            setFaceMessage(
                "Scanning your face..."
            );


            try {

                const detection =
                    await faceapi
                        .detectSingleFace(
                            videoRef.current,
                            new faceapi.TinyFaceDetectorOptions({
                                inputSize: 320,
                                scoreThreshold: 0.5,
                            })
                        )
                        .withFaceLandmarks()
                        .withFaceDescriptor();


                if (!detection) {

                    setProcessing(false);

                    setFaceStatus(
                        "no-face"
                    );

                    setFaceMessage(
                        "Face disappeared. Please try again."
                    );

                    return;

                }

                const descriptor =
                    Array.from(
                        detection.descriptor
                    );
                if (streamRef.current) {

                    streamRef.current
                        .getTracks()
                        .forEach((track) => {
                            track.stop();
                        });

                }


                setFaceMessage(
                    "Face authentication successful ✓"
                );
                setTimeout(() => {

                    if (onFaceDetected) {

                        onFaceDetected(
                            descriptor
                        );

                    }

                }, 500);


            } catch (error) {

                console.error(
                    "Face authentication error:",
                    error
                );

                setProcessing(false);

                setFaceStatus(
                    "error"
                );

                setFaceMessage(
                    "Face authentication failed. Try again."
                );

            }

        };

    const handleClose = () => {

        if (intervalRef.current) {

            clearInterval(
                intervalRef.current
            );

        }


        if (streamRef.current) {

            streamRef.current
                .getTracks()
                .forEach((track) => {
                    track.stop();
                });

        }


        if (onClose) {

            onClose();

        }

    };

    const isReady =
        faceStatus === "ready";


    const isError =
        faceStatus === "no-face" ||
        faceStatus === "multiple" ||
        faceStatus === "position" ||
        faceStatus === "error";

    const getFaceBoxStyle = () => {

        if (
            !faceBox ||
            !videoRef.current
        ) {
            return {};
        }


        const video =
            videoRef.current;


        const scaleX =
            video.clientWidth /
            video.videoWidth;


        const scaleY =
            video.clientHeight /
            video.videoHeight;


        return {

            left:
                faceBox.x *
                scaleX,

            top:
                faceBox.y *
                scaleY,

            width:
                faceBox.width *
                scaleX,

            height:
                faceBox.height *
                scaleY,

        };

    };


    return (

        <div
            className="
                fixed
                inset-0
                z-[9999]
                flex
                items-center
                justify-center
                bg-black/70
                backdrop-blur-md
                p-4
            "
        >

            

            <div
                className="
                    relative
                    w-full
                    max-w-[430px]
                    overflow-hidden
                    rounded-[30px]
                    bg-white
                    shadow-[0_25px_80px_rgba(0,0,0,0.35)]
                    animate-[fadeIn_.35s_ease-out]
                "
            >

                

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        px-6
                        pt-6
                    "
                >

                    <div>

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-blue-50
                                    text-xl
                                "
                            >
                                👤
                            </div>

                            <div>

                                <h2
                                    className="
                                        text-xl
                                        font-bold
                                        text-gray-900
                                    "
                                >
                                    Face Authentication
                                </h2>

                                <p
                                    className="
                                        text-xs
                                        text-gray-500
                                    "
                                >
                                    Secure • Fast • Simple
                                </p>

                            </div>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={handleClose}
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            bg-gray-100
                            text-gray-500
                            transition
                            hover:bg-gray-200
                            hover:text-gray-900
                        "
                    >
                        ✕
                    </button>

                </div>


                

                <div
                    className="
                        relative
                        mx-6
                        mt-5
                        overflow-hidden
                        rounded-[24px]
                        bg-gray-950
                        aspect-[4/3]
                    "
                >

                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="
                            absolute
                            inset-0
                            h-full
                            w-full
                            object-cover
                            scale-x-[-1]
                        "
                    />


                    

                    <div
                        className="
                            absolute
                            inset-0
                            bg-black/10
                            pointer-events-none
                        "
                    />


                    

                    <div
                        className={`
                            absolute
                            left-1/2
                            top-1/2
                            h-[72%]
                            w-[58%]
                            -translate-x-1/2
                            -translate-y-1/2
                            rounded-[32px]
                            border-[3px]
                            transition-all
                            duration-300

                            ${
                                isReady
                                    ? "border-green-400 shadow-[0_0_25px_rgba(74,222,128,0.8)]"
                                    : "border-red-400 shadow-[0_0_20px_rgba(248,113,113,0.45)]"
                            }
                        `}
                    >

                        

                        <span
                            className="
                                absolute
                                left-[-3px]
                                top-[-3px]
                                h-8
                                w-8
                                rounded-tl-[30px]
                                border-l-[5px]
                                border-t-[5px]
                                border-current
                            "
                        />

                        <span
                            className="
                                absolute
                                right-[-3px]
                                top-[-3px]
                                h-8
                                w-8
                                rounded-tr-[30px]
                                border-r-[5px]
                                border-t-[5px]
                                border-current
                            "
                        />

                        <span
                            className="
                                absolute
                                bottom-[-3px]
                                left-[-3px]
                                h-8
                                w-8
                                rounded-bl-[30px]
                                border-b-[5px]
                                border-l-[5px]
                                border-current
                            "
                        />

                        <span
                            className="
                                absolute
                                bottom-[-3px]
                                right-[-3px]
                                h-8
                                w-8
                                rounded-br-[30px]
                                border-b-[5px]
                                border-r-[5px]
                                border-current
                            "
                        />


                        

                        {isReady && !processing && (

                            <div
                                className="
                                    absolute
                                    left-3
                                    right-3
                                    top-1/2
                                    h-[2px]
                                    bg-green-400
                                    shadow-[0_0_12px_rgba(74,222,128,1)]
                                    animate-[scan_2s_linear_infinite]
                                "
                            />

                        )}

                    </div>


                    

                    {faceBox && (

                        <div
                            className={`
                                absolute
                                rounded-xl
                                border-2
                                transition-all
                                duration-200

                                ${
                                    isReady
                                        ? "border-green-300"
                                        : "border-yellow-300"
                                }
                            `}
                            style={
                                getFaceBoxStyle()
                            }
                        />

                    )}


                    

                    <div
                        className="
                            absolute
                            left-1/2
                            top-4
                            -translate-x-1/2
                        "
                    >

                        <div
                            className={`
                                flex
                                items-center
                                gap-2
                                rounded-full
                                px-4
                                py-2
                                text-xs
                                font-semibold
                                backdrop-blur-md

                                ${
                                    isReady
                                        ? "bg-green-500/90 text-white"
                                        : "bg-black/55 text-white"
                                }
                            `}
                        >

                            <span
                                className={`
                                    h-2
                                    w-2
                                    rounded-full

                                    ${
                                        isReady
                                            ? "bg-white animate-pulse"
                                            : "bg-red-400"
                                    }
                                `}
                            />

                            {isReady
                                ? "FACE READY"
                                : "SCANNING"}

                        </div>

                    </div>


                    

                    {faceCount > 0 && (

                        <div
                            className="
                                absolute
                                bottom-4
                                left-1/2
                                -translate-x-1/2
                                rounded-full
                                bg-black/60
                                px-4
                                py-2
                                text-xs
                                text-white
                                backdrop-blur-md
                            "
                        >

                            {faceCount === 1
                                ? "1 person detected"
                                : `${faceCount} people detected`}

                        </div>

                    )}

                </div>


                

                <div
                    className="
                        px-6
                        pt-5
                        text-center
                    "
                >

                    <div
                        className={`
                            mx-auto
                            flex
                            w-fit
                            items-center
                            gap-2
                            rounded-full
                            px-4
                            py-2
                            text-sm
                            font-medium

                            ${
                                isReady
                                    ? "bg-green-50 text-green-700"
                                    : "bg-red-50 text-red-600"
                            }
                        `}
                    >

                        <span>
                            {isReady ? "✓" : "●"}
                        </span>

                        {faceMessage}

                    </div>


                    

                    {!isReady && (

                        <p
                            className="
                                mt-3
                                text-xs
                                leading-5
                                text-gray-500
                            "
                        >
                            Keep only your face inside the frame
                            and look directly at the camera.
                        </p>

                    )}

                </div>


                

                <div
                    className="
                        px-6
                        pb-6
                        pt-5
                    "
                >

                    <button
                        type="button"
                        disabled={
                            !isReady ||
                            processing
                        }
                        onClick={
                            handleFaceAuthentication
                        }
                        className={`
                            relative
                            w-full
                            overflow-hidden
                            rounded-2xl
                            py-4
                            font-bold
                            transition-all
                            duration-300

                            ${
                                isReady &&
                                !processing

                                    ? "cursor-pointer bg-green-500 text-white shadow-lg shadow-green-200 hover:bg-green-600 hover:shadow-green-300 hover:-translate-y-0.5"

                                    : "cursor-not-allowed bg-gray-200 text-gray-400"
                            }
                        `}
                    >

                        {isReady &&
                            !processing && (

                                <span
                                    className="
                                        absolute
                                        inset-0
                                        -translate-x-full
                                        bg-white/20
                                        animate-[buttonShine_2.5s_infinite]
                                    "
                                />

                            )}


                        <span
                            className="
                                relative
                                flex
                                items-center
                                justify-center
                                gap-2
                            "
                        >

                            {processing
                                ? "Authenticating..."
                                : isReady
                                    ? "✓ Ready for Face Authentication"
                                    : "Position Your Face First"}

                        </span>

                    </button>


                    <p
                        className="
                            mt-3
                            text-center
                            text-[11px]
                            text-gray-400
                        "
                    >
                        Your face is processed securely
                        for authentication.
                    </p>

                </div>

            </div>


            

            <style>
                {`
                    @keyframes scan {
                        0% {
                            transform: translateY(-80px);
                            opacity: 0;
                        }

                        20% {
                            opacity: 1;
                        }

                        80% {
                            opacity: 1;
                        }

                        100% {
                            transform: translateY(80px);
                            opacity: 0;
                        }
                    }


                    @keyframes buttonShine {

                        0% {
                            transform: translateX(-100%);
                        }

                        50% {
                            transform: translateX(100%);
                        }

                        100% {
                            transform: translateX(100%);
                        }

                    }


                    @keyframes fadeIn {

                        from {
                            opacity: 0;
                            transform: scale(0.95);
                        }

                        to {
                            opacity: 1;
                            transform: scale(1);
                        }

                    }
                `}
            </style>

        </div>

    );

}