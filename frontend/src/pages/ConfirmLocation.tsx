import { useState, useEffect } from "react";
import { MapPin, Navigation } from "lucide-react";

interface Props {
  onConfirm: () => void;
}

export default function ConfirmLocation({ onConfirm }: Props) {

  const [currentLocation, setCurrentLocation] = useState("Detecting location...");
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [newLocation, setNewLocation] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setGpsCoords({ lat, lng: lon });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const data = await res.json();
          setCurrentLocation(data.display_name);
        } catch {
          setCurrentLocation("Unable to detect location");
        }
      },
      () => setCurrentLocation("Location permission denied")
    );
  }, []);

  const locationParts = currentLocation.split(",");
  const locationName = locationParts[0]?.trim() || "Detecting...";
  const locationSub = locationParts.slice(1, 3).join(",").trim();

  const confirmCurrent = () => {
    if (gpsCoords) {
      localStorage.setItem("active_location_coords", JSON.stringify(gpsCoords));
    }
    localStorage.setItem("active_location", currentLocation);
    onConfirm();
  };

  const confirmManual = () => {
    if (!newLocation.trim()) return;
    localStorage.removeItem("active_location_coords");
    localStorage.setItem("active_location", newLocation.trim());
    onConfirm();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>

      {/* Dark backdrop */}
      <div
        style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={onConfirm}
      />

      {/* Bottom sheet */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        borderRadius: "24px 24px 0 0",
        padding: "24px 20px 32px",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.15)"
      }}>

        <h2 style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: "20px" }}>
          Can you confirm if this is your location?
        </h2>

        {/* Current GPS location */}
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          padding: "12px",
          borderRadius: "12px",
          border: "2px solid #f472b6",
          backgroundColor: "#fff1f2",
          marginBottom: "12px",
          cursor: "pointer"
        }}
          onClick={confirmCurrent}
        >
          <div style={{
            width: "20px", height: "20px", borderRadius: "50%",
            border: "2px solid #f472b6", backgroundColor: "#f472b6",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, marginTop: "2px"
          }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "white" }} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{locationName}</div>
            {locationSub && (
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "2px" }}>{locationSub}</div>
            )}
          </div>
        </div>

        {/* Use my current location */}
        <div
          onClick={confirmCurrent}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            fontSize: "0.875rem", color: "#ec4899", fontWeight: 500,
            cursor: "pointer", marginBottom: "16px", marginLeft: "4px"
          }}
        >
          <Navigation size={14} />
          Use my current location
        </div>

        {/* Choose different */}
        <div
          onClick={() => setShowInput(!showInput)}
          style={{
            fontSize: "0.875rem", color: "#2563eb",
            cursor: "pointer", marginBottom: "12px", marginLeft: "4px"
          }}
        >
          + Choose a different location
        </div>

        {showInput && (
          <div style={{ marginBottom: "16px" }}>
            <input
              type="text"
              placeholder="Enter your location"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              style={{
                width: "100%", border: "1px solid #d1d5db",
                padding: "8px 12px", borderRadius: "8px",
                fontSize: "0.875rem", outline: "none", boxSizing: "border-box"
              }}
            />
            <button
              onClick={confirmManual}
              style={{
                marginTop: "8px", width: "100%", backgroundColor: "#ec4899", color: "white",
                padding: "10px", borderRadius: "8px", fontSize: "0.875rem",
                fontWeight: 500, border: "none", cursor: "pointer"
              }}
            >
              Use this location
            </button>
          </div>
        )}

        {/* Confirm button */}
        <button
          onClick={confirmCurrent}
          style={{
            width: "100%", backgroundColor: "#ec4899", color: "white",
            padding: "14px", borderRadius: "9999px", fontWeight: 600,
            fontSize: "0.95rem", border: "none", cursor: "pointer",
            marginTop: "8px"
          }}
        >
          Confirm location
        </button>

      </div>
    </div>
  );
}
