import { View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import { BicyclePark, MotorizedPark } from "../../types/parking";
import Icon from "react-native-vector-icons/FontAwesome5";

interface MotorizedSearch extends MotorizedPark {
  price: number;
  isSingleEntry: boolean;
}

function Callout({ park }: { park: MotorizedSearch | BicyclePark }) {
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
        {park.type !== "Bicycle" ? (
          <View>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
              }}
            >
              <Icon
                name="dollar-sign"
                size={16}
                style={{
                  width: 16,
                }}
              />
              <Text>
                ${park.price}/{park.isSingleEntry ? "entry" : "hr"}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
              }}
            >
              <Icon
                name="parking"
                size={16}
                style={{
                  width: 16,
                }}
              />
              <Text>{park.availableLots} parks available</Text>
            </View>
          </View>
        ) : (
          <View>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
              }}
            >
              <Icon
                name="parking"
                size={16}
                style={{
                  width: 16,
                }}
              />
              <Text>
                {park.rackCount} {park.rackType} racks
              </Text>
            </View>
          </View>
        )}

        <IconButton icon="chevron-right" />
      </Card.Content>
    </Card>
  );
}

export default Callout;
