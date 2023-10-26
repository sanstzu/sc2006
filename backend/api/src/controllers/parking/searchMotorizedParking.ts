import { Request, Response } from "express";
import { ResponseType } from "@/types/response";
import { query } from "@/services/database";

// type SearchMotorizedParkingType = {
//   CarParkID: string;
//   LotType : string;
//   AvailableLots: string;
//   Name: string;
//   Price: number;
//   Day: string;
//   StartTime: string;
//   EndTime: string;
//   Distance: number;
// };
type SearchMotorizedParkingType = any;
 
async function searchMotorizedParking(
  req: Request,
  res: Response<ResponseType<SearchMotorizedParkingType>>
) { 
  
  let {
    'latitude': lat,
    'longitude': long,
    day,
    time,
    order,
    'vehicle-type': vehicleType,
    'price-start': priceStart,
    'price-end': priceEnd
  } = req.body;

  switch (order) {
    case 'distance':
      order = 'D.Distance';
      break;
    case 'price':
      order = 'PP.Price';
      break;
    case 'availability':
      order = 'MP.AvailableLots DESC';
      break;
    default:
      return res.status(404).json({
        status : 1,
        message : "Invalid request body!"
      });
  }
  
  const [rows, fields] = await query(
    `WITH Dist AS (
      SELECT Coordinate,
        ST_Distance_Sphere(
        ST_Transform(
          Coordinate, 4326), 
          ST_GeomFromText(CONCAT('POINT(', ${lat}, ' ', ${long}, ')'), 4326)
        ) AS Distance
        FROM MotorizedParking
    )
    SELECT 
    MP.CarParkID,
    MP.LotType,
    MP.AvailableLots,
    MP.Development AS Name,
    PP.Price,
    PP.Day,
    PP.StartTime,
    PP.EndTime,
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
    AND D.Distance <= 5000
    ORDER BY ${order}
    LIMIT 10;`
  );

  res.status(200).json({
    status : 1,
    message : 'success',
    data : rows
  });
}

export default searchMotorizedParking;
