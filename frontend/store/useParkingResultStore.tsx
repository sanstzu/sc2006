import { create } from "zustand";
import { Park, ParkingQuery } from "../types/parking";

export interface ParkingResultStore {
  results: Array<Park>;
  setResults: (results: Array<Park>) => void;
}

const useParkingResultStore = create<ParkingResultStore>((set) => ({
  results: [],
  setResults: (results: Array<Park>) => set((state) => ({ results })),
}));

export default useParkingResultStore;
