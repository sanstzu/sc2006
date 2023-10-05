import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

const name = "HomeScreen";

const options = {
  title: "Home Screen",
};

function component({ navigation }) {
  return (
    <View style={styles.page}>
      <Text>Hello world!</Text>
      <Button
        icon="map"
        mode="contained"
        onPress={() => navigation.navigate("DisplayPage")}
      >
        Go to Display
      </Button>
      <Button
        icon="magnify"
        mode="contained"
        onPress={() => navigation.navigate("SearchPage")}
      >
        Go to Search
      </Button>
      <Button
        icon="filter"
        mode="contained"
        onPress={() => navigation.navigate("FilterPage")}
      >
        Go to FilterPage
      </Button>
      <Button
        icon="car"
        mode="contained"
        onPress={() => navigation.navigate("ParkingInfoPage")}
      >
        Go to ParkingInfo
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
});

export default { name, component, options };
