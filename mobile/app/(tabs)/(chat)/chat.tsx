import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { SearchBar, makeStyles } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  RefreshControl,
  ScrollView,
} from "react-native-gesture-handler";
import {
  ChatCardComponent,
  NewGroupChatCard,
} from "../../../components/ChatCardComponent";
import { useNavigation, useRouter } from "expo-router";
import { useAuthStore, useSocketStore } from "../../../store";
import { useAllGroupChat } from "../../../api/chat";
import { io } from "socket.io-client";
import { returnFormattedDate } from "../../../utils/regex";
import { Button } from "@rneui/themed";
const chat = () => {
  const authPayload = useAuthStore((state) => state.authPayload);
  const { socket, setSocket } = useSocketStore();
  const { data, isFetching, refetch } = useAllGroupChat(
    authPayload?.user._id,
    authPayload?.tokens.accessToken
  );
  const styles = useStyles();
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (authPayload) {
      setSocket(io(`${process.env.EXPO_PUBLIC_SOCKET_CHAT}`));
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("setup", authPayload?.user);
      socket.on("connected", () => {
        console.log("group chat screen socket connected");
      });
      socket.on("receiveMessage", (message: any) => {
        refetch();
      });

      socket.on("newGroupChat", (groupChat: any) => {
        refetch();
      });
      // Return a cleanup function
      return () => {
        socket.off("connected");
        socket.off("receiveMessage");
        socket.off("newGroupChat");
      };
    }
  }, [socket]);
  // console.log(navigation.getState().history)
  return (
    <View style={styles.container}>
      {/* <SearchBar placeholder="Nhập vào đây để tìm kiếm" platform="android" /> */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        showsVerticalScrollIndicator={false}
      >
        {authPayload ? (
          <FlatList
            scrollEnabled={false}
            data={data}
            renderItem={({ item }) => (
              <>
                {item.isGroupGroupChat ? (
                  <ChatCardComponent
                    key={item._id}
                    onPress={() => {
                      router.push({
                        pathname: "/(tabs)/(chat)/message-room",
                        params: {
                          roomId: item._id,
                          avatarUrl: item.createdBy.avatarUrl,
                          name: item.name,
                          isGroupGroupChat: item.isGroupGroupChat,
                          tripId: item.tripId,
                        },
                      });
                    }}
                    size={56}
                    type="chat"
                    user={item.name}
                    chatContentAuthor={
                      item.lastMessage.senderId == authPayload?.user._id
                        ? "Bạn: "
                        : undefined
                    }
                    time={returnFormattedDate(item.lastMessage.createdAt)}
                    isSeen={true}
                    chatContent={item.lastMessage.content}
                    avatarURI={item.createdBy.avatarUrl}
                  />
                ) : (
                  <ChatCardComponent
                    key={item._id}
                    onPress={() => {
                      router.push({
                        pathname: "/(tabs)/(chat)/message-room",
                        params: {
                          roomId: item._id,
                          avatarUrl:
                            item.participants[0]._id == authPayload?.user._id
                              ? item.participants[1].avatarUrl
                              : item.participants[0].avatarUrl,
                          name:
                            item.participants[0]._id == authPayload?.user._id
                              ? item.participants[1].firstName +
                                " " +
                                item.participants[1].lastName
                              : item.participants[0].firstName +
                                " " +
                                item.participants[0].lastName,
                          isGroupGroupChat: item.isGroupGroupChat,
                          tripId: item.tripId,
                        },
                      });
                    }}
                    size={56}
                    type="chat"
                    user={
                      item.participants[0]._id == authPayload?.user._id
                        ? item.participants[1].firstName +
                          " " +
                          item.participants[1].lastName
                        : item.participants[0].firstName +
                          " " +
                          item.participants[0].lastName
                    }
                    chatContentAuthor={
                      item.lastMessage.senderId == authPayload?.user._id
                        ? "Bạn: "
                        : undefined
                    }
                    time={returnFormattedDate(item.lastMessage.createdAt)}
                    isSeen={true}
                    chatContent={item.lastMessage.content}
                    avatarURI={
                      item.participants[0]._id == authPayload?.user._id
                        ? item.participants[1].avatarUrl
                        : item.participants[0].avatarUrl
                    }
                  />
                )}
              </>
            )}
          />
        ) : (
          <View style={{ width: "100%", alignItems: "center" }}>
            <View style={{ marginTop: 40, width: "50%" }}>
              <Button
                radius={10}
                buttonStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
                titleStyle={{ fontWeight: "500" }}
                onPress={() => router.replace("/(auth)/sign-in")}
              >
                Đăng nhập
              </Button>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default chat;

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    paddingHorizontal: 10,
  },
  listCardContainer: {
    marginTop: 8,
    gap: 8,
    flex: 1,
  },
}));
