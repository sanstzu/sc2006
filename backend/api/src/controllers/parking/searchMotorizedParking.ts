import { Request, Response } from "express";
import { ResponseType } from "@/types/response";
import { query } from "@/services/database";
import { fetchLocationDetails } from "@/services/googleMaps";

type SearchMotorizedParkingType = any;

async function searchMotorizedParking(
  req: Request,
  res: Response<ResponseType<SearchMotorizedParkingType[]>>
) {
  try {
    let {
      day,
      time,
      order,
      "vehicle-type": vehicleType,
      "price-start": priceStartRaw,
      "price-end": priceEndRaw,
    } = req.query;

    const priceStart: number = parseInt(priceStartRaw?.toString() || "-1");
    const priceEnd: number = parseInt(priceEndRaw?.toString() || "-1");

    let lat: number;
    let long: number;

    if (req.query.latitude === undefined || req.query.longitude === undefined) {
      if (typeof req.query["place-id"] === "string") {
        try {
          const details: {
            name: string;
            address: string;
            longitude: number;
            latitude: number;
          } = await fetchLocationDetails(req.query["place-id"]);
          lat = details.latitude;
          long = details.longitude;
        } catch (error) {
          console.log(error);
          return res.status(404).json({
            status: 0,
            message: "Invalid place id!",
          });
        }
      } else {
        return res.status(404).json({
          status: 0,
          message: "Invalid place id!",
        });
      }
    } else {
      if (
        req.query.latitude !== undefined &&
        req.query.longitude !== undefined
      ) {
        lat = parseFloat(req.query.latitude.toString());
        long = parseFloat(req.query.longitude.toString());
      } else {
        return res.status(404).json({
          status: 0,
          message: "Invalid latitude and longitude!",
        });
      }
    }

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
          status: 0,
          message: "Invalid request order!",
        });
    }

    if (
      typeof day === "string" &&
      !["mon", "tue", "wed", "thu", "fri", "sat", "sun"].includes(
        day.toLowerCase()
      )
    ) {
      return res.status(404).json({
        status: 0,
        message: "Invalid request day!",
      });
    }

    if (
      typeof time === "string" &&
      !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(time)
    ) {
      return res.status(404).json({
        status: 0,
        message: "Invalid request time!",
      });
    }

    if (
      typeof priceStart == "number" &&
      typeof priceEnd == "number" &&
      (priceStart < 0 || priceStart > 10 || priceEnd < 0 || priceEnd > 10)
    ) {
      return res.status(404).json({
        status: 0,
        message: "Invalid request price range!",
      });
    }

    if (
      typeof vehicleType === "string" &&
      !["C", "H", "Y"].includes(vehicleType.toUpperCase())
    ) {
      return res.status(404).json({
        status: 0,
        message: "Invalid request vehicle type!",
      });
    }

    const [rows, fields]: [object[], object] = await query(
      `WITH Dist AS (
      SELECT DISTINCT Coordinate,
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
    PP.IsSingleEntry,
    D.Distance
    FROM MotorizedParking AS MP
    JOIN ParkingPrice AS PP
    JOIN Dist AS D
    ON MP.CarParkID = PP.CarParkID
    AND D.Coordinate = MP.Coordinate
    AND MP.LotType = PP.LotType
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
      else {
        return res.status(404).json({
          status: 0,
          message: "Invalid vehicle type!",
        });
      }
      respData.push({
        type: obj.LotType,
        id: obj.CarParkID,
        name: obj.Name,
        availableLots: obj.AvailableLots,
        coordinate: {
          latitude: obj.Latitude,
          longitude: obj.Longitude,
        },
        placeCoordinate: {
          latitude: lat,
          longitude: long,
        },
        distance: obj.Distance,
        price: obj.Price,
        isSingleEntry: Boolean(obj.IsSingleEntry),
      });
    });

    res.status(200).json({
      status: 1,
      message: "success",
      data: respData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 0,
      message: "Internal server error",
    });
  }
}

export default searchMotorizedParking;
