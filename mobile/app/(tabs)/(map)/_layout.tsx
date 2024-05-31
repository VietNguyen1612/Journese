import { Stack } from "expo-router";
import { MapSideFunctionBar } from "../../../components";

const MapLayout = () => {
  return (
    <Stack>
      {/* <Stack.Screen name="trip-home" options={{ headerShown: false }} /> */}
      <Stack.Screen name="on-going-trip-map" options={{ headerShown: false }} />
      <Stack.Screen name="map" options={{ headerShown: false }} />
      <Stack.Screen name="navigation" options={{ headerShown: false }} />
      <Stack.Screen name="search-place" options={{ headerShown: false }} />
      <Stack.Screen name="nearby-places" options={{ headerShown: false }} />
    </Stack>
  );
};

export default MapLayout;
