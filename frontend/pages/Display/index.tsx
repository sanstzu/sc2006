import { Button, StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Text } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import BottomSheet from "../../components/BottomSheet";
import BottomSheetElement from "@gorhom/bottom-sheet";

export default function Display() {
  const isFocused = useIsFocused();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let locationTmp = await Location.getCurrentPositionAsync({});
      setLocation(locationTmp);
    })();
  }, [isFocused]);

  return (
    <View style={styles.page}>
      {location && (
        <MapView
          style={styles.map}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={true}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: location?.coords.latitude ?? 0,
            longitude: location?.coords.longitude ?? 0,
            longitudeDelta: 0.04,
            latitudeDelta: 0.04,
          }}
        >
          <Marker
            title="Test"
            description="Bruh moment"
            coordinate={{
              longitude: location?.coords.longitude ?? 0,
              latitude: location?.coords.latitude ?? 0,
            }}
          />
        </MapView>
      )}

      {/* Bottom sheet */}
      <BottomSheet
        index={0}
        onChange={handleSheetChanges}
        title="Parking Spaces Near Me"
      ></BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "i#ffffff",
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
