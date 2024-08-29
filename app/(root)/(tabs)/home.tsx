import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useClerk, useUser } from "@clerk/clerk-expo";
import RideCard from "@/components/RideCard";
import { icons, images } from "@/constants";
import { router } from "expo-router";
import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import * as Location from "expo-location";
import { useLocationStore } from "@/store";
const recentRides = [
  {
    ride_id: "1",
    origin_address: "Kathmandu, Nepal",
    destination_address: "Pokhara, Nepal",
    origin_latitude: "27.717245",
    origin_longitude: "85.323961",
    destination_latitude: "28.209583",
    destination_longitude: "83.985567",
    ride_time: 391,
    fare_price: "19500.00",
    payment_status: "paid",
    driver_id: 2,
    user_id: "1",
    created_at: "2024-08-12 05:19:20.620007",
    driver: {
      driver_id: "2",
      first_name: "David",
      last_name: "Brown",
      profile_image_url:
        "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
      car_image_url:
        "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
      car_seats: 5,
      rating: "4.60",
    },
  },
  {
    ride_id: "2",
    origin_address: "Jalkot, MH",
    destination_address: "Pune, Maharashtra, India",
    origin_latitude: "18.609116",
    origin_longitude: "77.165873",
    destination_latitude: "18.520430",
    destination_longitude: "73.856744",
    ride_time: 491,
    fare_price: "24500.00",
    payment_status: "paid",
    driver_id: 1,
    user_id: "1",
    created_at: "2024-08-12 06:12:17.683046",
    driver: {
      driver_id: "1",
      first_name: "James",
      last_name: "Wilson",
      profile_image_url:
        "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
      car_image_url:
        "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
      car_seats: 4,
      rating: "4.80",
    },
  },
  {
    ride_id: "3",
    origin_address: "Zagreb, Croatia",
    destination_address: "Rijeka, Croatia",
    origin_latitude: "45.815011",
    origin_longitude: "15.981919",
    destination_latitude: "45.327063",
    destination_longitude: "14.442176",
    ride_time: 124,
    fare_price: "6200.00",
    payment_status: "paid",
    driver_id: 1,
    user_id: "1",
    created_at: "2024-08-12 08:49:01.809053",
    driver: {
      driver_id: "1",
      first_name: "James",
      last_name: "Wilson",
      profile_image_url:
        "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
      car_image_url:
        "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
      car_seats: 4,
      rating: "4.80",
    },
  },
  {
    ride_id: "4",
    origin_address: "Okayama, Japan",
    destination_address: "Osaka, Japan",
    origin_latitude: "34.655531",
    origin_longitude: "133.919795",
    destination_latitude: "34.693725",
    destination_longitude: "135.502254",
    ride_time: 159,
    fare_price: "7900.00",
    payment_status: "paid",
    driver_id: 3,
    user_id: "1",
    created_at: "2024-08-12 18:43:54.297838",
    driver: {
      driver_id: "3",
      first_name: "Michael",
      last_name: "Johnson",
      profile_image_url:
        "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
      car_image_url:
        "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
      car_seats: 4,
      rating: "4.70",
    },
  },
];

const HomeScreen = () => {
  const { user } = useUser();
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const [loading, setLoading] = useState(false);
  const { signOut } = useClerk();
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);
  const handleDestinationPress = ({
    longitude,
    latitude,
    address,
  }: {
    longitude: number;
    latitude: number;
    address: string;
  }) => {
    setDestinationLocation({ longitude, latitude, address });
  };

  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermissions(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync();
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });
      setUserLocation({
        longitude: location.coords?.longitude!,
        latitude: location.coords?.latitude!,
        address: `${address[0].name}, ${address[0].region}`,
      });
    };
    requestLocation();
  }, []);

  const SignedOut = () => {
    try {
      setLoading(true);
      signOut();
      router.replace("/(auth)/sign-in");
      Alert.alert("Success", "Signed out successfully");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "An error occurred while signing out");
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
        data={recentRides}
        renderItem={({ item }) => <RideCard ride={item} />}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={() => {
          return (
            <View className="fle flex-col justify-center items-center h-full ">
              {!loading ? (
                <>
                  <Image
                    source={images.noResult}
                    className="h-40 w-40"
                    resizeMode="contain"
                  />
                  <Text className="text-sm">No recent rides found</Text>
                </>
              ) : (
                <ActivityIndicator size={"small"} color={"#000"} />
              )}
            </View>
          );
        }}
        ListHeaderComponent={() => {
          return (
            <>
              <View className="flex flex-row items-center justify-between mt-5">
                <Text className="text-lg font-JakartaSemiBold">
                  Welcome {user?.firstName?.split(" ")[0]}
                </Text>
                <TouchableOpacity onPress={SignedOut}>
                  <Image
                    source={icons.out}
                    className="h-5 w-5"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <GoogleTextInput
                icon={icons.search}
                handlePress={handleDestinationPress}
              />
              <>
                <View className="flex flex-row items-center bg-transparent h-[300px]">
                  <Map />
                </View>
              </>
              <Text className="text-xl font-JakartaBold mt-5 mb-3">
                Recent Rides
              </Text>
            </>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
