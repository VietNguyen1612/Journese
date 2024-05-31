import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Card, Image, useTheme } from "@rneui/themed";
import {
  FlatList,
  RefreshControl,
  ScrollView,
} from "react-native-gesture-handler";
import { useAuthStore } from "../../../store";
import { useNotifications } from "../../../api/user";
import { returnFormattedDate } from "../../../utils/regex";
import { Loading } from "../../../components";
const JourneseIcon = require(`../../../assets/images/journese-icon.png`);
const { width, height } = Dimensions.get("window");

const Notification = () => {
  const { theme } = useTheme();
  const { authPayload } = useAuthStore();
  const { data, isFetching, refetch } = useNotifications(authPayload?.user._id);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: 10,
        paddingTop: 10,
      }}
    >
      {isFetching ? (
        <Loading size={200} />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
          showsVerticalScrollIndicator={false}
        >
          <FlatList
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingBottom: height / 18 }}
            data={data}
            renderItem={({ item }) => (
              <Card key={item._id} wrapperStyle={{ gap: 10, margin: 0 }}>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  {typeof item.senderId?.avatarUrl === "string" ? (
                    <Image
                      style={{
                        height: width / 8,
                        width: width / 8,
                        borderRadius: 99,
                      }}
                      source={{ uri: item.senderId?.avatarUrl }}
                    />
                  ) : (
                    <Image
                      style={{
                        height: width / 8,
                        width: width / 8,
                        borderRadius: 99,
                      }}
                      source={require(`../../../assets/images/journese-icon.png`)}
                    />
                  )}
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: 5,
                    }}
                  >
                    <Text style={{ fontSize: 16, fontWeight: "600" }}>
                      {item.title}
                    </Text>
                    <Text style={{ fontSize: 14, fontWeight: "400" }}>
                      {returnFormattedDate(item.createdAt)}
                    </Text>
                  </View>
                </View>

                <Text>{item.content}</Text>
              </Card>
            )}
          />
        </ScrollView>
      )}
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({});
