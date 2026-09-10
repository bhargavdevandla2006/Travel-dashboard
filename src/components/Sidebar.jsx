import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { createLocalNotification } from "../services/api";
import { setActiveBudget } from "../utils/budget";
import {
    FaBars,
    FaBell,
    FaCog,
    FaCreditCard,
    FaGlobe,
    FaHome,
    FaLanguage,
    FaMapMarkerAlt,
    FaPalette,
    FaPlane,
    FaShieldAlt,
    FaUserCircle,
    FaUsers,
    FaHeart,
    FaUser,
} from "react-icons/fa";

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);
    const [isPremium, setIsPremium] = useState(() => {
        if (typeof window === "undefined") return false;
        return localStorage.getItem("travelhub-premium") === "true";
    });

    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();

    const budgetMatch = location.pathname.match(/^\/budget\/(low|high|premium)$/);

    const searchParams = new URLSearchParams(location.search);
    const queryBudget = searchParams.get("budget");

    const activeBudget = budgetMatch?.[1] || queryBudget || localStorage.getItem("travelhub-budget");

    useEffect(() => {
        localStorage.setItem("travelhub-premium", String(isPremium));
    }, [isPremium]);

    useEffect(() => {
        if (budgetMatch?.[1]) {
            localStorage.setItem("travelhub-budget", budgetMatch[1]);
        }
    }, [activeBudget]);

    const handlePremiumToggle = () => {
        const nextPremium = !isPremium;
        setIsPremium(nextPremium);

        createLocalNotification({
            type: "premium",
            title: nextPremium ? "Premium activated" : "Premium deactivated",
            message: nextPremium
                ? "Your TravelHub premium plan is now active. Enjoy unlimited bookings and exclusive discounts."
                : "Your premium benefits were removed. Upgrade anytime to unlock more perks.",
        });
    };

    const menu = [
        { name: t("Favorites"), icon: <FaHeart />, path: "/favorites" },
        { name: t("Dashboard"), icon: <FaHome />, path: "/" },
        { name: t("Trips"), icon: <FaPlane />, path: "/trips" },
        { name: t("Destinations"), icon: <FaMapMarkerAlt />, path: "/destinations" },
        { name: t("Travelers"), icon: <FaUsers />, path: "/travelers" },
        { name: t("Profile"), icon: <FaUserCircle />, path: "/profile" },
        { name: t("Settings"), icon: <FaCog />, path: "/settings" },
    ];

    const budgetOptions = [
        { label: "Low", icon: "💰", path: "/budget/low" },
        { label: "High", icon: "⭐", path: "/budget/high" },
        { label: "Premium", icon: "👑", path: "/budget/premium" },
    ];

    const openSettingsSection = (section) => {
        setShowSettingsMenu(false);
        navigate("/settings", { state: { section } });
    };

    return (
        <div className={`${collapsed ? "w-20" : "w-[290px]"} min-h-screen bg-white dark:bg-[#0f172a] border-r border-gray-200 dark:border-gray-800 text-slate-900 dark:text-white flex flex-col justify-between transition-all duration-300 ease-in-out overflow-visible`}>
            <div>
                <div
                    className={`border-b border-gray-200 dark:border-gray-800 py-6 px-4 flex items-center ${collapsed ? "justify-center flex-col gap-4" : "justify-between"}`}
                >
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2))' }}>
                            <FaGlobe className="text-white text-xl" />
                        </div>

                        {!collapsed && (
                            <div>
                                <h1 className="text-xl font-bold tracking-wide">TravelHub</h1>
                                <p className="text-xs text-slate-400 dark:text-gray-400">{t("RecentTrips")}</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="
h-10 w-10 
rounded-xl 
flex 
items-center 
justify-center

hover:bg-gray-100
dark:hover:bg-gray-800

transition
">
                        <FaBars />
                    </button>
                </div>

                <div className="px-3 mt-7">
                    {menu.map((item) => {
                        if (item.path === "/settings") {
                            return (
                                <div key={item.name} className="relative overflow-visible">
                                    <button onClick={() => setShowSettingsMenu(!showSettingsMenu)} className={`w-full group flex items-center ${collapsed ? "justify-center" : "justify-start"} ${collapsed ? "" : "gap-4"} ${collapsed ? "px-0" : "px-4"} py-3.5 mb-2 rounded-2xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:translate-x-11`}>
                                        <span className="text-[20px]">{item.icon}</span>
                                        {!collapsed && <span className="font-medium tracking-wide">{item.name}</span>}
                                    </button>

                                    {showSettingsMenu && !collapsed && (
                                        <div className="absolute left-full top-0 ml-4 w-72 bg-white dark:bg-[#1e293b] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white z-[9999] overflow-hidden">
                                            <div className="px-5 py-4" style={{ background: 'linear-gradient(90deg, var(--accent-1), var(--accent-2))', color: '#fff' }}>
                                                <h2 className="text-lg font-bold">⚙️ {t("Settings")}</h2>
                                                <p className="text-sm text-blue-100">{t("ChooseYourLanguage")}</p>
                                            </div>

                                            <div className="py-2">
                                                <button onClick={() => openSettingsSection("profile")} className="w-full px-5 py-3 flex items-center gap-4 text-gray-800 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 transition duration-200">
                                                    <FaUser style={{ color: 'var(--accent-1)' }} />
                                                    {t("Profile")}
                                                </button>

                                                <button onClick={() => openSettingsSection("theme")} className="w-full px-5 py-3 flex items-center gap-4 text-gray-800 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 transition duration-200">
                                                    <FaPalette style={{ color: 'var(--accent-5)' }} />
                                                    {t("Theme")}
                                                </button>

                                                <button onClick={() => openSettingsSection("notifications")} className="w-full px-5 py-3 flex items-center gap-4 text-gray-800 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 transition duration-200">
                                                    <FaBell style={{ color: 'var(--accent-3)' }} />
                                                    {t("TripAlerts")}
                                                </button>

                                                <button onClick={() => openSettingsSection("security")} className="w-full px-5 py-3 flex items-center gap-4 text-gray-800 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 transition duration-200">
                                                    <FaShieldAlt style={{ color: 'var(--accent-4)' }} />
                                                    {t("Security")}
                                                </button>

                                                <button onClick={() => openSettingsSection("travelStyle")} className="w-full px-5 py-3 flex items-center gap-4 text-gray-800 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 transition duration-200">
                                                    <FaGlobe style={{ color: 'var(--accent-2)' }} />
                                                    {t("TravelStyle")}
                                                </button>

                                                <button onClick={() => openSettingsSection("location")} className="w-full px-5 py-3 flex items-center gap-4 text-gray-800 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 transition duration-200">
                                                    <FaMapMarkerAlt style={{ color: 'var(--accent-5)' }} />
                                                    {t("HomeLocation")}
                                                </button>

                                                <button className="w-full px-5 py-3 flex items-center gap-4 text-gray-800 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 transition duration-200">
                                                    <FaCreditCard style={{ color: 'var(--accent-2)' }} />
                                                    Payments
                                                </button>

                                                <button className="w-full px-5 py-3 flex items-center gap-4 text-gray-800 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 transition duration-200">
                                                    <FaLanguage style={{ color: 'var(--accent-5)' }} />
                                                    {t("Language")}
                                                </button>

                                                <button onClick={() => openSettingsSection("danger")} className="w-full px-5 py-3 flex items-center gap-4 text-gray-800 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 transition duration-200">
                                                    <FaMapMarkerAlt style={{ color: 'var(--accent-3)' }} />
                                                    Danger Zone
                                                </button>

                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <NavLink
                                key={item.name}
                                to={
                                    activeBudget && item.path !== "/"
                                        ? `${item.path}?budget=${activeBudget}`
                                        : item.path
                                }
                            >
                                {({ isActive }) => {
                                    const menuIsActive = isActive;
                                    const activeStyle = menuIsActive ? { background: 'linear-gradient(90deg, var(--accent-1), var(--accent-2))', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', color: '#fff' } : {};
                                    return (
                                        <div style={activeStyle} className={`relative group flex items-center ${collapsed ? "justify-center" : "justify-start"} ${collapsed ? "" : "gap-4"} ${collapsed ? "px-0" : "px-4"} py-3.5 mb-2 rounded-2xl transition-all duration-300 ${menuIsActive ? "text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800 hover:translate-x-1"}`}>
                                            {!collapsed && menuIsActive && <div style={{ background: 'linear-gradient(180deg, var(--accent-1), var(--accent-2))' }} className="absolute left-0 top-0 h-full w-1 rounded-r-2xl" />}

                                            <span className={`text-[20px] ${menuIsActive ? "text-white" : "text-slate-700 dark:text-gray-200"}`}>{item.icon}</span>

                                            {!collapsed && <span className={`font-medium tracking-wide ${menuIsActive ? "text-white" : "text-slate-700 dark:text-gray-200"}`}>{item.name}</span>}
                                        </div>
                                    );
                                }}
                            </NavLink>
                        );
                    })}
                </div>

                {!collapsed && (
                    <div className="px-5 mt-8">
                        <h2 className="text-xs uppercase tracking-[3px] text-slate-400 dark:text-slate-300 mb-4">Travel Budget</h2>

                        <div className="space-y-2">
                            {(activeBudget
                                ? budgetOptions.filter(
                                    (option) =>
                                        option.label.toLowerCase() === activeBudget
                                )
                                : budgetOptions
                            ).map((option) => (
                                <button
                                    key={option.label}
                                    type="button"
                                    onClick={() => {
                                        setActiveBudget(option.label.toLowerCase());
                                        navigate(option.path);
                                    }}
                                    className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-100/80 px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition duration-200 hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 dark:bg-[#111827] dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
                                >
                                    <span className="flex items-center gap-2">
                                        <span>{option.icon}</span>
                                        <span>{option.label}</span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {!collapsed && (
                <div className="m-5">
                    <div className="rounded-3xl p-6 relative overflow-hidden" style={{ background: isPremium ? 'linear-gradient(135deg, #1d4ed8, #0ea5e9)' : 'linear-gradient(135deg, var(--accent-1), var(--accent-2))' }}>
                        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}></div>
                        <div className="absolute -left-10 bottom-0 h-20 w-20 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}></div>

                        <div className="relative text-white">
                            <div className="flex items-center justify-between gap-2">
                                <h2 className="text-xl font-bold">Premium</h2>
                                {isPremium && (
                                    <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-100">
                                        Active
                                    </span>
                                )}
                            </div>

                            <p className="text-sm text-blue-100 mt-3 leading-6">
                                {isPremium ? "Unlock your full travel benefits" : "Unlimited Bookings"}
                                <br />
                                {isPremium ? "Priority support included" : "Hotel Discounts"}
                                <br />
                                {isPremium ? "No booking limits" : "Priority Support"}
                            </p>

                            <button
                                onClick={handlePremiumToggle}
                                className="mt-6 w-full rounded-2xl bg-white/10 text-white py-3 font-semibold hover:scale-105 transition disabled:opacity-70"
                            >
                                {isPremium ? "Premium Active →" : "Upgrade →"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
