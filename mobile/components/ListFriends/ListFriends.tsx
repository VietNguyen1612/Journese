import { Dimensions, FlatList, Text, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import { Avatar, Card, makeStyles } from "@rneui/themed";
import { ScrollView } from "react-native-gesture-handler";
import { AuthUser, useAuthStore } from "../../store";
const profile_image = require("../../assets/images/profile-image.jpeg");

interface ListFriendsProps {
  onPress?: (user: AuthUser) => void;
  friends: Array<AuthUser> | undefined;
}

export const ListFriends: FC<ListFriendsProps> = ({ onPress, friends }) => {
  const authPayload = useAuthStore((state) => state.authPayload);
  const styles = useStyles();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ paddingBottom: 16 }}
        scrollEnabled={false}
        data={friends}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={onPress ? () => onPress(item) : () => {}}>
            <Card
              wrapperStyle={styles.cardContainer}
              containerStyle={{ borderRadius: 10 }}
            >
              <Avatar
                rounded
                size={50}
                source={
                  item?.avatarUrl ? { uri: item?.avatarUrl } : profile_image
                }
              />
              <Text style={styles.text}>
                {item.firstName} {item.lastName}
              </Text>
            </Card>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
};

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
  },
}));
