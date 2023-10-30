import React, { useState } from "react";
import { Text, StyleSheet, View, Pressable} from "react-native";
import { IconButton } from "react-native-paper";

const mediumAvailability = 25;
const highAvailability = 100;

type ResultsButtonProps = {
    parkingId?: string;
    availableLots?: number;
    distance: number;
    type: string;
    rate?: number;
    name: string;
    address?: string;
    onPress?: () => void;
};

export default function ResultsButton(props: ResultsButtonProps) {
const [count, setCount] = useState(true);
  return (
    <Pressable onPress= {props.onPress}
        style={styles.resultsButton}>
        <View style={[
            styles.container,
            {                
                flexDirection: 'column',
                alignItems: 'center',
                width: 'auto',
                flex: 0,
            },
        ]}>
            <View>
                <IconButton
                    icon="circle"
                    iconColor={!props.availableLots ? '#CBD5E1' : props.availableLots > highAvailability ? '#16A34A' : props.availableLots > mediumAvailability ? '#F59E0B' : '#DC2626'}
                    size={40}
                    style={styles.icon}
                />
            </View>
            <View>
                <Text style={[
                    styles.text,
                    styles.numberText,
                ]}>{props.distance < 1000 ? props.distance.toFixed(0) + ' m': (props.distance/1000).toFixed(2) + ' km'}</Text>
            </View>
        </View>
        <View style={[
            styles.container,
            {                
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flex: 1,
            },
        ]}>
            <View>
                <Text style={[styles.text, styles.carParkText, {marginBottom: 4}]}>{props.name}</Text>
                {props.address && <Text style={[styles.text, styles.addressText]}>{props.address}</Text>}
            </View>
            <View style={[
                styles.container,
                {                
                    flexDirection: "column",
                    alignItems: 'center',
                    justifyContent: 'space-between',
                },
            ]}>
                <IconButton
                    icon={props.type === "Car" ? "car-outline" : "bicycle"}
                    iconColor={"lightslategray"}
                    size={props.type === 'Car' ? 35 : 40}
                    style={[styles.icon]}
                />
                {props.rate && <Text style={[styles.text, styles.numberText]}>$ {props.rate}</Text>}
            </View>
        </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
    },
    resultsButton: {
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 8,
        gap: 16,
        alignItems: 'center',
        justifyContent: "center",
        borderColor: "#CBD5E1",
        width: '100%',
        borderBottomWidth: 1,
        flexShrink: 0,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    text: {
        // fontFamily: 'Inter',
    },
    numberText: {
        fontSize: 16,
        fontWeight: "400",
        color: "#64748B",
    },
    carParkText: {
        fontSize: 22,
        fontWeight: "500",
        color: "#000",
    },
    addressText:{
        fontSize: 20,
        fontWeight: "400",
        color: "#1E293B",
    },
    icon:{
        margin: 0,
        padding: 0,
    }
});