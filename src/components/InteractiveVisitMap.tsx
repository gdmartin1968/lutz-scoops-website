import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { business } from "../config/business";

export function InteractiveVisitMap() {
  const mapElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapElement.current) return;

    const coordinates: L.LatLngExpression = [
      business.location.latitude,
      business.location.longitude,
    ];
    const map = L.map(mapElement.current, {
      center: coordinates,
      zoom: business.location.mapZoom,
      scrollWheelZoom: false,
      dragging: true,
      touchZoom: true,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const markerIcon = L.divIcon({
      className: "lutz-map-marker",
      html: '<span aria-hidden="true"></span>',
      iconSize: [42, 50],
      iconAnchor: [21, 50],
      popupAnchor: [0, -46],
    });
    const popup = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = business.name;
    const address = document.createElement("p");
    address.textContent = `${business.address.street}\n${business.address.cityStateZip}`;
    const directions = document.createElement("a");
    directions.href = business.directionsUrl;
    directions.target = "_blank";
    directions.rel = "noreferrer";
    directions.textContent = "Get Directions";
    popup.append(name, address, directions);

    L.marker(coordinates, { icon: markerIcon, title: business.name })
      .addTo(map)
      .bindPopup(popup)
      .openPopup();

    const resizeObserver = new ResizeObserver(() => map.invalidateSize());
    resizeObserver.observe(mapElement.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
    };
  }, []);

  return (
    <div
      ref={mapElement}
      className="h-[260px] w-full sm:h-[340px] lg:h-[390px]"
      role="region"
      aria-label={`Interactive map showing ${business.name}`}
    />
  );
}
