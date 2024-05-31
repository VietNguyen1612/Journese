import FontAwesome from "@expo/vector-icons/FontAwesome";

import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@rneui/themed";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { theme } from "../styles/theme";
import { LogBox, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { IconDotsVertical } from "tabler-icons-react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useExpoNotificationStore } from "../store";
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(home)/index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
// Create a client React-Query
const queryClient = new QueryClient();
const RootLayout = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const [loaded, error] = useFonts({
    Inter: require("../assets/fonts/Inter-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  LogBox.ignoreLogs(["Warning: ..."]); //Hide warnings

  LogBox.ignoreAllLogs(); //Hide all warning notifications on front-end
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutNav />
    </QueryClientProvider>
  );
};

const RootLayoutNav = () => {
  const { expoToken, setExpoToken } = useExpoNotificationStore();
  async function registerForPushNotificationsAsync() {
    let token = null; // Initialize token with null

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    console.log(Device.isDevice);
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return null; // Return null if failed to get push token
      }
      try {
        token = await Notifications.getExpoPushTokenAsync({
          projectId: "76f39386-a008-4b30-9726-06220f550a3a",
        });
      } catch (error) {
        console.error("Error getting push token: ", error);
      }
    } else {
      alert("Must use physical device for Push Notifications");
      return null; // Return null if not run on a physical device
    }

    return token?.data || null;
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((val) => setExpoToken(val));

    console.log(expoToken);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Stack>
        <Stack.Screen name="(auth)/sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/sign-up" options={{ headerShown: false }} />
        <Stack.Screen
          name="(auth)/verify-otp"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(general)/trip-detail"
          options={{
            title: "Chi tiết hành trình",
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="(general)/places-suggestion"
          options={{
            title: "Địa điểm gợi ý",
            headerTintColor: "black",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="(general)/interest"
          options={{
            headerStyle: {
              backgroundColor: "#181818",
            },
            headerTitleStyle: {
              color: "white",
            },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="(general)/rate-trip"
          options={{
            title: "Đánh giá hành trình",
            headerTintColor: "black",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="(general)/user-profile"
          options={{
            title: "Trang cá nhân",
            headerTintColor: "black",
            headerBackTitleVisible: false,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
};

export default RootLayout;
