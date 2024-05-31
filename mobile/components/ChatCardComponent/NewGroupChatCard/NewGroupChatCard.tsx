import { Text, View, Pressable } from "react-native";
import React, { useState } from "react";
import { Avatar, makeStyles } from "@rneui/themed";
import { TouchableOpacity } from "react-native-gesture-handler";

interface NewGroupChatCardProps {
  avatarURI: string;
  size: number;
  user?: string;
  isSelected?: boolean;
}

export const NewGroupChatCard = (props: NewGroupChatCardProps) => {
  const { size, avatarURI } = props;
  const styles = useStyles();

  return (
    <TouchableOpacity style={styles.wrapper}>
      <View style={styles.container}>
        <Avatar size={size} source={{ uri: avatarURI }} rounded />
        <View style={styles.contentContainer}>
          <View style={styles.contentWrapper}>
            <Text style={styles.contentText}>{props.user}</Text>
          </View>
        </View>
        <View style={styles.iconContainer}>
          <View style={styles.iconBorder}>
            {props.isSelected && <View style={styles.icon} />}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: "100%",
    flexDirection: "column",
  },
  container: {
    flexDirection: "row",
    paddingVertical: 4,
    alignItems: "center",
    gap: 15,
  },
  contentContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 12,
  },
  contentWrapper: {
    width: 232,
    alignItems: "flex-start",
    alignSelf: "stretch",
  },
  contentText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.black,
  },
  iconContainer: {
    alignItems: "center",
    gap: 8,
  },
  iconBorder: {
    width: 18,
    height: 18,
    borderRadius: 50,
    borderColor: theme.colors.brand.primary[500],
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 12,
    height: 12,
    borderRadius: 50,
    backgroundColor: theme.colors.brand.primary[500],
  },
}));
