export default function SocialButton({
  platform,
  value,
  label,
  icon,
  className = "",
  onOpen,
}) {
  const hasAccount = Boolean(value && String(value).trim());

  return (
    <button
      type="button"
      onClick={() => onOpen(platform, value)}
      className={`
        group
        inline-flex
        items-center
        gap-2
        px-4
        py-2
        rounded-xl
        text-white
        text-sm
        font-semibold
        shadow-lg
        transition-all
        duration-200
        hover:-translate-y-1
        hover:shadow-xl
        ${className}
      `}
    >
      <span className="text-base">
        {icon}
      </span>

      <span>
        {hasAccount ? label : `Add ${label}`}
      </span>
    </button>
  );
}