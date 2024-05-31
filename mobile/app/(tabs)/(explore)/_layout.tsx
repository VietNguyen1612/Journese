import { Stack } from "expo-router";

const ExploreLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="explore" options={{ headerShown: false }} />
      <Stack.Screen
        name="place-detail"
        options={{
          title: "Thông tin địa điểm",
          headerTintColor: "black",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="province-places"
        options={{ title: "Danh sách địa điểm", headerTintColor: "black" }}
      />
      <Stack.Screen
        name="rating"
        options={{
          title: "Đánh giá",
          headerTintColor: "black",
          headerBackTitleVisible: false,
        }}
      />
    </Stack>
  );
};

export default ExploreLayout;
