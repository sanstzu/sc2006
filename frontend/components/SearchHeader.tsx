import { StyleSheet, View } from "react-native";
import { IconButton, Searchbar, useTheme } from "react-native-paper";

type SearchHeaderProps = {
  value: string;
  onChangeText: (text: string) => void;
  onPressFilter: () => void;
};

export default function SearchHeader({
  value,
  onChangeText,
  onPressFilter,
}: SearchHeaderProps) {
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

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search"
        value={value}
        onChangeText={onChangeText}
        inputStyle={{ color: "black" }}
        theme={colors.searchbar}
        style={styles.searchbar}
      />
      {/* <View style={styles.buttonContainer}> */}
      <IconButton
        icon="tune"
        mode="contained-tonal"
        onPress={onPressFilter}
        theme={colors.button}
        style={styles.button}
      />
      {/* </View> */}
    </View>
  );
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
