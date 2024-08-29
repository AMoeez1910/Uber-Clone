import { FlatList } from "react-native";
import React from "react";
import RideLayout from "@/components/RideLayout";
import CustomButton from "@/components/CustomButton";
import DriverCard from "@/components/DriverCard";
import { useDriverStore } from "@/store";
import { router } from "expo-router";

const ConfirmRide = () => {
  const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();
  return (
    <RideLayout title="Choose a Driver" snapPoints={["55%", "85%"]}>
      <FlatList
        data={drivers}
        keyExtractor={(item) => item.driver_id}
        renderItem={({ item }) => (
          <DriverCard
            item={item}
            selected={selectedDriver as string}
            setSelected={() => setSelectedDriver(item.driver_id)}
          />
        )}
        ListFooterComponent={() => (
          <CustomButton
            title="Select Ride"
            isLoading={selectedDriver === null}
            onPress={() => {
              router.push("/(root)/book-ride");
            }}
          />
        )}
      />
    </RideLayout>
  );
};

export default ConfirmRide;
