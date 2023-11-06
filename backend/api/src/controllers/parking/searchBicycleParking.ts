import { Request, Response } from "express";
import { ResponseType } from "@/types/response";
import axios from "axios";
import { getDistance } from "geolib";
import { fetchLocationDetails } from "@/services/googleMaps";

type SearchBicycleParkingType = {
  type: "Bicycle";
  name: string;
  coordinate: coordinate;
  rackType: string;
  rackCount: number;
  shelterIndicator: "Y" | "N";
  distance: number;
};

type coordinate = {
  latitude: number;
  longitude: number;
};

type SearchBicycleParkingResponse = {
  result: SearchBicycleParkingType[];
  latitude?: number;
  longitude?: number;
};

async function searchBicycleParking(
  req: Request,
  res: Response<ResponseType<SearchBicycleParkingResponse>>
) {
  try {
    let coor: coordinate;

    if (req.query.latitude === undefined || req.query.longitude === undefined) {
      if (typeof req.query["place-id"] === "string") {
        const details: {
          name: string;
          address: string;
          longitude: number;
          latitude: number;
        } = await fetchLocationDetails(req.query["place-id"]);
        coor = {
          latitude: details.latitude,
          longitude: details.longitude,
        };
      } else {
        return res.status(404).json({
          status: 0,
          message: "Invalid request query!",
        });
      }
    } else {
      if (
        req.query.latitude !== undefined ||
        req.query.longitude !== undefined
      ) {
        coor = {
          latitude: parseFloat(req.query.latitude.toString()),
          longitude: parseFloat(req.query.longitude.toString()),
        };
      } else {
        return res.status(404).json({
          status: 0,
          message: "Invalid request query!",
        });
      }
    }

    const key = process.env.DB_UPDATER_LTA_KEY;
    const url =
      "http://datamall2.mytransport.sg/ltaodataservice/BicycleParkingv2";

    const resp = await axios.get(url, {
      headers: {
        accountKey: key,
      },
      params: {
        Lat: coor.latitude,
        Long: coor.longitude,
        Dist: 1,
      },
    });

    let result = resp.data.value;
    let respData: SearchBicycleParkingType[] = [];

    result.forEach(
      (obj: {
        Latitude: number;
        Longitude: number;
        Description: string;
        RackType: string;
        RackCount: number;
        ShelterIndicator: "Y" | "N";
      }) => {
        let objCoor: coordinate = {
          latitude: obj.Latitude,
          longitude: obj.Longitude,
        };

        respData.push({
          type: "Bicycle",
          name: obj.Description,
          coordinate: {
            latitude: obj.Latitude,
            longitude: obj.Longitude,
          },
          rackType: obj.RackType,
          rackCount: obj.RackCount,
          shelterIndicator: obj.ShelterIndicator,
          distance: getDistance(coor, objCoor),
        });
      }
    );

    let sortedResult: SearchBicycleParkingType[] = respData
      .sort(
        (obj1: SearchBicycleParkingType, obj2: SearchBicycleParkingType) => {
          return obj1.distance - obj2.distance;
        }
      )
      .slice(0, 10);

    res.status(200).json({
      status: 1,
      message: "success",
      data: {
        result: sortedResult,
        latitude:
          req.query["place-id"] !== undefined ? coor.latitude : undefined,
        longitude:
          req.query["place-id"] !== undefined ? coor.longitude : undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "Internal server error",
    });
  }
}
export default searchBicycleParking;
