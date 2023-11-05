import { View } from "react-native";
import { Text } from "react-native-paper";

export default function Loading() {
  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        paddingVertical: 16,
      }}
    >
      <Text variant="bodyLarge">Loading...</Text>
    </View>
  );
}
