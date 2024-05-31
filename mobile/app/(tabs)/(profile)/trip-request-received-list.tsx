import {
  Alert,
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
import { router, useLocalSearchParams } from "expo-router";
import {
  acceptParticipateToTrip,
  rejectParticipateToTrip,
  useRequestJoinTripReceive,
} from "../../../api/trip";
import { SuccessAnimation } from "../../../components";
import AnimatedLottieView from "lottie-react-native";
const profile_image = require("../../../assets/images/profile-image.jpeg");

const TripRequestReceivedList = () => {
  const authPayload = useAuthStore((state) => state.authPayload);
  const { tripId, numOfParticipants } = useLocalSearchParams<{
    tripId: string;
    numOfParticipants: string;
  }>();
  const [isSuccess, setIsSuccess] = useState(false);
  const { data, isFetching, refetch } = useRequestJoinTripReceive(
    authPayload?.tokens.accessToken!,
    authPayload?.user._id!,
    tripId
  );
  const { theme } = useTheme();

  const handleAcceptRequest = async (requestUserId: string) => {
    if (parseInt(numOfParticipants) === 7) {
      Alert.alert(
        "Thông báo",
        "Không thể thêm thành viên vì đã đạt số lượng tối đa! 7 thành viên"
      );
      return;
    }
    await acceptParticipateToTrip(
      authPayload?.tokens.accessToken!,
      authPayload?.user._id!,
      requestUserId,
      tripId
    );
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
    }, 1100);
    refetch();
  };

  const handleRejectRequest = async (requestUserId: string) => {
    await rejectParticipateToTrip(
      authPayload?.tokens.accessToken!,
      authPayload?.user._id!,
      requestUserId,
      tripId
    );
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
    }, 1100);
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
      <Modal visible={isSuccess} transparent={true}>
        <SuccessAnimation
          isSuccess={isSuccess}
          onPress={() => setIsSuccess(false)}
          content="Thành công!"
        />
      </Modal>
      {data?.length === 0 || !data ? (
        <View
          style={{
            alignItems: "center",
            marginBottom: 30,
            justifyContent: "center",
            height: "100%",
          }}
        >
          <AnimatedLottieView
            source={require("../../../assets/lotties/notfound_animation.json")}
            style={{
              width: "100%",
              height: 180,
            }}
            autoPlay
            loop
          />
          <Text
            style={{
              fontSize: 22,
              fontWeight: "600",
              color: theme.colors.grey3,
            }}
          >
            Không có yêu cầu nào!
          </Text>
        </View>
      ) : (
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
                    style={{ flexDirection: "row", gap: 20 }}
                    key={item.id}
                    onPress={() =>
                      router.push({
                        pathname: "/(general)/user-profile",
                        params: { userId: `${item.requestUserId._id}` },
                      })
                    }
                  >
                    <Avatar
                      rounded
                      source={
                        item?.requestUserId.avatarUrl
                          ? { uri: item?.requestUserId.avatarUrl }
                          : profile_image
                      }
                      size={80}
                      containerStyle={{
                        borderWidth: 0.3,
                        borderColor: theme.colors.grey3,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: "column",
                        flex: 1,
                        justifyContent: "space-evenly",
                        gap: 5,
                      }}
                    >
                      <Text style={{ fontWeight: "500", fontSize: 18 }}>
                        {item.requestUserId.firstName}{" "}
                        {item.requestUserId.lastName}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Button
                          buttonStyle={{ borderRadius: 30 }}
                          type="outline"
                          containerStyle={{ width: "47%", height: "100%" }}
                          title={"Từ chối"}
                          onPress={() =>
                            handleRejectRequest(item.requestUserId._id)
                          }
                        />
                        <Button
                          buttonStyle={{ borderRadius: 30 }}
                          containerStyle={{ width: "47%", height: "100%" }}
                          title={"Chấp nhận"}
                          onPress={() =>
                            handleAcceptRequest(item.requestUserId._id)
                          }
                        />
                      </View>
                    </View>
                  </Pressable>
                )}
              />
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default TripRequestReceivedList;

const styles = StyleSheet.create({});
