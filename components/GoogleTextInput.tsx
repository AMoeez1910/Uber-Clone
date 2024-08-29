import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { GeoApiProps, GeoApiResultProps, GoogleInputProps } from "@/types/type";
import InputField from "./InputField";
import { useDebounce } from "@/lib/utils";
import { useLocationStore } from "@/store";

const GoogleTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => {
  const { destinationAddress } = useLocationStore();
  const [search, setSearch] = useState(destinationAddress || "");
  const debounceSearch = useDebounce(search, 500);
  const [locations, setLocations] = useState<GeoApiProps[]>([]);
  const [dropdown, setDropdown] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = fetch(
          // eslint-disable-next-line prettier/prettier
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${debounceSearch}&filter=pk&format=json&apiKey=${process.env.EXPO_PUBLIC_GEO_API}`,
        );
        const data: GeoApiResultProps = await (await response).json();
        setLocations(data.results as GeoApiProps[]);
        if (data.results.length > 0) {
          setDropdown(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (debounceSearch) fetchData();
  }, [debounceSearch]);
  return (
    <View>
      <InputField
        icon={icon}
        placeholder="Where do you want to go?"
        value={search}
        onChangeText={setSearch}
        clearText={() => {
          setSearch("");
          setLocations([]);
          setDropdown(false);
        }}
      />
      {dropdown &&
        (locations.length > 0 ? (
          <ScrollView className="w-full max-h-60 overflow-y-auto bg-white rounded-xl border border-secondary-500 z-100 relative top-0 shadow-md shadow-neutral-300 ">
            {locations.map((location, id) => (
              <TouchableOpacity
                key={id}
                className="p-3 border-b border-neutral-200"
                onPress={() => {
                  setDropdown(false);
                  handlePress({
                    latitude: location.lat,
                    longitude: location.lon,
                    address: location.formatted,
                  });
                }}
              >
                <Text className="text-md">{location.formatted}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View className="w-full max-h-60 overflow-y-auto bg-white rounded-xl border border-secondary-500 z-100 relative top-0 shadow-md shadow-neutral-300 ">
            <Text className="text-md p-3">No results found</Text>
          </View>
        ))}
    </View>
  );
};

export default GoogleTextInput;
