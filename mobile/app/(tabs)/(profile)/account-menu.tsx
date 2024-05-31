import {
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  IconAd,
  IconArchive,
  IconBell,
  IconChevronRight,
  IconLogin,
  IconLogout,
  IconMap2,
  IconNotification,
  IconSettings,
  IconStar,
  IconUserPlus,
  IconUsers,
} from "tabler-icons-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Button, Image, makeStyles } from "@rneui/themed";
import { AccountMenuOptionCard } from "../../../components/AccountMenuOptionCard";
import { useAuthStore } from "../../../store";
import { useRouter } from "expo-router";
import { SuccessAnimation } from "../../../components";
const profile_image = require("../../../assets/images/profile-image.jpeg");
const profile_background = require("../../../assets/images/profile-background.avif");

const { width, height } = Dimensions.get("window");
const tablet = Dimensions.get("window").width > 640 ? true : false;

const OPTIONS = [
  {
    id: "1",
    option: "/(tabs)/(profile)/trip-management",
    title: "Quản lý hành trình",
    icon: <IconMap2 size={24} />,
    tailIcon: <IconChevronRight size={24} />,
  },
  {
    id: "2",
    option: "/(tabs)/(profile)/ads-management",
    title: "Quản lý quảng cáo",
    icon: <IconAd size={24} />,
    tailIcon: <IconChevronRight size={24} />,
  },
  {
    id: "3",
    option: "/(tabs)/(profile)/trip-request-management",
    title: "Yêu cầu tham gia",
    icon: <IconArchive size={24} />,
    tailIcon: <IconChevronRight size={24} />,
  },
  {
    id: "4",
    option: "/(tabs)/(profile)/friend-list",
    title: "Danh sách bạn bè",
    icon: <IconUsers size={24} />,
    tailIcon: <IconChevronRight size={24} />,
  },
  {
    id: "5",
    option: "/(tabs)/(profile)/notification",
    title: "Danh sách thông báo",
    icon: <IconBell size={24} />,
    tailIcon: <IconChevronRight size={24} />,
  },
  {
    id: "6",
    option: "/(general)/interest",
    title: "Chỉnh sửa sở thích",
    icon: <IconStar size={24} />,
    tailIcon: <IconChevronRight size={24} />,
  },
  {
    id: "7",
    option: "Logout",
    title: "Đăng xuất",
    icon: <IconLogout size={24} />,
    tailIcon: <IconChevronRight size={24} />,
  },
];

const AccountMenu = () => {
  const [isLogoutSuccess, setIsLogoutSuccess] = useState(false);
  const styles = useStyles();
  const router = useRouter();
  const { authPayload } = useAuthStore();
  const setAuthPayload = useAuthStore((state) => state.setAuthPayload);

  return (
    <View style={{ flex: 1 }}>
      <Modal transparent={true} visible={isLogoutSuccess}>
        <SuccessAnimation
          isSuccess={true}
          content="Đăng xuất thành công"
          onPress={() => {
            setIsLogoutSuccess(false);
          }}
        />
      </Modal>
      {authPayload === null ? (
        <View style={{ flex: 1 }}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.backgroundImageContainer}
            >
              <Image
                style={styles.backgroundImage}
                borderBottomLeftRadius={5}
                borderBottomRightRadius={5}
                source={profile_background}
              />
            </TouchableOpacity>
            <View style={styles.headerBottomContainer}>
              <View style={styles.avatarContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.avatarCover}
                >
                  <Image
                    source={profile_image}
                    borderRadius={999}
                    style={{ width: 120, height: 120 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{ marginHorizontal: width / 20 }}>
            <AccountMenuOptionCard
              title={"Đăng nhập"}
              icon={<IconLogin size={24} />}
              tailIcon={<IconChevronRight size={24} />}
              onPress={() => {
                router.replace("/(auth)/sign-in");
              }}
            />
          </View>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.listOptionContainer}>
            <View style={styles.profileOptionContainer}>
              <AccountMenuOptionCard
                icon={
                  <Image
                    source={
                      authPayload?.user.avatarUrl
                        ? { uri: authPayload?.user.avatarUrl }
                        : profile_image
                    }
                    borderRadius={999}
                    style={{ width: 55, height: 55 }}
                  />
                }
                title={
                  authPayload.user.firstName + " " + authPayload.user.lastName
                }
                tailIcon={<IconChevronRight size={30} />}
                onPress={() => router.push("/(tabs)/(profile)/profile")}
              />
            </View>
            <FlatList
              scrollEnabled={false}
              contentContainerStyle={styles.listOptionFlatList}
              data={OPTIONS}
              renderItem={({ item }) => (
                <AccountMenuOptionCard
                  title={item.title}
                  icon={item.icon}
                  tailIcon={item.tailIcon}
                  onPress={
                    item.title == "Đăng xuất"
                      ? () => {
                          setAuthPayload(null);
                          setIsLogoutSuccess(true);
                          setTimeout(() => {
                            setIsLogoutSuccess(false);
                          }, 2000);
                        }
                      : () => router.push(item.option as any)
                  }
                />
              )}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default AccountMenu;

const useStyles = makeStyles((theme) => ({
  listOptionFlatList: {
    justifyContent: width > 640 ? "center" : "space-between",
    gap: 18,
  },
  listOptionContainer: {
    paddingVertical: height / 15,
    paddingHorizontal: width / 20,
  },
  profileOptionContainer: {
    marginTop: 30,
    marginBottom: 50,
  },
  headerContainer: {
    height: (height * 4) / 10,
  },
  backgroundImageContainer: {
    height: "70%",
    width: "100%",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  headerBottomContainer: {
    height: "30%",
  },
  avatarContainer: {
    height: "40%",
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  avatarCover: {
    position: "absolute",
    bottom: 0,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 9999,
  },
}));
