import { Image, Text, TouchableOpacity, View } from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { onboarding } from "@/constants";
import Swiper from "react-native-swiper";
import CustomButton from "@/components/CustomButton";
const Welcome = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white">
      <TouchableOpacity
        className="w-full flex justify-end items-end p-5"
        onPress={() => {
          router.replace("/sign-in");
        }}
      >
        <Text className="text-md text-black font-JakartaBold">Skip</Text>
      </TouchableOpacity>
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={<View className="w-8 h-1 mx-1 bg-[#E2E8F0]" />}
        activeDot={<View className="w-8 h-1 mx-1 bg-primary-500" />}
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map((item, idx) => (
          <View key={idx} className="flex items-center justify-center p-5">
            <Image
              className="w-full h-80"
              source={item.image}
              resizeMode="contain"
            />
            <View className="flex flex-row justify-center items-center w-full mt-10">
              <Text className="text-black text-3xl font-bold text-center mx-10">
                {item.title}
              </Text>
            </View>
            <Text className="text-md text-center font-JakartaSemiBold text-secondary-400 mx-10 mt-3">
              {item.description}
            </Text>
          </View>
        ))}
      </Swiper>
      <CustomButton
        title={activeIndex === onboarding.length - 1 ? "Get Started" : "Next"}
        onPress={() => {
          if (activeIndex === onboarding.length - 1) {
            router.replace("/sign-in");
          } else {
            swiperRef.current?.scrollBy(1);
          }
        }}
        bgVariant="primary"
        className="w-11/12"
      />
    </SafeAreaView>
  );
};

export default Welcome;
