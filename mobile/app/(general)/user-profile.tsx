import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useOtherUserProfile } from "../../api/user";
import { useAuthStore } from "../../store";
import { Loading, LoadingScreen } from "../../components";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "@rneui/themed";
import {
  IconCircleCheck,
  IconDotsVertical,
  IconExclamationCircle,
  IconShieldCheck,
  IconShieldX,
} from "tabler-icons-react-native";
import { Button } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import { Divider } from "@rneui/themed";
import ReportUserModal from "../../components/ReportModal/ReportUserModal";
const { width, height } = Dimensions.get("window");
const profile_background = require("../../assets/images/profile-background.avif");
const profile_image = require("../../assets/images/profile-image.jpeg");
const UserProfile = () => {
  const { authPayload } = useAuthStore();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { theme } = useTheme();
  const router = useRouter();
  const navigation = useNavigation();
  const [openDial, setOpenDial] = useState(false);
  const [reportUserDialog, setReportUserDialog] = useState(false);
  const { data, isFetching } = useOtherUserProfile(userId);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => setOpenDial((pre) => !pre)}>
          <IconDotsVertical />
        </Pressable>
      ),
    });
  }, [data, authPayload]);
  //   console.log(reportUserDialog);
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {isFetching ? (
        <View
          style={{
            marginTop: -height / 8,
          }}
        >
          <LoadingScreen />
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={[""]}
          renderItem={(item) => (
            <View>
              <View style={{ height: (height * 4) / 13 }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    height: height / 5,
                    width: "100%",
                  }}
                >
                  <Image
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    borderBottomLeftRadius={5}
                    borderBottomRightRadius={5}
                    source={profile_background}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    height: "30%",
                  }}
                >
                  <View
                    style={{
                      height: "40%",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{
                        position: "relative",
                        bottom: "70%",
                      }}
                    >
                      <Image
                        source={{ uri: data.avatarUrl }}
                        borderRadius={999}
                        style={{ width: 120, height: 120 }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      height: "70%",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: "600",
                        }}
                      >
                        {data.firstName + " " + data.lastName}
                      </Text>
                      {data.isValid && (
                        <IconCircleCheck
                          style={{ marginLeft: 3 }}
                          size={24}
                          color={theme.colors.brand.primary[600]}
                        />
                      )}
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: theme.colors.grey5,
                  marginHorizontal: width / 9,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: data?.isValid
                    ? theme.colors.brand.primary[50]
                    : theme.colors.grey5,
                  marginBottom: 10,
                  flexDirection: "row",
                  gap: 15,
                  paddingVertical: 16,
                }}
              >
                {data?.isValid ? (
                  <IconShieldCheck
                    size={40}
                    color={theme.colors.brand.primary[800]}
                  />
                ) : (
                  <IconShieldX
                    size={40}
                    color={theme.colors.brand.yellow[900]}
                  />
                )}
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: 16,
                    color: data?.isValid
                      ? theme.colors.brand.primary[800]
                      : theme.colors.brand.yellow[900],
                  }}
                >
                  {data?.isValid
                    ? "Tài khoản đã được xác thực!"
                    : "Tài khoản chưa được xác thực!"}
                </Text>
              </View>
              {reportUserDialog && (
                <ReportUserModal
                  userId={userId}
                  reportUserDialog={reportUserDialog}
                  setReportUserDialog={setReportUserDialog}
                />
              )}
              {openDial && (
                <Pressable
                  style={{
                    width: width,
                    height: height,
                    position: "absolute",
                    zIndex: 10,
                    backgroundColor: "rgba(30,30,30,0.4)",
                  }}
                  onPress={() => setOpenDial(false)}
                >
                  <View
                    style={{
                      position: "absolute",
                      right: 8,
                      top: 4,
                      backgroundColor: "white",
                      borderRadius: 10,
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      shadowOpacity: 0.2,
                    }}
                  >
                    <Text
                      style={{
                        width: "100%",
                        textAlign: "right",
                        fontSize: 16,
                        fontWeight: "600",
                        paddingVertical: 4,
                      }}
                    >
                      Danh mục
                    </Text>
                    <Divider />
                    {authPayload && (
                      <Pressable
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                          paddingVertical: 6,
                        }}
                        onPress={() => {
                          setReportUserDialog(true);
                          setOpenDial(false);
                        }}
                      >
                        <IconExclamationCircle size={24} />
                        <Text style={{ fontSize: 16 }}>Báo cáo</Text>
                      </Pressable>
                    )}
                  </View>
                </Pressable>
              )}
              <View
                style={{
                  borderWidth: 1,
                  borderBottomWidth: 0,
                  borderColor: theme.colors.grey5,
                  marginHorizontal: 14,
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    width: (width * 12) / 13,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                    borderBottomWidth: 1.8,
                    borderColor: theme.colors.grey5,
                  }}
                >
                  <View
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 22,
                    }}
                  >
                    <Text style={{ fontSize: 16, fontWeight: "600" }}>
                      Ảnh đại diện
                    </Text>
                  </View>
                </View>
                <View style={{ paddingHorizontal: 12 }}>
                  {isFetching ? (
                    <Loading size={150} />
                  ) : (
                    <View style={{ alignItems: "center" }}>
                      <FlatList
                        numColumns={2}
                        scrollEnabled={false}
                        contentContainerStyle={{
                          gap: 10,
                          paddingBottom: 20,
                        }}
                        data={[...data?.attributes?.images]}
                        renderItem={({ item, index }) => (
                          <View style={{ paddingHorizontal: 5 }}>
                            <Image
                              style={{
                                width: width / 2.7,
                                height: width / 2.7,
                                borderRadius: 8,
                              }}
                              source={
                                item
                                  ? { uri: item }
                                  : require("../../assets/images/default-image.jpeg")
                              }
                            />
                          </View>
                        )}
                      />
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({});
