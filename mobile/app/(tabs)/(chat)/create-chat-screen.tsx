import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackToPreviousPageButton from "../../../components/BackToPreviousPageButton/BackToPreviousPageButton";
import { Input, SearchBar, useTheme } from "@rneui/themed";
import { SuccessAnimation, TextInput } from "../../../components";
import {
  FlatList,
  RefreshControl,
  ScrollView,
} from "react-native-gesture-handler";
import { NewGroupChatCard } from "../../../components/ChatCardComponent";
import { useNavigation } from "expo-router/src/useNavigation";
import { AuthUser, useAuthStore, useSocketStore } from "../../../store";
import { useFriends } from "../../../api/user";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { io } from "socket.io-client";
import { IconCirclePlus } from "tabler-icons-react-native";
import { useDebounce } from "../../../utils/customHook";

const CreateChatScreen = () => {
  const authPayload = useAuthStore((state) => state.authPayload);
  const { socket, setSocket } = useSocketStore();
  const { data, isFetching, refetch } = useFriends(authPayload?.user._id);
  const navigation = useNavigation();
  const [userList, setUserList] = useState<Array<{ id: string; name: string }>>(
    []
  );

  const [isFail, setIsFail] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>("");
  const { theme } = useTheme();
  const [errGroupName, setErrGroupName] = useState<boolean>(false);

  const [searchFriend, setSearchFriend] = useState<string>("");
  const [friendsList, setFriendsList] = useState<AuthUser[]>([]);
  const debouncedSearchTerm = useDebounce(searchFriend, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      const result = data.filter((fr: AuthUser) =>
        (fr.firstName.toLowerCase() + " " + fr.lastName.toLowerCase()).includes(
          debouncedSearchTerm.toLowerCase()
        )
      );
      setFriendsList(result);
    } else {
      setFriendsList(data);
    }
  }, [debouncedSearchTerm, data]);

  const onClickCard = (user: { id: string; name: string }) => {
    if (userList.find((item) => item.id === user.id)) {
      setUserList(userList.filter((item) => item.id !== user.id));
    } else {
      setUserList([...userList, user]);
    }
  };

  useEffect(() => {
    setSocket(io(`${process.env.EXPO_PUBLIC_SOCKET_CHAT}`));
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("setup", authPayload?.user);
      socket.on("connected", () => {
        console.log("create chat screen socket connected");
      });

      return () => {
        socket.off("connected");
      };
    }
  }, [socket]);

  const handleCreate = async () => {
    let participants = userList.map((item) => item.id);

    const res = await axios.post(
      `${process.env.EXPO_PUBLIC_BACKEND_API}/groupchat`,
      {
        isGroupGroupChat: true,
        name: groupName,
        participants: participants,
        createdBy: authPayload?.user._id,
      },
      {
        headers: {
          "x-client-id": authPayload?.user._id,
          authorization: authPayload?.tokens.accessToken,
          "Content-Type": "application/json",
        },
      }
    );
    if (res.data.statusCode !== 201) {
      setIsFail(true);
    } else {
      socket?.emit("newGroupChat", res.data["metadata"]);
      setUserList([]);
      setGroupName("");
      setIsSuccess(true);
    }
  };

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <TouchableOpacity
  //         disabled={userList.length == 0 ? true : false}
  //         onPress={handleCreate}
  //       >
  //         <Text
  //           style={{
  //             color:
  //               userList.length == 0
  //                 ? theme.colors.disabled
  //                 : theme.colors.brand.primary[400],
  //           }}
  //         >
  //           Tạo
  //         </Text>
  //       </TouchableOpacity>
  //     ),
  //   });
  // }, [navigation, userList]);
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Modal transparent={true} visible={isFail}>
        <SuccessAnimation
          isSuccess={false}
          content="Tạo thất bại"
          onPress={() => setIsFail(false)}
        />
      </Modal>
      <Modal transparent={true} visible={isSuccess}>
        <SuccessAnimation
          isSuccess={true}
          content="Tạo thành công"
          onPress={() => setIsSuccess(false)}
        />
      </Modal>
      <View style={{ marginTop: 20 }}>
        <TextInput
          placeholder="Nhập tên nhóm"
          onChangeText={(val) => {
            setGroupName(val);
          }}
          value={groupName}
          onSubmitEditing={() => {
            if (groupName.length == 0 || groupName == null) {
              setErrGroupName(true);
            } else {
              setErrGroupName(false);
            }
          }}
        />
        {errGroupName && (
          <Text style={{ color: "red", marginLeft: 10 }}>
            Tên nhóm ko đc để trống
          </Text>
        )}
      </View>
      <View
        style={{
          position: "absolute",
          right: 10,
          top: 20,
        }}
      >
        <TouchableOpacity
          disabled={userList.length == 0 ? true : false}
          onPress={handleCreate}
        >
          <IconCirclePlus
            size={40}
            color={
              userList.length == 0
                ? theme.colors.disabled
                : theme.colors.brand.primary[400]
            }
          />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", marginLeft: 10, flexWrap: "wrap" }}>
        <Text>Thành viên: </Text>
        {userList.length === 0 && <Text>Trống</Text>}
        {userList.map((item, key) => (
          <Text key={key}>
            {item.name} {key === userList.length - 1 ? "" : ", "}
          </Text>
        ))}
      </View>
      <View>
        <SearchBar
          placeholder="Nhập vào đây để tìm kiếm"
          platform="android"
          value={searchFriend}
          onChangeText={(e) => setSearchFriend(e)}
        />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        contentContainerStyle={{
          gap: 20,
          paddingBottom: 10,
          marginHorizontal: 10,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: "100%", gap: 12 }}>
          <View>
            <FlatList
              scrollEnabled={false}
              contentContainerStyle={{ gap: 12 }}
              data={friendsList}
              renderItem={({ item }) => (
                <Pressable
                  key={item._id}
                  onPress={() =>
                    onClickCard({
                      id: item._id,
                      name: item.firstName + " " + item.lastName,
                    })
                  }
                >
                  <NewGroupChatCard
                    avatarURI={item.avatarUrl}
                    size={56}
                    user={item.firstName + " " + item.lastName}
                    isSelected={
                      userList.find((user) => user.id === item._id)?.id ===
                      item._id
                    }
                  />
                </Pressable>
              )}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateChatScreen;

const styles = StyleSheet.create({});
