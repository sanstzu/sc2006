import { View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import { MotorizedPark } from "../../types/parking";

interface MotorizedSearch extends MotorizedPark {
  price: string;
}

function Callout({ park }: { park: MotorizedSearch }) {
  return (
    <Card
      contentStyle={{
        width: 200,
        zIndex: 90,
      }}
    >
      <Card.Title title={park.name} />
      <Card.Content
        style={{
          display: "flex",
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text>Price: ${park.price}</Text>
          <Text>Available Lots: {park.availableLots}</Text>
        </View>

        <IconButton icon="chevron-right" />
      </Card.Content>
    </Card>
  );
}

export default Callout;
