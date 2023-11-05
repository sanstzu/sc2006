import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import { IconButton, Searchbar, useTheme } from "react-native-paper";
import { RootStackParamList } from "../App";
import { useState } from "react";
import { useAxios } from "../hooks/useAxios";
import ResultsList from "./ResultsList";
import PlacesList, { Place } from "./PlacesList";
import {
  Park,
  MotorizedPark,
  BicyclePark,
  ParkingQuery,
  MotorizedParkWithPrice,
} from "../types/parking";
import useQueryStore from "../store/useQueryStore";
import axios from "axios";
import useParkingStore from "../store/useParkingStore";

interface SearchHeaderProps {
  navigation: NativeStackNavigationProp<RootStackParamList, any, any>;
}

interface SearchQuery {
  name: string;
  place_id?: string;
  latitude?: number;
  longitude?: number;
}

enum SearchState {
  Empty,
  SearchingPlace,
  SearchingParking,
}

export default function SearchHeader({ navigation }: SearchHeaderProps) {
  const theme = useTheme();

  const colors = {
    searchbar: {
      colors: {
        elevation: { level3: "#FFF" }, // backgroundColor
        onSurface: "#64748B", // placeholderTextColor
        onSurfaceVariant: "#64748B", // textColor, iconColor, trailingIconColor
        primary: theme.colors.primary, // selectionColor
        outline: theme.colors.outline, // dividerColor
      },
    },
    button: {
      colors: {
        // onSecondaryContainer: "#64748B",
        // secondaryContainer: "#FFF",
        onSurfaceVariant: "#64748B",
        surfaceVariant: "#FFF",
      },
    },
  };

  const [searchText, setSearchText] = useState("");
  const [searchState, setSearchState] = useState<SearchState>(
    SearchState.Empty
  );
  const [placeSearchResults, setPlaceSearchResults] = useState<Array<Place>>(
    []
  );
  const [parkingSearchResults, setParkingSearchResults] = useState<Array<Park>>(
    []
  );

  const parkingAxios = useAxios();
  const queryStore = useQueryStore((state) => ({
    vehicleType: state.vehicleType,
    price: state.price,
    sort: state.sort,
    coordinate: state.coordinate,
  }));
  const setParkingResult = useParkingStore((state) => state.setParking);
  const setParkingPrices = useParkingStore((state) => state.setPrice);

  const getSearchResults = async (state: SearchState, query: SearchQuery) => {
    try {
      switch (state) {
        case SearchState.SearchingPlace:
          const { data: responseData } = await parkingAxios.get(
            "/maps/places/search",
            { params: { input: query.name } }
          );
          setPlaceSearchResults(responseData.data);
          break;

        case SearchState.SearchingParking:
          let rawParkingData: Array<Park> = [];
          console.log({ vehicleType: queryStore.vehicleType });

          if (queryStore.vehicleType !== "Bicycle") {
            let timeData: Date = new Date();

            try {
              const { data: responseData } = await axios.get(
                `${TIMEZONEDB_API_BASE_URL}/get-time-zone`,
                {
                  params: {
                    // key: process.env.EXPO_PUBLIC_TIMEZONEDB_API_KEY,
                    key: "0GCLGEQUDUFS",
                    format: "json",
                    by: "zone",
                    zone: "SG",
                  },
                }
              );
              timeData = new Date(responseData.timestamp);
            } catch (error) {
              console.error({
                name: "Failed to get from timezonedb API",
                error,
              });
            }

            const { data: responseData } = await parkingAxios.get(
              "/parking/motorized/search",
              {
                params: {
                  "place-id": query?.place_id,
                  day: dayMap[timeData.getDay()],
                  time: getHHMMSSFormat(timeData),
                  // get default filters from global store
                  order: queryStore.sort.toLowerCase(),
                  "vehicle-type": vehicleTypeMap[queryStore.vehicleType],
                  "price-start": 0,
                  "price-end": queryStore.price,
                },
              }
            );
            console.log({ responseData });
            rawParkingData = responseData.data;
          } else {
            const { data: responseData } = await parkingAxios.get(
              "/parking/bicycle/search",
              { params: { "place-id": query?.place_id } }
            );
            console.log("bicycle");

            rawParkingData = responseData.data;
          }
          setParkingSearchResults(rawParkingData);
          break;

        default:
          break;
      }
    } catch (error) {
      console.error({ name: "Failed to get from parking backend API", error });
    }
  };

  const handleSearchChange = async (text: string) => {
    setSearchText(text);
    if (text.trim() === "") {
      setSearchState(SearchState.Empty);
      return;
    }

    const newSearchState = SearchState.SearchingPlace;
    const query: SearchQuery = { name: text };
    await getSearchResults(newSearchState, query);

    setSearchState(newSearchState);
  };

  const handleSelectPlace = async (place: Place) => {
    const newSearchState = SearchState.SearchingParking;
    const query: SearchQuery = {
      name: place.name,
      place_id: place.place_id,
    };
    setSearchText(query.name);
    await getSearchResults(newSearchState, query);
    setSearchState(newSearchState);
  };

  const handleSelectParking = (parking: Park) => {
    if (parking.type === "Bicycle") {
      setParkingResult(parking as BicyclePark);
      setParkingPrices([]);
      return;
    }
    setParkingResult(parking as MotorizedPark);
    setParkingPrices((parking as MotorizedParkWithPrice).prices);
    navigation.navigate("Result");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search"
          value={searchText}
          // onChangeText={(text) => setSearchText(text)}
          onChangeText={handleSearchChange}
          inputStyle={{ color: "black" }}
          theme={colors.searchbar}
          style={styles.searchbar}
        />
        <IconButton
          icon="tune"
          mode="contained-tonal"
          onPress={() => navigation.navigate("Filter")}
          theme={colors.button}
          style={styles.button}
        />
      </View>
      <ScrollView style={styles.resultBody}>
        {searchState === SearchState.SearchingPlace && (
          <PlacesList
            places={placeSearchResults}
            onSelectChoice={handleSelectPlace}
          />
        )}
        {searchState === SearchState.SearchingParking && (
          <ResultsList
            data={parkingSearchResults}
            onSelectChoice={handleSelectParking}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function getHHMMSSFormat(date: Date): string {
  let res = "";
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  res += (hours < 10 ? "0" : "") + `${hours}:`;
  res += (minutes < 10 ? "0" : "") + `${minutes}:`;
  res += (seconds < 10 ? "0" : "") + `${seconds}`;

  return res;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    flex: 1,
    top: 0,
    left: 0,
    paddingTop: 60,
  },
  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    zIndex: 2,
    backgroundColor: "#F2F2F2",
  },
  resultBody: {
    flex: 1,
    marginTop: 60,
  },
  searchbar: {
    flexGrow: 1,
    maxWidth: 360,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  button: {
    height: "100%",
    width: 58,
    aspectRatio: 1 / 1,
    margin: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
});

const TIMEZONEDB_API_BASE_URL = "http://api.timezonedb.com/v2.1";

const dayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const vehicleTypeMap = {
  Car: "C",
  Motorcycle: "Y",
  "Heavy Vehicle": "H",
};
