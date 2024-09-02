import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth, useClerk, useUser } from "@clerk/clerk-expo";
import RideCard from "@/components/RideCard";
import { icons, images } from "@/constants";
import { router } from "expo-router";
import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import * as Location from "expo-location";
import { useLocationStore } from "@/store";
import { useFetch } from "@/lib/fetch";
import { Ride } from "@/types/type";

const HomeScreen = () => {
  const { user } = useUser();
  const userID = useAuth();
  const { setUserLocation, setDestinationLocation, destinationAddress } =
    useLocationStore();
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
    router.push("/(root)/find-ride");
  };
  const {
    data: recentRides,
    loading: rideLoading,
    error,
    refetch,
  } = useFetch<Ride[]>(`/(api)/(ride)/${userID}`);
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
      console.error(error);
      Alert.alert("Error", "An error occurred while signing out");
    } finally {
      setLoading(false);
    }
  };
  if (rideLoading) {
    return (
      <View className="flex flex-1 justify-center items-center">
        <ActivityIndicator size={"small"} color={"#0286FF"} />
      </View>
    );
  }
  if (error) {
    return (
      <View className="flex flex-1 justify-center items-center">
        <Text className="text-lg font-JakartaBold text-red-500">
          Error: {error}
        </Text>
      </View>
    );
  }
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
            <View className="fle flex-col justify-center items-center ">
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
                <ActivityIndicator size={"small"} color={"#0286FF"} />
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
                initialLocation={destinationAddress!}
                placeholder="Where do you want to go?"
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
        refreshControl={
          <RefreshControl refreshing={rideLoading} onRefresh={refetch} />
        }
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
