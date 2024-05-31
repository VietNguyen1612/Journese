import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  Pressable,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  IconExclamationMark,
  IconHeart,
  IconHeartFilled,
  IconPencil,
  IconX,
} from "tabler-icons-react-native";
import {
  Avatar,
  Chip,
  Divider,
  Image,
  makeStyles,
  useTheme,
} from "@rneui/themed";
// import { GetAllComments, addComment, useQueryComments } from "../../api";
import { router } from "expo-router";
import { AuthPayload, AuthUser, useAuthStore } from "../../store";
import SwiperFlatList from "react-native-swiper-flatlist";
import { FlatList } from "react-native";
import { deletePost, likePost } from "../../api/post";
import { SuccessAnimation } from "../SuccessAnimation";
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
  isDeleted: boolean;
};

const tablet = Dimensions.get("window").width > 640 ? true : false;

export const UserPost = (props: { post: Post; refetch: () => void }) => {
  const { theme } = useTheme();
  const styles = useStyles();
  const [isLike, setIsLike] = useState(false);
  const [likeNumber, setLikeNumber] = useState<number>(0);
  const { authPayload } = useAuthStore();
  const [numberOfLines, setNumberOfLines] = useState<number>(4);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handleDelete = () => {
    Alert.alert("Thông báo", "Bạn có chắc chắn muốn xóa bài viết này?", [
      {
        text: "Xác nhận",
        style: "destructive",
        onPress: async () => {
          await deletePost(
            authPayload?.user._id!,
            authPayload?.tokens.accessToken!,
            props.post._id
          );
          setIsSuccess(true);
          props.refetch();
          setTimeout(() => {
            setIsSuccess(false);
          }, 2000);
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
            onPress={() => setIsSuccess(false)}
            content="Xoá thành công!"
            isSuccess
          />
        </Modal>
      )}
      <View>
        <View style={styles.container}>
          <View
            style={{
              width: "100%",
              justifyContent: "flex-end",
              paddingHorizontal: 12,
              paddingTop: 12,
              flexDirection: "row",
              gap: 12,
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
                <IconHeartFilled size={30} color="red" />
              ) : (
                <IconHeart
                  size={30}
                  color={authPayload ? theme.colors.grey3 : theme.colors.grey4}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
              }}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/(profile)/edit-post",
                  params: { postId: props.post._id },
                })
              }
            >
              <IconPencil size={30} color={theme.colors.grey3} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
              }}
              onPress={() => handleDelete()}
            >
              <IconX size={30} color={theme.colors.grey3} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: theme.colors.grey4,
              marginBottom: 8,
              marginTop: 5,
            }}
          />
          {props.post.isDeleted && (
            <Chip
              type="outline"
              title="Bài viết vi phạm quy chuẩn cộng đồng"
              containerStyle={{ paddingVertical: 5, paddingHorizontal: 5 }}
              titleStyle={{ color: theme.colors.brand.red[600] }}
              buttonStyle={{ borderColor: theme.colors.brand.red[600] }}
            />
          )}
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
                      : (width * 13) / 15,
                  aspectRatio: 1,
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
          <View style={styles.headerContainer}>
            <View style={styles.contentContainer}>
              <Text numberOfLines={numberOfLines} style={styles.content}>
                {props.post.content}
              </Text>
              <Pressable
                style={{
                  paddingVertical: 5,
                }}
                onPress={() => setNumberOfLines((pre) => (pre ? 0 : 4))}
              >
                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: 16,
                  }}
                >
                  {numberOfLines ? "Xem thêm" : "Thu gọn"}
                </Text>
              </Pressable>
            </View>
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
    paddingBottom: 10,
    shadowRadius: 3,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    borderWidth: 0.2,
    borderColor: theme.colors.grey5,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 4,
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
