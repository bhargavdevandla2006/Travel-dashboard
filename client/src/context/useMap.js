import { useContext } from "react";
import MapContext from "./map-context-value";

export function useMap() {
  return useContext(MapContext);
}
