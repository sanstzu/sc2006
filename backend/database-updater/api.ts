import axios from "axios";

export const useAxiosLTA = () =>
  axios.create({
    headers: {
      AccountKey: "ygtw1kdYQ/6Dg5tIM5KW4A==",
    },
  });

export const useAxiosURA = (token?: string) =>
  axios.create({
    headers: {
      AccessKey: "b2bcbf05-ce3d-4166-ad75-137661bc20bd",
      Token: token,
    },
  });
