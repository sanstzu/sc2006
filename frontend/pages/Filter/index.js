import { Button, StyleSheet, Text, View } from "react-native";

const name = "FilterPage";

const options = {
  title: "Filter Page",
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
