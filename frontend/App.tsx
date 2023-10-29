import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HomeScreen from "./pages/Home";
import ParkingInfo from "./pages/Result";
import Filter from "./pages/Filter";
import Display from "./pages/Display";
import Search from "./pages/Search";

// Update this
export type RootStackParamList = {
  Home: undefined;
  Display: undefined;
  Search: undefined;
  Result: undefined;
  Filter: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <PaperProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              options={{
                title: "Home Screen",
              }}
              component={HomeScreen}
            ></Stack.Screen>
            <Stack.Screen
              name="Display"
              options={{ title: "Display Map Screen" }}
              component={Display}
            />
            <Stack.Screen
              name="Search"
              options={{ title: "Search Page Screen" }}
              component={Search}
            />
            <Stack.Screen
              name="Result"
              options={{ title: "Result Screen" }}
              component={ParkingInfo}
            />
            <Stack.Screen
              name="Filter"
              options={{ title: "Filter Page" }}
              component={Filter}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
