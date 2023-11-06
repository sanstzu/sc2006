import {
  Button,
  Divider,
  IconButton,
  SegmentedButtons,
  Surface,
  Text,
  Tooltip,
} from "react-native-paper";
import { View, Linking, Platform } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
  BicyclePark,
  MotorizedPark,
  MotorizedParkWithPrice,
  Price,
} from "../../types/parking";
import { useCallback, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { TimeToNumber, formatTime } from "../../utils/date";
import useParkingStore from "../../store/useParkingStore";

type ParkingInfoProps = {
  park: BicyclePark | MotorizedPark;
  price: Price[] | null;

  onLocationPress?: () => void;
  onParkingRemove?: () => void;
};

function ParkingInfo({
  park,
  price,
  onLocationPress,
  onParkingRemove,
}: ParkingInfoProps) {
  const now = new Date();
  const nowTime = (now.getTime() % (24 * 60 * 60 * 1000)) / 1000;
  const nowDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    now.getDay()
  ] as Price["day"];

  const [day, setDay] = useState<Price["day"]>(nowDay);
  const removeParking = useParkingStore.useRemoveParking();

  const openAddressOnMap = (label: string, lat: number, lng: number) => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${lat},${lng}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url ?? "");
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        paddingHorizontal: 24,
        paddingVertical: 16,
        width: "100%",
        gap: 8,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          width: "100%",
        }}
      >
        <Icon
          name={
            park.type === "Car"
              ? "car"
              : park.type === "Heavy"
              ? "truck"
              : park.type === "Motor"
              ? "motorcycle"
              : "bicycle"
          }
          size={25}
          color="#475569"
          style={{ marginRight: 8 }}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            display: "flex",
            justifyContent: "flex-start",
            gap: -4,
          }}
        >
          <Text
            variant="titleMedium"
            ellipsizeMode="tail"
            numberOfLines={1}
            style={{
              flex: 1,
              margin: 0,
            }}
          >
            {park.name}
          </Text>
          <Text
            variant="titleSmall"
            ellipsizeMode="tail"
            numberOfLines={1}
            style={{
              flex: 1,
              color: "gray",
            }}
          >
            {park.type === "Bicycle"
              ? `Available racks: ${park.rackCount}`
              : `Available lots: ${park.availableLots}`}
          </Text>
        </View>
        {park.distance && (
          <Text variant="bodyMedium">
            {park.distance >= 1000
              ? `${(park.distance / 1000).toFixed(1)} km`
              : `${park.distance.toFixed(0)} m`}
          </Text>
        )}
      </View>
      <View
        style={{
          marginLeft: -8,
          flex: 1,
          flexDirection: "row",
          gap: 8,
        }}
      >
        <Tooltip title="Go to Location">
          <IconButton
            icon="map-marker-right"
            mode="contained"
            onPress={onLocationPress}
          />
        </Tooltip>
        <Tooltip title="Show Route">
          <IconButton icon="directions" mode="contained"></IconButton>
        </Tooltip>
        <Tooltip title="Show on Google Maps">
          <IconButton
            icon="google-maps"
            mode="contained"
            onPress={() => {
              openAddressOnMap(
                park.name,
                park.coordinate.latitude,
                park.coordinate.longitude
              );
            }}
          ></IconButton>
        </Tooltip>
        <Tooltip title="Cancel">
          <IconButton
            icon="close"
            mode="outlined"
            onPress={() => {
              removeParking();
              if (onParkingRemove) onParkingRemove();
            }}
          ></IconButton>
        </Tooltip>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Divider style={{ width: SCREEN_WIDTH, marginVertical: 8 }} />
        {price ? (
          <>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ width: "100%" }}
            >
              <SegmentedButtons
                value={day}
                onValueChange={(value) => {
                  setDay(value as Price["day"]);
                }}
                density="medium"
                buttons={[
                  { label: "Mon", value: "Mon" },
                  { label: "Tue", value: "Tue" },
                  { label: "Wed", value: "Wed" },
                  { label: "Thu", value: "Thu" },
                  { label: "Fri", value: "Fri" },
                  { label: "Sat", value: "Sat" },
                  { label: "Sun", value: "Sun" },
                ]}
              />
            </ScrollView>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 8,
                marginTop: 8,
                width: "100%",
              }}
            >
              {price
                .filter((p) => p.day === day)
                .map((p, idx) => {
                  return (
                    <View
                      key={idx}
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: -16,
                      }}
                    >
                      <Text
                        style={{
                          color:
                            TimeToNumber(p.startTime) <= nowTime &&
                            TimeToNumber(p.endTime) >= nowTime &&
                            p.day === nowDay
                              ? "#3B82F6"
                              : "black",
                        }}
                      >
                        {formatTime(p.startTime)}—{formatTime(p.endTime)}: &#9;$
                        {p.price}/{p.isSingleEntry ? "entry" : "hr"}
                      </Text>
                    </View>
                  );
                })}
            </View>
          </>
        ) : (
          <Text variant="titleSmall" style={{ color: "gray" }}>
            No pricing information is available
          </Text>
        )}
      </View>
    </View>
  );
}

export default ParkingInfo;
