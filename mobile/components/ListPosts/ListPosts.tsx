import { FlatList, View } from "react-native";
import React, { FC } from "react";
import { Loading } from "../Loading";
import { Post } from "./Post";

export const ListPosts: FC<{ data: any }> = (/* list post */ { data }) => {
  return (
    <View>
      {false ? (
        <Loading size={150} />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          data={data}
          renderItem={({ item }) => <Post post={item} />}
        />
      )}
    </View>
  );
};
