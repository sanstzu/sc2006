import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  BackHandler,
} from "react-native";
import { SegmentedButtons, ThemeProvider } from "react-native-paper";
import { Button } from "react-native-paper";
import { useState } from "react";
import Slider from "@react-native-community/slider";
import useQueryStore, { Sort, Vehicle } from "../../store/useQueryStore";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { filter } from "minimatch";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { query } from "express";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

export const name = "FilterPage";

export const options = {
  title: "Filter Page",
};

interface FilterProps {
  navigation: NativeStackScreenProps<RootStackParamList, "Filter">;
}

export default function Filter({ navigation }: FilterProps) {
  const queryStore = useQueryStore();
  const [filterValue1, setfilterValue1] = useState<Sort>(queryStore.sort);
  const [filterValue2, setfilterValue2] = useState<Vehicle>(
    queryStore.vehicleType
  );
  const [sliderState, setSliderState] = useState<number>(queryStore.price);

  return (
    <View style={styles.page}>
      <Text style={styles.header1}>Sort by</Text>
      <SegmentedButtons
        style={styles.segmentedbuttons1}
        value={filterValue1}
        onValueChange={(value) => setfilterValue1(value as Sort)}
        buttons={[
          {
            value: "Distance",
            label: "Distance",
            onPress: () => {
              setfilterValue1("Distance");
            },
          },
          {
            value: "Price",
            label: "Price",
            onPress: () => {
              setfilterValue1("Price");
            },
            disabled: filterValue2 == "Bicycle" ? true : false,
          },
          {
            value: "Availability",
            label: "Availability",
            onPress: () => {
              setfilterValue1("Availability");
            },
            disabled: filterValue2 == "Bicycle" ? true : false,
          },
        ]}
      />

      <Text
        style={[
          styles.header2,
          { color: filterValue2 == "Bicycle" ? "ghostwhite" : "black" },
        ]}
      >
        Price
      </Text>
      <Slider
        style={styles.slider}
        thumbTintColor="lightskyblue"
        value={sliderState}
        onValueChange={setSliderState}
        minimumValue={0}
        maximumValue={5}
        step={0.5}
        minimumTrackTintColor="#00BFFF"
        maximumTrackTintColor="#FFFFFF"
        disabled={filterValue2 == "Bicycle" ? true : false}
      />
      <Text
        style={[
          styles.price,
          { color: filterValue2 == "Bicycle" ? "ghostwhite" : "black" },
        ]}
      >
        {" "}
        ${sliderState.toPrecision(3)}{" "}
      </Text>

      <Text style={styles.header3}>Vehicle</Text>

      <SegmentedButtons
        style={styles.segmentedbuttons2}
        value={filterValue2}
        onValueChange={(value) => setfilterValue2(value as Vehicle)}
        buttons={[
          {
            value: "Bicycle",
            icon: "bicycle",
            onPress: () => {
              setfilterValue2("Bicycle"), setfilterValue1("Distance");
            },
          },
          {
            value: "Car",
            icon: "car",
            onPress: () => {
              setfilterValue2("Car");
            },
          },
          {
            value: "Motorcycle",
            icon: "motorbike",
            onPress: () => {
              setfilterValue2("Motorcycle");
            },
          },
          {
            value: "Heavy Vehicle",
            icon: "truck",
            onPress: () => {
              setfilterValue2("Heavy Vehicle");
            },
          },
        ]}
      />

      <Button
        mode="outlined"
        style={styles.clearbutton}
        textColor="black"
        onPress={() => {
          setfilterValue1("Distance"),
            setfilterValue2("Car"),
            setSliderState(5);
        }}
      >
        Clear
      </Button>

      <Button
        mode="contained"
        style={styles.applybutton}
        buttonColor="lightskyblue"
        textColor="black"
        onPress={() => {
          queryStore.setSort(filterValue1);
          queryStore.setVehicleType(filterValue2);
          queryStore.setPrice(sliderState);
          navigation.goBack();
        }}
      >
        Apply
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header1: {
    color: "black",
    fontSize: 20,
    justifyContent: "space-between",
    position: "absolute",
    top: 50,
  },
  header2: {
    color: "black",
    fontSize: 20,
    justifyContent: "space-between",
    position: "absolute",
    top: 200,
  },
  header3: {
    color: "black",
    fontSize: 20,
    justifyContent: "space-between",
    position: "absolute",
    top: 350,
  },
  segmentedbuttons1: {
    textColor: "blue",
    checkedColor: "lightskyblue",
    uncheckedColor: "black",
    position: "absolute",
    alignItems: "center",
    justifyContent: "space-evenly",
    fontSize: 10,
    top: 100,
    width: "90%",
  },
  segmentedbuttons2: {
    textColor: "blue",
    checkedColor: "lightskyblue",
    uncheckedColor: "black",
    position: "absolute",
    alignItems: "center",
    justifyContent: "space-evenly",
    fontSize: 10,
    top: 400,
    width: "90%",
  },
  clearbutton: {
    position: "absolute",
    left: 75,
    bottom: 125,
  },
  applybutton: {
    position: "absolute",
    right: 75,
    bottom: 125,
  },
  slider: {
    position: "absolute",
    width: 200,
    height: 40,
    top: 250,
  },
  price: {
    position: "absolute",
    top: 290,
  },
});
