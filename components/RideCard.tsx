import { View, Text, Image } from "react-native";
import React from "react";
import { Ride } from "@/types/type";
import { icons } from "@/constants";
import { formatDate, formatTime } from "@/lib/utils";

const RideCard = ({
  ride: {
    origin_address,
    destination_address,
    origin_latitude,
    origin_longitude,
    destination_latitude,
    destination_longitude,
    ride_time,
    fare_price,
    payment_status,
    created_at,
    driver,
  },
}: {
  ride: Ride;
}) => {
  return (
    <View className="flex items-center justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 mb-3">
      <View className="flex flex-row items-center justify-between p-3">
        <Image
          source={{
            uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&center=lonlat:${destination_longitude},${destination_latitude}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEO_API}`,
          }}
          className="h-20 w-20 rounded-lg"
        />
        <View className="flex mx-5 gap-y-5 flex-1">
          <View className="flex flex-row items-center gap-x-2">
            <Image source={icons.to} className="h-5 w-5" />
            <Text className="text-md" numberOfLines={1}>
              {origin_address}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-x-2">
            <Image source={icons.target} className="h-5 w-5" />
            <Text className="text-md" numberOfLines={1}>
              {destination_address}
            </Text>
          </View>
        </View>
      </View>
      <View className="flex flex-row w-full justify-between items-center flex-1 p-3">
        <Text
          className="text-md font-JakartaMedium text-secondary-500"
          numberOfLines={1}
        >
          Date & Time
        </Text>
        <Text className="text-md font-JakartaSemiBold" numberOfLines={1}>
          {formatDate(new Date(created_at))} {formatTime(ride_time)}
        </Text>
      </View>
      <View className="flex flex-row w-full justify-between items-center flex-1 p-3">
        <Text
          className="text-md font-JakartaMedium text-secondary-500"
          numberOfLines={1}
        >
          Driver
        </Text>
        <Text className="text-md font-JakartaSemiBold" numberOfLines={1}>
          {driver.first_name} {driver.last_name}
        </Text>
      </View>

      <View className="flex flex-row w-full justify-between items-center flex-1 p-3">
        <Text
          className="text-md font-JakartaMedium text-secondary-500"
          numberOfLines={1}
        >
          Car Seats
        </Text>
        <Text className="text-md font-JakartaSemiBold" numberOfLines={1}>
          {driver.car_seats}
        </Text>
      </View>

      <View className="flex flex-row w-full justify-between items-center flex-1 p-3">
        <Text
          className="text-md font-JakartaMedium text-secondary-500"
          numberOfLines={1}
        >
          Payment Status
        </Text>
        <Text
          className={`text-md font-JakartaSemiBold ${payment_status === "paid" ? "text-general-400" : "text-red-700"}`}
          numberOfLines={1}
        >
          {payment_status}
        </Text>
      </View>
    </View>
  );
};

export default RideCard;
