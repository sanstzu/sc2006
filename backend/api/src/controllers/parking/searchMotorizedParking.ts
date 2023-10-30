import { Request, Response } from "express";
import { ResponseType } from "@/types/response";
import { query } from "@/services/database";

type SearchMotorizedParkingType = any;

async function searchMotorizedParking(
  req: Request,
  res: Response<ResponseType<SearchMotorizedParkingType[]>>
) {
  let {
    latitude: lat,
    longitude: long,
    day,
    time,
    order,
    "vehicle-type": vehicleType,
    "price-start": priceStart,
    "price-end": priceEnd,
  } = req.body;

  switch (order) {
    case "distance":
      order = "D.Distance";
      break;
    case "price":
      order = "PP.Price";
      break;
    case "availability":
      order = "MP.AvailableLots DESC";
      break;
    default:
      return res.status(404).json({
        status: 1,
        message: "Invalid request body!",
      });
  }
  try {
    const [rows, fields]: [object[], object] = await query(
      `WITH Dist AS (
      SELECT Coordinate,
        ST_Distance_Sphere(
        ST_Transform(
          Coordinate, 4326), 
          ST_GeomFromText(CONCAT('POINT(', ${lat}, ' ', ${long}, ')'), 4326)
        ) AS Distance
        FROM MotorizedParking
        HAVING Distance <= 5000
    )
    SELECT
    MP.CarParkID,
    ST_X(MP.Coordinate) AS Latitude,
    ST_Y(MP.Coordinate) AS Longitude,
    MP.LotType,
    MP.AvailableLots,
    MP.Development AS Name,
    PP.Price,
    D.Distance
    FROM MotorizedParking AS MP
    JOIN ParkingPrice AS PP
    JOIN Dist AS D
    ON MP.CarParkID = PP.CarParkID
    AND D.Coordinate = MP.Coordinate
    WHERE PP.Day = '${day}'
    AND MP.LotType = '${vehicleType}'
    AND '${time}' <= PP.EndTime AND '${time}' >= PP.StartTime
    AND PP.Price <= ${priceEnd} AND PP.Price >= ${priceStart}
    ORDER BY ${order}
    LIMIT 10;`
    );

    let respData: SearchMotorizedParkingType[] = [];
    rows.forEach((obj: SearchMotorizedParkingType) => {
      if (obj.LotType === "C") obj.LotType = "Car";
      else if (obj.LotType === "H") obj.LotType = "Heavy";
      else if (obj.LotType === "Y") obj.LotType = "Motor";

      respData.push({
        type: obj.LotType,
        id: obj.CarParkID,
        name: obj.Name,
        availableLots: obj.AvailableLots,
        coordinate: {
          latitude: obj.Latitude,
          longitude: obj.Longitude,
        },
        distance: obj.Distance,
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

export default searchMotorizedParking;
