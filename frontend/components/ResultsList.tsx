import React from "react";
import { FlatList, View, StyleSheet, Dimensions } from "react-native";
import ResultsButton from "./ResultsButton";
import { MotorizedPark, Park } from "../types/parking";
import useQueryStore from "../store/useQueryStore";
import { Text } from "react-native-paper";

const screenWidth = Dimensions.get("window").width;

type ResultsListProps = {
  data: Array<Park>;
  onSelectChoice: (selected: Park) => void;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    width: screenWidth,
  },
});

export default function ResultsList(props: ResultsListProps) {
  const { onSelectChoice } = props;
  return (
    <View style={styles.container}>
      {props.data.length === 0 ? (
        <View
          style={{
            display: "flex",
            alignItems: "center",
            paddingVertical: 16,
          }}
        >
          <Text variant="bodyLarge">No parking spaces found</Text>
        </View>
      ) : (
        <FlatList
          data={props.data}
          renderItem={({ item, index }) => (
            <ResultsButton
              key={index}
              parking={item}
              onPress={() => onSelectChoice(item)}
            />
          )}
        />
      )}
    </View>
  );
}
