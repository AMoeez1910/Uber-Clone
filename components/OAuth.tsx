import { View, Text, Image } from "react-native";
import React from "react";
import CustomButton from "./CustomButton";
import { icons } from "@/constants";

const OAuth = () => {
  return (
    <>
      <View className="flex flex-row mt-4 justify-center items-center gap-x-3 ">
        <View className="h-[0.5px] flex-1 bg-secondary-500 " />
        <Text className="text-black">Or</Text>
        <View className="h-[0.5px] flex-1 bg-secondary-500 " />
      </View>
      <CustomButton
        className="mt-4"
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            className="w-6 h-6 mr-2"
          />
        )}
        bgVariant="outline"
        textVariant="primary"
        title="Login with Google"
        onPress={() => console.log("Sign Up")}
      />
    </>
  );
};

export default OAuth;
