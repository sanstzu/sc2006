export type Price = {
  startTime: string; // HH:MM:SS
  endTime: string; // HH:MM:SS
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  price: number;
};

export interface Park {
  type: "Car" | "Motor" | "Heavy" | "Bicycle";
  id: number;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  name: string; // Development in motorized, Description in bicycle
  distance?: number; // in meters
  price: number;
}

export interface MotorizedPark extends Park {
  type: "Car" | "Motor" | "Heavy";
  availableLots: number;
}

export interface MotorizedParkWithPrice extends MotorizedPark {
  prices: Price[];
}

export interface BicyclePark extends Park {
  type: "Bicycle";
  // Name: string;
  rackType: string;
  rackCount: number;
  shelterIndicator: "Y" | "N"; // has shelter or not
  distance?: number; // in meters
}

export interface ParkingQuery {
  id: number | string;
  latitude: number;
  longitude: number;
}

export interface MotorizedParkingQuery extends ParkingQuery {
  id: number;
}

export interface BicycleParkingQuery extends ParkingQuery {
  id: string;
}
