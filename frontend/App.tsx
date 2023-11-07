import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ParkingInfo from "./pages/Result";
import Filter from "./pages/Filter";
import Display from "./pages/Display";

// Update this
export type RootStackParamList = {
  Display: undefined;
  Result: undefined;
  Filter: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={MD3LightTheme}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Display"
              options={{ title: "Display Map Screen", headerShown: false }}
              component={Display}
            />
            <Stack.Screen
              name="Result"
              options={{ title: "Result Screen" }}
              component={ParkingInfo}
            />
            <Stack.Screen
              name="Filter"
              options={{ title: "Filters" }}
              component={Filter}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
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
