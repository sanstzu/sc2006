import { Dimensions, Button, StyleSheet, Text, View, SafeAreaView } from "react-native";
import { IconButton } from "react-native-paper";
import ResultsList from "../../components/ResultsList";
import React, { useState, useEffect } from 'react';
import { useAxios } from '../../hooks/useAxios';
import useParkingStore from '../../store/useParkingStore'

export const name = "Results";

export const options = {
  title: "Results",
};

const screenWidth = Dimensions.get('window').width;

export default function Results() {
  const [data, setData] = useState(null);
  const axios = useAxios();
  const setParking = useParkingStore.useSetParking();
  useEffect (() => {
    axios.get()
      .then(function (response) {
        setData(response.data["data"]);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (    
    <SafeAreaView style={styles.page}>
      <View style={[
        styles.container,
            {                
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: "flex-start",
                width: screenWidth,
                borderBottomColor: "#CBD5E1",
                borderBottomWidth: 1,
                paddingHorizontal: 16,
                paddingBottom: 8,
                paddingTop: 8,
                gap: 12,
            },
        ]}>
            <IconButton
                icon="parking"
                size={32}
            />                
            <Text style={[styles.titleText]}>Parking Spaces</Text>
      </View>
      <View style={{flex: 1}}>
        <ResultsList data={data} />
        {/* <ResultsList data={[
          {type: "Bicycle", name: "Plaza Singapura", distance: 167.7334650825399},
          {type: "Bicycle", name: "Plaza Singapura", distance: 167.7334650825399},
          {type: "Bicycle", name: "Plaza Singapura", distance: 167.7334650825399},
          {type: "Bicycle", name: "Plaza Singapura", distance: 167.7334650825399},
          {type: "Car", name: "Plaza Singapura aaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaa", address: "68 Orchard Rd", availableLots: 686, distance: 1678.7334650825399, price: "1.23"},
          {type: "Car", name: "Plaza Singapura", address: "68 Orchard Rd", availableLots: 686, distance: 1678.7334650825399, price: "1.23"},
          {type: "Car", name: "Plaza Singapura", address: "68 Orchard Rd", availableLots: 686, distance: 1678.7334650825399, price: "1.23"},
          {type: "Car", name: "Plaza Singapura", address: "68 Orchard Rd", availableLots: 686, distance: 1678.7334650825399, price: "1.23"},
          {type: "Car", name: "Plaza Singapura", address: "68 Orchard Rd", availableLots: 686, distance: 1678.7334650825399, price: "1.23"},
          {type: "Car", name: "Plaza Singapura", address: "68 Orchard Rd", availableLots: 686, distance: 1678.7334650825399, price: "1.23"},
          {type: "Car", name: "Plaza Singapura", address: "68 Orchard Rd", availableLots: 686, distance: 1678.7334650825399, price: "1.23"},
          {type: "Car", name: "Plaza Singapura", address: "68 Orchard Rd", availableLots: 686, distance: 1678.7334650825399, price: "1.23"},
          {type: "Car", name: "Plaza Singapura", address: "68 Orchard Rd", availableLots: 686, distance: 1678.7334650825399, price: "1.23"},
        ]}/> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: "center", justifyContent: "flex-start", backgroundColor: "#FFF"},
  container: {
      display: "flex",
  },
  titleText: {
      fontSize: 32,
      fontWeight: "700",
      color: "#000",
  },
});
