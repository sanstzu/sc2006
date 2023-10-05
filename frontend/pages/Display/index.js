import { Button, StyleSheet, Text, View } from "react-native";

const name = "DisplayPage";

const options = {
  title: "Display Page",
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
