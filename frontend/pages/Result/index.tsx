import { Button, StyleSheet, Text, View } from "react-native";

export const name = "ResultPage";

export const options = {
  title: "Result",
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
