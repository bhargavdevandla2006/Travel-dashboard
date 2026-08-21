import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaPaperPlane,
  FaUserCircle,
  FaCheck,
} from "react-icons/fa";

import apiUrl from "../services/api";

export default function Messages() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // =========================================================
  // LOAD USER
  // =========================================================

 useEffect(() => {
  const loadMessages = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/messages/${id}`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessages(data);
      }
    } catch (error) {
      console.error("LOAD MESSAGES ERROR:", error);
    }
  };

  loadMessages();
}, [id]);

  async function loadUser() {
    try {
      setLoading(true);

      const response = await fetch(`${apiUrl}/users/${id}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to load traveler");
      }

      const data = await response.json();

      setUser(data);
    } catch (error) {
      console.error("Message user error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }


  // =========================================================
  // SEND MESSAGE
  // =========================================================

  const handleSend = async () => {
  if (!input.trim()) return;

  try {
    const response = await fetch(
      `${apiUrl}/messages/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          message: input.trim(),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message);
      return;
    }

    setInput("");

    // Reload conversation after sending
    const messagesResponse = await fetch(
      `${apiUrl}/messages/${id}`,
      {
        credentials: "include",
      }
    );

    const messagesData = await messagesResponse.json();

    if (messagesResponse.ok) {
      setMessages(messagesData);
    }

  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);
  }
};

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin mx-auto" />

          <p className="mt-5 text-gray-400 font-medium">
            Loading conversation...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // USER NOT FOUND
  // =========================================================

  if (!user) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-5">😕</div>

          <h1 className="text-2xl font-black">
            Traveler not found
          </h1>

          <p className="text-gray-400 mt-3">
            We couldn't load this traveler's profile.
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              mt-6
              px-6
              py-3
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              font-bold
              transition
            "
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // USER PHOTO
  // =========================================================

  const photo =
    user.photo ||
    user.profile_photo ||
    "https://i.pravatar.cc/300";

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-[#020617] text-white">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header
        className="
          sticky
          top-0
          z-50
          border-b
          border-white/10
          bg-[#0f172a]/90
          backdrop-blur-2xl
        "
      >
        <div
          className="
            max-w-5xl
            mx-auto
            px-4
            lg:px-6
            h-20
            flex
            items-center
            gap-4
          "
        >

          {/* BACK */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              w-11
              h-11
              shrink-0
              rounded-xl
              bg-white/5
              border
              border-white/10
              flex
              items-center
              justify-center
              text-gray-300
              hover:bg-white/10
              hover:text-white
              transition
            "
            title="Go back"
          >
            <FaArrowLeft />
          </button>

          {/* USER */}

          <div className="flex items-center gap-3 min-w-0">

            <div className="relative shrink-0">

              <img
                src={photo}
                alt={user.name || "Traveler"}
                className="
                  w-12
                  h-12
                  rounded-full
                  object-cover
                  border-2
                  border-blue-500
                  shadow-lg
                "
              />

              <span
                className="
                  absolute
                  right-0
                  bottom-0
                  w-3.5
                  h-3.5
                  rounded-full
                  bg-emerald-500
                  border-2
                  border-[#0f172a]
                "
              />

            </div>

            <div className="min-w-0">

              <h1 className="font-bold text-lg truncate">
                {user.name}
              </h1>

              <p className="text-xs text-emerald-400">
                ● Online
              </p>

            </div>

          </div>

          {/* PROFILE BUTTON */}

          <div className="ml-auto">

            <button
              type="button"
              onClick={() =>
                navigate(`/traveler/${user.id}`)
              }
              className="
                hidden
                sm:block
                px-4
                py-2
                rounded-xl
                bg-white/5
                border
                border-white/10
                text-sm
                font-semibold
                hover:bg-white/10
                transition
              "
            >
              View Profile
            </button>

          </div>

        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="max-w-5xl mx-auto px-4 lg:px-6">

        <div className="min-h-[calc(100vh-80px)] flex flex-col">

          {/* =================================================
              CHAT AREA
          ================================================== */}

          <div className="flex-1 py-8">

            {messages.length === 0 ? (

              /* EMPTY CHAT */

              <div className="min-h-[500px] flex items-center justify-center">

                <div className="text-center max-w-md">

                  {/* PROFILE IMAGE */}

                  <div className="relative inline-block">

                    <div
                      className="
                        absolute
                        -inset-2
                        rounded-full
                        bg-gradient-to-r
                        from-blue-500
                        to-purple-600
                        blur-xl
                        opacity-30
                      "
                    />

                    <img
                      src={photo}
                      alt={user.name || "Traveler"}
                      className="
                        relative
                        w-24
                        h-24
                        rounded-full
                        object-cover
                        border-4
                        border-white/10
                        mx-auto
                      "
                    />

                    <div
                      className="
                        absolute
                        -bottom-1
                        -right-1
                        w-9
                        h-9
                        rounded-full
                        bg-gradient-to-r
                        from-blue-600
                        to-purple-600
                        flex
                        items-center
                        justify-center
                        shadow-xl
                      "
                    >
                      <FaPaperPlane className="text-sm" />
                    </div>

                  </div>

                  <h2 className="text-2xl font-black mt-7">
                    Start a conversation
                  </h2>

                  <p className="text-gray-400 mt-3 leading-7">
                    Send a message to{" "}
                    <span className="text-white font-semibold">
                      {user.name}
                    </span>{" "}
                    and start planning your next adventure.
                  </p>

                  <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <FaCheck className="text-emerald-500" />
                    Your conversation starts here
                  </div>

                </div>

              </div>

            ) : (

              /* MESSAGES */

              <div className="space-y-4">

                {messages.map((item) => (

                  <div
                    key={item.id}
                    className="flex justify-end"
                  >

                    <div
                      className="
                        max-w-[75%]
                        sm:max-w-[60%]
                        px-5
                        py-3
                        rounded-2xl
                        rounded-br-md
                        bg-gradient-to-r
                        from-blue-600
                        to-purple-600
                        shadow-lg
                      "
                    >

                      <p className="leading-6 break-words">
                        {item.text}
                      </p>

                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[10px] text-white/60">
                          Just now
                        </span>

                        <FaCheck className="text-[9px] text-white/60" />
                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* =================================================
              MESSAGE INPUT
          ================================================== */}

          <div className="sticky bottom-0 pb-5">

            <form
              onSubmit={handleSend}
              className="
                p-3
                rounded-2xl
                bg-[#0f172a]
                border
                border-white/10
                shadow-2xl
                flex
                items-center
                gap-3
                backdrop-blur-xl
              "
            >

              {/* USER ICON */}

              <div
                className="
                  hidden
                  sm:flex
                  w-11
                  h-11
                  shrink-0
                  rounded-xl
                  bg-white/5
                  items-center
                  justify-center
                  text-gray-400
                "
              >
                <FaUserCircle />
              </div>

              {/* INPUT */}

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Message ${user.name}...`}
                className="
                  flex-1
                  min-w-0
                  bg-transparent
                  outline-none
                  text-white
                  placeholder:text-gray-500
                  px-2
                  py-3
                "
              />

              {/* SEND */}

              <button
                type="submit"
                disabled={!message.trim() || sending}
                className="
                  w-12
                  h-12
                  shrink-0
                  rounded-xl
                  bg-gradient-to-r
                  from-blue-600
                  to-purple-600
                  flex
                  items-center
                  justify-center
                  shadow-lg
                  hover:scale-105
                  hover:shadow-blue-500/20
                  transition-all
                  disabled:opacity-40
                  disabled:hover:scale-100
                  disabled:cursor-not-allowed
                "
                title="Send message"
              >
                {sending ? (
                  <div
                    className="
                      w-5
                      h-5
                      rounded-full
                      border-2
                      border-white/30
                      border-t-white
                      animate-spin
                    "
                  />
                ) : (
                  <FaPaperPlane />
                )}
              </button>

            </form>

          </div>

        </div>

      </main>

    </div>
  );
}