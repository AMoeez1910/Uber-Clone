import React, { useEffect, useState } from "react";
import MapView, {
  LatLng,
  Marker,
  PROVIDER_DEFAULT,
  Polyline,
} from "react-native-maps";
import { useDriverStore, useLocationStore } from "@/store";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import { Driver, MarkerData } from "@/types/type";
import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { ActivityIndicator, Text, View } from "react-native";

const Map = () => {
  const {
    userLongitude,
    userLatitude,
    destinationLongitude,
    destinationLatitude,
  } = useLocationStore();
  const { selectedDriver, setDrivers } = useDriverStore();
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const region = calculateRegion({
    userLongitude,
    userLatitude,
    destinationLongitude,
    destinationLatitude,
  });
  const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");
  useEffect(() => {
    const fetchRoute = async () => {
      if (
        userLatitude &&
        userLongitude &&
        destinationLatitude &&
        destinationLongitude
      ) {
        const apiCall = `https://api.geoapify.com/v1/routing?waypoints=${userLatitude},${userLongitude}|${destinationLatitude},${destinationLongitude}&mode=drive&apiKey=${process.env.EXPO_PUBLIC_GEO_API}`;
        const response = await fetch(apiCall);
        const routeData = await response.json();
        const coordinates = routeData.features[0].geometry.coordinates[0].map(
          (coord: number[]) => ({
            latitude: coord[1],
            longitude: coord[0],
          }),
        );
        setRouteCoords(coordinates);
      }
    };

    fetchRoute();
  }, [userLatitude, userLongitude, destinationLatitude, destinationLongitude]);

  useEffect(() => {
    if (Array.isArray(drivers)) {
      if (!userLongitude || !userLatitude) return;
      // pinpoints driver geolocation with an offset
      const driverMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });
      setMarkers(driverMarkers);
    }
  }, [drivers, userLatitude, userLongitude]);

  useEffect(() => {
    if (
      markers.length > 0 &&
      destinationLatitude !== undefined &&
      destinationLongitude !== undefined
    ) {
      calculateDriverTimes({
        markers,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      }).then((drivers) => {
        setDrivers(drivers as MarkerData[]);
      });
    }
  }, [markers, destinationLatitude, destinationLongitude]);

  if (loading || (!userLatitude && !userLongitude)) {
    return (
      <View className="flex justify-between items-center w-full">
        <ActivityIndicator size="small" color="#0286FF" />
      </View>
    );
  }
  if (error) {
    return (
      <View className="flex justify-between items-center w-full">
        <Text className="text-lg font-JakartaBold text-red-500">
          Error: {error}
        </Text>
      </View>
    );
  }
  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      className="w-full h-full"
      tintColor="black"
      mapType="mutedStandard"
      zoomTapEnabled={true}
      showsPointsOfInterest={false}
      initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude!,
            longitude: marker.longitude!,
          }}
          title={marker.title}
          image={
            selectedDriver === marker.id ? icons.selectedMarker : icons.marker
          }
        />
      ))}
      {destinationLongitude && destinationLatitude && (
        <Marker
          coordinate={{
            latitude: destinationLatitude,
            longitude: destinationLongitude,
          }}
          title="Destination"
          image={icons.pin}
        />
      )}
      {routeCoords.length > 0 && (
        <Polyline
          coordinates={routeCoords}
          strokeWidth={2}
          strokeColor="#0CC25F"
        />
      )}
    </MapView>
  );
};

export default Map;
