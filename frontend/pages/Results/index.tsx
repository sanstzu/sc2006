import { Dimensions, Button, StyleSheet, Text, View } from "react-native";
import { IconButton } from "react-native-paper";
import ResultsList from "../../components/ResultsList";

export const name = "Results";

export const options = {
  title: "Results",
};

const screenWidth = Dimensions.get('window').width;

export default function Results() {
  return (
    <View style={styles.page}>
      <View style={[
        styles.container,
            {                
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: "flex-start",
                width: screenWidth,
                borderBottomColor: "#CBD5E1",
                borderBottomWidth: 1,
                paddingHorizontal: 16,
                paddingBottom: 8,
                paddingTop: 8,
                gap: 12,
            },
        ]}>
            <IconButton
                icon="parking"
                size={32}
            />                
            <Text style={[styles.titleText]}>Parking Spaces</Text>
      </View>
      <View style={{flex: 1, paddingBottom: 25}}>
        <ResultsList data={[
          {type: "Bicycle", name: "Plaza Singapura", distance: 167.7334650825399},
          {type: "Car", name: "Plaza Singapura", address: "68 Orchard Rd", availableLots: 686, distance: 1678.7334650825399, price: "1.23"},
          {type: "Car", name: "Plaza Singapura", address: "68 Orchard Rd", availableLots: 686, distance: 1678.7334650825399, price: "1.23"},
          {type: "Car", name: "Plaza Singapura", address: "68 Orchard Rd", availableLots: 686, distance: 1678.7334650825399, price: "1.23"},
          {type: "Car", name: "Plaza Singapura", address: "68 Orchard Rd", availableLots: 686, distance: 1678.7334650825399, price: "1.23"},
          {type: "Car", name: "Plaza Singapura", address: "68 Orchard Rd", availableLots: 686, distance: 1678.7334650825399, price: "1.23"},
          {type: "Car", name: "Plaza Singapura", address: "68 Orchard Rd", availableLots: 686, distance: 1678.7334650825399, price: "1.23"},
          {type: "Car", name: "Plaza Singapura", address: "68 Orchard Rd", availableLots: 686, distance: 1678.7334650825399, price: "1.23"},
          {type: "Car", name: "Plaza Singapura", address: "68 Orchard Rd", availableLots: 686, distance: 1678.7334650825399, price: "1.23"},
          {type: "Car", name: "Plaza Singapura", address: "68 Orchard Rd", availableLots: 686, distance: 1678.7334650825399, price: "1.23"},
          {type: "Car", name: "Plaza Singapura", address: "68 Orchard Rd", availableLots: 686, distance: 1678.7334650825399, price: "1.23"},
        ]}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: "center", justifyContent: "flex-start", backgroundColor: "#FFF"},
  container: {
      display: "flex",
  },
  titleText: {
      fontSize: 32,
      fontWeight: "700",
      color: "#000",
  },
});
