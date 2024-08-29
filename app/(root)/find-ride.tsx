import { Text, View } from "react-native";
import React from "react";
import RideLayout from "@/components/RideLayout";
import GoogleTextInput from "@/components/GoogleTextInput";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";

const FindRide = () => {
  const {
    destinationAddress,
    userAddress,
    setDestinationLocation,
    setUserLocation,
  } = useLocationStore();
  return (
    <RideLayout>
      <GoogleTextInput
        icon={icons.target}
        handlePress={({ latitude, longitude, address }) => {
          setUserLocation({ latitude, longitude, address });
        }}
        initialLocation={userAddress!}
        label="From"
        placeholder="Enter your location"
        giveRecommendations={false}
      />
      <GoogleTextInput
        icon={icons.map}
        handlePress={({ latitude, longitude, address }) => {
          setDestinationLocation({ latitude, longitude, address });
        }}
        initialLocation={destinationAddress!}
        placeholder="Enter your destination"
        label="To"
        giveRecommendations={false}
      />
      <CustomButton
        title="Find Ride"
        onPress={() => {
          router.push("/(root)/confirm-ride");
        }}
        className="mt-6"
      />
    </RideLayout>
  );
};

export default FindRide;
