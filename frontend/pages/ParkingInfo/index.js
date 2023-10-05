import { Button, StyleSheet, Text, View } from "react-native";

const name = "ParkingInfoPage";

const options = {
  title: "ParkingInfo",
};

function children() {
  return (
    <View style={styles.page}>
      <Text>Hello world!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: "center", justifyContent: "center" },
});

export default { name, children, options };
