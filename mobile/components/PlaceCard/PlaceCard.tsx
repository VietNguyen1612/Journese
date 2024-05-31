import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Image, Text, useTheme } from "@rneui/themed";
const { width, height } = Dimensions.get("screen");
const PlaceCard = (props: any) => {
  const { theme } = useTheme();
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: `/(tabs)/(explore)/place-detail`,
          params: { place_param: props.item.place_id },
        });
      }}
      style={{ height: height / 7, width: width / 3, gap: 7 }}
    >
      <Image
        style={{ width: "100%", height: "100%", borderRadius: 8 }}
        source={{ uri: props.item.images[0] }}
      />
      <Text
        numberOfLines={3}
        style={{
          color: theme.colors.grey1,
        }}
      >
        {props.item.name}
      </Text>
    </TouchableOpacity>
  );
};

export default PlaceCard;

const styles = StyleSheet.create({});
