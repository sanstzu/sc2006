import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import HomeScreen from "./pages/Home/index.js";
import SearchScreen from "./pages/Search/index.js";
import ParkingInfoScreen from "./pages/ParkingInfo/index.js";
import FilterPageScreen from "./pages/Filter/index.js";
import DisplayScreen from "./pages/Display/index.js";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen {...HomeScreen} />
          <Stack.Screen {...DisplayScreen} />
          <Stack.Screen {...SearchScreen} />
          <Stack.Screen {...ParkingInfoScreen} />
          <Stack.Screen {...FilterPageScreen} />
        </Stack.Navigator>
      </NavigationContainer>
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
