import L from "leaflet";
import { Bus, MapPin } from "lucide-react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import { fallbackLocation, routePositions } from "../utils/geo";

const busIcon = L.divIcon({
  html: `<div class="grid h-9 w-9 place-items-center rounded-full bg-amber-400 text-slate-950 shadow-lg ring-4 ring-white">🚌</div>`,
  className: "",
  iconSize: [36, 36],
  iconAnchor: [18, 18]
});

const stopIcon = L.divIcon({
  html: `<div class="grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-white shadow ring-2 ring-white">●</div>`,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

function Recenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, Math.max(map.getZoom(), 14), { duration: 0.8 });
  }, [center, map]);
  return null;
}

export function LiveMap({ stops = [], busLocation, height = "h-[420px]", compact = false }) {
  const center = busLocation
    ? [busLocation.latitude, busLocation.longitude]
    : fallbackLocation(stops);
  const positions = routePositions(stops);

  return (
    <div className={`${height} overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-800`}>
      <MapContainer center={center} zoom={14} scrollWheelZoom={!compact}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter center={center} />
        {positions.length > 1 && <Polyline positions={positions} pathOptions={{ color: "#0284c7", weight: 4 }} />}
        {stops.map((stop) => (
          <Marker key={stop._id || stop.id} position={[stop.latitude, stop.longitude]} icon={stopIcon}>
            <Popup>
              <div className="font-semibold">{stop.stopName}</div>
              <div>{stop.radius || 150}m radius</div>
            </Popup>
          </Marker>
        ))}
        {busLocation && (
          <Marker position={[busLocation.latitude, busLocation.longitude]} icon={busIcon}>
            <Popup>
              <div className="font-semibold">Live bus</div>
              <div>Speed: {Math.round(busLocation.speed || 0)} km/h</div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export function MapLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
      <span className="inline-flex items-center gap-2"><Bus size={16} className="text-amber-500" /> Live bus</span>
      <span className="inline-flex items-center gap-2"><MapPin size={16} className="text-emerald-500" /> Stop geofence</span>
    </div>
  );
}
