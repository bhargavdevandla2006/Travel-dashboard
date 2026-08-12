import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaGlobe,
  FaLink,
} from "react-icons/fa";

export default function SocialLinks({ user }) {

  const socials = [
    {
      name: "Instagram",
      value: user?.instagram,
      icon: <FaInstagram />,
      className:
        "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600",
    },

    {
      name: "Facebook",
      value: user?.facebook,
      icon: <FaFacebook />,
      className: "bg-[#1877F2]",
    },

    {
      name: "Twitter / X",
      value:
        user?.twitter ||
        user?.twitter_url ||
        user?.x,
      icon: <FaTwitter />,
      className: "bg-black",
    },

    {
      name: "LinkedIn",
      value: user?.linkedin,
      icon: <FaLinkedin />,
      className: "bg-[#0A66C2]",
    },

    {
      name: "YouTube",
      value: user?.youtube,
      icon: <FaYoutube />,
      className: "bg-[#FF0000]",
    },

    {
      name: "TikTok",
      value: user?.tiktok,
      icon: <FaTiktok />,
      className: "bg-black",
    },

    {
      name: "Website",
      value:
        user?.website ||
        user?.website_url,
      icon: <FaGlobe />,
      className: "bg-indigo-600",
    },
  ];

  function openSocial(value) {

    if (!value) {
      return;
    }

    let url = value.trim();

  
    if (!url.startsWith("http://") &&
        !url.startsWith("https://")) {

      url = `https://${url}`;

    }

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  }

  const availableSocials =
    socials.filter((social) => social.value);

  if (availableSocials.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-3">

      {availableSocials.map((social) => (

        <button
          key={social.name}
          type="button"
          onClick={() =>
            openSocial(social.value)
          }
          title={`Open ${social.name}`}
          className={`
            ${social.className}
            w-11
            h-11
            rounded-full
            flex
            items-center
            justify-center
            text-white
            text-lg
            shadow-lg
            hover:scale-110
            hover:-translate-y-1
            transition-all
            duration-200
          `}
        >

          {social.icon}

        </button>

      ))}

      {availableSocials.length > 0 && (
        <span
          className="
            text-xs
            text-white/70
            ml-1
          "
        >
          {availableSocials.length} social
          {availableSocials.length > 1 ? "s" : ""}
        </span>
      )}

    </div>
  );
}