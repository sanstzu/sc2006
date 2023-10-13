import { Button, StyleSheet, Text, View } from "react-native";

export const name = "ParkingInfoPage";

export const options = {
  title: "ParkingInfo",
};

export default function ParkingInfo() {
  return (
    <View style={styles.page}>
      <Text>Hello world!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: "center", justifyContent: "center" },
});
