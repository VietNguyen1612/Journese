import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Dimensions, View } from "react-native";
import {
  MapIcon,
  UserCircleIcon,
  BellIcon,
  HomeIcon,
  StarIcon,
  ChatBubbleLeftIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from "react-native-heroicons/solid";

import { useTheme } from "@rneui/themed";

const { height, width } = Dimensions.get("window");

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { theme } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: height / 11,
          shadowRadius: 3,
          shadowColor: theme.colors.grey2,
          shadowOpacity: 0.4,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarIcon: ({ focused }) => (
            <SparklesIcon
              size={30}
              color={
                focused
                  ? theme.colors.brand.primary[500]
                  : theme.colors.brand.neutral[300]
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(explore)"
        options={{
          tabBarIcon: ({ focused }) => (
            <MagnifyingGlassIcon
              size={30}
              color={
                focused
                  ? theme.colors.brand.primary[500]
                  : theme.colors.brand.neutral[300]
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(map)"
        options={{
          tabBarIcon: ({ focused }) => (
            <MapIcon
              size={30}
              color={
                focused
                  ? theme.colors.brand.primary[500]
                  : theme.colors.brand.neutral[300]
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(chat)"
        options={{
          tabBarIcon: ({ focused }) => (
            <ChatBubbleLeftIcon
              size={30}
              color={
                focused
                  ? theme.colors.brand.primary[500]
                  : theme.colors.brand.neutral[300]
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          tabBarIcon: ({ focused }) => (
            <UserCircleIcon
              size={30}
              color={
                focused
                  ? theme.colors.brand.primary[500]
                  : theme.colors.brand.neutral[300]
              }
            />
          ),
        }}
      />
    </Tabs>
  );
}
