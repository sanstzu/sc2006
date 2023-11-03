import { Request, Response } from "express";
import { ResponseType } from "@/types/response";
import { query } from "@/services/database";

type GetMotorizedParkingType = any;

async function fetchMotorizedParking(
  req: Request,
  res: Response<ResponseType<GetMotorizedParkingType>>
) {
  const { latitude: lat, longitude: long } = req.query;
  const id = req.params.id;
  
  try {
    const [rows, fields]: [object[], object] = await query(
      `SELECT 
    MP.Development AS CarparkName,
    MP.AvailableLots,
    MP.LotType,
    ST_X(MP.Coordinate) AS Latitude,
    ST_Y(MP.Coordinate) AS Longitude,
    PP.Day,
    PP.StartTime,
    PP.EndTime,
    PP.Price,
    ST_Distance_Sphere(
      ST_Transform(
        Coordinate, 4326), 
        ST_GeomFromText(CONCAT('POINT(', ${lat}, ' ', ${long}, ')'), 4326)
      ) AS Distance
    FROM MotorizedParking AS MP
    JOIN ParkingPrice AS PP
    ON MP.CarParkID = PP.CarParkID
    AND MP.LotType = PP.LotType
    WHERE MP.CarParkID = ${id};`
    );

    let primary: {
      CarparkName?: string;
      AvailableLots?: number;
      LotType?: string;
      Latitude?: number;
      Longitude?: number;
      Distance?: number;
    } = rows[0];

    if (primary.LotType === "C") primary.LotType = "Car";
    else if (primary.LotType === "H") primary.LotType = "Heavy";
    else if (primary.LotType === "Y") primary.LotType = "Motor";

    let respData: GetMotorizedParkingType = {
      type: primary.LotType,
      name: primary.CarparkName,
      availableLots: primary.AvailableLots,
      coordinate: {
        latitude: primary.Latitude,
        longitude: primary.Longitude,
      },
      distance: primary.Distance,
      prices: [],
    };

    rows.forEach((obj: GetMotorizedParkingType) => {
      respData.prices.push({
        startTime: obj.StartTime,
        endTime: obj.EndTime,
        day: obj.Day,
        price: obj.Price,
      });
    });

    res.status(200).json({
      status: 1,
      message: "success",
      data: respData,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "Internal server error",
    });
  }
}

export default fetchMotorizedParking;
