import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Divider, Text, useTheme } from "react-native-paper";
import axios from "axios";

type ResultCardProps = {
  type: "motorized" | "bicycle";
  carParkID: number;
  latitude: number;
  longitude: number;
};

type CarParkPrice = {
  startTime: string;
  endTime: string;
  day: string;
  price: number;
};

type CarPark = {
  type: string;
  name: string;
  availableLots: number;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  distance: number;
  prices: Array<CarParkPrice>;
};

export default function ResultCard({
  type,
  carParkID: id,
  latitude,
  longitude,
}: ResultCardProps) {
  const theme = useTheme();

  const colors = {
    card: {
      colors: { elevation: { level1: "#FFF" } },
    },
    priceDay: {
      colors: { onSurface: "#64748B" },
    },
  };

  // Change to null when API works
  const [carParkInfo, setCarParkInfo] = React.useState<null | CarPark>(
    sampleCarPark
  );
  const [carParkPrices, setCarParkPrices] = React.useState({});

  React.useEffect(() => {
    axios
      .get(`/parking/${type}/${id}`, {
        transformRequest: [
          function (data) {
            const newData = { ...data, latitude, longitude };
            return newData;
          },
        ],
      })
      .then(({ data }) => {
        setCarParkInfo(data);
      });
  }, []);

  React.useEffect(() => {
    let newCarParkPrices: any = structuredClone(carParkPrices);
    carParkInfo?.prices.forEach((el) => {
      const price = {
        startTime: el.startTime,
        endTime: el.endTime,
        price: el.price,
      };
      if (el.day in newCarParkPrices) {
        newCarParkPrices[el.day].push(price);
      } else {
        newCarParkPrices[el.day] = [price];
      }
    });
    setCarParkPrices(newCarParkPrices);
  }, [carParkInfo]);

  if (!carParkInfo)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Card theme={colors.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            {carParkInfo.name}
          </Text>
          <Divider />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 8,
              marginTop: 16,
              marginBottom: 24,
            }}
          >
            <Text variant="bodyMedium">
              Available Lots: {carParkInfo.availableLots}
            </Text>
            <Text variant="bodyMedium">
              {Math.round(carParkInfo.distance)} m
            </Text>
          </View>
          <View style={styles.body}>
            {Object.entries(carParkPrices).map(([day, prices]: any) => (
              <View>
                <Text variant="bodyLarge" theme={colors.priceDay}>
                  {day}
                </Text>
                {prices.map((price: any) => (
                  <Text variant="bodyMedium">
                    {" "}
                    - {price.startTime.slice(0, 5)}-{price.endTime.slice(0, 5)}:
                    ${Number(price.price).toFixed(2)}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const sampleCarPark: CarPark = {
  type: "Car",
  name: "Suntec City",
  availableLots: 1678,
  coordinate: {
    latitude: 1.29375,
    longitude: 103.85718,
  },
  distance: 489.1454056429378,
  prices: [
    {
      startTime: "00:00:00",
      endTime: "03:59:59",
      day: "Fri",
      price: 3.0,
    },
    {
      startTime: "04:00:00",
      endTime: "06:59:59",
      day: "Fri",
      price: 2.6,
    },
  ],
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  body: {
    flex: 1,
    gap: 8,
    marginHorizontal: 8,
  },
});
