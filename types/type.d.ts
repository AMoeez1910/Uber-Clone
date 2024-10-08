import { TextInputProps, TouchableOpacityProps } from "react-native";

declare interface Driver {
  id: number;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  car_image_url: string;
  car_seats: number;
  rating: string;
}
declare interface MarkerData {
  latitude?: number;
  longitude?: number;
  id: number;
  title?: string;
  profile_image_url: string;
  car_image_url: string;
  car_seats: number;
  rating: string;
  first_name: string;
  last_name: string;
  time?: number;
  price?: string;
}

declare interface MapProps {
  destinationLatitude?: number;
  destinationLongitude?: number;
  onDriverTimesCalculated?: (driversWithTimes: MarkerData[]) => void;
  selectedDriver?: number | null;
  onMapReady?: () => void;
}

declare interface Ride {
  origin_address: string;
  destination_address: string;
  origin_latitude: string;
  origin_longitude: string;
  destination_latitude: string;
  destination_longitude: string;
  ride_time: number;
  fare_price: string;
  payment_status: string;
  id: number;
  user_email?: string;
  created_at: string;
  driver: {
    first_name: string;
    last_name: string;
    car_seats: number;
  };
}

declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
  isLoading?: boolean;
}

declare interface GoogleInputProps {
  icon?: string;
  initialLocation?: string;
  containerStyle?: string;
  label?: string;
  giveRecommendations?: boolean;
  placeholder?: string;
  textInputBackgroundColor?: string;
  handlePress: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

declare interface InputFieldProps extends TextInputProps {
  label?: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
  clearText?: () => void;
}

declare interface PaymentProps {
  fullName: string;
  email: string;
  amount: string;
  driverId: number;
  rideTime: number;
}

declare interface LocationStore {
  userLatitude: number | null;
  userLongitude: number | null;
  userAddress: string | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  destinationAddress: string | null;
  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number | null;
    longitude: number | null;
    address: string | null;
  }) => void;
  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number | null;
    longitude: number | null;
    address: string | null;
  }) => void;
}

declare interface DriverStore {
  drivers: MarkerData[];
  selectedDriver: number | null;
  setSelectedDriver: (driverId: number) => void;
  setDrivers: (drivers: MarkerData[]) => void;
  clearSelectedDriver: () => void;
}

declare interface DriverCardProps {
  item: MarkerData;
  selected: number | undefined;
  setSelected: (driverId: number) => void;
}
declare interface GeoApiResultProps {
  query: {
    text: string;
  };
  results: GeoApiProps[];
}
declare interface GeoApiProps {
  address_line1: string;
  address_line2: string;
  city: string;
  country: string;
  country_code: string;
  county: string;
  district: string;
  formatted: string;
  lat: number;
  lon: number;
  name: string;
  postcode: string;
  state: string;
  state_code: string;
  suburb: string;
}
