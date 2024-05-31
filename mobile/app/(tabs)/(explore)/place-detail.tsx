import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import BackToPreviousPageButton from "../../../components/BackToPreviousPageButton/BackToPreviousPageButton";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import {
  Button,
  Card,
  CheckBox,
  Chip,
  Dialog,
  Image,
  Tab,
  TabView,
  useTheme,
} from "@rneui/themed";
import {
  useGlobalSearchParams,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { usePlaceDetail } from "../../../api/place";
import { Loading } from "../../../components";
import {
  IconClockHour5,
  IconMapPin,
  IconPhone,
} from "tabler-icons-react-native";
import AddPlaceToTripDialog from "../../../components/AddPlaceToTripDialog/AddPlaceToTripDialog";
import { useAuthStore } from "../../../store";
import AnimatedLottieView from "lottie-react-native";
import { StarIcon } from "react-native-heroicons/solid";
import { FlatList } from "react-native-gesture-handler";
const dataFake = {
  place_id: "1",
  name: "Vietnam Museum of Ethnology",
  type: "museum",
  describe: [
    `Bảo tàng Dân tộc học là một trong những bảo tàng ở Hà Nội nhất định nên ghé thăm một lần. Nơi đây có ý nghĩa văn hóa và lịch sử to lớn, rất phù hợp với những du khách đam mê tìm hiểu, khám phá Việt Nam. 
        Bảo tàng rộng 4,5ha, gồm nhiều công trình kiến trúc mới lạ và được ví như một bức tranh thu nhỏ về đồng bào 54 dân tộc tại Việt Nam. Cực nhiều hiện vật được trưng bày tại đây như trang sức, y phục, vũ khí, tôn giáo, nhạc cụ, tín ngưỡng…`,
    `Giá vé Bảo tàng Dân tộc học là 40.000 VNĐ/người. Với sinh viên là 20.000 VNĐ/lượt, với học sinh là 10.000 VNĐ/lượt. Giá vé giảm 50% với người cao tuổi, người khuyết tật nặng và người dân tộc thiểu số. Miễn phí với người khuyết tật nặng đặc biệt và trẻ em dưới 6 tuổi.

        Tại bảo tàng, bạn có thể thuê dịch vụ thuyết minh để tìm hiểu sâu hơn. Giá thuyết minh là 100.000 VNĐ toàn bộ bảo tàng bằng tiếng Việt, 100.000 VNĐ khu trong nhà bằng tiếng Pháp/Anh, 50.000 VNĐ khu trong nhà bằng tiếng Việt và 50.000 VNĐ khu ngoài trời bằng tiếng Việt. `,
    `Bảo tàng trực thuộc Viện Hàn lâm Khoa học xã hội Việt Nam, do nhà nước xây dựng và thuộc hệ thống bảo tàng quốc gia tại nước ta. Khi tìm hiểu các bài giới thiệu về Bảo tàng Dân tộc học, bạn sẽ được biết về lịch sử và quá trình hình thành bảo tàng:

        Từ những năm 80 của thế kỷ XX, khi đất nước vẫn còn khá khó khăn do đang trong thời kỳ hậu chiến, Bảo tàng Dân tộc học được xúc tiến xây dựng.
        Ngày 24/10/1995, bảo tàng được Thủ tướng Chính phủ chính thức ban hành quyết định thành lập.
        Ngày 12/11/1997, nhân sự kiện Hội nghị thượng đỉnh các nước họp tại Hà Nội, bảo tàng đã tổ chức lễ khánh thành với sự góp mặt của Tổng thống Cộng hòa Pháp Jacques Chirac.`,
  ],
  images: [
    "https://lh3.googleusercontent.com/p/AF1QipPvnM9VMBI0A2UUGQ8WUokJ30M9dNoow27lZuXP=s680-w680-h510",
    "http://www.vme.org.vn/modules/frontend/themes/vme.org.vn/assets/images/trungbay1.jpg",
    "http://www.vme.org.vn/modules/frontend/themes/vme.org.vn/assets/images/trungbay3.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkLw9PiM93Z5m2ElGdzvbyqWENikiNkya1NA&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKq_jCgpRfg3GNUDnqRhhMt645o2tMSMJrDQ&usqp=CAU",
  ],
};
const { width, height } = Dimensions.get("window");

const PlaceDetail = () => {
  const router = useRouter();
  const authPayload = useAuthStore((state) => state.authPayload);
  const { place_param } = useLocalSearchParams();
  const placeParamString = place_param ? place_param.toString() : "";
  // console.log(place_param)
  const { data, isFetching, error } = usePlaceDetail(placeParamString);
  // console.log(data)
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [checked, setChecked] = useState(1);
  const { theme } = useTheme();
  // console.log(place_id)

  const toggleDialog = () => {
    setIsOpenDialog(!isOpenDialog);
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {isFetching ? (
        <Loading size={300} />
      ) : (
        <>
          {authPayload !== null && (
            <AddPlaceToTripDialog
              placeId={data.place_id}
              placeLongitude={data.geolocation.coordinates[0]}
              placeLatitude={data.geolocation.coordinates[1]}
              isOpenDialog={isOpenDialog}
              setIsOpenDialog={setIsOpenDialog}
            />
          )}
          {/* <BackToPreviousPageButton color="black" /> */}
          {/* cái này để làm view cho carousel hình */}
          <View style={{ maxHeight: height / 4 }}>
            <SwiperFlatList
              renderAll
              data={data?.images}
              renderItem={({ item }) => (
                <Image
                  resizeMode="cover"
                  style={{ height: height / 3, width: width }}
                  source={{ uri: item }}
                />
              )}
            />
          </View>

          <ScrollView
            style={{ paddingTop: 16, paddingHorizontal: 10 }}
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={{ fontWeight: "600", fontSize: 28, textAlign: "center" }}
            >
              {data.name}
            </Text>
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              contentContainerStyle={{
                marginTop: 10,
                gap: 8,
              }}
              data={data.tags}
              renderItem={({ item }) => (
                <Chip
                  iconRight
                  title={item.name}
                  type="solid"
                  color={theme.colors.brand.primary[50]}
                  containerStyle={{
                    borderColor: theme.colors.brand.primary[100],
                  }}
                  titleStyle={{
                    fontSize: 12,
                    color: theme.colors.brand.primary[500],
                  }}
                />
              )}
            />
            <View
              style={{
                marginTop: 16,
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <Button
                titleStyle={{ fontSize: 14 }}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/(explore)/rating",
                    params: { place_id: `${placeParamString}` },
                  })
                }
                buttonStyle={{ borderRadius: 56 }}
                containerStyle={{ width: "47%" }}
                type="outline"
                title={"Đánh giá"}
              />
              <Button
                titleStyle={{ fontSize: 14 }}
                onPress={toggleDialog}
                buttonStyle={{ borderRadius: 56 }}
                containerStyle={{ width: "47%" }}
                type="solid"
                title={"Thêm vào hành trình"}
              />
            </View>
            <View
              style={{
                marginBottom: 25,
                marginTop: 16,
                borderColor: `${theme.colors.brand.neutral[200]}`,
                borderWidth: 1,
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  paddingHorizontal: 16,
                  borderBottomColor: `${theme.colors.brand.neutral[200]}`,
                }}
              >
                <FlatList
                  contentContainerStyle={{
                    width: (width * 11) / 13,
                    justifyContent: "center",
                    gap: 10,
                    marginBottom: 10,
                    borderBottomWidth: 1.8,
                    borderColor: theme.colors.grey5,
                    maxHeight: height / 20,
                  }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={["Thông tin", "Hình ảnh"]}
                  renderItem={({ item, index }) => (
                    <Pressable
                      key={index}
                      onPress={() => setSelectedIndex(index)}
                      style={{
                        borderBottomColor: theme.colors.brand.primary[500],
                        borderBottomWidth: selectedIndex === index ? 3 : 0,
                        paddingVertical: 10,
                        paddingHorizontal: 22,
                      }}
                    >
                      <Text
                        style={{ fontSize: 16, fontWeight: "600", height: 60 }}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  )}
                />
              </View>
              {selectedIndex === 0 ? (
                <View
                  style={{
                    width: "90%",
                    gap: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <IconMapPin
                      size={24}
                      color={theme.colors.brand.primary[500]}
                    />
                    <Text>{data.address}</Text>
                  </View>

                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <IconClockHour5
                      size={24}
                      color={theme.colors.brand.primary[500]}
                    />
                    <View style={{ flexDirection: "column", gap: 3 }}>
                      {data.operating_hours &&
                        Object.keys(data.operating_hours).map((val, key) => (
                          <View key={key} style={{ flexDirection: "row" }}>
                            <Text>{val}: </Text>
                            <Text>{data.operating_hours[val]}</Text>
                          </View>
                        ))}
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <IconPhone
                      size={24}
                      color={theme.colors.brand.primary[500]}
                    />
                    <Text>
                      {data.phone ? data.phone : "Không có số điện thoại"}
                    </Text>
                  </View>
                  {/* <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <Text>{dataFake.describe[0]}</Text>
                  </View> */}
                </View>
              ) : (
                <View
                  style={{
                    paddingTop: 10,
                    flexWrap: "wrap",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    rowGap: 10,
                    marginBottom: 20,
                  }}
                >
                  {data.images.map((val: string) => (
                    <Image
                      key={val}
                      style={{
                        borderRadius: 5,
                        height: width / 2.2,
                        width: width / 2.2,
                      }}
                      source={{ uri: val }}
                    />
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default PlaceDetail;

const styles = StyleSheet.create({});
