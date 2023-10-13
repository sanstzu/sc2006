import { Request, Response } from "express";
import { ResponseType } from "@/types/response";

type GetMotorizedParkingType = any;

function fetchMotorizedParking(
  req: Request,
  res: Response<ResponseType<GetMotorizedParkingType>>
) {}

export default fetchMotorizedParking;
