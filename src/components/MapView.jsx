import { useMap } from "../context/MapContext";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "360px",
}

export default function MapView() {
  const { location } = useMap();
 
  const center ={
    lat:location.lat,
    lng:location.lng,
  }

  return (
    <div className="mt-0">
      <LoadScript googleMapsApiKey="AIzaSyC50_dwVpnUWv3Kk15Nh_MFvgNj0fEnuDM">
        <GoogleMap 
           mapContainerStyle={containerStyle}
            center={center}
            zoom={12}

        >
       <Marker position={center}/>
      
    </GoogleMap>

    </LoadScript>
    </div>
  );
}