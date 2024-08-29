import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { GeoApiProps, GeoApiResultProps, GoogleInputProps } from "@/types/type";
import InputField from "./InputField";
import { useDebounce } from "@/lib/utils";

const GoogleTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  label,
  placeholder,
  giveRecommendations = true,
  handlePress,
}: GoogleInputProps) => {
  const [search, setSearch] = useState(initialLocation || "");
  const debounceSearch = useDebounce(search, 500);
  const [locations, setLocations] = useState<GeoApiProps[]>([]);
  const [giveRecommendation, setGiveRecommendation] =
    useState(giveRecommendations);
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
    if (debounceSearch && giveRecommendation) fetchData();
  }, [debounceSearch, giveRecommendation]);
  return (
    <View>
      <InputField
        icon={icon}
        label={label}
        placeholder={placeholder}
        value={search}
        onChangeText={(text) => {
          setSearch(text);
          setGiveRecommendation(true);
        }}
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
                  setSearch(location.formatted);
                  setGiveRecommendation(false);
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
