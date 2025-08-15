import {
  MapContainer,
  TileLayer,
  Marker,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import useEventListener from "@use-it/event-listener";
import { useSnackbar } from "notistack";
import { totalBounds } from "../../data/bounds";
import MapContext from "./context";

// Override default Leaflet marker icons path
Icon.Default.imagePath =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/";

// Event listener to handle snapping to a cinema location
const MapSnappingEventListener = () => {
  const { enqueueSnackbar } = useSnackbar();
  const map = useMap();

  useEventListener("map.snapTo", ({ detail }) => {
    const { lat, lng } = detail || {};

    console.log("Executing `map.snapTo` event with Leaflet", detail);

    if (typeof lat === "number" && typeof lng === "number") {
      try {
        // Smoothly move to the selected cinema's coordinates
        map.flyTo([lat, lng], 14, { duration: 0.5, easeLinearity: 1 });
      } catch (e) {
        console.error(e);
        enqueueSnackbar("Unexpected error while attempting map navigation", {
          variant: "error"
        });
      }
    } else {
      console.warn("Invalid or missing coordinates for map snapping:", detail);
      enqueueSnackbar("Invalid location data for map snapping", { variant: "warning" });
    }
  });

  return null;
};

// Convert bounds for Leaflet
const convertBounds = ([w, s, e, n]) => [
  [s, w],
  [n, e]
];

// Simple Leaflet marker component
const LeafletMarker = ({ lat, lon }) => <Marker position={[lat, lon]} />;

const LeafletMap = ({ children }) => {
  console.log("Render Leaflet map");
  return (
    <>
      <MapContainer
        bounds={convertBounds(totalBounds)}
        style={{ height: "100%", backgroundColor: "#99b3cc" }}
        zoomSnap={0.5}
        zoomDelta={0.5}
      >
        <MapSnappingEventListener />
        <TileLayer
          attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, 
          <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; 
          Map data &copy; <a href="https://www.openstreetmap.org/copyright">
          OpenStreetMap</a> contributors'
          url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}"
          subdomains="abcd"
          minZoom={0}
          maxZoom={18}
          ext="png"
        />
        <MapContext.Provider value={{ Marker: LeafletMarker }}>
          {children}
        </MapContext.Provider>
      </MapContainer>
    </>
  );
};

export default LeafletMap;
