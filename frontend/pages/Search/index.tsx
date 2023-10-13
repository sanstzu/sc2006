import { Button, StyleSheet, Text, View } from "react-native";

export const name = "SearchPage";

export const options = {
  title: "Search",
};

export default function Search() {
  return (
    <View style={styles.page}>
      <Text>Hello world!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: "center", justifyContent: "center" },
});
