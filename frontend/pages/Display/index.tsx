import { StyleSheet, View } from "react-native";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Card, Text, Button, IconButton } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import BottomSheet from "../../components/BottomSheet";
import BottomSheetElement from "@gorhom/bottom-sheet";
import useParkingStore from "../../store/useParkingStore";
import {
  MotorizedPark,
  MotorizedParkWithPrice,
  Park,
} from "../../types/parking";
import { useAxios } from "../../hooks/useAxios";
import useQueryStore from "../../store/useQueryStore";

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

interface MotorizedSearch extends MotorizedPark {
  price: string;
}

export default function Display() {
  const isFocused = useIsFocused();
  const parking = useParkingStore.useParking();
  const vehicleType = useQueryStore.useVehicleType();
  const axios = useAxios();
  const setParking = useParkingStore.useSetParking();
  const removeParking = useParkingStore.useRemoveParking();

  const [coordRange, setCoordRange] = useState<{
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
    zoom?: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [nearbyPark, setNearbyPark] = useState<MotorizedSearch[]>([]);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const testRef = useRef(null);

  const mapRef = useRef<MapView>(null);

  // Clears the parking store on each page load
  useEffect(() => {
    removeParking();
  }, [isFocused]);

  // Retrieves the user current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let locationTmp = await Location.getCurrentPositionAsync({});

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

      const resp = await axios.get("/parking/motorized/search", {
        params: reqParams,
      });

      setNearbyPark(resp.data.data);
    })();
  }, [isFocused, parking]);

  // Retrieves the parking location and animates the map to it
  useEffect(() => {
    if (parking) {
      mapRef?.current?.animateToRegion(
        {
          latitude: parking.coordinate.latitude ?? 0,
          longitude: parking.coordinate.longitude ?? 0,
          longitudeDelta: 0.02,
          latitudeDelta: 0.02,
        },
        0
      );
    }
  }, [parking]);

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
      })();
    }
  }, [nearbyPark]);

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
  }, [coordRange]);

  return (
    <View style={styles.page}>
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
                    setParking(park);
                  }}
                >
                  <Card
                    contentStyle={{
                      width: 200,
                      zIndex: 90,
                    }}
                    elevation={5}
                  >
                    <Card.Title title={park.name} />
                    <Card.Content
                      style={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View>
                        <Text>Price: ${park.price}</Text>
                        <Text>Available Lots: {park.availableLots}</Text>
                      </View>

                      <IconButton icon="chevron-right" />
                    </Card.Content>
                  </Card>
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
      <BottomSheet
        index={0}
        onChange={handleSheetChanges}
        title="Parking Details"
        hideOpening={parking !== null}
      >
        {/* To be filled */}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
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

  bottomSheetHeader: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    fontWeight: "bold",
  },
  bottomSheetContent: {
    borderWidth: 1,
    borderColor: "#d4d4d4",
    height: 1,
    width: "100%",
  },
});
