import { Alert, Image, Text, View } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import React, { useState } from "react";
import CustomButton from "./CustomButton";
import { fetchAPI } from "@/lib/fetch";
import { PaymentProps } from "@/types/type";
import { useAuth } from "@clerk/clerk-expo";
import { useLocationStore } from "@/store";
import ReactNativeModal from "react-native-modal";
import { images } from "@/constants";

const Payment = ({
  fullName,
  email,
  amount,
  driverId,
  rideTime,
}: PaymentProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  console.log(amount);
  const {
    userAddress,
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationAddress,
    destinationLongitude,
  } = useLocationStore();

  const { userId } = useAuth();
  const [success, setSuccess] = useState(false);

  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Ryde Inc.",
      intentConfiguration: {
        mode: {
          amount: parseInt(amount) * 100,
          currencyCode: "usd",
        },
        confirmHandler: async (
          paymentMethod,
          shouldSavePaymentMethod,
          intentCreationCallback,
        ) => {
          const { paymentIntent, customer } = await fetchAPI(
            "/(api)/(stripe)/create",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: fullName || email.split("@")[0],
                email: email,
                amount: amount,
                paymentMethodId: paymentMethod.id,
              }),
            },
          );

          if (paymentIntent.client_secret) {
            const { result } = await fetchAPI("/(api)/(stripe)/pay", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                payment_method_id: paymentMethod.id,
                payment_intent_id: paymentIntent.id,
                customer_id: customer,
                client_secret: paymentIntent.client_secret,
              }),
            });

            if (result.client_secret) {
              await fetchAPI("/(api)/ride/create", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  origin_address: userAddress,
                  destination_address: destinationAddress,
                  origin_latitude: userLatitude,
                  origin_longitude: userLongitude,
                  destination_latitude: destinationLatitude,
                  destination_longitude: destinationLongitude,
                  ride_time: rideTime.toFixed(0),
                  fare_price: parseInt(amount) * 100,
                  payment_status: "paid",
                  driver_id: driverId,
                  user_id: userId,
                }),
              });

              intentCreationCallback({
                clientSecret: result.client_secret,
              });
            }
          }
        },
      },
      returnURL: "myapp://book-ride",
    });
  };
  const openPaymentSheet = async () => {
    await initializePaymentSheet();
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      setSuccess(true);
    }
  };
  return (
    <>
      <CustomButton title="Confirm Ride" onPress={openPaymentSheet} />
      <ReactNativeModal
        isVisible={success}
        onBackdropPress={() => setSuccess(false)}
      >
        <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
          <Image
            source={images.check}
            className="w-28 h-28 mx-auto mb-5"
            resizeMode="contain"
          />
          <Text className="text-xl font-JakartaBold text-center mb-4">
            Booking placed Successfully
          </Text>
          <Text className="text-md font-JakartaMedium text-center">
            Thank you for your booking! Your reservation has been successfully
            placed. Please proceed with your trip.
          </Text>
          <CustomButton
            title="Go track"
            className="mt-5"
            onPress={() => {
              setSuccess(false);
            }}
          />
        </View>
      </ReactNativeModal>
    </>
  );
};

export default Payment;
