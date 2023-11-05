export type Price = {
  startTime: string; // HH:MM:SS
  endTime: string; // HH:MM:SS
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  price: number;
  isSingleEntry: boolean;
};

export interface Park {
  type: "Car" | "Motor" | "Heavy" | "Bicycle";
  coordinate: {
    latitude: number;
    longitude: number;
  };
  name: string; // Development in motorized, Description in bicycle
  distance?: number; // in meters
}

export interface MotorizedPark extends Park {
  type: "Car" | "Motor" | "Heavy";
  id: string;
  availableLots: number;
}

export interface MotorizedParkWithPrice extends MotorizedPark {
  prices: Price[];
}

export interface BicyclePark extends Park {
  type: "Bicycle";
  name: string;
  rackType: string;
  rackCount: number;
  shelterIndicator: "Y" | "N"; // has shelter or not
  distance?: number; // in meters
}
