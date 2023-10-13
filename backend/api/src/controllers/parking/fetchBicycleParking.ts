import { Request, Response } from "express";
import { ResponseType } from "@/types/response";

type GetBicycleParkingType = any;

function fetchBicycleParking(
  req: Request,
  res: Response<ResponseType<GetBicycleParkingType>>
) {}

export default fetchBicycleParking;
