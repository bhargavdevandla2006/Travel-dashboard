import { useMap } from "../context/MapContext";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerSyle = {
    width:"100%",
    height:"500px",
}

export default function MapView() {
  const { location } = useMap();
 
  const center ={
    lat:location.lat,
    lng:location.lng,
  }

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold mb-4">
        Live Location: {location.name}
      </h2>

      <LoadScript googleMapsApiKey="AIzaSyC50_dwVpnUWv3Kk15Nh_MFvgNj0fEnuDM">
        <GoogleMap 
           mapContainerStyle={containerSyle}
            center={center}
            zoom={12}

        >
       <Marker position={center}/>
      
    </GoogleMap>

    </LoadScript>
    </div>
  );
}