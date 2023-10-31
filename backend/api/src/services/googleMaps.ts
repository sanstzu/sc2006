import axios from "axios";

type LocationDetails = {
    name: string;
    address: string;
    longitude: number;
    latitude: number;
}

export async function fetchLocationDetails(placeId: string): Promise<LocationDetails> {
    const url = 'https://maps.googleapis.com/maps/api/place/details/json?';
    const response = await axios.get(url, {
        headers: {},
        params: {
            key: process.env.GOOGLE_MAPS_KEY,
            place_id: placeId,
            fields: 'geometry,name,formatted_address'
        }
    });
    const { location } = response.data.result.geometry;
    const { name, formatted_address } = response.data.result;
    return { 
        name, 
        address: formatted_address,
        longitude: location.lng, 
        latitude: location.lat 
    };
}