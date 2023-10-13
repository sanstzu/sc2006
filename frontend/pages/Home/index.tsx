import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { RootStackParamList } from "../../App";

export default function Home({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Home">) {
  return (
    <View style={styles.page}>
      <Text>Hello world!</Text>
      <Button
        icon="map"
        mode="contained"
        onPress={() => navigation.navigate("Display")}
      >
        Go to Display
      </Button>
      <Button
        icon="magnify"
        mode="contained"
        onPress={() => navigation.navigate("Search")}
      >
        Go to Search
      </Button>
      <Button
        icon="filter"
        mode="contained"
        onPress={() => navigation.navigate("Filter")}
      >
        Go to FilterPage
      </Button>
      <Button
        icon="car"
        mode="contained"
        onPress={() => navigation.navigate("ParkingInfo")}
      >
        Go to ParkingInfo
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
});