import { StyleSheet, Text, View,SafeAreaView, BackHandler} from "react-native";
import { SegmentedButtons } from 'react-native-paper';
import { Button } from 'react-native-paper'; 
import { useState } from 'react';
import Slider from '@react-native-community/slider';

export const name = "FilterPage";

export const options = {
  title: "Filter Page",
};

export default function Filter( {navigation} ) {
  const [filterValue1, setFilterValue1] = useState('Distance')
  const [filterValue2, setFilterValue2] = useState('Car')
  const [sliderState, setSliderState] = useState<number>(0); 
  const [sliderDisable, setSliderDisable] = useState(false); 

  return (
    <View style={styles.page}>

      <Text style={styles.header1}>Sort by</Text>
      <SegmentedButtons style={styles.segmentedbuttons1} 
      value={filterValue1}
      onValueChange={setFilterValue1}
      
        buttons={[
          {
            value: 'Distance',
            label: 'Distance',
          },
          {
            value: 'Price',
            label: 'Price',
          },
          { value: 'Availability',
            label: 'Availability' },
        ]}
      />
      
      
      <Text style={styles.header2}>Price</Text>
      <Slider
      style={styles.slider} 
      thumbTintColor= "lightskyblue"
      value = {sliderState} 
      onValueChange={setSliderState}
      minimumValue={0}
      maximumValue={5}
      step={0.5}
      minimumTrackTintColor="#00BFFF"
      maximumTrackTintColor="#FFFFFF"
      />
      <Text
      style={styles.price}>${sliderState.toPrecision(3)} </Text>
      
      <Text style={styles.header3}>Vehicle</Text>

      <SegmentedButtons style={styles.segmentedbuttons2}
      value={filterValue2}
      onValueChange={setFilterValue2}
        buttons={[
          {
            value: 'Bicycle',
            label: 'Bicycle',
          },
          {
            value: 'Car',
            label: 'Car',
          },
          {
            value: 'Bike',
            label: 'Bike' 
          },
          { 
            value: 'Truck',
            label: 'Truck' 
          },
        ]}
      />


  <Button mode= "outlined" 
  style={styles.clearbutton}
  textColor = 'black' 
  onPress={() => { setFilterValue1('Distance'), setFilterValue2('Car'), setSliderState(0)} } > 
  Clear
  </Button> 

  <Button mode= "contained" 
  style={styles.applybutton}
  buttonColor = 'lightskyblue' 
  textColor= 'black'
  onPress={() => navigation.navigate('Display')}>
  Apply
  </Button>


      
      
    </View>
    
    
  );
}

function helper(filterValue2: string, sliderDisable: boolean){
  if(filterValue2='Bike' || 'Bicycle'){
    sliderDisable = true; 
  }
}

const styles = StyleSheet.create({
  page: { 
    flex: 1, 
    alignItems: "center",
    justifyContent: "center" 
  },
  container: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  },
  header1:{
    color: 'black',
    fontSize: 20, 
    justifyContent: 'space-between', 
    position: 'absolute',
    top: 50,
  }, 
  header2:{
    color: 'black',
    fontSize: 20, 
    justifyContent: 'space-between', 
    position: 'absolute',
    top: 200,
  }, 
  header3:{
    color: 'black',
    fontSize: 20, 
    justifyContent: 'space-between', 
    position: 'absolute',
    top: 350,
  }, 
  segmentedbuttons1: {
    textColor: 'blue',
    checkedColor: 'lightskyblue',
    uncheckedColor: 'black',
    position: 'absolute', 
    alignItems: 'center',
    justifyContent: 'space-evenly', 
    fontSize: 10,
    top: 100,
    width: '90%',
  },
  segmentedbuttons2: {
    textColor: 'blue',
    checkedColor: 'lightskyblue',
    uncheckedColor: 'black',
    position: 'absolute', 
    alignItems: 'center',
    justifyContent: 'space-evenly', 
    fontSize: 10,
    top: 400,
    width: '90%',
  },
  clearbutton:{
    position: 'absolute',
    left: 75,
    bottom: 125, 
  },
  applybutton:{
    position: 'absolute',
    right: 75,
    bottom: 125, 
  },
  slider:{ 
    position: 'absolute',
    width: 200,
    height: 40,
    top: 250,
  },
  price:{
    position: 'absolute',
    top: 290, 
  }
});
