import { View } from "react-native";
import React, { FC } from "react";
import { Button, makeStyles, useTheme } from "@rneui/themed";
import { IconMap, IconMapPins } from "tabler-icons-react-native";
import { router, usePathname } from "expo-router";

interface MapSideFunctionBarProps {
  onNearbyPress: () => void;
}

export const MapSideFunctionBar: FC<MapSideFunctionBarProps> = ({
  onNearbyPress,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const name = usePathname();
  //console.log(name == '/on-going-trip-map')
  const handleOngoingPress = () => {
    router.push("/(tabs)/(map)/on-going-trip-map");
  };

  const handleArchivePress = () => {};
  return (
    <View style={styles.container}>
      {name ? (
        <>
          <Button
            // color={name == '/on-going-trip-map' ? 'green' : 'white'}
            type="outline"
            buttonStyle={{
              backgroundColor:
                name == "/on-going-trip-map" ? "#E6F7E8" : "white",
              borderColor:
                name == "/on-going-trip-map"
                  ? theme.colors.brand.primary[700]
                  : "black",
            }}
            icon={
              <IconMap
                color={name == "/on-going-trip-map" ? "green" : "black"}
                size={30}
              />
            }
            onPress={handleOngoingPress}
          />
          <Button
            buttonStyle={{
              backgroundColor: name == "/nearby-places" ? "#E6F7E8" : "white",
              borderColor:
                name == "/nearby-places"
                  ? theme.colors.brand.primary[700]
                  : "black",
            }}
            icon={
              <IconMapPins
                color={name == "/nearby-places" ? "green" : "black"}
                size={30}
              />
            }
            onPress={onNearbyPress}
            type="outline"
          />
          {/* <Button
            buttonStyle={{
              backgroundColor: name == "" ? "#E6F7E8" : "white",
              borderColor:
                name == "" ? theme.colors.brand.primary[700] : "black",
            }}
            icon={
              <IconArchive color={name == "" ? "green" : "black"} size={30} />
            }
            type="outline"
            onPress={handleArchivePress}
          /> */}
        </>
      ) : (
        <></>
      )}
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    position: "absolute",
    top: "40%",
    right: 11,
    gap: 10,
  },
}));
