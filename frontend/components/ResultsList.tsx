import React from "react";
import { FlatList, View, StyleSheet, Dimensions } from "react-native";
import ResultsButton from "./ResultsButton";
import { Park } from "../types/parking";

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
  console.log({ props });
  const { onSelectChoice } = props;
  return (
    <View style={styles.container}>
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
    </View>
  );
}
