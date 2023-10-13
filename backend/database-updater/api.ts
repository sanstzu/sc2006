import axios from "axios";

export const useAxiosLTA = () =>
  axios.create({
    headers: {
      AccountKey: process.env.DB_UPDATER_LTA_KEY,
    },
  });

export const useAxiosURA = (token?: string) =>
  axios.create({
    headers: {
      AccessKey: process.env.DB_UPDATER_URA_KEY,
      Token: token,
    },
  });
