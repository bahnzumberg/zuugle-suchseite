import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet.markercluster";

type MarkerInput = {
  id: string | number;
  position: LatLngExpression;
  icon?: L.Icon | L.DivIcon;
  onClick?: () => void;
};

type ClusterProps = {
  markers: MarkerInput[];
  createClusterCustomIcon: (cluster: L.MarkerCluster) => L.DivIcon;
  options?: L.MarkerClusterGroupOptions;
};

export default function ClusterGroup({
  markers,
  createClusterCustomIcon,
  options,
}: ClusterProps) {
  const map = useMap();

  useEffect(() => {
    const clusterGroup = L.markerClusterGroup({
      iconCreateFunction: createClusterCustomIcon,
      ...options,
    });

    // First add cluster group to map
    map.addLayer(clusterGroup);

    // Create all markers
    const leafletMarkers = markers.map(({ position, icon, onClick }) => {
      const marker = L.marker(position, icon ? { icon } : undefined);
      if (onClick) {
        marker.on("click", onClick);
      }
      return marker;
    });

    // Add all markers at once
    if (leafletMarkers.length > 0) {
      clusterGroup.addLayers(leafletMarkers);
    }

    return () => {
      clusterGroup.clearLayers();
      map.removeLayer(clusterGroup);
    };
  }, [map, markers, createClusterCustomIcon, options]);

  return null;
}
