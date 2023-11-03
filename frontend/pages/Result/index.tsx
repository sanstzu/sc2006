import { Button, StyleSheet, Text, View, SafeAreaView } from "react-native";
import SearchHeader from "../../components/SearchHeader";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

export const name = "ResultPage";

export const options = {
  title: "Result",
};

export default function ParkingInfo({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Result">) {
  return (
    <SafeAreaView style={styles.page}>
      <SearchHeader navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: "center", justifyContent: "center" },
});
