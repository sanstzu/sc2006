import { Button, StyleSheet, Text, View } from "react-native";

export const name = "FilterPage";

export const options = {
  title: "Filter Page",
};

export default function Filter() {
  return (
    <View style={styles.page}>
      <Text>Hello world!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: "center", justifyContent: "center" },
});
