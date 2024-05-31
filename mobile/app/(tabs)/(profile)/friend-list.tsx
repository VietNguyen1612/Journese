import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, Button, useTheme } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { removeFriend, useFriends } from "../../../api/user";
import { useAuthStore } from "../../../store";
import { useNavigation, useRouter } from "expo-router";
import { SuccessAnimation } from "../../../components";

const FriendList = () => {
  const authPayload = useAuthStore((state) => state.authPayload);
  const { data, isFetching, refetch } = useFriends(authPayload?.user._id);
  const { theme } = useTheme();
  const router = useRouter();
  const [isSuccess, setIsSucces] = useState(false);
  const [isFail, setIsFail] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation]);

  const handleRemoveFriend = async (friendId: string) => {
    const res = await removeFriend(
      authPayload?.user._id!,
      authPayload?.tokens.accessToken!,
      friendId
    );
    if (res.statusCode === 200) {
      setIsSucces(true);
      setTimeout(() => {
        setIsSucces(false);
      }, 1000);
    } else {
      setIsFail(true);
      setTimeout(() => {
        setIsFail(false);
      }, 1000);
    }
    refetch();
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
          content="Xoá thất bại"
          onPress={() => setIsFail(false)}
        />
      </Modal>
      <Modal transparent={true} visible={isSuccess}>
        <SuccessAnimation
          isSuccess={true}
          content="Xoá thành công"
          onPress={() => setIsSucces(false)}
        />
      </Modal>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        contentContainerStyle={{ gap: 20, paddingBottom: 10 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: "100%", gap: 12 }}>
          <View>
            <FlatList
              scrollEnabled={false}
              contentContainerStyle={{ gap: 12 }}
              data={data}
              renderItem={({ item }) => (
                <Pressable
                  style={{ flexDirection: "row", gap: 16 }}
                  key={item.id}
                  onPress={() => {
                    router.push({
                      pathname: "/(general)/user-profile",
                      params: { userId: `${item.id}` },
                    });
                  }}
                >
                  <Avatar rounded source={{ uri: item.avatarUrl }} size={80} />
                  <View
                    style={{
                      flexDirection: "column",
                      flex: 1,
                      justifyContent: "space-evenly",
                    }}
                  >
                    <Text style={{ fontWeight: "400", fontSize: 18 }}>
                      {item.fullName}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                      }}
                    >
                      <Button
                        onPress={() => handleRemoveFriend(item._id)}
                        titleStyle={{ fontSize: 16 }}
                        buttonStyle={{ borderRadius: 30 }}
                        type="outline"
                        containerStyle={{ width: "80%", height: "100%" }}
                        title={"Xoá bạn"}
                      />
                    </View>
                  </View>
                </Pressable>
              )}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default FriendList;

const styles = StyleSheet.create({});
