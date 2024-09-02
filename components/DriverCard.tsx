import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { DriverCardProps } from "@/types/type";
import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";

const DriverCard = ({ item, selected, setSelected }: DriverCardProps) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setSelected(item.id);
      }}
      className={`flex flex-row items-center justify-between py-5 px-3 rounded-xl ${
        selected === item.id ? "bg-general-600" : "bg-white"
      }`}
    >
      <View className="flex flex-row justify-center items-center">
        <Image
          source={{ uri: item.profile_image_url }}
          className="h-12 w-12 rounded-full"
          resizeMode="cover"
        />
        <View className="flex flex-col justify-center ml-2">
          <View className="flex flex-row gap-x-1 items-center justify-center">
            <Text className="text-lg font-JakartaSemiBold">
              {item.first_name} {item.last_name}
            </Text>
            <Image
              source={icons.star}
              className="h-5 w-5"
              resizeMode="contain"
            />
            <Text className="text-md font-JakartaMedium text-secondary-500">
              {item.rating}
            </Text>
          </View>
          <View className="flex flex-row justify-between items-center w-28">
            <View className="flex flex-row justify-center items-center">
              <Image
                source={icons.dollar}
                className="h-5 w-5"
                resizeMode="contain"
              />
              <Text className="text-md font-black font-JakartaMedium ml-1">
                ${item.price}
              </Text>
              <Text className="text-sm font-JakartaRegular text-general-800 mx-1">
                |
              </Text>
            </View>
            <View className="flex flex-row justify-center items-center">
              <Text className="text-sm font-JakartaRegular text-general-800">
                {item.time ? formatTime(parseInt(`${item.time}`)) : "5"}
              </Text>
              <Text className="text-sm font-JakartaRegular text-general-800 mx-1">
                |
              </Text>
            </View>
            <View className="flex flex-row justify-center items-center">
              <Text className="text-sm font-JakartaRegular text-general-800">
                {item.car_seats} seats
              </Text>
            </View>
          </View>
        </View>
      </View>
      <Image
        source={{
          uri: item.car_image_url,
        }}
        className="h-12 w-12 rounded-lg"
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};

export default DriverCard;
