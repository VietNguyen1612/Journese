import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useAllParticipants } from "../../../api/chat";
import { useTheme } from "@rneui/themed";
import {
  IconCircleMinus,
  IconDoorExit,
  IconPlus,
} from "tabler-icons-react-native";
import { Avatar } from "@rneui/themed";
import { AuthUser, useAuthStore } from "../../../store";
import {
  ListFriends,
  LoadingScreen,
  SuccessAnimation,
} from "../../../components";
import { useFriends } from "../../../api/user";
import axios from "axios";
const { height, width } = Dimensions.get("window");
const RoomDetail = () => {
  const navigation = useNavigation();
  const { authPayload } = useAuthStore();
  const { roomId } = useLocalSearchParams();
  const roomIdString = roomId ? roomId.toString() : "";
  const { data, isFetching, error, isLoading, refetch } =
    useAllParticipants(roomIdString);
  const { theme } = useTheme();
  const router = useRouter();
  const [showFriends, setShowFriends] = useState(false);
  const [participantIds, setParticipantIds] = useState<Array<string>>([]);
  const [friendList, setFriendList] = useState([]);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [successContent, setSuccessContent] = useState("");
  const { data: friends } = useFriends(authPayload?.user._id);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation]);
  const handleAddFriend = async (e: any) => {
    // console.log(e)
    const res = await axios.post(
      `${process.env.EXPO_PUBLIC_BACKEND_API}/groupchat/add`,
      {
        userId: e._id,
        groupChatId: roomIdString,
      },
      {
        headers: {
          "x-client-id": authPayload?.user._id,
          authorization: authPayload?.tokens.accessToken,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res.data.metadata);
    if (res.data.statusCode == 200) {
      setShowFriends(false);
      setSuccessContent("Thêm thành viên thành công");
      refetch();
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }
  };
  const handleRemoveFriend = async (e: any) => {
    // console.log(e)
    const res = await axios.post(
      `${process.env.EXPO_PUBLIC_BACKEND_API}/groupchat/remove`,
      {
        userId: e._id,
        groupChatId: roomIdString,
      },
      {
        headers: {
          "x-client-id": authPayload?.user._id,
          authorization: authPayload?.tokens.accessToken,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res.data.metadata);
    if (res.data.statusCode == 200) {
      setSuccessContent("Xoá thành viên thành công");
      refetch();
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }
  };
  useEffect(() => {
    if (data) {
      setParticipantIds(data.participants.map((obj: any) => obj._id));
    }
  }, [data, friends]);

  useEffect(() => {
    if (friends) {
      setFriendList(
        friends.filter((item: AuthUser) => !participantIds.includes(item._id))
      );
    }
  }, [participantIds, friends]);
  return (
    <View style={{ backgroundColor: "#eee", flex: 1 }}>
      {isFetching ? (
        <LoadingScreen />
      ) : (
        <>
          <Modal transparent={true} visible={isSuccess}>
            <SuccessAnimation
              isSuccess={true}
              content={successContent}
              onPress={() => {
                setIsSuccess(false);
              }}
            />
          </Modal>
          {data.tripId == null ? (
            <FlatList
              contentContainerStyle={{
                paddingVertical: 5,
                borderRadius: 10,
                marginVertical: 5,
              }}
              scrollEnabled={false}
              data={data.participants}
              ListFooterComponentStyle={{
                alignItems: "center",
                padding: 6,
              }}
              ListFooterComponent={
                <View style={{ marginTop: 6 }}>
                  {data.isGroupGroupChat == true &&
                    authPayload?.user._id == data.createdBy && (
                      <TouchableOpacity
                        style={{
                          alignItems: "center",
                          gap: 4,
                        }}
                        onPress={() => setShowFriends(true)}
                      >
                        <IconPlus
                          size={36}
                          color={theme.colors.brand.primary[600]}
                        />
                        <Text
                          style={{
                            color: theme.colors.brand.primary[600],
                            fontSize: 15,
                          }}
                        >
                          Mời bạn bè tham gia
                        </Text>
                      </TouchableOpacity>
                    )}
                </View>
              }
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: width / 10,
                    padding: 6,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 15,
                    }}
                  >
                    <Avatar
                      size={55}
                      rounded
                      source={{
                        uri: item.avatarUrl,
                      }}
                    />
                    <View style={{ gap: 4 }}>
                      <Text style={{ fontSize: 15, fontWeight: "600" }}>
                        {item.firstName} {item.lastName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "400",
                          color: theme.colors.grey2,
                        }}
                      >
                        {item.phone}
                      </Text>
                    </View>
                  </View>

                  {item._id !== authPayload?.user._id &&
                    authPayload?.user._id == data.createdBy &&
                    data.isGroupGroupChat == true && (
                      <Pressable onPress={() => handleRemoveFriend(item)}>
                        <IconCircleMinus size={36} color={theme.colors.grey3} />
                      </Pressable>
                    )}
                </View>
              )}
            />
          ) : (
            <FlatList
              contentContainerStyle={{
                paddingVertical: 5,
                borderRadius: 10,
                marginVertical: 5,
              }}
              scrollEnabled={false}
              data={data.participants}
              ListFooterComponentStyle={{
                alignItems: "center",
                padding: 6,
              }}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: width / 10,
                    padding: 6,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 15,
                    }}
                  >
                    <Avatar
                      size={55}
                      rounded
                      source={{
                        uri: item.avatarUrl,
                      }}
                    />
                    <View style={{ gap: 4 }}>
                      <Text style={{ fontSize: 15, fontWeight: "600" }}>
                        {item.firstName} {item.lastName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "400",
                          color: theme.colors.grey2,
                        }}
                      >
                        {item.phone}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            />
          )}
          {showFriends && (
            <Pressable
              style={{
                position: "absolute",
                zIndex: 10,
                justifyContent: "center",
                alignItems: "center",
                width: width,
                height: height,
                backgroundColor: "rgba(52, 52, 52, 0.5)",
              }}
              onPress={() => setShowFriends(false)}
            >
              <View
                style={{
                  borderRadius: 10,
                  backgroundColor: "white",
                  // height: height / 3,
                  width: (width * 3) / 4,
                  marginBottom: height / 6,
                }}
              >
                <ListFriends
                  friends={friendList}
                  onPress={(e) => handleAddFriend(e)}
                />
              </View>
            </Pressable>
          )}
        </>
      )}
    </View>
  );
};

export default RoomDetail;

const styles = StyleSheet.create({});
