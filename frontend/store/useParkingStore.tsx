import { create, StateCreator } from "zustand";
import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { BicyclePark, MotorizedPark, Park } from "../types/parking";
import { produce } from "immer";

export type ParkingStore = {
  parking: null | BicyclePark | MotorizedPark;
  setParking: (parking: BicyclePark | MotorizedPark) => void;
  removeParking: () => void;
};

const parkingStore = (
  set: (data: { (state?: ParkingStore): ParkingStore }) => void
) => ({
  parking: null,
  setParking: (parking: BicyclePark | MotorizedPark) =>
    set(
      produce<ParkingStore>((state) => {
        state.parking = parking;
      })
    ),
  removeParking: () =>
    set(
      produce<ParkingStore>((state) => {
        state.parking = null;
      })
    ),
});

const useParkingStore = createSelectorHooks(create<ParkingStore>(parkingStore));

export default useParkingStore;
