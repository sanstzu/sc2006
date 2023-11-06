import { StyleSheet, View, Dimensions } from "react-native";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useState, useEffect, useRef, useCallback } from "react";
import CalloutComponent from "../../components/Callout";
import { useIsFocused } from "@react-navigation/native";
import BottomSheet from "../../components/BottomSheet";

import useParkingStore from "../../store/useParkingStore";
import { BicyclePark, MotorizedPark, Price } from "../../types/parking";
import { useAxios } from "../../hooks/useAxios";
import useQueryStore from "../../store/useQueryStore";
import ParkingInfo from "../../components/ParkingInfo";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import FloatingActionButton from "../../components/FloatingActionButton";
import ErrorDialog from "../../components/ErrorDialog";

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
    timeZone: "Asia/Singapore",
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

export interface MotorizedSearch extends MotorizedPark {
  price: number;
  isSingleEntry: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Display({ navigation }: DisplayProps) {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const axios = useAxios();

  const parking = useParkingStore.useParking();
  const prices = useParkingStore.usePrice();
  const setParking = useParkingStore.useSetParking();
  const setPricings = useParkingStore.useSetPrice();

  const place = useQueryStore.useCoordinate();
  const setPlace = useQueryStore.useSetCoordinate();
  const queryVehicleType = useQueryStore.useVehicleType();

  const [userLoc, setUserLoc] = useState<Location.LocationObject | null>(null);
  const [coordRange, setCoordRange] = useState<CoordinateRange | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [nearbyPark, setNearbyPark] = useState<
    Array<MotorizedSearch | BicyclePark>
  >([]);
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
        setErrorMsg("Failed to get current position/location");
      }
    })();
  }, [isFocused, parking]);

  // Retrieves nearby parking
  useEffect(() => {
    (async () => {
      let locationTmp = userLoc;
      if (userLoc) {
        // Get current date
        if (queryVehicleType === "Bicycle") {
          try {
            const resp = await axios.get("/parking/bicycle/search", {
              params: {
                latitude: locationTmp?.coords.latitude ?? 0,
                longitude: locationTmp?.coords.longitude ?? 0,
              },
            });
            setNearbyPark(resp.data.data.result);
          } catch (error) {
            setErrorMsg("Failed to get bicycle parking from backend API");
          }
        } else {
          const now = new Date();
          const reqParams = {
            latitude: locationTmp?.coords.latitude ?? 0,
            longitude: locationTmp?.coords.longitude ?? 0,
            day: getShortDayOfWeek(now),
            time: getTime(now),
            order: "distance",
            "vehicle-type": getVehicleCode(queryVehicleType),
            "price-start": 0,
            "price-end": 10,
          };

          const resp = await axios.get("/parking/motorized/search", {
            params: reqParams,
          });
          setNearbyPark(resp.data.data.result);
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
      let locationTmp = userLoc;

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
          "vehicle-type": getVehicleCode(queryVehicleType),
        },
      });

      setParking(park);
      setPricings(prices as Array<Price>);
    } catch (error) {
      setErrorMsg(`Failed to get motorized parking details`);
    }
  };

  const onSelectBicycleParking = (park: BicyclePark) => {
    setParking(park);
  };

  return (
    <View
      style={[
        styles.page,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <ErrorDialog
        message={errorMsg ?? ""}
        error={"Error occurred in Display page."}
        visible={(errorMsg && errorMsg !== "") as boolean}
      />
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
                    setPlace({
                      latitude: userLoc?.coords.latitude ?? 0,
                      longitude: userLoc?.coords.longitude ?? 0,
                    });
                    if (queryVehicleType === "Bicycle") {
                      onSelectBicycleParking(park as BicyclePark);
                    } else {
                      onSelectParking(park as MotorizedSearch);
                    }
                  }}
                >
                  <CalloutComponent park={park} />
                </Callout>
              </Marker>
            );
          })
        ) : (
          <>
            <Marker
              title={parking.name}
              coordinate={{
                longitude: parking.coordinate.longitude,
                latitude: parking.coordinate.latitude,
              }}
            />

            <Marker
              title={parking.name}
              coordinate={
                place ?? userLoc?.coords ?? { latitude: 0, longitude: 0 }
              }
              pinColor="#54a2a9"
            />
          </>
        )}
      </MapView>

      {/* Bottom sheet */}
      {parking && (
        <BottomSheet
          index={1}
          title="Parking Details"
          contentStyle={{
            flex: 1,
            width: SCREEN_WIDTH,
          }}
          style={{
            zIndex: 101,
          }}
        >
          <ParkingInfo
            park={parking}
            price={prices}
            onLocationPress={animateToParking}
          />
        </BottomSheet>
      )}
      <FloatingActionButton
        visible={isFocused ? (parking ? false : true) : false}
        onFilterPress={() => navigation.navigate("Filter")}
        onMapSearchPress={() => navigation.navigate("Result")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    zIndex: 5,
  },
  page: {
    position: "relative",
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
  rounded: {
    borderRadius: 8,
  },
});
