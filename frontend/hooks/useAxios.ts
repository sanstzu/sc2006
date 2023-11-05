import axios from "axios";

export function useAxios() {
  return axios.create({
    // baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
    baseURL: "http://54.79.82.197:8080",
  });
}
