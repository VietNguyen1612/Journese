import { Stack, Tabs, useNavigation, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ExclamationCircleIcon } from "react-native-heroicons/outline";
import {
  ArrowLeftIcon,
  ChatBubbleLeftIcon,
  PencilIcon,
  UserPlusIcon,
  VideoCameraIcon,
} from "react-native-heroicons/solid";
import { IconChevronLeft } from "tabler-icons-react-native";
const ChatLayout = () => {
  const router = useRouter();
  const navigation = useNavigation();
  return (
    <Drawer screenOptions={{ headerStyle: { backgroundColor: "#FCFFFD" } }}>
      <Drawer.Screen
        name="chat"
        options={{
          drawerLabel: () => (
            <View style={{ flexDirection: "row", gap: 10 }}>
              <ChatBubbleLeftIcon size={20} color={"black"} />
              <Text>Chats</Text>
            </View>
          ),
          title: "Chats",
          headerRight: () => (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => {
                  router.push("/(tabs)/(chat)/create-chat-screen");
                }}
                style={{
                  backgroundColor: "#3a3b3c1a",
                  marginHorizontal: 10,
                  borderRadius: 99,
                  padding: 5,
                }}
              >
                <PencilIcon size={20} color={"black"} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="call"
        options={{
          drawerLabel: () => (
            <View style={{ flexDirection: "row", gap: 10 }}>
              <VideoCameraIcon size={20} color={"black"} />
              <Text>Calls</Text>
            </View>
          ),
          title: "Calls",
        }}
      />
      <Drawer.Screen
        name="message-room"
        options={{
          headerStyle: {
            backgroundColor: "rgba(60, 60, 60)",
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <IconChevronLeft size={34} color="black" />
            </TouchableOpacity>
          ),
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="create-chat-screen"
        options={{
          drawerItemStyle: { display: "none" },
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => router.back()}
            >
              <IconChevronLeft size={34} color="black" />
            </TouchableOpacity>
          ),
          headerTitle: "Tạo nhóm chat",
        }}
      />
      <Drawer.Screen
        name="room-detail"
        options={{
          headerRightContainerStyle: { paddingRight: 10 },
          drawerItemStyle: { display: "none" },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <IconChevronLeft size={34} color="black" />
            </TouchableOpacity>
          ),
          headerTitle: "Thông tin nhóm chat",
        }}
      />
    </Drawer>
  );
};

export default ChatLayout;
