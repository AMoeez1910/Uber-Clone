import { Image, Text, View } from "react-native";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { useDriverStore, useLocationStore } from "@/store";
import { StripeProvider } from "@stripe/stripe-react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
// eslint-disable-next-line import/namespace
import Payment from "@/components/Payment";
import { formatTime } from "@/lib/utils";

const BookRide = () => {
  const { userAddress, destinationAddress } = useLocationStore();
  const { drivers, selectedDriver } = useDriverStore();
  const { user } = useUser();
  const driverDetails = drivers?.filter(
    (driver) => driver.id === selectedDriver,
  )[0];
  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
      merchantIdentifier="merchant.ryde.com"
      urlScheme="myapp"
    >
      <RideLayout title="Book Ride">
        <>
          <Text className="text-xl font-JakartaSemiBold mb-3">
            Ride Information
          </Text>
          <View className="h-[1px] bg-general-700 w-full" />
          <View className="flex flex-col w-full items-center justify-center mt-3 ">
            <View className="flex mb-4 justify-center items-center">
              <Image
                source={{ uri: driverDetails?.profile_image_url }}
                className="w-20 h-20 rounded-full"
              />
              <View className="flex flex-row space-x-2 mt-4">
                <Text className="text-lg font-JakartaBold space-x-2">
                  {driverDetails?.first_name} {driverDetails?.last_name}
                </Text>
                <View className="flex flex-row justify-between items-center ">
                  <Image source={icons.star} className="w-5 h-5" />
                  <Text className="text-md font-JakartaMedium text-secondary-500">
                    {driverDetails?.rating}
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex justify-center items-center bg-general-600 py-3 px-5 rounded-2xl w-full mb-5">
              <View className="flex flex-row justify-between items-center border-b border-white w-full py-3">
                <Text className="text-lg font-Jakarta">Ride Price</Text>
                <Text className="text-lg font-JakartaBold text-general-400">
                  ${driverDetails?.price}
                </Text>
              </View>
              <View className="flex flex-row justify-between items-center border-b border-white w-full py-3">
                <Text className="text-lg font-Jakarta">PickUp Time</Text>
                <Text className="text-lg font-JakartaBold">
                  {driverDetails?.time
                    ? formatTime(parseInt(`${driverDetails?.time}`))
                    : "5"}
                </Text>
              </View>
              <View className="flex flex-row justify-between items-center w-full py-3">
                <Text className="text-lg font-Jakarta">Car Seats</Text>
                <Text className="text-lg font-JakartaBold">
                  {driverDetails?.car_seats}
                </Text>
              </View>
            </View>
            <View className="flex py-3 w-full">
              <View className="flex flex-row items-center mb-5 py-4 border-y border-general-700">
                <Image
                  source={icons.to}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
                <Text className="text-lg font-JakartaSemiBold ml-2">
                  {userAddress}
                </Text>
              </View>
              <View className="flex flex-row items-center mb-5 pb-4 border-b border-general-700">
                <Image
                  source={icons.point}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
                <Text className="text-lg font-JakartaSemiBold ml-2">
                  {destinationAddress}
                </Text>
              </View>
            </View>
            <Payment
              fullName={`${driverDetails?.first_name} ${driverDetails?.last_name}`}
              email={user?.emailAddresses[0].emailAddress!}
              amount={driverDetails?.price!}
              driverId={driverDetails?.id!}
              rideTime={driverDetails?.time!}
            />
          </View>
        </>
      </RideLayout>
    </StripeProvider>
  );
};

export default BookRide;
