import { Button, StyleSheet, Text, View, SafeAreaView } from "react-native";
import useParkingStore from "../../store/useParkingStore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import SearchHeader from "../../components/SearchHeader";

export default function Display({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Display">) {
  const test = useParkingStore();
  return (
    <SafeAreaView style={styles.page}>
      <SearchHeader navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, justifyContent: "flex-start", alignItems: "flex-start" },
});
