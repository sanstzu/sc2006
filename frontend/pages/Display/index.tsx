import { Button, StyleSheet, Text, View } from "react-native";
import useParkingStore from "../../store/useParkingStore";

export default function Display() {
  const test = useParkingStore();
  return (
    <View style={styles.page}>
      <Text>Hello world!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: "center", justifyContent: "center" },
});
