import { Button, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";

export default function Display() {
  const isFocused = useIsFocused();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
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
});
