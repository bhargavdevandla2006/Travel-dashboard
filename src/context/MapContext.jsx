import { createContext, useContext, useState } from "react";

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [location, setLocation] = useState({
    name: "Maldives",
    lat: 3.2028,
    lng: 73.2207,
  });

  return (
    <MapContext.Provider value={{ location, setLocation }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => useContext(MapContext);