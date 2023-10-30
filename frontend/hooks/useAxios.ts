import axios from "axios";

export function useAxios() {
  return axios.create({
    baseURL: process.env.API_BASE_URL,
  });
}
