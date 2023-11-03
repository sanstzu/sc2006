import React from 'react'
import { FlatList, View, StyleSheet, Dimensions } from 'react-native'
import ResultsButton from './ResultsButton';

const screenWidth = Dimensions.get('window').width;

export type List = {
  id?: number;
  coordinate?: {
    latitude: number;
    longitude: number;
  };
  type: string;
  name: string;
  availableLots?: number;
  distance: number;
  price?: string;
  address?: string;
}

type ResultsListProps = {
  data: List[];
  onSelectChoice?: (selected: List) => void;
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      width: screenWidth,
    },
});

export default function ResultsList(props: ResultsListProps) {
  const { onSelectChoice = ()=>{} } = props;
  return (
    <View style={styles.container}>
      <FlatList
        data={props.data}
        renderItem={({item}) => <ResultsButton onPress={() => onSelectChoice(item)} type={item.type} name={item.name} address={item.address} availableLots={item.availableLots} distance={+item.distance.toFixed(1)} rate={item.price ? +item.price : undefined}/>}
      />
    </View>
  )
}
