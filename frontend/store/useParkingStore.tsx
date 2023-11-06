import { create, StateCreator } from "zustand";
import { createSelectorHooks } from "auto-zustand-selectors-hook";
import {
  BicyclePark,
  MotorizedPark,
  Park,
  Price,
  Route,
} from "../types/parking";
import { produce } from "immer";

export type ParkingStore = {
  parking: null | BicyclePark | MotorizedPark;
  price: Price[] | null;
  routes: Route[];
  setParking: (parking: BicyclePark | MotorizedPark) => void;
  setPrice: (price: Price[]) => void;
  setRoutes: (routes: Route[]) => void;
  removePrice: () => void;
  removeParking: () => void;
  removeRoutes: () => void;
};

const parkingStore = (
  set: (data: { (state?: ParkingStore): ParkingStore }) => void
) => ({
  parking: null,
  price: null,
  routes: [],
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
  setRoutes: (routes: Route[]) =>
    set(
      produce<ParkingStore>((state) => {
        state.routes = routes;
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
  removeRoutes: () =>
    set(
      produce<ParkingStore>((state) => {
        state.routes = [];
      })
    ),
});

const useParkingStore = createSelectorHooks(create<ParkingStore>(parkingStore));

export default useParkingStore;
