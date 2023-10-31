import { create } from "zustand";
import { ParkingQuery } from "../types/parking";

export interface ParkingQueryStore {
  query: null | ParkingQuery;
  setQuery: (query: ParkingQuery) => void;
}

const useParkingQueryStore = create<ParkingQueryStore>((set) => ({
  query: null,
  setQuery: (query: ParkingQuery) => set((state) => ({ query })),
}));

export default useParkingQueryStore;
