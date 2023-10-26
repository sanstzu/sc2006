export type Price = {
  startTime: string; // HH:MM:SS
  endTime: string; // HH:MM:SS
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  price: number;
};

export interface Park {
  type: "Motorized" | "Bicycle";
  coordinate: {
    latitude: number;
    longitude: number;
  };
  name: string; // Development in motorized, Description in bicycle
}

export interface MotorizedPark extends Park {
  type: "Motorized";
  availableLots: number;
}

export interface MotorizedParkWithPrice extends MotorizedPark {
  prices: Price[];
}

export interface BicyclePark extends Park {
  type: "Bicycle";
  rackType: string;
  rackCount: number;
  shelterIndicator: "Y" | "N"; // has shelter or not
}
