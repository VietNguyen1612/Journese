import { CheckBox, Dialog, Image } from "@rneui/themed";
import React, {
  Dispatch,
  ReactComponentElement,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { View, Text, Alert, Pressable, Dimensions, Modal } from "react-native";
import { addPlaceToTrip, useAllTrip } from "../../api/trip";
import { useAuthStore } from "../../store";
import { Loading } from "../Loading";
import { SuccessAnimation } from "../SuccessAnimation";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { UseQueryResult } from "@tanstack/react-query";
import { Place } from "../../app/(general)/trip-detail";
const { height } = Dimensions.get("window");
interface AddPlaceToTripDialogProps {
  placeId: string;
  placeLongitude: number;
  placeLatitude: number;
  isOpenDialog: boolean;
  setIsOpenDialog: Dispatch<SetStateAction<boolean>>;
}

const AddPlaceToTripDialog = ({
  placeId,
  placeLongitude,
  placeLatitude,
  isOpenDialog,
  setIsOpenDialog,
}: AddPlaceToTripDialogProps) => {
  const authPayload = useAuthStore((state) => state.authPayload);
  const allTripData = useAllTrip(
    authPayload?.user._id,
    authPayload?.tokens.accessToken,
    ["DRAFT", "ON-GOING", "IN-COMING"]
  );
  const [checked, setChecked] = useState<Array<string>>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const toggleDialog = () => {
    setIsOpenDialog(!isOpenDialog);
  };

  const isWithin100Km = (
    location: [number, number],
    listPlace: Array<Place>
  ) => {
    const place = {
      geolocation: {
        coordinates: [placeLongitude, placeLatitude],
      },
    };
    const toRadians = (degree: number) => degree * (Math.PI / 180);

    const calculateDistance = (place1: Place, place2: Place) => {
      const R = 6371; // Radius of the earth in km
      const dLat = toRadians(
        place2.geolocation.coordinates[1] - place1.geolocation.coordinates[1]
      );
      const dLon = toRadians(
        place2.geolocation.coordinates[0] - place1.geolocation.coordinates[0]
      );
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(place1.geolocation.coordinates[1])) *
          Math.cos(toRadians(place2.geolocation.coordinates[1])) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km
      return distance;
    };

    return listPlace.some(
      (item) => calculateDistance(place as Place, item) < 100
    );
  };

  const handleConfirm = async () => {
    let addPlaceToTripData;
    if (authPayload) {
      addPlaceToTripData = await addPlaceToTrip(
        authPayload.user._id,
        authPayload.tokens.accessToken,
        placeId,
        checked
      );
      if (addPlaceToTripData.statusCode === 200) {
        toggleDialog();
        setIsSuccess(true);
      }
    }
  };
  const handleCheck = (item: any) => {
    if (item.places.map((place: any) => place.place_id).includes(placeId)) {
      Alert.alert(
        "Địa điểm đã tồn tại",
        "Địa điểm này đã tồn tại trong chuyến đi"
      );
      return;
    }

    if (checked.includes(item._id)) {
      setChecked(checked.filter((val) => val !== item._id));
    } else {
      if (
        isWithin100Km([placeLongitude, placeLatitude], item.places) ||
        item.places.length === 0
      ) {
        setChecked((prev) => [...prev, item._id]);
      } else {
        Alert.alert(
          "Địa điểm quá xa",
          "Bạn có chắc chắn muốn thêm địa điểm này vào chuyến đi?",
          [
            {
              text: "Đồng ý",
              onPress: () => {
                setChecked((prev) => [...prev, item._id]);
              },
            },
            {
              text: "Hủy",
              style: "cancel",
            },
          ]
        );
      }
    }
  };
  return (
    <>
      <Modal transparent={true} visible={isSuccess}>
        <SuccessAnimation
          isSuccess={true}
          content="Thêm thành công"
          onPress={() => {
            setIsSuccess(false);
          }}
        />
      </Modal>
      <Dialog isVisible={isOpenDialog} onBackdropPress={toggleDialog}>
        {allTripData?.isFetching ? (
          <Dialog.Loading loadingProps={{ size: "large" }} />
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={allTripData?.isFetching}
                onRefresh={allTripData?.refetch}
              />
            }
            showsVerticalScrollIndicator={false}
          >
            {allTripData?.data.map((item: any, index: any) => (
              <Pressable
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 6,
                }}
                onPress={() => handleCheck(item)}
              >
                <CheckBox
                  size={30}
                  containerStyle={{ backgroundColor: "white", borderWidth: 0 }}
                  checked={checked.includes(item._id)}
                  onPress={() => handleCheck(item)}
                />
                <View style={{ flexDirection: "column", gap: 3, width: "70%" }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      color: "#363A33",
                    }}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "500",
                      color: "#979797",
                    }}
                  >
                    Địa điểm: {item.places.length}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}

        <Dialog.Actions>
          <Dialog.Button title="CONFIRM" onPress={handleConfirm} />
          <Dialog.Button title="CANCEL" onPress={toggleDialog} />
        </Dialog.Actions>
      </Dialog>
    </>
  );
};

export default AddPlaceToTripDialog;
