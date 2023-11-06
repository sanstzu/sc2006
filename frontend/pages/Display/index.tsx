import {
  Button,
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  Text,
} from "react-native";
import useParkingStore from "../../store/useParkingStore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import SearchHeader from "../../components/SearchHeader";

// import { StyleSheet, View, Dimensions, Button, ###Text###, SafeAreaView } from "react-native";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import CalloutComponent from "../../components/Callout";
import { useIsFocused } from "@react-navigation/native";
import BottomSheet from "../../components/BottomSheet";
import BottomSheetElement from "@gorhom/bottom-sheet";
import {
  MotorizedPark,
  MotorizedParkWithPrice,
  Park,
  Price,
} from "../../types/parking";
import { useAxios } from "../../hooks/useAxios";
import useQueryStore from "../../store/useQueryStore";
import ParkingInfo from "../../components/ParkingInfo";
import { useSharedValue } from "react-native-reanimated";

function getShortDayOfWeek(date: Date) {
  return date
    .toLocaleDateString("en-US", {
      weekday: "short",
      timeZone: "Asia/Singapore",
    })
    .substring(0, 3);
}

function getTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function getVehicleCode(vehicleType: string) {
  switch (vehicleType) {
    case "Bicycle":
      return "B";
    case "Car":
      return "C";
    case "Motorcycle":
      return "Y";
    case "Heavy Vehicle":
      return "H";
  }
}

export interface MotorizedSearch extends MotorizedPark {
  priceStr: string;
  // isSingleEntry: boolean;
}

interface CoordinateRange {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
  zoom?: number;
}

interface DisplayProps {
  navigation: NativeStackScreenProps<RootStackParamList, "Display">;
}

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Display({ navigation }: DisplayProps) {
  const isFocused = useIsFocused();
  const axios = useAxios();

  const parking = useParkingStore.useParking();
  const prices = useParkingStore.usePrice();
  const setParking = useParkingStore.useSetParking();
  const setPricings = useParkingStore.useSetPrice();

  const [userLoc, setUserLoc] = useState<Location.LocationObject | null>(null);
  const [coordRange, setCoordRange] = useState<CoordinateRange | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [nearbyPark, setNearbyPark] = useState<MotorizedSearch[]>([]);
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);

  const testRef = useRef(null);
  const mapRef = useRef<MapView>(null);

  const animateToParking = useCallback(() => {
    if (parking) {
      mapRef?.current?.animateToRegion(
        {
          latitude: parking.coordinate.latitude ?? 0,
          longitude: parking.coordinate.longitude ?? 0,
          longitudeDelta: 0.02,
          latitudeDelta: 0.02,
        },
        250
      );
      setBottomSheetIndex(1);
    } else {
      setBottomSheetIndex(-1);
    }
  }, [parking]);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        let locationTmp = await Location.getCurrentPositionAsync({});
        setUserLoc(locationTmp);
      } catch (error) {
        setErrorMsg(`Failed to get location: ${error}`);
      }
    })();
  }, [isFocused, parking]);

  // Retrieves the user current location
  useEffect(() => {
    (async () => {
      let locationTmp = userLoc;
      if (userLoc) {
        // Get current date
        const now = new Date();
        const reqParams = {
          latitude: locationTmp?.coords.latitude ?? 0,
          longitude: locationTmp?.coords.longitude ?? 0,
          day: getShortDayOfWeek(now),
          time: getTime(now),
          order: "distance",
          "vehicle-type": "C",
          "price-start": 0,
          "price-end": 100,
        };

        try {
          const resp = await axios.get("/parking/motorized/search", {
            params: reqParams,
          });

          setNearbyPark(resp.data.data);
        } catch (error) {
          setErrorMsg(`Failed to get from parking backend API: ${error}`);
        }
      }
    })();
  }, [isFocused, parking, userLoc]);

  // Retrieves the parking location and animates the map to it
  useEffect(animateToParking, [animateToParking, parking]);

  // Calculates the minimum and maximum latitude and longitude of the nearby parking with the current locaiton of the user
  useEffect(() => {
    if (parking) {
      // If use have selected parking location, then only displays the parking location
      setCoordRange({
        minLat: parking.coordinate.latitude,
        minLng: parking.coordinate.longitude,
        maxLat: parking.coordinate.latitude,
        maxLng: parking.coordinate.longitude,
      });
    } else {
      (async () => {
        try {
          let locationTmp = await Location.getCurrentPositionAsync({});

          let minLat = locationTmp?.coords.latitude ?? Number.MAX_VALUE;
          let maxLat = locationTmp?.coords.latitude ?? Number.MIN_VALUE;
          let minLng = locationTmp?.coords.longitude ?? Number.MAX_VALUE;
          let maxLng = locationTmp?.coords.longitude ?? Number.MIN_VALUE;

          nearbyPark.forEach((park) => {
            minLat = Math.min(minLat, park.coordinate.latitude);
            maxLat = Math.max(maxLat, park.coordinate.latitude);
            minLng = Math.min(minLng, park.coordinate.longitude);
            maxLng = Math.max(maxLng, park.coordinate.longitude);
          });

          if (nearbyPark.length === 0) {
            setCoordRange(null);
          } else {
            setCoordRange({
              minLat,
              maxLat,
              minLng,
              maxLng,
              zoom: undefined,
            });
          }
        } catch (error) {
          setErrorMsg(`Failed to get current location/position: ${error}`);
        }
      })();
    }
  }, [nearbyPark, parking]);

  // Animate to region where all parking are visible
  useEffect(() => {
    if (nearbyPark.length > 0 && coordRange) {
      mapRef?.current?.animateToRegion(
        {
          latitude: (coordRange.minLat + coordRange.maxLat) / 2,
          longitude: (coordRange.minLng + coordRange.maxLng) / 2,
          latitudeDelta:
            ((coordRange.maxLat - coordRange.minLat) * 1.2 + 0.005) *
            (coordRange.zoom ?? 1),
          longitudeDelta:
            ((coordRange.maxLng - coordRange.minLng) * 1.2 + 0.005) *
            (coordRange.zoom ?? 1),
        },
        500
      );
    }
  }, [coordRange, nearbyPark]);

  const onSelectParking = async (park: MotorizedSearch) => {
    // fetches park
    try {
      const resp = await axios.get(`/parking/motorized/${park.id}`, {
        params: {
          longitude: userLoc?.coords.longitude,
          latitude: userLoc?.coords.latitude,
        },
      });

      const prices: Price[] = resp.data.data.prices;

      setParking(park);
      setPricings(prices);
    } catch (error) {
      setErrorMsg(`Failed to get motorized parking details: ${error}`);
    }
  };

  return (
    <SafeAreaView style={styles.page}>
      <SearchHeader navigation={navigation} />
      <MapView
        style={styles.map}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
      >
        {!parking ? (
          nearbyPark.map((park, idx) => {
            return (
              <Marker
                key={idx}
                title={park.name}
                coordinate={{
                  longitude: park.coordinate.longitude,
                  latitude: park.coordinate.latitude,
                }}
                ref={idx === 0 ? testRef : null}
              >
                <Callout
                  tooltip={true}
                  alphaHitTest={true}
                  style={{
                    zIndex: 100,
                  }}
                  onPress={() => {
                    onSelectParking(park);
                  }}
                >
                  <CalloutComponent park={park} />
                </Callout>
              </Marker>
            );
          })
        ) : (
          <Marker
            title={parking.name}
            coordinate={{
              longitude: parking.coordinate.longitude,
              latitude: parking.coordinate.latitude,
            }}
          ></Marker>
        )}
      </MapView>

      {/* Bottom sheet */}
      {parking && (
        <BottomSheet
          index={bottomSheetIndex}
          title="Parking Details"
          contentStyle={{
            flex: 1,
            width: SCREEN_WIDTH,
          }}
        >
          <ParkingInfo
            park={parking}
            price={prices}
            onLocationPress={animateToParking}
            onParkingRemove={() => {
              setBottomSheetIndex(-1);
            }}
          />
        </BottomSheet>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  search: {
    zIndex: 5,
  },
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    paddingTop: 12,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
