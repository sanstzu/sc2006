import { StyleSheet, View } from "react-native";
import { Divider, List } from "react-native-paper";

export interface Place {
  name: string;
  address: string;
  place_id: string;
}

interface PlacesListProps {
  places: Array<Place>;
  onSelectChoice: (place: Place) => void;
}

export default function PlacesList({
  places,
  onSelectChoice,
}: PlacesListProps) {
  return (
    <View style={styles.list}>
      {places.map((place, ii) => (
        <View key={ii}>
          <List.Item
            title={place.name}
            description={place.address}
            onPress={() => onSelectChoice(place)}
          />
          {ii < places.length - 1 && <Divider />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  header: {
    width: "100%",
    padding: 8,
    gap: 8,
  },
  list: {
    width: "100%",
  },
});
