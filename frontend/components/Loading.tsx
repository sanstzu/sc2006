import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

export default function Loading() {
  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        paddingVertical: 16,
      }}
    >
      <ActivityIndicator animating={true} size={"large"} color="#475569" />
    </View>
  );
}
