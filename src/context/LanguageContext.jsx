import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    Dashboard: "Dashboard",
    WelcomeBack: "Welcome back 👋 Plan your next adventure.",
    SearchPlaceholder: "Search trips, hotels, destinations...",
    Favorites: "Favorites",
    Trips: "Trips",
    Destinations: "Destinations",
    Travelers: "Travelers",
    Profile: "Profile",
    Settings: "Settings",
    RecentTrips: "Recent Trips",
    Theme: "Theme",
    SwitchYourTravelUI: "Switch your travel UI mood",
    DarkMode: "Dark Mode",
    LightMode: "Light Mode",
    TripAlerts: "Trip Alerts",
    EmailAlerts: "Email Alerts",
    ReceiveOffers: "Receive Offers",
    Security: "Security",
    TwoFactorAuth: "Two Factor Authentication",
    TravelStyle: "Travel Style",
    HomeLocation: "Home Location",
    SetYourBaseCity: "Set your base city",
    UpdateLocation: "Update Location",
    CurrentCity: "Current City",
    Language: "Language",
    ChooseYourLanguage: "Choose your preferred language",
    SelectedLanguage: "Selected Language",
    ProfileUpdated: "Profile Updated",
  },
  te: {
    Dashboard: "డాష్‌బోర్డ్",
    WelcomeBack: "స్వాగతం 👋 మీ తదుపరి యాత్రను ప్లాన్ చేసుకోండి.",
    SearchPlaceholder: "ప్రయాణాలు, హోటల్స్, గమ్యస్థానాలు శోధించండి...",
    Favorites: "ఇష్టమైనవి",
    Trips: "ప్రయాణాలు",
    Destinations: "గమ్యస్థానాలు",
    Travelers: "ప్రయాణీకులు",
    Profile: "ప్రొఫైల్",
    Settings: "సెట్టింగ్స్",
    RecentTrips: "ఇటీవల జరిగిన ప్రయాణాలు",
    Theme: "థీమ్",
    SwitchYourTravelUI: "మీ UI మూడ్ మార్చండి",
    DarkMode: "డార్క్ మోడ్",
    LightMode: "లైట్ మోడ్",
    TripAlerts: "ట్రిప్ అలెర్ట్స్",
    EmailAlerts: "ఇమెయిల్ అలెర్ట్స్",
    ReceiveOffers: "ఆఫర్లు పొందండి",
    Security: "భద్రత",
    TwoFactorAuth: "రెండు-అంశాల ప్రమాణీకరణ",
    TravelStyle: "ప్రయాణ శైలి",
    HomeLocation: "హోమ్ స్థలం",
    SetYourBaseCity: "మీ బేస్ నగరాన్ని సెట్ చేయండి",
    UpdateLocation: "స్థానం నవీకరించండి",
    CurrentCity: "ప్రస్తుత నగరం",
    Language: "భాష",
    ChooseYourLanguage: "మీ ఇష్టమైన భాషను ఎంచుకోండి",
    SelectedLanguage: "ఎంచుకున్న భాష",
    ProfileUpdated: "ప్రొఫైల్ నవీకరించబడింది",
  },
  hi: {
    Dashboard: "डैशबोर्ड",
    WelcomeBack: "वापसी पर स्वागत है 👋 अपनी अगली यात्रा योजना बनाएं।",
    SearchPlaceholder: "यात्राएँ, होटल, गंतव्य खोजें...",
    Favorites: "पसंदीदा",
    Trips: "यात्राएँ",
    Destinations: "गंतव्य",
    Travelers: "यात्री",
    Profile: "प्रोफ़ाइल",
    Settings: "सेटिंग्स",
    RecentTrips: "हालिया यात्राएँ",
    Theme: "थीम",
    SwitchYourTravelUI: "अपना UI मूड बदलें",
    DarkMode: "डार्क मोड",
    LightMode: "लाइट मोड",
    TripAlerts: "ट्रिप अलर्ट",
    EmailAlerts: "ईमेल अलर्ट",
    ReceiveOffers: "ऑफ़र प्राप्त करें",
    Security: "सुरक्षा",
    TwoFactorAuth: "दो-कारक प्रमाणीकरण",
    TravelStyle: "यात्रा शैली",
    HomeLocation: "होम स्थान",
    SetYourBaseCity: "अपना बेस शहर सेट करें",
    UpdateLocation: "स्थान अपडेट करें",
    CurrentCity: "वर्तमान शहर",
    Language: "भाषा",
    ChooseYourLanguage: "अपनी पसंदीदा भाषा चुनें",
    SelectedLanguage: "चयनित भाषा",
    ProfileUpdated: "प्रोफ़ाइल अपडेट हो गई है",
  },
  ta: {
    Dashboard: "டாஷ்போர்ட்",
    WelcomeBack: "வந்து சேர்ந்ததற்கு வரவேற்பு 👋 உங்கள் அடுத்த பயணத்தை திட்டமிட்டு கொள்ளுங்கள்.",
    SearchPlaceholder: "பயணங்கள், ஹோட்டல்கள், இலக்குகளை தேடுக...",
    Favorites: "பிடித்தவை",
    Trips: "பயணங்கள்",
    Destinations: "இலக்குகள்",
    Travelers: "பயணிகள்",
    Profile: "சுயவிவரம்",
    Settings: "அமைப்புகள்",
    RecentTrips: "சமீபத்திய பயணங்கள்",
    Theme: "தீம்",
    SwitchYourTravelUI: "உங்கள் UI மனப்பான்மையை மாற்றவும்",
    DarkMode: "டார்க் மோட்",
    LightMode: "லைட் மோட்",
    TripAlerts: "பயண அறிவிப்புகள்",
    EmailAlerts: "மின்னஞ்சல் அறிவிப்புகள்",
    ReceiveOffers: "சலுகைகள் பெறுக",
    Security: "பாதுகாப்பு",
    TwoFactorAuth: "இரு-அம்ச அங்கீகாரம்",
    TravelStyle: "பயண பாணி",
    HomeLocation: "முகப்பு நகரம்",
    SetYourBaseCity: "உங்கள் அடிப்படை நகரத்தை அமைக்கவும்",
    UpdateLocation: "இருப்பிடம் புதுப்பிக்கவும்",
    CurrentCity: "தற்போதைய நகரம்",
    Language: "மொழி",
    ChooseYourLanguage: "உங்கள் விருப்ப மொழியை தேர்ந்தெடுக்கவும்",
    SelectedLanguage: "தேர்ந்தெடுக்கப்பட்ட மொழி",
    ProfileUpdated: "சுயவிவரம் புதுப்பிக்கப்பட்டது",
  },
  kn: {
    Dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    WelcomeBack: "ಮீಳೆಗೆ ಸ್ವಾಗತ 👋 ನಿಮ್ಮ ಮುಂದಿನ ಪ್ರವಾಸವನ್ನು ಯೋಜಿಸಿ.",
    SearchPlaceholder: "ಪ್ರಯಾಣಗಳು, ಹೋಟೆಲ್ಗಳು, ಗಮ್ಯಗಳನ್ನು ಹುಡುಕಿ...",
    Favorites: "ಇಚ್ಛಿತಗಳು",
    Trips: "ಪ್ರಯಾಣಗಳು",
    Destinations: "ಗಮ್ಯಸ್ಥಾನಗಳು",
    Travelers: "ಪ್ರವಾಸಿಗಳು",
    Profile: "ಪ್ರೊಫೈಲ್",
    Settings: "ಸೆಟ್ಟಿಂಗ್ಗಳು",
    RecentTrips: "ಇತ್ತೀಚಿನ ಪ್ರಯಾಣಗಳು",
    Theme: "ಥೀಮ್",
    SwitchYourTravelUI: "ನಿಮ್ಮ UI ಮನೋಭಾವವನ್ನು ಬದಲಿಸಿ",
    DarkMode: "ಡಾರ್ಕ್ ಮೋಡ್",
    LightMode: "ಲೈಟ್ ಮೋಡ್",
    TripAlerts: "ಪ್ರವಾಸ ಮಾಹಿತಿ",
    EmailAlerts: "ಇಮೇಲ್ ಅಲರ್ಟ್ಗಳು",
    ReceiveOffers: "ಆಫರ್‌ಗಳನ್ನು ಸ್ವೀಕರಿಸಿ",
    Security: "ಭದ್ರತೆ",
    TwoFactorAuth: "ಎರಡು-ಘಟಕದ ಪ್ರಮಾಣೀಕರಣ",
    TravelStyle: "ಪ್ರಯಾಣ ಶೈಲಿ",
    HomeLocation: "ಹೋಮ್ ಸ್ಥಳ",
    SetYourBaseCity: "ನಿಮ್ಮ ಮೂಲ ನಗರವನ್ನು ಹೊಂದಿಸಿ",
    UpdateLocation: "ಸ್ಥಳವನ್ನು ನವೀಕರಿಸಿ",
    CurrentCity: "ಪ್ರಸ್ತುತ ನಗರ",
    Language: "ಭಾಷೆ",
    ChooseYourLanguage: "ನಿಮ್ಮ ಇಷ್ಟ ಭಾಷೆಯನ್ನು ಆರಿಸಿ",
    SelectedLanguage: "ತேர್ದ ಭಾಷೆ",
    ProfileUpdated: "ಪ್ರೊಫೈಲ್ ನವೀಕರಿಸಲಾಗಿದೆ",
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("lang") || "en";
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const t = (key) => {
    const dict = translations[lang] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
