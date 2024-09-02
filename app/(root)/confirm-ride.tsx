import { FlatList, View } from "react-native";
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
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <DriverCard
            item={item}
            selected={selectedDriver!}
            setSelected={setSelectedDriver}
          />
        )}
        ListFooterComponent={() => (
          <View>
            <CustomButton
              title="Select Ride"
              isLoading={selectedDriver === null}
              onPress={() => {
                router.push("/(root)/book-ride");
              }}
            />
          </View>
        )}
      />
    </RideLayout>
  );
};

export default ConfirmRide;
