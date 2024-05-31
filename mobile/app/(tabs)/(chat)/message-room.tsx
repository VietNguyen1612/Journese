import {
  Dimensions,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Avatar, makeStyles, useTheme } from "@rneui/themed";
import { LoadingScreen } from "../../../components";
import { IconArrowBadgeRightFilled } from "tabler-icons-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAllMessages } from "../../../api/chat";
import { useAuthStore, useSocketStore } from "../../../store";
import axios from "axios";
import { useNavigation } from "expo-router/src/useNavigation";
import { TouchableOpacity } from "react-native-gesture-handler";
import { returnFormattedDate } from "../../../utils/regex";
import { ExclamationCircleIcon } from "react-native-heroicons/outline";
const tablet = Dimensions.get("window").width > 640 ? true : false;
const { width, height } = Dimensions.get("window");

interface Message {
  _id: string;
  senderId: {
    id: string;
    avatarUrl: string;
    fullName: string;
  };
  content: string;
  createdAt: string;
  groupChatId?: {
    participants: [id: string];
  };
}

const MessageComponent = ({
  item,
  currentUser,
}: {
  item: Message;
  currentUser: string | undefined;
}) => {
  const { theme } = useTheme();
  const currentUserStatus = item.senderId.id !== currentUser;
  return (
    <View style={currentUserStatus ? {} : { alignItems: "flex-end" }}>
      <View
        style={{
          maxWidth: "50%",
          marginVertical: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          {currentUserStatus && (
            <Avatar
              source={{ uri: item.senderId.avatarUrl }}
              containerStyle={{ borderColor: "white", borderWidth: 1 }}
              rounded
              size="small"
            />
          )}

          <View
            style={
              currentUserStatus
                ? {
                    width: "100%",
                    backgroundColor: "#c3eac7",
                    padding: 20,
                    borderRadius: 10,
                    marginBottom: 2,
                  }
                : [
                    {
                      width: "100%",
                      padding: 20,
                      borderRadius: 10,
                      marginBottom: 2,
                    },
                    { backgroundColor: "#00bb41" },
                  ]
            }
          >
            <Text
              style={
                currentUserStatus
                  ? { color: "#000", fontWeight: "500" }
                  : { color: "#fff", fontWeight: "500" }
              }
            >
              {item.content}
            </Text>
          </View>
        </View>
        <Text
          style={
            currentUserStatus
              ? {
                  marginLeft: 10,
                  color: theme.colors.grey3,
                  fontSize: 11,
                  paddingLeft: 38,
                }
              : {
                  alignSelf: "flex-end",
                  color: theme.colors.grey3,
                  fontSize: 11,
                }
          }
        >
          {returnFormattedDate(item.createdAt)}
        </Text>
      </View>
    </View>
  );
};

const MessageRoom = () => {
  const authPayload = useAuthStore((state) => state.authPayload);
  const { theme } = useTheme();

  const { socket, setSocket } = useSocketStore();
  const styles = useStyles();
  const navigation = useNavigation();
  const router = useRouter();
  const { roomId, tripId, isGroupGroupChat, avatarUrl, name } =
    useLocalSearchParams();
  const roomIdString = roomId ? roomId.toString() : "";
  const { data, isFetching, error } = useAllMessages(roomIdString);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  // console.log(navigation.getState().history)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar
            source={{ uri: `${avatarUrl}` }}
            containerStyle={{ borderColor: "white", borderWidth: 1 }}
            rounded
            size={38}
          />
          <Text
            style={{
              marginLeft: 10,
              fontWeight: "500",
              fontSize: 17,
            }}
          >
            {name}
          </Text>
        </View>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/(tabs)/(chat)/room-detail",
                params: {
                  roomId: roomId,
                  isGroupGroupChat: isGroupGroupChat,
                  tripId: tripId,
                },
              });
            }}
            style={{
              marginHorizontal: 10,
              borderRadius: 99,
              padding: 5,
            }}
          >
            <ExclamationCircleIcon size={30} color={theme.colors.grey1} />
          </TouchableOpacity>
        </View>
      ),
    });
    return () => {
      console.log("unmount");
    };
  }, [navigation, roomId, avatarUrl, name]);

  useEffect(() => {
    if (data && socket) {
      setAllMessages(data);
      socket.emit("joinRoom", roomIdString);
    }
  }, [data]);

  useEffect(() => {
    if (socket) {
      socket.on("connected", () => {
        console.log(name, "socket connected");
      });

      socket.on("receiveMessage", (message: Message) => {
        setAllMessages((pre) => [...pre.reverse(), message].reverse());
      });

      return () => {
        socket.off("connected");
        socket.off("receiveMessage");
      };
    }
  }, []);

  const handleSendMessage = async () => {
    let messageSend = message;
    setMessage("");
    const { data } = await axios.post(
      `${process.env.EXPO_PUBLIC_BACKEND_API}/message`,
      {
        content: messageSend,
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
    if (socket) {
      socket.emit("sendMessage", data["metadata"]);
    }

    setAllMessages((pre) => [...pre.reverse(), data["metadata"]].reverse());
  };
  return (
    <View style={styles.wrapper}>
      {isFetching ? (
        <LoadingScreen />
      ) : (
        <>
          <View style={[styles.wrapper, { paddingHorizontal: 10 }]}>
            {allMessages && allMessages[0] ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingTop: height / 12,
                }}
                inverted
                scrollsToTop={true}
                data={allMessages}
                renderItem={({ item }) => (
                  <MessageComponent
                    item={item}
                    currentUser={authPayload?.user._id}
                  />
                )}
                // keyExtractor={(item) => item.toString()}
              />
            ) : (
              ""
            )}
          </View>
          <View style={styles.messageInputContainer}>
            <TextInput
              style={{
                width: "80%",
                borderColor: theme.colors.grey3,
                flex: 1,
                borderRadius: 50,
                marginRight: 10,
                backgroundColor: theme.colors.brand.primary[100],
                padding: 10,
                paddingHorizontal: 20,
                fontSize: 16,
              }}
              value={message}
              onChangeText={(value) => setMessage(value)}
              placeholder="Nhập tin nhắn..."
              placeholderTextColor={theme.colors.grey3}
            />

            <Pressable onPress={handleSendMessage}>
              <IconArrowBadgeRightFilled
                color={theme.colors.brand.primary[600]}
                size={40}
              />
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
};

export default MessageRoom;

const useStyles = makeStyles((theme) => ({
  wrapper: {
    flex: 1,
    backgroundColor: "white",
  },
  messageInputContainer: {
    position: "absolute",
    width: width,
    bottom: 0,
    backgroundColor: "rgba(245,245,245,0.8)",
    paddingHorizontal: 16,
    paddingRight: 8,
    paddingVertical: 20,
    paddingTop: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
}));
