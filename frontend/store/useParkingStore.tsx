import { create, StateCreator } from "zustand";
import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { BicyclePark, MotorizedPark, Park, Price } from "../types/parking";
import { produce } from "immer";

export type ParkingStore = {
  parking: null | BicyclePark | MotorizedPark;
  price: Price[] | null;
  setParking: (parking: BicyclePark | MotorizedPark) => void;
  setPrice: (price: Price[]) => void;
  removePrice: () => void;
  removeParking: () => void;
};

const parkingStore = (
  set: (data: { (state?: ParkingStore): ParkingStore }) => void
) => ({
  parking: null,
  price: null,
  destination: null,
  setParking: (parking: BicyclePark | MotorizedPark) =>
    set(
      produce<ParkingStore>((state) => {
        state.parking = parking;
      })
    ),
  setPrice: (price: Price[]) =>
    set(
      produce<ParkingStore>((state) => {
        state.price = price;
      })
    ),
  removePrice: () =>
    set(
      produce<ParkingStore>((state) => {
        state.price = null;
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
