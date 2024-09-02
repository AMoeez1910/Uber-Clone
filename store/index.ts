import { DriverStore, LocationStore, MarkerData } from "@/types/type";
import { create } from "zustand";

export const useLocationStore = create<LocationStore>((set) => ({
  userAddress: null,
  userLongitude: null,
  userLatitude: null,
  destinationLongitude: null,
  destinationLatitude: null,
  destinationAddress: null,
  setUserLocation: ({
    longitude,
    latitude,
    address,
  }: {
    longitude: number | null;
    latitude: number | null;
    address: string | null;
  }) => {
    set(() => ({
      userLongitude: longitude,
      userLatitude: latitude,
      userAddress: address,
    }));
  },
  setDestinationLocation: ({
    longitude,
    latitude,
    address,
  }: {
    longitude: number | null;
    latitude: number | null;
    address: string | null;
  }) => {
    set(() => ({
      destinationLongitude: longitude,
      destinationLatitude: latitude,
      destinationAddress: address,
    }));
  },
}));

export const useDriverStore = create<DriverStore>((set) => ({
  drivers: [] as MarkerData[],
  selectedDriver: null,
  setSelectedDriver: (driverId: number) =>
    set(() => ({
      selectedDriver: driverId,
    })),
  setDrivers: (drivers: MarkerData[]) =>
    set(() => ({
      drivers: drivers,
    })),
  clearSelectedDriver: () =>
    set(() => ({
      selectedDriver: null,
    })),
}));
