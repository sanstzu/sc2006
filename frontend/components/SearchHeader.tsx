import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import { IconButton, Searchbar, useTheme } from "react-native-paper";
import { RootStackParamList } from "../App";
import { useEffect, useState } from "react";
import { useAxios } from "../hooks/useAxios";
import ResultsList from "./ResultsList";
import PlacesList, { Place } from "./PlacesList";
import {
  Park,
  MotorizedPark,
  BicyclePark,
  MotorizedParkWithPrice,
} from "../types/parking";
import useQueryStore from "../store/useQueryStore";

import useParkingStore from "../store/useParkingStore";
import Loading from "./Loading";
import { useIsFocused } from "@react-navigation/native";
import { LocationObject } from "expo-location";
import * as Location from "expo-location";
import { useDebounce } from "../hooks/useDebounce";

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

// const WINDOW_HEIGHT = Dimensions.get("screen").height;

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

  const [userLoc, setUserLoc] = useState<LocationObject>();
  const isFocused = useIsFocused();

  const [searchText, setSearchText] = useState("");
  const debounceSearchText = useDebounce(searchText, 500);
  const [searchQuery, setSearchQuery] = useState<SearchQuery>();
  const [searchState, setSearchState] = useState<SearchState>(
    SearchState.Empty
  );
  const [placeSearchResults, setPlaceSearchResults] = useState<Array<Place>>(
    []
  );
  const [parkingSearchResults, setParkingSearchResults] = useState<Array<Park>>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const place = useQueryStore.useCoordinate();
  const setPlace = useQueryStore.useSetCoordinate();
  console.log(place);
  const parkingAxios = useAxios();
  const vehicleTypeFilter = useQueryStore.useVehicleType();
  const priceFilter = useQueryStore.usePrice();
  const sortFilter = useQueryStore.useSort();
  const setParkingResult = useParkingStore.useSetParking();
  const setParkingPrices = useParkingStore.useSetPrice();
  const removeParkingPrices = useParkingStore.useRemovePrice();

  const getSearchResults = async (state: SearchState, query: SearchQuery) => {
    setIsLoading(true);
    setPlaceSearchResults([]);
    setParkingSearchResults([]);
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
          let parkingData: Array<Park> = [];

          if (vehicleTypeFilter !== "Bicycle") {
            let timeData: Date = new Date();

            try {
              timeData = new Date();
            } catch (error) {
              console.error({
                name: "Failed to get from timezonedb API",
                error,
              });
            }

            const { config, data: responseData } = await parkingAxios.get(
              "/parking/motorized/search",
              {
                params: {
                  "place-id": query?.place_id,
                  day: dayMap[timeData.getDay()],
                  time: getHHMMSSFormat(timeData),
                  // get default filters from global store
                  order: sortFilter.toLowerCase(),
                  "vehicle-type": vehicleTypeMap[vehicleTypeFilter],
                  "price-start": 0,
                  "price-end": priceFilter,
                },
              }
            );
            parkingData = responseData.data.result;
            console.log(responseData.data);
            setPlace({
              latitude: responseData.data.latitude,
              longitude: responseData.data.longitude,
            });
          } else {
            const { data: responseData } = await parkingAxios.get(
              "/parking/bicycle/search",
              { params: { "place-id": query?.place_id } }
            );

            parkingData = responseData.data.result;
            console.log(responseData.data);
            setPlace({
              latitude: responseData.data.latitude,
              longitude: responseData.data.longitude,
            });
          }

          let nameSet = new Set(parkingData.map((parking) => parking.name));
          const uniqueParkingData = parkingData.reduce((accumulator, curr) => {
            if (nameSet.delete(curr.name)) {
              return [...accumulator, curr];
            }
            return accumulator;
          }, [] as Array<Park>);

          setParkingSearchResults(uniqueParkingData);
          break;

        default:
          break;
      }
    } catch (error) {
      console.error({ name: "Failed to get from parking backend API", error });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = async (text: string) => {
    setSearchText(text);
    if (text.trim() === "") {
      setSearchState(SearchState.Empty);
      return;
    }
  };

  const handleSelectPlace = async (place: Place) => {
    const newSearchState = SearchState.SearchingParking;
    const query: SearchQuery = {
      name: place.name,
      place_id: place.place_id,
    };
    setSearchQuery(query);
    await getSearchResults(newSearchState, query);

    setSearchState(newSearchState);
  };

  const handleSelectParking = async (parking: Park & { id?: string }) => {
    if (parking.type === "Bicycle") {
      setParkingResult(parking as BicyclePark);
      removeParkingPrices();
    } else {
      setParkingResult(parking as MotorizedPark);
      try {
        // get prices
        const { data: responseData } = await parkingAxios.get(
          `/parking/motorized/${parking.id as string}`,
          {
            params: {
              latitude: userLoc?.coords.latitude,
              longitude: userLoc?.coords.longitude,
              "vehicle-type": vehicleTypeMap[vehicleTypeFilter],
            },
          }
        );
        setParkingPrices((responseData.data as MotorizedParkWithPrice).prices);
      } catch (error) {
        console.error({
          name: "Failed to get motorized parking details from backend parking API",
          error,
        });
      }
    }

    setSearchState(SearchState.Empty);
    navigation.navigate("Display");
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        return;
      }

      let locationTmp = await Location.getCurrentPositionAsync({});

      setUserLoc(locationTmp);
    })();
  }, [isFocused]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const newSearchState = SearchState.SearchingPlace;
      const query: SearchQuery = { name: debounceSearchText };
      await getSearchResults(newSearchState, query);

      if (isMounted) setSearchState(newSearchState);
    })();

    return () => {
      isMounted = false;
    };
  }, [debounceSearchText]);

  useEffect(() => {
    if (searchQuery) {
      getSearchResults(SearchState.SearchingParking, searchQuery);
    }
  }, [vehicleTypeFilter, priceFilter, sortFilter]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        // (isLoading || searchState !== SearchState.Empty) && [
        //   styles.active,
        //   styles.shadow,
        // ],
      ]}
    >
      <View style={styles.header}>
        <Searchbar
          placeholder="Search"
          value={searchText}
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
        {isLoading && <Loading />}
        {searchState === SearchState.SearchingPlace && !isLoading && (
          <PlacesList
            places={placeSearchResults}
            onSelectChoice={handleSelectPlace}
          />
        )}
        {searchState === SearchState.SearchingParking && !isLoading && (
          <ResultsList
            placeName={searchQuery?.name ?? ""}
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
    // maxHeight: WINDOW_HEIGHT * 0.75,
    height: "100%",
    flex: 1,
    top: 0,
    left: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    zIndex: 2,
  },
  header: {
    flexBasis: "auto",
    flexGrow: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 8,
    padding: 8,
  },
  resultBody: {
    flex: 1,
    flexGrow: 1,
  },
  searchbar: {
    flex: 1,
    flexGrow: 1,
    maxWidth: 360,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  button: {
    height: "100%",
    width: 58,
    margin: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  active: {
    backgroundColor: "#FFF",
  },
  shadow: {
    elevation: 1,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

const dayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const vehicleTypeMap = {
  Car: "C",
  Motorcycle: "Y",
  "Heavy Vehicle": "H",
  Bicycle: "B",
};
