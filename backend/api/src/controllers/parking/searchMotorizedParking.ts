import { Request, Response } from "express";
import { ResponseType } from "@/types/response";

type SearchMotorizedParkingType = any;

function searchMotorizedParking(
  req: Request,
  res: Response<ResponseType<SearchMotorizedParkingType>>
) {}

export default searchMotorizedParking;
