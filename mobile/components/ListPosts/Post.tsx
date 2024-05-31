import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  IconExclamationMark,
  IconHeart,
  IconHeartFilled,
} from "tabler-icons-react-native";
import { Avatar, Image, makeStyles, useTheme } from "@rneui/themed";
// import { GetAllComments, addComment, useQueryComments } from "../../api";
import { router } from "expo-router";
import { AuthUser, useAuthStore } from "../../store";
import { FlatList } from "react-native";
import { likePost } from "../../api/post";
import { SuccessAnimation } from "../SuccessAnimation";
import axios from "axios";
const { width, height } = Dimensions.get("window");

type Post = {
  _id: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  images: string[];
  liked: string[];
  isPublished: boolean;
  userId: AuthUser;
};

const tablet = Dimensions.get("window").width > 640 ? true : false;

export const Post = (props: { post: Post }) => {
  const { theme } = useTheme();
  const styles = useStyles();
  const [isLike, setIsLike] = useState(false);
  const [likeNumber, setLikeNumber] = useState<number>(0);
  const { authPayload } = useAuthStore();
  const [isSuccess, setIsSucces] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (props.post.liked.includes(authPayload?.user._id as string)) {
      setIsLike(true);
    }
    setLikeNumber(props.post.liked.length);
  }, []);

  const handleLike = async () => {
    if (authPayload) {
      if (isLike) {
        setIsLike(false);
        setLikeNumber((pre) => pre - 1);
        await likePost(
          authPayload?.user._id!,
          authPayload?.tokens.accessToken!,
          props.post._id,
          "unlike"
        );
      } else {
        setIsLike(true);
        setLikeNumber((pre) => pre + 1);
        await likePost(
          authPayload?.user._id!,
          authPayload?.tokens.accessToken!,
          props.post._id,
          "like"
        );
      }
    } else {
      Alert.alert("Thông báo", "Bạn cần đăng nhập để thực hiện chức năng này", [
        {
          text: "Đăng nhập",
          onPress: () => router.push("/(auth)/sign-in"),
        },
        {
          text: "Hủy",
          style: "cancel",
        },
      ]);
    }
  };

  const handleReport = () => {
    Alert.alert("Báo cáo", "Bạn có muốn báo cáo bài viết này không?", [
      {
        text: "Báo cáo",
        onPress: async () => {
          const reportData = {
            type: "Post",
            targetEntityId: props.post._id,
          };

          const res = await axios.post(
            `${process.env.EXPO_PUBLIC_BACKEND_API}/report`,
            reportData,
            {
              headers: {
                "x-client-id": authPayload?.user._id,
                authorization: authPayload?.tokens.accessToken,
                "Content-Type": "application/json",
              },
            }
          );

          if (res.data["statusCode"] == 200) {
            setIsSucces(true);
            setTimeout(() => {
              setIsSucces(false);
            }, 1500);
          } else {
            Alert.alert("Lỗi", "Có lỗi xảy ra");
          }
        },
      },
      {
        text: "Hủy",
        style: "cancel",
      },
    ]);
  };

  return (
    <>
      {isSuccess && (
        <Modal transparent={true} visible={isSuccess}>
          <SuccessAnimation
            onPress={() => setIsSucces(false)}
            content="Báo cáo thành công!"
            isSuccess
          />
        </Modal>
      )}
      <View>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.informationContainer}>
              <Avatar
                source={{
                  uri: props.post.userId.avatarUrl,
                }}
                size={44}
                rounded
              />
              <View style={styles.nameContainer}>
                <Text style={styles.username}>
                  {props.post.userId.firstName} {props.post.userId.lastName}
                </Text>
                <Text style={styles.createdDate}>
                  {new Date(
                    props.post.updatedAt as string
                  ).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <View style={styles.contentContainer}>
              <Text numberOfLines={isExpanded ? 0 : 4} style={styles.content}>
                {props.post.content}
              </Text>
              <Pressable
                style={{
                  paddingVertical: 5,
                }}
                onPress={() => setIsExpanded((pre) => !pre)}
              >
                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: 16,
                  }}
                >
                  {isExpanded ? "Thu gọn" : "Xem thêm"}
                </Text>
              </Pressable>
            </View>
          </View>
          <FlatList
            scrollEnabled={props.post.images.length > 1 ? true : false}
            contentContainerStyle={{ gap: 5 }}
            showsHorizontalScrollIndicator={false}
            horizontal
            data={props.post.images}
            renderItem={({ item }) => (
              <View
                style={{
                  width:
                    props.post.images.length > 1
                      ? (width * 3) / 5
                      : (width * 14) / 15,
                  aspectRatio: 5 / 6,
                }}
              >
                <Image
                  style={{ width: "100%", height: "100%", borderRadius: 10 }}
                  source={{
                    uri: item,
                  }}
                />
              </View>
            )}
          />
          <View
            style={{
              position: "absolute",
              top: 16,
              width: "100%",
              justifyContent: "flex-end",
              paddingHorizontal: 16,
              flexDirection: "row",
              gap: 10,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
              }}
              onPress={() => handleLike()}
            >
              <Text
                style={{
                  color: isLike ? "red" : theme.colors.grey3,
                  fontWeight: "500",
                  fontSize: 15,
                }}
              >
                {likeNumber}
              </Text>
              {isLike ? (
                <IconHeartFilled size={32} color="red" />
              ) : (
                <IconHeart
                  size={32}
                  color={authPayload ? theme.colors.grey3 : theme.colors.grey4}
                />
              )}
            </TouchableOpacity>
            {authPayload && authPayload.user._id !== props.post.userId._id && (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  gap: 5,
                  alignItems: "center",
                  borderWidth: 0.2,
                  borderColor: theme.colors.grey3,
                }}
                onPress={() => handleReport()}
              >
                <IconExclamationMark size={32} color={theme.colors.grey3} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: "white",
    marginVertical: 8,
    borderRadius: 8,
    marginHorizontal: width / 30,
    paddingBottom: 10,
    shadowRadius: 3,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 3,
      height: 3,
    },
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  informationContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  nameContainer: {
    gap: 4,
    marginLeft: 12,
    width: "60%",
  },
  username: {
    fontSize: tablet ? 24 : 18,
    fontWeight: "600",
  },
  createdDate: {
    color: theme.colors.grey3,
    fontSize: 15,
  },
  contentContainer: {
    marginTop: 8,
  },
  content: {
    fontSize: 15,
  },
  actionContainer: {
    width: "33%",
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: tablet ? 13 : 7,
  },
}));
