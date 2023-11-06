import { create, StateCreator } from "zustand";
import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { BicyclePark, MotorizedPark, Park } from "../types/parking";
import { produce } from "immer";

export type Vehicle = "Bicycle" | "Car" | "Motorcycle" | "Heavy Vehicle";

export type Sort = "Distance" | "Price" | "Availability";

type Coordinate = {
  longitude: number;
  latitude: number;
};

export type FilterStore = {
  vehicleType: Vehicle;
  price: number;
  sort: Sort;
  coordinate: Coordinate | null; // stores the place coordinate
  setVehicleType: (vehicle: Vehicle) => void;
  setPrice: (price: number) => void;
  setSort: (sort: Sort) => void;
  setCoordinate: (coord: Coordinate) => void;
  removeCoordinate: () => void;
};

const filterStore = (
  set: (data: { (state?: FilterStore): FilterStore }) => void
) => ({
  vehicleType: "Car" as Vehicle,
  price: 5,
  sort: "Distance" as Sort,
  coordinate: null,
  setVehicleType: (vehicle: Vehicle) =>
    set(
      produce<FilterStore>((state) => {
        state.vehicleType = vehicle;
      })
    ),
  setPrice: (price: number) =>
    set(
      produce<FilterStore>((state) => {
        state.price = price;
      })
    ),
  setSort: (sort: Sort) => {
    set(
      produce<FilterStore>((state) => {
        state.sort = sort;
      })
    );
  },
  setCoordinate: (coord: Coordinate) => {
    set(
      produce<FilterStore>((state) => {
        state.coordinate = coord;
      })
    );
  },
  removeCoordinate: () => {
    set(
      produce<FilterStore>((state) => {
        state.coordinate = null;
      })
    );
  },
});

const useQueryStore = createSelectorHooks(create<FilterStore>(filterStore));

export default useQueryStore;
