import { Request, Response } from "express";
import { ResponseType } from "@/types/response";
import { query } from "@/services/database";
type GetMotorizedParkingType = any;

async function fetchMotorizedParking(
  req: Request,
  res: Response<ResponseType<GetMotorizedParkingType>>
) {
  const id = req.params.id;
  

  const [rows, fields] = await query(
    `SELECT 
    MP.Development AS CarparkName,
    MP.AvailableLots,
    PP.Day,
    PP.StartTime,
    PP.EndTime,
    PP.Price
    FROM MotorizedParking AS MP
    JOIN ParkingPrice AS PP
    ON MP.CarParkID = PP.CarParkID
    WHERE MP.CarParkID = ${id};`
  );

  res.status(200).json({
    status: 1,
    message: "success",
    data : rows
  });
}

export default fetchMotorizedParking;
