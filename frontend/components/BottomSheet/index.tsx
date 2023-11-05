import BottomSheet, {
  BottomSheetProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { ComponentProps } from "react";
import { Dimensions, StyleProp, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

type BottomSheetComponentProps = {
  innerRef?: React.RefObject<BottomSheet>;

  contentStyle?: ComponentProps<typeof BottomSheetScrollView>["style"];

  title: string;
  children?: React.ReactNode;
} & Omit<BottomSheetProps, "children" | "ref" | "snapPoints">;

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

function BottomSheetComponent({
  innerRef: bottomSheetRef,
  onChange: handleSheetChanges,

  contentStyle,
  title,
  children,
  ...rest
}: BottomSheetComponentProps) {
  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={["7%", "28%", "65%"]}
      onChange={handleSheetChanges}
      {...rest}
    >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          {/* Header component */}
          <View>
            <Text variant="headlineSmall" style={styles.bottomSheetHeader}>
              {title}
            </Text>
          </View>
          <View style={styles.bottomSheetBorder} />
          {/* Content */}
          <BottomSheetScrollView style={contentStyle}>
            {children}
          </BottomSheetScrollView>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: SCREEN_HEIGHT * 0.04,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },

  bottomSheetHeader: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    fontWeight: "bold",
  },
  bottomSheetBorder: {
    borderBottomWidth: 1,
    borderColor: "#d4d4d4",
    height: 1,
    width: "100%",
  },
});

export default BottomSheetComponent;
