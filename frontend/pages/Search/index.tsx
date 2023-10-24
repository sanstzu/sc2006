import { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, SafeAreaView } from "react-native";
import SearchHeader from "../../components/SearchHeader";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { Divider, List, Text, useTheme } from "react-native-paper";

export const name = "SearchPage";

export const options = {
  title: "Search",
};

type Place = {
  name: string;
  address: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
};

type PlaceQuery = {
  name: string;
  latitude: null | number;
  longitude: null | number;
};

export default function Search({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Search">) {
  const theme = useTheme();

  const [placeQuery, setPlaceQuery] = useState<PlaceQuery>(INITIAL_PLACE_QUERY);
  const [placeSuggestions, setPlaceSuggestions] =
    useState<Array<Place>>(samplePlaces);

  useEffect(() => {
    if (placeQuery.latitude === null && placeQuery.longitude === null) {
      // fetch API for a list of place suggestion
      setPlaceSuggestions(samplePlaces);
    } else {
      setPlaceSuggestions([]);
    }
  }, [placeQuery]);

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.header}>
        <SearchHeader
          value={placeQuery.name}
          onChangeText={(query: string) =>
            setPlaceQuery({ name: query, latitude: null, longitude: null })
          }
          onPressFilter={() => navigation.navigate("Filter")}
        />
      </View>
      <ScrollView style={styles.list}>
        {placeSuggestions.map((place, ii) => (
          <>
            <List.Item
              key={place.name}
              title={place.name}
              description={place.address}
              right={() => <Text>{place.distanceKm.toFixed(2)} km</Text>}
              onPress={() =>
                setPlaceQuery({
                  name: place.name,
                  latitude: place.latitude,
                  longitude: place.longitude,
                })
              }
            />
            {ii < placeSuggestions.length - 1 && <Divider />}
          </>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  header: {
    width: "100%",
    padding: 8,
    gap: 8,
  },
  list: {
    width: "100%",
  },
});

const INITIAL_PLACE_QUERY: PlaceQuery = {
  name: "",
  latitude: null,
  longitude: null,
};

const samplePlaces: Array<Place> = [
  {
    name: "Jurong Point",
    address: "1 Jurong West Central 2",
    distanceKm: 0.251333333,
    latitude: 0,
    longitude: 1,
  },
  {
    name: "Westgate",
    address: "3 Gateway Drive",
    distanceKm: 5.314111111,
    latitude: 1,
    longitude: 0.78,
  },
];
