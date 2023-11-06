import axios from "axios";

type LocationDetails = {
  name: string;
  address: string;
  longitude: number;
  latitude: number;
};

type Coordinate = {
  latitude: number;
  longitude: number;
};

export type TravelModes = "DRIVE" | "WALK" | "BYCICLE" | "TWO_WHEELER";

type GoogleLocation = {
  latLng: Coordinate;
};

type GoogleRouteLegStep = {
  startLocation: GoogleLocation;
  endLocation: GoogleLocation;
};

type GoogleRouteLeg = {
  steps: GoogleRouteLegStep[];
};

type GoogleRoute = {
  legs: GoogleRouteLeg[];
};

type GoogleRoutesV2Response = {
  routes: GoogleRoute[];
};

export async function fetchLocationDetails(
  placeId: string
): Promise<LocationDetails> {
  const url = "https://maps.googleapis.com/maps/api/place/details/json?";
  const response = await axios.get(url, {
    headers: {},
    params: {
      key: process.env.GOOGLE_MAPS_KEY,
      place_id: placeId,
      fields: "geometry,name,formatted_address",
    },
  });
  const { location } = response.data.result.geometry;
  const { name, formatted_address } = response.data.result;
  return {
    name,
    address: formatted_address,
    longitude: location.lng,
    latitude: location.lat,
  };
}

export async function fetchRoutePath(
  origin: Coordinate,
  destination: Coordinate,
  travelMode: TravelModes
) {
  const url = "https://routes.googleapis.com/directions/v2:computeRoutes";
  const reqData = {
    origin: {
      location: {
        latLng: origin,
      },
    },
    destination: {
      location: {
        latLng: destination,
      },
    },
    travelMode: travelMode,
    routingPreference: "TRAFFIC_AWARE",
  };

  console.log(reqData);

  const response = await axios.post(url, reqData, {
    headers: {
      "X-Goog-FieldMask":
        "routes.legs.steps.startLocation,routes.legs.steps.endLocation",
    },
    params: {
      key: process.env.GOOGLE_MAPS_KEY,
    },
  });

  const data = response.data as GoogleRoutesV2Response;

  let res: Coordinate[] = [];

  data.routes.forEach((route) => {
    route.legs.forEach((leg) => {
      leg.steps.forEach((step) => {
        if (res.length > 0) res.pop();
        res.push(step.startLocation.latLng);
        res.push(step.endLocation.latLng);
      });
    });
  });

  return res;
}
