import { Stack } from "expo-router";

const HomeLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="create-post"
        options={{
          title: "Tạo bài viết",
          headerTintColor: "black",
          headerBackTitleVisible: false,
        }}
      />
    </Stack>
  );
};

export default HomeLayout;
