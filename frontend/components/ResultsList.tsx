import React from "react";
import { FlatList, View, StyleSheet, Dimensions } from "react-native";
import ResultsButton from "./ResultsButton";
import { MotorizedPark, Park } from "../types/parking";
import useQueryStore from "../store/useQueryStore";
import { Divider, List, Text } from "react-native-paper";
import { Place } from "./PlacesList";

const screenWidth = Dimensions.get("window").width;

type ResultsListProps = {
  data: Array<Park>;
  placeName: string;
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
        <List.Section>
          <List.Subheader>{props.placeName}</List.Subheader>
          {props.data.map((item, idx) => (
            <ResultsButton
              key={idx}
              parking={item}
              onPress={() => onSelectChoice(item)}
            />
          ))}
        </List.Section>
        // <FlatList
        //   data={props.data}
        //   renderItem={({ item, index }) => (
        //     <ResultsButton
        //       key={index}
        //       parking={item}
        //       onPress={() => onSelectChoice(item)}
        //     />
        //   )}
        // />
      )}
    </View>
  );
}
