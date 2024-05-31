import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { Avatar, Button, useTheme } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { useAuthStore } from "../../../store";
import {
  useFriendRequest,
  useFriendRequested,
  useNonFriends,
} from "../../../api/user";
import axios from "axios";
import { SuccessAnimation } from "../../../components";

const AddFriend = () => {
  const { theme } = useTheme();
  const authPayload = useAuthStore((state) => state.authPayload);
  const {
    data: friendRequests,
    isFetching,
    refetch,
  } = useFriendRequest(authPayload?.user._id);
  const {
    data: friendSuggest,
    isFetching: isFetchingFriendSuggest,
    refetch: refetchFriendSuggest,
  } = useNonFriends(authPayload?.user._id);
  const {
    data: friendRequested,
    isFetching: isFetchingFriendRequested,
    refetch: refetchFriendRequested,
  } = useFriendRequested(
    authPayload?.user._id!,
    authPayload?.tokens.accessToken!
  );
  const [isFail, setIsFail] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const handleAccept = async (id: string) => {
    const { data } = await axios.post(
      `${process.env.EXPO_PUBLIC_BACKEND_API}/friend/accept`,
      {
        targetId: id,
      },
      {
        headers: {
          "x-client-id": authPayload?.user._id,
          authorization: authPayload?.tokens.accessToken,
          "Content-Type": "application/json",
        },
      }
    );
    if (data.statusCode !== 200) {
      setIsFail(true);
    } else {
      setIsSuccess(true);
      refetch();
    }
  };
  const handleRequest = async (id: string) => {
    const { data } = await axios.post(
      `${process.env.EXPO_PUBLIC_BACKEND_API}/friend/send`,
      {
        targetId: id,
      },
      {
        headers: {
          "x-client-id": authPayload?.user._id,
          authorization: authPayload?.tokens.accessToken,
          "Content-Type": "application/json",
        },
      }
    );
    if (data.statusCode !== 200) {
      setIsFail(true);
    } else {
      setIsSuccess(true);
      refetchFriendSuggest();
      refetchFriendRequested();
    }
  };

  const handleCancelRequest = async (id: string) => {
    const { data } = await axios.get(
      `${process.env.EXPO_PUBLIC_BACKEND_API}/friend/delete/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (data.statusCode !== 200) {
      setIsFail(true);
    } else {
      setIsSuccess(true);
      refetchFriendRequested();
      refetchFriendSuggest();
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: 10,
        paddingTop: 10,
      }}
    >
      <Modal transparent={true} visible={isFail}>
        <SuccessAnimation
          isSuccess={false}
          content="Thất bại"
          onPress={() => setIsFail(false)}
        />
      </Modal>
      <Modal transparent={true} visible={isSuccess}>
        <SuccessAnimation
          isSuccess={true}
          content="Thành công"
          onPress={() => setIsSuccess(false)}
        />
      </Modal>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isFetching || isFetchingFriendSuggest}
            onRefresh={() => {
              refetch();
              refetchFriendSuggest();
              refetchFriendRequested();
            }}
          />
        }
        contentContainerStyle={{ gap: 20, paddingBottom: 10 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: "100%", gap: 12 }}>
          <View>
            {friendRequests && (
              <FlatList
                scrollEnabled={false}
                contentContainerStyle={{ gap: 12 }}
                data={friendRequests}
                renderItem={({ item }) => (
                  <Pressable
                    style={{ flexDirection: "row", gap: 16 }}
                    key={item._id}
                  >
                    <Avatar
                      rounded
                      source={{ uri: item.senderId.avatarUrl }}
                      size={80}
                    />
                    <View
                      style={{
                        flexDirection: "column",
                        flex: 1,
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Text style={{ fontWeight: "400", fontSize: 18 }}>
                        {item.senderId.fullName}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Button
                          onPress={() => handleAccept(item.senderId.id)}
                          titleStyle={{ fontSize: 16 }}
                          buttonStyle={{ borderRadius: 30 }}
                          containerStyle={{ width: "48%", height: "100%" }}
                          title={"Đồng ý"}
                        />
                        <Button
                          buttonStyle={{ borderRadius: 30 }}
                          titleStyle={{ fontSize: 16 }}
                          type="outline"
                          containerStyle={{ width: "48%", height: "100%" }}
                          title={"Từ chối"}
                        />
                      </View>
                    </View>
                  </Pressable>
                )}
              />
            )}
            {friendRequested && (
              <FlatList
                scrollEnabled={false}
                contentContainerStyle={{ gap: 12 }}
                data={friendRequested}
                renderItem={({ item }) => (
                  <Pressable
                    style={{ flexDirection: "row", gap: 16 }}
                    key={item._id}
                  >
                    <Avatar
                      rounded
                      source={{ uri: item.receiveId.avatarUrl }}
                      size={80}
                    />
                    <View
                      style={{
                        flexDirection: "column",
                        flex: 1,
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Text style={{ fontWeight: "400", fontSize: 18 }}>
                        {item.receiveId.firstName +
                          " " +
                          item.receiveId.lastName}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Button
                          onPress={() => handleCancelRequest(item._id)}
                          titleStyle={{ fontSize: 16 }}
                          buttonStyle={{
                            borderRadius: 30,
                            backgroundColor: theme.colors.brand.yellow[800],
                          }}
                          containerStyle={{ width: "50%", height: "100%" }}
                          title={"Hủy yêu cầu"}
                        />
                      </View>
                    </View>
                  </Pressable>
                )}
              />
            )}
          </View>
          <View>
            <Text>Những người bạn có thể biết</Text>
            <FlatList
              scrollEnabled={false}
              contentContainerStyle={{ gap: 12 }}
              data={friendSuggest}
              renderItem={({ item }) => (
                <Pressable
                  style={{ flexDirection: "row", gap: 12 }}
                  key={item.id}
                >
                  <Avatar rounded source={{ uri: item.avatarUrl }} size={80} />
                  <View
                    style={{
                      flexDirection: "column",
                      flex: 1,
                      justifyContent: "space-evenly",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ fontWeight: "400", fontSize: 18 }}>
                        {item.fullName}
                      </Text>
                      {/* <Text>{item.mutualFriends.length} bạn chung</Text> */}
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        onPress={() => handleRequest(item._id)}
                        titleStyle={{ fontSize: 16 }}
                        buttonStyle={{ borderRadius: 30 }}
                        containerStyle={{ width: "50%", height: "100%" }}
                        title={"Thêm bạn"}
                      />
                    </View>
                  </View>
                </Pressable>
              )}
            />
          </View>
        </View>
        {/* <View style={{ width: '100%', gap: 12 }}>
                    <Text style={{ fontWeight: '600', fontSize: 20 }}>Những người bạn có thể biết</Text>
                    <View>
                        {renderFriendSuggest(friendSuggests)}
                    </View>
                </View> */}
      </ScrollView>
    </View>
  );
};

export default AddFriend;

const styles = StyleSheet.create({});
