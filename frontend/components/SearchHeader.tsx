import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import { IconButton, Searchbar, useTheme } from "react-native-paper";
import { RootStackParamList } from "../App";
import { useState } from "react";
import { useAxios } from "../hooks/useAxios";
import ResultsList, { List as ParkingListItem } from "./ResultsList";
import PlacesList, { Place } from "./PlacesList";
import {
  Park,
  MotorizedPark,
  BicyclePark,
  ParkingQuery,
} from "../types/parking";
import useQueryStore from "../store/useQueryStore";
import axios from "axios";
import useParkingQueryStore from "../store/useParkingQueryStore";

interface SearchHeaderProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
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
  const [searchResults, setSearchResults] = useState<
    Array<Place> | Array<ParkingListItem>
  >([]);

  const parkingAxios = useAxios();
  const queryStore = useQueryStore();
  const setParkingQuery = useParkingQueryStore((state) => state.setQuery);

  const getSearchResults = async (state: SearchState, query: SearchQuery) => {
    try {
      switch (state) {
        case SearchState.SearchingPlace:
          const { data: responseData } = await parkingAxios.get(
            "maps/places/search",
            { params: { input: query.name } }
          );
          setSearchResults(responseData.data);
          break;

        case SearchState.SearchingParking:
          let rawParkingData: Array<Park> = [];

          if (queryStore.vehicleType !== "Bicycle") {
            let timeData: Date = new Date();

            try {
              const { data: responseData } = await axios.get(
                `${TIMEZONEDB_API_BASE_URL}/get-time-zone`,
                {
                  params: {
                    key: process.env.TIMEZONEDB_API_KEY,
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
                  place_id: query?.place_id,
                  day: dayMap[timeData.getDay()],
                  time: getHHMMSSFormat(timeData),
                  // get default filters from global store
                  order: queryStore.sort.toLowerCase(),
                  "vehicle-type": vehicleTypeMap[queryStore.vehicleType],
                  "price-start": queryStore.price,
                  "price-end": 99.99,
                },
              }
            );

            rawParkingData = responseData.data;
          } else {
            const { data: responseData } = await parkingAxios.get(
              "/parking/bicycle/search",
              { params: { place_id: query?.place_id } }
            );

            rawParkingData = responseData.data;
          }

          const formattedData: Array<ParkingListItem> = rawParkingData.map(
            (entry: Park) => {
              let listItem: ParkingListItem = {
                id: entry.id,
                type: entry.type,
                name: entry.name,
                distance: entry.distance as number,
                coordinate: {
                  latitude: entry.coordinate.latitude,
                  longitude: entry.coordinate.longitude,
                },
                price: entry.distance ? entry.distance.toString() : "NA",
              };

              if (entry.type !== "Bicycle") {
                const motorizedEntry = entry as MotorizedPark;
                listItem.availableLots = motorizedEntry.availableLots;
              }

              return listItem;
            }
          );

          setSearchResults(formattedData);
          break;

        default:
          break;
      }
    } catch (error) {
      console.error({ name: "Failed to get from parking backend API", error });
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    let newSearchState = SearchState.Empty;

    if (text.trim() !== "") {
      newSearchState = SearchState.SearchingPlace;
      const query: SearchQuery = { name: text };
      getSearchResults(newSearchState, query);
    }

    setSearchState(newSearchState);
  };

  const handleSelectPlace = (place: Place) => {
    const newSearchState = SearchState.SearchingParking;
    const query: SearchQuery = {
      name: place.name,
      place_id: place.place_id,
    };
    setSearchText(query.name);
    getSearchResults(newSearchState, query);
    setSearchState(newSearchState);
  };

  const handleSelectParking = (parkingListItem: ParkingListItem) => {
    let parkingQuery: ParkingQuery = {
      id:
        parkingListItem.type !== "Bicycle"
          ? (parkingListItem.id as number)
          : parkingListItem.name,
      latitude: parkingListItem.coordinate.latitude,
      longitude: parkingListItem.coordinate.longitude,
    };

    // send query for parking details to global store
    setParkingQuery(parkingQuery);
    navigation.navigate("Result");
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Searchbar
          placeholder="Search"
          value={searchText}
          onChangeText={handleSearchChange}
          inputStyle={{ color: "black" }}
          theme={colors.searchbar}
          style={styles.searchbar}
        />
        {/* <View style={styles.buttonContainer}> */}
        <IconButton
          icon="tune"
          mode="contained-tonal"
          onPress={() => navigation.navigate("Filter")}
          theme={colors.button}
          style={styles.button}
        />
        {/* </View> */}
      </View>
      <ScrollView>
        {searchState === SearchState.SearchingPlace && (
          <PlacesList
            places={searchResults as Array<Place>}
            onSelectChoice={handleSelectPlace}
          />
        )}
        {searchState === SearchState.SearchingParking && (
          <ResultsList
            data={searchResults as Array<ParkingListItem>}
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
    flex: 1,
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  searchbar: {
    flexGrow: 1,
    // maxWidth: 360,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  button: {
    height: "100%",
    width: 56,
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
