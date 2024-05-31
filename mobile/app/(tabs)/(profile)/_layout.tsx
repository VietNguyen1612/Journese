import { Stack, useRouter } from "expo-router";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { PlusIcon } from "react-native-heroicons/solid";

const ProfileLayout = () => {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen name="account-menu" options={{ headerShown: false }} />
      <Stack.Screen
        name="profile"
        options={{ title: "Trang cá nhân", headerTintColor: "black" }}
      />
      <Stack.Screen name="create-trip" options={{ headerShown: false }} />
      <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
      <Stack.Screen
        name="edit-post"
        options={{
          title: "Chỉnh sửa bài viết",
          headerBackTitleVisible: false,
          headerTintColor: "black",
        }}
      />

      <Stack.Screen
        name="trip-management"
        options={{ title: "Quản lý hành trình", headerTintColor: "black" }}
      />
      <Stack.Screen
        name="ads-management"
        options={{ title: "Quản lý quảng cáo", headerTintColor: "black" }}
      />
      <Stack.Screen
        name="trip-request-management"
        options={{ title: "Yêu cầu tham gia", headerTintColor: "black" }}
      />
      <Stack.Screen
        name="trip-request-received-list"
        options={{
          title: "Danh sách yêu cầu",
          headerTintColor: "black",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="add-friend"
        options={{
          title: "Lời mời kết bạn",
          headerTintColor: "black",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="friend-list"
        options={{
          title: "Danh sách bạn bè",
          headerRight: () => (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => {
                  router.push("/(tabs)/(profile)/add-friend");
                }}
                style={{
                  backgroundColor: "#3a3b3c1a",
                  marginHorizontal: 10,
                  borderRadius: 99,
                }}
              >
                <PlusIcon size={25} color={"black"} />
              </TouchableOpacity>
            </View>
          ),
          headerTintColor: "black",
        }}
      />
      <Stack.Screen
        name="notification"
        options={{ title: "Danh sách thông báo", headerTintColor: "black" }}
      />
    </Stack>
  );
};

export default ProfileLayout;
