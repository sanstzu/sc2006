import axios from "axios";

export function useAxios() {
  return axios.create({
    // baseURL: process.env.API_BASE_URL,
    baseURL: 'http://localhost:8000/datas',
  });
}
